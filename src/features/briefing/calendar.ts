const DAY = 86_400_000;
const CHINA_OFFSET = 8 * 60 * 60 * 1000;

/** The edition follows Beijing midnight, independently of a reader's timezone. */
export function chinaDay(now = new Date()): string {
  return new Date(now.getTime() + CHINA_OFFSET).toISOString().slice(0, 10);
}

export function dayNumber(day: string): number {
  const time = Date.parse(day + 'T00:00:00Z');
  if (
    !/^\d{4}-\d{2}-\d{2}$/u.test(day) ||
    !Number.isFinite(time) ||
    new Date(time).toISOString().slice(0, 10) !== day
  )
    throw new Error('简报日期无效');
  return Math.floor(time / DAY);
}

export function untilChinaMidnight(now = new Date()): number {
  return DAY - ((((now.getTime() + CHINA_OFFSET) % DAY) + DAY) % DAY) + 50;
}
