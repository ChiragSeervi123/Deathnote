/**
 * Time-encoded ink layers for the tribute page.
 *
 * Every mark (pencil word, pen line, brush fill) is recorded with the moment it
 * is drawn, then rasterised once into a canvas whose pixels carry
 *   R = coverage, G = coverage · local time, B = coverage · chapter · 16/255
 * (16 chapters × 256 local steps ≈ 4096 time levels, robust to filtering).
 * The page shader reveals a pixel when its time ≤ the scroll-driven reveal,
 * so strokes draw themselves forwards and un-draw exactly when scrolling back.
 * A pen path (tip samples over time) lets the 3D pencil/pen follow the ink.
 */

/** B4 manuscript proportions (257 × 364 mm). Page units: x 0..1, y 0..PAGE_ASPECT (down). */
export const PAGE_ASPECT = 364 / 257;

export type Pt = readonly [number, number];

export interface PenSample {
  t: number;
  x: number;
  y: number;
  /** Stroke id; a change of id between samples means the pen travelled lifted. */
  id: number;
}

type ClipFn = (ctx: CanvasRenderingContext2D, s: number) => void;

type Prim =
  | {
      k: 'seg';
      t: number;
      x0: number;
      y0: number;
      x1: number;
      y1: number;
      w: number;
      a: number;
      clip: number;
    }
  | {
      k: 'text';
      t: number;
      t1: number;
      text: string;
      x: number;
      y: number;
      size: number;
      font: string;
      a: number;
      clip: number;
    };

export const HAND_FONT = '"Nothing You Could Do", "Caveat Variable", cursive';

const CHAPTERS = 16;

function enc(t: number, a: number, chapter?: number): string {
  const tt = Math.min(1, Math.max(0, t));
  const k = chapter ?? Math.min(CHAPTERS - 1, Math.floor(tt * CHAPTERS));
  const local = Math.min(1, Math.max(0, tt * CHAPTERS - k));
  const r = Math.round(a * 255);
  return `rgb(${r},${Math.round(r * local)},${Math.round(a * k * 16)})`;
}

let measureCtx: CanvasRenderingContext2D | null = null;
function measure(text: string, font: string): number {
  if (!measureCtx) {
    const c = document.createElement('canvas');
    measureCtx = c.getContext('2d');
  }
  if (!measureCtx) return text.length * 0.5;
  measureCtx.font = `100px ${font}`;
  return measureCtx.measureText(text).width / 100;
}

export interface LineOpts {
  w: number;
  a?: number;
  /** Time per page unit of length. */
  speed?: number;
  /** Fraction of the stroke used to taper in/out (brush). 0 = constant. */
  taper?: number;
  clip?: number;
  /** Raster segment length (page units). */
  seg?: number;
}

export class InkLayer {
  readonly prims: Prim[] = [];
  readonly samples: PenSample[] = [];
  private readonly clips: ClipFn[] = [];
  private t = 0;
  private id = 0;
  private last: Pt | null = null;

  constructor(private readonly travel = 0.5) {}

  addClip(fn: ClipFn): number {
    this.clips.push(fn);
    return this.clips.length - 1;
  }

  pause(d: number): void {
    this.t += d;
  }

  private begin(p: Pt): void {
    if (this.last)
      this.t += 0.03 + Math.hypot(p[0] - this.last[0], p[1] - this.last[1]) * this.travel;
    this.id++;
  }

  private sample(x: number, y: number, t: number): void {
    this.samples.push({ t, x, y, id: this.id });
  }

  line(pts: readonly Pt[], o: LineOpts): void {
    const first = pts[0];
    if (!first || pts.length < 2) return;
    this.begin(first);
    const speed = o.speed ?? 1;
    const a = o.a ?? 1;
    const segLen = o.seg ?? 0.004;
    let total = 0;
    for (let i = 1; i < pts.length; i++) {
      total += Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]);
    }
    let acc = 0;
    const t0 = this.t;
    this.sample(first[0], first[1], t0);
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i - 1]!;
      const q = pts[i]!;
      const L = Math.hypot(q[0] - p[0], q[1] - p[1]);
      const n = Math.max(1, Math.ceil(L / segLen));
      for (let j = 0; j < n; j++) {
        const f0 = j / n;
        const f1 = (j + 1) / n;
        const s = (acc + L * (f0 + f1) * 0.5) / Math.max(total, 1e-6);
        let w = o.w;
        if (o.taper) w *= Math.pow(Math.min(1, s / o.taper, (1 - s) / o.taper), 0.55) * 0.85 + 0.15;
        this.prims.push({
          k: 'seg',
          t: t0 + (acc + L * (f0 + f1) * 0.5) * speed,
          x0: p[0] + (q[0] - p[0]) * f0,
          y0: p[1] + (q[1] - p[1]) * f0,
          x1: p[0] + (q[0] - p[0]) * f1,
          y1: p[1] + (q[1] - p[1]) * f1,
          w,
          a,
          clip: o.clip ?? -1,
        });
      }
      acc += L;
      this.sample(q[0], q[1], t0 + acc * speed);
    }
    this.t = t0 + total * speed;
    this.last = pts[pts.length - 1]!;
  }

  /** Handwritten text, centred on (cx, baseline y). Written left → right. */
  text(
    str: string,
    cx: number,
    y: number,
    size: number,
    o: { a?: number; speed?: number } = {},
  ): number {
    const width = measure(str, HAND_FONT) * size;
    const x = cx - width / 2;
    this.begin([x, y]);
    const dur = width * (o.speed ?? 1.4);
    const t0 = this.t;
    this.prims.push({
      k: 'text',
      t: t0,
      t1: t0 + dur,
      text: str,
      x,
      y,
      size,
      font: HAND_FONT,
      a: o.a ?? 1,
      clip: -1,
    });
    // The pen loops along the baseline like handwriting.
    const n = Math.max(4, Math.round(str.length * 1.5));
    for (let i = 0; i <= n; i++) {
      const f = i / n;
      this.sample(x + width * f, y - size * (0.18 + 0.16 * Math.sin(f * n * 2.1)), t0 + dur * f);
    }
    this.t = t0 + dur;
    this.last = [x + width, y];
    return width;
  }

  /** Brush fill: boustrophedon hatching clipped to a region (evenodd clip). */
  fill(
    clip: number,
    box: readonly [number, number, number, number],
    o: { angle: number; step: number; w: number; speed?: number; a?: number },
  ): void {
    const [x0, y0, x1, y1] = box;
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    const R = Math.hypot(x1 - x0, y1 - y0) / 2;
    const dx = Math.cos(o.angle);
    const dy = Math.sin(o.angle);
    let flip = false;
    let started = false;
    for (let d = -R; d <= R; d += o.step) {
      // Line through centre offset along the normal; trimmed to the box.
      const px = cx - dy * d;
      const py = cy + dx * d;
      const ts: number[] = [];
      if (Math.abs(dx) > 1e-6) ts.push((x0 - px) / dx, (x1 - px) / dx);
      if (Math.abs(dy) > 1e-6) ts.push((y0 - py) / dy, (y1 - py) / dy);
      const inside = ts
        .map((t) => [px + dx * t, py + dy * t, t] as const)
        .filter(([x, y]) => x >= x0 - 1e-6 && x <= x1 + 1e-6 && y >= y0 - 1e-6 && y <= y1 + 1e-6)
        .sort((m, n) => m[2] - n[2]);
      const a = inside[0];
      const b = inside[inside.length - 1];
      if (!a || !b || b[2] - a[2] < 1e-4) continue;
      const pts: Pt[] = flip
        ? [
            [b[0], b[1]],
            [a[0], a[1]],
          ]
        : [
            [a[0], a[1]],
            [b[0], b[1]],
          ];
      // Brush strokes after the first follow each other without a travel pause.
      if (started) this.last = null;
      started = true;
      flip = !flip;
      this.line(pts, { w: o.w, a: o.a, speed: o.speed ?? 0.3, clip, seg: 0.01 });
    }
  }

  /** Normalise times to 0..1. Returns the raw duration. */
  finish(): number {
    const total = Math.max(this.t, 1e-6);
    for (const p of this.prims) {
      p.t /= total;
      if (p.k === 'text') p.t1 /= total;
    }
    for (const s of this.samples) s.t /= total;
    return total;
  }

  /** Rasterise into an opaque black canvas, `width` px across one page width. */
  render(canvas: HTMLCanvasElement, width: number): void {
    const s = width;
    canvas.width = width;
    canvas.height = Math.round(width * PAGE_ASPECT);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.textBaseline = 'alphabetic';
    // Earliest marks end on top, so overlaps reveal at their first time.
    const order = [...this.prims].sort((m, n) => n.t - m.t);
    let current = -1;
    for (const p of order) {
      if (p.clip !== current) {
        if (current !== -1) ctx.restore();
        if (p.clip !== -1) {
          ctx.save();
          ctx.beginPath();
          this.clips[p.clip]!(ctx, s);
          ctx.clip('evenodd');
        }
        current = p.clip;
      }
      if (p.k === 'seg') {
        ctx.strokeStyle = enc(p.t, p.a);
        ctx.lineWidth = Math.max(0.8, p.w * s);
        ctx.beginPath();
        ctx.moveTo(p.x0 * s, p.y0 * s);
        ctx.lineTo(p.x1 * s, p.y1 * s);
        ctx.stroke();
      } else {
        ctx.font = `${p.size * s}px ${p.font}`;
        const w = ctx.measureText(p.text).width;
        ctx.fillStyle = timeGradient(ctx, p.x * s, p.x * s + w, p.t, p.t1, p.a);
        ctx.fillText(p.text, p.x * s, p.y * s);
      }
    }
    if (current !== -1) ctx.restore();
  }
}

/** Horizontal gradient carrying time t0 → t1, with hard stops at chapter boundaries. */
function timeGradient(
  ctx: CanvasRenderingContext2D,
  x0: number,
  x1: number,
  t0: number,
  t1: number,
  a: number,
): CanvasGradient {
  const g = ctx.createLinearGradient(x0, 0, x1, 0);
  const span = Math.max(t1 - t0, 1e-6);
  g.addColorStop(0, enc(t0, a));
  let k = Math.floor(t0 * CHAPTERS);
  for (;;) {
    const b = (k + 1) / CHAPTERS;
    if (b >= t1 || k >= CHAPTERS - 1) break;
    const off = (b - t0) / span;
    g.addColorStop(off, enc(b - 1e-6, a, k));
    g.addColorStop(off, enc(b, a, k + 1));
    k++;
  }
  g.addColorStop(1, enc(t1, a));
  return g;
}

/** Where the tip is at reveal r, and how high it is lifted (page units). */
export function penAt(
  samples: readonly PenSample[],
  r: number,
  out: { x: number; y: number; lift: number },
): void {
  const n = samples.length;
  if (!n) return;
  if (r <= samples[0]!.t) {
    out.x = samples[0]!.x;
    out.y = samples[0]!.y;
    out.lift = 0.06;
    return;
  }
  const last = samples[n - 1]!;
  if (r >= last.t) {
    out.x = last.x;
    out.y = last.y;
    out.lift = 0.06;
    return;
  }
  let lo = 0;
  let hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (samples[mid]!.t <= r) lo = mid;
    else hi = mid;
  }
  const a = samples[lo]!;
  const b = samples[hi]!;
  const f = b.t > a.t ? (r - a.t) / (b.t - a.t) : 1;
  out.x = a.x + (b.x - a.x) * f;
  out.y = a.y + (b.y - a.y) * f;
  out.lift =
    a.id !== b.id ? Math.sin(f * Math.PI) * (0.04 + Math.hypot(b.x - a.x, b.y - a.y) * 0.25) : 0;
}
