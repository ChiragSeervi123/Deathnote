import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';

/** A plain hexagonal pencil, sharpened. Lies along +x. */
export function Pencil(props: ThreeElements['group']) {
  const a = useMemo(() => {
    const len = 1.6;
    const r = 0.034;
    const body = new THREE.CylinderGeometry(r, r, len, 6, 1);
    body.rotateZ(Math.PI / 2);
    const cone = new THREE.CylinderGeometry(0.009, r, 0.17, 6, 1);
    cone.rotateZ(-Math.PI / 2);
    cone.translate(len / 2 + 0.085, 0, 0);
    const tip = new THREE.ConeGeometry(0.009, 0.04, 8);
    tip.rotateZ(-Math.PI / 2);
    tip.translate(len / 2 + 0.17 + 0.02, 0, 0);
    const band = new THREE.CylinderGeometry(r * 1.01, r * 1.01, 0.03, 6);
    band.rotateZ(Math.PI / 2);
    band.translate(-len / 2 + 0.12, 0, 0);
    return {
      body,
      cone,
      tip,
      band,
      bodyMat: new THREE.MeshPhysicalMaterial({
        color: '#141416',
        roughness: 0.28,
        clearcoat: 0.6,
        clearcoatRoughness: 0.25,
      }),
      woodMat: new THREE.MeshStandardMaterial({ color: '#c49a6c', roughness: 0.75 }),
      graphiteMat: new THREE.MeshStandardMaterial({
        color: '#2a2a2c',
        roughness: 0.35,
        metalness: 0.4,
      }),
      bandMat: new THREE.MeshStandardMaterial({ color: '#8f7a52', roughness: 0.4, metalness: 0.8 }),
    };
  }, []);

  useEffect(
    () => () => {
      [a.body, a.cone, a.tip, a.band].forEach((g) => g.dispose());
      [a.bodyMat, a.woodMat, a.graphiteMat, a.bandMat].forEach((m) => m.dispose());
    },
    [a],
  );

  return (
    <group {...props}>
      <mesh geometry={a.body} material={a.bodyMat} castShadow receiveShadow />
      <mesh geometry={a.cone} material={a.woodMat} castShadow />
      <mesh geometry={a.tip} material={a.graphiteMat} castShadow />
      <mesh geometry={a.band} material={a.bandMat} castShadow />
    </group>
  );
}
