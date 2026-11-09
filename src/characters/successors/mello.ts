import type * as THREE from 'three';
import type { FigurePart } from '../shared/InkFigure';
import { capsule, disc, poly, smooth, type P } from '../shared/shapes';

/**
 * Mello — a boy in black, standing, a bar of chocolate raised in his right
 * hand. Blond bob with a straight fringe, a rosary at his chest. Original fan
 * illustration in the site's ink style (metres, origin between the feet,
 * y up, facing the camera).
 *
 * Parts: body · head (pivot at the neck) · armR (pivot at the shoulder) ·
 * bar (the chocolate, child of armR) · piece (the square he snaps off,
 * child of bar).
 */

export const MELLO = {
  neck: [0, 1.46] as P,
  shoulderR: [-0.2, 1.4] as P,
  hand: [-0.13, 1.37] as P,
};

const BLACK = '#121214';
const BLACK_HI = '#2a2a31';
const SKIN = '#efdccb';
const HAIR = '#e6c47c';
const HAIR_HI = '#f6e3b0';
const EYE = '#2c2420';
const SILVER = '#d0cec8';
const CHOC = '#4a2a18';
const FOIL = '#c9c9cc';

function legs(pad: number): THREE.Shape[] {
  const s: THREE.Shape[] = [];
  for (const side of [-1, 1] as const) {
    s.push(...capsule([side * 0.09, 0.92], [side * 0.1, 0.48], 0.075 + pad, 0.058 + pad));
    s.push(...capsule([side * 0.1, 0.48], [side * 0.11, 0.08], 0.058 + pad, 0.045 + pad));
    s.push(disc([side * 0.12, 0.04], 0.07 + pad, 0.045 + pad));
  }
  return s;
}

function torso(pad: number): THREE.Shape {
  return smooth([
    [-0.16 - pad, 0.86],
    [-0.17 - pad, 1.15],
    [-0.22 - pad, 1.4],
    [-0.06, 1.47 + pad],
    [0.06, 1.47 + pad],
    [0.22 + pad, 1.4],
    [0.17 + pad, 1.15],
    [0.16 + pad, 0.86],
  ]);
}

/** Left arm (viewer's right) hangs, hand hooked in a pocket. */
function armL(pad: number): THREE.Shape[] {
  return [
    ...capsule([0.2, 1.4], [0.26, 1.13], 0.05 + pad, 0.043 + pad),
    ...capsule([0.26, 1.13], [0.19, 0.93], 0.043 + pad, 0.037 + pad),
  ];
}

const [SX, SY] = MELLO.shoulderR;
const a = (x: number, y: number): P => [x - SX, y - SY];

/** Right arm authored relative to the shoulder: elbow down and out, hand up at the chin. */
function armR(pad: number): THREE.Shape[] {
  return [
    ...capsule(a(-0.2, 1.4), a(-0.29, 1.12), 0.05 + pad, 0.043 + pad),
    ...capsule(a(-0.29, 1.12), a(-0.14, 1.34), 0.043 + pad, 0.036 + pad),
  ];
}

const [HX, HY] = MELLO.hand;
/** Chocolate bar relative to the hand: foil below the fingers, bare squares above. */
const barShape = (x0: number, y0: number, x1: number, y1: number): THREE.Shape =>
  poly([
    [x0, y0],
    [x1, y0],
    [x1, y1],
    [x0, y1],
  ]);

const [NX, NY] = MELLO.neck;
const r = (x: number, y: number): P => [x - NX, y - NY];
const R = (pts: P[]) => pts.map(([x, y]) => r(x, y));

function hair(pad: number): THREE.Shape {
  // Bob cut: crown, straight sides to the jaw.
  return smooth(
    R([
      [-0.115 - pad, 1.5],
      [-0.12 - pad, 1.64],
      [-0.07, 1.735 + pad],
      [0.07, 1.735 + pad],
      [0.12 + pad, 1.64],
      [0.115 + pad, 1.5],
      [0.105 + pad, 1.47 - pad],
      [0.07, 1.56],
      [-0.07, 1.56],
      [-0.105 - pad, 1.47 - pad],
    ]),
  );
}

const face = (pad: number) => disc(r(0, 1.585), 0.085 + pad, 0.105 + pad);

/** Straight-cut fringe at the brow. */
const fringe = () =>
  poly(
    R([
      [-0.1, 1.715],
      [0.1, 1.715],
      [0.098, 1.625],
      [-0.098, 1.625],
    ]),
  );

function rosary(): THREE.Shape[] {
  const s: THREE.Shape[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const x = (t - 0.5) * 0.17;
    const y = 1.44 - (1 - Math.pow(2 * t - 1, 2)) * 0.18;
    s.push(disc([x, y], 0.0065));
  }
  // Cross below the loop.
  s.push(barShape(-0.005, 1.17, 0.005, 1.245), barShape(-0.022, 1.218, 0.022, 1.228));
  return s;
}

export function melloParts(): FigurePart[] {
  const PAD = 0.011;
  return [
    {
      id: 'body',
      ink: [...legs(PAD), torso(PAD), ...armL(PAD)],
      layers: [
        { shapes: legs(0), color: BLACK },
        {
          // Leather catching the hard key light down one side.
          shapes: [
            poly([
              [0.135, 0.9],
              [0.155, 0.9],
              [0.15, 0.1],
              [0.135, 0.1],
            ]),
          ],
          color: BLACK_HI,
        },
        { shapes: [torso(0)], color: BLACK },
        {
          shapes: [
            poly([
              [0.13, 1.38],
              [0.165, 1.35],
              [0.15, 0.9],
              [0.135, 0.9],
            ]),
          ],
          color: BLACK_HI,
        },
        { shapes: armL(0), color: BLACK },
        { shapes: rosary(), color: SILVER },
      ],
    },
    {
      id: 'head',
      pivot: MELLO.neck,
      z: 0.012,
      ink: [...capsule(r(0, 1.44), r(0, 1.5), 0.034, 0.036), face(0.008), hair(0.01)],
      layers: [
        { shapes: capsule(r(0, 1.44), r(0, 1.5), 0.029, 0.031), color: SKIN },
        // The bob sits behind the face; only the fringe crosses it.
        { shapes: [hair(0)], color: HAIR },
        { shapes: [face(0)], color: SKIN },
        { shapes: [fringe()], color: HAIR },
        {
          shapes: [
            poly(
              R([
                [-0.06, 1.72],
                [-0.03, 1.725],
                [-0.05, 1.64],
                [-0.065, 1.64],
              ]),
            ),
          ],
          color: HAIR_HI,
        },
        {
          // Narrow, sharp eyes under the fringe.
          shapes: [-0.035, 0.035].map((cx) =>
            smooth(
              R([
                [cx - 0.022, 1.6],
                [cx, 1.612],
                [cx + 0.022, 1.604],
                [cx, 1.596],
              ]),
            ),
          ),
          color: EYE,
        },
        {
          shapes: [
            poly(
              R([
                [-0.014, 1.53],
                [0.016, 1.534],
                [0.016, 1.529],
                [-0.014, 1.526],
              ]),
            ),
          ],
          color: '#8a5a50',
        },
      ],
    },
    {
      id: 'armR',
      pivot: MELLO.shoulderR,
      z: 0.03,
      ink: armR(PAD),
      layers: [
        { shapes: armR(0), color: BLACK },
        { shapes: [disc(a(HX, HY), 0.036)], color: SKIN },
      ],
    },
    {
      id: 'bar',
      parent: 'armR',
      pivot: a(HX, HY),
      z: 0.006,
      ink: [barShape(-0.026, -0.05, 0.026, 0.09)],
      layers: [
        { shapes: [barShape(-0.02, -0.044, 0.02, 0.085)], color: CHOC },
        { shapes: [barShape(-0.024, -0.05, 0.024, 0.03)], color: FOIL },
        { shapes: [disc([0, 0.0], 0.034, 0.03)], color: SKIN },
      ],
    },
    {
      id: 'piece',
      parent: 'bar',
      pivot: [0, 0.09],
      z: 0.004,
      ink: [barShape(-0.026, -0.004, 0.026, 0.04)],
      layers: [
        { shapes: [barShape(-0.02, 0, 0.02, 0.034)], color: CHOC },
        { shapes: [barShape(-0.02, 0.016, 0.02, 0.019)], color: '#2e190e' },
      ],
    },
  ];
}
