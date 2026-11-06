import { create } from 'zustand';
import type { ChapterId } from '@/data/types';
import type { QualityTier } from '@/scenes/shared/quality';
import { useSettings } from './settings';

export type WebGLStatus = 'pending' | 'ready' | 'unsupported' | 'lost' | 'failed';
export type SceneStatus = 'loading' | 'ready' | 'error';

interface RuntimeState {
  webgl: WebGLStatus;
  webglReason: string | null;
  /** Resolved quality tier currently applied by the stage. */
  tier: QualityTier;
  /** Chapter under the viewport centre (low-frequency; drives navigation UI). */
  activeChapter: ChapterId;
  systemReducedMotion: boolean;
  sceneStatus: Partial<Record<string, SceneStatus>>;
  audioError: string | null;
  setWebGL: (status: WebGLStatus, reason?: string | null) => void;
  setTier: (tier: QualityTier) => void;
  setActiveChapter: (id: ChapterId) => void;
  setSystemReducedMotion: (v: boolean) => void;
  setSceneStatus: (key: string, s: SceneStatus) => void;
  setAudioError: (msg: string | null) => void;
}

const systemReduce =
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const useRuntime = create<RuntimeState>()((set) => ({
  webgl: 'pending',
  webglReason: null,
  tier: 'high',
  activeChapter: 'prologue',
  systemReducedMotion: systemReduce,
  sceneStatus: {},
  audioError: null,
  setWebGL: (webgl, reason = null) => set({ webgl, webglReason: reason }),
  setTier: (tier) => set({ tier }),
  setActiveChapter: (activeChapter) => set({ activeChapter }),
  setSystemReducedMotion: (systemReducedMotion) => set({ systemReducedMotion }),
  setSceneStatus: (key, s) => set((st) => ({ sceneStatus: { ...st.sceneStatus, [key]: s } })),
  setAudioError: (audioError) => set({ audioError }),
}));

/** Effective reduced-motion flag, combining the system setting and the visitor override. */
export function resolveReducedMotion(motion: 'system' | 'reduce' | 'full', system: boolean): boolean {
  return motion === 'reduce' || (motion === 'system' && system);
}

export function useReducedMotion(): boolean {
  const motion = useSettings((s) => s.motion);
  const system = useRuntime((s) => s.systemReducedMotion);
  return resolveReducedMotion(motion, system);
}

/** Non-reactive read for frame loops. */
export function isReducedMotion(): boolean {
  return resolveReducedMotion(useSettings.getState().motion, useRuntime.getState().systemReducedMotion);
}

if (typeof window !== 'undefined' && window.matchMedia) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener?.('change', (e) => useRuntime.getState().setSystemReducedMotion(e.matches));
}
