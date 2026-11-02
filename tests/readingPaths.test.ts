import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DAILY_READING_PATHS,
  HISTORY_READING_PATHS,
  HISTORY_MAIN_IDS,
} from '../src/data/readingPaths.ts';
import { DAILY_KNOWLEDGE } from '../src/data/daily.ts';
import { EVENTS } from '../src/data/events.ts';
import { weeklyReadingPath, readingPathForItem } from '../src/features/discovery/selection.ts';
import { chinaDay } from '../src/features/briefing/calendar.ts';

test('短读线只引用既有条目，每组两三篇且主目录与原始事件一致', () => {
  for (const [paths, items] of [
    [DAILY_READING_PATHS, DAILY_KNOWLEDGE],
    [HISTORY_READING_PATHS, EVENTS],
  ] as const) {
    const ids = new Set(items.map((item) => item.id));
    assert.equal(new Set(paths.map((path) => path.id)).size, paths.length);
    for (const path of paths) {
      assert.ok(path.steps.length >= 2 && path.steps.length <= 3, path.id);
      assert.equal(new Set(path.steps.map((step) => step.id)).size, path.steps.length);
      for (const step of path.steps) {
        assert.ok(ids.has(step.id), `${path.id}/${step.id}`);
        assert.ok(step.note.trim());
      }
    }
  }
  assert.equal(DAILY_KNOWLEDGE.length, 147);
  assert.equal(EVENTS.length, 16);
  for (const id of HISTORY_MAIN_IDS) assert.ok(EVENTS.some((item) => item.id === id));
});

test('本周推荐按北京周一换组，周日不换、跨年可读、日期错误明确报错', () => {
  const paths = DAILY_READING_PATHS;
  const first = weeklyReadingPath(paths, '2026-11-02');
  assert.equal(weeklyReadingPath(paths, '2026-11-08'), first);
  assert.notEqual(weeklyReadingPath(paths, '2026-11-09'), first);
  assert.equal(weeklyReadingPath(paths, chinaDay(new Date('2026-11-08T15:59:59Z'))), first);
  assert.notEqual(weeklyReadingPath(paths, chinaDay(new Date('2026-11-08T16:00:00Z'))), first);
  assert.ok(paths.includes(weeklyReadingPath(paths, '2027-01-01')));
  assert.ok(paths.includes(weeklyReadingPath(paths, '2026-01-01')));
  assert.throws(() => weeklyReadingPath(paths, '2026-02-30'));
  assert.throws(() => weeklyReadingPath([], '2026-11-02'));
});

test('详情页上下文不能用查询参数把不相关的文章放进阅读线', () => {
  assert.equal(readingPathForItem(DAILY_READING_PATHS, 'd140', 'choice')?.id, 'choice');
  assert.equal(readingPathForItem(DAILY_READING_PATHS, 'd140', 'labels')?.id, 'choice');
  assert.equal(readingPathForItem(DAILY_READING_PATHS, 'unknown', 'choice'), undefined);
  assert.equal(readingPathForItem(HISTORY_READING_PATHS, 'penicillin-discovery')?.id, 'progress');
  assert.equal(readingPathForItem(HISTORY_READING_PATHS, '__proto__'), undefined);
});
