import { useMemo, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import type * as THREE from 'three';
import { useRuntime } from '@/state/runtime';
import { smoothstep } from '@/utils/math';
import { Motes } from '../props/Motes';
import { NotebookModel } from '../props/notebook/NotebookModel';
import { createNotebookState } from '../props/notebook/notebookState';
import { QUALITY_PROFILES } from '../shared/quality';
import { useSceneFrame } from '../shared/sceneFrame';

/**
 * Epilogue — Justice, Power & Legacy. The notebook closes slowly on a dark
 * desk as the page is read; ash settles; one loose page keeps its light.
 */
const ASH_BOX: [number, number, number] = [3, 2.4, 2];
const ASH_POS: [number, number, number] = [0, 1.3, -0.2];
const ASH_DRIFT: [number, number, number] = [0.004, -0.03, 0];

export default function LegacyScene() {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const pageMat = useRef<THREE.MeshBasicMaterial>(null);
  const size = useThree((s) => s.size);
  const tier = useRuntime((s) => s.tier);
  const profile = QUALITY_PROFILES[tier];
  const nb = useMemo(() => createNotebookState(2), []);

  useSceneFrame((f) => {
    const cam = camRef.current;
    if (!cam) return;
    const p = f.progress;
    const t = f.reduced ? 0 : f.time;
    // Open at the top of the page, shut by the time the reader reaches the end.
    nb.coverOpen = 1 - smoothstep(0.1, 0.85, p);
    nb.pages[0]!.write = 1;
    const back = size.width / size.height < 0.9 ? 1.5 : 1;
    const d = (1.55 - p * 0.35) * back;
    cam.position.set(0.15 + Math.sin(t * 0.06) * 0.05 + f.pointer.x * 0.04, 0.55 + d * 0.62, d);
    cam.lookAt(0.05, 0.02, -0.05);
    if (pageMat.current) {
      const k = 0.85 + 0.15 * Math.sin(t * 0.8);
      pageMat.current.color.setRGB(1.25 * k, 1.18 * k, 1.05 * k);
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={camRef}
        makeDefault
        fov={34}
        near={0.02}
        far={30}
        position={[0.15, 1.5, 1.55]}
      />
      <color attach="background" args={['#050404']} />
      <fog attach="fog" args={['#050404', 2, 7]} />
      <hemisphereLight args={['#5a5048', '#080606', 0.3]} />
      <pointLight position={[0.3, 1.0, 0.6]} intensity={2.2} distance={3} color="#f2dcc0" />
      {/* Desk. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color="#120d0a" roughness={0.45} metalness={0.1} />
      </mesh>
      <group position={[-0.08, 0.002, -0.05]} rotation={[0, -0.18, 0]} scale={0.42}>
        <NotebookModel state={nb} textureSize={1024} castShadow={false} />
      </group>
      {/* The single page that keeps its light. */}
      <mesh position={[0.58, 0.003, 0.22]} rotation={[-Math.PI / 2, 0, 0.32]}>
        <planeGeometry args={[0.15, 0.2]} />
        <meshBasicMaterial ref={pageMat} color={[1.2, 1.12, 1]} toneMapped={false} />
      </mesh>
      {profile.particles > 0.2 ? (
        <Motes
          count={Math.round(220 * profile.particles)}
          box={ASH_BOX}
          position={ASH_POS}
          drift={ASH_DRIFT}
          color="#b9b0a4"
          size={7}
          opacity={0.45}
          seed={33}
        />
      ) : null}
    </>
  );
}
