import { lazy, Suspense, useEffect } from 'react';
import { scrollState } from '@/animation/scroll/scrollState';
import { ErrorBoundary } from '@/app/ErrorBoundary';
import { useRuntime } from '@/state/runtime';
import { urlFlags } from '@/utils/urlFlags';
import { probeWebGL2 } from '@/utils/webgl';

const Stage = lazy(() => import('./Stage'));

/**
 * Decides between the WebGL stage and the 2D-only experience (SPEC §11.4).
 * The three.js chunk is only downloaded when WebGL2 is usable.
 */
export function StageHost() {
  const webgl = useRuntime((s) => s.webgl);
  const setWebGL = useRuntime((s) => s.setWebGL);

  useEffect(() => {
    if (!urlFlags.webgl) {
      setWebGL('unsupported', 'WebGL disabled by ?webgl=0.');
      return;
    }
    const probe = probeWebGL2();
    if (!probe.ok) setWebGL('unsupported', probe.reason);
    else if (useRuntime.getState().webgl === 'pending') setWebGL('pending');
  }, [setWebGL]);

  // Pointer for subtle parallax (normalised device coordinates).
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      scrollState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
      scrollState.pointer.active = true;
    };
    const onLeave = () => {
      scrollState.pointer.active = false;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  if (webgl === 'unsupported' || webgl === 'failed') return null;
  if (!urlFlags.webgl || !probeWebGL2().ok) return null;

  return (
    <ErrorBoundary
      fallback={null}
      onError={(err) => useRuntime.getState().setWebGL('failed', err.message)}
    >
      <Suspense fallback={null}>
        <Stage />
      </Suspense>
    </ErrorBoundary>
  );
}
