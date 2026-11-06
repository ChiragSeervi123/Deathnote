import type { Canon, SourceRef } from '@/data/types';

/** Canon label: never colour alone — always text (SPEC §12). */
export function CanonBadge({ canon, fake = false }: { canon: Canon; fake?: boolean }) {
  if (fake) return <span className="canon-badge canon-badge--fake">Fake rule</span>;
  const label = canon === 'both' ? 'Anime & manga' : canon === 'manga' ? 'Manga only' : 'Anime only';
  return <span className={`canon-badge canon-badge--${canon}`}>{label}</span>;
}

export function Sources({ sources }: { sources: readonly SourceRef[] }) {
  if (!sources.length) return null;
  return (
    <p className="sources">
      <span className="mono-label">Sources</span>{' '}
      {sources.map((s, i) => (
        <span key={`${s.label}-${i}`}>
          {i > 0 ? ' · ' : ''}
          {s.url ? (
            <a href={s.url} target="_blank" rel="noreferrer noopener">
              {s.label}
            </a>
          ) : (
            s.label
          )}
        </span>
      ))}
    </p>
  );
}
