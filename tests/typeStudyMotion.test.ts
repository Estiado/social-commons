import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceLift, TYPE_MOTION } from '../src/features/book/typeMotion.ts';

test('type translation is monotonic with no overshoot and independent of frame rate', () => {
  function run(fps: number) {
    let h = 0;
    for (let i = 0; i < fps; i++) {
      const next = advanceLift(h, TYPE_MOTION.maxLift, 1 / fps);
      assert.ok(next >= h && next <= TYPE_MOTION.maxLift);
      h = next;
    }
    return h;
  }
  assert.ok(Math.abs(run(30) - run(120)) < 0.00001);
  assert.ok(run(60) > TYPE_MOTION.maxLift * 0.99);
});

test('rise and return follow the approved unequal settling durations', () => {
  const raised = advanceLift(0, TYPE_MOTION.maxLift, 0.5);
  const lowered = advanceLift(TYPE_MOTION.maxLift, 0, 1.2);
  assert.ok(Math.abs(raised / TYPE_MOTION.maxLift - 0.9502) < 0.001);
  assert.ok(Math.abs(lowered / TYPE_MOTION.maxLift - 0.0498) < 0.001);
  assert.ok(advanceLift(TYPE_MOTION.maxLift, 0, 0.5) > TYPE_MOTION.maxLift * 0.28);
});

test('amplified amplitude stays bounded, cancellation can hold exactly', () => {
  assert.ok(advanceLift(0, 100, 5) <= TYPE_MOTION.maxLift);
  assert.ok(advanceLift(1, -50, 5) >= 0);
  assert.equal(advanceLift(0.6, 2, 0), 0.6);
  assert.equal(advanceLift(0.6, 2, -1), 0.6);
  assert.equal(advanceLift(0, 0, 1), 0);
});
