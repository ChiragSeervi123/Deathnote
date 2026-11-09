import type * as THREE from 'three';
import { mulberry32 } from '@/utils/math';
import { canvasTexture, makeCanvas } from '../shared/canvasTextures';

/** Original monitor content for L's room (no logos, no real data). */
export type MonitorKind = 'letter' | 'map' | 'data' | 'feeds';

export function monitorTexture(kind: MonitorKind, seed: number): THREE.CanvasTexture {
  const w = 512;
  const h = 320;
  const { canvas, ctx } = makeCanvas(w, h);
  const rnd = mulberry32(seed);
  if (kind === 'letter') {
    ctx.fillStyle = '#f4f4f2';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#050505';
    ctx.font = '400 230px "UnifrakturMaguntia", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('L', w / 2, h / 2 + 12);
    return canvasTexture(canvas);
  }
  ctx.fillStyle = '#06101c';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(120,170,230,0.18)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  if (kind === 'map') {
    // An abstract coastline and incident markers.
    ctx.strokeStyle = 'rgba(160,200,255,0.75)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    let x = 60;
    let y = 260;
    ctx.moveTo(x, y);
    for (let i = 0; i < 40; i++) {
      x += 9 + rnd() * 4;
      y -= 4 + (rnd() - 0.4) * 10;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    for (let i = 0; i < 14; i++) {
      ctx.fillStyle = i < 3 ? 'rgba(255,80,80,0.95)' : 'rgba(180,215,255,0.8)';
      ctx.beginPath();
      ctx.arc(120 + rnd() * 300, 80 + rnd() * 170, i < 3 ? 6 : 3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 'data') {
    ctx.font = '500 14px "IBM Plex Mono", monospace';
    for (let r = 0; r < 18; r++) {
      ctx.fillStyle = r % 5 === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(150,190,240,0.6)';
      const line = Array.from({ length: 6 }, () =>
        Math.floor(rnd() * 99999)
          .toString()
          .padStart(5, '0'),
      ).join('  ');
      ctx.fillText(line, 16, 22 + r * 16.5);
    }
  } else {
    // 3×3 surveillance feeds of empty rooms.
    for (let i = 0; i < 9; i++) {
      const fx = (i % 3) * (w / 3);
      const fy = Math.floor(i / 3) * (h / 3);
      ctx.fillStyle = `rgba(${30 + rnd() * 20},${40 + rnd() * 20},${55 + rnd() * 20},1)`;
      ctx.fillRect(fx + 4, fy + 4, w / 3 - 8, h / 3 - 8);
      ctx.fillStyle = 'rgba(200,220,255,0.25)';
      ctx.fillRect(fx + 20, fy + 50, 60 + rnd() * 50, 30);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '500 11px "IBM Plex Mono", monospace';
      ctx.fillText(`CAM ${String(i + 1).padStart(2, '0')}`, fx + 10, fy + 20);
    }
  }
  return canvasTexture(canvas);
}
