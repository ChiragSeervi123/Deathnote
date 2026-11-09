import { forwardRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { ThreeElements } from '@react-three/fiber';

/** A plain block eraser in an unbranded paper sleeve. */
export function Eraser(props: ThreeElements['group']) {
  const a = useMemo(() => {
    const body = new RoundedBoxGeometry(0.5, 0.11, 0.21, 3, 0.022);
    const sleeve = new THREE.BoxGeometry(0.3, 0.116, 0.216);
    return {
      body,
      sleeve,
      bodyMat: new THREE.MeshStandardMaterial({ color: '#efece6', roughness: 0.85 }),
      sleeveMat: new THREE.MeshStandardMaterial({ color: '#8d98a3', roughness: 0.7 }),
    };
  }, []);
  useEffect(
    () => () => {
      a.body.dispose();
      a.sleeve.dispose();
      a.bodyMat.dispose();
      a.sleeveMat.dispose();
    },
    [a],
  );
  return (
    <group {...props}>
      <mesh
        geometry={a.body}
        material={a.bodyMat}
        position={[0, 0.055, 0]}
        castShadow
        receiveShadow
      />
      <mesh geometry={a.sleeve} material={a.sleeveMat} position={[0.07, 0.055, 0]} castShadow />
    </group>
  );
}

/**
 * A dip pen (holder, ferrule, nib). Like the Pencil prop it lies along +x, but
 * its nib tip sits at the local origin so it can be placed by the tip.
 */
export const DipPen = forwardRef<THREE.Group, ThreeElements['group']>(function DipPen(props, ref) {
  const a = useMemo(() => {
    const holder = new THREE.CylinderGeometry(0.03, 0.036, 1.3, 12, 1);
    holder.rotateZ(Math.PI / 2);
    holder.translate(-0.33 - 0.65, 0, 0);
    const ferrule = new THREE.CylinderGeometry(0.03, 0.026, 0.2, 12, 1);
    ferrule.rotateZ(Math.PI / 2);
    ferrule.translate(-0.23, 0, 0);
    const nib = new THREE.ConeGeometry(0.024, 0.14, 12, 1, false);
    nib.rotateZ(-Math.PI / 2);
    nib.scale(1, 0.35, 1);
    nib.translate(-0.07, 0, 0);
    return {
      holder,
      ferrule,
      nib,
      holderMat: new THREE.MeshStandardMaterial({ color: '#1b1a19', roughness: 0.38 }),
      metalMat: new THREE.MeshStandardMaterial({
        color: '#b8b2a6',
        roughness: 0.28,
        metalness: 0.9,
      }),
    };
  }, []);
  useEffect(
    () => () => {
      [a.holder, a.ferrule, a.nib].forEach((g) => g.dispose());
      [a.holderMat, a.metalMat].forEach((m) => m.dispose());
    },
    [a],
  );
  return (
    <group ref={ref} {...props}>
      <mesh geometry={a.holder} material={a.holderMat} castShadow />
      <mesh geometry={a.ferrule} material={a.metalMat} castShadow />
      <mesh geometry={a.nib} material={a.metalMat} castShadow />
    </group>
  );
});

/** A small square ink bottle with a black cap. */
export function InkBottle(props: ThreeElements['group']) {
  const a = useMemo(() => {
    const glass = new RoundedBoxGeometry(0.34, 0.3, 0.34, 3, 0.05);
    const cap = new THREE.CylinderGeometry(0.09, 0.09, 0.1, 16);
    return {
      glass,
      cap,
      glassMat: new THREE.MeshStandardMaterial({
        color: '#16171a',
        roughness: 0.12,
        metalness: 0.1,
      }),
      capMat: new THREE.MeshStandardMaterial({ color: '#0f0e0d', roughness: 0.6 }),
    };
  }, []);
  useEffect(
    () => () => {
      [a.glass, a.cap].forEach((g) => g.dispose());
      [a.glassMat, a.capMat].forEach((m) => m.dispose());
    },
    [a],
  );
  return (
    <group {...props}>
      <mesh
        geometry={a.glass}
        material={a.glassMat}
        position={[0, 0.15, 0]}
        castShadow
        receiveShadow
      />
      <mesh geometry={a.cap} material={a.capMat} position={[0, 0.35, 0]} castShadow />
    </group>
  );
}
