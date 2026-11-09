import { useMemo, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import type * as THREE from 'three';
import { InkFigure, type InkFigureHandle } from '@/characters/shared/InkFigure';
import { personParts } from '@/characters/shared/people';
import { useRuntime } from '@/state/runtime';
import { keyframes, smoothstep } from '@/utils/math';
import { Rain } from '../prologue/Rain';
import { Motes } from '../props/Motes';
import { RainWindow } from '../props/RainWindow';
import { QUALITY_PROFILES } from '../shared/quality';
import { useSceneFrame } from '../shared/sceneFrame';

/**
 * Chapter 10 — The End of L. Restraint: rain on a grey rooftop, a lone figure
 * at the edge (the anime-only scene), pale dust drifting away, then absence.
 */
type V3 = readonly [number, number, number];
const CAM_POS: ReadonlyArray<{ t: number; v: V3 }> = [
  { t: 0, v: [-6, 2.2, 9] },
  { t: 0.38, v: [-2.6, 1.7, 6.2] },
  { t: 0.62, v: [-1.8, 1.6, 5.2] },
  { t: 1, v: [-1.4, 1.7, 4.6] },
];
const CAM_TGT: ReadonlyArray<{ t: number; v: V3 }> = [
  { t: 0, v: [0, 1.4, 0] },
  { t: 0.38, v: [0.6, 1.3, 0] },
  { t: 0.62, v: [0.4, 1.3, 0] },
  { t: 1, v: [0.4, 1.2, 0] },
];
const DUST_BOX: [number, number, number] = [3, 4, 3];
const DUST_POS: [number, number, number] = [-1.5, 2.5, -1];
const DUST_DRIFT: [number, number, number] = [0.05, 0.25, 0];

export default function RainScene() {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const figRef = useRef<InkFigureHandle>(null);
  const figGroup = useRef<THREE.Group>(null);
  const dustGroup = useRef<THREE.Group>(null);
  const rain = useRef(1);
  const size = useThree((s) => s.size);
  const tier = useRuntime((s) => s.tier);
  const profile = QUALITY_PROFILES[tier];
  const parts = useMemo(
    () => personParts({ hair: 'spiky', height: 1.79, build: 0.85, clothes: '#c9cbcc', hairColor: '#060607', seed: 9 }),
    [],
  );

  useSceneFrame((f) => {
    const p = f.reduced ? Math.round(f.progress * 4) / 4 : f.progress;
    const cam = camRef.current;
    if (!cam) return;
    const pos = keyframes(CAM_POS, p);
    const tgt = keyframes(CAM_TGT, p);
    const back = size.width / size.height < 0.9 ? 1.5 : 1;
    cam.position.set(tgt[0] + (pos[0] - tgt[0]) * back, pos[1], tgt[2] + (pos[2] - tgt[2]) * back);
    cam.lookAt(tgt[0], tgt[1], tgt[2]);
    // L stands at the edge through the rooftop beat; afterwards the place is empty.
    if (figGroup.current) figGroup.current.visible = p >= 0.3 && p < 0.67;
    const fig = figRef.current;
    if (fig) {
      const t = f.reduced ? 0 : f.time;
      const head = fig.part('head');
      if (head) head.rotation.z = -0.08 + Math.sin(t * 0.25) * 0.02; // listening, head tilted up
    }
    if (dustGroup.current) {
      const k = smoothstep(0.52, 0.58, p) * (1 - smoothstep(0.7, 0.8, p));
      dustGroup.current.visible = k > 0.01;
      dustGroup.current.scale.setScalar(0.8 + k * 0.2);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={camRef} makeDefault fov={34} near={0.05} far={200} position={[-6, 2, 9]} />
      <color attach="background" args={['#14161a']} />
      <fog attach="fog" args={['#191b20', 6, 40]} />
      <hemisphereLight args={['#8a93a3', '#202226', 0.9]} />
      <directionalLight position={[-4, 8, 6]} intensity={0.6} color="#aeb7c6" />

      {/* Wet concrete roof */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#3a3d42" roughness={0.25} metalness={0.1} />
      </mesh>
      {/* Railing at the edge */}
      <group position={[0, 0, -2.2]}>
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[16, 0.05, 0.05]} />
          <meshStandardMaterial color="#1b1c1f" metalness={0.6} roughness={0.4} />
        </mesh>
        {Array.from({ length: 17 }, (_, i) => (
          <mesh key={i} position={[-8 + i, 0.52, 0]}>
            <boxGeometry args={[0.04, 1.05, 0.04]} />
            <meshStandardMaterial color="#1b1c1f" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>
      {/* Water tank silhouette */}
      <mesh position={[-5.5, 2.2, -4]}>
        <cylinderGeometry args={[1.1, 1.1, 2.4, 20]} />
        <meshStandardMaterial color="#25272b" roughness={0.8} />
      </mesh>
      {/* The city beyond, out of focus in the rain */}
      <RainWindow position={[0, 6, -30]} width={90} height={24} intensity={1.0} rain={0.4} />

      <group ref={figGroup} position={[0.6, 0, -1.4]} rotation={[0, 0.25, 0]}>
        <InkFigure ref={figRef} parts={parts} rimColor="#9aa5b8" rimOffset={[-0.006, 0.008]} />
      </group>
      <group ref={dustGroup}>
        <Motes count={Math.round(260 * Math.max(0.4, profile.particles))} box={DUST_BOX} position={DUST_POS} drift={DUST_DRIFT} color="#e8e3d8" size={14} opacity={0.55} seed={21} />
      </group>
      <Rain count={Math.round(1600 * profile.particles)} opacityRef={rain} />
    </>
  );
}
