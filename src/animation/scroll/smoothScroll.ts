import Lenis from 'lenis';
import { addFrameCallback, FRAME_PRIORITY } from '../loop';

/**
 * Lenis interpolates the *native* scroll position, so keyboard scrolling,
 * anchors, find-in-page and assistive tech keep working (SPEC §10.1).
 * It is never created when reduced motion is in effect.
 */
let lenis: Lenis | null = null;
let removeFrame: (() => void) | null = null;

export function enableSmoothScroll(): void {
  if (lenis) return;
  lenis = new Lenis({
    autoRaf: false,
    lerp: 0.085,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    // Native touch scrolling on phones/tablets — no hijacking.
    syncTouch: false,
  });
  removeFrame = addFrameCallback((time) => lenis?.raf(time), FRAME_PRIORITY.smoothScroll);
}

export function disableSmoothScroll(): void {
  removeFrame?.();
  removeFrame = null;
  lenis?.destroy();
  lenis = null;
}

export function getLenis(): Lenis | null {
  return lenis;
}
