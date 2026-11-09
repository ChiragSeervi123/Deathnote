import { use, useEffect, useMemo, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ensureCanvasFonts } from '@/app/fonts';
import { lParts } from '@/characters/l/l';
import { InkFigure, type InkFigureHandle } from '@/characters/shared/InkFigure';
import { useRuntime } from '@/state/runtime';
import { keyframes, smoothstep } from '@/utils/math';
import { Motes } from '../props/Motes';
import { QUALITY_PROFILES } from '../shared/quality';
import { useSceneFrame } from '../shared/sceneFrame';
import { monitorTexture, type MonitorKind } from './monitorTextures';

/**
 * Chapter 05 — L. A dark room lit only by a wall of monitors; L crouched on
 * his chair, still, watching — his gaze follows the visitor.
 */

type V3 = readonly [number, number, number];
const SEAT_Y = 0.5;

const CAM_POS: ReadonlyArray<{ t: number; v: V3 }> = [
  { t: 0.0, v: [0.0, 1.25, 3.4] },
  { t: 0.3, v: [0.0, 1.15, 2.5] },
  { t: 0.62, v: [0.05, 1.2, 1.9] },
  { t: 0.88, v: [0.0, 1.3, 1.15] },
  { t: 1.0, v: [0.0, 1.32, 0.98] },
];
const CAM_TGT: ReadonlyArray<{ t: number; v: V3 }> = [
  { t: 0.0, v: [0.0, 1.35, -1.5] },
  { t: 0.3, v: [0.0, 1.05, 0] },
  { t: 0.62, v: [0.0, 1.1, 0] },
  { t: 0.88, v: [0.0, 1.27, 0] },
  { t: 1.0, v: [0.0, 1.29, 0] },
];

const MONITORS: ReadonlyArray<{ pos: V3; kind: MonitorKind; glow: number }> = (() => {
  const kinds: MonitorKind[] = ['data', 'map', 'feeds', 'data', 'feeds', 'map'];
  const out: { pos: V3; kind: MonitorKind; glow: number }[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = -2; col <= 2; col++) {
      const centre = col === 0 && row === 1;
      out.push({
        pos: [col * 0.72, 0.85 + row * 0.47, -1.6 - Math.abs(col) * 0.12],
        kind: centre ? 'letter' : kinds[(row * 5 + col + 2) % kinds.length]!,
        glow: centre ? 1.25 : Math.abs(col) === 2 ? 0.28 : 0.55,
      });
    }
  }
  return out;
})();

const MOTE_BOX: [number, number, number] = [3, 2, 2.5];
const MOTE_POS: [number, number, number] = [0, 1.2, -0.4];
const COLD = new THREE.Color(0.88, 0.93, 1.05);
const RIM = new THREE.Color('#4d6488');

let fontsPromise: Promise<void> | null = null;

export default function LRoomScene() {
  use((fontsPromise ??= ensureCanvasFonts()));
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const figRef = useRef<InkFigureHandle>(null);
  const size = useThree((s) => s.size);
  const tier = useRuntime((s) => s.tier);
  const profile = QUALITY_PROFILES[tier];
  const parts = useMemo(lParts, []);

  const screens = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.64, 0.4);
    const bezel = new THREE.BoxGeometry(0.68, 0.44, 0.03);
    const bezelMat = new THREE.MeshBasicMaterial({ color: '#07080a' });
    const items = MONITORS.map((m, i) => {
      const map = monitorTexture(m.kind, i + 3);
      const mat = new THREE.MeshBasicMaterial({ map, toneMapped: false });
      mat.color.setScalar(m.glow);
      return { m, map, mat };
    });
    // Sugar cubes stacked in an uneven tower on a side table.
    const cube = new THREE.BoxGeometry(0.022, 0.022, 0.022);
    const cubeMat = new THREE.MeshStandardMaterial({ color: '#f1efe9', roughness: 0.9 });
    const tower = new THREE.InstancedMesh(cube, cubeMat, 18);
    const m4 = new THREE.Matrix4();
    for (let i = 0; i < 18; i++) {
      const lvl = Math.floor(i / 2);
      m4.makeRotationY((i * 0.37) % 0.6);
      m4.setPosition(
        (i % 2) * 0.024 - 0.012 + Math.sin(i) * 0.003,
        0.011 + lvl * 0.023,
        Math.cos(i * 1.7) * 0.003,
      );
      tower.setMatrixAt(i, m4);
    }
    tower.instanceMatrix.needsUpdate = true;
    return { geo, bezel, bezelMat, items, cube, cubeMat, tower };
  }, []);
  useEffect(
    () => () => {
      screens.geo.dispose();
      screens.bezel.dispose();
      screens.bezelMat.dispose();
      screens.items.forEach((i) => {
        i.map.dispose();
        i.mat.dispose();
      });
      screens.cube.dispose();
      screens.cubeMat.dispose();
      screens.tower.dispose();
    },
    [screens],
  );

  useSceneFrame((f) => {
    const p = f.reduced ? Math.round(f.progress * 4) / 4 : f.progress;
    const cam = camRef.current;
    const fig = figRef.current;
    if (!cam || !fig) return;
    const portrait = size.width / size.height < 0.9;
    const pos = keyframes(CAM_POS, p);
    const tgt = keyframes(CAM_TGT, p);
    const back = portrait ? 1.6 : 1;
    cam.position.set(
      tgt[0] + (pos[0] - tgt[0]) * back + f.pointer.x * 0.04,
      tgt[1] + (pos[1] - tgt[1]) * back + f.pointer.y * 0.03,
      tgt[2] + (pos[2] - tgt[2]) * back,
    );
    cam.lookAt(tgt[0], tgt[1] + (portrait ? 0.15 : 0), tgt[2]);

    fig.setTint(COLD);
    fig.setRim(RIM);
    const t = f.reduced ? 0 : f.time;
    // Stillness: only the faintest breath, a slow blink, and the eyes.
    const body = fig.part('body');
    if (body) body.scale.y = 1 + Math.sin(t * 1.1) * 0.004;
    const head = fig.part('head');
    if (head) head.rotation.z = 0.04 + Math.sin(t * 0.3) * 0.01;
    const irises = fig.part('irises');
    if (irises) {
      // Gaze follows the visitor (pointer), clamped inside the eye.
      irises.position.x = f.pointer.x * 0.006;
      irises.position.y = f.pointer.y * 0.004;
      irises.visible = (t % 5.7) / 5.7 < 0.975;
    }
    const hand = fig.part('armHand');
    if (hand) hand.rotation.z = Math.sin(t * 0.7) * 0.012 + smoothstep(0.45, 0.55, p) * 0.02;
  });

  return (
    <>
      <PerspectiveCamera
        ref={camRef}
        makeDefault
        fov={34}
        near={0.05}
        far={40}
        position={[0, 1.2, 3.4]}
      />
      <color attach="background" args={['#030407']} />
      <fog attach="fog" args={['#04060a', 2.5, 8]} />
      <ambientLight intensity={0.15} color="#5d7ab0" />
      <pointLight position={[0, 1.4, -1.0]} color="#8fb3ff" intensity={4} distance={6} />

      {/* Monitor wall */}
      {screens.items.map(({ m, mat }, i) => (
        <group
          key={i}
          position={m.pos as unknown as [number, number, number]}
          rotation={[0, -m.pos[0] * 0.18, 0]}
        >
          <mesh geometry={screens.bezel} material={screens.bezelMat} position={[0, 0, -0.02]} />
          <mesh geometry={screens.geo} material={mat} />
        </group>
      ))}

      {/* Floor and chair */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#07080b" roughness={0.6} />
      </mesh>
      <group>
        <mesh position={[0, SEAT_Y - 0.04, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.07, 28]} />
          <meshStandardMaterial color="#0b0b0d" roughness={0.5} />
        </mesh>
        <mesh position={[0, SEAT_Y * 0.5, 0]}>
          <cylinderGeometry args={[0.025, 0.025, SEAT_Y - 0.06, 10]} />
          <meshStandardMaterial color="#1a1b1e" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.03, 5]} />
          <meshStandardMaterial color="#0d0d10" />
        </mesh>
        <mesh position={[0, SEAT_Y + 0.32, -0.22]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[0.46, 0.62, 0.06]} />
          <meshStandardMaterial color="#09090b" roughness={0.6} />
        </mesh>
      </group>

      {/* Side table with the sugar tower */}
      <group position={[0.62, 0, 0.15]}>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.38, 0.03, 0.38]} />
          <meshStandardMaterial color="#0e0f12" roughness={0.4} />
        </mesh>
        <primitive object={screens.tower} position={[0, 0.565, 0]} />
      </group>

      <group position={[0, SEAT_Y, 0.04]}>
        <InkFigure
          ref={figRef}
          parts={parts}
          rimColor="#9ec0ff"
          rimOffset={[-0.0035, 0.0045]}
          curveSegments={10}
        />
      </group>

      {profile.particles > 0.2 ? (
        <Motes
          count={Math.round(90 * profile.particles)}
          box={MOTE_BOX}
          position={MOTE_POS}
          color="#a9c4ff"
          size={4}
          opacity={0.22}
          seed={12}
        />
      ) : null}
    </>
  );
}
