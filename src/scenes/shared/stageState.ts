import type { Texture } from 'three';
import type { SceneKey, TransitionKind } from '@/chapters/types';
import type { ChapterId } from '@/data/types';

/**
 * Per-frame compositor state, written by the SceneDirector and read by
 * SceneLayers (to decide whether to render) and the Compositor (uniforms).
 * Mutable by design — never React state.
 */
export interface LayerSlot {
  key: SceneKey | null;
  chapter: ChapterId | null;
  /** 0..1 darkening applied by the compositor (dossier reading, page end). */
  dim: number;
}

export const stageState = {
  a: { key: null, chapter: null, dim: 0 } as LayerSlot,
  b: { key: null, chapter: null, dim: 0 } as LayerSlot,
  /** 0 = only A visible, 1 = only B visible. */
  mix: 1,
  kind: 'fade' as TransitionKind,
  /** Render-target textures by scene key (set by each SceneLayer). */
  textures: new Map<SceneKey, Texture>(),
  /** Scenes whose content has finished loading. */
  ready: new Set<SceneKey>(),
  /** Scenes that failed to load or crashed. */
  failed: new Set<SceneKey>(),
  /** Whether anything is being composited this frame. */
  anyVisible: false,
  /** Frames to keep advancing while nothing is visible (off-screen warm-up). */
  warmFrames: 0,
};

/** True when a scene's layer contributes to the current frame. */
export function isLayerActive(key: SceneKey): boolean {
  const { a, b, mix } = stageState;
  return (b.key === key && mix > 0.0005) || (a.key === key && mix < 0.9995);
}

/** Slot weight (0..1) of a scene in the current frame. */
export function layerWeight(key: SceneKey): number {
  const { a, b, mix } = stageState;
  if (a.key === key && b.key === key) return 1;
  if (b.key === key) return mix;
  if (a.key === key) return 1 - mix;
  return 0;
}
