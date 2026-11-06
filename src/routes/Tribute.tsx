import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { SiteFooter } from '@/components/SiteFooter';
import { SoundToggle } from '@/components/navigation/SoundToggle';
import { useAmbientAudio } from '@/audio/useAmbientAudio';
import { useReducedMotion } from '@/state/runtime';
import { CreatorFacts, WorkFacts } from './TributeFacts';
import './Tribute.css';

/**
 * DEATH NOTE — A TRIBUTE TO ITS CREATORS (SPEC §8). A standalone page with its
 * own art direction: paper, graphite and ink instead of the main site's dark.
 * It depends on nothing from the main experience.
 */
export function Tribute() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useAmbientAudio('tribute');

  useEffect(() => {
    document.title = 'A Tribute to Its Creators · DEATH NOTE — The Judgment (fan tribute)';
  }, []);

  // Gentle reveal as each passage reaches the reading line.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) e.target.classList.add('is-in');
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div ref={rootRef} className="tribute">
      <header className="tribute-bar">
        <Link className="tribute-bar__back" to="/">
          ← The main experience
        </Link>
        <SoundToggle className="tribute-bar__sound" />
      </header>

      <main id="content" tabIndex={-1} className="tribute__main">
        <section className="t-open" aria-labelledby="t-title">
          <div className="t-open__page" aria-hidden="true">
            <span className="t-open__pencil" />
          </div>
          <p className="t-kicker" data-reveal>
            An unofficial fan tribute
          </p>
          <h1 id="t-title" className="t-open__title" data-reveal>
            <span className="t-open__dn">Death Note</span>
            <span className="t-open__sub">A tribute to its creators</span>
          </h1>
          <p className="t-open__line" data-reveal>
            To the minds that imagined it.
            <br />
            To the hands that brought it to life.
          </p>
        </section>

        <section className="t-section t-story" aria-labelledby="t-story-title">
          <header className="t-section__head" data-reveal>
            <p className="t-kicker">The story</p>
            <h2 id="t-story-title" className="t-name">
              Tsugumi Ohba <span lang="ja">大場つぐみ</span>
            </h2>
          </header>
          <div className="t-prose">
            <p data-reveal>
              A notebook that kills is a simple idea. What makes <cite>Death Note</cite>{' '}
              unforgettable is everything built on top of it: a set of rules precise enough to be
              argued like law, and two minds that can only see each other through deduction.
            </p>
            <p data-reveal>
              The story never tells us who is right. It hands us a judge and a detective, lets each
              make the strongest case for himself, and leaves the verdict with the reader. Every
              rule introduced becomes a weapon, an alibi or a trap — and every chapter turns on what
              someone knows, and what they can prove.
            </p>
            <p data-reveal>
              It is a thriller made of conversations, bluffs and patience, and it still feels like a
              game of chess in which both players are sure they have already won.
            </p>
            <CreatorFacts id="ohba" />
          </div>
        </section>

        <section className="t-section t-art" aria-labelledby="t-art-title">
          <header className="t-section__head" data-reveal>
            <p className="t-kicker">The art</p>
            <h2 id="t-art-title" className="t-name">
              Takeshi Obata <span lang="ja">小畑健</span>
            </h2>
          </header>
          <div className="t-prose">
            <p data-reveal>
              The art gives the ideas a body. Faces carry the drama: a calm expression that hides a
              calculation, a stare that already suspects, a smile seen only by the reader.
            </p>
            <p data-reveal>
              Its gods of death are strange and specific; its humans are elegant, tired, proud and
              afraid. Deep blacks, sharp lines and careful compositions turn rooms, rooftops and
              rain into places of tension — so that a scene of two people talking can feel like a
              duel.
            </p>
            <CreatorFacts id="obata" />
          </div>
        </section>

        <section className="t-section t-together" aria-labelledby="t-together-title">
          <header className="t-section__head" data-reveal>
            <p className="t-kicker">Together</p>
            <h2 id="t-together-title" className="t-name t-name--small">
              Words and lines, on the same page
            </h2>
          </header>
          <div className="t-prose">
            <p data-reveal>
              On the page, the writing and the drawing are impossible to separate. Dense reasoning
              becomes readable because it is staged; quiet panels become unbearable because of what
              the words have made us expect.
            </p>
            <p data-reveal>
              Story and art meet in the same place a name meets the notebook — on paper — and the
              result has stayed with readers long after the final page.
            </p>
          </div>
        </section>

        <WorkFacts />

        <section className="t-final" aria-labelledby="t-final-title">
          <h2 id="t-final-title" className="visually-hidden">
            Thank you
          </h2>
          <div className="t-final__book" aria-hidden="true" />
          <div className="t-dedication">
            <p data-reveal>Some stories entertain us.</p>
            <p data-reveal>Some stories challenge the way we think.</p>
            <p data-reveal>And some remain with us long after the final page.</p>
            <p className="t-dedication__thanks" data-reveal>
              Thank you, Tsugumi Ohba and Takeshi Obata, for creating <cite>Death Note</cite>.
            </p>
            <p className="t-dedication__sign" data-reveal>
              — with gratitude, from fans
            </p>
          </div>
        </section>
      </main>

      <SiteFooter variant="tribute" />
    </div>
  );
}
