import { TYPE_MOTION } from './typeMotion.ts';

export const TYPE_EDGE = Object.freeze({ rows: 3, minLift: 0.3, strength: 0.34 });

/** Distance is measured in projected rows at rest, never from the moving top. */
export function edgeResponse(distanceRows: number) {
  const visible = distanceRows >= 0;
  const t = Math.max(0, Math.min(1, distanceRows / TYPE_EDGE.rows));
  const smooth = t * t * (3 - 2 * t);
  return {
    visible,
    maxLift: visible ? TYPE_EDGE.minLift + (TYPE_MOTION.maxLift - TYPE_EDGE.minLift) * smooth : 0,
    strength: visible ? TYPE_EDGE.strength + (1 - TYPE_EDGE.strength) * smooth : 0,
  };
}
