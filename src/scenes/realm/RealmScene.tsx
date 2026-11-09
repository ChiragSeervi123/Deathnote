import { use, useEffect, useMemo, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ensureCanvasFonts } from '@/app/fonts';
import { remParts } from '@/characters/rem/rem';
import { RYUK_FULL, ryukFullParts } from '@/characters/ryuk-full/ryukFull';
import { InkFigure, type InkFigureHandle } from '@/characters/shared/InkFigure';
import { useRuntime } from '@/state/runtime';
import { clamp, keyframes, smoothstep } from '@/utils/math';
import { RealmTerrain } from '../prologue/RealmTerrain';
import { realmHeight } from '../prologue/terrain';
import { SkyDome } from '../prologue/SkyDome';
import { WORLD } from '../prologue/world';
import { Apple } from '../props/Apple';
import { Motes } from '../props/Motes';
import { QUALITY_PROFILES } from '../shared/quality';
import { useSceneFrame } from '../shared/sceneFrame';
import { createVisionTexture } from './visionTexture';

/**
 * Chapter 02 — The Shinigami Realm. Ryuk's full reveal (low angle, scale),
 * Rem's solemn stillness, and a look through the hole with the Eyes.
 */

type V3 = readonly [number, number, number];
const R = WORLD.realmY;
const RYUK_XZ = [7.4, -7.6] as const;
const REM_XZ = [-8.0, -8.6] as const;
const RYUK_AT: V3 = [RYUK_XZ[0], R + realmHeight(RYUK_XZ[0], RYUK_XZ[1]), RYUK_XZ[1]];
const REM_AT: V3 = [REM_XZ[0], R + realmHeight(REM_XZ[0], REM_XZ[1]), REM_XZ[1]];

const RY = RYUK_AT[1];
const RM = REM_AT[1];

const CAM_POS: ReadonlyArray<{ t: number; v: V3 }> = [
  { t: 0.0, v: [-16, R + 3.2, 24] },
  { t: 0.12, v: [-12, R + 3.6, 15] },
  { t: 0.27, v: [-7.5, R + 3.4, 7.5] },
  { t: 0.31, v: [4.6, RY + 0.75, -2.2] },
  { t: 0.43, v: [5.4, RY + 0.68, -3.2] },
  { t: 0.47, v: [-4.6, RM + 1.2, -2.6] },
  { t: 0.58, v: [-5.4, RM + 1.3, -3.6] },
  { t: 0.62, v: [-3.1, R + 7.4, 3.9] },
  { t: 0.74, v: [-2.4, R + 6.6, 3.0] },
  { t: 0.78, v: [8.55, RY + 2.25, -5.4] },
  { t: 1.0, v: [8.4, RY + 2.28, -5.7] },
];
const CAM_TGT: ReadonlyArray<{ t: number; v: V3 }> = [
  { t: 0.0, v: [4, R + 6, -60] },
  { t: 0.12, v: [2, R + 3, -30] },
  { t: 0.27, v: [-0.6, R + 0.2, -1] },
  { t: 0.31, v: [5.5, RY + 1.95, -7.6] },
  { t: 0.43, v: [5.75, RY + 1.9, -7.6] },
  { t: 0.47, v: [-6.4, RM + 1.95, -8.6] },
  { t: 0.58, v: [-6.65, RM + 2.05, -8.6] },
  { t: 0.62, v: [1.1, R - 6, -0.2] },
  { t: 0.74, v: [1.3, R - 6, -0.2] },
  { t: 0.78, v: [8.05, RY + 2.3, -7.6] },
  { t: 1.0, v: [8.0, RY + 2.33, -7.6] },
];
const ANCHORS = [0.05, 0.2, 0.37, 0.52, 0.68, 0.85];

const ASH_BOX: [number, number, number] = [40, 14, 40];
const ASH_POS: [number, number, number] = [0, R + 4, -2];
const ASH_DRIFT: [number, number, number] = [0.3, -0.1, 0.06];
const FOG = new THREE.Color('#1d1c1a');

let fontsPromise: Promise<void> | null = null;

export default function RealmScene() {
  use((fontsPromise ??= ensureCanvasFonts()));
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const ryukRef = useRef<InkFigureHandle>(null);
  const remRef = useRef<InkFigureHandle>(null);
  const ryukGroup = useRef<THREE.Group>(null);
  const remGroup = useRef<THREE.Group>(null);
  const appleRef = useRef<THREE.Group>(null);
  const blend = useRef(0);
  const size = useThree((s) => s.size);
  const tier = useRuntime((s) => s.tier);
  const profile = QUALITY_PROFILES[tier];

  const ryukParts = useMemo(ryukFullParts, []);
  const remParts_ = useMemo(remParts, []);
  const vision = useMemo(() => {
    const map = createVisionTexture(profile.textureSize >= 1536 ? 1024 : 768);
    const geo = new THREE.CircleGeometry(WORLD.holeRadius + 0.2, 48);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({ map, fog: false, toneMapped: true });
    return { map, geo, mat };
  }, [profile.textureSize]);
  useEffect(
    () => () => {
      vision.map.dispose();
      vision.geo.dispose();
      vision.mat.dispose();
    },
    [vision],
  );
  const tmp = useMemo(() => ({ v: new THREE.Vector3(), t: new THREE.Vector3() }), []);
  const halo = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,255,255,0.55)');
    g.addColorStop(0.45, 'rgba(255,255,255,0.12)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => () => halo.dispose(), [halo]);

  useSceneFrame((f) => {
    const p = f.reduced
      ? ANCHORS.reduce((a, b) => (f.progress >= b - 0.08 ? b : a), ANCHORS[0]!)
      : f.progress;
    const cam = camRef.current;
    if (!cam) return;
    const portrait = size.width / size.height < 0.9;
    const pos = keyframes(CAM_POS, p);
    const tgt = keyframes(CAM_TGT, p);
    const k = portrait ? 1.35 : 1;
    cam.position.set(
      tgt[0] + (pos[0] - tgt[0]) * k + f.pointer.x * 0.25,
      tgt[1] + (pos[1] - tgt[1]) * k + f.pointer.y * 0.12 + (1 - f.enter) * 1.5,
      tgt[2] + (pos[2] - tgt[2]) * k,
    );
    cam.lookAt(tgt[0], tgt[1] - (portrait ? 0.4 : 0), tgt[2]);

    const t = f.reduced ? 0 : f.time;
    // Ryuk: amused idle — breath, head cocked, wings stirring, apple raised.
    const ryuk = ryukRef.current;
    if (ryuk) {
      ryuk.part('head')?.scale.setScalar(1.32);
      const reveal = smoothstep(0.27, 0.36, p);
      ryuk.part('head')?.rotation.set(0, 0, -0.12 + Math.sin(t * 0.7) * 0.05 - reveal * 0.06);
      ryuk.part('armR')?.rotation.set(0, 0, Math.sin(t * 1.1) * 0.04);
      ryuk.part('armL')?.rotation.set(0, 0, -0.04 + Math.sin(t * 0.8 + 1) * 0.03);
      const wings = ryuk.part('wings');
      if (wings) wings.scale.set(1 + Math.sin(t * 0.9) * 0.025 + reveal * 0.04, 1, 1);
      const body = ryuk.part('body');
      if (body) body.scale.y = 1 + Math.sin(t * 1.3) * 0.008;
      // Eyes burn brighter for the Eyes beats.
      ryuk.setGlow(0.75 + 0.25 * smoothstep(0.3, 0.38, p) + 0.5 * smoothstep(0.76, 0.84, p));
      const armR = ryuk.part('armR');
      if (armR && appleRef.current) {
        tmp.v.set(
          RYUK_FULL.apple[0] - RYUK_FULL.shoulderR[0],
          RYUK_FULL.apple[1] - RYUK_FULL.shoulderR[1] + 0.02,
          0.07,
        );
        armR.localToWorld(tmp.v);
        appleRef.current.position.copy(tmp.v);
        appleRef.current.rotation.y = t * 0.2;
      }
    }
    const rem = remRef.current;
    if (rem) {
      rem.part('head')?.rotation.set(0, 0, Math.sin(t * 0.35) * 0.015);
      const mane = rem.part('mane');
      if (mane) mane.rotation.z = Math.sin(t * 0.5) * 0.02;
      rem.setGlow(0.6 + 0.4 * smoothstep(0.44, 0.52, p));
    }
    // Figures turn (yaw only) toward the lens so the flat art never shows its edge.
    for (const g of [ryukGroup.current, remGroup.current]) {
      if (!g) continue;
      tmp.t.copy(cam.position).sub(g.position);
      g.rotation.y = clamp(Math.atan2(tmp.t.x, tmp.t.z), -0.55, 0.55);
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={camRef}
        makeDefault
        fov={36}
        near={0.08}
        far={2600}
        position={[-16, R + 3, 24]}
      />
      <fogExp2 attach="fog" args={[FOG.getHex(), 0.012]} />
      <SkyDome blendRef={blend} />
      <directionalLight position={[18, R + 10, -100]} color="#c2bcae" intensity={1.5} />
      <hemisphereLight args={['#45433e', '#121110', 0.7]} />

      <RealmTerrain density={profile.particles >= 0.6 ? 1 : 0.55} />
      <mesh
        geometry={vision.geo}
        material={vision.mat}
        position={[0, R - 6, 0]}
        rotation={[0, -0.77, 0]}
      />

      <group ref={ryukGroup} position={RYUK_AT as unknown as [number, number, number]}>
        <mesh position={[0, 1.7, -0.25]} renderOrder={-1}>
          <planeGeometry args={[4.6, 4.6]} />
          <meshBasicMaterial
            map={halo}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            color="#b9b2a2"
            opacity={0.55}
            toneMapped={false}
          />
        </mesh>
        <InkFigure ref={ryukRef} parts={ryukParts} rimColor="#8d8a84" rimOffset={[-0.007, 0.009]} />
      </group>
      <group ref={appleRef} scale={0.13}>
        <Apple />
      </group>
      <group ref={remGroup} position={REM_AT as unknown as [number, number, number]}>
        <mesh position={[0, 1.9, -0.25]} renderOrder={-1}>
          <planeGeometry args={[4.6, 4.6]} />
          <meshBasicMaterial
            map={halo}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            color="#d6dbe3"
            opacity={0.45}
            toneMapped={false}
          />
        </mesh>
        <InkFigure
          ref={remRef}
          parts={remParts_}
          inkColor="#1b1a18"
          rimColor="#e8e3d8"
          rimOffset={[-0.006, 0.008]}
        />
      </group>

      {profile.particles > 0.2 ? (
        <Motes
          count={Math.round(500 * profile.particles)}
          box={ASH_BOX}
          position={ASH_POS}
          drift={ASH_DRIFT}
          color="#b8b2a4"
          size={26}
          opacity={0.38}
          seed={4}
        />
      ) : null}
    </>
  );
}
