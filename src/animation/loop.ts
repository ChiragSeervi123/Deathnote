import { gsap } from 'gsap';

/**
 * One clock for the whole site. GSAP's ticker (rAF) drives, in order:
 *   -100  Lenis smooth-scroll integration
 *    -50  scrollState update (reads scroll position once per frame)
 *      0  DOM choreography (beats, progress rail)
 *    100  React Three Fiber `advance()` (the WebGL frame)
 * Keeping these on a single ordered loop guarantees the canvas and the DOM
 * never disagree about scroll position by a frame.
 */
export type FrameCallback = (time: number, delta: number) => void;

interface Entry {
  cb: FrameCallback;
  priority: number;
}

const entries: Entry[] = [];
let installed = false;
let lastTime = 0;

function tick(time: number): void {
  // gsap passes seconds; convert to ms for consistency with performance.now().
  const now = time * 1000;
  const delta = lastTime === 0 ? 16.7 : Math.min(now - lastTime, 100);
  lastTime = now;
  for (let i = 0; i < entries.length; i++) entries[i]!.cb(now, delta);
}

function install(): void {
  if (installed) return;
  installed = true;
  gsap.ticker.lagSmoothing(0);
  gsap.ticker.add(tick);
}

export function addFrameCallback(cb: FrameCallback, priority = 0): () => void {
  install();
  const entry: Entry = { cb, priority };
  entries.push(entry);
  entries.sort((a, b) => a.priority - b.priority);
  return () => {
    const i = entries.indexOf(entry);
    if (i >= 0) entries.splice(i, 1);
  };
}

export const FRAME_PRIORITY = {
  smoothScroll: -100,
  scroll: -50,
  dom: 0,
  webgl: 100,
} as const;
