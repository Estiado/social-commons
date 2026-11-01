// The WebGL owner binds its own program and buffers before producing a presentation snapshot.
// Callers must never issue blind drawArrays calls against another component's context.
const owners = new WeakMap<HTMLCanvasElement, () => HTMLCanvasElement | null>();
export function registerMistSnapshot(
  canvas: HTMLCanvasElement,
  capture: () => HTMLCanvasElement | null,
) {
  owners.set(canvas, capture);
  return () => {
    owners.delete(canvas);
  };
}
export function captureMist(canvas: HTMLCanvasElement) {
  return owners.get(canvas)?.() ?? null;
}
