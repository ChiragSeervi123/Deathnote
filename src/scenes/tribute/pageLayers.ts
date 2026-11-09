import { mulberry32 } from '@/utils/math';
import { InkLayer, type Pt } from './inkLayer';

/**
 * The tribute page's three original ink layers (no panels or characters are
 * copied; every shape is an abstract composition built here):
 *  - story:    pencil plotting — words taken from the tribute text, joined by
 *              branching lines that converge on one question;
 *  - art:      pen-and-brush panels — rooftops in rain, a field of black cut by
 *              one line of light, a window throwing light into hatching, two
 *              dark forms facing each other across a table;
 *  - together: the question inked into a balloon, its branches inked, focus
 *              lines converging on it — words and lines on the same page.
 */

const WORD = 0.046;

const NODES = {
  notebook: [0.5, 0.2],
  rule: [0.28, 0.35],
  minds: [0.72, 0.35],
  weapon: [0.16, 0.52],
  alibi: [0.33, 0.6],
  trap: [0.46, 0.49],
  judge: [0.6, 0.55],
  detective: [0.83, 0.5],
  bluff: [0.26, 0.79],
  know: [0.6, 0.74],
  prove: [0.71, 0.88],
  question: [0.5, 1.085],
  reader: [0.5, 1.215],
} as const satisfies Record<string, Pt>;

type NodeKey = keyof typeof NODES;

const WORDS: Record<NodeKey, string> = {
  notebook: 'a notebook',
  rule: 'a rule',
  minds: 'two minds',
  weapon: 'a weapon',
  alibi: 'an alibi',
  trap: 'a trap',
  judge: 'a judge',
  detective: 'a detective',
  bluff: 'a bluff',
  know: 'what they know',
  prove: 'what they can prove',
  question: 'who is right?',
  reader: 'the reader',
};

/** A hand-drawn curve between two points: quadratic bend + slight tremor. */
function handCurve(a: Pt, b: Pt, bend: number, rnd: () => number, n = 18): Pt[] {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const cx = mx - dy * bend;
  const cy = my + dx * bend;
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * cx + t * t * b[0];
    const y = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * cy + t * t * b[1];
    const wob = i === 0 || i === n ? 0 : (rnd() - 0.5) * 0.0016;
    out.push([x + wob, y + wob]);
  }
  return out;
}

const below = (k: NodeKey): Pt => [NODES[k][0], NODES[k][1] + 0.018];
const above = (k: NodeKey): Pt => [NODES[k][0], NODES[k][1] - WORD * 0.95];

/* ------------------------------------------------------------------ */

export function buildStory(): InkLayer {
  const L = new InkLayer(0.6);
  const rnd = mulberry32(31);
  const pencil = { w: 0.0034, a: 0.82, speed: 1.1 };
  const word = (k: NodeKey) => L.text(WORDS[k], NODES[k][0], NODES[k][1], WORD, { a: 0.86 });
  const branch = (from: NodeKey, to: NodeKey, bend = 0.12) =>
    L.line(handCurve(below(from), above(to), bend, rnd), pencil);

  const w = word('notebook');
  // Underlined twice, as a premise is.
  L.line(handCurve([0.5 - w / 2, 0.215], [0.5 + w / 2, 0.212], 0.02, rnd), pencil);
  branch('notebook', 'rule', 0.1);
  word('rule');
  branch('rule', 'weapon', 0.1);
  word('weapon');
  branch('rule', 'alibi', -0.05);
  word('alibi');
  branch('rule', 'trap', -0.12);
  word('trap');
  branch('notebook', 'minds', -0.1);
  word('minds');
  branch('minds', 'judge', 0.1);
  word('judge');
  branch('minds', 'detective', -0.1);
  word('detective');
  branch('judge', 'know', 0.05);
  word('know');
  branch('detective', 'prove', -0.12);
  word('prove');
  branch('alibi', 'bluff', 0.08);
  branch('trap', 'bluff', -0.15);
  word('bluff');
  L.pause(0.12);
  // Every branch converges on one question…
  branch('bluff', 'question', 0.12);
  branch('know', 'question', -0.08);
  branch('prove', 'question', -0.12);
  word('question');
  // …and the verdict is left with the reader.
  L.line(handCurve([0.5, 1.1], [0.5, 1.168], 0.0, rnd, 8), pencil);
  L.line(
    [
      [0.488, 1.152],
      [0.5, 1.17],
      [0.512, 1.152],
    ],
    pencil,
  );
  word('reader');
  L.finish();
  return L;
}

/* ------------------------------------------------------------------ */

const FRAME = { x0: 0.12, x1: 0.88, y0: 0.17, y1: 1.25 } as const;
const P1: Pt[] = [
  [0.12, 0.17],
  [0.88, 0.17],
  [0.88, 0.43],
  [0.12, 0.43],
];
const P2: Pt[] = [
  [0.12, 0.46],
  [0.47, 0.46],
  [0.41, 0.86],
  [0.12, 0.86],
];
const P3: Pt[] = [
  [0.5, 0.46],
  [0.88, 0.46],
  [0.88, 0.86],
  [0.44, 0.86],
];
const P4: Pt[] = [
  [0.12, 0.89],
  [0.88, 0.89],
  [0.88, 1.25],
  [0.12, 1.25],
];

/** Two dark forms facing each other (rounded-top slabs), P4. */
const FORM_L = { x0: 0.19, x1: 0.33, top: 0.985 };
const FORM_R = { x0: 0.67, x1: 0.81, top: 0.985 };

function poly(ctx: CanvasRenderingContext2D, s: number, pts: readonly Pt[]): void {
  pts.forEach((p, i) => (i ? ctx.lineTo(p[0] * s, p[1] * s) : ctx.moveTo(p[0] * s, p[1] * s)));
  ctx.closePath();
}

function slab(
  ctx: CanvasRenderingContext2D,
  s: number,
  f: { x0: number; x1: number; top: number },
): void {
  const r = (f.x1 - f.x0) / 2;
  ctx.moveTo(f.x0 * s, FRAME.y1 * s);
  ctx.lineTo(f.x0 * s, (f.top + r) * s);
  ctx.arc((f.x0 + r) * s, (f.top + r) * s, r * s, Math.PI, 0);
  ctx.lineTo(f.x1 * s, FRAME.y1 * s);
  ctx.closePath();
}

function border(L: InkLayer, pts: readonly Pt[]): void {
  L.line([...pts, pts[0]!], { w: 0.0042, speed: 0.55 });
}

export function buildArt(): InkLayer {
  const L = new InkLayer(0.45);
  const rnd = mulberry32(77);

  // Panel borders, ruled.
  [P1, P2, P3, P4].forEach((p) => border(L, p));
  L.pause(0.08);

  // P1 — rooftops in rain. Skyline silhouette filled with the brush.
  const sky: Pt[] = [[0.12, 0.43]];
  let x = 0.12;
  while (x < 0.88) {
    const wdt = 0.04 + rnd() * 0.07;
    const h = 0.335 + rnd() * 0.06;
    sky.push([x, h], [Math.min(0.88, x + wdt), h]);
    x += wdt;
  }
  sky.push([0.88, 0.43]);
  const skyClip = L.addClip((ctx, s) => poly(ctx, s, sky));
  L.fill(skyClip, [0.12, 0.33, 0.88, 0.43], { angle: 0.25, step: 0.007, w: 0.012 });
  // A water tank and an antenna on the roofline.
  L.line(
    [
      [0.66, 0.335],
      [0.66, 0.29],
      [0.7, 0.29],
      [0.7, 0.335],
    ],
    { w: 0.004 },
  );
  L.line(
    [
      [0.655, 0.29],
      [0.68, 0.272],
      [0.705, 0.29],
    ],
    { w: 0.004 },
  );
  L.line(
    [
      [0.3, 0.345],
      [0.3, 0.255],
    ],
    { w: 0.0025 },
  );
  L.line(
    [
      [0.285, 0.275],
      [0.315, 0.275],
    ],
    { w: 0.0022 },
  );
  // Rain: thin diagonal strokes.
  const rainClip = L.addClip((ctx, s) => poly(ctx, s, P1));
  for (let i = 0; i < 70; i++) {
    const rx = 0.13 + rnd() * 0.78;
    const ry = 0.18 + rnd() * 0.2;
    const len = 0.03 + rnd() * 0.05;
    L.line(
      [
        [rx, ry],
        [rx - len * 0.22, ry + len],
      ],
      { w: 0.0016, speed: 0.4, clip: rainClip, taper: 0.4 },
    );
  }
  L.pause(0.08);

  // P2 — a field of black, cut by one curve of light.
  const p2 = L.addClip((ctx, s) => {
    poly(ctx, s, P2);
    ctx.moveTo((0.27 + 0.13 * Math.cos(2.0)) * s, (0.64 + 0.13 * Math.sin(2.0)) * s);
    ctx.arc(0.27 * s, 0.64 * s, 0.13 * s, 2.0, 4.6);
    ctx.arc(0.287 * s, 0.64 * s, 0.121 * s, 4.6, 2.0, true);
    ctx.closePath();
  });
  L.fill(p2, [0.12, 0.46, 0.47, 0.86], { angle: -1.1, step: 0.008, w: 0.013, speed: 0.22 });
  L.pause(0.08);

  // P3 — a window throwing a shaft of light into hatched shadow.
  const win: Pt[] = [
    [0.62, 0.52],
    [0.81, 0.52],
    [0.81, 0.67],
    [0.62, 0.67],
  ];
  const shaft: Pt[] = [
    [0.62, 0.67],
    [0.81, 0.67],
    [0.69, 0.86],
    [0.46, 0.86],
  ];
  const p3 = L.addClip((ctx, s) => {
    poly(ctx, s, P3);
    poly(ctx, s, win);
    poly(ctx, s, shaft);
  });
  border(L, win);
  L.line(
    [
      [0.715, 0.52],
      [0.715, 0.67],
    ],
    { w: 0.0035 },
  );
  L.line(
    [
      [0.62, 0.595],
      [0.81, 0.595],
    ],
    { w: 0.0035 },
  );
  L.fill(p3, [0.44, 0.46, 0.88, 0.86], { angle: 0.785, step: 0.011, w: 0.0018, speed: 0.35 });
  const p3low = L.addClip((ctx, s) => {
    poly(ctx, s, [
      [0.44, 0.7],
      [0.88, 0.7],
      [0.88, 0.86],
      [0.44, 0.86],
    ]);
    poly(ctx, s, shaft);
  });
  L.fill(p3low, [0.44, 0.7, 0.88, 0.86], { angle: -0.5, step: 0.012, w: 0.0018, speed: 0.35 });
  L.pause(0.08);

  // P4 — two dark forms across a table; light between them.
  const forms = L.addClip((ctx, s) => {
    slab(ctx, s, FORM_L);
    slab(ctx, s, FORM_R);
  });
  L.fill(forms, [0.19, 0.985, 0.81, 1.25], { angle: 1.3, step: 0.008, w: 0.013, speed: 0.22 });
  L.line(
    [
      [0.12, 1.15],
      [0.88, 1.15],
    ],
    { w: 0.0045 },
  );
  const ceiling = L.addClip((ctx, s) => {
    poly(ctx, s, [
      [0.12, 0.89],
      [0.88, 0.89],
      [0.88, 0.99],
      [0.12, 0.99],
    ]);
    slab(ctx, s, FORM_L);
    slab(ctx, s, FORM_R);
  });
  L.fill(ceiling, [0.12, 0.89, 0.88, 0.99], { angle: 1.5708, step: 0.0075, w: 0.0016, speed: 0.4 });
  const under = L.addClip((ctx, s) =>
    poly(ctx, s, [
      [0.33, 1.15],
      [0.67, 1.15],
      [0.67, 1.25],
      [0.33, 1.25],
    ]),
  );
  L.fill(under, [0.33, 1.15, 0.67, 1.25], { angle: 0.6, step: 0.009, w: 0.0018, speed: 0.35 });
  L.finish();
  return L;
}

/* ------------------------------------------------------------------ */

export function buildTogether(): InkLayer {
  const L = new InkLayer(0.5);
  const rnd = mulberry32(5);
  const [qx, qy] = NODES.question;
  const cy = qy - WORD * 0.3;

  // Ink over the pencil: the converging branches.
  const ink = { w: 0.0036, speed: 0.9 };
  L.line(handCurve(below('bluff'), above('question'), 0.12, mulberry32(902)), ink);
  L.line(handCurve(below('know'), above('question'), -0.08, mulberry32(903)), ink);
  L.line(handCurve(below('prove'), above('question'), -0.12, mulberry32(904)), ink);
  // The question, inked where it was pencilled, inside a balloon.
  L.text(WORDS.question, qx, qy, WORD, { a: 1, speed: 1.2 });
  const balloon: Pt[] = [];
  for (let i = 0; i <= 48; i++) {
    const a = -Math.PI / 2 + (i / 48) * Math.PI * 2;
    balloon.push([qx + Math.cos(a) * 0.155, cy + Math.sin(a) * 0.05]);
  }
  L.line(balloon, { w: 0.0034, speed: 0.6 });
  L.pause(0.05);
  // Focus lines converging on the question, behind the forms.
  const focus = L.addClip((ctx, s) => {
    poly(ctx, s, P4);
    slab(ctx, s, FORM_L);
    slab(ctx, s, FORM_R);
    ctx.ellipse(qx * s, cy * s, 0.17 * s, 0.062 * s, 0, 0, Math.PI * 2);
  });
  const n = 46;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rnd() * 0.05;
    const r0 = 0.5;
    const r1 = 0.19 + rnd() * 0.06;
    L.line(
      [
        [qx + Math.cos(a) * r0, cy + Math.sin(a) * r0 * 0.7],
        [qx + Math.cos(a) * r1, cy + Math.sin(a) * r1 * 0.42],
      ],
      { w: 0.0024, speed: 0.12, taper: 0.5, clip: focus },
    );
  }
  L.finish();
  return L;
}
