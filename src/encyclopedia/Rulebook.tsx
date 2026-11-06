import { useDeferredValue, useId, useMemo, useState } from 'react';
import { RULE_CATEGORIES, RULES } from '@/data/rules';
import type { RuleCategory } from '@/data/types';
import { CanonBadge, Sources } from './shared';

type CanonFilter = 'all' | 'both' | 'manga' | 'fake';

const CANON_FILTERS: ReadonlyArray<readonly [CanonFilter, string]> = [
  ['all', 'All rules'],
  ['both', 'Anime & manga'],
  ['manga', 'Manga only'],
  ['fake', 'Fake rules'],
];

/** Chapter 16 — the complete rulebook (SPEC §7): filterable, searchable, sourced. */
export function Rulebook() {
  const [category, setCategory] = useState<RuleCategory | 'all'>('all');
  const [canon, setCanon] = useState<CanonFilter>('all');
  const [query, setQuery] = useState('');
  const q = useDeferredValue(query.trim().toLowerCase());
  const searchId = useId();
  const groupName = useId();
  const canonName = useId();

  const counts = useMemo(() => {
    const c = new Map<RuleCategory, number>();
    for (const r of RULES) c.set(r.category, (c.get(r.category) ?? 0) + 1);
    return c;
  }, []);

  const results = useMemo(
    () =>
      RULES.filter((r) => {
        if (category !== 'all' && r.category !== category) return false;
        if (canon === 'fake' && !r.fake) return false;
        if ((canon === 'both' || canon === 'manga') && (r.fake || r.canon !== canon)) return false;
        if (!q) return true;
        return `${r.title} ${r.plain} ${r.detail ?? ''} ${r.storyRelevance ?? ''} ${r.ref}`.toLowerCase().includes(q);
      }),
    [category, canon, q],
  );

  return (
    <div className="rulebook">
      <div className="rulebook__intro lf-intro">
        <p>
          The notebook comes with instructions. Some appear on screen in the anime; many more exist only in the manga
          and its official guidebook. Each rule below is paraphrased in plain language, labelled by where it appears,
          and linked to its sources. Two of them were never true.
        </p>
      </div>

      <div className="rulebook__controls" role="search">
        <div className="field">
          <label htmlFor={searchId} className="mono-label">
            Search the rules
          </label>
          <input
            id={searchId}
            type="search"
            className="field__input"
            placeholder="e.g. 40 seconds, eyes, ownership"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <fieldset className="chips">
          <legend className="mono-label">Topic</legend>
          <label className="chip">
            <input type="radio" name={groupName} checked={category === 'all'} onChange={() => setCategory('all')} />
            <span>All ({RULES.length})</span>
          </label>
          {(Object.keys(RULE_CATEGORIES) as RuleCategory[])
            .filter((c) => c !== 'fake')
            .map((c) => (
              <label key={c} className="chip">
                <input type="radio" name={groupName} checked={category === c} onChange={() => setCategory(c)} />
                <span>
                  {RULE_CATEGORIES[c].label} ({counts.get(c) ?? 0})
                </span>
              </label>
            ))}
        </fieldset>

        <fieldset className="chips">
          <legend className="mono-label">Source</legend>
          {CANON_FILTERS.map(([v, label]) => (
            <label key={v} className="chip">
              <input type="radio" name={canonName} checked={canon === v} onChange={() => setCanon(v)} />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>
      </div>

      <p className="rulebook__count mono-label" aria-live="polite">
        Showing {results.length} of {RULES.length} rules
      </p>

      {category !== 'all' ? <p className="rulebook__catdesc">{RULE_CATEGORIES[category].description}</p> : null}

      <ol className="rules">
        {results.map((r) => (
          <li key={r.id} className={`rule${r.fake ? ' rule--fake' : ''}`}>
            <div className="rule__head">
              <span className="rule__ref mono-label">{r.ref}</span>
              <CanonBadge canon={r.canon} fake={r.fake} />
              <span className="rule__cat mono-label">{RULE_CATEGORIES[r.category].label}</span>
            </div>
            <h3 className="rule__title">{r.title}</h3>
            <p className="rule__plain">{r.plain}</p>
            {r.detail ? <p className="rule__detail">{r.detail}</p> : null}
            {r.storyRelevance ? (
              <details className="rule__story">
                <summary>In the story</summary>
                <p>{r.storyRelevance}</p>
              </details>
            ) : null}
            <Sources sources={r.sources} />
          </li>
        ))}
      </ol>
      {results.length === 0 ? <p className="rulebook__empty">No rule matches. Try another word or topic.</p> : null}
    </div>
  );
}
