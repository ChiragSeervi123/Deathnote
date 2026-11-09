import { use, useEffect, useMemo, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ensureCanvasFonts } from '@/app/fonts';
import { useRuntime } from '@/state/runtime';
import { keyframes } from '@/utils/math';
import { EvidenceBoard, type BoardCard, type BoardString } from '../shared/board/EvidenceBoard';
import { QUALITY_PROFILES } from '../shared/quality';
import { useSceneFrame } from '../shared/sceneFrame';

/**
 * Chapter 06 — First Battle. The case assembles itself on a board, beat by
 * beat, as a torch-light sweeps across it (facts: docs/content/story-reference.md).
 */

const CARDS: readonly BoardCard[] = [
  {
    id: 'tv',
    at: [-3.6, 1.0],
    width: 1.6,
    rot: -0.03,
    appear: 0.12,
    spec: { kind: 'tv', label: 'LIVE', caption: 'LIND L. TAILOR — “I AM L”' },
  },
  {
    id: 'map',
    at: [-1.8, -0.8],
    width: 1.7,
    rot: 0.02,
    appear: 0.23,
    spec: { kind: 'map', title: 'BROADCAST AREA', highlight: 'KANTO' },
  },
  {
    id: 'note',
    at: [-0.3, 1.3],
    width: 1.15,
    rot: -0.04,
    appear: 0.34,
    spec: { kind: 'note', text: 'Kira needs a face and a name.' },
  },
  {
    id: 'fbi',
    at: [1.1, -0.7],
    width: 1.15,
    rot: 0.03,
    appear: 0.45,
    spec: {
      kind: 'file',
      ref: 'FBI · 12 AGENTS',
      title: 'Sent to Japan',
      lines: ['Covert surveillance of', 'police families.', 'All twelve: deceased.'],
    },
  },
  {
    id: 'fbi2',
    at: [1.45, -0.55],
    width: 1.1,
    rot: -0.06,
    appear: 0.47,
    spec: {
      kind: 'file',
      ref: 'FILE 02',
      title: 'Agent',
      lines: ['Assignment: tail', 'a suspect.'],
      photo: true,
    },
  },
  {
    id: 'feeds',
    at: [2.5, 1.15],
    width: 1.6,
    rot: 0.02,
    appear: 0.56,
    spec: { kind: 'feeds', title: 'ROOM' },
  },
  {
    id: 'univ',
    at: [3.7, -0.9],
    width: 1.2,
    rot: -0.02,
    appear: 0.67,
    spec: {
      kind: 'file',
      ref: 'TO-OH UNIVERSITY',
      title: 'Entrance ceremony',
      lines: ['Two top-scoring', 'freshmen give', 'the address.'],
    },
  },
  {
    id: 'light',
    at: [-0.75, -2.0],
    width: 0.75,
    appear: 0.79,
    spec: { kind: 'portrait', name: 'Light Yagami', role: 'suspect', tone: 'dark' },
  },
  {
    id: 'l',
    at: [0.75, -2.0],
    width: 0.75,
    appear: 0.81,
    spec: { kind: 'portrait', name: 'L', role: 'investigator', tone: 'light' },
  },
];

const STRINGS: readonly BoardString[] = [
  { from: 'tv', to: 'map', appear: 0.25 },
  { from: 'map', to: 'note', appear: 0.36 },
  { from: 'note', to: 'fbi', appear: 0.47 },
  { from: 'fbi', to: 'feeds', appear: 0.58 },
  { from: 'feeds', to: 'univ', appear: 0.69 },
  { from: 'light', to: 'l', appear: 0.84 },
];

type V3 = readonly [number, number, number];

/** Frame each card opposite the side its text appears on. */
function focus(card: string, textSide: 1 | -1, dist = 3.9): { tgt: V3; pos: V3 } {
  const c = CARDS.find((x) => x.id === card)!;
  const tx = c.at[0] + textSide * 0.95;
  return { tgt: [tx, c.at[1], 0], pos: [tx - textSide * 0.25, c.at[1] + 0.15, dist] };
}

const SHOTS: ReadonlyArray<{ t: number; s: { tgt: V3; pos: V3 } }> = [
  { t: 0.0, s: { tgt: [0, 0, 0], pos: [0, 0.3, 8.5] } },
  { t: 0.15, s: focus('tv', 1) },
  { t: 0.27, s: focus('map', -1) },
  { t: 0.38, s: focus('note', 1) },
  { t: 0.49, s: focus('fbi', -1) },
  { t: 0.6, s: focus('feeds', 1) },
  { t: 0.72, s: focus('univ', -1) },
  { t: 0.86, s: { tgt: [-0.9, -1.0, 0], pos: [-1.2, -0.5, 4.6] } },
  { t: 1.0, s: { tgt: [-0.6, -0.4, 0], pos: [-0.8, 0, 6.8] } },
];
const POS = SHOTS.map((s) => ({ t: s.t, v: s.s.pos }));
const TGT = SHOTS.map((s) => ({ t: s.t, v: s.s.tgt }));

let fontsPromise: Promise<void> | null = null;

export default function InvestigationScene() {
  use((fontsPromise ??= ensureCanvasFonts()));
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const size = useThree((s) => s.size);
  const tier = useRuntime((s) => s.tier);
  const profile = QUALITY_PROFILES[tier];
  const target = useMemo(() => new THREE.Object3D(), []);
  useEffect(() => {
    if (spotRef.current) spotRef.current.target = target;
  }, [target]);

  useSceneFrame((f) => {
    const p = f.reduced
      ? SHOTS.reduce((a, s) => (f.progress >= s.t - 0.05 ? s.t : a), 0)
      : f.progress;
    const cam = camRef.current;
    if (!cam) return;
    const portrait = size.width / size.height < 0.9;
    const pos = keyframes(POS, p);
    const tgt = keyframes(TGT, p);
    const back = portrait ? 1.7 : 1;
    cam.position.set(
      tgt[0] + (pos[0] - tgt[0]) + f.pointer.x * 0.15,
      pos[1] + f.pointer.y * 0.1,
      pos[2] * back,
    );
    cam.lookAt(tgt[0], tgt[1] - (portrait ? 0.4 : 0), 0);
    // Torch-light follows the camera's focus.
    target.position.set(tgt[0] - 0.4, tgt[1], 0);
    target.updateMatrixWorld();
    spotRef.current?.position.set(tgt[0] - 0.6, tgt[1] + 2.4, 3.2);
  });

  return (
    <>
      <PerspectiveCamera
        ref={camRef}
        makeDefault
        fov={36}
        near={0.05}
        far={60}
        position={[0, 0.3, 8.5]}
      />
      <color attach="background" args={['#050403']} />
      <fog attach="fog" args={['#050403', 6, 16]} />
      <ambientLight intensity={0.35} color="#8090b0" />
      <spotLight
        ref={spotRef}
        color="#ffe2b8"
        intensity={42}
        angle={0.55}
        penumbra={0.85}
        decay={2}
        castShadow={profile.shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      />
      <EvidenceBoard cards={CARDS} strings={STRINGS} size={[11, 6.5]} />
    </>
  );
}
