import * as THREE from 'three';
import { mulberry32 } from '@/utils/math';

/**
 * Ryuk, seated, in profile facing +x — an original silhouette built from
 * simple primitives (metres; origin at the seat, y up). Parts are separated
 * so the head and the reaching arm can move independently.
 */

type P = readonly [number, number];

function limb(a: P, b: P, wa: number, wb: number): THREE.Shape {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = Math.hypot(dx, dy) || 1;
  const nx = -dy / l;
  const ny = dx / l;
  const s = new THREE.Shape();
  s.moveTo(a[0] + nx * wa, a[1] + ny * wa);
  s.lineTo(b[0] + nx * wb, b[1] + ny * wb);
  s.lineTo(b[0] - nx * wb, b[1] - ny * wb);
  s.lineTo(a[0] - nx * wa, a[1] - ny * wa);
  s.closePath();
  return s;
}

function disc(c: P, rx: number, ry = rx, rot = 0): THREE.Shape {
  const s = new THREE.Shape();
  s.absellipse(c[0], c[1], rx, ry, 0, Math.PI * 2, false, rot);
  return s;
}

function spike(base: P, angle: number, len: number, width: number, bend = 0): THREE.Shape {
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  const tip: P = [base[0] + ca * len - sa * bend, base[1] + sa * len + ca * bend];
  const s = new THREE.Shape();
  s.moveTo(base[0] - sa * width, base[1] + ca * width);
  s.quadraticCurveTo(base[0] + ca * len * 0.55 - sa * (width * 0.6 + bend * 0.4), base[1] + sa * len * 0.55 + ca * (width * 0.6 + bend * 0.4), tip[0], tip[1]);
  s.quadraticCurveTo(base[0] + ca * len * 0.5 + sa * width * 0.4, base[1] + sa * len * 0.5 - ca * width * 0.4, base[0] + sa * width, base[1] - ca * width);
  s.closePath();
  return s;
}

function poly(points: readonly P[]): THREE.Shape {
  const s = new THREE.Shape();
  points.forEach(([x, y], i) => (i === 0 ? s.moveTo(x, y) : s.lineTo(x, y)));
  s.closePath();
  return s;
}

export const RYUK_PIVOTS = {
  neck: [0.38, 1.18] as P,
  shoulder: [0.27, 0.98] as P,
  hand: [1.06, 0.8] as P,
  eyes: [
    [0.635, 1.425],
    [0.69, 1.405],
  ] as P[],
};

/** Body: torso, legs, far arm, wings. */
export function ryukBodyShapes(): THREE.Shape[] {
  const rnd = mulberry32(12);
  const shapes: THREE.Shape[] = [];
  // Wings, folded behind the shoulders: bony leading edge + ragged membrane.
  const wing = (root: P, elbow: P, tip: P, lower: P, scallops: number) => {
    const pts: P[] = [root, elbow, tip];
    for (let i = 1; i <= scallops; i++) {
      const t = i / (scallops + 1);
      const x = tip[0] + (lower[0] - tip[0]) * t;
      const y = tip[1] + (lower[1] - tip[1]) * t;
      pts.push([x + 0.06 + rnd() * 0.05, y - 0.06 - rnd() * 0.06]);
      pts.push([x + 0.13, y + 0.02]);
    }
    pts.push(lower);
    shapes.push(poly(pts));
    shapes.push(limb(root, elbow, 0.05, 0.035));
    shapes.push(limb(elbow, tip, 0.035, 0.012));
  };
  wing([0.02, 0.98], [-0.42, 1.9], [-1.02, 1.62], [-0.32, 0.62], 4);
  wing([0.1, 1.02], [-0.2, 2.08], [-0.78, 2.02], [-0.12, 0.85], 3);

  // Torso, hunched forward.
  shapes.push(limb([0.0, 0.12], [0.24, 1.02], 0.13, 0.17));
  shapes.push(disc([0.18, 0.95], 0.17, 0.14, 0.4));
  shapes.push(disc([0.02, 0.18], 0.15, 0.11));
  // Neck.
  shapes.push(limb([0.26, 1.02], [0.44, 1.24], 0.06, 0.05));
  // Legs: thigh up to the knee, shin down to the rock face.
  shapes.push(limb([0.0, 0.12], [0.62, 0.6], 0.1, 0.075));
  shapes.push(disc([0.62, 0.6], 0.075));
  shapes.push(limb([0.62, 0.6], [0.74, -0.52], 0.065, 0.045));
  shapes.push(disc([0.8, -0.56], 0.11, 0.05, 0.05));
  // Far arm resting on the knee.
  shapes.push(limb([0.2, 0.95], [0.46, 0.56], 0.05, 0.04));
  shapes.push(limb([0.46, 0.56], [0.7, 0.66], 0.04, 0.03));
  // Belt-chain loop hanging at the hip (a recognisable silhouette detail).
  shapes.push(disc([0.12, 0.02], 0.05, 0.11, 0.3));
  return shapes;
}

/** Head + hair, relative to the neck pivot. */
export function ryukHeadShapes(): THREE.Shape[] {
  const rnd = mulberry32(7);
  const [nx, ny] = RYUK_PIVOTS.neck;
  const c: P = [0.56 - nx, 1.4 - ny];
  const shapes: THREE.Shape[] = [];
  shapes.push(disc(c, 0.17, 0.21, -0.25));
  // Long jaw and grin pushed forward.
  shapes.push(poly([
    [c[0] + 0.05, c[1] - 0.05],
    [c[0] + 0.22, c[1] - 0.09],
    [c[0] + 0.2, c[1] - 0.19],
    [c[0] + 0.02, c[1] - 0.2],
  ]));
  // Hair: a crown of feathered spikes sweeping back and up.
  const count = 15;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const ang = THREE.MathUtils.degToRad(40 + t * 175 + (rnd() - 0.5) * 10);
    const len = 0.32 + Math.sin(t * Math.PI) * 0.34 + rnd() * 0.12;
    const base: P = [c[0] + Math.cos(ang) * 0.1, c[1] + Math.sin(ang) * 0.12];
    shapes.push(spike(base, ang, len, 0.05 + rnd() * 0.03, (rnd() - 0.6) * 0.12));
  }
  return shapes;
}

/** Reaching arm with long fingers, relative to the shoulder pivot. */
export function ryukArmShapes(): THREE.Shape[] {
  const [sx, sy] = RYUK_PIVOTS.shoulder;
  const rel = (p: P): P => [p[0] - sx, p[1] - sy];
  const shapes: THREE.Shape[] = [];
  shapes.push(limb(rel([0.27, 0.98]), rel([0.58, 0.62]), 0.055, 0.042));
  shapes.push(disc(rel([0.58, 0.62]), 0.045));
  shapes.push(limb(rel([0.58, 0.62]), rel([1.0, 0.8]), 0.042, 0.032));
  const h = rel(RYUK_PIVOTS.hand);
  shapes.push(disc(h, 0.05, 0.035, 0.3));
  for (let i = 0; i < 3; i++) {
    shapes.push(spike(h, THREE.MathUtils.degToRad(-30 - i * 22), 0.19 - i * 0.02, 0.012, -0.03));
  }
  shapes.push(spike(h, THREE.MathUtils.degToRad(40), 0.1, 0.012));
  return shapes;
}
