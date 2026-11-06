import { CREATORS, WORK_FACTS } from '@/data/creators';
import type { CreatorFact } from '@/data/types';

function FactList({ facts }: { facts: readonly CreatorFact[] }) {
  return (
    <ul className="t-facts">
      {facts.map((f) => (
        <li key={f.text}>
          {f.text}
          <span className="t-facts__src">
            {' '}
            {f.sources.map((s, i) => (
              <span key={`${s.label}-${i}`}>
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`Source: ${s.label}`}
                  >
                    [{i + 1}]
                  </a>
                ) : (
                  `[${s.label}]`
                )}
              </span>
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Verified, public, professional facts only (docs/content/creators-and-production.md). */
export function CreatorFacts({ id }: { id: 'ohba' | 'obata' }) {
  const creator = CREATORS.find((c) => c.id === id);
  if (!creator) return null;
  return (
    <div className="t-record" data-reveal>
      <p className="t-kicker">On record</p>
      <FactList facts={creator.facts} />
    </div>
  );
}

export function WorkFacts() {
  return (
    <section className="t-section t-work" aria-labelledby="t-work-title">
      <header className="t-section__head" data-reveal>
        <p className="t-kicker">The work</p>
        <h2 id="t-work-title" className="t-name t-name--small">
          From a one-shot to a world
        </h2>
      </header>
      <div data-reveal>
        <FactList facts={WORK_FACTS} />
      </div>
    </section>
  );
}
