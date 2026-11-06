import { smoothstep } from '@/utils/math';
import type { Beat } from '../types';

export interface BeatFrame {
  progress: number;
  enter: number;
  exit: number;
}

export interface BeatVisual {
  /** 0..1 */
  opacity: number;
  /** -1 (exited upward) .. 0 (resting) .. 1 (not yet arrived, below). */
  offset: number;
}

/**
 * Opacity/offset for a beat at the given chapter scroll state. Beats that start
 * at 0 are tied to the chapter's arrival (`enter`); beats that end at 1 are
 * tied to its departure (`exit`). Pure and reversible.
 */
export function beatVisual(beat: Pick<Beat, 'at'>, f: BeatFrame, fade = 0.03): BeatVisual {
  const [a, b] = beat.at;
  const fadeIn = a <= 0 ? smoothstep(0.35, 0.95, f.enter) : smoothstep(a, a + fade, f.progress);
  const fadeOut =
    b >= 1 ? 1 - smoothstep(0.08, 0.55, f.exit) : 1 - smoothstep(b - fade, b, f.progress);
  const opacity = Math.max(0, Math.min(fadeIn, fadeOut));
  const offset = fadeIn < 1 ? 1 - fadeIn : fadeOut < 1 ? -(1 - fadeOut) : 0;
  return { opacity, offset };
}
