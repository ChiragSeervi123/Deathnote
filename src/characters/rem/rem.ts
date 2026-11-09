import type * as THREE from 'three';
import { mulberry32 } from '@/utils/math';
import type { FigurePart } from '../shared/InkFigure';
import { capsule, disc, poly, smooth, spike, type P } from '../shared/shapes';

/**
 * Rem — tall, pale, skeletal Shinigami, standing, facing the camera.
 * Original fan illustration (metres, origin between the feet, y up). Pale
 * layers sit on a slightly padded dark outline so she reads as a figure
 * drawn in ink on any background.
 */

export const REM = {
  height: 3.05,
  neck: [0, 2.48] as P,
  eye: [0.045, 2.72] as P,
};

const BONE = '#d8d2c4';
const BONE_SHADE = '#9d978a';
const WRAP = '#b8ad97';
const SEAM = '#4a463f';
const EYE = '#ffd23a';

/** Body silhouette at a given padding (pad > 0 = outline). */
function bodyShapes(pad: number): THREE.Shape[] {
  const s: THREE.Shape[] = [];
  // Long legs.
  s.push(
    ...capsule([-0.1, 1.42], [-0.12, 0.75], 0.065 + pad, 0.05 + pad),
    ...capsule([-0.12, 0.75], [-0.13, 0.06], 0.05 + pad, 0.035 + pad),
  );
  s.push(
    ...capsule([0.1, 1.42], [0.12, 0.75], 0.065 + pad, 0.05 + pad),
    ...capsule([0.12, 0.75], [0.13, 0.06], 0.05 + pad, 0.035 + pad),
  );
  // Narrow torso and hips.
  s.push(
    smooth([
      [-0.17 - pad, 1.36],
      [-0.12 - pad, 1.62],
      [-0.16 - pad, 1.95],
      [-0.27 - pad, 2.32],
      [-0.08, 2.46 + pad],
      [0.08, 2.46 + pad],
      [0.27 + pad, 2.32],
      [0.16 + pad, 1.95],
      [0.12 + pad, 1.62],
      [0.17 + pad, 1.36],
      [0, 1.3 - pad],
    ]),
  );
  // Arms hanging close, long fingers.
  for (const side of [-1, 1] as const) {
    s.push(...capsule([side * 0.27, 2.3], [side * 0.33, 1.78], 0.045 + pad, 0.036 + pad));
    s.push(...capsule([side * 0.33, 1.78], [side * 0.34, 1.28], 0.036 + pad, 0.028 + pad));
    for (let i = 0; i < 4; i++)
      s.push(
        spike([side * 0.34, 1.26], -Math.PI / 2 + side * (0.05 + i * 0.07), 0.2, 0.012 + pad * 0.6),
      );
  }
  return s;
}

function headShapes(pad: number): THREE.Shape[] {
  const [nx, ny] = REM.neck;
  const r = (x: number, y: number): P => [x - nx, y - ny];
  return [
    ...capsule(r(0, 2.42), r(0, 2.58), 0.05 + pad, 0.055 + pad),
    smooth([
      r(-0.12 - pad, 2.78),
      r(-0.11 - pad, 2.6),
      r(-0.04, 2.5 - pad),
      r(0.04, 2.5 - pad),
      r(0.11 + pad, 2.6),
      r(0.12 + pad, 2.78),
      r(0, 2.92 + pad),
    ]),
  ];
}

export function remParts(): FigurePart[] {
  const rnd = mulberry32(5);
  const [nx, ny] = REM.neck;
  const r = (x: number, y: number): P => [x - nx, y - ny];

  // Mane of long pale strands falling behind her to the waist.
  const mane: THREE.Shape[] = [];
  for (let i = 0; i < 34; i++) {
    const t = i / 33;
    const x = -0.26 + t * 0.52;
    mane.push(
      spike(
        r(x * 0.7, 2.86 - Math.abs(x) * 0.3),
        -Math.PI / 2 + (x > 0 ? 0.12 : -0.12) * (0.5 + rnd()),
        0.9 + rnd() * 0.7,
        0.04 + rnd() * 0.02,
        (rnd() - 0.5) * 0.2,
      ),
    );
  }

  const ribs: THREE.Shape[] = [];
  for (let i = 0; i < 6; i++) {
    const y = 2.22 - i * 0.075;
    const w = 0.15 - Math.abs(i - 2) * 0.012;
    ribs.push(
      poly([
        [-w, y],
        [w, y],
        [w - 0.02, y - 0.016],
        [-w + 0.02, y - 0.016],
      ]),
    );
  }
  const wraps: THREE.Shape[] = [];
  for (const [y, w] of [
    [1.52, 0.15],
    [1.44, 0.16],
    [1.36, 0.17],
  ] as const) {
    wraps.push(
      poly([
        [-w, y],
        [w, y + 0.02],
        [w, y - 0.025],
        [-w, y - 0.045],
      ]),
    );
  }
  for (const side of [-1, 1] as const) {
    wraps.push(
      poly([
        [side * 0.3, 1.66],
        [side * 0.37, 1.68],
        [side * 0.37, 1.62],
        [side * 0.3, 1.6],
      ]),
    );
    wraps.push(
      poly([
        [side * 0.07, 0.95],
        [side * 0.17, 0.97],
        [side * 0.17, 0.9],
        [side * 0.07, 0.88],
      ]),
    );
  }

  // Face: a stitched slit for a mouth, one visible eye; a bone plate shades the other side.
  const stitches: THREE.Shape[] = [
    poly([r(-0.07, 2.585), r(0.07, 2.59), r(0.07, 2.582), r(-0.07, 2.577)]),
  ];
  for (let i = 0; i < 7; i++) {
    const x = -0.06 + i * 0.02;
    stitches.push(
      poly([r(x - 0.002, 2.6), r(x + 0.002, 2.6), r(x + 0.002, 2.565), r(x - 0.002, 2.565)]),
    );
  }
  const plate = smooth([
    r(-0.12, 2.82),
    r(-0.11, 2.64),
    r(-0.02, 2.66),
    r(0.0, 2.8),
    r(-0.05, 2.9),
  ]);

  return [
    {
      id: 'mane',
      pivot: REM.neck,
      z: -0.05,
      ink: mane.map((s) => s),
      layers: [{ shapes: mane, color: '#c9c3b6' }],
    },
    {
      id: 'body',
      ink: bodyShapes(0.014),
      layers: [
        { shapes: bodyShapes(0), color: BONE },
        {
          shapes: [
            smooth([
              [0.02, 2.4],
              [0.25, 2.3],
              [0.15, 1.9],
              [0.12, 1.4],
              [0.04, 1.6],
            ]),
          ],
          color: BONE_SHADE,
        },
        { shapes: ribs, color: SEAM },
        { shapes: wraps, color: WRAP },
      ],
    },
    {
      id: 'head',
      pivot: REM.neck,
      z: 0.02,
      ink: headShapes(0.014),
      layers: [
        { shapes: headShapes(0), color: BONE },
        { shapes: [plate], color: BONE_SHADE },
        { shapes: stitches, color: SEAM },
        { shapes: [disc(r(REM.eye[0], REM.eye[1]), 0.034, 0.03)], color: '#151412' },
        { shapes: [disc(r(REM.eye[0], REM.eye[1]), 0.024, 0.021)], color: EYE, emissive: 1.8 },
        { shapes: [disc(r(REM.eye[0] - 0.004, REM.eye[1]), 0.007)], color: '#7a1010' },
      ],
    },
  ];
}
