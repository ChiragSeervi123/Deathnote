import * as THREE from 'three';
import { mulberry32 } from '@/utils/math';
import type { FigurePart } from '../shared/InkFigure';
import { capsule, disc, poly, smooth, spike, type P } from '../shared/shapes';

/**
 * Ryuk — full standing presentation, facing the camera in a slight 3/4 turn.
 * Original fan illustration built from shapes (metres, origin between the
 * feet, y up). Parts: body, wings, head, armL (hanging), armR (raised, holds
 * an apple at RYUK_FULL.apple), each animatable around its pivot.
 */

export const RYUK_FULL = {
  height: 2.7,
  neck: [0.0, 2.0] as P,
  shoulderL: [-0.36, 1.82] as P,
  shoulderR: [0.36, 1.82] as P,
  /** Where the raised hand holds the apple (body space). */
  apple: [0.3, 1.66] as P,
};

const SKIN = '#8e9aa8';
const SKIN_SHADE = '#5f6a78';
const LIPS = '#33415f';
const TEETH = '#e6e1d6';
const EYE = '#ffd23a';
const PUPIL = '#c0141c';
const LEATHER_HI = '#2a2a2e';
const METAL = '#6b675f';

function wing(side: 1 | -1, rnd: () => number): THREE.Shape[] {
  const x = (v: number) => v * side;
  const root: P = [x(0.12), 1.78];
  const elbow: P = [x(0.62), 2.25];
  const wrist: P = [x(1.05), 2.62];
  const tips: P[] = [
    [x(1.62), 2.48],
    [x(1.78), 1.98],
    [x(1.5), 1.42],
    [x(1.02), 1.08],
  ];
  const s = new THREE.Shape();
  s.moveTo(root[0], root[1]);
  s.lineTo(elbow[0], elbow[1]);
  s.lineTo(wrist[0], wrist[1]);
  let prev = wrist;
  for (const t of tips) {
    // Ragged membrane sagging toward the body between the finger bones.
    const mx = (prev[0] + t[0]) / 2;
    const my = (prev[1] + t[1]) / 2;
    const cx = mx + (x(0.55) - mx) * 0.32 + (rnd() - 0.5) * 0.05;
    const cy = my + (1.85 - my) * 0.32;
    if (prev !== wrist) s.quadraticCurveTo(cx, cy, t[0], t[1]);
    else s.lineTo(t[0], t[1]);
    prev = t;
  }
  s.quadraticCurveTo(x(0.6), 1.25, x(0.18), 1.4);
  s.closePath();
  const parts: THREE.Shape[] = [s];
  parts.push(...capsule(root, elbow, 0.05, 0.035), ...capsule(elbow, wrist, 0.035, 0.025));
  for (const t of tips) parts.push(...capsule(wrist, t, 0.02, 0.006));
  parts.push(spike(wrist, side > 0 ? 1.1 : Math.PI - 1.1, 0.16, 0.025, 0.02 * side));
  return parts;
}

export function ryukFullParts(): FigurePart[] {
  const rnd = mulberry32(21);

  // --- Body: legs, hips, jacket ------------------------------------------------
  const body: THREE.Shape[] = [];
  body.push(
    ...capsule([-0.12, 1.02], [-0.17, 0.55], 0.095, 0.07),
    ...capsule([-0.17, 0.55], [-0.2, 0.08], 0.07, 0.05),
  );
  body.push(
    ...capsule([0.12, 1.02], [0.16, 0.55], 0.095, 0.07),
    ...capsule([0.16, 0.55], [0.21, 0.08], 0.07, 0.05),
  );
  body.push(
    poly([
      [-0.26, 0.1],
      [-0.02, 0.08],
      [-0.2, 0.0],
      [-0.42, -0.0],
    ]),
  ); // pointed boots
  body.push(
    poly([
      [0.27, 0.1],
      [0.04, 0.08],
      [0.22, 0.0],
      [0.46, -0.0],
    ]),
  );
  body.push(
    smooth([
      [-0.19, 0.98],
      [-0.14, 1.2],
      [-0.24, 1.55],
      [-0.42, 1.84],
      [-0.12, 1.98],
      [0.0, 2.02],
      [0.12, 1.98],
      [0.42, 1.84],
      [0.24, 1.55],
      [0.14, 1.2],
      [0.19, 0.98],
      [0.0, 0.93],
    ]),
  );
  // Feathered collar spiking up around the neck.
  for (let i = 0; i < 11; i++) {
    const t = i / 10;
    const ang = THREE.MathUtils.degToRad(25 + t * 130);
    body.push(
      spike([Math.cos(ang) * 0.17, 1.9 + Math.sin(ang) * 0.04], ang, 0.16 + rnd() * 0.08, 0.05),
    );
  }

  const bodyLayers = [
    // Belt with studs and a hanging chain.
    {
      shapes: [
        poly([
          [-0.19, 1.0],
          [0.19, 1.0],
          [0.18, 1.07],
          [-0.18, 1.07],
        ]),
      ],
      color: LEATHER_HI,
    },
    {
      shapes: [
        ...Array.from({ length: 7 }, (_, i) => disc([-0.15 + i * 0.05, 1.035], 0.009)),
        ...Array.from({ length: 6 }, (_, i) =>
          disc([0.06 + i * 0.03, 0.96 - Math.sin((i / 5) * Math.PI) * 0.08], 0.012, 0.008),
        ),
      ],
      color: METAL,
    },
    // Cross-strap and jacket seams catching faint light.
    {
      shapes: [
        poly([
          [-0.22, 1.72],
          [-0.17, 1.74],
          [0.15, 1.18],
          [0.1, 1.16],
        ]),
      ],
      color: LEATHER_HI,
    },
  ];

  // --- Head ------------------------------------------------------------------------
  const [nx, ny] = RYUK_FULL.neck;
  const r = (p: P): P => [p[0] - nx, p[1] - ny];
  const head: THREE.Shape[] = [];
  head.push(...capsule(r([0, 1.96]), r([0, 2.1]), 0.065, 0.07));
  head.push(
    smooth([
      r([-0.17, 2.3]),
      r([-0.15, 2.12]),
      r([-0.06, 2.02]),
      r([0, 2.0]),
      r([0.06, 2.02]),
      r([0.15, 2.12]),
      r([0.17, 2.3]),
      r([0, 2.44]),
    ]),
  );
  // Hair: big crown of feather-spikes fanning up and out, a few down to the shoulders.
  const hc = r([0, 2.3]);
  const hair = 26;
  for (let i = 0; i < hair; i++) {
    const t = i / (hair - 1);
    const ang = THREE.MathUtils.degToRad(-35 + t * 250 + (rnd() - 0.5) * 6);
    const up = Math.sin(THREE.MathUtils.degToRad(-35 + t * 250));
    const len = 0.28 + Math.max(0, up) * 0.32 + rnd() * 0.12;
    head.push(
      spike(
        [hc[0] + Math.cos(ang) * 0.1, hc[1] + Math.sin(ang) * 0.1],
        ang,
        len,
        0.07 + rnd() * 0.03,
        (rnd() - 0.5) * 0.12,
      ),
    );
  }
  // Spiky bangs over the forehead.
  for (let i = 0; i < 5; i++) {
    head.push(
      spike(r([-0.1 + i * 0.05, 2.42]), -Math.PI / 2 + (i - 2) * 0.18, 0.14 + rnd() * 0.05, 0.035),
    );
  }

  const face = smooth([
    r([-0.13, 2.27]),
    r([-0.12, 2.12]),
    r([-0.05, 2.04]),
    r([0, 2.025]),
    r([0.05, 2.04]),
    r([0.12, 2.12]),
    r([0.13, 2.27]),
    r([0, 2.31]),
  ]);
  const shade = smooth([
    r([0.02, 2.28]),
    r([0.12, 2.25]),
    r([0.11, 2.12]),
    r([0.05, 2.05]),
    r([0.03, 2.1]),
  ]);
  // Grin: a wide crescent, lips dark blue, teeth bright.
  const mouth = new THREE.Shape();
  const m0 = r([-0.115, 2.115]);
  const m1 = r([0.115, 2.115]);
  const mlow = r([0, 2.035]);
  const mtop = r([0, 2.09]);
  mouth.moveTo(m0[0], m0[1]);
  mouth.quadraticCurveTo(mlow[0], mlow[1] - 0.03, m1[0], m1[1]);
  mouth.quadraticCurveTo(mtop[0], mtop[1], m0[0], m0[1]);
  const teeth: THREE.Shape[] = [];
  for (let i = 0; i < 9; i++) {
    const tx = -0.09 + i * 0.0225;
    const curve = 2.105 - Math.cos(((i - 4) / 4) * 1.2) * 0.03;
    const [a, b] = r([tx, curve]);
    teeth.push(
      poly([
        [a - 0.009, b + 0.006],
        [a + 0.009, b + 0.006],
        [a, b - 0.022],
      ]),
    );
    const [c, d] = r([tx + 0.011, curve - 0.04]);
    teeth.push(
      poly([
        [c - 0.008, d - 0.004],
        [c + 0.008, d - 0.004],
        [c, d + 0.018],
      ]),
    );
  }
  const eyeL = r([-0.062, 2.215]);
  const eyeR = r([0.066, 2.21]);
  const headLayers = [
    { shapes: [face], color: SKIN },
    { shapes: [shade], color: SKIN_SHADE },
    // Dark rims around the bulging eyes.
    { shapes: [disc(eyeL, 0.062), disc(eyeR, 0.06)], color: '#151518' },
    { shapes: [disc(eyeL, 0.05), disc(eyeR, 0.048)], color: EYE, emissive: 2.2 },
    {
      shapes: [
        disc([eyeL[0] + 0.008, eyeL[1] - 0.004], 0.011),
        disc([eyeR[0] - 0.008, eyeR[1] - 0.004], 0.011),
      ],
      color: PUPIL,
      emissive: 1.4,
    },
    { shapes: [mouth], color: LIPS },
    { shapes: teeth, color: TEETH },
  ];

  // --- Arms ----------------------------------------------------------------------
  const [lx, ly] = RYUK_FULL.shoulderL;
  const rl = (p: P): P => [p[0] - lx, p[1] - ly];
  const armL: THREE.Shape[] = [
    ...capsule(rl([-0.29, 1.83]), rl([-0.4, 1.38]), 0.058, 0.044),
    ...capsule(rl([-0.4, 1.38]), rl([-0.45, 0.98]), 0.044, 0.034),
    disc(rl([-0.46, 0.93]), 0.05, 0.06),
  ];
  for (let i = 0; i < 4; i++)
    armL.push(
      spike(rl([-0.47 + i * 0.012, 0.9]), -Math.PI / 2 - 0.25 + i * 0.16, 0.17, 0.014, -0.02),
    );
  const [rx, ry] = RYUK_FULL.shoulderR;
  const rr = (p: P): P => [p[0] - rx, p[1] - ry];
  const armR: THREE.Shape[] = [
    ...capsule(rr([0.29, 1.83]), rr([0.44, 1.42]), 0.058, 0.044),
    ...capsule(rr([0.44, 1.42]), rr([0.33, 1.62]), 0.044, 0.036),
    disc(rr([0.31, 1.66]), 0.055, 0.045),
  ];
  for (let i = 0; i < 4; i++) armR.push(spike(rr([0.3, 1.69]), 1.0 + i * 0.32, 0.13, 0.012, 0.02));
  const bands = [poly([rr([0.39, 1.5]), rr([0.46, 1.47]), rr([0.48, 1.52]), rr([0.41, 1.55])])];

  return [
    { id: 'wings', z: -0.06, ink: [...wing(1, rnd), ...wing(-1, rnd)] },
    { id: 'body', ink: body, layers: bodyLayers },
    { id: 'armL', pivot: RYUK_FULL.shoulderL, z: 0.01, ink: armL },
    { id: 'head', pivot: RYUK_FULL.neck, z: 0.02, ink: head, layers: headLayers },
    {
      id: 'armR',
      pivot: RYUK_FULL.shoulderR,
      z: 0.03,
      ink: armR,
      layers: [{ shapes: bands, color: LEATHER_HI }],
    },
  ];
}
