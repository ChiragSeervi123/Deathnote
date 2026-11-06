import type { ChapterId } from '@/data/types';
import type { TrackScroll } from './scrollMath';

export interface ChapterScrollState extends TrackScroll {
  top: number;
  height: number;
}

export interface TrackEntry {
  id: ChapterId;
  el: HTMLElement;
  state: ChapterScrollState;
}

/**
 * Per-frame scroll values. MUTABLE by design: written once per frame by the
 * chapter tracker, read by WebGL scenes (inside useFrame) and DOM
 * choreography. Never put this in React state.
 */
export const scrollState = {
  y: 0,
  /** px per ms, smoothed. */
  velocity: 0,
  viewportH: 1,
  viewportW: 1,
  docH: 1,
  /** Whole-document progress 0→1. */
  progress: 0,
  activeIndex: 0,
  /** Ordered by document position. */
  tracks: [] as TrackEntry[],
  byId: new Map<ChapterId, ChapterScrollState>(),
  /** Pointer in normalised device coords (-1..1), eased by consumers. */
  pointer: { x: 0, y: 0, active: false },
};

export function emptyChapterScroll(): ChapterScrollState {
  return { top: 0, height: 0, progress: 0, enter: 0, exit: 0, visible: false };
}

export function getChapterScroll(id: ChapterId): ChapterScrollState {
  return scrollState.byId.get(id) ?? emptyChapterScroll();
}
