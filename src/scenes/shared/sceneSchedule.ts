import type { ChapterDef, SceneKey, TransitionKind } from '@/chapters/types';
import type { ChapterId } from '@/data/types';
import { smoothstep } from '@/utils/math';

/**
 * Pure scheduling logic for the SceneDirector (unit-tested).
 */

export interface TrackSnapshot {
  id: ChapterId;
  enter: number;
  exit: number;
}

export interface Schedule {
  a: { key: SceneKey | null; chapter: ChapterId | null; dim: number };
  b: { key: SceneKey | null; chapter: ChapterId | null; dim: number };
  mix: number;
  kind: TransitionKind;
}

/** How dark a scene gets while its chapter's case file is read / the page ends. */
export function dimForExit(exit: number): number {
  return smoothstep(0.05, 0.85, exit) * 0.82;
}

/**
 * Given ordered tracks, decide which two scenes are composited and how.
 * The incoming chapter is the last whose track has started entering the viewport.
 */
export function computeSchedule(
  tracks: ReadonlyArray<TrackSnapshot>,
  chapterById: ReadonlyMap<ChapterId, Pick<ChapterDef, 'scene' | 'transition'>>,
): Schedule {
  const empty: Schedule = {
    a: { key: null, chapter: null, dim: 0 },
    b: { key: null, chapter: null, dim: 0 },
    mix: 1,
    kind: 'fade',
  };
  if (tracks.length === 0) return empty;

  let inc = 0;
  for (let i = 0; i < tracks.length; i++) {
    if (tracks[i]!.enter > 0) inc = i;
    else break;
  }
  const B = tracks[inc]!;
  const A = inc > 0 ? tracks[inc - 1]! : null;
  const defB = chapterById.get(B.id);
  const defA = A ? chapterById.get(A.id) : undefined;
  const keyB = defB?.scene ?? null;
  const keyA = defA?.scene ?? null;

  const b = { key: keyB, chapter: B.id, dim: dimForExit(B.exit) };
  if (!A || B.enter >= 1 || keyA === keyB) {
    // Same scene continues across chapters, or the hand-off is complete.
    return { a: { ...b }, b, mix: 1, kind: defB?.transition ?? 'fade' };
  }
  const a = { key: keyA, chapter: A.id, dim: dimForExit(A.exit) };
  return { a, b, mix: B.enter, kind: defB?.transition ?? 'fade' };
}

/** Scene keys that should be mounted around the active chapter (preload neighbours). */
export function mountWindow(
  chapters: ReadonlyArray<Pick<ChapterDef, 'id' | 'scene'>>,
  activeIndex: number,
  radius = 1,
): SceneKey[] {
  const keys = new Set<SceneKey>();
  for (let i = activeIndex - radius; i <= activeIndex + radius; i++) {
    const c = chapters[i];
    if (c) keys.add(c.scene);
  }
  return [...keys];
}
