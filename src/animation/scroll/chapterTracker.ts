import type { ChapterId } from '@/data/types';
import { useRuntime } from '@/state/runtime';
import { addFrameCallback, FRAME_PRIORITY } from '../loop';
import { computeTrackScroll, documentProgress, findActiveIndex } from './scrollMath';
import { emptyChapterScroll, scrollState, type TrackEntry } from './scrollState';

/**
 * Measures chapter tracks (on resize / layout change only) and updates
 * `scrollState` once per frame. Owned by the route that renders chapters.
 */

let removeFrame: (() => void) | null = null;
let resizeObserver: ResizeObserver | null = null;
let measureQueued = false;
let lastY = 0;

function docTop(el: HTMLElement): number {
  return el.getBoundingClientRect().top + window.scrollY;
}

export function measureTracks(): void {
  measureQueued = false;
  scrollState.viewportH = window.innerHeight;
  scrollState.viewportW = window.innerWidth;
  scrollState.docH = document.documentElement.scrollHeight;
  for (const t of scrollState.tracks) {
    t.state.top = docTop(t.el);
    t.state.height = t.el.offsetHeight;
  }
  scrollState.tracks.sort((a, b) => a.state.top - b.state.top);
  updateTracks(true);
}

function queueMeasure(): void {
  if (measureQueued) return;
  measureQueued = true;
  requestAnimationFrame(measureTracks);
}

function updateTracks(force = false): void {
  const y = window.scrollY;
  const dy = y - lastY;
  lastY = y;
  scrollState.velocity = scrollState.velocity * 0.8 + dy * 0.2;
  if (!force && dy === 0 && Math.abs(scrollState.velocity) < 0.01) return;

  scrollState.y = y;
  const vh = scrollState.viewportH;
  scrollState.progress = documentProgress(y, vh, scrollState.docH);
  for (const t of scrollState.tracks) {
    const s = computeTrackScroll(y, vh, t.state);
    t.state.progress = s.progress;
    t.state.enter = s.enter;
    t.state.exit = s.exit;
    t.state.visible = s.visible;
  }
  const idx = findActiveIndex(
    y,
    vh,
    scrollState.tracks.map((t) => t.state),
  );
  scrollState.activeIndex = idx;
  const active = scrollState.tracks[idx];
  if (active && useRuntime.getState().activeChapter !== active.id) {
    useRuntime.getState().setActiveChapter(active.id);
  }
}

export function registerTrack(id: ChapterId, el: HTMLElement): () => void {
  const entry: TrackEntry = { id, el, state: emptyChapterScroll() };
  scrollState.tracks.push(entry);
  scrollState.byId.set(id, entry.state);
  resizeObserver?.observe(el);
  queueMeasure();
  return () => {
    const i = scrollState.tracks.indexOf(entry);
    if (i >= 0) scrollState.tracks.splice(i, 1);
    if (scrollState.byId.get(id) === entry.state) scrollState.byId.delete(id);
    resizeObserver?.unobserve(el);
  };
}

/** Start tracking. Returns a disposer. Safe to call once per route mount. */
export function startChapterTracker(): () => void {
  stopChapterTracker();
  lastY = window.scrollY;
  resizeObserver = new ResizeObserver(queueMeasure);
  resizeObserver.observe(document.body);
  for (const t of scrollState.tracks) resizeObserver.observe(t.el);
  window.addEventListener('resize', queueMeasure);
  document.fonts?.ready.then(queueMeasure).catch(() => undefined);
  removeFrame = addFrameCallback(() => updateTracks(), FRAME_PRIORITY.scroll);
  queueMeasure();
  return stopChapterTracker;
}

export function stopChapterTracker(): void {
  removeFrame?.();
  removeFrame = null;
  resizeObserver?.disconnect();
  resizeObserver = null;
  window.removeEventListener('resize', queueMeasure);
}

export function trackElement(id: ChapterId): HTMLElement | undefined {
  return scrollState.tracks.find((t) => t.id === id)?.el;
}
