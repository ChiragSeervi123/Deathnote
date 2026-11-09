import * as THREE from 'three';
import { mulberry32 } from '@/utils/math';
import { canvasTexture, makeCanvas, paperGrain } from '../shared/canvasTextures';
import { PAGE_ASPECT } from './inkLayer';

/**
 * Procedural textures for the tribute's drafting table (original, code-drawn):
 * blank manuscript paper with non-photo-blue guides, pale drafting-board wood,
 * a soft window cookie for the morning light, and a contact-shadow blot.
 */

/** Blank B4 manuscript sheet: warm white, fibres, faint blue frame and crop marks. */
export function manuscriptPaper(width: number): THREE.CanvasTexture {
  const h = Math.round(width * PAGE_ASPECT);
  const { canvas, ctx } = makeCanvas(width, h);
  const g = ctx.createLinearGradient(0, 0, width, h);
  g.addColorStop(0, '#f6f3ec');
  g.addColorStop(1, '#efebe2');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, h);
  paperGrain(ctx, width, h, 41, 0.035);
  const s = width;
  ctx.strokeStyle = 'rgba(96, 156, 204, 0.28)';
  ctx.lineWidth = Math.max(1, s * 0.0011);
  const rect = (x0: number, y0: number, x1: number, y1: number) =>
    ctx.strokeRect(x0 * s, y0 * s, (x1 - x0) * s, (y1 - y0) * s);
  rect(0.06, 0.07, 0.94, PAGE_ASPECT - 0.07); // bleed
  rect(0.09, 0.11, 0.91, PAGE_ASPECT - 0.11); // trim
  ctx.strokeStyle = 'rgba(96, 156, 204, 0.2)';
  rect(0.12, 0.17, 0.88, 1.25); // basic frame
  // Centre marks.
  ctx.strokeStyle = 'rgba(96, 156, 204, 0.32)';
  const mark = (x: number, y: number, dx: number, dy: number) => {
    ctx.beginPath();
    ctx.moveTo(x * s, y * s);
    ctx.lineTo((x + dx) * s, (y + dy) * s);
    ctx.stroke();
  };
  mark(0.5, 0.02, 0, 0.035);
  mark(0.5, PAGE_ASPECT - 0.055, 0, 0.035);
  mark(0.015, PAGE_ASPECT / 2, 0.03, 0);
  mark(0.955, PAGE_ASPECT / 2, 0.03, 0);
  return canvasTexture(canvas, { anisotropy: 8 });
}

/** Plain warm paper for the sheets underneath. */
export function plainPaper(): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(512, 724);
  ctx.fillStyle = '#ebe6dc';
  ctx.fillRect(0, 0, 512, 724);
  paperGrain(ctx, 512, 724, 8, 0.04);
  return canvasTexture(canvas);
}

/** Pale maple drafting board, long grain along x. */
export function boardWood(): THREE.CanvasTexture {
  const w = 1024;
  const h = 1024;
  const { canvas, ctx } = makeCanvas(w, h);
  ctx.fillStyle = '#cdbfa6';
  ctx.fillRect(0, 0, w, h);
  const rnd = mulberry32(14);
  for (let i = 0; i < 420; i++) {
    const y = rnd() * h;
    const amp = 2 + rnd() * 8;
    const freq = 0.002 + rnd() * 0.006;
    const ph = rnd() * 10;
    ctx.strokeStyle =
      rnd() < 0.6
        ? `rgba(150,124,88,${0.05 + rnd() * 0.1})`
        : `rgba(236,226,206,${0.05 + rnd() * 0.12})`;
    ctx.lineWidth = 0.6 + rnd() * 2.4;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 16) {
      const yy = y + Math.sin(x * freq + ph) * amp;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
  paperGrain(ctx, w, h, 3, 0.03);
  return canvasTexture(canvas, { repeat: 3 });
}

/** A four-pane window, softly focused, used as the spot light's cookie. */
export function windowCookie(): THREE.CanvasTexture {
  const n = 256;
  const { canvas, ctx } = makeCanvas(n, n);
  // Outside the window the room still gets some bounce, so the cookie never goes black.
  ctx.fillStyle = '#5a5a5a';
  ctx.fillRect(0, 0, n, n);
  ctx.filter = 'blur(10px)';
  ctx.fillStyle = '#fff';
  const m = 14;
  const bar = 5;
  const pw = (n - 2 * m - bar) / 2;
  for (const [x, y] of [
    [m, m],
    [m + pw + bar, m],
    [m, m + pw + bar],
    [m + pw + bar, m + pw + bar],
  ] as const) {
    ctx.fillRect(x, y, pw, pw);
  }
  ctx.filter = 'none';
  return canvasTexture(canvas, { anisotropy: 1 });
}

/** Radial blot for a soft contact shadow under the paper stack. */
export function contactBlot(): THREE.CanvasTexture {
  const n = 256;
  const { canvas, ctx } = makeCanvas(n, n);
  ctx.clearRect(0, 0, n, n);
  ctx.filter = 'blur(14px)';
  ctx.fillStyle = 'rgba(70,52,30,1)';
  ctx.fillRect(34, 34, n - 68, n - 68);
  ctx.filter = 'none';
  return canvasTexture(canvas, { anisotropy: 1 });
}
