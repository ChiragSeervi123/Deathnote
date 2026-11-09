import { useEffect, useMemo, useRef } from 'react';
import { Environment, Lightformer, PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { audioCue } from '@/audio/engine';
import { useRuntime } from '@/state/runtime';
import { damp, keyframes, mulberry32, range } from '@/utils/math';
import { Apple } from '../props/Apple';
import { Motes } from '../props/Motes';
import { NotebookModel } from '../props/notebook/NotebookModel';
import { createNotebookState } from '../props/notebook/notebookState';
import { Pencil } from '../props/Pencil';
import { RainWindow } from '../props/RainWindow';
import { canvasTexture, makeCanvas } from '../shared/canvasTextures';
import { useNotebookInspect } from './inspectStore';
import { QUALITY_PROFILES } from '../shared/quality';
import { useSceneFrame } from '../shared/sceneFrame';

/**
 * Chapter 01 — The Death Note (docs/SCENE_SPECIFICATIONS.md).
 * A desk at night: lamp pool, rain on the window, an apple, a pencil.
 * Scroll opens the cover and turns the pages while each rule inks itself.
 */

type V3 = readonly [number, number, number];

/** Rule beats in chapterData sit at these windows; pages follow them. */
const RULE_WINDOWS: ReadonlyArray<readonly [number, number]> = [
  [0.3, 0.4],
  [0.43, 0.53],
  [0.56, 0.66],
  [0.69, 0.79],
];

/*
 * Framing rule: text beats occupy one side of the frame, so the notebook is
 * composed on the other side and never sits under DOM text.
 *  p 0.00  closed book right of centre (title beat on the left)
 *  p 0.14+ book / spread left of centre (beats on the right)
 *  p 1.00  pull back: desk, apple, rain on the window
 */
const CAM_POS: ReadonlyArray<{ t: number; v: V3 }> = [
  { t: 0.0, v: [0.2, 3.95, 1.75] },
  { t: 0.13, v: [1.15, 4.0, 2.05] },
  { t: 0.28, v: [0.2, 4.55, 2.85] },
  { t: 0.84, v: [0.1, 4.45, 2.75] },
  { t: 1.0, v: [2.3, 2.55, 5.0] },
];
const CAM_TGT: ReadonlyArray<{ t: number; v: V3 }> = [
  { t: 0.0, v: [-0.22, 0, 0.05] },
  { t: 0.13, v: [1.62, 0, 0.05] },
  { t: 0.28, v: [0.82, 0, 0.05] },
  { t: 0.84, v: [0.78, 0, 0.0] },
  { t: 1.0, v: [0.7, 0.45, -1.1] },
];

const LAMP_POS: V3 = [-2.2, 4.3, 1.5];
const LAMP_TARGET: V3 = [0.4, 0, -0.15];
const MOTE_BOX: [number, number, number] = [3.2, 3.2, 2.6];
const MOTE_POS: [number, number, number] = [-0.6, 1.8, 0.4];
const MOTE_BEAM = {
  pos: [...LAMP_POS] as [number, number, number],
  target: [...LAMP_TARGET] as [number, number, number],
  angle: 0.55,
};
const MOTE_DRIFT: [number, number, number] = [0.004, -0.006, 0];

function woodTexture(): THREE.CanvasTexture {
  const w = 1024;
  const h = 512;
  const { canvas, ctx } = makeCanvas(w, h);
  ctx.fillStyle = '#3d2819';
  ctx.fillRect(0, 0, w, h);
  const rnd = mulberry32(9);
  for (let i = 0; i < 520; i++) {
    const y = rnd() * h;
    const amp = 2 + rnd() * 10;
    const freq = 0.002 + rnd() * 0.01;
    const ph = rnd() * 10;
    ctx.strokeStyle =
      rnd() < 0.5 ? `rgba(70,44,28,${0.08 + rnd() * 0.18})` : `rgba(8,5,3,${0.1 + rnd() * 0.25})`;
    ctx.lineWidth = 0.6 + rnd() * 2.4;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 16) {
      const yy = y + Math.sin(x * freq + ph) * amp + Math.sin(x * freq * 3.1 + ph) * amp * 0.3;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
  const t = canvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2, 2);
  return t;
}

export default function NotebookScene() {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const lampRef = useRef<THREE.SpotLight>(null);
  const tier = useRuntime((s) => s.tier);
  const profile = QUALITY_PROFILES[tier];
  const size = useThree((s) => s.size);
  const state = useMemo(() => createNotebookState(5), []);
  const lastTurned = useRef(0);

  const desk = useMemo(() => {
    const map = woodTexture();
    const material = new THREE.MeshStandardMaterial({ map, roughness: 0.55, color: '#c9a88e' });
    const geometry = new THREE.BoxGeometry(12, 0.2, 8);
    return { map, material, geometry };
  }, []);
  useEffect(
    () => () => {
      desk.map.dispose();
      desk.material.dispose();
      desk.geometry.dispose();
    },
    [desk],
  );

  const target = useMemo(() => new THREE.Object3D(), []);
  useEffect(() => {
    target.position.set(...LAMP_TARGET);
    target.updateMatrixWorld();
    if (lampRef.current) lampRef.current.target = target;
  }, [target]);

  useSceneFrame((f) => {
    const inspect = useNotebookInspect.getState();
    const p = inspect.active ? Math.max(f.progress, 0.86) : f.progress;
    // Notebook choreography (reversible: a pure function of progress).
    state.coverOpen = range(p, 0.16, 0.29);
    let turned = 0;
    RULE_WINDOWS.forEach(([a, b], i) => {
      const page = state.pages[i]!;
      if (inspect.active) {
        // Explore mode: every rule is written; pages ease toward the chosen spread.
        page.write = 1;
        page.turn = damp(page.turn, i < inspect.page ? 1 : 0, 6, f.delta);
        if (Math.abs(page.turn - Math.round(page.turn)) < 0.002) page.turn = Math.round(page.turn);
      } else {
        page.write = range(p, a - 0.005, a + 0.075);
        page.turn = range(p, b + 0.004, b + 0.03);
      }
      if (page.turn >= 1) turned++;
    });
    if (!inspect.active && turned !== lastTurned.current) {
      audioCue('page');
    }
    lastTurned.current = turned;

    // Camera: keyframed path + gentle parallax + arrival descent.
    const cam = camRef.current;
    if (!cam) return;
    const portrait = size.width / size.height < 0.9;
    const pos = keyframes(CAM_POS, inspect.active ? 0.8 : p);
    const tgt = keyframes(CAM_TGT, inspect.active ? 0.8 : p);
    const arrive = 1 - f.enter;
    const k = portrait ? 1.55 : 1;
    cam.position.set(
      tgt[0] + (pos[0] - tgt[0]) * k + f.pointer.x * 0.12,
      tgt[1] + (pos[1] - tgt[1]) * k + arrive * 1.2 + f.pointer.y * 0.08,
      tgt[2] + (pos[2] - tgt[2]) * k,
    );
    cam.lookAt(tgt[0], tgt[1] - (portrait ? 0.45 : 0), tgt[2]);
    // Lamp breathes very slightly (filament), never flickers.
    if (lampRef.current) lampRef.current.intensity = 46 + Math.sin(f.time * 0.7) * 0.8;
  });

  return (
    <>
      <PerspectiveCamera
        ref={camRef}
        makeDefault
        fov={34}
        near={0.05}
        far={60}
        position={[1, 3, 1]}
      />
      <color attach="background" args={['#050506']} />
      <fogExp2 attach="fog" args={['#07080b', 0.045]} />

      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={1.4}
          color="#7f97c7"
          scale={[5, 3, 1]}
          position={[0, 2, -6]}
        />
        <Lightformer form="circle" intensity={3} color="#ffcf96" scale={2} position={[-3, 4, 2]} />
        <Lightformer
          form="rect"
          intensity={0.3}
          color="#ffffff"
          scale={[10, 1, 1]}
          position={[0, 6, 0]}
          rotation-x={Math.PI / 2}
        />
      </Environment>

      <hemisphereLight args={['#2a3348', '#0c0806', 0.3]} />
      <spotLight
        ref={lampRef}
        position={LAMP_POS as [number, number, number]}
        color="#ffcb8e"
        intensity={34}
        angle={0.5}
        penumbra={0.95}
        decay={2}
        castShadow={profile.shadows}
        shadow-mapSize={[profile.shadowMapSize, profile.shadowMapSize]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[2, 2.5, -5]} color="#6f86b8" intensity={0.9} />

      <mesh
        geometry={desk.geometry}
        material={desk.material}
        position={[0, -0.1, 0]}
        receiveShadow
      />

      <NotebookModel state={state} textureSize={profile.textureSize} castShadow={profile.shadows} />

      <Apple position={[2.45, 0.4, -1.55]} rotation={[0, 0.6, 0.08]} scale={0.82} />
      <Pencil position={[0.55, 0.034, 1.42]} rotation={[0, 0.12, 0]} />

      <RainWindow position={[0.4, 2.4, -5.2]} width={9} height={5} intensity={1.25} />
      {/* Window frame mullions */}
      <mesh position={[0.4, 2.4, -5.15]}>
        <boxGeometry args={[0.07, 5, 0.06]} />
        <meshStandardMaterial color="#0a0a0b" roughness={0.6} />
      </mesh>
      <mesh position={[0.4, 2.9, -5.15]}>
        <boxGeometry args={[9, 0.07, 0.06]} />
        <meshStandardMaterial color="#0a0a0b" roughness={0.6} />
      </mesh>

      {profile.particles > 0.2 ? (
        <Motes
          count={Math.round(200 * profile.particles)}
          box={MOTE_BOX}
          position={MOTE_POS}
          beam={MOTE_BEAM}
          drift={MOTE_DRIFT}
          size={7}
          opacity={0.32}
          seed={3}
        />
      ) : null}
    </>
  );
}
