/** Independently authored inextensible strip model. Angles are integrated along the paper,
 * so the page bends continuously instead of rotating a few rigid DOM panels. */
export const PAPER_COLUMNS = 88;
export const PAPER_ROWS = 16;

export function paperMesh(progress: number, aspect: number, direction = 1) {
  const t = Math.max(0, Math.min(1, progress));
  const wave = Math.sin(Math.PI * t);
  const positions = new Float32Array((PAPER_COLUMNS + 1) * (PAPER_ROWS + 1) * 8);
  for (let row = 0; row <= PAPER_ROWS; row++) {
    const v = row / PAPER_ROWS;
    let x = 0;
    let z = 0;
    for (let column = 0; column <= PAPER_COLUMNS; column++) {
      const u = column / PAPER_COLUMNS;
      const angleAt = (s: number) =>
        Math.PI * t + wave * (0.78 * Math.sin(Math.PI * s) - 0.32 + 0.22 * (v - 0.5) * s * s);
      if (column) {
        const angle = angleAt((column - 0.5) / PAPER_COLUMNS);
        x += Math.cos(angle) / PAPER_COLUMNS;
        z += Math.sin(angle) / PAPER_COLUMNS;
      }
      const angle = angleAt(u);
      const offset = (row * (PAPER_COLUMNS + 1) + column) * 8;
      positions.set(
        [
          direction * x,
          (0.5 - v) * aspect,
          z,
          -direction * Math.sin(angle),
          0,
          Math.cos(angle),
          u,
          v,
        ],
        offset,
      );
    }
  }
  return positions;
}

export function paperIndices() {
  const indices: number[] = [];
  for (let row = 0; row < PAPER_ROWS; row++) {
    for (let col = 0; col < PAPER_COLUMNS; col++) {
      const a = row * (PAPER_COLUMNS + 1) + col;
      const b = a + PAPER_COLUMNS + 1;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  return new Uint16Array(indices);
}
