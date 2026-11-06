import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { SceneKey } from '@/chapters/types';
import { grade as grade_realm } from './realm/grade';
import { grade as grade_light } from './light/grade';
import { grade as grade_kira } from './kira/grade';
import { grade as grade_lroom } from './lroom/grade';
import { grade as grade_investigation } from './investigation/grade';
import { grade as grade_misa } from './misa/grade';
import { grade as grade_confinement } from './confinement/grade';
import { grade as grade_yotsuba } from './yotsuba/grade';
import { grade as grade_rain } from './rain/grade';
import { grade as grade_wammy } from './wammy/grade';
import { grade as grade_newkira } from './newkira/grade';
import { grade as grade_strategy } from './strategy/grade';
import { grade as grade_warehouse } from './warehouse/grade';
import { grade as grade_fall } from './fall/grade';
import { grade as grade_archive } from './archive/grade';
import { grade as grade_eyes } from './eyes/grade';
import { grade as grade_legacy } from './legacy/grade';

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
  realm: { Component: lazy(() => import('./realm/RealmScene')), grade: grade_realm },
  light: { Component: lazy(() => import('./light/LightScene')), grade: grade_light },
  kira: { Component: lazy(() => import('./kira/KiraScene')), grade: grade_kira },
  'l-room': { Component: lazy(() => import('./lroom/LRoomScene')), grade: grade_lroom },
  investigation: { Component: lazy(() => import('./investigation/InvestigationScene')), grade: grade_investigation },
  misa: { Component: lazy(() => import('./misa/MisaScene')), grade: grade_misa },
  confinement: { Component: lazy(() => import('./confinement/ConfinementScene')), grade: grade_confinement },
  yotsuba: { Component: lazy(() => import('./yotsuba/YotsubaScene')), grade: grade_yotsuba },
  rain: { Component: lazy(() => import('./rain/RainScene')), grade: grade_rain },
  wammy: { Component: lazy(() => import('./wammy/WammyScene')), grade: grade_wammy },
  'new-kira': { Component: lazy(() => import('./newkira/NewKiraScene')), grade: grade_newkira },
  strategy: { Component: lazy(() => import('./strategy/StrategyScene')), grade: grade_strategy },
  warehouse: { Component: lazy(() => import('./warehouse/WarehouseScene')), grade: grade_warehouse },
  fall: { Component: lazy(() => import('./fall/FallScene')), grade: grade_fall },
  archive: { Component: lazy(() => import('./archive/ArchiveScene')), grade: grade_archive },
  eyes: { Component: lazy(() => import('./eyes/EyesScene')), grade: grade_eyes },
  legacy: { Component: lazy(() => import('./legacy/LegacyScene')), grade: grade_legacy },
};

export function isSceneBuilt(key: SceneKey | null): key is SceneKey {
  return !!key && SCENES[key].Component !== null;
}
