import { createContext, useContext, useRef } from 'react';
import { useFrame, type RootState } from '@react-three/fiber';
import { CHAPTERS } from '@/chapters/chapterData';
import type { SceneKey } from '@/chapters/types';
import { getChapterScroll, scrollState } from '@/animation/scroll/scrollState';
import type { ChapterId } from '@/data/types';
import { isReducedMotion } from '@/state/runtime';
import { damp } from '@/utils/math';
import { layerWeight, stageState } from './stageState';

/** Frame-loop priorities inside the shared canvas (lower runs first). */
export const PRIORITY = {
  sceneUpdate: -10,
  layerRender: -1,
  compositor: 0,
  composer: 1,
  stats: 2,
} as const;

export const SceneKeyContext = createContext<SceneKey | null>(null);

export interface SceneFrame {
  /** Chapter currently driving this scene. */
  chapter: ChapterId;
  progress: number;
  enter: number;
  exit: number;
  /** Compositor weight of this scene (0..1). */
  weight: number;
  /** Seconds since the scene mounted. */
  time: number;
  /** Seconds since last frame (clamped). */
  delta: number;
  reduced: boolean;
  /** Eased pointer, -1..1 (0 under reduced motion). */
  pointer: { x: number; y: number };
}

function chaptersFor(key: SceneKey): ChapterId[] {
  return CHAPTERS.filter((c) => c.scene === key).map((c) => c.id);
}

/**
 * Per-frame hook for scene animation. Runs before the layer renders, and only
 * while the scene contributes to the frame (or is warming up).
 */
export function useSceneFrame(cb: (f: SceneFrame, state: RootState) => void, always = false): void {
  const key = useContext(SceneKeyContext);
  if (!key) throw new Error('useSceneFrame must be used inside a SceneLayer');
  const owned = useRef<ChapterId[] | null>(null);
  owned.current ??= chaptersFor(key);
  const frame = useRef<SceneFrame>({
    chapter: owned.current[0] ?? 'prologue',
    progress: 0,
    enter: 0,
    exit: 0,
    weight: 0,
    time: 0,
    delta: 0,
    reduced: false,
    pointer: { x: 0, y: 0 },
  });

  useFrame((state, delta) => {
    const f = frame.current;
    const dt = Math.min(delta, 0.1);
    f.time += dt;
    f.delta = dt;
    f.weight = layerWeight(key);
    if (f.weight <= 0 && !always && stageState.ready.has(key)) return;

    const { a, b } = stageState;
    const chapter =
      b.key === key && b.chapter
        ? b.chapter
        : a.key === key && a.chapter
          ? a.chapter
          : (owned.current?.[0] ?? f.chapter);
    const s = getChapterScroll(chapter);
    f.chapter = chapter;
    f.progress = s.progress;
    f.enter = s.enter;
    f.exit = s.exit;
    f.reduced = isReducedMotion();
    const px = f.reduced || !scrollState.pointer.active ? 0 : scrollState.pointer.x;
    const py = f.reduced || !scrollState.pointer.active ? 0 : scrollState.pointer.y;
    f.pointer.x = damp(f.pointer.x, px, 2.2, dt);
    f.pointer.y = damp(f.pointer.y, py, 2.2, dt);
    cb(f, state);
  }, PRIORITY.sceneUpdate);
}
