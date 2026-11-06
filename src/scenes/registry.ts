import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { SceneKey } from '@/chapters/types';

/** Colour grade applied by the compositor per scene (linear space). */
export interface Grade {
  exposure: number;
  contrast: number;
  saturation: number;
  /** Multiplicative tint. */
  tint: readonly [number, number, number];
  /** Lift added to shadows (r, g, b). */
  lift: readonly [number, number, number];
}

export interface SceneEntry {
  /** Lazy scene component, or null while the scene is not built yet (2D backdrop is shown). */
  Component: LazyExoticComponent<ComponentType> | null;
  grade: Grade;
}

const neutral: Grade = {
  exposure: 1,
  contrast: 1,
  saturation: 1,
  tint: [1, 1, 1],
  lift: [0, 0, 0],
};

/**
 * Scene catalogue. A scene is listed with `Component: null` until it is
 * genuinely implemented — the designed 2D backdrop covers it meanwhile and
 * PROGRESS.md tracks it as not started (no fake 3D stand-ins).
 */
export const SCENES: Record<SceneKey, SceneEntry> = {
  prologue: {
    Component: lazy(() => import('./prologue/PrologueScene')),
    grade: {
      exposure: 1,
      contrast: 1.06,
      saturation: 0.85,
      tint: [0.98, 1, 1.03],
      lift: [0.004, 0.004, 0.006],
    },
  },
  notebook: {
    Component: lazy(() => import('./notebook/NotebookScene')),
    grade: {
      exposure: 1,
      contrast: 1.08,
      saturation: 0.95,
      tint: [1.02, 1, 0.97],
      lift: [0.003, 0.002, 0.002],
    },
  },
  realm: { Component: null, grade: neutral },
  light: { Component: null, grade: neutral },
  kira: { Component: null, grade: neutral },
  'l-room': { Component: null, grade: neutral },
  investigation: { Component: null, grade: neutral },
  misa: { Component: null, grade: neutral },
  confinement: { Component: null, grade: neutral },
  yotsuba: { Component: null, grade: neutral },
  rain: { Component: null, grade: neutral },
  wammy: { Component: null, grade: neutral },
  'new-kira': { Component: null, grade: neutral },
  strategy: { Component: null, grade: neutral },
  warehouse: { Component: null, grade: neutral },
  fall: { Component: null, grade: neutral },
  archive: { Component: null, grade: neutral },
  eyes: { Component: null, grade: neutral },
  legacy: { Component: null, grade: neutral },
};

export function isSceneBuilt(key: SceneKey | null): key is SceneKey {
  return !!key && SCENES[key].Component !== null;
}
