import { useEffect, useState } from 'react';
import type { DebugStats } from '@/scenes/shared/StatsProbe';
import { useRuntime } from '@/state/runtime';

/** `?debug` overlay: frame rate, draw calls and GPU memory counters. */
export function DebugOverlay() {
  const [stats, setStats] = useState<DebugStats | null>(null);
  const webgl = useRuntime((s) => s.webgl);
  const active = useRuntime((s) => s.activeChapter);

  useEffect(() => {
    const id = window.setInterval(() => setStats(window.__DN__ ? { ...window.__DN__ } : null), 500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 8,
        top: 56,
        zIndex: 999,
        padding: '8px 10px',
        background: 'rgb(0 0 0 / 0.78)',
        color: '#9fe',
        font: '11px/1.5 ui-monospace, Consolas, monospace',
        whiteSpace: 'pre',
        pointerEvents: 'none',
      }}
    >
      {`webgl ${webgl}  chapter ${active}\n`}
      {stats
        ? `fps ${stats.fps}  p95 ${stats.frameMsP95}ms  tier ${stats.tier}\n` +
          `calls ${stats.calls}  tris ${stats.triangles}\n` +
          `geo ${stats.geometries}  tex ${stats.textures}  prog ${stats.programs}\n` +
          `layers ${stats.mounted.join(',')}  ready ${stats.ready.join(',')}\n` +
          `A ${stats.a}  B ${stats.b}  mix ${stats.mix}`
        : 'stage idle'}
    </div>
  );
}
