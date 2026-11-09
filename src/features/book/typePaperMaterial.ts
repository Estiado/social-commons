import * as THREE from 'three';
import { TYPE_EDGE } from './typeFieldEdge';
import { TYPE_PAPER_STOPS } from './typePaper';

export function createPaperUniforms() {
  return {
    uTypeEdge: { value: new THREE.Vector2(TYPE_EDGE.rows, TYPE_EDGE.strength) },
    uPaperColors: {
      // Blend after output conversion: these are CSS sRGB components, not linear colors.
      value: TYPE_PAPER_STOPS.map(
        ({ color }) =>
          new THREE.Vector3(
            parseInt(color.slice(1, 3), 16) / 255,
            parseInt(color.slice(3, 5), 16) / 255,
            parseInt(color.slice(5, 7), 16) / 255,
          ),
      ),
    },
    uPaperStops: { value: TYPE_PAPER_STOPS.map(({ offset }) => offset) },
    // Canvas offset, CSS canvas height, paper height, drawing-buffer height.
    uPaperFrame: { value: new THREE.Vector4(0, 1, 1, 1) },
  };
}

export function blendTypeIntoPaper(
  material: THREE.MeshStandardMaterial,
  uniforms: ReturnType<typeof createPaperUniforms>,
  atlas = false,
) {
  material.customProgramCacheKey = () => `type-paper-solid-v1-${atlas}`;
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader =
      'attribute float paperDepth;\nvarying float vPaperDepth;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      '#include <begin_vertex>\nvPaperDepth=paperDepth+position.z/1.16;',
    );
    if (atlas) {
      shader.vertexShader = 'attribute vec2 typeTile;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <uv_vertex>',
        '#include <uv_vertex>\nvMapUv=(vMapUv*.98+.01+typeTile)/32.;\nvBumpMapUv=(vBumpMapUv*.98+.01+typeTile)/32.;',
      );
    }
    shader.fragmentShader =
      'varying float vPaperDepth;\nuniform vec3 uPaperColors[5];\nuniform float uPaperStops[5];\nuniform vec4 uPaperFrame;\nuniform vec2 uTypeEdge;\n' +
      shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <colorspace_fragment>',
      `
      #include <colorspace_fragment>
      float paperY = clamp((uPaperFrame.x + (1.0 - gl_FragCoord.y / uPaperFrame.w) * uPaperFrame.y) / uPaperFrame.z, 0.0, 1.0);
      vec3 paperColor = uPaperColors[0];
      for (int i = 1; i < 5; i++) {
        float paperT = clamp((paperY-uPaperStops[i-1])/(uPaperStops[i]-uPaperStops[i-1]), 0.0, 1.0);
        paperColor = mix(paperColor, uPaperColors[i], paperT);
      }
      // Opaque whole sorts retain depth ordering; no translucent-instance sorting artifacts.
      float paperStrength = uTypeEdge.y + (1.0-uTypeEdge.y) * smoothstep(0.0, uTypeEdge.x, vPaperDepth);
      gl_FragColor.rgb = mix(paperColor, gl_FragColor.rgb, paperStrength);
    `,
    );
  };
}
