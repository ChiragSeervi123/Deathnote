import { use, useEffect, useMemo, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ensureCanvasFonts } from '@/app/fonts';
import { lightParts } from '@/characters/light/light';
import { InkFigure, type InkFigureHandle } from '@/characters/shared/InkFigure';
import { useRuntime } from '@/state/runtime';
import { keyframes, lerp, smoothstep } from '@/utils/math';
import { Motes } from '../props/Motes';
import { RainWindow } from '../props/RainWindow';
import { canvasTexture, makeCanvas } from '../shared/canvasTextures';
import { QUALITY_PROFILES } from '../shared/quality';
import { useSceneFrame } from '../shared/sceneFrame';

/**
 * Chapter 03 — Light Yagami. A composed student in his room; as the chapter
 * turns, the light drains from dusk to judgment red and his expression moves
 * from boredom to calculation to a private smile (SCENE_SPECIFICATIONS §03).
 */

type V3 = readonly [number, number, number];

const CAM_POS: ReadonlyArray<{ t: number; v: V3 }> = [
  { t: 0.0, v: [0.0, 1.5, 2.05] },
  { t: 0.4, v: [0.05, 1.52, 1.75] },
  { t: 0.8, v: [-0.04, 1.55, 1.5] },
  { t: 1.0, v: [-0.06, 1.62, 0.92] },
];
const CAM_TGT: ReadonlyArray<{ t: number; v: V3 }> = [
  { t: 0.0, v: [0.0, 1.42, 0] },
  { t: 0.4, v: [0.0, 1.45, 0] },
  { t: 0.8, v: [0.0, 1.5, 0] },
  { t: 1.0, v: [-0.03, 1.6, 0] },
];

const MOTE_BOX: [number, number, number] = [3, 2, 2];
const MOTE_POS: [number, number, number] = [0, 1.5, -0.4];

function tvTexture(stage: 'standoff' | 'collapse'): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(512, 288);
  const g = ctx.createLinearGradient(0, 0, 0, 288);
  g.addColorStop(0, '#20324a');
  g.addColorStop(1, '#0c141f');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 288);
  // A building at night, police lights (steady, not flashing).
  ctx.fillStyle = '#0a0d12';
  ctx.fillRect(120, 70, 270, 160);
  ctx.fillStyle = 'rgba(255,214,150,0.6)';
  for (let i = 0; i < 6; i++) ctx.fillRect(140 + i * 42, 100, 20, 26);
  ctx.fillStyle = 'rgba(80,140,255,0.45)';
  ctx.fillRect(40, 200, 60, 12);
  ctx.fillStyle = 'rgba(255,60,60,0.45)';
  ctx.fillRect(420, 200, 60, 12);
  ctx.fillStyle = '#c9252c';
  ctx.fillRect(18, 18, 74, 30);
  ctx.fillStyle = '#fff';
  ctx.font = '600 20px "IBM Plex Mono", monospace';
  ctx.fillText('LIVE', 30, 41);
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(0, 236, 512, 52);
  ctx.fillStyle = '#f2efe8';
  ctx.font = '500 21px "IBM Plex Mono", monospace';
  ctx.fillText(
    stage === 'standoff' ? 'HOSTAGE STANDOFF AT A NURSERY' : 'SUSPECT COLLAPSES — HEART ATTACK',
    18,
    270,
  );
  return canvasTexture(canvas);
}

function blindsTexture(): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(256, 512);
  ctx.clearRect(0, 0, 256, 512);
  for (let i = 0; i < 14; i++) {
    const y = 20 + i * 34;
    const g = ctx.createLinearGradient(0, y, 0, y + 18);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.5, 'rgba(255,255,255,1)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, y, 256, 18);
  }
  return canvasTexture(canvas);
}

let fontsPromise: Promise<void> | null = null;

const WARM = new THREE.Color(1.0, 0.95, 0.88);
const RED = new THREE.Color(1.0, 0.42, 0.4);
const RIM_WARM = new THREE.Color('#d9b48a');
const RIM_TV = new THREE.Color('#9fb8e6');
const RIM_RED = new THREE.Color('#ff2a33');
const BG_DUSK = new THREE.Color('#231d19');
const BG_RED = new THREE.Color('#1c0406');

export default function LightScene() {
  use((fontsPromise ??= ensureCanvasFonts()));
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const figRef = useRef<InkFigureHandle>(null);
  const bgRef = useRef<THREE.Color>(null);
  const tvMat = useRef<THREE.MeshBasicMaterial>(null);
  const size = useThree((s) => s.size);
  const tier = useRuntime((s) => s.tier);
  const profile = QUALITY_PROFILES[tier];
  const parts = useMemo(lightParts, []);
  const tmp = useMemo(() => ({ tint: new THREE.Color(), rim: new THREE.Color() }), []);

  const tex = useMemo(
    () => ({
      standoff: tvTexture('standoff'),
      collapse: tvTexture('collapse'),
      blinds: blindsTexture(),
    }),
    [],
  );
  useEffect(
    () => () => {
      tex.standoff.dispose();
      tex.collapse.dispose();
      tex.blinds.dispose();
    },
    [tex],
  );
  const blindsMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: tex.blinds,
        color: new THREE.Color(2.2, 0.15, 0.18),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    [tex],
  );
  useEffect(() => () => blindsMat.dispose(), [blindsMat]);

  useSceneFrame((f) => {
    const p = f.progress;
    const cam = camRef.current;
    const fig = figRef.current;
    if (!cam || !fig) return;

    // Camera: a slow push from the room to the face.
    const portrait = size.width / size.height < 0.9;
    const pos = keyframes(CAM_POS, f.reduced ? Math.round(p * 3) / 3 : p);
    const tgt = keyframes(CAM_TGT, f.reduced ? Math.round(p * 3) / 3 : p);
    const back = portrait ? 1.55 : 1;
    cam.position.set(
      tgt[0] + (pos[0] - tgt[0]) * back + f.pointer.x * 0.03,
      tgt[1] + (pos[1] - tgt[1]) * back + f.pointer.y * 0.02 + (portrait ? 0.15 : 0),
      tgt[2] + (pos[2] - tgt[2]) * back,
    );
    cam.lookAt(tgt[0], tgt[1] + (portrait ? 0.12 : 0), tgt[2]);

    // Mood: warm dusk → TV glow for the first test → judgment red.
    const red = smoothstep(0.5, 0.9, p);
    const tv = smoothstep(0.4, 0.44, p) * (1 - smoothstep(0.52, 0.56, p));
    tmp.tint.copy(WARM).lerp(RED, red * 0.85);
    fig.setTint(tmp.tint);
    tmp.rim.copy(RIM_WARM).lerp(RIM_TV, tv).lerp(RIM_RED, red);
    fig.setRim(tmp.rim);
    if (bgRef.current) bgRef.current.copy(BG_DUSK).lerp(BG_RED, red);
    blindsMat.opacity = smoothstep(0.55, 0.85, p) * 0.55;
    if (tvMat.current) {
      tvMat.current.map = p < 0.47 ? tex.standoff : tex.collapse;
      // Dark unless its beat is on screen (it sits behind left-hand text otherwise).
      tvMat.current.color.setScalar(lerp(0.03, 1.6, tv) * (1 - red * 0.6));
    }

    // Expression arc (SCENE_SPECIFICATIONS §03).
    const calculating = p >= 0.27;
    const narrow = (p >= 0.27 && p < 0.55) || p >= 0.84;
    const smirk = p >= 0.86;
    const set = (id: string, v: boolean) => {
      const g = fig.part(id);
      if (g) g.visible = v;
    };
    set('eyesOpen', !narrow);
    set('eyesNarrow', narrow);
    set('browsCalm', !calculating);
    set('browsSharp', calculating);
    set('mouthNeutral', !smirk);
    set('mouthSmirk', smirk);
    set('irisBrown', p < 0.6);
    set('irisRed', p >= 0.6);
    fig.setGlow(smoothstep(0.6, 0.9, p));

    // Life: breath, a blink every few seconds, gaze drifting toward the visitor.
    const t = f.reduced ? 0 : f.time;
    const body = fig.part('body');
    if (body) {
      // Shoulders sit high under the jaw (anime proportions).
      body.position.y = 0.06;
      body.scale.y = 1 + Math.sin(t * 1.4) * 0.006;
    }
    const head = fig.part('head');
    if (head) {
      head.rotation.z = Math.sin(t * 0.5) * 0.012 + f.pointer.x * -0.03;
      head.position.y = 1.43 + Math.sin(t * 1.4 + 0.4) * 0.002;
    }
    const blinkPhase = (t % 4.3) / 4.3;
    const open = fig.part(narrow ? 'eyesNarrow' : 'eyesOpen');
    if (open) open.scale.y = blinkPhase > 0.97 && !f.reduced ? 0.15 : 1;
  });

  return (
    <>
      <PerspectiveCamera
        ref={camRef}
        makeDefault
        fov={30}
        near={0.05}
        far={50}
        position={[0, 1.5, 2]}
      />
      <color ref={bgRef} attach="background" args={['#231d19']} />
      <fog attach="fog" args={['#120c0a', 3, 9]} />

      {/* Room: back wall with blinds light, a window, a shelf, the TV. */}
      <mesh position={[0, 1.6, -1.7]}>
        <planeGeometry args={[7, 4]} />
        <meshBasicMaterial color="#17110f" />
      </mesh>
      <mesh position={[0.55, 1.7, -1.66]} material={blindsMat}>
        <planeGeometry args={[1.6, 2.4]} />
      </mesh>
      <RainWindow position={[1.15, 1.75, -1.68]} width={1.2} height={1.5} intensity={0.9} />
      <group position={[-1.05, 0.9, -1.4]}>
        {[0, 0.42, 0.84].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <boxGeometry args={[0.9, 0.025, 0.28]} />
            <meshBasicMaterial color="#0d0a09" />
          </mesh>
        ))}
        {Array.from({ length: 14 }, (_, i) => (
          <mesh key={i} position={[-0.38 + (i % 7) * 0.12, 0.13 + Math.floor(i / 7) * 0.42, 0.02]}>
            <boxGeometry args={[0.07, 0.22 + ((i * 37) % 9) * 0.01, 0.2]} />
            <meshBasicMaterial color={i % 3 ? '#130f0d' : '#1d1612'} />
          </mesh>
        ))}
      </group>
      <mesh position={[-0.62, 1.32, -1.0]}>
        <planeGeometry args={[0.46, 0.26]} />
        <meshBasicMaterial ref={tvMat} map={tex.standoff} toneMapped={false} />
      </mesh>

      <InkFigure
        ref={figRef}
        parts={parts}
        rimColor="#d9b48a"
        rimOffset={[-0.0035, 0.0045]}
        curveSegments={10}
      />

      {profile.particles > 0.2 ? (
        <Motes
          count={Math.round(120 * profile.particles)}
          box={MOTE_BOX}
          position={MOTE_POS}
          color="#ffcf9e"
          size={5}
          opacity={0.25}
          seed={8}
        />
      ) : null}
    </>
  );
}
