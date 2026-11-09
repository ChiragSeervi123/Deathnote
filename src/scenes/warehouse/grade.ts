import type { Grade } from '../registry';

/** Colour grade for scene `warehouse`, applied by the compositor (linear space). Owned by this scene. */
export const grade: Grade = {
  exposure: 1,
  contrast: 1.07,
  saturation: 0.7,
  tint: [1.02, 1, 0.96],
  lift: [0, 0, 0],
};
