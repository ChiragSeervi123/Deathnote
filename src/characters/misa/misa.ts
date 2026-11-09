import type * as THREE from 'three';
import type { FigurePart } from '../shared/InkFigure';
import { capsule, disc, poly, smooth, spike, type P } from '../shared/shapes';

/**
 * Misa Amane — full figure, standing, facing the camera. Original fan
 * illustration in the site's ink style: high blonde pigtails, black gothic
 * dress with a scalloped lace hem, bell sleeves, a silver cross and choker,
 * platform boots. Metres, origin between the feet, y up.
 *
 * Parts: body · head (pivot neck) · tailL / tailR (pivot at the hair ties,
 * sway them from the scene) · eyesRed (the Shinigami Eyes; toggle `.visible`
 * and drive with `setGlow`).
 */

export const MISA = {
  height: 1.6,
  neck: [0, 1.33] as P,
  face: [0, 1.44] as P,
  tieL: [-0.1, 1.53] as P,
  tieR: [0.1, 1.53] as P,
};

const SKIN = '#f1dfd0';
const SKIN_SHADE = '#c9ab98';
const HAIR = '#e9cf86';
const HAIR_HI = '#fbedc0';
const DRESS = '#141217';
const DRESS_HI = '#26222c';
const LACE = '#d8d2c8';
const STOCKING = '#1d1a20';
const SILVER = '#d4d1cb';
const EYE = '#2b1915';
const RED = '#e8101c';

const [NX, NY] = MISA.neck;
const r = (x: number, y: number): P => [x - NX, y - NY];
const R = (pts: P[]) => pts.map(([x, y]) => r(x, y));

/** Skirt outline, flaring from the waist to a scalloped hem at y≈0.56. */
function skirt(pad: number): THREE.Shape {
  return smooth([
    [-0.12 - pad, 0.97],
    [-0.2 - pad, 0.84],
    [-0.31 - pad, 0.66],
    [-0.34 - pad, 0.56 - pad],
    [0, 0.53 - pad],
    [0.34 + pad, 0.56 - pad],
    [0.31 + pad, 0.66],
    [0.2 + pad, 0.84],
    [0.12 + pad, 0.97],
    [0, 0.99 + pad],
  ]);
}

function hemScallops(rad: number, y: number): THREE.Shape[] {
  const s: THREE.Shape[] = [];
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const x = -0.31 + t * 0.62;
    s.push(disc([x, y - Math.sin(t * Math.PI) * 0.02], rad));
  }
  return s;
}

function bodice(pad: number): THREE.Shape {
  return smooth([
    [-0.12 - pad, 0.95],
    [-0.115 - pad, 1.08],
    [-0.16 - pad, 1.24],
    [-0.19 - pad, 1.28],
    [-0.05, 1.32 + pad],
    [0.05, 1.32 + pad],
    [0.19 + pad, 1.28],
    [0.16 + pad, 1.24],
    [0.115 + pad, 1.08],
    [0.12 + pad, 0.95],
  ]);
}

/** Arm: upper arm, forearm angled in toward the skirt, bell cuff, hand. */
function arm(side: -1 | 1, pad: number): THREE.Shape[] {
  const sh: P = [side * 0.18, 1.25];
  const el: P = [side * 0.235, 1.02];
  const wr: P = [side * 0.215, 0.84];
  return [
    ...capsule(sh, el, 0.045 + pad, 0.037 + pad),
    ...capsule(el, wr, 0.037 + pad, 0.03 + pad),
    // Bell cuff.
    poly([
      [wr[0] - 0.035 * side - pad * side, wr[1] + 0.08],
      [wr[0] + 0.03 * side + pad * side, wr[1] + 0.08],
      [wr[0] + 0.06 * side + pad * side, wr[1] - 0.02 - pad],
      [wr[0] - 0.055 * side - pad * side, wr[1] - 0.02 - pad],
    ]),
  ];
}

function legs(pad: number): THREE.Shape[] {
  const s: THREE.Shape[] = [];
  for (const side of [-1, 1] as const) {
    s.push(...capsule([side * 0.075, 0.62], [side * 0.08, 0.2], 0.05 + pad, 0.038 + pad));
    // Platform boot.
    s.push(
      smooth([
        [side * 0.035 - pad, 0.3],
        [side * 0.125 + pad * side, 0.3],
        [side * 0.13 + pad * side, 0.06],
        [side * 0.15 + pad * side, 0.0 - pad],
        [side * 0.02 - pad * side, 0.0 - pad],
        [side * 0.03 - pad * side, 0.06],
      ]),
    );
  }
  return s;
}

function cross(cx: number, cy: number, k: number): THREE.Shape[] {
  return [
    poly([
      [cx - 0.006 * k, cy + 0.03 * k],
      [cx + 0.006 * k, cy + 0.03 * k],
      [cx + 0.006 * k, cy - 0.045 * k],
      [cx - 0.006 * k, cy - 0.045 * k],
    ]),
    poly([
      [cx - 0.022 * k, cy + 0.012 * k],
      [cx + 0.022 * k, cy + 0.012 * k],
      [cx + 0.022 * k, cy],
      [cx - 0.022 * k, cy],
    ]),
  ];
}

function face(pad: number): THREE.Shape {
  return smooth(
    R([
      [-0.085 - pad, 1.5],
      [-0.09 - pad, 1.42],
      [-0.065 - pad, 1.36],
      [0, 1.33 - pad],
      [0.065 + pad, 1.36],
      [0.09 + pad, 1.42],
      [0.085 + pad, 1.5],
      [0, 1.54 + pad],
    ]),
  );
}

function hairCap(pad: number): THREE.Shape {
  return smooth(
    R([
      [-0.105 - pad, 1.4],
      [-0.112 - pad, 1.5],
      [-0.08 - pad, 1.58],
      [0, 1.605 + pad],
      [0.08 + pad, 1.58],
      [0.112 + pad, 1.5],
      [0.105 + pad, 1.4],
      [0.09, 1.47],
      [-0.09, 1.47],
    ]),
  );
}

function bangs(): THREE.Shape[] {
  const s: THREE.Shape[] = [];
  const locks: Array<[number, number, number]> = [
    [-0.08, 0.085, -0.12],
    [-0.05, 0.075, -0.05],
    [-0.018, 0.078, 0],
    [0.018, 0.078, 0.02],
    [0.05, 0.075, 0.06],
    [0.08, 0.085, 0.12],
  ];
  for (const [x, len, tilt] of locks)
    s.push(spike(r(x, 1.565), -Math.PI / 2 + tilt, len, 0.026, (x > 0 ? 1 : -1) * 0.004));
  // Side locks framing the face.
  s.push(spike(r(-0.095, 1.5), -Math.PI / 2 - 0.05, 0.17, 0.022, 0.01));
  s.push(spike(r(0.095, 1.5), -Math.PI / 2 + 0.05, 0.17, 0.022, -0.01));
  return s;
}

/** A pigtail authored relative to its tie; falls outward and down. */
function tail(side: -1 | 1, pad: number): THREE.Shape {
  const k = side;
  return smooth([
    [0, 0.03 + pad],
    [k * (0.09 + pad), 0.02],
    [k * (0.17 + pad), -0.1],
    [k * (0.2 + pad), -0.28],
    [k * (0.17 + pad), -0.44],
    [k * 0.1, -0.56 - pad],
    [k * (0.09 - pad), -0.42],
    [k * (0.06 - pad), -0.2],
    [k * (0.0 - pad), -0.04],
  ]);
}

/** Fine strands of light along a pigtail. */
function tailStrands(side: -1 | 1): THREE.Shape[] {
  return [
    spike([side * 0.11, -0.06], -Math.PI / 2 + side * 0.35, 0.3, 0.008, side * 0.03),
    spike([side * 0.14, -0.14], -Math.PI / 2 + side * 0.12, 0.28, 0.007, side * 0.02),
  ];
}

const eyeShape = (cx: number, h: number): THREE.Shape =>
  smooth(
    R([
      [cx - 0.025, 1.448],
      [cx, 1.448 + h],
      [cx + 0.025, 1.448],
      [cx, 1.448 - h * 0.75],
    ]),
  );

export function misaParts(): FigurePart[] {
  const PAD = 0.012;
  const body: FigurePart = {
    id: 'body',
    ink: [
      ...legs(PAD),
      skirt(PAD),
      ...hemScallops(0.045, 0.56),
      bodice(PAD),
      ...arm(-1, PAD),
      ...arm(1, PAD),
      disc([-0.215, 0.79], 0.035),
      disc([0.215, 0.79], 0.035),
    ],
    layers: [
      { shapes: legs(0).filter((_, i) => i % 4 !== 3), color: STOCKING },
      { shapes: hemScallops(0.036, 0.56), color: LACE },
      { shapes: [skirt(0)], color: DRESS },
      {
        // Pleats catching the light.
        shapes: [-0.18, -0.06, 0.06, 0.18].map((x) =>
          spike([x * 0.6, 0.95], -Math.PI / 2 + x * 0.9, 0.38, 0.018),
        ),
        color: DRESS_HI,
      },
      { shapes: [bodice(0)], color: DRESS },
      {
        // Corset lacing down the bodice.
        shapes: [0, 1, 2, 3, 4].map((i) =>
          poly([
            [-0.03, 1.2 - i * 0.045],
            [0.03, 1.185 - i * 0.045],
            [0.03, 1.177 - i * 0.045],
            [-0.03, 1.192 - i * 0.045],
          ]),
        ),
        color: LACE,
      },
      { shapes: [...arm(-1, 0), ...arm(1, 0)], color: DRESS },
      { shapes: [disc([-0.215, 0.79], 0.026), disc([0.215, 0.79], 0.026)], color: SKIN_SHADE },
      { shapes: cross(0, 1.15, 1), color: SILVER },
    ],
  };

  const head: FigurePart = {
    id: 'head',
    pivot: MISA.neck,
    z: 0.012,
    ink: [...capsule(r(0, 1.3), r(0, 1.38), 0.03, 0.035), face(0.008), hairCap(0.01), ...bangs()],
    layers: [
      { shapes: capsule(r(0, 1.3), r(0, 1.38), 0.025, 0.03), color: SKIN_SHADE },
      // Choker with a small cross.
      {
        shapes: [
          poly(
            R([
              [-0.032, 1.355],
              [0.032, 1.355],
              [0.03, 1.338],
              [-0.03, 1.338],
            ]),
          ),
        ],
        color: '#08070a',
      },
      { shapes: cross(...r(0, 1.33), 0.45), color: SILVER },
      { shapes: [face(0)], color: SKIN },
      { shapes: [hairCap(0)], color: HAIR },
      { shapes: bangs(), color: HAIR },
      {
        shapes: [
          spike(r(-0.03, 1.59), -Math.PI / 2 - 0.4, 0.06, 0.012),
          spike(r(0.045, 1.585), -Math.PI / 2 + 0.3, 0.05, 0.01),
        ],
        color: HAIR_HI,
      },
      { shapes: [eyeShape(-0.038, 0.02), eyeShape(0.038, 0.02)], color: EYE },
      {
        // Catchlights.
        shapes: [disc(r(-0.044, 1.456), 0.005), disc(r(0.032, 1.456), 0.005)],
        color: '#f4efe8',
      },
      {
        // Lashes: a dark upper line over each eye.
        shapes: [-0.038, 0.038].map((cx) =>
          poly(
            R([
              [cx - 0.03, 1.451],
              [cx, 1.469],
              [cx + 0.03, 1.451],
              [cx + 0.03, 1.4535],
              [cx, 1.4725],
              [cx - 0.03, 1.4535],
            ]),
          ),
        ),
        color: '#0a0708',
      },
      { shapes: [disc(r(0, 1.375), 0.012, 0.004)], color: '#b85a5e' },
    ],
  };

  const tails: FigurePart[] = (
    [
      ['tailL', MISA.tieL, -1],
      ['tailR', MISA.tieR, 1],
    ] as const
  ).map(([id, tie, side]) => ({
    id,
    parent: 'head',
    pivot: r(tie[0], tie[1]),
    // Behind the head and body, clear of their layer stack.
    z: -0.04,
    ink: [tail(side, 0.01)],
    layers: [
      { shapes: [tail(side, 0)], color: HAIR },
      { shapes: tailStrands(side), color: HAIR_HI },
      { shapes: [disc([0, 0.0], 0.028, 0.022)], color: '#0a080b' },
    ],
  }));

  const eyesRed: FigurePart = {
    id: 'eyesRed',
    parent: 'head',
    // Head layers sit 1 mm apart: this lands just above the eye and catchlight
    // layers and under the lashes, so there is no visible parallax.
    z: 0.0085,
    layers: [
      {
        shapes: [eyeShape(-0.038, 0.02), eyeShape(0.038, 0.02)],
        color: RED,
        emissive: 1.25,
      },
    ],
  };

  return [body, head, ...tails, eyesRed];
}
