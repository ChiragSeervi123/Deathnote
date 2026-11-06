import { useEffect, useRef } from 'react';
import { CHAPTERS, formatChapterNumber } from '@/chapters/chapterData';
import { addFrameCallback, FRAME_PRIORITY } from '@/animation/loop';
import { scrollToChapter } from '@/animation/scroll/scrollTo';
import { scrollState } from '@/animation/scroll/scrollState';
import { useRuntime } from '@/state/runtime';

/**
 * Right-edge progress rail (desktop). Fill = chapter index + local progress,
 * written per frame without React renders.
 */
export function ChapterRail() {
  const fillRef = useRef<HTMLSpanElement>(null);
  const active = useRuntime((s) => s.activeChapter);
  const n = CHAPTERS.length;

  useEffect(() => {
    let last = -1;
    return addFrameCallback(() => {
      const el = fillRef.current;
      if (!el) return;
      const i = scrollState.activeIndex;
      const t = scrollState.tracks[i];
      const local = t ? Math.max(t.state.progress, t.state.exit * 0.999) : 0;
      const v = Math.min(1, (i + local) / (n - 1));
      const r = Math.round(v * 1000) / 1000;
      if (r !== last) {
        el.style.transform = `scaleY(${r})`;
        last = r;
      }
    }, FRAME_PRIORITY.dom);
  }, [n]);

  return (
    <nav className="rail" aria-label="Chapter progress">
      <span className="rail__track" aria-hidden="true">
        <span ref={fillRef} className="rail__fill" />
      </span>
      <ol className="rail__ticks">
        {CHAPTERS.map((c, i) => (
          <li key={c.id} className="rail__tick" style={{ top: `${(i / (n - 1)) * 100}%` }}>
            <button
              type="button"
              className={`rail__button${c.id === active ? ' is-active' : ''}`}
              aria-current={c.id === active ? 'location' : undefined}
              onClick={() => void scrollToChapter(c.id)}
            >
              <span className="rail__label">
                <span className="rail__num">{formatChapterNumber(c.number)}</span> {c.title}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
