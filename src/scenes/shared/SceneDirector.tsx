import { useMemo } from 'react';
import { CHAPTERS, chapterIndex } from '@/chapters/chapterData';
import { useRuntime } from '@/state/runtime';
import { isSceneBuilt } from '../registry';
import { SceneLayer } from './SceneLayer';
import { mountWindow } from './sceneSchedule';

/**
 * Decides which scenes exist (React, low frequency): the active chapter's
 * scene and its neighbours. Everything else is unmounted and disposed.
 * Per-frame scheduling lives in `frameDriver.ts`.
 */
export function SceneDirector() {
  const active = useRuntime((s) => s.activeChapter);
  const idx = Math.max(0, chapterIndex(active));
  const keys = useMemo(() => mountWindow(CHAPTERS, idx).filter(isSceneBuilt), [idx]);

  return (
    <>
      {keys.map((k) => (
        <SceneLayer key={k} sceneKey={k} />
      ))}
    </>
  );
}
