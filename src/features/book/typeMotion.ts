/** Duration is the approximate time to settle 95% of a translation. */
export const TYPE_MOTION = Object.freeze({ rise: 0.5, fall: 1.2, maxLift: 1.8, radius: 3.5 });

export function advanceLift(current: number, target: number, seconds: number): number {
  const boundedTarget = Math.max(0, Math.min(TYPE_MOTION.maxLift, target));
  const duration = boundedTarget > current ? TYPE_MOTION.rise : TYPE_MOTION.fall;
  const next =
    current + (boundedTarget - current) * (1 - Math.exp((-3 * Math.max(0, seconds)) / duration));
  return Math.abs(next - boundedTarget) < 0.0005 ? boundedTarget : next;
}
