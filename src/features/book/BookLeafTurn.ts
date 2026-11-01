import { leafIndices, leafMesh, LEAF_COLUMNS, type LeafContour } from './leafGeometry';
type Snapshot = HTMLCanvasElement & { inkLayer?: HTMLCanvasElement };

const vertex = `precision highp float;attribute vec3 position;attribute vec3 normal;attribute vec2 uv;
uniform float mode;uniform float direction;uniform vec4 pageFrame;uniform vec2 shadowOffset;
varying vec2 vUv;varying vec3 vNormal;varying float vSampleY;
void main(){vUv=uv;vNormal=normal;vSampleY=position.y;
 if(mode<1.5){gl_Position=vec4(position.xy,0.,1.);return;}
 float lift=position.z;vec2 point;
 if(mode<2.5){point=vec2(position.x-lift*.32*direction,position.y+lift*.09)+shadowOffset;}
 else{float foreshorten=1./(1.+lift*.12);point=vec2(position.x*foreshorten,(position.y-.5)*foreshorten+.5-lift*.08);}
 gl_Position=vec4(pageFrame.x+point.x*pageFrame.z,pageFrame.y-point.y*pageFrame.w,-lift*.5,1.);
}`;
const fragment = `precision highp float;
uniform sampler2D source;uniform sampler2D destination;uniform sampler2D silhouette;
uniform sampler2D sourceInk;uniform sampler2D destinationInk;uniform sampler2D paperTexture;
uniform float mode;uniform float progress;uniform float bookMode;uniform float boundary;uniform float direction;
uniform vec4 frontUv;uniform vec4 backUv;uniform vec4 maskBounds;uniform vec2 resolution;
varying vec2 vUv;varying vec3 vNormal;varying float vSampleY;
void main(){
 if(mode<.5){
   if(bookMode<.5){float outInk=1.-smoothstep(0.,.43,progress);float inInk=smoothstep(.57,1.,progress);
     vec3 paper=vec3(.953,.941,.91);gl_FragColor=vec4(mix(mix(paper,texture2D(source,vUv).rgb,outInk),texture2D(destination,vUv).rgb,inInk),1.);return;}
   gl_FragColor=texture2D(destination,vUv);return;
 }
 if(mode<1.5){if((direction>0.&&vUv.x>boundary)||(direction<0.&&vUv.x<boundary))discard;gl_FragColor=texture2D(source,vUv);return;}
 if(mode<2.5){
   vec2 screen=vec2(gl_FragCoord.x/resolution.x,1.-gl_FragCoord.y/resolution.y);
   vec2 mu=(screen-maskBounds.xy)/maskBounds.zw;
   if(min(mu.x,mu.y)<0.||max(mu.x,mu.y)>1.)discard;
   float edge=smoothstep(0.,.06,min(vUv.x,1.-vUv.x))*smoothstep(0.,.035,min(vUv.y,1.-vUv.y));
   gl_FragColor=vec4(.19,.16,.12,edge*.018*sin(progress*3.14159265)*texture2D(silhouette,mu).a);return;
 }
 bool front=gl_FrontFacing==(direction>0.);
 vec2 sampleUv=front ? frontUv.xy+vec2(direction>0.?vUv.x:1.-vUv.x,vSampleY)*frontUv.zw : backUv.xy+vec2(direction>0.?1.-vUv.x:vUv.x,vSampleY)*backUv.zw;
 vec4 ink=front ? texture2D(sourceInk,sampleUv) : texture2D(destinationInk,sampleUv);
 vec3 repaired=texture2D(paperTexture,vec2(vUv.x,vSampleY)).rgb;
 vec3 photographed=texture2D(silhouette,(sampleUv-maskBounds.xy)/maskBounds.zw).rgb;
 // Match the fixed page's actual stains and illumination, replacing only dark binding pixels.
 float face=smoothstep(0.,.04,min(vUv.x,1.-vUv.x))*(1.-smoothstep(.86,.98,vUv.y));
 vec3 paper=mix(repaired,photographed,face*smoothstep(.35,.6,dot(photographed,vec3(.299,.587,.114))));
 vec3 printed=mix(paper,paper*ink.rgb,ink.a);
 vec3 n=normalize(front?vNormal:-vNormal);n.x*=direction;
 float shade=.86+.14*max(0.,dot(n,normalize(vec3(-.35,-.2,1.))));
 float edge=smoothstep(0.,.003,min(vUv.y,1.-vUv.y));
 gl_FragColor=vec4(printed*shade,edge);
}`;

/** Public catalogue leaf: a fixed photographed book with one moving bound sheet.
 * Reader/home round trips pass through paper, so old and new paragraphs never crossfade. */
export function createBookLeafTurn(
  frame: HTMLElement,
  source: Snapshot,
  bounds: DOMRect,
  direction: number,
  mask?: { image: HTMLImageElement; bounds: DOMRect },
) {
  const canvas = document.createElement('canvas');
  canvas.className = 'book-paper-canvas';
  canvas.width = source.width;
  canvas.height = source.height;
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: true,
    powerPreference: 'low-power',
  });
  if (!gl) return null;
  const shaders: WebGLShader[] = [],
    buffers: WebGLBuffer[] = [],
    textures: WebGLTexture[] = [];
  const program = gl.createProgram()!;
  let disposed = false,
    bookMode = false;
  const sourceHasInk = !!source.inkLayer;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    buffers.forEach((b) => gl.deleteBuffer(b));
    textures.forEach((t) => gl.deleteTexture(t));
    shaders.forEach((s) => gl.deleteShader(s));
    gl.deleteProgram(program);
    canvas.remove();
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
  for (const [type, code] of [
    [gl.VERTEX_SHADER, vertex],
    [gl.FRAGMENT_SHADER, fragment],
  ] as const) {
    const shader = gl.createShader(type)!;
    shaders.push(shader);
    gl.shaderSource(shader, code);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const reason = gl.getProgramInfoLog(program);
    dispose();
    throw new Error(reason || 'Leaf shader failed');
  }
  gl.useProgram(program);
  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const texture = (unit: number, pixels: HTMLCanvasElement | HTMLImageElement) => {
    const value = gl.createTexture()!;
    textures.push(value);
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, value);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    return value;
  };
  texture(0, source);
  const destination = texture(1, source);
  const silhouette = document.createElement('canvas');
  silhouette.width = mask ? 1024 : 1;
  silhouette.height = mask
    ? Math.round((1024 * mask.image.naturalHeight) / mask.image.naturalWidth)
    : 1;
  const paint = silhouette.getContext('2d')!;
  if (mask) paint.drawImage(mask.image, 0, 0, silhouette.width, silhouette.height);
  else paint.fillRect(0, 0, 1, 1);
  texture(2, silhouette);
  const empty = document.createElement('canvas');
  empty.width = empty.height = 1;
  texture(3, source.inkLayer || empty);
  const destinationInk = texture(4, empty);
  // Sample only retouched paper inside the photo, never its binding, frame or page block.
  const paper = document.createElement('canvas');
  paper.width = 512;
  paper.height = 768;
  const paperPaint = paper.getContext('2d')!;
  if (mask)
    paperPaint.drawImage(
      mask.image,
      mask.image.naturalWidth * 0.63,
      mask.image.naturalHeight * 0.24,
      mask.image.naturalWidth * 0.19,
      mask.image.naturalHeight * 0.46,
      0,
      0,
      paper.width,
      paper.height,
    );
  else {
    paperPaint.fillStyle = '#f3f0e8';
    paperPaint.fillRect(0, 0, paper.width, paper.height);
  }
  texture(5, paper);
  gl.uniform1i(uniform('source'), 0);
  gl.uniform1i(uniform('destination'), 1);
  gl.uniform1i(uniform('silhouette'), 2);
  gl.uniform1i(uniform('sourceInk'), 3);
  gl.uniform1i(uniform('destinationInk'), 4);
  gl.uniform1i(uniform('paperTexture'), 5);
  gl.uniform2f(uniform('resolution'), canvas.width, canvas.height);
  gl.uniform1f(uniform('direction'), direction);
  const photo = mask?.bounds || bounds;
  const top = photo.top,
    bottom = photo.bottom;
  const hinge = photo.left + photo.width * 0.5,
    width = photo.width * 0.4;
  const pixels = paint.getImageData(0, 0, silhouette.width, silhouette.height).data;
  const contour = (side: number): LeafContour => {
    const upper = new Float32Array(LEAF_COLUMNS + 1),
      lower = new Float32Array(LEAF_COLUMNS + 1);
    for (let col = 0; col <= LEAF_COLUMNS; col++) {
      const x = Math.max(
        0,
        Math.min(
          silhouette.width - 1,
          Math.round(silhouette.width * (0.5 + side * (0.002 + (0.398 * col) / LEAF_COLUMNS))),
        ),
      );
      let first = -1,
        last = -1;
      for (let y = 0; y < silhouette.height; y++) {
        const at = (y * silhouette.width + x) * 4;
        if (pixels[at + 3] > 230 && (pixels[at] + pixels[at + 1] + pixels[at + 2]) / 3 > 160) {
          if (first < 0) first = y;
          last = y;
        }
      }
      upper[col] = first < 0 ? 0.08 : first / silhouette.height;
      lower[col] = last < 0 ? 0.88 : Math.max(upper[col] + 0.2, (last - 3) / silhouette.height);
    }
    const smooth = (values: Float32Array) =>
      Float32Array.from(values, (_, i) => {
        const weights = [1, 3, 5, 6, 5, 3, 1];
        let sum = 0;
        for (let j = -3; j <= 3; j++)
          sum += values[Math.max(0, Math.min(values.length - 1, i + j))] * weights[j + 3];
        return sum / 24;
      });
    return { top: smooth(smooth(upper)), bottom: smooth(smooth(lower)) };
  };
  const frontContour = contour(direction),
    backContour = contour(-direction);
  const hingeTop = (frontContour.top[0] + backContour.top[0]) / 2;
  const hingeBottom = (frontContour.bottom[0] + backContour.bottom[0]) / 2;
  frontContour.top[0] = backContour.top[0] = hingeTop;
  frontContour.bottom[0] = backContour.bottom[0] = hingeBottom;
  gl.uniform4f(
    uniform('maskBounds'),
    photo.left / bounds.width,
    photo.top / bounds.height,
    photo.width / bounds.width,
    photo.height / bounds.height,
  );
  gl.uniform4f(
    uniform('pageFrame'),
    (hinge / bounds.width) * 2 - 1,
    1 - (top / bounds.height) * 2,
    ((direction * width) / bounds.width) * 2,
    ((bottom - top) / bounds.height) * 2,
  );
  gl.uniform4f(
    uniform('frontUv'),
    (hinge - (direction < 0 ? width : 0)) / bounds.width,
    top / bounds.height,
    width / bounds.width,
    (bottom - top) / bounds.height,
  );
  gl.uniform4f(
    uniform('backUv'),
    (hinge - (direction > 0 ? width : 0)) / bounds.width,
    top / bounds.height,
    width / bounds.width,
    (bottom - top) / bounds.height,
  );
  const flat = gl.createBuffer()!,
    moving = gl.createBuffer()!,
    index = gl.createBuffer()!;
  buffers.push(flat, moving, index);
  gl.bindBuffer(gl.ARRAY_BUFFER, flat);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, 1, 0, 0, 0, 1, 0, 0, -1, -1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, -1, 0, 0, 0, 1,
      1, 1,
    ]),
    gl.STATIC_DRAW,
  );
  const indices = leafIndices();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  const bind = (buffer: WebGLBuffer) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    for (const [name, size, offset] of [
      ['position', 3, 0],
      ['normal', 3, 12],
      ['uv', 2, 24],
    ] as const) {
      const at = gl.getAttribLocation(program, name);
      if (at < 0) continue;
      gl.enableVertexAttribArray(at);
      gl.vertexAttribPointer(at, size, gl.FLOAT, false, 32, offset);
    }
  };
  frame.append(canvas);
  return {
    canvas,
    dispose,
    setSheet(_rect: DOMRect) {
      /* The source photo defines the fixed book; never stretch it to another main box. */
    },
    setDestination(next: Snapshot, targetBook = false) {
      if (disposed) return;
      bookMode = !!mask && sourceHasInk && !!next.inkLayer && targetBook && innerWidth > 700;
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, destination);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, next);
      gl.activeTexture(gl.TEXTURE4);
      gl.bindTexture(gl.TEXTURE_2D, destinationInk);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, next.inkLayer || empty);
    },
    draw(progress: number) {
      if (disposed) return;
      canvas.dataset.progress = progress.toFixed(3);
      canvas.dataset.motion = bookMode ? 'bound-leaf' : 'paper-arrival';
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.953, 0.941, 0.91, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform1f(uniform('progress'), progress);
      gl.uniform1f(uniform('bookMode'), bookMode ? 1 : 0);
      bind(flat);
      gl.uniform1f(uniform('mode'), 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!bookMode) return;
      const mesh = leafMesh(progress, frontContour, backContour);
      // Preserve the old left leaf until the back of the moving page covers it.
      let edge = hinge;
      if (progress > 0.5) {
        let furthest = 0;
        for (let at = 0; at < mesh.length; at += 8) furthest = Math.min(furthest, mesh[at]);
        edge = hinge + direction * furthest * width;
      }
      gl.uniform1f(uniform('boundary'), edge / bounds.width);
      gl.uniform1f(uniform('mode'), 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      bind(moving);
      gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.DYNAMIC_DRAW);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.uniform1f(uniform('mode'), 2);
      for (let i = 0; i < 9; i++) {
        const a = (i * Math.PI * 2) / 8;
        gl.uniform2f(uniform('shadowOffset'), Math.cos(a) * 0.022, Math.sin(a) * 0.014);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      }
      gl.uniform2f(uniform('shadowOffset'), 0, 0);
      gl.uniform1f(uniform('mode'), 3);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);
    },
  };
}
