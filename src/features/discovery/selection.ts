import { chinaDay, dayNumber } from '../briefing/calendar.ts';
import type { ReadingPath } from '../../data/readingPaths.ts';

/** One recommendation for the whole Beijing week; revisits do not reshuffle it. */
export function weeklyReadingPath(paths: readonly ReadingPath[], day = chinaDay()) {
  if (!paths.length) throw new Error('阅读线不能为空');
  const week = Math.floor((dayNumber(day) - dayNumber('2026-11-02')) / 7);
  return paths[((week % paths.length) + paths.length) % paths.length];
}

/** A URL may request context, but cannot attach an unrelated item to that path. */
export function readingPathForItem(
  paths: readonly ReadingPath[],
  itemId: string,
  requested?: string | null,
) {
  return (
    paths.find((path) => path.id === requested && path.steps.some((step) => step.id === itemId)) ??
    paths.find((path) => path.steps.some((step) => step.id === itemId))
  );
}
