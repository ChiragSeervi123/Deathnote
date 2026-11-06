import { CHAPTER_BY_ID, formatChapterNumber } from '@/chapters/chapterData';
import { scrollToTop } from '@/animation/scroll/scrollTo';
import { useRuntime } from '@/state/runtime';
import { SoundToggle } from './SoundToggle';
import './navigation.css';

export function TopBar() {
  const active = useRuntime((s) => s.activeChapter);
  const chapter = CHAPTER_BY_ID.get(active);

  return (
    <header className="topbar">
      <a
        className="topbar__mark"
        href="#content"
        onClick={(e) => {
          e.preventDefault();
          void scrollToTop();
        }}
      >
        <span className="topbar__mark-strong">Death Note</span>
        <span className="topbar__mark-soft">The Judgment</span>
        <span className="visually-hidden"> — back to the beginning</span>
      </a>
      {chapter ? (
        <p className="topbar__chapter mono-label" aria-hidden="true">
          <span className="topbar__chapter-num">{formatChapterNumber(chapter.number)}</span>
          {chapter.title}
        </p>
      ) : null}
      <SoundToggle className="topbar__sound" />
    </header>
  );
}
