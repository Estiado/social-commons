import assert from 'node:assert/strict';
import test from 'node:test';
import { PAPER_COLUMNS, PAPER_ROWS, paperMesh } from '../src/features/book/paperMesh.ts';

test('a curved sheet conserves arc length instead of stretching into rigid panels', () => {
  for (const progress of [0.08, 0.3, 0.5, 0.76, 0.96]) {
    const mesh = paperMesh(progress, 1.2);
    for (let row = 0; row <= PAPER_ROWS; row++) {
      let length = 0;
      for (let column = 1; column <= PAPER_COLUMNS; column++) {
        const n = (row * (PAPER_COLUMNS + 1) + column) * 8;
        length += Math.hypot(mesh[n] - mesh[n - 8], mesh[n + 2] - mesh[n - 6]);
      }
      assert.ok(Math.abs(length - 1) < 0.00001);
    }
  }
});

test('both directions start and end flat at the spine with no displacement jump', () => {
  for (const direction of [-1, 1]) {
    for (const progress of [0, 1]) {
      const mesh = paperMesh(progress, 2, direction);
      assert.ok(Math.abs(mesh[0]) < 0.000001);
      assert.equal(mesh[2], 0);
      assert.ok(
        Math.abs(mesh[PAPER_COLUMNS * 8] - direction * (progress === 0 ? 1 : -1)) < 0.00001,
      );
      assert.ok(Math.abs(mesh[PAPER_COLUMNS * 8 + 2]) < 0.00001);
    }
  }
});

test('mid-turn is a curved surface with finite positions and normalized lighting normals', () => {
  const mesh = paperMesh(0.46, 1.4);
  assert.ok(
    Math.hypot(mesh[3] - mesh[PAPER_COLUMNS * 4 + 3], mesh[5] - mesh[PAPER_COLUMNS * 4 + 5]) > 0.3,
  );
  for (let i = 0; i < mesh.length; i += 8) {
    assert.ok([...mesh.slice(i, i + 8)].every(Number.isFinite));
    assert.ok(Math.abs(Math.hypot(mesh[i + 3], mesh[i + 4], mesh[i + 5]) - 1) < 0.00001);
    assert.ok(mesh[i + 2] >= -0.001);
  }
});
