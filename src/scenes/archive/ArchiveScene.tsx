import { useEffect, useMemo, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRuntime } from '@/state/runtime';
import { mulberry32 } from '@/utils/math';
import { Motes } from '../props/Motes';
import { QUALITY_PROFILES } from '../shared/quality';
import { useSceneFrame } from '../shared/sceneFrame';
import { beamGeometry, beamMaterial } from '../warehouse/warehouseAssets';

/**
 * Archives I & III — a dim records room behind the reading pages: two long
 * runs of shelving stacked with file boxes, one beam of light from a high
 * window, dust turning in it. The camera walks the aisle as the page scrolls.
 */
const AISLE = 14;
const BEAM_FROM = new THREE.Vector3(-2.2, 5.2, -4);
const BEAM_TO = new THREE.Vector3(0.4, 0, -6.5);
const DUST_BOX: [number, number, number] = [2.6, 5, 3];
const DUST_POS: [number, number, number] = [-0.6, 2.5, -5.4];
const DUST_DRIFT: [number, number, number] = [0.01, -0.006, 0];
const BEAM_LIGHT = {
  pos: [-2.2, 5.2, -4] as [number, number, number],
  target: [0.4, 0, -6.5] as [number, number, number],
  angle: 0.32,
};

function buildShelves() {
  const rnd = mulberry32(12);
  const board = new THREE.BoxGeometry(1, 1, 1);
  const boardMat = new THREE.MeshStandardMaterial({ color: '#2a2420', roughness: 0.8 });
  const boxMat = new THREE.MeshStandardMaterial({ color: '#8a7a64', roughness: 0.9 });
  const boards: THREE.Matrix4[] = [];
  const boxes: { m: THREE.Matrix4; c: THREE.Color }[] = [];
  const q = new THREE.Quaternion();
  for (const side of [-1, 1] as const) {
    const x = side * 1.5;
    for (let level = 0; level < 6; level++) {
      const y = 0.15 + level * 0.62;
      boards.push(
        new THREE.Matrix4().compose(
          new THREE.Vector3(x, y, -AISLE / 2),
          q,
          new THREE.Vector3(0.6, 0.04, AISLE),
        ),
      );
      let z = 0.2;
      while (z < AISLE - 0.4) {
        const w = 0.28 + rnd() * 0.18;
        if (rnd() > 0.12) {
          const h = 0.32 + rnd() * 0.18;
          const tone = 0.55 + rnd() * 0.5;
          boxes.push({
            m: new THREE.Matrix4().compose(
              new THREE.Vector3(x + side * (rnd() - 0.5) * 0.06, y + 0.02 + h / 2, -z - w / 2),
              q,
              new THREE.Vector3(0.48, h, w - 0.02),
            ),
            c: new THREE.Color(0.55 * tone, 0.48 * tone, 0.38 * tone),
          });
        }
        z += w;
      }
    }
    // Uprights.
    for (let k = 0; k <= 7; k++) {
      boards.push(
        new THREE.Matrix4().compose(
          new THREE.Vector3(x, 1.85, -k * (AISLE / 7)),
          q,
          new THREE.Vector3(0.62, 3.7, 0.05),
        ),
      );
    }
  }
  const boardMesh = new THREE.InstancedMesh(board, boardMat, boards.length);
  boards.forEach((m, i) => boardMesh.setMatrixAt(i, m));
  const boxMesh = new THREE.InstancedMesh(board, boxMat, boxes.length);
  boxes.forEach((b, i) => {
    boxMesh.setMatrixAt(i, b.m);
    boxMesh.setColorAt(i, b.c);
  });
  return {
    boardMesh,
    boxMesh,
    dispose: () => {
      board.dispose();
      boardMat.dispose();
      boxMat.dispose();
      boardMesh.dispose();
      boxMesh.dispose();
    },
  };
}

export default function ArchiveScene() {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const size = useThree((s) => s.size);
  const tier = useRuntime((s) => s.tier);
  const profile = QUALITY_PROFILES[tier];
  const a = useMemo(() => {
    const shelves = buildShelves();
    const beamGeo = beamGeometry(BEAM_FROM, BEAM_TO, 0.35, 0.9);
    const beamMat = beamMaterial('#e8d6b4', 0.22);
    const target = new THREE.Object3D();
    target.position.copy(BEAM_TO);
    return { shelves, beamGeo, beamMat, target };
  }, []);
  useEffect(
    () => () => {
      a.shelves.dispose();
      a.beamGeo.dispose();
      a.beamMat.dispose();
    },
    [a],
  );

  useSceneFrame((f) => {
    const cam = camRef.current;
    if (!cam) return;
    const t = f.reduced ? 0 : f.time;
    const z = 1.5 - f.progress * 6 + Math.sin(t * 0.05) * 0.15;
    const back = size.width / size.height < 0.9 ? 1.6 : 0;
    cam.position.set(0.25 + f.pointer.x * 0.08, 1.6 + f.pointer.y * 0.04, z + back);
    cam.lookAt(-0.1, 1.45, z - 6);
  });

  return (
    <>
      <PerspectiveCamera
        ref={camRef}
        makeDefault
        fov={50}
        near={0.05}
        far={40}
        position={[0.25, 1.6, 1.5]}
      />
      <color attach="background" args={['#060504']} />
      <fog attach="fog" args={['#060504', 4, 18]} />
      <hemisphereLight args={['#6a5c4a', '#0a0806', 0.9]} />
      <spotLight
        position={BEAM_LIGHT.pos}
        angle={0.32}
        penumbra={0.5}
        intensity={55}
        distance={12}
        color="#f1dcb4"
        target={a.target}
      />
      <primitive object={a.target} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -AISLE / 2]}>
        <planeGeometry args={[6, AISLE + 4]} />
        <meshStandardMaterial color="#17130f" roughness={0.9} />
      </mesh>
      <primitive object={a.shelves.boardMesh} />
      <primitive object={a.shelves.boxMesh} />
      <mesh geometry={a.beamGeo} material={a.beamMat} />
      {profile.particles > 0.2 ? (
        <Motes
          count={Math.round(260 * profile.particles)}
          box={DUST_BOX}
          position={DUST_POS}
          drift={DUST_DRIFT}
          color="#f4e2c0"
          size={9}
          opacity={0.7}
          beam={BEAM_LIGHT}
          seed={4}
        />
      ) : null}
    </>
  );
}
