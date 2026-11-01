/** Bounded spring masses in cloud world space. Pointer movement pushes a volume;
 * damping and restoring force let it drift, lift and return instead of painting a clear mask. */
export function createCloudMass() {
  const count = 6;
  const centers = new Float32Array(count * 3);
  const offsets = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  let next = 0;
  centers.fill(1000);
  return {
    centers,
    offsets,
    push(x: number, z: number, dx: number, dz: number) {
      let nearest = -1,
        distance = 2.8;
      for (let i = 0; i < count; i++) {
        const d = Math.hypot(x - centers[i * 3], z - centers[i * 3 + 2]);
        if (d < distance) {
          distance = d;
          nearest = i;
        }
      }
      const index = nearest < 0 ? next++ % count : nearest;
      const at = index * 3;
      if (nearest < 0) {
        centers.set([x, 0.2, z], at);
        offsets.fill(0, at, at + 3);
        velocities.fill(0, at, at + 3);
      }
      const energy = Math.min(0.6, Math.hypot(dx, dz));
      velocities[at] += Math.tanh(dx * 0.7) * 0.12;
      velocities[at + 1] += energy * 0.045;
      velocities[at + 2] += Math.tanh(dz * 0.7) * 0.12;
      // Soft velocity saturation avoids the visible stop of a clamped cloud block.
      for (let i = at; i < at + 3; i++) velocities[i] = 0.55 * Math.tanh(velocities[i] / 0.55);
    },
    step(seconds: number) {
      const dt = Math.min(0.05, Math.max(0, seconds));
      for (let i = 0; i < offsets.length; i++) {
        const restoring = offsets[i] * (0.52 + 1.6 * offsets[i] ** 2);
        velocities[i] = (velocities[i] - restoring * dt) * Math.exp(-2.05 * dt);
        offsets[i] += velocities[i] * dt;
      }
    },
  };
}
