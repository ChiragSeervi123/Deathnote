import { useEffect, type RefObject } from 'react';
import { addFrameCallback, FRAME_PRIORITY } from '@/animation/loop';
import { getChapterScroll } from '@/animation/scroll/scrollState';
import type { ChapterId } from '@/data/types';
import { isReducedMotion } from '@/state/runtime';
import type { Beat } from '../types';
import { beatVisual } from './beatMath';

const RISE_PX = 22;

/**
 * Drives a chapter's beat elements from the shared frame loop. Writes styles
 * directly (no React renders) and only when values change.
 */
export function useBeatChoreography(
  chapterId: ChapterId,
  beats: readonly Beat[],
  stageRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const els = Array.from(stage.querySelectorAll<HTMLElement>('[data-beat]'));
    const last = els.map(() => ({ o: -1, y: 999 }));

    return addFrameCallback(() => {
      const s = getChapterScroll(chapterId);
      if (!s.visible && last.every((l) => l.o === 0)) return;
      const reduce = isReducedMotion();
      for (let i = 0; i < els.length; i++) {
        const el = els[i]!;
        const beat = beats[Number(el.dataset.beat)];
        if (!beat) continue;
        const v = s.visible ? beatVisual(beat, s) : { opacity: 0, offset: 0 };
        const o = Math.round(v.opacity * 1000) / 1000;
        const y = reduce ? 0 : Math.round(v.offset * RISE_PX * 10) / 10;
        const prev = last[i]!;
        if (o !== prev.o) {
          el.style.opacity = String(o);
          el.style.pointerEvents = o > 0.6 ? 'auto' : 'none';
          prev.o = o;
        }
        if (y !== prev.y) {
          el.style.transform = `translate3d(0, ${y}px, 0)`;
          prev.y = y;
        }
      }
    }, FRAME_PRIORITY.dom);
  }, [chapterId, beats, stageRef]);
}
