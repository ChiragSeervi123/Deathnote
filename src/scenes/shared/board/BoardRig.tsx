import { useEffect, useMemo, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRuntime } from '@/state/runtime';
import { keyframes } from '@/utils/math';
import { QUALITY_PROFILES } from '../quality';
import { useSceneFrame } from '../sceneFrame';
import { shotTracks, type Shot } from './shots';

/** Camera + travelling torch-light for board chapters. */
export function BoardRig({
  shots,
  light = '#ffe2b8',
  ambient = 0.35,
  background = '#050403',
}: {
  shots: readonly Shot[];
  light?: string;
  ambient?: number;
  background?: string;
}) {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const size = useThree((s) => s.size);
  const tier = useRuntime((s) => s.tier);
  const profile = QUALITY_PROFILES[tier];
  const target = useMemo(() => new THREE.Object3D(), []);
  const tracks = useMemo(() => shotTracks(shots), [shots]);
  useEffect(() => {
    if (spotRef.current) spotRef.current.target = target;
  }, [target]);

  useSceneFrame((f) => {
    const p = f.reduced ? shots.reduce((a, s) => (f.progress >= s.t - 0.05 ? s.t : a), 0) : f.progress;
    const cam = camRef.current;
    if (!cam) return;
    const portrait = size.width / size.height < 0.9;
    const pos = keyframes(tracks.pos, p);
    const tgt = keyframes(tracks.tgt, p);
    cam.position.set(pos[0] + f.pointer.x * 0.15, pos[1] + f.pointer.y * 0.1, pos[2] * (portrait ? 1.7 : 1));
    cam.lookAt(tgt[0], tgt[1] - (portrait ? 0.4 : 0), tgt[2]);
    target.position.set(tgt[0] - 0.4, tgt[1], tgt[2]);
    target.updateMatrixWorld();
    spotRef.current?.position.set(tgt[0] - 0.6, tgt[1] + 2.4, tgt[2] + 3.2);
  });

  return (
    <>
      <PerspectiveCamera ref={camRef} makeDefault fov={36} near={0.05} far={60} position={[0, 0.3, 8.5]} />
      <color attach="background" args={[background]} />
      <fog attach="fog" args={[background, 6, 16]} />
      <ambientLight intensity={ambient} color="#8090b0" />
      <spotLight
        ref={spotRef}
        color={light}
        intensity={42}
        angle={0.55}
        penumbra={0.85}
        decay={2}
        castShadow={profile.shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      />
    </>
  );
}
