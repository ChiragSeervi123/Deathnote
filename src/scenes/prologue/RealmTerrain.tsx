import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { mulberry32 } from '@/utils/math';
import { WORLD } from './world';

/** Small deterministic value noise for CPU-side displacement. */
function makeNoise(seed: number) {
  const rnd = mulberry32(seed);
  const perm = new Float32Array(512);
  for (let i = 0; i < 512; i++) perm[i] = rnd();
  const h = (x: number, y: number) => perm[((x & 255) + (y & 255) * 31) & 511]!;
  const n = (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const a = h(xi, yi);
    const b = h(xi + 1, yi);
    const c = h(xi, yi + 1);
    const d = h(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  return (x: number, y: number) => {
    let v = 0;
    let amp = 0.5;
    let f = 1;
    for (let o = 0; o < 5; o++) {
      v += amp * n(x * f, y * f);
      f *= 2.03;
      amp *= 0.5;
    }
    return v;
  };
}

function terrainHeight(x: number, z: number, fbm: (x: number, y: number) => number): number {
  const r = Math.hypot(x, z);
  // Long dunes + rubble.
  let y = (fbm(x * 0.012 + 3, z * 0.012 + 7) - 0.5) * 16 + (fbm(x * 0.08, z * 0.08) - 0.5) * 1.6;
  // Flatten a plateau around the hole and raise a jagged lip at its rim.
  const plateau = Math.min(1, Math.max(0, (r - 6) / 30));
  y *= plateau * plateau;
  const lip = Math.exp(-Math.pow((r - WORLD.holeRadius - 0.6) / 1.1, 2));
  y += lip * (0.5 + fbm(Math.atan2(z, x) * 3 + 10, 1) * 1.1);
  return y;
}

/** A bent, tapering spike (bone / horn) along +y. */
function spireGeometry(): THREE.BufferGeometry {
  const g = new THREE.CylinderGeometry(0.07, 1, 1, 8, 10, true);
  g.translate(0, 0.5, 0);
  const pos = g.getAttribute('position') as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    pos.setX(i, pos.getX(i) + y * y * 0.45);
  }
  g.computeVertexNormals();
  return g;
}

export function RealmTerrain({ density = 1 }: { density?: number }) {
  const a = useMemo(() => {
    const fbm = makeNoise(13);
    const size = 640;
    const seg = 220;
    const geometry = new THREE.PlaneGeometry(size, size, seg, seg);
    geometry.rotateX(-Math.PI / 2);
    const pos = geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, terrainHeight(x, z, fbm));
    }
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color: '#4a4741',
      roughness: 1,
      metalness: 0,
    });
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uHole = { value: WORLD.holeRadius };
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vLocal;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvLocal = position;');
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          '#include <common>\nvarying vec3 vLocal;\nuniform float uHole;',
        )
        .replace(
          '#include <clipping_planes_fragment>',
          `#include <clipping_planes_fragment>
          float rr = length(vLocal.xz);
          float edge = uHole + sin(atan(vLocal.z, vLocal.x) * 7.0) * 0.18 + sin(atan(vLocal.z, vLocal.x) * 13.0) * 0.09;
          if (rr < edge) discard;`,
        )
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
          // Darker, scorched ground toward the rim; paler dust on ridges.
          float rim = 1.0 - smoothstep(edge, edge + 2.5, rr);
          diffuseColor.rgb *= mix(1.0, 0.25, rim);
          diffuseColor.rgb *= 0.85 + 0.3 * smoothstep(-2.0, 6.0, vLocal.y);`,
        );
    };

    // Bone spires and rubble, kept clear of the plateau.
    const rnd = mulberry32(31);
    const spireCount = Math.round(140 * density);
    const spireGeo = spireGeometry();
    const spireMat = new THREE.MeshStandardMaterial({ color: '#8c867a', roughness: 0.92 });
    const spires = new THREE.InstancedMesh(spireGeo, spireMat, spireCount);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();
    // Keep the camera's flight corridor (from the north-west vantage to the hole) clear.
    const corridor = (x: number, z: number) => {
      const ax = -48;
      const az = 74;
      const t = Math.max(0, Math.min(1, (x * ax + z * az) / (ax * ax + az * az)));
      return Math.hypot(x - ax * t, z - az * t) < 26;
    };
    for (let i = 0; i < spireCount; i++) {
      let x = 0;
      let z = 0;
      for (let tries = 0; tries < 12; tries++) {
        const ang = rnd() * Math.PI * 2;
        const r = 26 + Math.pow(rnd(), 0.7) * 260;
        x = Math.cos(ang) * r;
        z = Math.sin(ang) * r;
        if (!corridor(x, z)) break;
      }
      const hgt = 3 + Math.pow(rnd(), 2) * 34;
      p.set(x, terrainHeight(x, z, fbm) - 0.5, z);
      e.set((rnd() - 0.5) * 0.5, rnd() * Math.PI * 2, (rnd() - 0.5) * 0.4);
      q.setFromEuler(e);
      s.set(hgt * (0.05 + rnd() * 0.04), hgt, hgt * (0.05 + rnd() * 0.04));
      spires.setMatrixAt(i, m.compose(p, q, s));
    }
    spires.instanceMatrix.needsUpdate = true;

    const rockCount = Math.round(90 * density);
    // Weathered boulders: a displaced, smooth-shaded sphere (positions keyed by
    // direction so seams stay closed).
    const rockGeo = new THREE.IcosahedronGeometry(1, 3);
    const rpos = rockGeo.getAttribute('position') as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < rpos.count; i++) {
      v.fromBufferAttribute(rpos, i).normalize();
      const k = 0.78 + fbm(v.x * 2.1 + 5, v.z * 2.1 + v.y * 1.7) * 0.5;
      rpos.setXYZ(i, v.x * k, v.y * k * 0.62, v.z * k);
    }
    rockGeo.computeVertexNormals();
    const rockMat = new THREE.MeshStandardMaterial({ color: '#2a2825', roughness: 0.97 });
    const rocks = new THREE.InstancedMesh(rockGeo, rockMat, rockCount);
    for (let i = 0; i < rockCount; i++) {
      let x = 0;
      let z = 0;
      for (let tries = 0; tries < 12; tries++) {
        const ang = rnd() * Math.PI * 2;
        const r = 7 + Math.pow(rnd(), 1.4) * 120;
        x = Math.cos(ang) * r;
        z = Math.sin(ang) * r;
        if (!corridor(x, z)) break;
      }
      const sc = 0.3 + Math.pow(rnd(), 3) * 3;
      p.set(x, terrainHeight(x, z, fbm) - sc * 0.2, z);
      e.set(rnd() * 3, rnd() * 3, rnd() * 3);
      q.setFromEuler(e);
      s.set(sc, sc, sc);
      rocks.setMatrixAt(i, m.compose(p, q, s));
    }
    rocks.instanceMatrix.needsUpdate = true;

    return { geometry, material, spires, spireGeo, spireMat, rocks, rockGeo, rockMat };
  }, [density]);

  useEffect(
    () => () => {
      a.geometry.dispose();
      a.material.dispose();
      a.spireGeo.dispose();
      a.spireMat.dispose();
      a.rockGeo.dispose();
      a.rockMat.dispose();
      a.spires.dispose();
      a.rocks.dispose();
    },
    [a],
  );

  return (
    <group position={[0, WORLD.realmY, 0]}>
      <mesh geometry={a.geometry} material={a.material} receiveShadow />
      <primitive object={a.spires} />
      <primitive object={a.rocks} />
      {/* The hole's throat: a rock wall dropping into the dark, so it reads as a void, not a pool. */}
      <mesh position={[0, -4.6, 0]}>
        <cylinderGeometry
          args={[WORLD.holeRadius + 0.35, WORLD.holeRadius + 0.15, 9.5, 40, 1, true]}
        />
        <meshStandardMaterial color="#121110" roughness={1} side={1} />
      </mesh>
      {/* The rock Ryuk sits on. */}
      <mesh
        position={[WORLD.ryuk[0] - 0.35, 0.45, WORLD.ryuk[2]]}
        scale={[1.3, 0.95, 1.1]}
        rotation={[0.2, 0.5, 0.1]}
      >
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#1c1b19" roughness={1} />
      </mesh>
    </group>
  );
}
