import type * as THREE from 'three';
import type { FigurePart } from '../shared/InkFigure';
import { capsule, poly, smooth, spike, type P } from '../shared/shapes';

/**
 * Light Yagami — bust in a 3/4 view turned slightly to his right (viewer's
 * left). Original fan illustration (metres, y up, origin at waist centre).
 *
 * Expression parts (toggle `.visible` from the scene):
 *   eyesOpen / eyesNarrow · browsCalm / browsSharp · mouthNeutral / mouthSmirk
 * Iris colour is a separate part (`irisBrown` / `irisRed`).
 */

export const LIGHT = {
  neck: [0.0, 1.43] as P,
  headTop: 1.86,
};

const SKIN = '#e3cbb4';
const SKIN_SHADE = '#a8836c';
const HAIR = '#6e4a31';
const HAIR_SHADE = '#3c271a';
const HAIR_HI = '#9a6d48';
const BLAZER = '#1c2333';
const BLAZER_HI = '#2c3650';
const SHIRT = '#e8e4dc';
const TIE = '#4a2430';
const INK = '#120d0b';

function r(p: P): P {
  return [p[0] - LIGHT.neck[0], p[1] - LIGHT.neck[1]];
}
const R = (pts: P[]) => pts.map(r);

function faceOutline(): THREE.Shape {
  return smooth(
    R([
      [-0.05, 1.755],
      [-0.088, 1.71],
      [-0.094, 1.62],
      [-0.075, 1.535],
      [-0.035, 1.49],
      [-0.012, 1.478],
      [0.02, 1.49],
      [0.058, 1.53],
      [0.082, 1.61],
      [0.08, 1.71],
      [0.04, 1.76],
    ]),
  );
}

function hairMass(): THREE.Shape[] {
  const s: THREE.Shape[] = [];
  // Back and crown.
  s.push(
    smooth(
      R([
        [-0.118, 1.6],
        [-0.122, 1.72],
        [-0.09, 1.82],
        [-0.02, 1.86],
        [0.06, 1.845],
        [0.11, 1.78],
        [0.112, 1.66],
        [0.1, 1.58],
        [0.06, 1.7],
        [-0.06, 1.71],
      ]),
    ),
  );
  // Side locks over the ears.
  s.push(spike(r([-0.105, 1.74]), -Math.PI / 2 - 0.05, 0.19, 0.03, -0.01));
  s.push(spike(r([-0.09, 1.72]), -Math.PI / 2 + 0.05, 0.15, 0.024, 0.01));
  s.push(spike(r([0.1, 1.74]), -Math.PI / 2 + 0.06, 0.18, 0.03, 0.01));
  s.push(spike(r([0.085, 1.72]), -Math.PI / 2 - 0.04, 0.14, 0.022, -0.01));
  // Bangs: pointed locks across the forehead, swept slightly to one side.
  const bangs: Array<[number, number, number]> = [
    [-0.075, 0.115, -0.1],
    [-0.045, 0.125, -0.05],
    [-0.012, 0.13, 0.0],
    [0.02, 0.122, 0.06],
    [0.05, 0.11, 0.1],
    [0.075, 0.095, 0.14],
  ];
  for (const [x, len, tilt] of bangs)
    s.push(spike(r([x, 1.79]), -Math.PI / 2 + tilt, len, 0.028, 0.01));
  return s;
}

function eye(cx: number, w: number, narrow: boolean): THREE.Shape {
  const h = narrow ? 0.0065 : 0.011;
  return smooth(
    R([
      [cx - w, 1.632],
      [cx - w * 0.2, 1.632 + h],
      [cx + w, 1.636],
      [cx + w * 0.2, 1.632 - h * 0.6],
    ]),
  );
}

function lid(cx: number, w: number, narrow: boolean): THREE.Shape {
  const y = narrow ? 1.638 : 1.643;
  return poly(
    R([
      [cx - w - 0.004, 1.631],
      [cx - w * 0.3, y + 0.004],
      [cx + w + 0.003, 1.637],
      [cx + w * 0.3, y],
    ]),
  );
}

export function lightParts(): FigurePart[] {
  const body = smooth([
    [-0.05, 1.43],
    [-0.16, 1.4],
    [-0.25, 1.35],
    [-0.285, 1.2],
    [-0.28, 0.95],
    [-0.22, 0.82],
    [0.22, 0.82],
    [0.275, 0.95],
    [0.28, 1.2],
    [0.24, 1.35],
    [0.15, 1.4],
    [0.05, 1.43],
  ]);
  const shirt = poly([
    [-0.055, 1.43],
    [0.0, 1.22],
    [0.055, 1.43],
  ]);
  const collar = [
    poly([
      [-0.06, 1.435],
      [-0.012, 1.37],
      [-0.03, 1.43],
    ]),
    poly([
      [0.06, 1.435],
      [0.012, 1.37],
      [0.03, 1.43],
    ]),
  ];
  const tie = poly([
    [-0.012, 1.395],
    [0.012, 1.395],
    [0.02, 1.25],
    [0.0, 1.21],
    [-0.02, 1.25],
  ]);
  const lapels = [
    poly([
      [-0.06, 1.43],
      [-0.11, 1.4],
      [-0.02, 1.2],
      [0.0, 1.22],
    ]),
    poly([
      [0.06, 1.43],
      [0.1, 1.4],
      [0.02, 1.2],
      [0.0, 1.22],
    ]),
  ];
  const bodyShade = smooth([
    [0.06, 1.42],
    [0.24, 1.34],
    [0.28, 1.1],
    [0.22, 0.83],
    [0.08, 0.84],
    [0.05, 1.2],
  ]);

  const neck = capsule(r([0, 1.5]), r([0.0, 1.41]), 0.036, 0.04);
  const faceShade = smooth(
    R([
      [0.015, 1.75],
      [0.08, 1.7],
      [0.083, 1.6],
      [0.058, 1.53],
      [0.02, 1.49],
      [0.03, 1.56],
      [0.04, 1.66],
    ]),
  );
  const nose = poly(
    R([
      [0.004, 1.625],
      [0.012, 1.585],
      [0.002, 1.578],
      [0.0, 1.583],
      [0.006, 1.588],
    ]),
  );
  const hairShade = [
    smooth(
      R([
        [0.04, 1.84],
        [0.11, 1.78],
        [0.112, 1.66],
        [0.09, 1.7],
        [0.06, 1.8],
      ]),
    ),
    spike(r([0.1, 1.74]), -Math.PI / 2 + 0.06, 0.16, 0.018, 0.01),
  ];
  const hairHi = [
    spike(r([-0.07, 1.835]), -0.25, 0.09, 0.008, 0.01),
    spike(r([-0.03, 1.85]), -0.15, 0.08, 0.007, 0.01),
  ];

  const eyeL = -0.043;
  const eyeR = 0.035;
  const wL = 0.026;
  const wR = 0.021;
  const brow = (sharp: boolean) => [
    poly(
      R([
        [eyeL - 0.03, sharp ? 1.664 : 1.668],
        [eyeL + 0.022, sharp ? 1.656 : 1.669],
        [eyeL + 0.022, sharp ? 1.651 : 1.664],
        [eyeL - 0.03, sharp ? 1.659 : 1.664],
      ]),
    ),
    poly(
      R([
        [eyeR - 0.018, sharp ? 1.655 : 1.668],
        [eyeR + 0.026, sharp ? 1.664 : 1.667],
        [eyeR + 0.026, sharp ? 1.66 : 1.663],
        [eyeR - 0.018, sharp ? 1.651 : 1.664],
      ]),
    ),
  ];
  const iris = (col: string, emissive = 1) => ({
    shapes: [
      smooth(
        R([
          [eyeL - 0.006, 1.633],
          [eyeL, 1.641],
          [eyeL + 0.006, 1.633],
          [eyeL, 1.626],
        ]),
      ),
      smooth(
        R([
          [eyeR - 0.005, 1.634],
          [eyeR, 1.641],
          [eyeR + 0.005, 1.634],
          [eyeR, 1.628],
        ]),
      ),
    ],
    color: col,
    emissive,
  });

  const mouthNeutral = poly(
    R([
      [-0.02, 1.533],
      [0.02, 1.535],
      [0.02, 1.531],
      [-0.02, 1.529],
    ]),
  );
  const mouthSmirk = smooth(
    R([
      [-0.022, 1.53],
      [0.004, 1.528],
      [0.026, 1.545],
      [0.024, 1.539],
      [0.004, 1.524],
      [-0.022, 1.527],
    ]),
  );

  return [
    {
      id: 'body',
      ink: [body],
      layers: [
        { shapes: [body], color: BLAZER },
        { shapes: lapels, color: BLAZER_HI },
        { shapes: [bodyShade], color: '#10141e' },
        { shapes: [shirt], color: SHIRT },
        { shapes: collar, color: SHIRT },
        { shapes: [tie], color: TIE },
      ],
    },
    {
      id: 'head',
      pivot: LIGHT.neck,
      z: 0.01,
      ink: [...neck, faceOutline(), ...hairMass()],
      layers: [
        { shapes: neck, color: SKIN_SHADE },
        { shapes: [faceOutline()], color: SKIN },
        { shapes: [faceShade], color: SKIN_SHADE },
        { shapes: [nose], color: SKIN_SHADE },
        { shapes: hairMass(), color: HAIR },
        { shapes: hairShade, color: HAIR_SHADE },
        { shapes: hairHi, color: HAIR_HI },
      ],
    },
    {
      id: 'eyesOpen',
      parent: 'head',
      z: 0.02,
      layers: [
        { shapes: [eye(eyeL, wL, false), eye(eyeR, wR, false)], color: '#f3ede3' },
        { shapes: [lid(eyeL, wL, false), lid(eyeR, wR, false)], color: INK },
      ],
    },
    {
      id: 'eyesNarrow',
      parent: 'head',
      z: 0.02,
      layers: [
        { shapes: [eye(eyeL, wL, true), eye(eyeR, wR, true)], color: '#efe6da' },
        { shapes: [lid(eyeL, wL, true), lid(eyeR, wR, true)], color: INK },
      ],
    },
    { id: 'irisBrown', parent: 'head', z: 0.024, layers: [iris('#5b3220')] },
    { id: 'irisRed', parent: 'head', z: 0.025, layers: [iris('#d0161f', 1.6)] },
    {
      id: 'browsCalm',
      parent: 'head',
      z: 0.02,
      layers: [{ shapes: brow(false), color: HAIR_SHADE }],
    },
    { id: 'browsSharp', parent: 'head', z: 0.02, layers: [{ shapes: brow(true), color: INK }] },
    {
      id: 'mouthNeutral',
      parent: 'head',
      z: 0.02,
      layers: [{ shapes: [mouthNeutral], color: '#7a4a3c' }],
    },
    {
      id: 'mouthSmirk',
      parent: 'head',
      z: 0.02,
      layers: [{ shapes: [mouthSmirk], color: '#6a3a30' }],
    },
  ];
}

export type LightExpression = 'ordinary' | 'calculating' | 'resolved' | 'kira';
