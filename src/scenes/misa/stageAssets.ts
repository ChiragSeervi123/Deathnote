import * as THREE from 'three';
import { mulberry32 } from '@/utils/math';
import { canvasTexture, makeCanvas } from '../shared/canvasTextures';

/** A gothic pointed-arch frame (outer arch with the inner arch cut out). */
function archShape(w: number, h: number, t: number): THREE.Shape {
  const pointed = (s: THREE.Shape | THREE.Path, hw: number, hh: number, move: boolean) => {
    const spring = hh - hw * 1.4;
    if (move) s.moveTo(-hw, 0);
    s.lineTo(-hw, spring);
    s.quadraticCurveTo(-hw, hh - hw * 0.35, 0, hh);
    s.quadraticCurveTo(hw, hh - hw * 0.35, hw, spring);
    s.lineTo(hw, 0);
  };
  const outer = new THREE.Shape();
  pointed(outer, w / 2, h, true);
  outer.closePath();
  const inner = new THREE.Path();
  pointed(inner, w / 2 - t, h - t * 1.4, true);
  inner.closePath();
  outer.holes.push(inner);
  return outer;
}

/** Five tall arches side by side with mullions, merged into one geometry. */
export function archesGeometry(): THREE.BufferGeometry {
  const geos: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 5; i++) {
    const x = (i - 2) * 2.3;
    const arch = new THREE.ShapeGeometry(archShape(1.7, 5.2, 0.14), 10);
    arch.translate(x, 0, 0);
    const mullion = new THREE.PlaneGeometry(0.05, 3.6);
    mullion.translate(x, 1.8, 0);
    const transom = new THREE.PlaneGeometry(1.5, 0.05);
    transom.translate(x, 2.6, 0);
    geos.push(arch, mullion, transom);
  }
  const merged = mergeFlat(geos);
  geos.forEach((g) => g.dispose());
  return merged;
}

/** Merge non-indexed position-only flat geometries. */
function mergeFlat(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const pos: number[] = [];
  for (const g of geos) {
    const ng = g.index ? g.toNonIndexed() : g;
    pos.push(...(ng.getAttribute('position').array as Float32Array));
    if (ng !== g) ng.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  return out;
}

export const LABEL_COLS = 6;
export const LABEL_ROWS = 4;

/**
 * What the Eyes show above each head: a name (redacted as a pale bar — the
 * crowd is anonymous) and a lifespan (invented numerals). Cell 0 is the one
 * notebook owner: his name is legible (or redacted when `ownerName` is null),
 * his lifespan is blank.
 */
export function labelAtlas(ownerName: string | null): THREE.CanvasTexture {
  const cw = 256;
  const ch = 96;
  const { canvas, ctx } = makeCanvas(cw * LABEL_COLS, ch * LABEL_ROWS);
  const rnd = mulberry32(41);
  ctx.textAlign = 'center';
  for (let i = 0; i < LABEL_COLS * LABEL_ROWS; i++) {
    const x = (i % LABEL_COLS) * cw;
    const y = Math.floor(i / LABEL_COLS) * ch;
    if (i === 0) {
      ctx.fillStyle = 'rgba(240,236,228,0.95)';
      if (ownerName) {
        ctx.font = '500 30px "IBM Plex Mono", monospace';
        ctx.fillText(ownerName, x + cw / 2, y + 38);
      } else ctx.fillRect(x + 70, y + 16, cw - 140, 18);
      ctx.strokeStyle = 'rgba(240,236,228,0.35)';
      ctx.setLineDash([6, 8]);
      ctx.strokeRect(x + 70, y + 54, cw - 140, 30);
      ctx.setLineDash([]);
      continue;
    }
    const bw = 110 + rnd() * 100;
    ctx.fillStyle = 'rgba(232,227,216,0.85)';
    ctx.fillRect(x + (cw - bw) / 2, y + 16, bw, 18);
    ctx.fillStyle = '#ff3b42';
    ctx.font = '500 34px "IBM Plex Mono", monospace';
    const n = Math.floor(1e7 + rnd() * 9e7).toString();
    ctx.fillText(n, x + cw / 2, y + 80);
  }
  return canvasTexture(canvas);
}

/** The second Kira's tape on a television: a plain card, then the message. */
export function tapeTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(512, 384);
  ctx.fillStyle = '#0d0c0e';
  ctx.fillRect(0, 0, 512, 384);
  ctx.fillStyle = '#e8e3d8';
  ctx.textAlign = 'center';
  ctx.font = '500 22px "IBM Plex Mono", monospace';
  ctx.fillText('TAPE RECEIVED', 256, 70);
  ctx.font = '400 92px "Cormorant Garamond Variable", serif';
  ctx.fillText('KIRA', 256, 210);
  ctx.font = '500 22px "IBM Plex Mono", monospace';
  ctx.fillStyle = '#d0161f';
  ctx.fillText('THE SECOND', 256, 270);
  ctx.fillStyle = 'rgba(232,227,216,0.5)';
  ctx.fillText('▶ PLAY  00:00:41', 256, 340);
  return canvasTexture(canvas);
}

export const tvVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const tvFragment = /* glsl */ `
precision highp float;
uniform sampler2D uMap;
uniform float uTime;
uniform float uSignal;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  vec2 uv = vUv;
  // Barrel curvature of a CRT face.
  vec2 c = uv - 0.5;
  uv = 0.5 + c * (1.0 + dot(c, c) * 0.18);
  float roll = sin(uv.y * 240.0 + uTime * 10.0) * 0.5 + 0.5;
  vec2 cell = floor(uv * vec2(160.0, 120.0)) + floor(uTime * 24.0);
  float snow = hash(cell);
  vec3 tape = texture2D(uMap, uv + vec2(sin(uTime * 3.0 + uv.y * 30.0) * 0.002, 0.0)).rgb;
  vec3 col = mix(vec3(snow) * 0.55, tape, uSignal);
  col *= 0.82 + 0.18 * roll;
  float edge = smoothstep(0.0, 0.04, uv.x) * smoothstep(0.0, 0.04, uv.y) * smoothstep(1.0, 0.96, uv.x) * smoothstep(1.0, 0.96, uv.y);
  gl_FragColor = vec4(col * edge * 1.4, 1.0);
}
`;
