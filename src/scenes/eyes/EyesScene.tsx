import { use, useEffect, useMemo, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ensureCanvasFonts } from '@/app/fonts';
import { useRuntime } from '@/state/runtime';
import { glowTexture } from '../shared/canvasTextures';
import { QUALITY_PROFILES } from '../shared/quality';
import { useSceneFrame } from '../shared/sceneFrame';
import { buildCrowd } from '../misa/crowd';
import { labelAtlas } from '../misa/stageAssets';

/**
 * Archive II — The Eyes & the Gods of Death. Ambient backdrop for a reading
 * page: a faceless crowd seen through red-tinted eyes, a name and a lifespan
 * above each head, one blank. The camera drifts slowly; nothing demands
 * attention away from the text.
 */
const BG = '#0a0405';
const FOG: readonly [number, number] = [6, 22];
const OWNER = [1.45, 7.9] as const;

let fontsPromise: Promise<void> | null = null;

export default function EyesScene() {
  use((fontsPromise ??= ensureCanvasFonts()));
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const size = useThree((s) => s.size);
  const tier = useRuntime((s) => s.tier);
  const profile = QUALITY_PROFILES[tier];
  const a = useMemo(() => {
    const atlas = labelAtlas(null);
    const glow = glowTexture();
    const crowd = buildCrowd(
      Math.round(140 * Math.max(0.4, profile.particles)),
      OWNER,
      1.75,
      atlas,
      new THREE.Color(BG),
      FOG,
    );
    crowd.labelMat.uniforms.uOpacity!.value = 0.75;
    return { atlas, glow, crowd };
  }, [profile.particles]);
  useEffect(
    () => () => {
      a.atlas.dispose();
      a.glow.dispose();
      a.crowd.dispose();
    },
    [a],
  );

  useSceneFrame((f) => {
    const cam = camRef.current;
    if (!cam) return;
    const t = f.reduced ? 0 : f.time;
    // A slow lateral drift with the page, plus a breath of idle sway.
    const x = -1.4 + f.progress * 2.8 + Math.sin(t * 0.07) * 0.3;
    const back = size.width / size.height < 0.9 ? 1.4 : 1;
    cam.position.set(x + f.pointer.x * 0.1, 1.55 + f.pointer.y * 0.05, 0.4 - (back - 1) * 3);
    cam.lookAt(x * 0.6, 1.75, 8);
  });

  return (
    <>
      <PerspectiveCamera
        ref={camRef}
        makeDefault
        fov={46}
        near={0.05}
        far={60}
        position={[0, 1.55, 0.4]}
      />
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, FOG[0], FOG[1]]} />
      <mesh position={[0, 3, 18]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[44, 14]} />
        <meshBasicMaterial
          map={a.glow}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#5a141a"
          fog={false}
        />
      </mesh>
      <primitive object={a.crowd.crowd} />
      <primitive object={a.crowd.labels} />
    </>
  );
}
