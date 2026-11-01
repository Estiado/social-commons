import assert from 'node:assert/strict';
import test from 'node:test';
import {
  leafMesh,
  leafIndices,
  LEAF_COLUMNS,
  LEAF_ROWS,
} from '../src/features/book/leafGeometry.ts';
import { createCloudMass } from '../src/features/book/cloudMass.ts';

test('the bound leaf keeps its material length as its bend travels', () => {
  for (const t of [0, 0.15, 0.4, 0.65, 0.85, 1]) {
    const mesh = leafMesh(t);
    for (let row = 0; row <= LEAF_ROWS; row++) {
      let length = 0;
      for (let col = 1; col <= LEAF_COLUMNS; col++) {
        const at = (row * (LEAF_COLUMNS + 1) + col) * 8;
        length += Math.hypot(mesh[at] - mesh[at - 8], mesh[at + 2] - mesh[at - 6]);
      }
      assert.ok(Math.abs(length - 1) < 0.00001);
    }
  }
});
test('the hinge stays fixed while a single page lands on the opposite side', () => {
  for (const t of [0, 0.3, 0.7, 1]) {
    const mesh = leafMesh(t);
    for (let row = 0; row <= LEAF_ROWS; row++) {
      const at = row * (LEAF_COLUMNS + 1) * 8;
      assert.equal(mesh[at], 0);
      assert.equal(mesh[at + 2], 0);
    }
  }
  for (const t of [0, 1]) {
    const mesh = leafMesh(t);
    for (let at = 0; at < mesh.length; at += 8) {
      assert.ok(Math.abs(mesh[at] - (t ? -1 : 1) * mesh[at + 6]) < 0.00001);
      assert.ok(Math.abs(mesh[at + 2]) < 0.00001);
    }
  }
});
test('curled page normals, UVs and triangle indices remain valid', () => {
  const indices = leafIndices();
  assert.equal(indices.length, LEAF_COLUMNS * LEAF_ROWS * 6);
  assert.ok(Math.max(...indices) < (LEAF_COLUMNS + 1) * (LEAF_ROWS + 1));
  for (const t of [-1, 0.2, 0.5, 0.8, 2]) {
    const mesh = leafMesh(t);
    for (let at = 0; at < mesh.length; at += 8) {
      assert.ok([...mesh.slice(at, at + 8)].every(Number.isFinite));
      assert.ok(Math.abs(Math.hypot(mesh[at + 3], mesh[at + 5]) - 1) < 0.00001);
      assert.ok(mesh[at + 6] >= 0 && mesh[at + 6] <= 1);
    }
  }
});
test('photographic contours keep a shared hinge and ordered page rows', () => {
  const top = Float32Array.from(
    { length: LEAF_COLUMNS + 1 },
    (_, i) => 0.08 + 0.025 * Math.sin((i / LEAF_COLUMNS) * Math.PI),
  );
  const bottom = Float32Array.from(top, (v) => 0.96 - v * 0.2);
  const front = { top, bottom },
    back = {
      top: Float32Array.from(top, (v, i) => (i ? v * 0.85 : v)),
      bottom: Float32Array.from(bottom, (v, i) => (i ? v - 0.01 : v)),
    };
  for (const t of [0, 0.25, 0.5, 0.75, 1]) {
    const mesh = leafMesh(t, front, back);
    for (let row = 0; row <= LEAF_ROWS; row++)
      for (let col = 0; col <= LEAF_COLUMNS; col++) {
        const at = (row * (LEAF_COLUMNS + 1) + col) * 8;
        assert.ok(mesh[at + 1] > 0.04 && mesh[at + 1] < 1);
        if (row) assert.ok(mesh[at + 1] > mesh[at - (LEAF_COLUMNS + 1) * 8 + 1]);
        if (!col)
          assert.ok(
            Math.abs(mesh[at + 1] - (top[0] + ((bottom[0] - top[0]) * row) / LEAF_ROWS)) < 0.00001,
          );
      }
  }
});
test('gentle cloud input moves a mass and returns without a hard stop', () => {
  const mass = createCloudMass();
  mass.push(0, 1, 0.35, 0.15);
  for (let i = 0; i < 20; i++) mass.step(1 / 24);
  assert.ok(mass.offsets[0] > 0.005 && mass.offsets[0] < 0.08);
  assert.ok(mass.offsets[1] > 0.003);
  for (let i = 0; i < 960; i++) mass.step(1 / 24);
  assert.ok(Math.max(...mass.offsets.map(Math.abs)) < 0.0001);
});
test('sustained pointer input uses a fixed pool and bounded displacement', () => {
  const mass = createCloudMass();
  for (let i = 0; i < 3000; i++) {
    mass.push(i % 17, Math.sin(i) * 7, 100, -100);
    mass.step(1 / 24);
  }
  assert.equal(mass.centers.length, 18);
  assert.equal(mass.offsets.length, 18);
  assert.ok([...mass.offsets].every((v) => Number.isFinite(v) && Math.abs(v) <= 2.200001));
});
