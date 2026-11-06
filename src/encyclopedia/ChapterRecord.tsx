import { useMemo } from 'react';
import { EPISODES } from '@/data/episodes';
import { TIMELINE } from '@/data/timeline';
import type { ChapterId } from '@/data/types';
import { formatEpisodes } from './format';
import { CanonBadge } from './shared';

/**
 * The case file that follows a story chapter: the episodes it covers and the
 * key events, straight from the verified data (docs/content/story-reference.md).
 */
export function ChapterRecord({ chapterId, title }: { chapterId: ChapterId; title: string }) {
  const episodes = useMemo(() => EPISODES.filter((e) => e.chapter === chapterId), [chapterId]);
  const events = useMemo(() => TIMELINE.filter((e) => e.chapter === chapterId), [chapterId]);
  if (episodes.length === 0 && events.length === 0) return null;

  return (
    <aside className="record" aria-label={`${title}: case file`}>
      <div className="record__inner">
        <header className="record__head">
          <p className="mono-label">Case file</p>
          <h3 className="record__title">{title}</h3>
          {episodes.length ? (
            <p className="record__eps mono-label">
              Anime episodes {formatEpisodes(episodes.map((e) => e.number))}
            </p>
          ) : null}
        </header>

        {events.length ? (
          <ol className="record__events">
            {events.map((ev) => (
              <li key={ev.id} className="record__event">
                <p className="record__meta mono-label">
                  Ep. {Array.isArray(ev.episode) ? `${ev.episode[0]}–${ev.episode[1]}` : ev.episode}
                  {ev.canon !== 'both' ? <CanonBadge canon={ev.canon} /> : null}
                </p>
                <h4 className="record__event-title">{ev.title}</h4>
                <p>{ev.summary}</p>
                {ev.note ? <p className="record__note">{ev.note}</p> : null}
              </li>
            ))}
          </ol>
        ) : null}

        {episodes.length ? (
          <details className="record__episodes">
            <summary>Episode guide</summary>
            <ol>
              {episodes.map((e) => (
                <li key={e.number}>
                  <span className="mono-label">{String(e.number).padStart(2, '0')}</span>
                  <span className="record__ep-title">{e.title}</span>
                  <span className="record__ep-summary">{e.summary}</span>
                </li>
              ))}
            </ol>
          </details>
        ) : null}
      </div>
    </aside>
  );
}
