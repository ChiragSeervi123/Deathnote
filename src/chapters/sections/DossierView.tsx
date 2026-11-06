import { formatChapterNumber } from '../chapterData';
import type { ChapterDef, Dossier } from '../types';

/**
 * The "case file" that follows a cinematic chapter: a calm reading surface
 * with the fuller account and its episode references.
 */
export function DossierView({ chapter, dossier }: { chapter: ChapterDef; dossier: Dossier }) {
  return (
    <aside className="dossier" aria-label={`${chapter.title}: case file`}>
      <div className="dossier__inner">
        <header className="dossier__head">
          <p className="mono-label">
            Case file {formatChapterNumber(chapter.number)} · {dossier.episodes}
          </p>
        </header>
        <div className="dossier__body">
          {dossier.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {dossier.canonNote ? (
            <p className="dossier__canon">
              <span className="canon-badge canon-badge--manga">Anime / manga</span>{' '}
              {dossier.canonNote}
            </p>
          ) : null}
        </div>
        {dossier.facts?.length ? (
          <dl className="dossier__facts">
            {dossier.facts.map((f) => (
              <div key={f.label} className="dossier__fact">
                <dt className="mono-label">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </aside>
  );
}
