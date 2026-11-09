import * as THREE from 'three';
import { mulberry32 } from '@/utils/math';
import { canvasTexture, makeCanvas } from '../shared/canvasTextures';

/** Dusk sky: violet overhead, burnt orange at the horizon, a low sun. */
export function duskTexture(): THREE.CanvasTexture {
  const w = 1024;
  const h = 512;
  const { canvas, ctx } = makeCanvas(w, h);
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#1d1a2e');
  g.addColorStop(0.45, '#4a2c3c');
  g.addColorStop(0.72, '#a3523a');
  g.addColorStop(0.86, '#e08a4a');
  g.addColorStop(1, '#f2b46a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const sun = ctx.createRadialGradient(w * 0.62, h * 0.86, 0, w * 0.62, h * 0.86, h * 0.5);
  sun.addColorStop(0, 'rgba(255,214,150,0.95)');
  sun.addColorStop(0.08, 'rgba(255,190,120,0.6)');
  sun.addColorStop(1, 'rgba(255,150,90,0)');
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, w, h);
  // A few long, thin clouds.
  const rnd = mulberry32(5);
  for (let i = 0; i < 9; i++) {
    const y = h * (0.35 + rnd() * 0.4);
    ctx.fillStyle = `rgba(40,22,34,${0.18 + rnd() * 0.2})`;
    ctx.beginPath();
    ctx.ellipse(rnd() * w, y, 120 + rnd() * 260, 3 + rnd() * 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  return canvasTexture(canvas);
}

export interface Skyline {
  blocks: THREE.InstancedMesh;
  windows: THREE.Points;
  windowMat: THREE.PointsMaterial;
  dispose: () => void;
}

/** Silhouetted city blocks along the horizon and the windows that light up in them. */
export function buildSkyline(count: number): Skyline {
  const rnd = mulberry32(77);
  const box = new THREE.BoxGeometry(1, 1, 1);
  box.translate(0, 0.5, 0);
  const mat = new THREE.MeshBasicMaterial({ color: '#140f14' });
  const blocks = new THREE.InstancedMesh(box, mat, count);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const win: number[] = [];
  for (let i = 0; i < count; i++) {
    const x = -110 + (i / count) * 220 + (rnd() - 0.5) * 3;
    const z = -55 - rnd() * 30;
    const w = 3 + rnd() * 6;
    const h = 5 + Math.pow(rnd(), 2) * 34;
    m.compose(new THREE.Vector3(x, 0, z), q, new THREE.Vector3(w, h, 2 + rnd() * 3));
    blocks.setMatrixAt(i, m);
    for (let k = 0; k < 24; k++) {
      if (rnd() > 0.6) continue;
      win.push(x + (rnd() - 0.5) * w * 0.85, 1 + rnd() * (h - 2), z + 2.6);
    }
  }
  const wGeo = new THREE.BufferGeometry();
  wGeo.setAttribute('position', new THREE.Float32BufferAttribute(win, 3));
  const windowMat = new THREE.PointsMaterial({
    color: new THREE.Color(2.4, 1.7, 0.9),
    size: 0.55,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    toneMapped: false,
  });
  const windows = new THREE.Points(wGeo, windowMat);
  return {
    blocks,
    windows,
    windowMat,
    dispose: () => {
      box.dispose();
      mat.dispose();
      blocks.dispose();
      wGeo.dispose();
      windowMat.dispose();
    },
  };
}
