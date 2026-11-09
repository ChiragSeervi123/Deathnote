import type * as THREE from 'three';
import type { FigurePart } from '../shared/InkFigure';
import { capsule, disc, poly, smooth, type P } from '../shared/shapes';

/**
 * Near — a small, pale boy sitting on the floor, one knee drawn up, twisting
 * a curl of white hair. Original fan illustration in the site's ink style
 * (metres, origin on the floor between the hips, y up, facing the camera).
 *
 * Parts: body · forearmL (pivot at the elbow — the hair-twisting hand) ·
 * head (pivot at the neck).
 */

export const NEAR = {
  neck: [0, 0.56] as P,
  elbowL: [-0.24, 0.42] as P,
};

const SHIRT = '#eceae5';
const SHIRT_SHADE = '#c4c2bd';
const PANTS = '#dcd9d2';
const SKIN = '#efe4da';
const HAIR = '#f3f1ec';
const HAIR_SHADE = '#bdbab3';
const EYE = '#34343b';

function legs(pad: number): THREE.Shape[] {
  return [
    // Folded leg, lying on the floor.
    ...capsule([-0.07, 0.1], [-0.3, 0.07], 0.065 + pad, 0.05 + pad),
    ...capsule([-0.3, 0.07], [-0.04, 0.04], 0.05 + pad, 0.04 + pad),
    // Raised knee.
    ...capsule([0.08, 0.1], [0.2, 0.41], 0.065 + pad, 0.052 + pad),
    ...capsule([0.2, 0.41], [0.17, 0.05], 0.052 + pad, 0.04 + pad),
  ];
}

function feet(pad: number): THREE.Shape[] {
  return [disc([-0.02, 0.035], 0.05 + pad, 0.03 + pad), disc([0.2, 0.03], 0.055 + pad, 0.03 + pad)];
}

function torso(pad: number): THREE.Shape {
  return smooth([
    [-0.16 - pad, 0.06],
    [-0.17 - pad, 0.3],
    [-0.19 - pad, 0.5],
    [-0.06, 0.56 + pad],
    [0.06, 0.56 + pad],
    [0.19 + pad, 0.5],
    [0.17 + pad, 0.3],
    [0.16 + pad, 0.06],
  ]);
}

function armR(pad: number): THREE.Shape[] {
  return [
    ...capsule([0.17, 0.5], [0.27, 0.33], 0.045 + pad, 0.04 + pad),
    ...capsule([0.27, 0.33], [0.2, 0.44], 0.04 + pad, 0.034 + pad),
  ];
}

const upperArmL = (pad: number) => capsule([-0.17, 0.5], NEAR.elbowL, 0.045 + pad, 0.04 + pad);

/** Forearm authored relative to the elbow; the hand rests at the curl by the cheek. */
function forearmL(pad: number): THREE.Shape[] {
  return capsule([0, 0], [0.11, 0.23], 0.04 + pad, 0.033 + pad);
}

const [NX, NY] = NEAR.neck;
const r = (x: number, y: number): P => [x - NX, y - NY];

function curls(pad: number): THREE.Shape[] {
  const s: THREE.Shape[] = [];
  // Crown and sides: a ring of curls around the top of the head.
  for (let i = 0; i < 15; i++) {
    const a = -0.35 + (i / 14) * (Math.PI + 0.7);
    s.push(disc(r(Math.cos(a) * 0.098, 0.685 + Math.sin(a) * 0.1), 0.042 + pad));
  }
  // Fringe of smaller curls over the forehead.
  for (let i = 0; i < 6; i++) {
    const x = -0.07 + i * 0.028;
    s.push(disc(r(x, 0.735 - Math.abs(x) * 0.25), 0.024 + pad));
  }
  // The curl he is twisting, by his right cheek (viewer's left).
  s.push(disc(r(-0.105, 0.625), 0.022 + pad));
  return s;
}

const face = (pad: number) => disc(r(0, 0.665), 0.083 + pad, 0.093 + pad);

export function nearParts(): FigurePart[] {
  const PAD = 0.01;
  return [
    {
      id: 'body',
      ink: [...legs(PAD), ...feet(PAD), torso(PAD), ...armR(PAD), ...upperArmL(PAD)],
      layers: [
        { shapes: legs(0), color: PANTS },
        { shapes: feet(0), color: SKIN },
        { shapes: [torso(0)], color: SHIRT },
        {
          // Loose folds and the button line of the pyjama shirt.
          shapes: [
            poly([
              [-0.004, 0.52],
              [0.004, 0.52],
              [0.006, 0.1],
              [-0.002, 0.1],
            ]),
            poly([
              [-0.15, 0.25],
              [-0.06, 0.2],
              [-0.06, 0.19],
              [-0.15, 0.235],
            ]),
          ],
          color: SHIRT_SHADE,
        },
        { shapes: [...armR(0), ...upperArmL(0)], color: SHIRT },
        { shapes: [disc([0.2, 0.445], 0.034)], color: SKIN },
      ],
    },
    {
      id: 'forearmL',
      pivot: NEAR.elbowL,
      z: 0.02,
      ink: [...forearmL(PAD)],
      layers: [
        { shapes: forearmL(0), color: SHIRT },
        { shapes: [disc([0.11, 0.24], 0.032)], color: SKIN },
      ],
    },
    {
      id: 'head',
      pivot: NEAR.neck,
      z: 0.012,
      ink: [...capsule(r(0, 0.54), r(0, 0.6), 0.03, 0.033), face(0.008), ...curls(0.008)],
      layers: [
        { shapes: capsule(r(0, 0.54), r(0, 0.6), 0.025, 0.028), color: SKIN },
        { shapes: [face(0)], color: SKIN },
        { shapes: curls(0), color: HAIR },
        { shapes: [disc(r(0.06, 0.74), 0.02), disc(r(-0.085, 0.71), 0.018)], color: HAIR_SHADE },
        {
          // Large, steady eyes.
          shapes: [disc(r(-0.032, 0.66), 0.017, 0.014), disc(r(0.032, 0.66), 0.017, 0.014)],
          color: EYE,
        },
        { shapes: [disc(r(-0.036, 0.664), 0.004), disc(r(0.028, 0.664), 0.004)], color: '#f4f1ec' },
        {
          shapes: [
            poly(
              R([
                [-0.012, 0.612],
                [0.012, 0.612],
                [0.012, 0.608],
                [-0.012, 0.608],
              ]),
            ),
          ],
          color: '#9a7e72',
        },
      ],
    },
  ];
}

function R(points: P[]): P[] {
  return points.map(([x, y]) => r(x, y));
}
