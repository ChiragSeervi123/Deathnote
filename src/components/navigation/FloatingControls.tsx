import { scrollToChapter, scrollToTop } from '@/animation/scroll/scrollTo';
import { useRuntime } from '@/state/runtime';
import { ArrowUpIcon } from './icons';

/**
 * Context controls bottom-right: "Skip intro" during the prologue (SPEC §9.3),
 * "Back to top" afterwards (SPEC §6.1).
 */
export function FloatingControls() {
  const active = useRuntime((s) => s.activeChapter);

  return (
    <div className="floating">
      {active === 'prologue' ? (
        <button
          type="button"
          className="chrome-button"
          onClick={() => void scrollToChapter('notebook')}
        >
          <span className="chrome-button__label">Skip intro</span>
        </button>
      ) : (
        <button type="button" className="chrome-button" onClick={() => void scrollToTop()}>
          <ArrowUpIcon />
          <span className="chrome-button__label">Top</span>
        </button>
      )}
    </div>
  );
}
