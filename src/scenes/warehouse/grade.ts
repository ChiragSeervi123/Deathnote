import type { Grade } from '../registry';

/** Colour grade for scene `warehouse`, applied by the compositor (linear space). Owned by this scene. */
export const grade: Grade = {
  exposure: 1,
  contrast: 1,
  saturation: 1,
  tint: [1, 1, 1],
  lift: [0, 0, 0],
};
