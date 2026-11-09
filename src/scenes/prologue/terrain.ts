import { mulberry32 } from '@/utils/math';
import { WORLD } from './world';

/** Small deterministic value noise for CPU-side displacement. */
export function makeNoise(seed: number) {
  const rnd = mulberry32(seed);
  const perm = new Float32Array(512);
  for (let i = 0; i < 512; i++) perm[i] = rnd();
  const h = (x: number, y: number) => perm[((x & 255) + (y & 255) * 31) & 511]!;
  const n = (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const a = h(xi, yi);
    const b = h(xi + 1, yi);
    const c = h(xi, yi + 1);
    const d = h(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  return (x: number, y: number) => {
    let v = 0;
    let amp = 0.5;
    let f = 1;
    for (let o = 0; o < 5; o++) {
      v += amp * n(x * f, y * f);
      f *= 2.03;
      amp *= 0.5;
    }
    return v;
  };
}

let sharedFbm: ((x: number, y: number) => number) | null = null;

/** Ground height (relative to WORLD.realmY) at a point — for placing figures on the dunes. */
export function realmHeight(x: number, z: number): number {
  sharedFbm ??= makeNoise(13);
  return terrainHeight(x, z, sharedFbm);
}

export function terrainHeight(x: number, z: number, fbm: (x: number, y: number) => number): number {
  const r = Math.hypot(x, z);
  // Long dunes + rubble.
  let y = (fbm(x * 0.012 + 3, z * 0.012 + 7) - 0.5) * 16 + (fbm(x * 0.08, z * 0.08) - 0.5) * 1.6;
  // Flatten a plateau around the hole and raise a jagged lip at its rim.
  const plateau = Math.min(1, Math.max(0, (r - 6) / 30));
  y *= plateau * plateau;
  const lip = Math.exp(-Math.pow((r - WORLD.holeRadius - 0.6) / 1.1, 2));
  y += lip * (0.5 + fbm(Math.atan2(z, x) * 3 + 10, 1) * 1.1);
  return y;
}
