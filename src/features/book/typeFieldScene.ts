import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { advanceLift, TYPE_MOTION } from './typeMotion';
import { boundaryAt } from './typeBoundary';

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
  scene.background = new THREE.Color('#483528');
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
    alpha: false,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance',
  });
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
  faceMaterial.onBeforeCompile = (shader) => {
    shader.vertexShader = 'attribute vec2 typeTile;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <uv_vertex>',
      '#include <uv_vertex>\nvMapUv=(vMapUv*.98+.01+typeTile)/32.;\nvBumpMapUv=(vBumpMapUv*.98+.01+typeTile)/32.;',
    );
  };
  resources.push(bodyMaterial, faceMaterial);
  const columns = 40,
    rows = 25,
    count = columns * rows;
  // Fixed longer sorts remain seated below the bed even at the largest lift.
  const bodyHeight = 3.6;
  const bodyGeometry = new RoundedBoxGeometry(0.99, bodyHeight, 1.11, 1, 0.025);
  const faceGeometry = new THREE.PlaneGeometry(0.96, 0.99);
  faceGeometry.rotateX(-Math.PI / 2);
  const tiles = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    tiles[i * 2] = i % 32;
    tiles[i * 2 + 1] = 31 - Math.floor(i / 32);
  }
  faceGeometry.setAttribute('typeTile', new THREE.InstancedBufferAttribute(tiles, 2));
  const bodies = new THREE.InstancedMesh(bodyGeometry, bodyMaterial, count),
    faces = new THREE.InstancedMesh(faceGeometry, faceMaterial, count);
  bodies.castShadow = bodies.receiveShadow = true;
  faces.receiveShadow = true;
  bodies.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  faces.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  bodies.frustumCulled = faces.frustumCulled = false;
  scene.add(bodies, faces);
  resources.push(bodyGeometry, faceGeometry, bodies, faces);
  const locked = new Uint8Array(count);
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
    for (let i = 0; i < count; i++) {
      const p = position(i);
      dummy.position.set(p.x, -bodyHeight / 2 - 0.01 + lifts[i], p.z);
      dummy.rotation.set(0, Math.sin(i * 3.7) * 0.012, 0);
      dummy.updateMatrix();
      bodies.setMatrixAt(i, dummy.matrix);
      dummy.position.y = 0.007 + lifts[i];
      dummy.updateMatrix();
      faces.setMatrixAt(i, dummy.matrix);
    }
    bodies.instanceMatrix.needsUpdate = faces.instanceMatrix.needsUpdate = true;
  }
  const groundGeometry = new THREE.PlaneGeometry(200, 200),
    groundMaterial = new THREE.MeshStandardMaterial({
      color: '#59432e',
      roughness: 1,
      emissive: '#352719',
      emissiveIntensity: 0.12,
    });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.6;
  ground.receiveShadow = true;
  scene.add(ground);
  resources.push(groundGeometry, groundMaterial);
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
      const border = i % rows < 2 ? 0 : Math.min(1, ((i % rows) - 1) / 2);
      const influence = locked[i] ? 0 : Math.max(0, 1 - distance / TYPE_MOTION.radius);
      targets[i] = Math.max(base[i], Math.pow(influence, 1.5) * TYPE_MOTION.maxLift * border);
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
  const resize = new ResizeObserver(() => {
    if (disposed) return;
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height), false);
    camera.aspect = rect.width / Math.max(1, rect.height);
    camera.fov = innerWidth <= 700 ? 61 : 47;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    for (let i = 0; i < count; i++) {
      const p = position(i);
      const upper = new THREE.Vector3(p.x, TYPE_MOTION.maxLift, p.z - 1.16).project(camera);
      const x = (upper.x + 1) / 2,
        y = (1 - upper.y) / 2;
      locked[i] = y < boundaryAt(x) ? 1 : 0;
      base[i] = locked[i] ? 0 : restPose[i];
      targets[i] = lifts[i] = base[i];
    }

    draw();
  });
  resize.observe(canvas);
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
        active: Array.from(lifts).filter((h, i) => Math.abs(h - base[i]) > 0.005).length,
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
