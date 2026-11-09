import * as THREE from 'three';
import { mulberry32 } from '@/utils/math';

/** Small helpers to build procedural textures on a 2D canvas. */

export function makeCanvas(
  w: number,
  h: number,
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: false });
  if (!ctx) throw new Error('2D canvas unavailable');
  return { canvas, ctx };
}

export function canvasTexture(
  canvas: HTMLCanvasElement,
  opts: { srgb?: boolean; repeat?: number; anisotropy?: number } = {},
): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = opts.srgb === false ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  t.anisotropy = opts.anisotropy ?? 8;
  if (opts.repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(opts.repeat, opts.repeat);
  }
  t.needsUpdate = true;
  return t;
}

/** Tileable cellular ("pebble") + value noise height field in [0,1]. */
export function leatherHeight(size: number, cells: number, seed: number): Float32Array {
  const rnd = mulberry32(seed);
  const pts = new Float32Array(cells * cells * 2);
  for (let i = 0; i < cells * cells; i++) {
    pts[i * 2] = rnd();
    pts[i * 2 + 1] = rnd();
  }
  const out = new Float32Array(size * size);
  const cellSize = size / cells;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cx = Math.floor(x / cellSize);
      const cy = Math.floor(y / cellSize);
      let d1 = 9;
      let d2 = 9;
      for (let oy = -1; oy <= 1; oy++) {
        for (let ox = -1; ox <= 1; ox++) {
          const gx = (cx + ox + cells) % cells;
          const gy = (cy + oy + cells) % cells;
          const k = (gy * cells + gx) * 2;
          const px = (cx + ox + pts[k]!) * cellSize;
          const py = (cy + oy + pts[k + 1]!) * cellSize;
          const dx = (px - x) / cellSize;
          const dy = (py - y) / cellSize;
          const d = dx * dx + dy * dy;
          if (d < d1) {
            d2 = d1;
            d1 = d;
          } else if (d < d2) d2 = d;
        }
      }
      // Pebbles: raised centres, creased borders.
      const crease = Math.min(1, (Math.sqrt(d2) - Math.sqrt(d1)) * 2.2);
      out[y * size + x] = crease;
    }
  }
  return out;
}

/** Height field → tangent-space normal map canvas (Sobel). */
export function heightToNormalCanvas(
  h: Float32Array,
  size: number,
  strength: number,
): HTMLCanvasElement {
  const { canvas, ctx } = makeCanvas(size, size);
  const img = ctx.createImageData(size, size);
  const at = (x: number, y: number) => h[((y + size) % size) * size + ((x + size) % size)]!;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx =
        at(x + 1, y - 1) +
        2 * at(x + 1, y) +
        at(x + 1, y + 1) -
        (at(x - 1, y - 1) + 2 * at(x - 1, y) + at(x - 1, y + 1));
      const dy =
        at(x - 1, y + 1) +
        2 * at(x, y + 1) +
        at(x + 1, y + 1) -
        (at(x - 1, y - 1) + 2 * at(x, y - 1) + at(x + 1, y - 1));
      let nx = -dx * strength;
      let ny = -dy * strength;
      let nz = 1;
      const l = Math.hypot(nx, ny, nz);
      nx /= l;
      ny /= l;
      nz /= l;
      const i = (y * size + x) * 4;
      img.data[i] = (nx * 0.5 + 0.5) * 255;
      img.data[i + 1] = (ny * 0.5 + 0.5) * 255;
      img.data[i + 2] = (nz * 0.5 + 0.5) * 255;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

/** Fine paper fibres and mottling drawn over an existing context. */
export function paperGrain(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
  alpha = 0.05,
): void {
  const rnd = mulberry32(seed);
  ctx.save();
  for (let i = 0; i < (w * h) / 900; i++) {
    const x = rnd() * w;
    const y = rnd() * h;
    const len = 4 + rnd() * 18;
    const a = rnd() * Math.PI;
    ctx.strokeStyle = `rgba(${rnd() < 0.5 ? '80,70,55' : '255,252,240'},${alpha * (0.4 + rnd())})`;
    ctx.lineWidth = 0.6 + rnd() * 0.6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
    ctx.stroke();
  }
  // Soft mottling.
  for (let i = 0; i < 40; i++) {
    const x = rnd() * w;
    const y = rnd() * h;
    const r = 60 + rnd() * 240;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(150,130,95,${0.025 * rnd()})`);
    g.addColorStop(1, 'rgba(150,130,95,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  ctx.restore();
}

/** Word-wrap `text` to `maxWidth` with the current font. */
export function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

/** Soft radial glow (white, alpha falloff) for halos, light pools and backlight. */
export function glowTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(256, 256);
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, 'rgba(255,255,255,0.6)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.16)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return canvasTexture(canvas);
}
