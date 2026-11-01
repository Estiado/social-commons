/** Paperlab roll/unroll math, adapted from Noor Mtir's Apache-2.0 source at
 * 41914833cb9ae12b32a8cbbdee4723f5b12158af. LICENSE and NOTICE: public/book/licenses/.
 * Modifications: normalized horizontal route sheet, two-sided normals, bounded tessellation.
 * Source: packages/paperlab/src/deformers/roll.ts and behaviors/unroll.ts. */
export const ROLL_COLUMNS = 256;
export const ROLL_ROWS = 2;
export function windAngle(s: number, radius: number, k: number) {
  if (k <= 0) return s / radius;
  const floor = radius * 0.08;
  const thetaFloor = (radius - floor) / k;
  const lengthFloor = radius * thetaFloor - (k * thetaFloor * thetaFloor) / 2;
  if (s >= lengthFloor) return thetaFloor + (s - lengthFloor) / floor;
  return (2 * s) / (radius + Math.sqrt(radius * radius - 2 * k * s));
}
export function rollPoint(d: number, progress: number) {
  const t = Math.max(0, Math.min(1, progress));
  const boundary = 1 - t * 2.48;
  const thickness = 0.045;
  const radius = Math.sqrt(0.055 ** 2 + (Math.max(0, 1 - boundary) * thickness) / Math.PI);
  const s = d - boundary;
  if (s <= 0) return { x: d, z: 0 };
  const theta = windAngle(s, radius, thickness / (2 * Math.PI));
  const r = Math.max(radius - (thickness * theta) / (2 * Math.PI), radius * 0.08);
  return { x: boundary + r * Math.sin(theta), z: radius - r * Math.cos(theta) };
}
export function rollMesh(progress: number, aspect: number, direction = 1) {
  const vertices = new Float32Array((ROLL_COLUMNS + 1) * (ROLL_ROWS + 1) * 8);
  for (let row = 0; row <= ROLL_ROWS; row++) {
    const u = row / ROLL_ROWS;
    for (let col = 0; col <= ROLL_COLUMNS; col++) {
      const v = col / ROLL_COLUMNS;
      const d = v * 2 - 1;
      const p = rollPoint(d, progress),
        next = rollPoint(d + 0.0001, progress);
      const dx = next.x - p.x,
        dz = next.z - p.z;
      const length = Math.hypot(dx, dz) || 1;
      vertices.set(
        [
          (u - 0.5) * 2,
          -direction * p.x * aspect,
          p.z * aspect,
          0,
          (direction * dz) / length,
          dx / length,
          u,
          direction > 0 ? v : 1 - v,
        ],
        (row * (ROLL_COLUMNS + 1) + col) * 8,
      );
    }
  }
  return vertices;
}
export function rollIndices() {
  const result: number[] = [];
  for (let row = 0; row < ROLL_ROWS; row++)
    for (let col = 0; col < ROLL_COLUMNS; col++) {
      const a = row * (ROLL_COLUMNS + 1) + col,
        b = a + ROLL_COLUMNS + 1;
      result.push(a, a + 1, b, a + 1, b + 1, b);
    }
  return new Uint16Array(result);
}
