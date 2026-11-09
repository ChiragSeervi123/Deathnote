import type { Grade } from '../registry';

/** Colour grade for scene `misa`, applied by the compositor (linear space). Owned by this scene. */
export const grade: Grade = {
  exposure: 1,
  contrast: 1.06,
  saturation: 0.82,
  tint: [0.97, 0.98, 1.03],
  lift: [0, 0, 0],
};
