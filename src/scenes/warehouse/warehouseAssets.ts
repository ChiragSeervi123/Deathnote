import * as THREE from 'three';
import { mulberry32 } from '@/utils/math';
import { canvasTexture, makeCanvas } from '../shared/canvasTextures';

/** Corrugated sheet metal: vertical ridges with rust streaks and grime. */
export function corrugatedTexture(): THREE.CanvasTexture {
  const w = 512;
  const h = 512;
  const { canvas, ctx } = makeCanvas(w, h);
  const rnd = mulberry32(31);
  for (let x = 0; x < w; x++) {
    const ridge = 0.5 + 0.5 * Math.sin((x / w) * Math.PI * 2 * 16);
    const v = Math.round(52 + ridge * 38);
    ctx.fillStyle = `rgb(${v},${v + 2},${v + 4})`;
    ctx.fillRect(x, 0, 1, h);
  }
  for (let i = 0; i < 40; i++) {
    const x = rnd() * w;
    const len = 60 + rnd() * 300;
    const g = ctx.createLinearGradient(0, 0, 0, len);
    g.addColorStop(0, 'rgba(90,52,30,0.25)');
    g.addColorStop(1, 'rgba(90,52,30,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x, rnd() * h * 0.4, 2 + rnd() * 6, len);
  }
  const grime = ctx.createLinearGradient(0, h, 0, h * 0.55);
  grime.addColorStop(0, 'rgba(10,10,10,0.55)');
  grime.addColorStop(1, 'rgba(10,10,10,0)');
  ctx.fillStyle = grime;
  ctx.fillRect(0, 0, w, h);
  const t = canvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Stained concrete. */
export function concreteTexture(): THREE.CanvasTexture {
  const s = 512;
  const { canvas, ctx } = makeCanvas(s, s);
  const rnd = mulberry32(8);
  ctx.fillStyle = '#4a4744';
  ctx.fillRect(0, 0, s, s);
  for (let i = 0; i < 90; i++) {
    const r = 10 + rnd() * 80;
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    const dark = rnd() > 0.4;
    g.addColorStop(0, dark ? 'rgba(20,18,16,0.22)' : 'rgba(120,116,110,0.12)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save();
    ctx.translate(rnd() * s, rnd() * s);
    ctx.scale(1, 0.5 + rnd());
    ctx.fillStyle = g;
    ctx.fillRect(-r, -r, r * 2, r * 2);
    ctx.restore();
  }
  // Expansion joints.
  ctx.strokeStyle = 'rgba(15,14,13,0.6)';
  ctx.lineWidth = 2;
  for (const p of [0, s / 2]) {
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, s);
    ctx.moveTo(0, p);
    ctx.lineTo(s, p);
    ctx.stroke();
  }
  const t = canvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

const beamVertex = /* glsl */ `
varying float vY;
varying float vFacing;
void main() {
  vY = uv.y;
  vec3 n = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vFacing = abs(dot(n, normalize(-mv.xyz)));
  gl_Position = projectionMatrix * mv;
}
`;
const beamFragment = /* glsl */ `
precision highp float;
uniform float uOpacity;
uniform vec3 uColor;
varying float vY;
varying float vFacing;
void main() {
  float a = uOpacity * mix(0.25, 1.0, vY) * pow(max(vFacing, 1e-3), 1.3);
  a = max(a, 0.0);
  gl_FragColor = vec4(uColor * a, a);
}
`;

/** Additive light-shaft material; brightest at the window (uv.y = 1). */
export function beamMaterial(color: string, opacity: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: beamVertex,
    fragmentShader: beamFragment,
    uniforms: { uOpacity: { value: opacity }, uColor: { value: new THREE.Color(color) } },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
}

/**
 * A square shaft of light from a window to a patch of floor: an open
 * four-sided tube, wider at the floor.
 */
export function beamGeometry(
  from: THREE.Vector3,
  to: THREE.Vector3,
  top: number,
  bottom: number,
): THREE.BufferGeometry {
  const len = from.distanceTo(to);
  const g = new THREE.CylinderGeometry(top, bottom, len, 4, 1, true);
  g.rotateY(Math.PI / 4);
  // Cylinder uv.y runs 0 (bottom) → 1 (top); keep it, then orient top → `from`.
  const dir = new THREE.Vector3().subVectors(from, to).normalize();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  g.applyQuaternion(q);
  const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
  g.translate(mid.x, mid.y, mid.z);
  return g;
}
