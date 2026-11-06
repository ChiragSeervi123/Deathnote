/** Shared layout of the prologue's vertical world (metres). */
export const WORLD = {
  realmY: 300,
  holeRadius: 3.4,
  /** Ryuk's seat on the hole's west rim (he faces +x, over the hole). */
  ryuk: [-4.15, 301.35, -0.6] as const,
  /** Landing spot in the school courtyard. */
  landing: [0.35, 0.03, 0.4] as const,
  /** Notebook scale (model is in decimetres → ~15 cm wide). */
  notebookScale: 0.1,
  sunDir: [0.18, 0.1, -1] as const,
} as const;

/** Realm (0) ↔ human world (1) blend from camera height. */
export function humanWorldBlend(camY: number): number {
  const t = (WORLD.realmY + 2 - camY) / 26;
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return c * c * (3 - 2 * c);
}
