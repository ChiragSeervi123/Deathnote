import type * as THREE from 'three';
import { mulberry32 } from '@/utils/math';
import { canvasTexture, makeCanvas } from '../shared/canvasTextures';

/**
 * What the Eyes see, as an original illustration for the hole in the realm:
 * faceless human silhouettes with a name (redacted bar) and an invented
 * lifespan numeral above each head. One figure — a notebook owner — shows
 * no lifespan at all.
 */
export function createVisionTexture(size = 1024): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(size, size);
  const rnd = mulberry32(17);
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.05,
    size / 2,
    size / 2,
    size * 0.5,
  );
  g.addColorStop(0, '#2a0a0d');
  g.addColorStop(0.7, '#12060a');
  g.addColorStop(1, '#050304');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const rows = [
    { y: 0.38, n: 7, s: 0.065 },
    { y: 0.6, n: 6, s: 0.085 },
    { y: 0.85, n: 5, s: 0.11 },
  ];
  rows.forEach((row, ri) => {
    for (let i = 0; i < row.n; i++) {
      const x = ((i + 0.5) / row.n) * size + (rnd() - 0.5) * size * 0.04;
      const base = row.y * size;
      const h = row.s * size * 2.2;
      const w = row.s * size * 0.55;
      // Silhouette: head + shoulders + body.
      ctx.fillStyle = '#060404';
      ctx.beginPath();
      ctx.arc(x, base - h * 0.82, w * 0.32, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x - w * 0.6, base);
      ctx.quadraticCurveTo(x - w * 0.62, base - h * 0.55, x, base - h * 0.62);
      ctx.quadraticCurveTo(x + w * 0.62, base - h * 0.55, x + w * 0.6, base);
      ctx.fill();
      const owner = ri === 1 && i === 3;
      // Name as a pale bar, lifespan as red numerals.
      const labelY = base - h * 1.18;
      ctx.fillStyle = 'rgba(232,227,216,0.75)';
      ctx.fillRect(x - w * 0.55, labelY - row.s * size * 0.22, w * 1.1, row.s * size * 0.06);
      ctx.font = `500 ${Math.round(row.s * size * 0.2)}px "IBM Plex Mono", monospace`;
      ctx.textAlign = 'center';
      if (owner) {
        ctx.fillStyle = 'rgba(232,227,216,0.4)';
        ctx.fillText('— — —', x, labelY);
      } else {
        ctx.fillStyle = '#ff3b42';
        const digits = Array.from({ length: 8 }, () => Math.floor(rnd() * 10)).join('');
        ctx.fillText(`${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`, x, labelY);
      }
    }
  });
  // Circular vignette so it reads as a view through the hole.
  const v = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.32,
    size / 2,
    size / 2,
    size * 0.5,
  );
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(0,0,0,1)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, size, size);
  return canvasTexture(canvas);
}
