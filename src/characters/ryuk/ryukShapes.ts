import * as THREE from 'three';
import { mulberry32 } from '@/utils/math';

/**
 * Ryuk, seated on a rock, in profile facing +x — an original silhouette drawn
 * with bezier outlines (metres; origin at the seat, y up). Head and reaching
 * arm are separate parts so they can be animated around their pivots.
 */

type P = readonly [number, number];

/** Tapered capsule between two points (rounded ends). */
function capsule(a: P, b: P, ra: number, rb: number): THREE.Shape[] {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = Math.hypot(dx, dy) || 1;
  const nx = -dy / l;
  const ny = dx / l;
  const s = new THREE.Shape();
  s.moveTo(a[0] + nx * ra, a[1] + ny * ra);
  s.lineTo(b[0] + nx * rb, b[1] + ny * rb);
  s.lineTo(b[0] - nx * rb, b[1] - ny * rb);
  s.lineTo(a[0] - nx * ra, a[1] - ny * ra);
  s.closePath();
  return [s, disc(a, ra), disc(b, rb)];
}

function disc(c: P, rx: number, ry = rx, rot = 0): THREE.Shape {
  const s = new THREE.Shape();
  s.absellipse(c[0], c[1], rx, ry, 0, Math.PI * 2, false, rot);
  return s;
}

/** A curved, tapering spike (hair feather, claw, finger). */
function spike(base: P, angle: number, len: number, width: number, bend = 0): THREE.Shape {
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  const px = -sa;
  const py = ca;
  const tip: P = [base[0] + ca * len + px * bend, base[1] + sa * len + py * bend];
  const mid: P = [base[0] + ca * len * 0.5 + px * bend * 0.6, base[1] + sa * len * 0.5 + py * bend * 0.6];
  const s = new THREE.Shape();
  s.moveTo(base[0] + px * width, base[1] + py * width);
  s.quadraticCurveTo(mid[0] + px * width * 0.55, mid[1] + py * width * 0.55, tip[0], tip[1]);
  s.quadraticCurveTo(mid[0] - px * width * 0.45, mid[1] - py * width * 0.45, base[0] - px * width, base[1] - py * width);
  s.closePath();
  return s;
}

export const RYUK_PIVOTS = {
  neck: [0.37, 1.17] as P,
  shoulder: [0.27, 1.0] as P,
  hand: [1.05, 0.81] as P,
  eyes: [
    [0.655, 1.435],
    [0.705, 1.418],
  ] as P[],
};

/** A folded bat wing: bones + scalloped membrane. */
function wing(root: P, elbow: P, wrist: P, tips: readonly P[], lowerBack: P, centre: P): THREE.Shape[] {
  const s = new THREE.Shape();
  s.moveTo(root[0], root[1]);
  s.quadraticCurveTo(elbow[0] - 0.04, elbow[1], elbow[0], elbow[1]);
  s.lineTo(wrist[0], wrist[1]);
  let prev = wrist;
  for (const t of tips) {
    // Membrane edge sags inward between finger tips.
    const cx = (prev[0] + t[0]) / 2 + (centre[0] - (prev[0] + t[0]) / 2) * 0.38;
    const cy = (prev[1] + t[1]) / 2 + (centre[1] - (prev[1] + t[1]) / 2) * 0.38;
    if (prev === wrist) s.lineTo(t[0], t[1]);
    else s.quadraticCurveTo(cx, cy, t[0], t[1]);
    prev = t;
  }
  s.quadraticCurveTo((prev[0] + lowerBack[0]) / 2 + 0.06, (prev[1] + lowerBack[1]) / 2 + 0.12, lowerBack[0], lowerBack[1]);
  s.closePath();
  const parts: THREE.Shape[] = [s];
  parts.push(...capsule(root, elbow, 0.05, 0.035));
  parts.push(...capsule(elbow, wrist, 0.035, 0.026));
  for (const t of tips) parts.push(...capsule(wrist, t, 0.022, 0.006));
  // Wrist claw.
  parts.push(spike(wrist, Math.atan2(wrist[1] - elbow[1], wrist[0] - elbow[0]) + 0.25, 0.14, 0.022, -0.03));
  return parts;
}

export function ryukBodyShapes(): THREE.Shape[] {
  const shapes: THREE.Shape[] = [];

  // Far wing first (behind), then the near wing.
  shapes.push(...wing([0.06, 1.02], [-0.18, 1.68], [-0.02, 2.2], [[-0.52, 1.98], [-0.7, 1.5], [-0.48, 0.98]], [-0.06, 0.62], [-0.22, 1.5]));
  shapes.push(...wing([-0.02, 0.98], [-0.34, 1.6], [-0.2, 2.1], [[-0.76, 1.84], [-0.92, 1.28], [-0.64, 0.7]], [-0.14, 0.42], [-0.4, 1.32]));

  // Hunched torso: one smooth outline.
  const t = new THREE.Shape();
  t.moveTo(-0.16, 0.05);
  t.quadraticCurveTo(-0.25, 0.32, -0.09, 0.64);
  t.quadraticCurveTo(-0.02, 0.98, 0.13, 1.09);
  t.quadraticCurveTo(0.24, 1.17, 0.35, 1.16);
  t.quadraticCurveTo(0.43, 0.99, 0.36, 0.85);
  t.quadraticCurveTo(0.33, 0.6, 0.23, 0.42);
  t.quadraticCurveTo(0.16, 0.26, 0.2, 0.11);
  t.lineTo(-0.16, 0.05);
  shapes.push(t);

  // Legs: knee drawn up, shin down the rock face, long pointed boot.
  shapes.push(...capsule([0.06, 0.14], [0.66, 0.6], 0.1, 0.07));
  shapes.push(...capsule([0.66, 0.6], [0.77, -0.45], 0.062, 0.04));
  const boot = new THREE.Shape();
  boot.moveTo(0.72, -0.43);
  boot.quadraticCurveTo(0.86, -0.42, 1.0, -0.52);
  boot.quadraticCurveTo(0.86, -0.56, 0.72, -0.53);
  boot.closePath();
  shapes.push(boot);

  // Far arm resting on the knee.
  shapes.push(...capsule([0.16, 1.0], [0.43, 0.63], 0.05, 0.04));
  shapes.push(...capsule([0.43, 0.63], [0.68, 0.69], 0.04, 0.034));

  // Belt-chain ring hanging at the hip — a small, recognisable detail.
  const ring = disc([0.1, -0.02], 0.065, 0.1, 0.25);
  const hole = new THREE.Path();
  hole.absellipse(0.1, -0.02, 0.042, 0.075, 0, Math.PI * 2, true, 0.25);
  ring.holes.push(hole);
  shapes.push(ring);
  return shapes;
}

/** Head and hair, relative to the neck pivot. */
export function ryukHeadShapes(): THREE.Shape[] {
  const rnd = mulberry32(7);
  const [nx, ny] = RYUK_PIVOTS.neck;
  const rel = (p: P): P => [p[0] - nx, p[1] - ny];
  const shapes: THREE.Shape[] = [];
  const c = rel([0.56, 1.41]);
  shapes.push(disc(c, 0.165, 0.19, -0.2));
  // Long jaw jutting forward into the grin.
  const jaw = new THREE.Shape();
  const j = (x: number, y: number) => rel([x, y]);
  const [a0, a1] = j(0.6, 1.36);
  jaw.moveTo(a0, a1);
  const [b0, b1] = j(0.79, 1.3);
  const [c0, c1] = j(0.74, 1.4);
  jaw.quadraticCurveTo(c0, c1, b0, b1);
  const [d0, d1] = j(0.7, 1.18);
  const [e0, e1] = j(0.8, 1.2);
  jaw.quadraticCurveTo(e0, e1, d0, d1);
  const [f0, f1] = j(0.5, 1.22);
  const [g0, g1] = j(0.58, 1.13);
  jaw.quadraticCurveTo(g0, g1, f0, f1);
  jaw.closePath();
  shapes.push(jaw);
  // Neck.
  shapes.push(...capsule(rel([0.33, 1.1]), rel([0.47, 1.28]), 0.06, 0.06));
  // Hair: a dense crown of feathered spikes sweeping back and up, a few down the nape.
  const count = 19;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const ang = THREE.MathUtils.degToRad(48 + t * 182 + (rnd() - 0.5) * 8);
    const len = 0.26 + Math.sin(Math.min(1, t * 1.15) * Math.PI) * 0.3 + rnd() * 0.09;
    const base: P = [c[0] + Math.cos(ang) * 0.06, c[1] + Math.sin(ang) * 0.07];
    shapes.push(spike(base, ang, len, 0.095 + rnd() * 0.035, -0.05 - rnd() * 0.06));
  }
  return shapes;
}

/** Reaching arm with long clawed fingers, relative to the shoulder pivot. */
export function ryukArmShapes(): THREE.Shape[] {
  const [sx, sy] = RYUK_PIVOTS.shoulder;
  const rel = (p: P): P => [p[0] - sx, p[1] - sy];
  const shapes: THREE.Shape[] = [];
  shapes.push(...capsule(rel([0.27, 1.0]), rel([0.6, 0.66]), 0.058, 0.046));
  shapes.push(...capsule(rel([0.6, 0.66]), rel([0.99, 0.81]), 0.046, 0.034));
  const h = rel(RYUK_PIVOTS.hand);
  shapes.push(disc(h, 0.058, 0.04, 0.35));
  const fingers: Array<[number, number]> = [
    [-18, 0.2],
    [-38, 0.19],
    [-58, 0.16],
  ];
  for (const [deg, len] of fingers) shapes.push(spike(h, THREE.MathUtils.degToRad(deg), len, 0.017, -0.04));
  shapes.push(spike(h, THREE.MathUtils.degToRad(48), 0.11, 0.015, 0.02));
  return shapes;
}
