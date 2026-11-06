export const clamp = (v: number, min = 0, max = 1): number => (v < min ? min : v > max ? max : v);

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Hermite smoothstep, safe when edge0 === edge1. */
export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  if (edge0 === edge1) return x < edge0 ? 0 : 1;
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

/** Map `v` from [inMin, inMax] to [0, 1], clamped. */
export const range = (v: number, inMin: number, inMax: number): number =>
  inMax === inMin ? (v < inMin ? 0 : 1) : clamp((v - inMin) / (inMax - inMin));

/** Frame-rate independent exponential damping toward `target`. */
export const damp = (current: number, target: number, lambda: number, dt: number): number =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export const easeInOutSine = (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2;

/** Deterministic pseudo-random in [0, 1) from an integer seed (mulberry32). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Piecewise keyframe interpolation. `keys` must be sorted by `t`.
 * Values are numbers or number tuples of equal length.
 */
export function keyframes<T extends number | readonly number[]>(
  keys: ReadonlyArray<{ t: number; v: T }>,
  t: number,
  ease: (x: number) => number = easeInOutCubic,
): T {
  const first = keys[0];
  const last = keys[keys.length - 1];
  if (!first || !last) throw new Error('keyframes: empty');
  if (t <= first.t) return first.v;
  if (t >= last.t) return last.v;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i]!;
    const b = keys[i + 1]!;
    if (t >= a.t && t <= b.t) {
      const k = ease(range(t, a.t, b.t));
      if (typeof a.v === 'number') return lerp(a.v, b.v as number, k) as T;
      const av = a.v as readonly number[];
      const bv = b.v as readonly number[];
      return av.map((x, j) => lerp(x, bv[j] ?? x, k)) as unknown as T;
    }
  }
  return last.v;
}
