import test from 'node:test';
import assert from 'node:assert/strict';
import { edgeResponse } from '../src/features/book/typeFieldEdge.ts';

test('whole-sort membership follows the rest position and visible edges remain interactive', () => {
  assert.equal(edgeResponse(-0.001).visible, false);
  assert.equal(edgeResponse(0).visible, true);
  assert.equal(edgeResponse(0).maxLift, 0.3);
  for (let row = 0; row <= 3; row += 0.05) assert.ok(edgeResponse(row).maxLift > 0);
});

test('the three-row response joins smoothly without an amplitude or color step', () => {
  let previous = edgeResponse(0);
  for (let row = 0.01; row <= 4; row += 0.01) {
    const current = edgeResponse(row);
    assert.ok(current.maxLift >= previous.maxLift && current.maxLift <= 1.8);
    assert.ok(current.strength >= previous.strength && current.strength <= 1);
    assert.ok(current.maxLift - previous.maxLift < 0.008);
    previous = current;
  }
  assert.equal(edgeResponse(3).maxLift, 1.8);
  assert.equal(edgeResponse(3).strength, 1);
});
