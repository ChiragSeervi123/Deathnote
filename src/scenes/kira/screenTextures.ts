import type * as THREE from 'three';
import { canvasTexture, makeCanvas } from '../shared/canvasTextures';

/** Original street-screen content for Chapter 04 (invented headlines, no real broadcasters). */
export type ScreenKind = 'news' | 'kira' | 'justice' | 'murder' | 'icpo' | 'counter' | 'letter';

const W = 640;
const H = 360;

function frame(ctx: CanvasRenderingContext2D, bg: string) {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
}

export function drawScreen(ctx: CanvasRenderingContext2D, kind: ScreenKind, count = 0): void {
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  switch (kind) {
    case 'news':
      frame(ctx, '#0b1a2e');
      ctx.fillStyle = '#c9252c';
      ctx.fillRect(24, 24, 170, 40);
      ctx.fillStyle = '#fff';
      ctx.font = '600 24px "IBM Plex Mono", monospace';
      ctx.fillText('BREAKING', 40, 52);
      ctx.font = '500 40px "Inter Variable", sans-serif';
      ctx.fillText('Criminals dying of', 24, 150);
      ctx.fillText('sudden heart attacks', 24, 200);
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 300, W, 60);
      ctx.fillStyle = '#e8e3d8';
      ctx.font = '500 22px "IBM Plex Mono", monospace';
      ctx.fillText('PRISONS · SUSPECTS AT LARGE · LIVE BROADCASTS', 24, 338);
      break;
    case 'counter':
      frame(ctx, '#140608');
      ctx.fillStyle = '#e8e3d8';
      ctx.font = '500 24px "IBM Plex Mono", monospace';
      ctx.fillText('UNEXPLAINED DEATHS · THIS MONTH', 24, 60);
      ctx.fillStyle = '#ff3b42';
      ctx.font = '600 150px "IBM Plex Mono", monospace';
      ctx.fillText(String(count).padStart(3, '0'), 24, 250);
      break;
    case 'kira':
      frame(ctx, '#050505');
      ctx.fillStyle = '#e8e3d8';
      ctx.textAlign = 'center';
      ctx.font = '400 180px "Cormorant Garamond Variable", serif';
      ctx.fillText('KIRA', W / 2, 230);
      ctx.font = '500 22px "IBM Plex Mono", monospace';
      ctx.fillStyle = 'rgba(232,227,216,0.7)';
      ctx.fillText('— from “killer”, as the internet calls him', W / 2, 300);
      break;
    case 'justice':
      frame(ctx, '#1a1206');
      ctx.fillStyle = '#ffd38a';
      ctx.textAlign = 'center';
      ctx.font = '600 92px "Inter Variable", sans-serif';
      ctx.fillText('JUSTICE?', W / 2, 200);
      ctx.font = '500 24px "IBM Plex Mono", monospace';
      ctx.fillText('“He only punishes the guilty”', W / 2, 270);
      break;
    case 'murder':
      frame(ctx, '#0a0e14');
      ctx.fillStyle = '#9fc0ff';
      ctx.textAlign = 'center';
      ctx.font = '600 92px "Inter Variable", sans-serif';
      ctx.fillText('MURDER.', W / 2, 200);
      ctx.font = '500 24px "IBM Plex Mono", monospace';
      ctx.fillText('“No one has the right”', W / 2, 270);
      break;
    case 'icpo':
      frame(ctx, '#0d1118');
      ctx.fillStyle = '#e8e3d8';
      ctx.font = '500 26px "IBM Plex Mono", monospace';
      ctx.fillText('INTERNATIONAL POLICE CONFERENCE', 24, 70);
      for (let i = 0; i < 9; i++) {
        ctx.fillStyle = 'rgba(232,227,216,0.25)';
        ctx.beginPath();
        ctx.arc(70 + i * 62, 220, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(48 + i * 62, 246, 44, 60);
      }
      break;
    case 'letter':
      ctx.fillStyle = '#f4f4f2';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#050505';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '400 260px "UnifrakturMaguntia", serif';
      ctx.fillText('L', W / 2, H / 2 + 14);
      break;
  }
}

export function screenTexture(
  kind: ScreenKind,
  count = 0,
): { texture: THREE.CanvasTexture; ctx: CanvasRenderingContext2D } {
  const { canvas, ctx } = makeCanvas(W, H);
  drawScreen(ctx, kind, count);
  return { texture: canvasTexture(canvas), ctx };
}
