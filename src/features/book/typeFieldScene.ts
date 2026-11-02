import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { advanceLift, TYPE_MOTION } from './typeMotion';
import { boundaryAt } from './typeBoundary';
import { edgeResponse } from './typeFieldEdge';
import { blendTypeIntoPaper, createPaperUniforms } from './typePaperMaterial';

export interface TypeFieldScene {
  capture(): HTMLCanvasElement;
  pause(): void;
  resume(): void;
  point(x: number, y: number): void;
  leave(): void;
  dispose(): void;
  inspect(): {
    count: number;
    active: number;
    visible: number;
    edgeActive: number;
    maxEdgeLift: number;
    edgeSamples: Array<{ index: number; x: number; y: number; lift: number; limit: number }>;
    maxLift: number;
    paused: boolean;
    framePending: boolean;
    disposed: boolean;
  };
}

export async function createTypeFieldScene(
  canvas: HTMLCanvasElement,
  active: () => boolean = () => true,
): Promise<TypeFieldScene> {
  const scene = new THREE.Scene();
  const paperUniforms = createPaperUniforms();
  const camera = new THREE.PerspectiveCamera(47, 1, 0.1, 140);
  camera.position.set(0, 9, 11);
  camera.lookAt(0, 0, 4);
  const resources: Array<{ dispose(): void }> = [];
  const loader = new THREE.TextureLoader();
  const results = await Promise.allSettled([
    loader.loadAsync('/type-study/materials/wood-matte.webp'),
    loader.loadAsync('/type-study/materials/wood-normal.jpg'),
    loader.loadAsync('/type-study/materials/qianziwen-type-atlas.webp'),
    loader.loadAsync('/type-study/materials/qianziwen-type-height.webp'),
  ]);
  if (!active() || results.some((r) => r.status === 'rejected')) {
    for (const r of results) if (r.status === 'fulfilled') r.value.dispose();

    throw new Error('Type field material unavailable');
  }
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.35));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.98;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  resources.push(renderer);
  const [wood, normal, atlas, height] = results.map(
    (r) => (r as PromiseFulfilledResult<THREE.Texture>).value,
  );
  resources.push(wood, normal, atlas, height);
  wood.colorSpace = atlas.colorSpace = THREE.SRGBColorSpace;
  wood.wrapS = wood.wrapT = normal.wrapS = normal.wrapT = THREE.RepeatWrapping;
  atlas.anisotropy = height.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const bodyMaterial = new THREE.MeshStandardMaterial({
    map: wood,
    normalMap: normal,
    normalScale: new THREE.Vector2(0.65, 0.65),
    color: '#95836d',
    emissive: '#493522',
    emissiveIntensity: 0.18,
    roughness: 0.98,
  });
  const faceMaterial = new THREE.MeshStandardMaterial({
    map: atlas,
    bumpMap: height,
    bumpScale: 0.13,
    color: '#d8c4a4',
    roughness: 0.96,
  });
  blendTypeIntoPaper(bodyMaterial, paperUniforms);
  blendTypeIntoPaper(faceMaterial, paperUniforms, true);
  resources.push(bodyMaterial, faceMaterial);
  const columns = 40,
    rows = 25,
    count = columns * rows;
  // Fixed longer sorts remain seated below the bed even at the largest lift.
  const bodyHeight = 3.6;
  const bodyGeometry = new RoundedBoxGeometry(0.99, bodyHeight, 1.11, 1, 0.025);
  const faceGeometry = new THREE.PlaneGeometry(0.96, 0.99);
  faceGeometry.rotateX(-Math.PI / 2);
  const paperDepths = new Float32Array(count);
  const paperAttribute = new THREE.InstancedBufferAttribute(paperDepths, 1);
  bodyGeometry.setAttribute('paperDepth', paperAttribute);
  faceGeometry.setAttribute('paperDepth', paperAttribute);
  const tiles = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    tiles[i * 2] = i % 32;
    tiles[i * 2 + 1] = 31 - Math.floor(i / 32);
  }
  const tileAttribute = new THREE.InstancedBufferAttribute(tiles, 2);
  faceGeometry.setAttribute('typeTile', tileAttribute);
  const bodies = new THREE.InstancedMesh(bodyGeometry, bodyMaterial, count),
    faces = new THREE.InstancedMesh(faceGeometry, faceMaterial, count);
  bodies.castShadow = bodies.receiveShadow = true;
  faces.receiveShadow = true;
  bodies.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  faces.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  bodies.frustumCulled = faces.frustumCulled = false;
  scene.add(bodies, faces);
  resources.push(bodyGeometry, faceGeometry, bodies, faces);
  const visibleIndices: number[] = [];
  const limits = new Float32Array(count),
    depths = new Float32Array(count);
  const projected = Array.from({ length: count }, () => ({ x: 0, y: 0 }));
  const lifts = new Float32Array(count),
    base = new Float32Array(count),
    targets = new Float32Array(count);
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  // A few resting high sorts preserve the supplied composition; movement never scales their bodies.
  for (const [c, r, h] of [
    [14, 14, 0.8],
    [18, 16, 0.99],
    [21, 13, 0.99],
    [24, 16, 0.7],
    [27, 14, 0.6],
    [20, 19, 0.55],
  ])
    base[c * rows + r] = h;
  const restPose = base.slice();
  for (let i = 0; i < count; i++) {
    color.setHSL(0.085, 0.18, 0.67 + ((i * 37) % 11) / 70);
    bodies.setColorAt(i, color);
    lifts[i] = targets[i] = base[i];
  }
  function position(i: number) {
    return {
      x: (Math.floor(i / rows) - (columns - 1) / 2) * 1.04,
      z: ((i % rows) - (rows - 1) / 2) * 1.16,
    };
  }
  function updateMatrices() {
    for (let slot = 0; slot < visibleIndices.length; slot++) {
      const i = visibleIndices[slot],
        p = position(i);
      dummy.position.set(p.x, -bodyHeight / 2 - 0.01 + lifts[i], p.z);
      dummy.rotation.set(0, Math.sin(i * 3.7) * 0.012, 0);
      dummy.updateMatrix();
      bodies.setMatrixAt(slot, dummy.matrix);
      dummy.position.y = 0.007 + lifts[i];
      dummy.updateMatrix();
      faces.setMatrixAt(slot, dummy.matrix);
    }
    bodies.instanceMatrix.needsUpdate = faces.instanceMatrix.needsUpdate = true;
  }
  // Individual static bed tiles follow the occupied sorts, never an infinite rectangle.
  const groundGeometry = new THREE.PlaneGeometry(1.04, 1.16),
    groundMaterial = new THREE.MeshStandardMaterial({
      color: '#59432e',
      roughness: 1,
      emissive: '#352719',
      emissiveIntensity: 0.12,
    });
  groundGeometry.rotateX(-Math.PI / 2);
  groundGeometry.setAttribute('paperDepth', paperAttribute);
  blendTypeIntoPaper(groundMaterial, paperUniforms);
  const ground = new THREE.InstancedMesh(groundGeometry, groundMaterial, count);
  ground.frustumCulled = false;
  ground.receiveShadow = true;
  scene.add(ground);
  resources.push(groundGeometry, groundMaterial, ground);
  scene.add(new THREE.HemisphereLight('#fff1d5', '#48382b', 2.7));
  const sun = new THREE.DirectionalLight('#f0d4ad', 2.6);
  sun.position.set(-12, 24, 12);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -28;
  sun.shadow.camera.right = 28;
  sun.shadow.camera.top = 24;
  sun.shadow.camera.bottom = -24;
  sun.shadow.normalBias = 0.025;
  sun.shadow.bias = -0.0002;
  scene.add(sun);
  const raycaster = new THREE.Raycaster(),
    plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    hit = new THREE.Vector3();
  let frame = 0,
    last = 0,
    paused = false,
    visible = true,
    disposed = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function draw() {
    updateMatrices();
    renderer.render(scene, camera);
  }
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
  }
  function tick(time: number) {
    frame = 0;
    if (disposed || paused || !visible || document.hidden || reduced.matches) return;
    const dt = last ? Math.min(0.05, (time - last) / 1000) : 1 / 60;
    last = time;
    let changing = false;
    for (let i = 0; i < count; i++) {
      const next = advanceLift(lifts[i], targets[i], dt);
      if (Math.abs(next - targets[i]) > 0.001) changing = true;
      lifts[i] = next;
    }
    draw();
    if (changing) frame = requestAnimationFrame(tick);
    else last = 0;
  }
  function resume() {
    if (!disposed && !frame && !paused && visible && !document.hidden && !reduced.matches)
      frame = requestAnimationFrame(tick);
  }
  function leave() {
    targets.set(base);
    resume();
  }
  function point(x: number, y: number) {
    if (disposed || paused || reduced.matches) return;
    raycaster.setFromCamera(new THREE.Vector2(x * 2 - 1, 1 - y * 2), camera);
    if (!raycaster.ray.intersectPlane(plane, hit)) return;
    for (let i = 0; i < count; i++) {
      const p = position(i),
        distance = Math.hypot(p.x - hit.x, p.z - hit.z);
      const influence = limits[i] ? Math.max(0, 1 - distance / TYPE_MOTION.radius) : 0;
      targets[i] = Math.max(base[i], Math.pow(influence, 1.5) * limits[i]);
    }
    resume();
  }
  function preference() {
    stop();
    if (reduced.matches) {
      lifts.set(base);
      targets.set(base);
      draw();
    } else resume();
  }
  function relayout() {
    if (disposed) return;
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
    camera.aspect = rect.width / Math.max(1, rect.height);
    camera.fov = innerWidth <= 700 ? 61 : 47;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    const paperRect = canvas.closest('.book-contents')!.getBoundingClientRect();
    paperUniforms.uPaperFrame.value.set(
      rect.top - paperRect.top,
      rect.height,
      paperRect.height,
      canvas.height,
    );
    visibleIndices.length = 0;
    for (let i = 0; i < count; i++) {
      const p = position(i);
      const center = new THREE.Vector3(p.x, 0, p.z).project(camera);
      const nextRow = new THREE.Vector3(p.x, 0, p.z + 1.16).project(camera);
      const x = (center.x + 1) / 2,
        y = (1 - center.y) / 2;
      const rowHeight = Math.max(0.002, Math.abs(nextRow.y - center.y) / 2);
      const depth = (y - boundaryAt(x)) / rowHeight;
      const response = edgeResponse(depth);
      depths[i] = depth;
      projected[i] = { x, y };
      limits[i] = response.maxLift;
      base[i] = response.visible ? Math.min(restPose[i], limits[i] * 0.55) : 0;
      targets[i] = lifts[i] = base[i];
      if (!response.visible) continue;
      const slot = visibleIndices.length;
      visibleIndices.push(i);
      paperDepths[slot] = depth;
      tiles[slot * 2] = i % 32;
      tiles[slot * 2 + 1] = 31 - Math.floor(i / 32);
      color.setHSL(0.085, 0.18, 0.67 + ((i * 37) % 11) / 70);
      bodies.setColorAt(slot, color);
      dummy.position.set(p.x, -1.6, p.z);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      ground.setMatrixAt(slot, dummy.matrix);
    }
    bodies.count = faces.count = ground.count = visibleIndices.length;
    paperAttribute.needsUpdate =
      tileAttribute.needsUpdate =
      ground.instanceMatrix.needsUpdate =
        true;
    if (bodies.instanceColor) bodies.instanceColor.needsUpdate = true;

    draw();
  }
  const resize = new ResizeObserver(relayout);
  resize.observe(canvas);
  relayout();
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) resume();
    else stop();
  });
  intersection.observe(canvas);
  const visibility = () => {
    if (document.hidden) stop();
    else resume();
  };
  document.addEventListener('visibilitychange', visibility);
  reduced.addEventListener('change', preference);
  updateMatrices();
  draw();
  return {
    capture() {
      draw();
      const copy = document.createElement('canvas');
      copy.width = canvas.width;
      copy.height = canvas.height;
      copy.getContext('2d')!.drawImage(canvas, 0, 0);
      return copy;
    },
    pause() {
      paused = true;
      stop();
    },
    resume() {
      paused = false;
      resume();
    },
    point,
    leave,
    inspect() {
      return {
        count,
        active: visibleIndices.filter((i) => Math.abs(lifts[i] - base[i]) > 0.005).length,
        visible: visibleIndices.length,
        edgeActive: visibleIndices.filter(
          (i) => depths[i] < 1 && Math.abs(lifts[i] - base[i]) > 0.005,
        ).length,
        maxEdgeLift: Math.max(
          0,
          ...visibleIndices.filter((i) => depths[i] < 1).map((i) => lifts[i] - base[i]),
        ),
        edgeSamples: visibleIndices
          .filter(
            (i) =>
              depths[i] < 1 &&
              projected[i].x >= 0 &&
              projected[i].x <= 1 &&
              projected[i].y >= 0 &&
              projected[i].y <= 1,
          )
          .map((i) => ({ index: i, ...projected[i], lift: lifts[i] - base[i], limit: limits[i] })),
        maxLift: Math.max(...lifts),
        paused,
        framePending: !!frame,
        disposed,
      };
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      stop();
      resize.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      reduced.removeEventListener('change', preference);
      sun.shadow.map?.dispose();
      for (const r of resources) r.dispose();
    },
  };
}
