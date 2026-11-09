import type { Grade } from '../registry';

/** Colour grade for scene `fall`, applied by the compositor (linear space). Owned by this scene. */
export const grade: Grade = {
  exposure: 1,
  contrast: 1.05,
  saturation: 0.9,
  tint: [1.03, 0.99, 0.96],
  lift: [0, 0, 0],
};
