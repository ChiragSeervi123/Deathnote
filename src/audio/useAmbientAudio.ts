import { useEffect } from 'react';
import { CHAPTER_BY_ID } from '@/chapters/chapterData';
import { useRuntime } from '@/state/runtime';
import { useSettings } from '@/state/settings';
import { getAudioEngine, SCENE_MIX } from './engine';

/**
 * Connects the sound toggle and the active chapter to the audio engine.
 * Failures disable the toggle with an explanation; nothing else is affected.
 */
export function useAmbientAudio(sceneOverride?: string): void {
  const enabled = useSettings((s) => s.soundEnabled);
  const active = useRuntime((s) => s.activeChapter);
  const setAudioError = useRuntime((s) => s.setAudioError);
  const sceneKey = sceneOverride ?? CHAPTER_BY_ID.get(active)?.scene ?? 'prologue';

  useEffect(() => {
    const engine = getAudioEngine();
    engine.setEnabled(enabled).catch((err: unknown) => {
      setAudioError(err instanceof Error ? err.message : 'Sound could not start.');
      useSettings.getState().setSound(false);
    });
  }, [enabled, setAudioError]);

  useEffect(() => {
    getAudioEngine().setMix(SCENE_MIX[sceneKey] ?? { drone: 0.4 });
  }, [sceneKey]);

  useEffect(
    () => () => {
      void getAudioEngine().setEnabled(false);
    },
    [],
  );
}
