export interface CloudBand {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Transform-space path whose endpoint is inside the actual fog band, independent of viewport height. */
export function cloudPath(center: { x: number; y: number }, band: CloudBand, index: number) {
  const drift = Math.sin(index * 1.45) * 24;
  const pull = (band.left + band.width / 2 - center.x) * 0.045;
  const x = drift + pull;
  const y = band.top + band.height * (0.76 + Math.sin(index * 0.9) * 0.06) - center.y;
  return [
    { x: 0, y: 0 },
    { x: x * 0.45 + 8, y: y * 0.15 },
    { x: x * 0.8 - 6, y: y * 0.55 },
    { x, y },
  ];
}
