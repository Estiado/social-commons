/** One bound leaf. Integrating the tangent preserves material length while its bend
 * travels from the fore-edge towards the hinge; the book block never moves. */
export const LEAF_COLUMNS = 72;
export const LEAF_ROWS = 12;
export type LeafContour = { top: Float32Array; bottom: Float32Array };
export function leafMesh(progress: number, front?: LeafContour, back?: LeafContour) {
  const t = Math.max(0, Math.min(1, progress));
  const turn = t * Math.PI;
  const bend = Math.sin(turn);
  const vertices = new Float32Array((LEAF_COLUMNS + 1) * (LEAF_ROWS + 1) * 8);
  for (let row = 0; row <= LEAF_ROWS; row++) {
    const v = row / LEAF_ROWS;
    let x = 0,
      z = 0;
    const angle = (u: number) => turn + bend * (0.68 * (2 * u - 1) + 0.22 * (v - 0.5) * u);
    for (let col = 0; col <= LEAF_COLUMNS; col++) {
      const u = col / LEAF_COLUMNS;
      if (col) {
        const a = angle(u - 0.5 / LEAF_COLUMNS);
        x += Math.cos(a) / LEAF_COLUMNS;
        z += Math.sin(a) / LEAF_COLUMNS;
      }
      const a = angle(u);
      const blend = t * t * (3 - 2 * t);
      const top = front
        ? front.top[col] * (1 - blend) + (back?.top[col] ?? front.top[col]) * blend
        : 0;
      const bottom = front
        ? front.bottom[col] * (1 - blend) + (back?.bottom[col] ?? front.bottom[col]) * blend
        : 1;
      vertices.set(
        [x, top + (bottom - top) * v, z, -Math.sin(a), 0, Math.cos(a), u, v],
        (row * (LEAF_COLUMNS + 1) + col) * 8,
      );
    }
  }
  return vertices;
}
export function leafIndices() {
  const indices = new Uint16Array(LEAF_COLUMNS * LEAF_ROWS * 6);
  let at = 0;
  for (let row = 0; row < LEAF_ROWS; row++)
    for (let col = 0; col < LEAF_COLUMNS; col++) {
      const a = row * (LEAF_COLUMNS + 1) + col,
        b = a + LEAF_COLUMNS + 1;
      indices.set([a, b, a + 1, a + 1, b, b + 1], at);
      at += 6;
    }
  return indices;
}
