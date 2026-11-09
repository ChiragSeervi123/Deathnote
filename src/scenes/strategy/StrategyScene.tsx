import { use, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ensureCanvasFonts } from '@/app/fonts';
import { smoothstep } from '@/utils/math';
import { NotebookModel } from '../props/notebook/NotebookModel';
import { createNotebookState } from '../props/notebook/notebookState';
import { BoardRig } from '../shared/board/BoardRig';
import { EvidenceBoard, type BoardCard, type BoardString } from '../shared/board/EvidenceBoard';
import { focusCard, type Shot } from '../shared/board/shots';
import { useSceneFrame } from '../shared/sceneFrame';

/**
 * Chapter 13 — Final Strategy. Two identical notebooks under a scanning
 * light — one a forgery — and the web of moves that leads to the warehouse.
 */
const CARDS: readonly BoardCard[] = [
  {
    id: 'near',
    at: [-3.4, 1.0],
    width: 0.85,
    rot: 0.02,
    appear: 0.12,
    spec: { kind: 'portrait', name: 'Near', role: 'SPK', tone: 'light' },
  },
  {
    id: 'light',
    at: [-1.7, 1.25],
    width: 0.85,
    rot: -0.03,
    appear: 0.17,
    spec: { kind: 'portrait', name: 'Light Yagami', role: 'suspect', tone: 'dark' },
  },
  {
    id: 'mikami',
    at: [0.0, 0.9],
    width: 0.85,
    rot: 0.02,
    appear: 0.3,
    spec: { kind: 'portrait', name: 'Teru Mikami', role: 'prosecutor', tone: 'dark' },
  },
  {
    id: 'forgery',
    at: [1.6, 1.15],
    width: 1.0,
    rot: -0.04,
    appear: 0.36,
    spec: { kind: 'stamp', text: 'FORGERY', sub: 'pages replaced' },
  },
  {
    id: 'mello',
    at: [-2.2, -1.2],
    width: 0.85,
    rot: -0.02,
    appear: 0.47,
    spec: { kind: 'portrait', name: 'Mello', role: 'independent', tone: 'dark' },
  },
  {
    id: 'takada',
    at: [-0.6, -1.15],
    width: 0.85,
    rot: 0.03,
    appear: 0.5,
    spec: { kind: 'portrait', name: 'Kiyomi Takada', role: 'spokesperson', tone: 'light' },
  },
  {
    id: 'meet',
    at: [2.6, -0.9],
    width: 1.3,
    rot: 0.02,
    appear: 0.63,
    spec: { kind: 'note', text: 'They agree to meet. A warehouse. 28 January.' },
  },
];

const STRINGS: readonly BoardString[] = [
  { from: 'near', to: 'light', appear: 0.2 },
  { from: 'light', to: 'mikami', appear: 0.32 },
  { from: 'mikami', to: 'forgery', appear: 0.39 },
  { from: 'mello', to: 'takada', appear: 0.52 },
  { from: 'takada', to: 'light', appear: 0.55 },
  { from: 'near', to: 'meet', appear: 0.66 },
  { from: 'light', to: 'meet', appear: 0.68 },
];

const SHOTS: readonly Shot[] = [
  { t: 0, tgt: [0, -2.35, 0.9], pos: [0.2, -0.9, 3.4] },
  focusCard(CARDS, 'near', -1, 0.2),
  focusCard(CARDS, 'forgery', 1, 0.37),
  focusCard(CARDS, 'mello', -1, 0.53),
  focusCard(CARDS, 'meet', 1, 0.7),
  { t: 1, tgt: [0, -0.3, 0], pos: [0, 0.0, 8] },
];

let fontsPromise: Promise<void> | null = null;

export default function StrategyScene() {
  use((fontsPromise ??= ensureCanvasFonts()));
  const nbA = useMemo(() => createNotebookState(1), []);
  const nbB = useMemo(() => createNotebookState(1), []);
  const scanRef = useRef<THREE.Mesh>(null);
  const scanMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(1.6, 1.6, 1.8),
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );

  useSceneFrame((f) => {
    // A thin scanning line sweeps across both notebooks, early in the chapter.
    const s = scanRef.current;
    if (!s) return;
    const sweep = (f.reduced ? 0.5 : (f.time * 0.25) % 1) * 3.4 - 1.7;
    s.position.x = sweep;
    scanMat.opacity = 0.5 * (1 - smoothstep(0.2, 0.3, f.progress));
  });

  return (
    <>
      <BoardRig shots={SHOTS} ambient={0.32} />
      <EvidenceBoard cards={CARDS} strings={STRINGS} size={[11, 6.5]} />
      {/* Desk ledge with the original and its perfect copy. */}
      <mesh position={[0, -2.45, 0.9]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 2]} />
        <meshStandardMaterial color="#120f0d" roughness={0.7} />
      </mesh>
      <group position={[-1.6, -2.44, 1.3]} rotation={[0, 0.06, 0]} scale={0.95}>
        <NotebookModel state={nbA} textureSize={1024} />
      </group>
      <group position={[0.25, -2.44, 1.25]} rotation={[0, -0.04, 0]} scale={0.95}>
        <NotebookModel state={nbB} textureSize={1024} />
      </group>
      <mesh
        ref={scanRef}
        position={[0, -2.25, 1.3]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={scanMat}
      >
        <planeGeometry args={[0.02, 2.4]} />
      </mesh>
    </>
  );
}
