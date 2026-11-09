/**
 * Camera compositions for the tribute, keyed on T (see tributeTimeline).
 * Desktop: the page sits away from the text columns (section heads stick to
 * the left column, prose runs in the right one). Portrait: subjects high.
 */
export type V3 = readonly [number, number, number];
type Keys = ReadonlyArray<{ t: number; v: V3 }>;

export const CAM_DESKTOP: { pos: Keys; tgt: Keys } = {
  pos: [
    { t: 0.5, v: [0, 6.6, 1.9] },
    { t: 1.5, v: [1.95, 5.9, 2.7] },
    { t: 2.5, v: [2.0, 5.4, 3.2] },
    { t: 3.45, v: [1.75, 7.0, 2.8] },
    { t: 4.5, v: [1.9, 8.0, 3.5] },
    { t: 5.5, v: [2.7, 8.1, 3.7] },
    { t: 6.0, v: [2.7, 8.4, 3.9] },
  ],
  tgt: [
    { t: 0.5, v: [0, 0, 0.12] },
    { t: 1.5, v: [1.8, 0, 0.0] },
    { t: 2.5, v: [1.75, 0, 0.1] },
    { t: 3.45, v: [1.6, 0, 0.1] },
    { t: 4.5, v: [2.0, 0, 0.05] },
    { t: 5.5, v: [2.7, 0, -0.1] },
    { t: 6.0, v: [2.7, 0, -0.1] },
  ],
};

export const CAM_PORTRAIT: { pos: Keys; tgt: Keys } = {
  pos: [
    { t: 0.5, v: [0, 8.6, 2.6] },
    { t: 1.5, v: [0, 8.2, 3.0] },
    { t: 2.5, v: [0, 8.0, 3.2] },
    { t: 3.45, v: [0, 8.6, 3.0] },
    { t: 4.5, v: [2.6, 9.4, 4.4] },
    { t: 5.5, v: [5.34, 8.4, 6.0] },
    { t: 6.0, v: [5.34, 8.8, 6.2] },
  ],
  tgt: [
    { t: 0.5, v: [0, 0, 0.55] },
    { t: 1.5, v: [0, 0, 0.7] },
    { t: 2.5, v: [0, 0, 0.7] },
    { t: 3.45, v: [0, 0, 0.7] },
    { t: 4.5, v: [2.6, 0, 1.4] },
    { t: 5.5, v: [5.34, 0, 2.3] },
    { t: 6.0, v: [5.34, 0, 2.3] },
  ],
};

/** Close shot following the pen tip: target offset from the tip, and the eye relative to the target. */
export const TRACK = {
  desktop: { offset: [1.2, 0, -0.7] as V3, eye: [0.3, 4.7, 2.3] as V3 },
  portrait: { offset: [0, 0, 0.75] as V3, eye: [0, 5.2, 2.0] as V3 },
} as const;
