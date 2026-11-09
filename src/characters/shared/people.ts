import type * as THREE from 'three';
import { mulberry32 } from '@/utils/math';
import type { FigurePart, FigureLayer } from './InkFigure';
import { capsule, disc, poly, smooth, spike } from './shapes';

/**
 * Generic original figures for secondary characters (executives, task force,
 * crowds, silhouettes in doorways). Front view, metres, origin at the feet.
 */
export type Hair = 'short' | 'neat' | 'bob' | 'long' | 'spiky' | 'twintails' | 'curly' | 'bald';

export interface PersonOpts {
  hair?: Hair;
  height?: number;
  build?: number;
  coat?: boolean;
  sitting?: boolean;
  seed?: number;
  /** Optional lit layers: face colour and clothing colour. */
  face?: string;
  clothes?: string;
  hairColor?: string;
  /** Emissive eye glints (e.g. Shinigami Eyes red). */
  eyes?: string;
}

function hairShapes(hair: Hair, hy: number, r: number, seed: number): THREE.Shape[] {
  const rnd = mulberry32(seed);
  const s: THREE.Shape[] = [];
  switch (hair) {
    case 'short':
    case 'neat':
      s.push(smooth([[-r * 1.05, hy], [-r * 1.08, hy + r * 0.7], [-r * 0.5, hy + r * 1.15], [r * 0.5, hy + r * 1.15], [r * 1.08, hy + r * 0.7], [r * 1.05, hy], [0, hy + r * 0.55]]));
      break;
    case 'bob':
      s.push(smooth([[-r * 1.25, hy - r * 0.9], [-r * 1.2, hy + r * 0.6], [-r * 0.5, hy + r * 1.2], [r * 0.5, hy + r * 1.2], [r * 1.2, hy + r * 0.6], [r * 1.25, hy - r * 0.9], [0, hy + r * 0.4]]));
      break;
    case 'long':
      s.push(smooth([[-r * 1.2, hy - r * 2.6], [-r * 1.25, hy + r * 0.6], [-r * 0.5, hy + r * 1.2], [r * 0.5, hy + r * 1.2], [r * 1.25, hy + r * 0.6], [r * 1.2, hy - r * 2.6], [0, hy - r * 1.6]]));
      break;
    case 'twintails':
      s.push(smooth([[-r * 1.1, hy - r * 0.3], [-r * 1.12, hy + r * 0.7], [-r * 0.5, hy + r * 1.18], [r * 0.5, hy + r * 1.18], [r * 1.12, hy + r * 0.7], [r * 1.1, hy - r * 0.3], [0, hy + r * 0.45]]));
      for (const side of [-1, 1] as const) s.push(spike([side * r * 1.0, hy + r * 0.5], -Math.PI / 2 + side * 0.35, r * 3.3, r * 0.5, side * r * 0.4));
      break;
    case 'curly':
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 1.25 - 0.12;
        s.push(disc([Math.cos(a) * r * 0.95, hy + r * 0.2 + Math.sin(a) * r * 0.95], r * 0.42));
      }
      break;
    case 'spiky':
      for (let i = 0; i < 18; i++) {
        const a = (i / 17) * Math.PI * 1.4 - 0.2;
        s.push(spike([Math.cos(a) * r * 0.6, hy + Math.sin(a) * r * 0.6], a + (rnd() - 0.5) * 0.3, r * (0.8 + rnd() * 0.5), r * 0.32));
      }
      break;
    case 'bald':
      break;
  }
  return s;
}

/** A single-part figure (`body`), with an optional `head` part for idle motion. */
export function personParts(o: PersonOpts = {}): FigurePart[] {
  const h = o.height ?? 1.75;
  const b = o.build ?? 1;
  const k = h / 1.75;
  const headR = 0.105 * k;
  const sit = o.sitting ? 0.42 * k : 0;
  const hipY = 0.92 * k - sit;
  const shoulderY = 1.45 * k - sit;
  const neckY = 1.52 * k - sit;
  const headY = 1.64 * k - sit;
  const torso = smooth([
    [-0.17 * b * k, hipY],
    [-0.2 * b * k, shoulderY - 0.25 * k],
    [-0.23 * b * k, shoulderY],
    [-0.06 * k, neckY],
    [0.06 * k, neckY],
    [0.23 * b * k, shoulderY],
    [0.2 * b * k, shoulderY - 0.25 * k],
    [0.17 * b * k, hipY],
  ]);
  const legs = o.sitting
    ? [...capsule([-0.1 * k, hipY], [-0.1 * k, 0.05], 0.075 * k, 0.055 * k), ...capsule([0.1 * k, hipY], [0.1 * k, 0.05], 0.075 * k, 0.055 * k)]
    : [...capsule([-0.09 * k, hipY], [-0.1 * k, 0.04], 0.078 * k, 0.05 * k), ...capsule([0.09 * k, hipY], [0.1 * k, 0.04], 0.078 * k, 0.05 * k)];
  const arms = [
    ...capsule([-0.22 * b * k, shoulderY - 0.02], [-0.26 * b * k, hipY - 0.05 * k], 0.055 * k, 0.045 * k),
    ...capsule([0.22 * b * k, shoulderY - 0.02], [0.26 * b * k, hipY - 0.05 * k], 0.055 * k, 0.045 * k),
  ];
  const coat = o.coat ? [poly([[-0.24 * b * k, shoulderY - 0.1], [0.24 * b * k, shoulderY - 0.1], [0.3 * b * k, hipY - 0.25 * k], [-0.3 * b * k, hipY - 0.25 * k]])] : [];
  const body: FigurePart = {
    id: 'body',
    ink: [torso, ...legs, ...arms, ...coat],
    layers: o.clothes ? [{ shapes: [torso, ...coat], color: o.clothes }] : [],
  };
  const r = (x: number, y: number): [number, number] => [x, y - neckY];
  const headShapes = [disc(r(0, headY), headR, headR * 1.18), ...capsule(r(0, neckY), r(0, neckY + 0.06 * k), 0.045 * k, 0.05 * k)];
  const hair = hairShapes(o.hair ?? 'short', headY - neckY, headR, o.seed ?? 3);
  const layers: FigureLayer[] = [];
  if (o.face) layers.push({ shapes: [disc(r(0, headY - headR * 0.08), headR * 0.86, headR * 1.05)], color: o.face });
  if (o.hairColor && hair.length) layers.push({ shapes: hair, color: o.hairColor });
  if (o.eyes) layers.push({ shapes: [disc(r(-headR * 0.38, headY), headR * 0.13), disc(r(headR * 0.38, headY), headR * 0.13)], color: o.eyes, emissive: 2.4 });
  return [body, { id: 'head', pivot: [0, neckY], z: 0.01, ink: [...headShapes, ...hair], layers }];
}
