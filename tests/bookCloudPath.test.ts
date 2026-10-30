import assert from 'node:assert/strict';
import test from 'node:test';
import { cloudPath } from '../src/features/book/cloudPath.ts';

test('falling glyphs land within the real cloud band on desktop, short screens and phones', () => {
  for (const band of [
    { left: 0, top: 640, width: 1440, height: 200 },
    { left: 0, top: 360, width: 1440, height: 120 },
    { left: 0, top: 570, width: 320, height: 170 },
  ]) {
    for (let i = 0; i < 24; i++) {
      const center = { x: 30 + i * 9, y: 120 + i * 8 };
      const path = cloudPath(center, band, i);
      const endY = center.y + path.at(-1)!.y;
      assert.ok(endY >= band.top + band.height * 0.35 && endY <= band.top + band.height * 0.65);
      assert.deepEqual(path[0], { x: 0, y: 0 });
      assert.ok(path.every((point) => Number.isFinite(point.x) && Number.isFinite(point.y)));
    }
  }
});
