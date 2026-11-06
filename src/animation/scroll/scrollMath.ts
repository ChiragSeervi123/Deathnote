import { clamp } from '@/utils/math';

export interface TrackMetrics {
  /** Document-space top of the track element (px). */
  top: number;
  /** Track height (px). */
  height: number;
}

export interface TrackScroll {
  /** 0→1 while the track is pinned: top at viewport top → bottom at viewport bottom. */
  progress: number;
  /** 0→1 while the track's top travels from viewport bottom to viewport top. */
  enter: number;
  /** 0→1 while the track's bottom travels from viewport bottom to viewport top. */
  exit: number;
  /** Any part of the track intersects the viewport. */
  visible: boolean;
}

/** Pure scroll maths for one track (see docs/ARCHITECTURE.md §3.1). */
export function computeTrackScroll(y: number, viewportH: number, m: TrackMetrics): TrackScroll {
  const vh = Math.max(1, viewportH);
  const span = Math.max(1, m.height - vh);
  const bottom = m.top + m.height;
  return {
    progress: clamp((y - m.top) / span),
    enter: clamp((y + vh - m.top) / vh),
    exit: clamp((y + vh - bottom) / vh),
    visible: y + vh > m.top && y < bottom,
  };
}

/** Index of the track containing the probe line (default: viewport centre). */
export function findActiveIndex(
  y: number,
  viewportH: number,
  tracks: ReadonlyArray<TrackMetrics>,
  probe = 0.5,
): number {
  const line = y + viewportH * probe;
  let active = 0;
  for (let i = 0; i < tracks.length; i++) {
    const t = tracks[i]!;
    if (line >= t.top) active = i;
    else break;
  }
  return active;
}

/** Overall document progress 0→1. */
export function documentProgress(y: number, viewportH: number, docH: number): number {
  return clamp(y / Math.max(1, docH - viewportH));
}
