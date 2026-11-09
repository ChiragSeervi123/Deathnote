import { use, useEffect, useMemo, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ensureCanvasFonts } from '@/app/fonts';
import { InkFigure, type InkFigureHandle } from '@/characters/shared/InkFigure';
import { personParts } from '@/characters/shared/people';
import { capsule, disc } from '@/characters/shared/shapes';
import { useRuntime } from '@/state/runtime';
import { keyframes, mulberry32, range, smoothstep } from '@/utils/math';
import { NotebookModel } from '../props/notebook/NotebookModel';
import { createNotebookState } from '../props/notebook/notebookState';
import { canvasTexture, makeCanvas } from '../shared/canvasTextures';
import { QUALITY_PROFILES } from '../shared/quality';
import { useSceneFrame } from '../shared/sceneFrame';

/**
 * Chapter 12 — The New Kira Era. A plaza of candle-holding followers beneath a
 * screen; a prosecutor writing with sharp strokes; a newscaster speaking in
 * Kira's name. Three sets joined by cuts.
 */
type V3 = readonly [number, number, number];
const MIKAMI_SET: V3 = [40, 0, 0];
const TAKADA_SET: V3 = [-40, 0, 0];

const CAM_POS: ReadonlyArray<{ t: number; v: V3 }> = [
  { t: 0, v: [0, 2.4, 14] },
  { t: 0.5, v: [0, 3.2, 6] },
  { t: 0.535, v: [0, 3.2, 6] },
  { t: 0.545, v: [41.1, 1.35, 1.4] },
  { t: 0.68, v: [40.9, 1.3, 1.1] },
  { t: 0.685, v: [40.9, 1.3, 1.1] },
  { t: 0.695, v: [-41.1, 1.6, 3.2] },
  { t: 1, v: [-40.9, 1.6, 2.6] },
];
const CAM_TGT: ReadonlyArray<{ t: number; v: V3 }> = [
  { t: 0, v: [0, 4, -20] },
  { t: 0.5, v: [0, 9, -30] },
  { t: 0.535, v: [0, 9, -30] },
  { t: 0.545, v: [39.6, 0.95, -0.2] },
  { t: 0.68, v: [39.6, 0.95, -0.2] },
  { t: 0.685, v: [39.6, 0.95, -0.2] },
  { t: 0.695, v: [-39.2, 1.45, 0] },
  { t: 1, v: [-39.2, 1.5, 0] },
];

function screenTex(): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(1024, 576);
  ctx.fillStyle = '#0a0304';
  ctx.fillRect(0, 0, 1024, 576);
  ctx.fillStyle = '#e8e3d8';
  ctx.textAlign = 'center';
  ctx.font = '500 34px "IBM Plex Mono", monospace';
  ctx.fillText('A MESSAGE IN KIRA’S NAME', 512, 90);
  ctx.fillStyle = '#d0161f';
  ctx.font = '400 300px "Cormorant Garamond Variable", serif';
  ctx.fillText('KIRA', 512, 420);
  return canvasTexture(canvas);
}

function studioTex(): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(1024, 512);
  const g = ctx.createLinearGradient(0, 0, 1024, 0);
  g.addColorStop(0, '#1a0507');
  g.addColorStop(0.5, '#3a0b10');
  g.addColorStop(1, '#1a0507');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 512);
  ctx.strokeStyle = 'rgba(232,227,216,0.12)';
  for (let x = 0; x < 1024; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(232,227,216,0.85)';
  ctx.font = '500 30px "IBM Plex Mono", monospace';
  ctx.fillText('SPECIAL BROADCAST', 40, 470);
  return canvasTexture(canvas);
}

let fontsPromise: Promise<void> | null = null;

export default function NewKiraScene() {
  use((fontsPromise ??= ensureCanvasFonts()));
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const mikamiRef = useRef<InkFigureHandle>(null);
  const screenMat = useRef<THREE.MeshBasicMaterial>(null);
  const size = useThree((s) => s.size);
  const tier = useRuntime((s) => s.tier);
  const profile = QUALITY_PROFILES[tier];
  const nb = useMemo(() => createNotebookState(2), []);
  const mikami = useMemo(
    () =>
      personParts({
        sitting: true,
        hair: 'bob',
        build: 0.9,
        coat: true,
        clothes: '#101116',
        face: '#b9aea2',
        hairColor: '#08080a',
        seed: 31,
      }),
    [],
  );
  const takada = useMemo(
    () =>
      personParts({
        hair: 'bob',
        height: 1.66,
        build: 0.85,
        clothes: '#2a2f3e',
        face: '#e3d3c4',
        hairColor: '#120d0a',
        seed: 12,
      }),
    [],
  );

  const a = useMemo(() => {
    const rnd = mulberry32(3);
    const person = new THREE.ShapeGeometry(
      [
        disc([0, 1.62], 0.11, 0.13),
        ...capsule([0, 1.45], [0, 0.9], 0.2, 0.17),
        ...capsule([0, 0.9], [0, 0.05], 0.17, 0.12),
      ],
      5,
    );
    const mat = new THREE.MeshBasicMaterial({ color: '#050304', side: THREE.DoubleSide });
    const n = Math.round(320 * Math.max(0.4, profile.particles));
    const crowd = new THREE.InstancedMesh(person, mat, n);
    const flames = new Float32Array(n * 3);
    const m = new THREE.Matrix4();
    for (let i = 0; i < n; i++) {
      const x = (rnd() - 0.5) * 26;
      const z = -2 - rnd() * 24;
      const s = 0.9 + rnd() * 0.2;
      m.compose(new THREE.Vector3(x, 0, z), new THREE.Quaternion(), new THREE.Vector3(s, s, s));
      crowd.setMatrixAt(i, m);
      flames.set([x + 0.22 * s, 1.15 * s, z + 0.08], i * 3);
    }
    const fGeo = new THREE.BufferGeometry();
    fGeo.setAttribute('position', new THREE.BufferAttribute(flames, 3));
    const fMat = new THREE.PointsMaterial({
      color: new THREE.Color(3.2, 1.8, 0.7),
      size: 0.09,
      sizeAttenuation: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    const scr = screenTex();
    const studio = studioTex();
    return { person, mat, crowd, fGeo, fMat, scr, studio };
  }, [profile.particles]);
  useEffect(
    () => () => {
      a.person.dispose();
      a.mat.dispose();
      a.crowd.dispose();
      a.fGeo.dispose();
      a.fMat.dispose();
      a.scr.dispose();
      a.studio.dispose();
    },
    [a],
  );

  useSceneFrame((f) => {
    const p = f.reduced ? Math.round(f.progress * 4) / 4 : f.progress;
    const cam = camRef.current;
    if (!cam) return;
    const pos = keyframes(CAM_POS, p, (t) => t);
    const tgt = keyframes(CAM_TGT, p, (t) => t);
    const back = size.width / size.height < 0.9 ? 1.4 : 1;
    cam.position.set(
      tgt[0] + (pos[0] - tgt[0]) * back + f.pointer.x * 0.15,
      pos[1] + f.pointer.y * 0.08,
      tgt[2] + (pos[2] - tgt[2]) * back,
    );
    cam.lookAt(tgt[0], tgt[1], tgt[2]);
    if (screenMat.current) screenMat.current.color.setScalar(0.4 + 1.2 * smoothstep(0.38, 0.48, p));
    // Mikami writes: the page fills line by line; his writing arm twitches with each stroke.
    nb.coverOpen = 1;
    nb.pages[0]!.write = range(p, 0.56, 0.66);
    const t = f.reduced ? 0 : f.time;
    const body = mikamiRef.current?.part('body');
    if (body) body.rotation.z = Math.sin(t * 9) * 0.006 * (p > 0.55 && p < 0.68 ? 1 : 0);
    a.fMat.size = 0.08 + Math.sin(t * 3) * 0.004;
  });

  return (
    <>
      <PerspectiveCamera
        ref={camRef}
        makeDefault
        fov={38}
        near={0.05}
        far={200}
        position={[0, 2.4, 14]}
      />
      <color attach="background" args={['#2a080b']} />
      <fog attach="fog" args={['#2a080b', 10, 55]} />
      <hemisphereLight args={['#3a2020', '#050303', 0.6]} />

      {/* Plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -12]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0b0807" roughness={0.6} />
      </mesh>
      <primitive object={a.crowd} />
      <points geometry={a.fGeo} material={a.fMat} />
      <pointLight position={[0, 2, -8]} color="#ff9a4a" intensity={30} distance={30} />
      <mesh position={[0, 9, -30]}>
        <planeGeometry args={[19, 10.7]} />
        <meshBasicMaterial ref={screenMat} map={a.scr} toneMapped={false} />
      </mesh>

      {/* Mikami's desk */}
      <group position={MIKAMI_SET as unknown as [number, number, number]}>
        <mesh position={[0, 0.72, 0]}>
          <boxGeometry args={[1.6, 0.04, 0.8]} />
          <meshStandardMaterial color="#141210" roughness={0.4} />
        </mesh>
        <pointLight position={[0.1, 1.6, 0.5]} intensity={6} distance={4} color="#fff1dc" />
        <group position={[-0.25, 0.745, -0.05]} scale={0.22} rotation={[0, 0.1, 0]}>
          <NotebookModel state={nb} textureSize={1024} castShadow={false} />
        </group>
        <group position={[-0.1, 0, -0.65]}>
          <InkFigure ref={mikamiRef} parts={mikami} rimColor="#d0b48a" />
        </group>
      </group>

      {/* Takada's studio */}
      <group position={TAKADA_SET as unknown as [number, number, number]}>
        <mesh position={[0, 2.4, -1.6]}>
          <planeGeometry args={[14, 4.8]} />
          <meshBasicMaterial map={a.studio} />
        </mesh>
        {/* Side wall and floor close the set so the plaza never shows through. */}
        <mesh position={[3.4, 2.5, 1.5]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[7, 5]} />
          <meshStandardMaterial color="#1a0608" roughness={0.9} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 1]}>
          <planeGeometry args={[14, 7]} />
          <meshStandardMaterial color="#120708" roughness={0.35} metalness={0.2} />
        </mesh>
        <mesh position={[0.35, 0.55, 0.15]}>
          <boxGeometry args={[1.1, 1.1, 0.45]} />
          <meshStandardMaterial color="#2a2c34" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0.35, 0.9, 0.38]}>
          <boxGeometry args={[1.1, 0.025, 0.01]} />
          <meshBasicMaterial color={[2.4, 0.35, 0.4]} toneMapped={false} />
        </mesh>
        <pointLight position={[1.2, 2.4, 2]} intensity={10} distance={7} color="#ffe6d0" />
        <group position={[0.35, 0, -0.25]}>
          <InkFigure parts={takada} rimColor="#e6c9a8" />
        </group>
      </group>
    </>
  );
}
