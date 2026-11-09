import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { registerTrack } from '@/animation/scroll/chapterTracker';
import { formatChapterNumber } from '../chapterData';
import type { Beat, ChapterDef } from '../types';
import { ChapterRecord } from '@/encyclopedia/ChapterRecord';
import { DossierView } from './DossierView';
import { NotebookInspector } from './NotebookInspector';
import { useBeatChoreography } from './useBeatChoreography';
import './ChapterSection.css';

interface Props {
  chapter: ChapterDef;
  /** Long-form body (encyclopedia chapters). */
  children?: ReactNode;
}

export function ChapterSection({ chapter, children }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const titleId = `chapter-${chapter.id}-title`;

  useEffect(() => {
    const el = trackRef.current;
    return el ? registerTrack(chapter.id, el) : undefined;
  }, [chapter.id]);

  useBeatChoreography(chapter.id, chapter.beats, stageRef);

  if (chapter.layout === 'longform') {
    return (
      <section
        id={`chapter-${chapter.id}`}
        className={`chapter chapter--longform chapter--${chapter.palette}`}
        aria-labelledby={titleId}
        data-chapter={chapter.id}
      >
        <div ref={trackRef} className="longform">
          <header className="longform__header">
            <p className="mono-label">
              <span className="longform__num">{formatChapterNumber(chapter.number)}</span>
              {chapter.kicker}
            </p>
            <h2 id={titleId} className="longform__title" tabIndex={-1}>
              {chapter.title}
            </h2>
            <p className="longform__subtitle">{chapter.subtitle}</p>
          </header>
          <div className="longform__body">{children}</div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={`chapter-${chapter.id}`}
      className={`chapter chapter--cinematic chapter--${chapter.palette}`}
      aria-labelledby={titleId}
      data-chapter={chapter.id}
    >
      <div
        ref={trackRef}
        className="chapter__track"
        style={{ '--len': chapter.length } as CSSProperties}
      >
        <div ref={stageRef} className="chapter__stage">
          <p className="visually-hidden">Scene: {chapter.sceneDescription}</p>
          {chapter.id === 'notebook' ? <NotebookInspector /> : null}
          {chapter.beats.map((beat, i) => (
            <BeatView key={i} index={i} beat={beat} chapter={chapter} titleId={titleId} />
          ))}
        </div>
      </div>
      {chapter.dossier ? <DossierView chapter={chapter} dossier={chapter.dossier} /> : null}
      <ChapterRecord chapterId={chapter.id} title={chapter.title} />
    </section>
  );
}

function BeatView({
  beat,
  index,
  chapter,
  titleId,
}: {
  beat: Beat;
  index: number;
  chapter: ChapterDef;
  titleId: string;
}) {
  const anchorClass = `beat beat--${beat.anchor} beat--${beat.kind}`;

  if (beat.kind === 'title') {
    const isPrologue = chapter.number === 0;
    return (
      <div className={anchorClass}>
        <div className="beat__inner" data-beat={index}>
          {isPrologue ? (
            <div className="hero">
              <p className="mono-label hero__kicker">An unofficial fan tribute</p>
              <h1 className="hero__title">
                <span className="hero__word">Death</span> <span className="hero__word">Note</span>
                <span className="visually-hidden"> — </span>
                <span className="hero__sub">The Judgment</span>
              </h1>
              <p className="hero__chapter mono-label">
                <span aria-hidden="true" className="hero__rule" />
                {chapter.kicker} ·{' '}
                <span id={titleId} tabIndex={-1} role="heading" aria-level={2}>
                  {chapter.title}
                </span>
              </p>
            </div>
          ) : (
            <>
              <p className="beat__kicker mono-label">
                <span className="beat__num">{formatChapterNumber(chapter.number)}</span>
                {chapter.kicker}
              </p>
              <h2 id={titleId} className="beat__title" tabIndex={-1}>
                {beat.text}
              </h2>
              <p className="beat__subtitle">{chapter.subtitle}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={anchorClass}>
      <div className="beat__inner" data-beat={index}>
        {beat.meta || beat.canon ? (
          <p className="beat__meta mono-label">
            {beat.meta}
            {beat.canon ? (
              <span className={`canon-badge canon-badge--${beat.canon}`}>{beat.canon} only</span>
            ) : null}
          </p>
        ) : null}
        <p className="beat__text">{beat.text}</p>
      </div>
    </div>
  );
}
