import * as THREE from 'three';
import { mulberry32 } from '@/utils/math';

/**
 * Near's blank white jigsaw: COLS×ROWS instanced pieces that slide from a
 * scattered pile into the grid as progress advances. A slightly larger grey
 * copy under each piece draws its cut line.
 */
export const COLS = 8;
export const ROWS = 6;
export const CELL = 0.075;

function pieceShape(s: number, grow: number): THREE.Shape {
  const h = s / 2 + grow;
  const t = s * 0.16 + grow;
  const sh = new THREE.Shape();
  sh.moveTo(-h, -h);
  sh.lineTo(h, -h);
  // Tab on the right edge.
  sh.lineTo(h, -t * 0.7);
  sh.absarc(h + t * 0.75, 0, t, Math.PI * 1.25, Math.PI * 0.75, false);
  sh.lineTo(h, t * 0.7);
  sh.lineTo(h, h);
  // Tab on the top edge.
  sh.lineTo(t * 0.7, h);
  sh.absarc(0, h + t * 0.75, t, -Math.PI * 0.25, Math.PI * 1.25, false);
  sh.lineTo(-t * 0.7, h);
  sh.lineTo(-h, h);
  sh.closePath();
  return sh;
}

export interface Puzzle {
  pieces: THREE.InstancedMesh;
  cuts: THREE.InstancedMesh;
  pieceMat: THREE.MeshBasicMaterial;
  /** Place every piece for assembly fraction k (0 scattered … 1 complete). */
  update: (k: number) => void;
  dispose: () => void;
}

export function buildPuzzle(): Puzzle {
  const n = COLS * ROWS;
  const geo = new THREE.ShapeGeometry(pieceShape(CELL, 0), 6);
  geo.rotateX(-Math.PI / 2);
  const cutGeo = new THREE.ShapeGeometry(pieceShape(CELL, 0.0025), 6);
  cutGeo.rotateX(-Math.PI / 2);
  const pieceMat = new THREE.MeshBasicMaterial({ color: '#f6f4ef' });
  const cutMat = new THREE.MeshBasicMaterial({ color: '#9f9b92' });
  const pieces = new THREE.InstancedMesh(geo, pieceMat, n);
  const cuts = new THREE.InstancedMesh(cutGeo, cutMat, n);

  const rnd = mulberry32(23);
  const order = Array.from({ length: n }, (_, i) => i).sort(() => rnd() - 0.5);
  const rank = new Float32Array(n);
  order.forEach((piece, i) => (rank[piece] = i / n));
  const from = Array.from({ length: n }, () => {
    const a = rnd() * Math.PI * 2;
    const d = 0.36 + rnd() * 0.3;
    return { x: Math.cos(a) * d * 1.3, z: Math.sin(a) * d * 0.8 + 0.1, rot: rnd() * Math.PI * 2 };
  });

  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const pos = new THREE.Vector3();
  const one = new THREE.Vector3(1, 1, 1);
  const update = (k: number) => {
    for (let i = 0; i < n; i++) {
      const c = i % COLS;
      const r = Math.floor(i / COLS);
      const f = from[i]!;
      // Each piece travels in its own short window of the assembly.
      const t = THREE.MathUtils.smoothstep(k * n - rank[i]! * n, 0, 1.5);
      const tx = (c - (COLS - 1) / 2) * CELL;
      const tz = (r - (ROWS - 1) / 2) * CELL;
      pos.set(
        THREE.MathUtils.lerp(f.x, tx, t),
        0.002 + Math.sin(t * Math.PI) * 0.03,
        THREE.MathUtils.lerp(f.z, tz, t),
      );
      q.setFromAxisAngle(up, f.rot * (1 - t));
      m.compose(pos, q, one);
      pieces.setMatrixAt(i, m);
      pos.y -= 0.001;
      m.compose(pos, q, one);
      cuts.setMatrixAt(i, m);
    }
    pieces.instanceMatrix.needsUpdate = true;
    cuts.instanceMatrix.needsUpdate = true;
  };
  update(0);

  return {
    pieces,
    cuts,
    pieceMat,
    update,
    dispose: () => {
      geo.dispose();
      cutGeo.dispose();
      pieceMat.dispose();
      cutMat.dispose();
      pieces.dispose();
      cuts.dispose();
    },
  };
}
