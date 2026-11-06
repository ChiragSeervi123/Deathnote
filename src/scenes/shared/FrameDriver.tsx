import { useEffect, type RefObject } from 'react';
import { useThree } from '@react-three/fiber';
import { CHAPTER_BY_ID } from '@/chapters/chapterData';
import { addFrameCallback, FRAME_PRIORITY } from '@/animation/loop';
import { scrollState } from '@/animation/scroll/scrollState';
import { useRuntime } from '@/state/runtime';
import { computeSchedule, type TrackSnapshot } from './sceneSchedule';
import { stageState } from './stageState';

const snaps: TrackSnapshot[] = [];

function available(key: string | null): boolean {
  return !!key && stageState.ready.has(key as never) && !stageState.failed.has(key as never);
}

/**
 * Drives the canvas from the site's single clock (animation/loop.ts):
 * 1. computes which scenes are composited (pure schedule from scrollState);
 * 2. fades the canvas element by how much of the frame has a ready scene, so the
 *    designed 2D backdrop shows through while scenes load or aren't built;
 * 3. advances React Three Fiber only when something is visible or warming up.
 */
export function FrameDriver({ wrapperRef }: { wrapperRef: RefObject<HTMLDivElement | null> }) {
  const advance = useThree((s) => s.advance);
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    gl.info.autoReset = false;
    let lastOpacity = -1;
    return addFrameCallback((now) => {
      snaps.length = 0;
      for (const t of scrollState.tracks)
        snaps.push({ id: t.id, enter: t.state.enter, exit: t.state.exit });
      const s = computeSchedule(snaps, CHAPTER_BY_ID);
      Object.assign(stageState.a, s.a);
      Object.assign(stageState.b, s.b);
      stageState.mix = s.mix;
      stageState.kind = s.kind;

      const lost = useRuntime.getState().webgl !== 'ready';
      const wA = available(s.a.key) ? 1 - s.mix : 0;
      const wB = available(s.b.key) ? s.mix : 0;
      const sameScene = s.a.key === s.b.key;
      const opacity = lost ? 0 : sameScene ? (available(s.b.key) ? 1 : 0) : Math.min(1, wA + wB);
      stageState.anyVisible = opacity > 0.001;

      const el = wrapperRef.current;
      const rounded = Math.round(opacity * 1000) / 1000;
      if (el && rounded !== lastOpacity) {
        el.style.opacity = String(rounded);
        lastOpacity = rounded;
      }

      // Idle when nothing is visible (DOM-only chapters): no GPU work at all,
      // except a few frames after a scene loads so it can warm up off-screen.
      if (stageState.anyVisible || stageState.warmFrames > 0) {
        if (stageState.warmFrames > 0) stageState.warmFrames--;
        gl.info.reset();
        advance(now);
      }
    }, FRAME_PRIORITY.webgl);
  }, [advance, gl, wrapperRef]);

  return null;
}
