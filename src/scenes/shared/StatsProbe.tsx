import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { useRuntime } from '@/state/runtime';
import { PRIORITY } from './sceneFrame';
import { stageState } from './stageState';

export interface DebugStats {
  fps: number;
  frameMsP95: number;
  calls: number;
  triangles: number;
  geometries: number;
  textures: number;
  programs: number;
  tier: string;
  mounted: string[];
  ready: string[];
  a: string | null;
  b: string | null;
  mix: number;
}

declare global {
  interface Window {
    __DN__?: DebugStats;
  }
}

/** `?debug` only: publishes renderer stats to window.__DN__ for the overlay and e2e leak checks. */
export function StatsProbe() {
  const samples = useRef<number[]>([]);
  const last = useRef(performance.now());

  useFrame(({ gl }) => {
    const now = performance.now();
    const dt = now - last.current;
    last.current = now;
    const s = samples.current;
    s.push(dt);
    if (s.length > 90) s.shift();
    const sorted = [...s].sort((x, y) => x - y);
    const avg = s.reduce((x, y) => x + y, 0) / s.length;
    const mounted = [...stageState.textures.keys()];
    window.__DN__ = {
      fps: Math.round(1000 / avg),
      frameMsP95: Math.round((sorted[Math.floor(sorted.length * 0.95)] ?? 0) * 10) / 10,
      calls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
      geometries: gl.info.memory.geometries,
      textures: gl.info.memory.textures,
      programs: gl.info.programs?.length ?? 0,
      tier: useRuntime.getState().tier,
      mounted,
      ready: [...stageState.ready],
      a: stageState.a.key,
      b: stageState.b.key,
      mix: Math.round(stageState.mix * 100) / 100,
    };
  }, PRIORITY.stats);

  return null;
}
