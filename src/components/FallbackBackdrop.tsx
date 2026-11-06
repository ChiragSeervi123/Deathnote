import { CHAPTER_BY_ID, formatChapterNumber } from '@/chapters/chapterData';
import type { Palette } from '@/chapters/types';
import { useRuntime } from '@/state/runtime';
import './FallbackBackdrop.css';

const PALETTES: readonly Palette[] = [
  'obsidian',
  'ash',
  'crimson',
  'cold',
  'paper',
  'dusk',
  'gold',
];

/**
 * Designed 2D backdrop (SPEC §11.4): shown behind the canvas while scenes
 * load, and on its own when WebGL is unavailable. Cross-fades by chapter
 * palette; purely decorative.
 */
export function FallbackBackdrop() {
  const active = useRuntime((s) => s.activeChapter);
  const chapter = CHAPTER_BY_ID.get(active);
  const palette = chapter?.palette ?? 'obsidian';

  return (
    <div className="backdrop" aria-hidden="true">
      {PALETTES.map((p) => (
        <div key={p} className={`backdrop__layer backdrop__layer--${p}`} data-on={p === palette} />
      ))}
      {chapter ? (
        <div className="backdrop__numeral">{formatChapterNumber(chapter.number)}</div>
      ) : null}
      <div className="backdrop__grain" />
      <div className="backdrop__vignette" />
    </div>
  );
}
