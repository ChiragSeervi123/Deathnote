import { useMemo, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { InkFigure, type InkFigureHandle } from '@/characters/shared/InkFigure';
import { personParts } from '@/characters/shared/people';
import { keyframes, smoothstep } from '@/utils/math';
import { NotebookModel } from '../props/notebook/NotebookModel';
import { createNotebookState } from '../props/notebook/notebookState';
import { RainWindow } from '../props/RainWindow';
import { useSceneFrame } from '../shared/sceneFrame';

/**
 * Chapter 09 — The Yotsuba Arc. A glass boardroom above the night city: eight
 * executives, one red chair, a chain reflected in the glass, the notebook seized.
 */
type V3 = readonly [number, number, number];

const SEATS: ReadonlyArray<{ x: number; z: number }> = [
  { x: -1.0, z: -1.2 },
  { x: -1.0, z: -2.4 },
  { x: -1.0, z: -3.6 },
  { x: -1.0, z: -4.8 },
  { x: 1.0, z: -1.2 },
  { x: 1.0, z: -2.4 },
  { x: 1.0, z: -3.6 },
  { x: 1.0, z: -4.8 },
];
const HIGUCHI = 1;

const CAM_POS: ReadonlyArray<{ t: number; v: V3 }> = [
  { t: 0, v: [0.6, 1.7, 4.5] },
  { t: 0.24, v: [1.4, 1.6, 2.6] },
  { t: 0.3, v: [0, 2.6, 3.4] },
  { t: 0.52, v: [0, 2.3, 2.6] },
  { t: 0.58, v: [0.9, 1.45, 0.3] },
  { t: 0.67, v: [0.7, 1.4, 0.0] },
  { t: 0.72, v: [-0.5, 1.6, 0.6] },
  { t: 0.84, v: [-0.3, 1.45, 0.3] },
  { t: 1, v: [0, 2.8, 4.4] },
];
const CAM_TGT: ReadonlyArray<{ t: number; v: V3 }> = [
  { t: 0, v: [3.2, 1.3, -2.8] },
  { t: 0.24, v: [3.6, 1.25, -2.8] },
  { t: 0.3, v: [0, 0.8, -3.2] },
  { t: 0.52, v: [0, 0.8, -3.4] },
  { t: 0.58, v: [-1.5, 1.15, -2.4] },
  { t: 0.67, v: [-1.55, 1.2, -2.4] },
  { t: 0.72, v: [0.95, 0.8, -1.1] },
  { t: 0.84, v: [1.0, 0.8, -1.1] },
  { t: 1, v: [0, 0.9, -3.2] },
];

const RED = new THREE.Color('#ff2a33');
const GOLD = new THREE.Color('#c8955a');

export default function YotsubaScene() {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const execRefs = useRef<(InkFigureHandle | null)[]>([]);
  const seatGroups = useRef<(THREE.Group | null)[]>([]);
  const v = useMemo(() => new THREE.Vector3(), []);
  const redLight = useRef<THREE.PointLight>(null);
  const size = useThree((s) => s.size);
  const nb = useMemo(() => createNotebookState(1), []);
  const execParts = useMemo(
    () =>
      SEATS.map((_, i) =>
        personParts({
          sitting: true,
          hair: i % 3 === 0 ? 'bald' : 'neat',
          build: 1 + (i % 2) * 0.12,
          coat: true,
          clothes: '#15171c',
          face: '#7d746a',
          hairColor: '#0b0a09',
          eyes: i === HIGUCHI ? '#ff2a33' : undefined,
          seed: i + 4,
        }),
      ),
    [],
  );
  const pair = useMemo(
    () => [
      personParts({ hair: 'neat', height: 1.79, hairColor: '#4a3020', seed: 2 }),
      personParts({ hair: 'spiky', height: 1.79, build: 0.85, seed: 7 }),
    ],
    [],
  );

  useSceneFrame((f) => {
    const p = f.reduced ? Math.round(f.progress * 5) / 5 : f.progress;
    const cam = camRef.current;
    if (!cam) return;
    const pos = keyframes(CAM_POS, p);
    const tgt = keyframes(CAM_TGT, p);
    const back = size.width / size.height < 0.9 ? 1.5 : 1;
    cam.position.set(
      tgt[0] + (pos[0] - tgt[0]) * back + f.pointer.x * 0.1,
      pos[1] + f.pointer.y * 0.05,
      tgt[2] + (pos[2] - tgt[2]) * back,
    );
    cam.lookAt(tgt[0], tgt[1], tgt[2]);
    const red = smoothstep(0.4, 0.5, p) * (1 - smoothstep(0.86, 0.95, p));
    const eyes = smoothstep(0.56, 0.6, p) * (1 - smoothstep(0.7, 0.74, p));
    execRefs.current.forEach((h, i) => {
      if (!h) return;
      h.setRim(i === HIGUCHI ? GOLD.clone().lerp(RED, red) : GOLD);
      if (i === HIGUCHI) h.setGlow(eyes);
    });
    if (redLight.current) redLight.current.intensity = 6 * red;
    // Flat figures always turn toward the lens (yaw only).
    for (const g of seatGroups.current) {
      if (!g) continue;
      g.getWorldPosition(v);
      g.rotation.y = Math.atan2(cam.position.x - v.x, cam.position.z - v.z);
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={camRef}
        makeDefault
        fov={36}
        near={0.05}
        far={120}
        position={[0, 2, 4]}
      />
      <color attach="background" args={['#07060a']} />
      <fog attach="fog" args={['#0b0907', 6, 24]} />
      <hemisphereLight args={['#5a4a35', '#0c0a08', 0.7]} />
      <pointLight position={[0, 2.6, -2.5]} color="#ffcf96" intensity={8} distance={9} />
      <pointLight
        ref={redLight}
        position={[-1.2, 2.2, -2.4]}
        color="#ff1f28"
        intensity={0}
        distance={4}
      />

      {/* Glass wall with the city behind */}
      <RainWindow position={[0, 3, -8]} width={30} height={12} intensity={1.4} rain={0} />
      <RainWindow
        position={[5.5, 3, -3]}
        width={10}
        height={8}
        intensity={1.0}
        rain={0}
        rotation={[0, -Math.PI / 2, 0]}
      />

      {/* Table */}
      <mesh position={[0, 0.74, -3]}>
        <boxGeometry args={[1.5, 0.06, 6.4]} />
        <meshStandardMaterial color="#1a120c" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0d0b09" roughness={0.6} />
      </mesh>

      {SEATS.map((s, i) => (
        <group
          key={i}
          ref={(g) => void (seatGroups.current[i] = g)}
          position={[s.x * 1.05, 0, s.z]}
        >
          <InkFigure
            ref={(h) => void (execRefs.current[i] = h)}
            parts={execParts[i]!}
            rimColor="#c8955a"
          />
        </group>
      ))}

      {/* The seized notebook */}
      <group position={[0.85, 0.77, -1.1]} rotation={[0, -0.4, 0]} scale={0.18}>
        <NotebookModel state={nb} textureSize={1024} castShadow={false} />
      </group>

      {/* Two figures at the glass, joined by a chain */}
      <group position={[3.1, 0, -2.9]} rotation={[0, -0.5, 0]}>
        <group position={[-0.32, 0, 0]}>
          <InkFigure parts={pair[0]!} rimColor="#c8955a" />
        </group>
        <group position={[0.32, 0, 0]}>
          <InkFigure parts={pair[1]!} rimColor="#c8955a" />
        </group>
        <mesh position={[0, 0.86, 0.02]}>
          <boxGeometry args={[0.1, 0.012, 0.012]} />
          <meshStandardMaterial color="#9d968a" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>
    </>
  );
}
