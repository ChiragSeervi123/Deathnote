import type * as THREE from 'three';
import { mulberry32 } from '@/utils/math';
import { canvasTexture, makeCanvas, paperGrain, wrapLines } from '../canvasTextures';

/** Original evidence-card artwork drawn in canvas (no real photographs, no logos). */
export type CardSpec =
  | { kind: 'file'; title: string; ref: string; lines: string[]; photo?: boolean }
  | { kind: 'tv'; caption: string; label: string }
  | { kind: 'map'; title: string; highlight: string }
  | { kind: 'feeds'; title: string }
  | { kind: 'note'; text: string }
  | { kind: 'portrait'; name: string; role: string; tone?: 'light' | 'dark' }
  | { kind: 'stamp'; text: string; sub: string };

const PX = 512;

export function cardAspect(spec: CardSpec): number {
  switch (spec.kind) {
    case 'tv':
    case 'feeds':
    case 'map':
      return 0.62;
    case 'portrait':
      return 1.3;
    case 'note':
      return 0.9;
    case 'stamp':
      return 0.5;
    default:
      return 1.32;
  }
}

export function cardTexture(spec: CardSpec, seed: number): THREE.CanvasTexture {
  const w = PX;
  const h = Math.round(PX * cardAspect(spec));
  const { canvas, ctx } = makeCanvas(w, h);
  const rnd = mulberry32(seed);
  const paper = (tint = '#e9e3d6') => {
    ctx.fillStyle = tint;
    ctx.fillRect(0, 0, w, h);
    paperGrain(ctx, w, h, seed, 0.05);
  };
  ctx.textBaseline = 'alphabetic';
  switch (spec.kind) {
    case 'file': {
      paper();
      ctx.fillStyle = '#1a1714';
      ctx.font = '600 22px "IBM Plex Mono", monospace';
      ctx.fillText(spec.ref, 28, 44);
      ctx.fillRect(28, 56, w - 56, 2);
      ctx.font = '500 38px "Cormorant Garamond Variable", serif';
      ctx.fillText(spec.title, 28, 106);
      if (spec.photo) {
        ctx.fillStyle = '#2b2925';
        ctx.fillRect(w - 168, 128, 140, 170);
        ctx.fillStyle = '#4a4741';
        ctx.beginPath();
        ctx.arc(w - 98, 190, 34, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(w - 148, 236, 100, 62);
      }
      ctx.fillStyle = '#2a2622';
      ctx.font = '400 20px "IBM Plex Mono", monospace';
      let y = 160;
      for (const l of spec.lines) {
        for (const part of wrapLines(ctx, l, spec.photo ? w - 230 : w - 60)) {
          ctx.fillText(part, 28, y);
          y += 30;
        }
      }
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = 'rgba(40,36,30,0.18)';
        ctx.fillRect(28, h - 150 + i * 22, (w - 56) * (0.5 + rnd() * 0.5), 9);
      }
      break;
    }
    case 'tv': {
      ctx.fillStyle = '#0d1520';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#1b2738';
      ctx.fillRect(20, 20, w - 40, h - 40);
      ctx.fillStyle = '#05070b';
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.42, 44, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(w / 2 - 70, h * 0.52, 140, 90);
      ctx.fillStyle = '#c9252c';
      ctx.fillRect(34, 34, 92, 30);
      ctx.fillStyle = '#fff';
      ctx.font = '600 18px "IBM Plex Mono", monospace';
      ctx.fillText(spec.label, 46, 56);
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(20, h - 82, w - 40, 50);
      ctx.fillStyle = '#f2efe8';
      ctx.font = '500 24px "IBM Plex Mono", monospace';
      ctx.fillText(spec.caption, 36, h - 48);
      break;
    }
    case 'map': {
      ctx.fillStyle = '#0c1724';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(130,170,230,0.16)';
      for (let x = 0; x < w; x += 32) ctx.strokeRect(x, 0, 32, h);
      // An abstract island chain, original drawing.
      ctx.fillStyle = 'rgba(160,190,230,0.35)';
      ctx.beginPath();
      ctx.moveTo(60, h - 40);
      const pts = [
        [120, h - 80],
        [200, h - 100],
        [270, h - 150],
        [330, h - 170],
        [380, h - 220],
        [420, 60],
        [440, 80],
        [400, h - 180],
        [340, h - 130],
        [260, h - 80],
        [150, h - 40],
      ];
      for (const [x, y] of pts) ctx.lineTo(x!, y!);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ff3b42';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(318, h - 160, 34, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#e8e3d8';
      ctx.font = '600 22px "IBM Plex Mono", monospace';
      ctx.fillText(spec.title, 24, 40);
      ctx.fillStyle = '#ff6b70';
      ctx.fillText(spec.highlight, 360, h - 150);
      break;
    }
    case 'feeds': {
      ctx.fillStyle = '#060a10';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 9; i++) {
        const fx = (i % 3) * (w / 3);
        const fy = Math.floor(i / 3) * (h / 3);
        ctx.fillStyle = `rgb(${34 + rnd() * 16},${40 + rnd() * 16},${50 + rnd() * 18})`;
        ctx.fillRect(fx + 4, fy + 4, w / 3 - 8, h / 3 - 8);
        ctx.fillStyle = 'rgba(220,230,255,0.22)';
        ctx.fillRect(fx + 30, fy + 40, 50 + rnd() * 40, 24);
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.font = '500 12px "IBM Plex Mono", monospace';
        ctx.fillText(`${spec.title} ${i + 1}`, fx + 10, fy + 20);
      }
      break;
    }
    case 'note': {
      paper('#efe6c8');
      ctx.fillStyle = '#1b1712';
      ctx.font = '400 34px "Nothing You Could Do", cursive';
      let y = 70;
      for (const l of wrapLines(ctx, spec.text, w - 60)) {
        ctx.fillText(l, 30, y);
        y += 48;
      }
      break;
    }
    case 'portrait': {
      paper(spec.tone === 'dark' ? '#1d1b19' : '#e2dccf');
      const fg = spec.tone === 'dark' ? '#e8e3d8' : '#16130f';
      ctx.fillStyle = spec.tone === 'dark' ? '#3a3632' : '#c9c1b2';
      ctx.fillRect(30, 30, w - 60, h - 160);
      ctx.fillStyle = spec.tone === 'dark' ? '#0c0b0a' : '#2a2622';
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.36, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(w / 2 - 150, h - 130);
      ctx.quadraticCurveTo(w / 2, h * 0.43, w / 2 + 150, h - 130);
      ctx.fill();
      ctx.fillStyle = fg;
      ctx.font = '500 40px "Cormorant Garamond Variable", serif';
      ctx.fillText(spec.name, 30, h - 70);
      ctx.font = '500 18px "IBM Plex Mono", monospace';
      ctx.fillText(spec.role.toUpperCase(), 30, h - 36);
      break;
    }
    case 'stamp': {
      paper();
      ctx.strokeStyle = '#a3141c';
      ctx.lineWidth = 8;
      ctx.strokeRect(24, 24, w - 48, h - 48);
      ctx.fillStyle = '#a3141c';
      ctx.textAlign = 'center';
      ctx.font = '700 64px "IBM Plex Mono", monospace';
      ctx.fillText(spec.text, w / 2, h / 2 + 10);
      ctx.font = '500 20px "IBM Plex Mono", monospace';
      ctx.fillText(spec.sub, w / 2, h / 2 + 50);
      break;
    }
  }
  return canvasTexture(canvas);
}
