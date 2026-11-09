import type * as THREE from 'three';
import { mulberry32 } from '@/utils/math';
import type { FigurePart } from '../shared/InkFigure';
import { capsule, disc, poly, smooth, spike, type P } from '../shared/shapes';

/**
 * L — crouched on a chair, knees drawn up, thumb at his lip. Front view.
 * Original fan illustration (metres; origin at the middle of the chair seat).
 * Parts: body, armHand (thumb to lip), head, irises (gaze), each animatable.
 */

/** Head and arm art is authored around these origins, then placed at the crouched pivots. */
const HEAD_ORIGIN: P = [0.0, 0.8];
const ARM_ORIGIN: P = [-0.19, 0.74];

export const L_FIG = {
  neck: [0.0, 0.69] as P,
  eyes: [
    [-0.046, 0.952],
    [0.044, 0.95],
  ] as P[],
  shoulderR: [-0.19, 0.655] as P,
};

const SKIN = '#ece7df';
const SKIN_SHADE = '#b9b1a6';
const SHIRT = '#e9e8e3';
const SHIRT_SHADE = '#a9aaa8';
const JEANS = '#3d5275';
const JEANS_SHADE = '#273652';
const HAIR = '#0c0c0e';
const SOCKET = '#5b5c66';

function feet(): THREE.Shape[] {
  const s: THREE.Shape[] = [];
  for (const side of [-1, 1] as const) {
    s.push(
      smooth([
        [side * 0.03, 0.0],
        [side * 0.03, 0.06],
        [side * 0.11, 0.075],
        [side * 0.15, 0.04],
        [side * 0.14, -0.005],
      ]),
    );
    for (let i = 0; i < 4; i++) s.push(disc([side * (0.045 + i * 0.026), 0.003], 0.012, 0.01));
  }
  return s;
}

export function lParts(): FigurePart[] {
  const rnd = mulberry32(11);
  const torso = smooth([
    [-0.21, 0.42],
    [-0.23, 0.56],
    [-0.2, 0.655],
    [-0.08, 0.695],
    [0.08, 0.695],
    [0.2, 0.655],
    [0.23, 0.56],
    [0.21, 0.42],
  ]);
  const shins = [
    ...capsule([-0.1, 0.48], [-0.085, 0.06], 0.078, 0.05),
    ...capsule([0.1, 0.48], [0.085, 0.06], 0.078, 0.05),
  ];
  const knees = [disc([-0.105, 0.5], 0.085, 0.07), disc([0.105, 0.5], 0.085, 0.07)];
  // Left arm (his left, viewer's right) wrapped around the knees.
  const armWrap = [
    ...capsule([0.2, 0.645], [0.25, 0.47], 0.05, 0.045),
    ...capsule([0.25, 0.47], [0.06, 0.44], 0.045, 0.04),
  ];
  const handWrap = [disc([0.04, 0.445], 0.042, 0.032)];

  const shirtShade = smooth([
    [0.06, 0.69],
    [0.2, 0.655],
    [0.23, 0.56],
    [0.2, 0.45],
    [0.1, 0.5],
    [0.08, 0.6],
  ]);
  const jeansShade = [
    poly([
      [0.02, 0.5],
      [0.17, 0.45],
      [0.13, 0.08],
      [0.06, 0.08],
    ]),
  ];

  // Arm raised to the mouth (his right, viewer's left), pivot at the shoulder.
  const [sx, sy] = ARM_ORIGIN;
  const ra = (p: P): P => [p[0] - sx, p[1] - sy];
  const armUp = [
    ...capsule(ra([-0.19, 0.74]), ra([-0.19, 0.5]), 0.05, 0.045),
    ...capsule(ra([-0.19, 0.5]), ra([-0.045, 0.85]), 0.045, 0.038),
  ];
  const hand = [disc(ra([-0.04, 0.865]), 0.035, 0.042, 0.4)];
  const thumb = [...capsule(ra([-0.03, 0.88]), ra([-0.008, 0.905]), 0.012, 0.01)];

  // Head: messy black hair all around, pale face, shadowed eyes.
  const [nx, ny] = HEAD_ORIGIN;
  const rh = (p: P): P => [p[0] - nx, p[1] - ny];
  const hair: THREE.Shape[] = [disc(rh([0.0, 1.0]), 0.152, 0.15)];
  for (let i = 0; i < 44; i++) {
    const ang = THREE_PI(i / 44) + (rnd() - 0.5) * 0.2;
    const down = Math.sin(ang) < 0;
    const len = (down ? 0.085 : 0.065) + rnd() * 0.05;
    hair.push(
      spike(
        rh([Math.cos(ang) * 0.11, 1.0 + Math.sin(ang) * 0.1]),
        ang + (rnd() - 0.5) * 0.4,
        len,
        0.052,
        (rnd() - 0.5) * 0.06,
      ),
    );
  }
  const face = smooth([
    rh([-0.1, 1.0]),
    rh([-0.098, 0.93]),
    rh([-0.07, 0.865]),
    rh([-0.02, 0.84]),
    rh([0.02, 0.84]),
    rh([0.07, 0.865]),
    rh([0.098, 0.93]),
    rh([0.1, 1.0]),
    rh([0, 1.02]),
  ]);
  // Fringe falling over the forehead.
  const fringe: THREE.Shape[] = [];
  for (let i = 0; i < 7; i++)
    fringe.push(
      spike(
        rh([-0.09 + i * 0.03, 1.06]),
        -Math.PI / 2 + (rnd() - 0.5) * 0.5,
        0.075 + rnd() * 0.04,
        0.026,
      ),
    );
  const neck = capsule(rh([0, 0.85]), rh([0, 0.79]), 0.035, 0.045);
  const sockets = L_FIG.eyes.map(([x, y]) =>
    smooth([
      rh([x - 0.032, y + 0.005]),
      rh([x, y + 0.026]),
      rh([x + 0.032, y + 0.004]),
      rh([x + 0.02, y - 0.03]),
      rh([x - 0.02, y - 0.03]),
    ]),
  );
  const whites = L_FIG.eyes.map(([x, y]) => disc(rh([x, y]), 0.021, 0.019));
  const mouth = poly([
    rh([-0.014, 0.874]),
    rh([0.012, 0.873]),
    rh([0.012, 0.869]),
    rh([-0.014, 0.87]),
  ]);
  const faceShade = smooth([
    rh([0.03, 1.0]),
    rh([0.098, 0.95]),
    rh([0.08, 0.87]),
    rh([0.03, 0.845]),
    rh([0.05, 0.92]),
  ]);

  const irises = L_FIG.eyes.map(([x, y]) => disc(rh([x, y - 0.001]), 0.0125));

  return [
    {
      id: 'body',
      ink: [torso, ...shins, ...knees, ...feet(), ...armWrap, ...handWrap],
      layers: [
        { shapes: [torso], color: SHIRT },
        { shapes: [shirtShade], color: SHIRT_SHADE },
        { shapes: [...shins, ...knees], color: JEANS },
        { shapes: jeansShade, color: JEANS_SHADE },
        { shapes: feet(), color: SKIN },
        { shapes: armWrap, color: SHIRT },
        { shapes: handWrap, color: SKIN },
      ],
    },
    {
      id: 'head',
      pivot: L_FIG.neck,
      z: 0.01,
      ink: [...hair, ...neck, face],
      layers: [
        { shapes: neck, color: SKIN_SHADE },
        { shapes: [face], color: SKIN },
        { shapes: [faceShade], color: SKIN_SHADE },
        { shapes: sockets, color: SOCKET },
        { shapes: whites, color: '#f4f2ee' },
        { shapes: [mouth], color: '#8c7a74' },
        { shapes: fringe, color: HAIR },
      ],
    },
    { id: 'irises', parent: 'head', z: 0.02, layers: [{ shapes: irises, color: '#050506' }] },
    {
      id: 'armHand',
      pivot: L_FIG.shoulderR,
      z: 0.04,
      ink: [...armUp, ...hand, ...thumb],
      layers: [
        { shapes: armUp, color: SHIRT },
        { shapes: [...hand, ...thumb], color: SKIN },
      ],
    },
  ];
}

function THREE_PI(t: number): number {
  return t * Math.PI * 2;
}
