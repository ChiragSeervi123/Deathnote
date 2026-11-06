import { useEffect } from 'react';
import { CHAPTERS } from '@/chapters/chapterData';
import { ChapterSection } from '@/chapters/sections/ChapterSection';
import { startChapterTracker } from '@/animation/scroll/chapterTracker';
import { disableSmoothScroll, enableSmoothScroll } from '@/animation/scroll/smoothScroll';
import { DebugOverlay } from '@/components/DebugOverlay';
import { FallbackBackdrop } from '@/components/FallbackBackdrop';
import { ChapterRail } from '@/components/navigation/ChapterRail';
import { FloatingControls } from '@/components/navigation/FloatingControls';
import { NotebookIndex } from '@/components/navigation/NotebookIndex';
import { TopBar } from '@/components/navigation/TopBar';
import { SiteFooter } from '@/components/SiteFooter';
import { SpoilerGate } from '@/components/SpoilerGate';
import { LongformBody } from '@/encyclopedia/LongformBody';
import { StageHost } from '@/scenes/shared/StageHost';
import { useReducedMotion } from '@/state/runtime';
import { useSettings } from '@/state/settings';
import { urlFlags } from '@/utils/urlFlags';
import { useAmbientAudio } from '@/audio/useAmbientAudio';

export function MainExperience() {
  const accepted = useSettings((s) => s.spoilerAccepted);
  const reduced = useReducedMotion();

  useEffect(() => {
    document.title = 'DEATH NOTE — The Judgment · An unofficial fan tribute';
  }, []);

  useEffect(() => startChapterTracker(), []);

  useEffect(() => {
    if (reduced) disableSmoothScroll();
    else enableSmoothScroll();
    return () => disableSmoothScroll();
  }, [reduced]);

  useAmbientAudio();

  return (
    <div className="experience">
      <FallbackBackdrop />
      <StageHost />
      <div className="experience__chrome" inert={!accepted}>
        <TopBar />
        <ChapterRail />
        <NotebookIndex />
        <FloatingControls />
      </div>
      <main id="content" tabIndex={-1} className="experience__main" inert={!accepted}>
        {CHAPTERS.map((c) => (
          <ChapterSection key={c.id} chapter={c}>
            {c.layout === 'longform' ? <LongformBody id={c.id} /> : null}
          </ChapterSection>
        ))}
      </main>
      <div inert={!accepted}>
        <SiteFooter />
      </div>
      {!accepted ? <SpoilerGate /> : null}
      {urlFlags.debug ? <DebugOverlay /> : null}
    </div>
  );
}
