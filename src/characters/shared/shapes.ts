import * as THREE from 'three';

/**
 * Shape primitives for original vector character art (metres, y up).
 * Used by every InkFigure; see src/characters/ryuk/ryukShapes.ts for an
 * example of a full character drawn with them.
 */

export type P = readonly [number, number];

/** Tapered capsule between two points (rounded ends). */
export function capsule(a: P, b: P, ra: number, rb: number): THREE.Shape[] {
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

export function disc(c: P, rx: number, ry = rx, rot = 0): THREE.Shape {
  const s = new THREE.Shape();
  s.absellipse(c[0], c[1], rx, ry, 0, Math.PI * 2, false, rot);
  return s;
}

/** Curved tapering spike: hair locks, claws, fingers, folds. `bend` curves it sideways. */
export function spike(base: P, angle: number, len: number, width: number, bend = 0): THREE.Shape {
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  const px = -sa;
  const py = ca;
  const tip: P = [base[0] + ca * len + px * bend, base[1] + sa * len + py * bend];
  const mid: P = [
    base[0] + ca * len * 0.5 + px * bend * 0.6,
    base[1] + sa * len * 0.5 + py * bend * 0.6,
  ];
  const s = new THREE.Shape();
  s.moveTo(base[0] + px * width, base[1] + py * width);
  s.quadraticCurveTo(mid[0] + px * width * 0.55, mid[1] + py * width * 0.55, tip[0], tip[1]);
  s.quadraticCurveTo(
    mid[0] - px * width * 0.45,
    mid[1] - py * width * 0.45,
    base[0] - px * width,
    base[1] - py * width,
  );
  s.closePath();
  return s;
}

/** Straight-edged polygon. */
export function poly(points: readonly P[]): THREE.Shape {
  const s = new THREE.Shape();
  points.forEach(([x, y], i) => (i === 0 ? s.moveTo(x, y) : s.lineTo(x, y)));
  s.closePath();
  return s;
}

/**
 * Smooth closed outline through points (Catmull-Rom → quadratic segments).
 * The easiest way to draw organic shapes: faces, torsos, coats, hair masses.
 */
export function smooth(points: readonly P[]): THREE.Shape {
  const s = new THREE.Shape();
  const n = points.length;
  if (n < 3) return poly(points);
  const mid = (a: P, b: P): P => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  // Curve passes through edge midpoints, using each authored point as a control point.
  const start = mid(points[n - 1]!, points[0]!);
  s.moveTo(start[0], start[1]);
  for (let i = 0; i < n; i++) {
    const c = points[i]!;
    const m = mid(c, points[(i + 1) % n]!);
    s.quadraticCurveTo(c[0], c[1], m[0], m[1]);
  }
  s.closePath();
  return s;
}

/** Translate a list of points (handy for authoring parts relative to a pivot). */
export function rel(points: readonly P[], origin: P): P[] {
  return points.map(([x, y]) => [x - origin[0], y - origin[1]] as const);
}
