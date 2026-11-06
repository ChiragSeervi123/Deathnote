import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router';
import { CHAPTERS, CHAPTER_BY_ID, formatChapterNumber } from '@/chapters/chapterData';
import { scrollToChapter, scrollToTop } from '@/animation/scroll/scrollTo';
import type { ChapterId } from '@/data/types';
import { useRuntime } from '@/state/runtime';
import { CloseIcon, NotebookIcon } from './icons';
import { SettingsPanel } from './SettingsPanel';

/**
 * The floating notebook: the site's primary navigation control (SPEC §6.1).
 * A native <dialog> provides focus containment, Escape to close and focus
 * return without trapping the visitor.
 */
export function NotebookIndex() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const active = useRuntime((s) => s.activeChapter);
  const headingId = useId();
  const current = CHAPTER_BY_ID.get(active);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const go = (id: ChapterId) => {
    setOpen(false);
    // Let the dialog close (and restore focus) before moving focus to the chapter.
    requestAnimationFrame(() => void scrollToChapter(id));
  };

  const story = CHAPTERS.filter((c) => c.layout === 'cinematic');
  const archive = CHAPTERS.filter((c) => c.layout === 'longform');

  return (
    <>
      <button
        type="button"
        className="notebook-fab"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <NotebookIcon size={16} />
        <span className="notebook-fab__label">Index</span>
        {current ? (
          <span className="notebook-fab__count mono-label" aria-hidden="true">
            {formatChapterNumber(current.number)}/{formatChapterNumber(CHAPTERS.length - 1)}
          </span>
        ) : null}
      </button>

      <dialog
        ref={dialogRef}
        className="notebook-dialog"
        aria-labelledby={headingId}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          // Click on the backdrop (outside the page) closes.
          if (e.target === dialogRef.current) setOpen(false);
        }}
      >
        <div className="notebook-page">
          <header className="notebook-page__head">
            <p className="mono-label">Index</p>
            <h2 id={headingId} className="notebook-page__title">
              The notebook
            </h2>
            <button type="button" className="notebook-page__close" onClick={() => setOpen(false)}>
              <CloseIcon />
              <span className="visually-hidden">Close index</span>
            </button>
          </header>

          <nav aria-label="Chapters" className="notebook-page__nav">
            <p className="notebook-page__group mono-label">The story</p>
            <ol className="notebook-list">
              {story.map((c) => (
                <IndexItem key={c.id} id={c.id} active={c.id === active} onGo={go} />
              ))}
            </ol>
            <p className="notebook-page__group mono-label">The archive</p>
            <ol className="notebook-list" start={16}>
              {archive.map((c) => (
                <IndexItem key={c.id} id={c.id} active={c.id === active} onGo={go} />
              ))}
            </ol>
          </nav>

          <div className="notebook-page__aside">
            <Link className="notebook-page__tribute" to="/tribute" onClick={() => setOpen(false)}>
              <span className="mono-label">Separate page</span>
              <span className="notebook-page__tribute-title">A tribute to its creators</span>
            </Link>
            <button
              type="button"
              className="button button--ghost notebook-page__top"
              onClick={() => {
                setOpen(false);
                requestAnimationFrame(() => void scrollToTop());
              }}
            >
              Back to the beginning
            </button>
            <SettingsPanel />
          </div>
        </div>
      </dialog>
    </>
  );
}

function IndexItem({ id, active, onGo }: { id: ChapterId; active: boolean; onGo: (id: ChapterId) => void }) {
  const c = CHAPTER_BY_ID.get(id);
  if (!c) return null;
  return (
    <li className={`notebook-list__item${active ? ' is-active' : ''}`}>
      <button type="button" className="notebook-list__button" aria-current={active ? 'location' : undefined} onClick={() => onGo(id)}>
        <span className="notebook-list__num">{formatChapterNumber(c.number)}</span>
        <span className="notebook-list__title">{c.title}</span>
        {active ? <span className="notebook-list__here">you are here</span> : null}
      </button>
    </li>
  );
}
