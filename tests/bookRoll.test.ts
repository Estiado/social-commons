import assert from 'node:assert/strict';
import test from 'node:test';
import { rollMesh, rollPoint, windAngle } from '../src/features/book/rollGeometry.ts';
import { createCloudMass } from '../src/features/book/cloudMass.ts';

test('a rolled sheet preserves its measured material length through multiple windings', () => {
  for (const progress of [0, 0.1, 0.4, 0.7, 0.9, 1]) {
    let length = 0,
      previous = rollPoint(-1, progress);
    for (let i = 1; i <= 4000; i++) {
      const point = rollPoint(-1 + i / 2000, progress);
      length += Math.hypot(point.x - previous.x, point.z - previous.z);
      previous = point;
    }
    assert.ok(Math.abs(length - 2) < 0.006, `${progress}: ${length}`);
  }
});

test('both directions start at the same flat UV positions and finish entirely off the sheet', () => {
  for (const direction of [-1, 1]) {
    const flat = rollMesh(0, 0.8, direction);
    for (let at = 0; at < flat.length; at += 8) {
      assert.ok(Math.abs(flat[at] - (flat[at + 6] * 2 - 1)) < 0.00001);
      assert.ok(Math.abs(flat[at + 1] - (0.5 - flat[at + 7]) * 1.6) < 0.00001);
      assert.equal(flat[at + 2], 0);
    }
    assert.ok(rollPoint(1, 1).x < -1);
  }
});

test('tight coils and extreme progress remain finite with unit normals', () => {
  assert.equal(windAngle(1, 0.1, 0), 10);
  assert.ok(Number.isFinite(windAngle(100, 0.02, 0.01)));
  for (const t of [-1, 0.02, 0.45, 0.9, 2]) {
    const mesh = rollMesh(t, 2.1);
    for (let at = 0; at < mesh.length; at += 8) {
      assert.ok([...mesh.slice(at, at + 8)].every(Number.isFinite));
      assert.ok(Math.abs(Math.hypot(mesh[at + 3], mesh[at + 4], mesh[at + 5]) - 1) < 0.00001);
    }
  }
});

test('cloud impulses move and lift a mass, then settle without erasing density', () => {
  const mass = createCloudMass();
  mass.push(0, 1, 0.35, 0.15);
  for (let i = 0; i < 20; i++) mass.step(1 / 24);
  assert.ok(mass.offsets[0] > 0.1);
  assert.ok(mass.offsets[1] > 0.01);
  for (let i = 0; i < 400; i++) mass.step(1 / 24);
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
