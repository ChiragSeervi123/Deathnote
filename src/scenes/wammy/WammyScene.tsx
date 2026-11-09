import { useEffect, useMemo, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { InkFigure, type InkFigureHandle } from '@/characters/shared/InkFigure';
import { melloParts } from '@/characters/successors/mello';
import { nearParts } from '@/characters/successors/near';
import { keyframes, range, smoothstep } from '@/utils/math';
import { glowTexture } from '../shared/canvasTextures';
import { useSceneFrame } from '../shared/sceneFrame';
import { buildPuzzle } from './puzzle';

/**
 * Chapter 11 — Successors. A divided set: on the white side Near sits with a
 * blank jigsaw that assembles as the chapter scrolls; on the black side Mello,
 * under one hard light, snaps a square of chocolate — then walks out of it.
 */
type V3 = readonly [number, number, number];

const NEAR_AT: V3 = [1.3, 0, -0.3];
const PUZZLE_AT: V3 = [1.3, 0, 0.42];
const MELLO_AT: V3 = [-1.3, 0, -0.3];
const MELLO_GONE: V3 = [-2.5, 0, -2.9];
/** Contact shadows on the white floor: x, z, size, opacity. */
const SHADOWS: ReadonlyArray<readonly [number, number, number, number]> = [
  [NEAR_AT[0], NEAR_AT[2] + 0.05, 1.1, 0.55],
  [PUZZLE_AT[0], PUZZLE_AT[2], 1.4, 0.3],
];
const WHITE = new THREE.Color('#cdc9c0');
const WALL = new THREE.Color('#d9d5cd');
const PIECE = new THREE.Color('#f6f4ef');
const RIM = new THREE.Color('#f1ece2');
const BLACK = new THREE.Color('#000000');
const TINT = new THREE.Color();

const CAM: ReadonlyArray<{ t: number; pos: V3; tgt: V3 }> = [
  { t: 0, pos: [2.0, 1.5, 7.4], tgt: [2.0, 0.9, 0] },
  { t: 0.11, pos: [1.8, 1.6, 6.6], tgt: [1.9, 0.85, 0] },
  { t: 0.14, pos: [-1.0, 6.4, 3.6], tgt: [-0.4, 0, -0.1] },
  { t: 0.25, pos: [-0.8, 5.6, 3.1], tgt: [-0.4, 0, -0.1] },
  { t: 0.28, pos: [0.55, 0.95, 2.7], tgt: [0.75, 0.5, 0] },
  { t: 0.39, pos: [0.6, 0.9, 2.3], tgt: [0.78, 0.5, 0] },
  { t: 0.415, pos: [-0.6, 1.5, 2.5], tgt: [-0.72, 1.35, -0.3] },
  { t: 0.53, pos: [-0.62, 1.48, 2.1], tgt: [-0.74, 1.38, -0.3] },
  { t: 0.56, pos: [0.1, 1.4, 5.2], tgt: [0.2, 0.85, -0.4] },
  { t: 0.67, pos: [0.3, 1.5, 4.8], tgt: [0.4, 0.8, -0.4] },
  { t: 0.7, pos: [1.6, 2.7, 1.9], tgt: [2.0, 0.1, 0.25] },
  { t: 0.84, pos: [1.65, 2.4, 1.6], tgt: [2.0, 0.1, 0.25] },
  { t: 1, pos: [1.6, 1.6, 6.4], tgt: [2.0, 0.8, 0] },
];
const CAM_POS = CAM.map((k) => ({ t: k.t, v: k.pos }));
const CAM_TGT = CAM.map((k) => ({ t: k.t, v: k.tgt }));

export default function WammyScene() {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const nearRef = useRef<InkFigureHandle>(null);
  const melloRef = useRef<InkFigureHandle>(null);
  const melloGroup = useRef<THREE.Group>(null);
  const floorMat = useRef<THREE.MeshBasicMaterial>(null);
  const wallMat = useRef<THREE.MeshBasicMaterial>(null);
  const size = useThree((s) => s.size);
  const near = useMemo(nearParts, []);
  const mello = useMemo(melloParts, []);
  const a = useMemo(() => ({ puzzle: buildPuzzle(), glow: glowTexture() }), []);
  useEffect(
    () => () => {
      a.puzzle.dispose();
      a.glow.dispose();
    },
    [a],
  );

  useSceneFrame((f) => {
    const p = f.reduced ? Math.round(f.progress * 6) / 6 : f.progress;
    const cam = camRef.current;
    if (!cam) return;
    const pos = keyframes(CAM_POS, p);
    const tgt = keyframes(CAM_TGT, p);
    const back = size.width / size.height < 0.9 ? 1.5 : 1;
    cam.position.set(
      tgt[0] + (pos[0] - tgt[0]) * back + f.pointer.x * 0.08,
      pos[1] + f.pointer.y * 0.04,
      tgt[2] + (pos[2] - tgt[2]) * back,
    );
    cam.lookAt(tgt[0], tgt[1], tgt[2]);
    const t = f.reduced ? 0 : f.time;

    // The white side goes dark while Mello has the floor.
    const white = 1 - 0.93 * smoothstep(0.4, 0.43, p) * (1 - smoothstep(0.53, 0.56, p));
    floorMat.current?.color.copy(WHITE).multiplyScalar(white);
    wallMat.current?.color.copy(WALL).multiplyScalar(white);
    a.puzzle.pieceMat.color.copy(PIECE).multiplyScalar(white);
    a.puzzle.update(range(p, 0.06, 0.82));

    const n = nearRef.current;
    if (n) {
      n.setTint(TINT.setScalar(white));
      const arm = n.part('forearmL');
      if (arm) arm.rotation.z = Math.sin(t * 1.6) * 0.07;
      const head = n.part('head');
      if (head) head.rotation.z = -0.06 + Math.sin(t * 0.5) * 0.02;
    }

    const m = melloRef.current;
    if (m) {
      // He snaps a square off in his beat and it is gone a moment later.
      const snap = smoothstep(0.455, 0.47, p);
      const piece = m.part('piece');
      if (piece) {
        piece.visible = p < 0.5;
        piece.rotation.z = -0.55 * snap;
        piece.position.x = 0.012 * snap;
      }
      const arm = m.part('armR');
      if (arm)
        arm.rotation.z = Math.sin(t * 0.9) * 0.02 - 0.05 * snap * (1 - smoothstep(0.5, 0.53, p));
      const head = m.part('head');
      if (head) head.rotation.z = 0.04 + Math.sin(t * 0.7 + 1) * 0.015;
      // Then he walks out of the light.
      const leave = smoothstep(0.575, 0.665, p);
      m.setTint(TINT.setScalar(1 - leave));
      m.setRim(TINT.copy(RIM).lerp(BLACK, leave));
      const g = melloGroup.current;
      if (g) {
        g.position.set(
          THREE.MathUtils.lerp(MELLO_AT[0], MELLO_GONE[0], leave),
          0,
          THREE.MathUtils.lerp(MELLO_AT[2], MELLO_GONE[2], leave),
        );
        g.visible = leave < 0.99;
      }
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={camRef}
        makeDefault
        fov={38}
        near={0.05}
        far={80}
        position={[2, 1.5, 7.4]}
      />
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 9, 22]} />

      {/* The white side: a pale floor and a single wall, nothing else. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.25, 0, 0.3]}>
        <planeGeometry args={[2.5, 3]} />
        <meshBasicMaterial ref={floorMat} color={WHITE} />
      </mesh>
      <mesh position={[1.25, 1.2, -1.2]}>
        <planeGeometry args={[2.5, 2.4]} />
        <meshBasicMaterial ref={wallMat} color={WALL} />
      </mesh>
      {/* Soft contact shadows on the white floor. */}
      {SHADOWS.map(([x, z, s, o], i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.001, z]}>
          <planeGeometry args={[s, s * 0.6]} />
          <meshBasicMaterial
            map={a.glow}
            transparent
            depthWrite={false}
            color="#000000"
            opacity={o}
          />
        </mesh>
      ))}
      <group position={PUZZLE_AT as unknown as [number, number, number]}>
        <primitive object={a.puzzle.cuts} />
        <primitive object={a.puzzle.pieces} />
      </group>
      <group position={NEAR_AT as unknown as [number, number, number]}>
        <InkFigure ref={nearRef} parts={near} inkColor="#2e2c28" rimColor="#ffffff" />
      </group>

      {/* The seam between the two halves. */}
      <mesh position={[0, 1.2, -1.19]}>
        <planeGeometry args={[0.012, 2.4]} />
        <meshBasicMaterial color={[1.6, 1.55, 1.5]} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0.3]}>
        <planeGeometry args={[0.012, 3]} />
        <meshBasicMaterial color={[1.6, 1.55, 1.5]} toneMapped={false} />
      </mesh>

      {/* The black side: gloss floor, one hard light. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6, 0, 0]}>
        <planeGeometry args={[12, 30]} />
        <meshStandardMaterial color="#0b0b0c" roughness={0.25} metalness={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.3, 0.002, -0.25]}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshBasicMaterial
          map={a.glow}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#cfc6b6"
        />
      </mesh>
      <spotLight
        position={[-2.4, 4.2, 1.2]}
        angle={0.35}
        penumbra={0.2}
        intensity={45}
        distance={9}
        color="#fff1dc"
      />
      <group ref={melloGroup} position={MELLO_AT as unknown as [number, number, number]}>
        <InkFigure ref={melloRef} parts={mello} rimColor="#f1ece2" rimOffset={[0.008, 0.006]} />
      </group>
    </>
  );
}
