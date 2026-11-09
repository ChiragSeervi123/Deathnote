import { useEffect, useRef } from 'react';
import { addFrameCallback, FRAME_PRIORITY } from '@/animation/loop';
import { getChapterScroll } from '@/animation/scroll/scrollState';
import { audioCue } from '@/audio/engine';
import { useNotebookInspect } from '@/scenes/notebook/inspectStore';
import { PAGE_RULES } from '@/scenes/props/notebook/notebookTextures';
import { useRuntime } from '@/state/runtime';
import './NotebookInspector.css';

/**
 * DOM control for exploring the 3D notebook at the end of Chapter 01. Every
 * 3D interaction has this keyboard-accessible equivalent (SPEC §12).
 */
export function NotebookInspector() {
  const ref = useRef<HTMLDivElement>(null);
  const { active, page, pageCount, open, close, next, prev } = useNotebookInspect();
  const webgl = useRuntime((s) => s.webgl);

  // Visible only near the end of the chapter; leaving the chapter exits inspect mode.
  useEffect(() => {
    let last = -1;
    return addFrameCallback(() => {
      const s = getChapterScroll('notebook');
      const show = s.visible && s.progress > 0.86 && s.exit < 0.35;
      const o = show ? 1 : 0;
      if (o !== last && ref.current) {
        ref.current.style.opacity = String(o);
        ref.current.style.visibility = show ? 'visible' : 'hidden';
        last = o;
      }
      if (!show && useNotebookInspect.getState().active) useNotebookInspect.getState().close();
    }, FRAME_PRIORITY.dom);
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, next, prev, close]);

  useEffect(() => {
    if (active) audioCue('page');
  }, [page, active]);

  if (webgl !== 'ready' && webgl !== 'pending') return null;

  const rule = PAGE_RULES[page];
  return (
    <div ref={ref} className="inspector" style={{ opacity: 0, visibility: 'hidden' }}>
      {!active ? (
        <button type="button" className="button" onClick={open}>
          Explore the notebook
        </button>
      ) : (
        <div className="inspector__panel" role="group" aria-label="Notebook pages">
          <p className="mono-label inspector__count" aria-live="polite">
            Page {page + 1} / {pageCount}
          </p>
          <p className="inspector__rule">{rule ?? 'A blank page.'}</p>
          <div className="inspector__actions">
            <button type="button" className="button" onClick={prev} disabled={page === 0}>
              ← Previous
            </button>
            <button type="button" className="button" onClick={next} disabled={page >= pageCount - 1}>
              Next →
            </button>
            <button type="button" className="button button--ghost" onClick={close}>
              Done
            </button>
          </div>
          <p className="inspector__hint">Arrow keys turn the pages · Esc to finish</p>
        </div>
      )}
    </div>
  );
}
