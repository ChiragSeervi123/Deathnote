import * as THREE from 'three';
import { mulberry32 } from '@/utils/math';
import {
  canvasTexture,
  heightToNormalCanvas,
  leatherHeight,
  makeCanvas,
  paperGrain,
  wrapLines,
} from '../../shared/canvasTextures';

/** Physical proportions of the notebook (scene units ≈ decimetres). */
export const NB = {
  width: 1.48,
  height: 2.1,
  cover: 0.022,
  block: 0.12,
} as const;

const PAGE_ASPECT = NB.height / NB.width;

/** Original paraphrases (see docs/content/rules-and-mechanics.md). */
export const PAGE_RULES: readonly string[] = [
  'The person whose name is written in this notebook will die.',
  'It has no effect unless the writer pictures that person’s face while writing — so others who share the name are spared.',
  'If a cause of death is written within forty seconds of the name, it will happen. If none is written, the person dies of a heart attack.',
  'Once the cause is written, the details of the death may be written within the next six minutes and forty seconds.',
];

export function createLeatherMaps(size: number): { normal: THREE.CanvasTexture; rough: THREE.CanvasTexture } {
  const h = leatherHeight(size, Math.round(size / 14), 7);
  const normal = canvasTexture(heightToNormalCanvas(h, size, 2.2), { srgb: false, repeat: 3 });
  const { canvas, ctx } = makeCanvas(size, size);
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = 150 + h[i]! * 70; // creases rougher than pebble tops
    img.data[i * 4] = v;
    img.data[i * 4 + 1] = v;
    img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const rough = canvasTexture(canvas, { srgb: false, repeat: 3 });
  return { normal, rough };
}

/** Front-cover lettering: original typesetting in a generic blackletter (not the series logo). */
export function createCoverTitle(width: number): THREE.CanvasTexture {
  const h = Math.round(width * 0.3);
  const { canvas, ctx } = makeCanvas(width, h);
  ctx.clearRect(0, 0, width, h);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `400 ${Math.round(h * 0.62)}px "UnifrakturMaguntia", serif`;
  // Hand-set letter spacing.
  const text = 'Death Note';
  const spacing = h * 0.035;
  const widths = [...text].map((ch) => ctx.measureText(ch).width + spacing);
  const total = widths.reduce((a, b) => a + b, 0) - spacing;
  let x = (width - total) / 2;
  ctx.textAlign = 'left';
  [...text].forEach((ch, i) => {
    ctx.fillText(ch, x, h * 0.54);
    x += widths[i]!;
  });
  // Wear: knock tiny specks out of the print so it reads as foil on leather.
  const rnd = mulberry32(3);
  ctx.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < width * 3; i++) {
    const r = rnd() * 1.8;
    ctx.globalAlpha = 0.25 + rnd() * 0.6;
    ctx.beginPath();
    ctx.arc(rnd() * width, rnd() * h, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  const t = canvasTexture(canvas);
  return t;
}

/** Inside of the front cover: black, with instructions printed in white. */
export function createInsideCover(width: number): THREE.CanvasTexture {
  const h = Math.round(width * PAGE_ASPECT);
  const { canvas, ctx } = makeCanvas(width, h);
  ctx.fillStyle = '#0c0b0b';
  ctx.fillRect(0, 0, width, h);
  const m = width * 0.11;
  ctx.fillStyle = '#e9e4d8';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `500 ${Math.round(width * 0.052)}px "Cormorant Garamond Variable", serif`;
  ctx.fillText('HOW TO USE IT', m, h * 0.13);
  ctx.fillRect(m, h * 0.145, width * 0.34, Math.max(1, width * 0.002));
  ctx.font = `400 ${Math.round(width * 0.03)}px "Cormorant Garamond Variable", serif`;
  ctx.fillStyle = 'rgba(233,228,216,0.86)';
  const lines = [
    'I.  The person whose name is written in this notebook will die.',
    '    1. The writer must have the person’s face in mind.',
    '    2. A cause written within 40 seconds will come to pass.',
    '    3. Without a cause, death comes by heart attack.',
    '    4. Details may follow within 6 minutes 40 seconds.',
  ];
  let y = h * 0.22;
  const maxW = width - m * 2;
  for (const l of lines) {
    for (const w of wrapLines(ctx, l, maxW)) {
      ctx.fillText(w, m, y);
      y += width * 0.05;
    }
    y += width * 0.012;
  }
  ctx.font = `400 ${Math.round(width * 0.024)}px "IBM Plex Mono", monospace`;
  ctx.fillStyle = 'rgba(233,228,216,0.4)';
  ctx.fillText('— fan reconstruction, paraphrased', m, h * 0.93);
  // Slight print unevenness.
  const rnd = mulberry32(11);
  ctx.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < width * 2; i++) {
    ctx.globalAlpha = rnd() * 0.35;
    ctx.fillRect(rnd() * width, rnd() * h, 1.5, 1.5);
  }
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  return canvasTexture(canvas);
}

/** Ruled-line layout shared by the paper and the ink atlas (fractions of page height). */
export const RULING = { top: 0.12, step: 0.047, marginX: 0.11, textWidth: 0.8 } as const;

/** Cream ruled paper, shared by every page face (gutter at u = 0). */
export function createPaper(width: number, seed: number): THREE.CanvasTexture {
  const h = Math.round(width * PAGE_ASPECT);
  const { canvas, ctx } = makeCanvas(width, h);
  const g = ctx.createLinearGradient(0, 0, width, 0);
  g.addColorStop(0, '#d6ccb8');
  g.addColorStop(0.07, '#ebe4d5');
  g.addColorStop(1, '#f0eadd');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, h);
  paperGrain(ctx, width, h, seed, 0.045);
  ctx.strokeStyle = 'rgba(70,86,110,0.24)';
  ctx.lineWidth = Math.max(1, width * 0.0016);
  for (let y = h * RULING.top; y < h * 0.95; y += h * RULING.step) {
    ctx.beginPath();
    ctx.moveTo(width * 0.06, y);
    ctx.lineTo(width * 0.96, y);
    ctx.stroke();
  }
  return canvasTexture(canvas);
}

export interface InkAtlas {
  /** Channel k (r, g, b, a) holds the handwriting of rule k as coverage. */
  texture: THREE.DataTexture;
  lineCounts: number[];
}

/**
 * Handwritten rules packed one per colour channel — one texture for four
 * pages. Built as raw bytes (a canvas would premultiply and destroy RGB where
 * alpha is low); rows are flipped here so UVs match canvas textures.
 */
export function createInkAtlas(width: number, rules: readonly string[]): InkAtlas {
  const h = Math.round(width * PAGE_ASPECT);
  const step = h * RULING.step;
  const top = h * RULING.top;
  const data = new Uint8Array(width * h * 4);
  const lineCounts: number[] = [];
  rules.slice(0, 4).forEach((text, k) => {
    const { ctx } = makeCanvas(width, h);
    ctx.fillStyle = '#fff';
    ctx.font = `400 ${Math.round(step * 0.82)}px "Nothing You Could Do", cursive`;
    const lines = wrapLines(ctx, text, width * RULING.textWidth);
    const rnd = mulberry32(k * 7 + 1);
    lines.forEach((line, i) => {
      ctx.save();
      ctx.translate(width * RULING.marginX + rnd() * 4, top + step * (i + 1) - step * 0.2);
      ctx.rotate((rnd() - 0.5) * 0.012);
      ctx.fillText(line, 0, 0);
      ctx.restore();
    });
    lineCounts.push(lines.length);
    const src = ctx.getImageData(0, 0, width, h).data;
    for (let y = 0; y < h; y++) {
      const dst = (h - 1 - y) * width;
      const row = y * width;
      for (let x = 0; x < width; x++) data[(dst + x) * 4 + k] = src[(row + x) * 4 + 3]!;
    }
  });
  const texture = new THREE.DataTexture(data, width, h, THREE.RGBAFormat);
  texture.colorSpace = THREE.NoColorSpace;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return { texture, lineCounts };
}

/** Edge of the page block: fine stripes of stacked paper. */
export function createPageEdge(): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(64, 256);
  ctx.fillStyle = '#e4dccb';
  ctx.fillRect(0, 0, 64, 256);
  const rnd = mulberry32(5);
  for (let y = 0; y < 256; y += 2) {
    ctx.fillStyle = `rgba(90,78,60,${0.08 + rnd() * 0.16})`;
    ctx.fillRect(0, y, 64, 1);
  }
  const t = canvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
