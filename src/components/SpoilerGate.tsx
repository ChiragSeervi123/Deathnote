import { useEffect, useId, useRef } from 'react';
import { Link } from 'react-router';
import { getLenis } from '@/animation/scroll/smoothScroll';
import { useSettings } from '@/state/settings';
import './SpoilerGate.css';

/**
 * First-visit spoiler notice (SPEC §13). The page behind is inert until the
 * visitor chooses; the choice is remembered.
 */
export function SpoilerGate() {
  const accept = useSettings((s) => s.acceptSpoilers);
  const enterRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    enterRef.current?.focus();
    const root = document.documentElement;
    root.classList.add('is-gated');
    getLenis()?.stop();
    return () => {
      root.classList.remove('is-gated');
      getLenis()?.start();
    };
  }, []);

  return (
    <div
      className="gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div className="gate__panel">
        <p className="mono-label gate__kicker">Before you enter</p>
        <h2 id={titleId} className="gate__title">
          This experience tells the <em>whole</em> story.
        </h2>
        <div id={descId} className="gate__text">
          <p>
            <strong>DEATH NOTE — The Judgment</strong> is an unofficial fan tribute that follows the
            complete anime, including its ending and every major twist.
          </p>
          <p className="gate__fine">
            Sound is off. You can turn it on, reduce motion, or change visual quality at any time
            from the notebook index.
          </p>
        </div>
        <div className="gate__actions">
          <button ref={enterRef} type="button" className="button button--primary" onClick={accept}>
            Enter the experience
          </button>
          <Link className="button" to="/tribute">
            Visit the creator tribute instead
          </Link>
        </div>
        <p className="gate__disclaimer">
          Made by fans. Not affiliated with or endorsed by Tsugumi Ohba, Takeshi Obata, Shueisha,
          Madhouse or any rights holder.
        </p>
      </div>
    </div>
  );
}
