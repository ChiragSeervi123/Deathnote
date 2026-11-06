import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react';
import { CHAPTER_BY_ID } from '@/chapters/chapterData';
import { CHARACTERS } from '@/data/characters';
import { TIMELINE } from '@/data/timeline';
import type { ArcId, CharacterId, CharacterProfile } from '@/data/types';
import { CanonBadge, Sources } from './shared';

const TIER_LABEL: Record<1 | 2 | 3, string> = { 1: 'Principal', 2: 'Major', 3: 'Supporting' };

const ARC_LABEL: Record<ArcId, string> = {
  origin: 'Origin',
  investigation: 'The investigation',
  'second-kira': 'The second Kira',
  confinement: 'Confinement',
  yotsuba: 'Yotsuba',
  'end-of-l': 'The end of L',
  successors: 'Successors',
  'new-kira': 'The new Kira era',
  finale: 'Finale',
};

const BY_ID = new Map<CharacterId, CharacterProfile>(CHARACTERS.map((c) => [c.id, c]));

function initials(name: string): string {
  const parts = name
    .replace(/[^A-Za-z .-]/g, '')
    .split(/[\s.-]+/)
    .filter(Boolean);
  if (parts.length === 1) return parts[0]!.slice(0, 1);
  return `${parts[0]![0]}${parts[parts.length - 1]![0]}`;
}

/** Chapter 18 — the character archive, plus the event timeline. */
export function CharacterArchive() {
  const [view, setView] = useState<'people' | 'timeline'>('people');
  const tabsId = useId();
  return (
    <div className="archive">
      <div className="lf-intro">
        <p>
          Detectives, gods of death, believers and bystanders. Each profile follows a person through
          the story — who they were, what they wanted, and what the notebook made of them.
        </p>
      </div>
      <div className="tabs" role="tablist" aria-label="Archive views">
        {(['people', 'timeline'] as const).map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            id={`${tabsId}-${v}`}
            aria-selected={view === v}
            aria-controls={`${tabsId}-${v}-panel`}
            className="tab"
            onClick={() => setView(v)}
          >
            {v === 'people' ? `People (${CHARACTERS.length})` : `Timeline (${TIMELINE.length})`}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${tabsId}-${view}-panel`} aria-labelledby={`${tabsId}-${view}`}>
        {view === 'people' ? <People /> : <Timeline />}
      </div>
    </div>
  );
}

function People() {
  const [query, setQuery] = useState('');
  const [tier, setTier] = useState<0 | 1 | 2 | 3>(0);
  const [openId, setOpenId] = useState<CharacterId | null>(null);
  const q = useDeferredValue(query.trim().toLowerCase());
  const searchId = useId();
  const tierName = useId();

  const list = useMemo(
    () =>
      CHARACTERS.filter(
        (c) =>
          (tier === 0 || c.tier === tier) &&
          (!q || `${c.name} ${(c.aliases ?? []).join(' ')} ${c.role}`.toLowerCase().includes(q)),
      ),
    [q, tier],
  );

  return (
    <>
      <div className="rulebook__controls" role="search">
        <div className="field">
          <label htmlFor={searchId} className="mono-label">
            Search by name, alias or role
          </label>
          <input
            id={searchId}
            type="search"
            className="field__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Ryuzaki, SPK, prosecutor"
          />
        </div>
        <fieldset className="chips">
          <legend className="mono-label">Show</legend>
          {([0, 1, 2, 3] as const).map((t) => (
            <label key={t} className="chip">
              <input
                type="radio"
                name={tierName}
                checked={tier === t}
                onChange={() => setTier(t)}
              />
              <span>{t === 0 ? 'Everyone' : TIER_LABEL[t]}</span>
            </label>
          ))}
        </fieldset>
      </div>
      <p className="rulebook__count mono-label" aria-live="polite">
        {list.length} {list.length === 1 ? 'person' : 'people'}
      </p>
      <ul className="plates">
        {list.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className={`plate plate--${c.affiliation} plate--t${c.tier}`}
              onClick={() => setOpenId(c.id)}
              aria-haspopup="dialog"
            >
              <span className="plate__mono" aria-hidden="true">
                {initials(c.name)}
              </span>
              <span className="plate__name">{c.name}</span>
              <span className="plate__role">{c.role}</span>
              <span className="plate__tier mono-label">{TIER_LABEL[c.tier]}</span>
            </button>
          </li>
        ))}
      </ul>
      <ProfileDialog id={openId} onClose={() => setOpenId(null)} onNavigate={setOpenId} />
    </>
  );
}

function ProfileDialog({
  id,
  onClose,
  onNavigate,
}: {
  id: CharacterId | null;
  onClose: () => void;
  onNavigate: (id: CharacterId) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [reveal, setReveal] = useState(false);
  const headingId = useId();
  const c = id ? BY_ID.get(id) : undefined;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (c && !d.open) d.showModal();
    if (!c && d.open) d.close();
  }, [c]);

  useEffect(() => setReveal(false), [id]);

  return (
    <dialog ref={ref} className="profile-dialog" aria-labelledby={headingId} onClose={onClose}>
      {c ? (
        <article className="profile">
          <header className="profile__head">
            <span className="plate__mono profile__mono" aria-hidden="true">
              {initials(c.name)}
            </span>
            <div>
              <p className="mono-label">
                {TIER_LABEL[c.tier]} · First appears in episode {c.introduced.episode}
                {CHAPTER_BY_ID.get(c.introduced.chapter)
                  ? ` · Chapter ${String(CHAPTER_BY_ID.get(c.introduced.chapter)!.number).padStart(2, '0')}`
                  : ''}
              </p>
              <h3 id={headingId} className="profile__name">
                {c.name}
                {c.nameJa ? (
                  <span lang="ja" className="profile__ja">
                    {c.nameJa}
                  </span>
                ) : null}
              </h3>
              <p className="profile__role">{c.role}</p>
              {c.aliases?.length ? (
                <p className="profile__aliases">Also known as {c.aliases.join(', ')}</p>
              ) : null}
            </div>
            <button type="button" className="notebook-page__close profile__close" onClick={onClose}>
              <span aria-hidden="true">×</span>
              <span className="visually-hidden">Close profile</span>
            </button>
          </header>

          <div className="profile__body">
            <section>
              <h4 className="mono-label">Story</h4>
              <p>{c.summary}</p>
            </section>
            <section>
              <h4 className="mono-label">Personality & motives</h4>
              <p>{c.personality}</p>
            </section>
            <section>
              <h4 className="mono-label">Why they matter</h4>
              <p>{c.significance}</p>
            </section>
            {c.keyEvents.length ? (
              <section>
                <h4 className="mono-label">Key events</h4>
                <ol className="profile__events">
                  {c.keyEvents.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ol>
              </section>
            ) : null}
            {c.relationships.length ? (
              <section>
                <h4 className="mono-label">Relationships</h4>
                <ul className="profile__rels">
                  {c.relationships.map((r) => {
                    const other = BY_ID.get(r.to);
                    return (
                      <li key={`${r.to}-${r.kind}`}>
                        {other ? (
                          <button
                            type="button"
                            className="link-button"
                            onClick={() => onNavigate(r.to)}
                          >
                            {other.name}
                          </button>
                        ) : (
                          r.to
                        )}{' '}
                        <span className="profile__relkind mono-label">
                          {r.kind.replace('-', ' ')}
                        </span>{' '}
                        — {r.label}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ) : null}
            {c.fate ? (
              <section className="profile__fate">
                <h4 className="mono-label">Fate</h4>
                {c.spoiler && !reveal ? (
                  <button type="button" className="button" onClick={() => setReveal(true)}>
                    Reveal ending spoiler
                  </button>
                ) : (
                  <p>{c.fate}</p>
                )}
              </section>
            ) : null}
            {c.canonNotes ? (
              <section>
                <h4 className="mono-label">Anime & manga</h4>
                <p>{c.canonNotes}</p>
              </section>
            ) : null}
            <Sources sources={c.sources} />
          </div>
        </article>
      ) : null}
    </dialog>
  );
}

function Timeline() {
  const groups = useMemo(() => {
    const m = new Map<ArcId, typeof TIMELINE>();
    for (const e of TIMELINE) m.set(e.arc, [...(m.get(e.arc) ?? []), e]);
    return [...m.entries()];
  }, []);
  return (
    <div className="timeline">
      <p className="timeline__note">
        Dates follow the manga’s calendar; the anime places the same events three years later.
        Undated events are ordered by episode.
      </p>
      {groups.map(([arc, events]) => (
        <section key={arc} className="timeline__arc" aria-labelledby={`arc-${arc}`}>
          <h3 id={`arc-${arc}`} className="timeline__arc-title">
            {ARC_LABEL[arc]}
          </h3>
          <ol className="timeline__list">
            {events.map((e) => (
              <li key={e.id} className="timeline__item">
                <p className="mono-label timeline__meta">
                  Ep. {Array.isArray(e.episode) ? `${e.episode[0]}–${e.episode[1]}` : e.episode}
                  {e.date ? ` · ${e.date}` : ''}
                  {e.canon !== 'both' ? <CanonBadge canon={e.canon} /> : null}
                </p>
                <h4 className="timeline__title">{e.title}</h4>
                <p>{e.summary}</p>
                {e.note ? <p className="record__note">{e.note}</p> : null}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
