import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';
import { mulberry32 } from '@/utils/math';
import { canvasTexture, makeCanvas } from '../shared/canvasTextures';

/** Apple skin: deep red with streaks and lenticels, warmer near the stem. */
function appleSkin(seed: number): THREE.CanvasTexture {
  const w = 512;
  const h = 256;
  const { canvas, ctx } = makeCanvas(w, h);
  const g = ctx.createLinearGradient(0, 0, 0, h);
  // v = 0 bottom (canvas bottom), v = 1 top
  g.addColorStop(0, '#5a080d');
  g.addColorStop(0.2, '#7b0b12');
  g.addColorStop(0.75, '#8e1016');
  g.addColorStop(0.92, '#9a3a1c');
  g.addColorStop(1, '#6a5a22');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const rnd = mulberry32(seed);
  for (let i = 0; i < 260; i++) {
    const x = rnd() * w;
    const y0 = h * (0.08 + rnd() * 0.3);
    const len = h * (0.35 + rnd() * 0.5);
    ctx.strokeStyle = rnd() < 0.7 ? `rgba(180,40,30,${0.12 + rnd() * 0.18})` : `rgba(60,0,6,${0.15 + rnd() * 0.2})`;
    ctx.lineWidth = 1 + rnd() * 4;
    ctx.beginPath();
    ctx.moveTo(x, h - y0);
    ctx.bezierCurveTo(x + (rnd() - 0.5) * 10, h - y0 - len * 0.4, x + (rnd() - 0.5) * 10, h - y0 - len * 0.7, x + (rnd() - 0.5) * 6, h - y0 - len);
    ctx.stroke();
  }
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = `rgba(235,200,150,${0.15 + rnd() * 0.25})`;
    ctx.beginPath();
    ctx.arc(rnd() * w, rnd() * h, 0.6 + rnd() * 0.9, 0, Math.PI * 2);
    ctx.fill();
  }
  return canvasTexture(canvas);
}

function appleProfile(): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [];
  const N = 56;
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI;
    const r = Math.sin(a) * (1 - 0.11 * Math.cos(a)) * 0.5;
    let y = -Math.cos(a) * 0.44;
    const pole = Math.exp(-Math.pow(r / 0.12, 2));
    y += y > 0 ? -0.1 * pole : 0.055 * pole;
    pts.push(new THREE.Vector2(Math.max(r, 0.0005), y));
  }
  return pts;
}

type Props = ThreeElements['group'] & { seed?: number };

/** Ryuk's weakness. A procedural apple with a clear-coated skin. */
export function Apple({ seed = 4, ...props }: Props) {
  const assets = useMemo(() => {
    const geometry = new THREE.LatheGeometry(appleProfile(), 72);
    // Gentle asymmetry so it doesn't read as a lathe.
    const pos = geometry.getAttribute('position') as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const ang = Math.atan2(v.z, v.x);
      const k = 1 + 0.035 * Math.sin(ang * 3 + 0.6) + 0.02 * Math.sin(ang * 5);
      pos.setXYZ(i, v.x * k, v.y * (1 + 0.03 * Math.sin(ang * 2)), v.z * k);
    }
    geometry.computeVertexNormals();
    const map = appleSkin(seed);
    const material = new THREE.MeshPhysicalMaterial({
      map,
      roughness: 0.34,
      clearcoat: 0.9,
      clearcoatRoughness: 0.18,
      sheen: 0.25,
      sheenColor: new THREE.Color('#ff9a7a'),
      envMapIntensity: 1.1,
    });
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.3, 0),
      new THREE.Vector3(0.01, 0.42, 0),
      new THREE.Vector3(0.05, 0.53, 0.01),
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 12, 0.016, 6, false);
    const stemMat = new THREE.MeshStandardMaterial({ color: '#3b2a1a', roughness: 0.8 });
    return { geometry, material, map, stemGeo, stemMat };
  }, [seed]);

  useEffect(
    () => () => {
      assets.geometry.dispose();
      assets.material.dispose();
      assets.map.dispose();
      assets.stemGeo.dispose();
      assets.stemMat.dispose();
    },
    [assets],
  );

  return (
    <group {...props}>
      <mesh geometry={assets.geometry} material={assets.material} castShadow receiveShadow />
      <mesh geometry={assets.stemGeo} material={assets.stemMat} castShadow />
    </group>
  );
}
