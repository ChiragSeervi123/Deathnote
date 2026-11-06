import { RULES } from '@/data/rules';
import { CanonBadge, Sources } from './shared';

/** Worked examples — from docs/content/rules-and-mechanics.md §3.2 (original wording). */
const EXAMPLES: ReadonlyArray<{ who: string; with: string; eps: string; text: string }> = [
  {
    who: 'Misa Amane — first trade',
    with: 'Rem',
    eps: 'Eps. 11, 13',
    text: 'She arrives as the second Kira already holding the Eyes, and recognises Light because his is the one lifespan she cannot see.',
  },
  {
    who: 'Misa Amane — second trade',
    with: 'Ryuk',
    eps: 'Ep. 24',
    text: 'With her memories restored she trades again, halving what was left a second time.',
  },
  {
    who: 'Kyosuke Higuchi',
    with: 'Rem',
    eps: 'Ep. 23',
    text: 'A false name fails him, so he takes the Eyes to kill on sight of a face — and walks into L’s trap.',
  },
  {
    who: 'Soichiro Yagami',
    with: 'Ryuk',
    eps: 'Ep. 29',
    text: 'He trades to learn Mello’s true name during the raid, sees it, and is shot before he can write it. Dying, he can see his son’s lifespan, and believes Light cannot be Kira.',
  },
  {
    who: 'Teru Mikami',
    with: 'Ryuk',
    eps: 'Eps. 32, 36–37',
    text: 'At the warehouse he writes every name in the room except Light’s. The Eyes gave him names; the notebook he used had been tampered with.',
  },
];

function SightDiagram() {
  // Five figures; the fourth is a notebook owner — no lifespan above the head.
  const figures = [
    { x: 70, h: 1, life: '41 829 102' },
    { x: 190, h: 0.92, life: '07 113 450' },
    { x: 310, h: 1.04, life: '23 060 217' },
    { x: 430, h: 0.98, life: null },
    { x: 550, h: 0.9, life: '15 902 338' },
  ];
  return (
    <figure className="eyes-figure">
      <svg viewBox="0 0 620 300" role="img" aria-labelledby="eyes-fig-title eyes-fig-desc">
        <title id="eyes-fig-title">What the Eyes see</title>
        <desc id="eyes-fig-desc">
          Five people seen through the Shinigami Eyes. Four have a name and a remaining lifespan
          floating above their heads. The fourth person, a notebook owner, shows a name but no
          lifespan.
        </desc>
        <defs>
          <linearGradient id="eyes-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c92a32" stopOpacity="0.25" />
            <stop offset="1" stopColor="#c92a32" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="620" height="300" fill="url(#eyes-fade)" />
        {figures.map((f, i) => {
          const top = 300 - 170 * f.h;
          return (
            <g key={i} transform={`translate(${f.x} 0)`}>
              <circle cx="0" cy={top + 22} r="20" fill="#0d0c0b" />
              <path
                d={`M-34 300 C-34 ${top + 70} -26 ${top + 48} 0 ${top + 48} C26 ${top + 48} 34 ${top + 70} 34 300 Z`}
                fill="#0d0c0b"
              />
              <rect x="-34" y={top - 40} width="68" height="7" fill="#e8e3d8" opacity="0.85" />
              {f.life ? (
                <text x="0" y={top - 14} textAnchor="middle" className="eyes-figure__num">
                  {f.life}
                </text>
              ) : (
                <text x="0" y={top - 14} textAnchor="middle" className="eyes-figure__none">
                  — no lifespan —
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <figcaption>
        Illustration: names are shown as bars and numbers are invented. A notebook owner’s lifespan
        cannot be seen — the blank space that gives Light away to Misa.
      </figcaption>
    </figure>
  );
}

function PriceDiagram() {
  return (
    <figure className="price">
      <div className="price__row">
        <span className="mono-label">Before</span>
        <span className="price__bar" style={{ width: '100%' }} />
      </div>
      <div className="price__row">
        <span className="mono-label">One trade</span>
        <span className="price__bar" style={{ width: '50%' }} />
        <span className="price__lost" style={{ width: '50%' }} />
      </div>
      <div className="price__row">
        <span className="mono-label">Two trades</span>
        <span className="price__bar" style={{ width: '25%' }} />
        <span className="price__lost" style={{ width: '75%' }} />
      </div>
      <figcaption>
        Each trade costs half of whatever life remains. Misa traded twice, keeping a quarter of the
        life she had.
      </figcaption>
    </figure>
  );
}

/** Chapter 17 — the Eyes and supernatural mechanics. */
export function EyesMechanics() {
  const related = RULES.filter((r) => r.category === 'eyes' || r.category === 'lifespan');

  return (
    <div className="eyes">
      <div className="lf-intro">
        <p>
          A Shinigami sees every human’s name and remaining lifespan at a glance. A human who owns a
          notebook can have the same sight — the Shinigami Eyes — in exchange for half of their
          remaining life.
        </p>
      </div>

      <div className="eyes__grid">
        <SightDiagram />
        <div className="eyes__explain">
          <h3 className="eyes__h">The trade</h3>
          <ol className="eyes__steps">
            <li>
              Only an owner can make the deal — someone who has merely borrowed a notebook cannot.
            </li>
            <li>
              The price is half of the owner’s remaining life. Whoever loses the Eyes by giving up
              the notebook can trade again, paying half of what is left.
            </li>
            <li>
              The Eyes reveal names and lifespans — but not the lifespan of anyone who owns a
              notebook.
            </li>
            <li>A face is now enough: the owner no longer needs to learn a name.</li>
          </ol>
          <PriceDiagram />
        </div>
      </div>

      <h3 className="eyes__h eyes__h--section">Who paid it</h3>
      <ol className="examples">
        {EXAMPLES.map((e) => (
          <li key={e.who} className="example">
            <p className="mono-label">
              With {e.with} · {e.eps}
            </p>
            <h4 className="example__who">{e.who}</h4>
            <p>{e.text}</p>
          </li>
        ))}
      </ol>

      <details className="eyes__rules">
        <summary>The rules behind it ({related.length})</summary>
        <ul>
          {related.map((r) => (
            <li key={r.id}>
              <span className="rule__ref mono-label">{r.ref}</span>{' '}
              <CanonBadge canon={r.canon} fake={r.fake} />
              <strong> {r.title}.</strong> {r.plain}
              <Sources sources={r.sources} />
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
