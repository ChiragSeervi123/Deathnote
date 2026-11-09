import { useEffect, useMemo, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { lightParts } from '@/characters/light/light';
import { RYUK_FULL, ryukFullParts } from '@/characters/ryuk-full/ryukFull';
import { InkFigure, type InkFigureHandle } from '@/characters/shared/InkFigure';
import { personParts } from '@/characters/shared/people';
import { keyframes, range, smoothstep } from '@/utils/math';
import { NotebookModel } from '../props/notebook/NotebookModel';
import { createNotebookState } from '../props/notebook/notebookState';
import { glowTexture } from '../shared/canvasTextures';
import { useSceneFrame } from '../shared/sceneFrame';
import { corrugatedTexture } from '../warehouse/warehouseAssets';
import { buildSkyline, duskTexture } from './duskAssets';

/**
 * Chapter 15 — The Fall of Kira. Two places joined by cuts: a dark room where
 * Light is exposed, shot, and begs Ryuk; and an iron stairway outside a
 * warehouse at dusk, where it ends. Restraint throughout: no blood, one flash.
 */
type V3 = readonly [number, number, number];

/** The dark room sits well away from the stairway. */
const ROOM: V3 = [40, 0, 0];
const RYUK_AT: V3 = [40.75, 0.25, -1.3];
const STEPS = 12;
const STEP_W = 0.42;
const STEP_H = 0.25;
const STAIR_X0 = -2.5;
const STAIR_Z = -0.65;
const LANDING: V3 = [STAIR_X0 + STEPS * STEP_W + 0.8, STEPS * STEP_H, STAIR_Z];

const CAM: ReadonlyArray<{ t: number; pos: V3; tgt: V3 }> = [
  { t: 0, pos: [2.6, 1.7, 9.5], tgt: [2.4, 2.1, -1] },
  { t: 0.1, pos: [2.4, 1.8, 8.4], tgt: [2.2, 2.1, -1] },
  { t: 0.112, pos: [39.6, 1.6, 2.3], tgt: [39.55, 1.5, 0] },
  { t: 0.24, pos: [39.62, 1.58, 2.0], tgt: [39.55, 1.5, 0] },
  { t: 0.255, pos: [40.42, 1.58, 2.05], tgt: [40.45, 1.5, 0] },
  { t: 0.37, pos: [40.4, 1.56, 1.85], tgt: [40.45, 1.5, 0] },
  { t: 0.39, pos: [39.1, 1.7, 5.0], tgt: [39.35, 1.95, -0.5] },
  { t: 0.51, pos: [39.15, 1.7, 4.4], tgt: [39.4, 1.95, -0.5] },
  { t: 0.53, pos: [41.25, 2.15, 0.75], tgt: [41.45, 1.95, -1.1] },
  { t: 0.66, pos: [41.2, 2.1, 0.5], tgt: [41.45, 1.95, -1.1] },
  { t: 0.672, pos: [-4.8, 1.3, 6.8], tgt: [-0.2, 1.7, -0.6] },
  { t: 0.82, pos: [-4.4, 1.3, 6.0], tgt: [-0.1, 1.7, -0.6] },
  { t: 1, pos: [0.5, 5.5, 19], tgt: [0.5, 3.5, -12] },
];
const CAM_POS = CAM.map((k) => ({ t: k.t, v: k.pos }));
const CAM_TGT = CAM.map((k) => ({ t: k.t, v: k.tgt }));

const RED = new THREE.Color('#ff3038');
const COLD = new THREE.Color('#7d8796');

export default function FallScene() {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const bustRef = useRef<InkFigureHandle>(null);
  const ryukRef = useRef<InkFigureHandle>(null);
  const slumpRef = useRef<InkFigureHandle>(null);
  const ghostGroup = useRef<THREE.Group>(null);
  const slumpGroup = useRef<THREE.Group>(null);
  const flashMat = useRef<THREE.MeshBasicMaterial>(null);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);
  const size = useThree((s) => s.size);
  const nb = useMemo(() => createNotebookState(2), []);
  const parts = useMemo(
    () => ({
      bust: lightParts(),
      ryuk: ryukFullParts(),
      slumped: personParts({
        hair: 'neat',
        sitting: true,
        height: 1.79,
        clothes: '#3b3128',
        face: '#cdb8a3',
        hairColor: '#6e4a31',
        seed: 2,
      }),
      // What he sees at the top of the stairs: a pale shape, nothing more.
      ghost: personParts({ hair: 'spiky', height: 1.79, build: 0.85, seed: 9 }),
      witnesses: [0, 1, 2, 3, 4].map((i) =>
        personParts({
          hair: i % 2 ? 'short' : 'neat',
          height: 1.72 + i * 0.03,
          coat: true,
          seed: 60 + i,
        }),
      ),
    }),
    [],
  );

  const a = useMemo(() => {
    const sky = duskTexture();
    const wall = corrugatedTexture();
    wall.repeat.set(5, 1);
    const glow = glowTexture();
    const city = buildSkyline(90);
    return { sky, wall, glow, city };
  }, []);
  useEffect(
    () => () => {
      a.sky.dispose();
      a.wall.dispose();
      a.glow.dispose();
      a.city.dispose();
    },
    [a],
  );

  useSceneFrame((f) => {
    const p = f.reduced ? Math.round(f.progress * 7) / 7 : f.progress;
    const cam = camRef.current;
    if (!cam) return;
    const pos = keyframes(CAM_POS, p, (t) => t);
    const tgt = keyframes(CAM_TGT, p, (t) => t);
    const back = size.width / size.height < 0.9 ? 1.45 : 1;
    cam.position.set(
      tgt[0] + (pos[0] - tgt[0]) * back + f.pointer.x * 0.06,
      pos[1] + f.pointer.y * 0.03,
      tgt[2] + (pos[2] - tgt[2]) * back,
    );
    cam.lookAt(tgt[0], tgt[1], tgt[2]);
    const t = f.reduced ? 0 : f.time;

    // The room: exposed, defiant, then the shot.
    const shot = smoothstep(0.3, 0.305, p);
    const flash = f.reduced ? 0 : smoothstep(0.297, 0.3, p) * (1 - smoothstep(0.3, 0.312, p));
    if (flashMat.current) flashMat.current.opacity = flash * 0.5;
    const bust = bustRef.current;
    if (bust) {
      const set = (id: string, v: boolean) => {
        const g = bust.part(id);
        if (g) g.visible = v;
      };
      const defiant = p < 0.3;
      set('eyesOpen', !defiant);
      set('eyesNarrow', defiant);
      set('browsCalm', !defiant);
      set('browsSharp', defiant);
      set('mouthNeutral', !defiant);
      set('mouthSmirk', defiant);
      set('irisBrown', !defiant);
      set('irisRed', defiant);
      bust.setGlow(defiant ? 0.8 : 0);
      bust.setRim(RED.clone().lerp(COLD, shot));
      const body = bust.part('body');
      if (body) {
        body.position.y = 0.06 - 0.05 * shot;
        body.rotation.z = 0.06 * shot;
      }
      const head = bust.part('head');
      if (head) {
        // He laughs in the first beat; after the shot he looks up, to Ryuk.
        const laugh = range(p, 0.12, 0.24) > 0 && p < 0.26 ? Math.abs(Math.sin(t * 7)) * 0.02 : 0;
        const up = smoothstep(0.38, 0.44, p);
        head.rotation.z = 0.05 * (1 - shot) + laugh - 0.08 * up + Math.sin(t * 0.6) * 0.01;
        head.position.y = 1.43 + laugh * 0.3;
      }
    }
    if (glowMat.current) glowMat.current.opacity = 0.55 * (1 - 0.6 * shot);

    // Ryuk writes, as he promised on the first day.
    const r = ryukRef.current;
    if (r) {
      const head = r.part('head');
      if (head) head.rotation.z = Math.sin(t * 0.4) * 0.02 - 0.04;
      r.setGlow(0.6 + 0.8 * smoothstep(0.55, 0.62, p));
    }
    nb.coverOpen = 1;
    nb.pages[0]!.write = range(p, 0.56, 0.65);

    // The stairway: he sits where he fell; what he sees fades with him.
    const end = smoothstep(0.7, 0.8, p);
    const s = slumpRef.current;
    if (s) {
      const head = s.part('head');
      if (head) head.rotation.z = 0.15 + 0.25 * end;
      s.setRim(COLD.clone().multiplyScalar(1 - 0.7 * end));
    }
    if (ghostGroup.current) ghostGroup.current.visible = p > 0.69 && p < 0.79;
    if (slumpGroup.current) slumpGroup.current.visible = p > 0.665;
    a.city.windowMat.opacity = smoothstep(0.86, 0.97, p);
  });

  return (
    <>
      <PerspectiveCamera
        ref={camRef}
        makeDefault
        fov={36}
        near={0.05}
        far={140}
        position={[2.6, 1.7, 9.5]}
      />
      <color attach="background" args={['#120d12']} />
      <fog attach="fog" args={['#3a2430', 20, 130]} />
      <hemisphereLight args={['#c08a6a', '#1a1218', 1.0]} />
      <directionalLight position={[6, 4, 6]} intensity={1.6} color="#ffb27a" />

      {/* ——— The stairway at dusk ——— */}
      <mesh position={[0, 30, -120]}>
        <planeGeometry args={[360, 120]} />
        <meshBasicMaterial map={a.sky} fog={false} />
      </mesh>
      <primitive object={a.city.blocks} />
      <primitive object={a.city.windows} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -10]}>
        <planeGeometry args={[140, 60]} />
        <meshStandardMaterial color="#1e1719" roughness={0.9} />
      </mesh>
      <mesh position={[-1.75, 3, -1.25]}>
        <planeGeometry args={[10.5, 6]} />
        <meshStandardMaterial map={a.wall} roughness={0.7} metalness={0.15} color="#b39a8c" />
      </mesh>
      <group>
        {Array.from({ length: STEPS }, (_, i) => (
          <mesh
            key={i}
            position={[STAIR_X0 + (i + 0.5) * STEP_W, (i + 1) * STEP_H - 0.02, STAIR_Z]}
          >
            <boxGeometry args={[STEP_W + 0.02, 0.04, 0.9]} />
            <meshStandardMaterial color="#2a2426" roughness={0.5} metalness={0.6} />
          </mesh>
        ))}
        {[STAIR_Z + 0.45, STAIR_Z - 0.45].map((z, i) => (
          <mesh
            key={i}
            position={[STAIR_X0 + (STEPS * STEP_W) / 2, (STEPS * STEP_H) / 2, z]}
            rotation={[0, 0, Math.atan2(STEP_H, STEP_W)]}
          >
            <boxGeometry args={[Math.hypot(STEPS * STEP_W, STEPS * STEP_H) + 0.2, 0.18, 0.04]} />
            <meshStandardMaterial color="#1c1819" roughness={0.6} metalness={0.5} />
          </mesh>
        ))}
        <mesh
          position={[STAIR_X0 + (STEPS * STEP_W) / 2, (STEPS * STEP_H) / 2 + 0.95, STAIR_Z + 0.45]}
          rotation={[0, 0, Math.atan2(STEP_H, STEP_W)]}
        >
          <boxGeometry args={[Math.hypot(STEPS * STEP_W, STEPS * STEP_H) + 0.2, 0.04, 0.04]} />
          <meshStandardMaterial color="#1c1819" roughness={0.6} metalness={0.5} />
        </mesh>
        <mesh position={[LANDING[0], LANDING[1] - 0.03, LANDING[2]]}>
          <boxGeometry args={[1.6, 0.06, 1.0]} />
          <meshStandardMaterial color="#2a2426" roughness={0.5} metalness={0.6} />
        </mesh>
      </group>
      <group
        ref={slumpGroup}
        position={[STAIR_X0 + 3 * STEP_W, 2 * STEP_H - 0.12, STAIR_Z + 0.05]}
        rotation={[0, 0.25, 0.32]}
        visible={false}
      >
        <InkFigure ref={slumpRef} parts={parts.slumped} rimColor="#7d8796" />
      </group>
      <group ref={ghostGroup} position={[LANDING[0], LANDING[1], LANDING[2]]} visible={false}>
        <InkFigure parts={parts.ghost} inkColor="#d9dde4" rimColor="#ffffff" />
      </group>

      {/* ——— The room ——— */}
      <group position={ROOM as unknown as [number, number, number]}>
        {/* The room closes off everything outside it. */}
        <mesh position={[0, 3, -5]}>
          <planeGeometry args={[24, 12]} />
          <meshBasicMaterial color="#0a0708" fog={false} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, -1]}>
          <planeGeometry args={[24, 12]} />
          <meshBasicMaterial color="#070505" fog={false} />
        </mesh>
        <mesh position={[0, 1.6, -2.4]}>
          <planeGeometry args={[7, 5]} />
          <meshBasicMaterial
            ref={glowMat}
            map={a.glow}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            color="#a3141c"
            fog={false}
          />
        </mesh>
        {parts.witnesses.map((w, i) => (
          <group key={i} position={[-2.6 + i * 1.3, 0, -3.6]}>
            <InkFigure parts={w} rimColor="#3a2a2c" />
          </group>
        ))}
        <InkFigure ref={bustRef} parts={parts.bust} rimColor="#ff3038" />
      </group>
      <group position={RYUK_AT as unknown as [number, number, number]}>
        <InkFigure
          ref={ryukRef}
          parts={parts.ryuk}
          rimColor="#8d8a84"
          rimOffset={[-0.007, 0.009]}
        />
      </group>
      <group
        position={[
          RYUK_AT[0] + RYUK_FULL.apple[0] + 0.05,
          RYUK_AT[1] + RYUK_FULL.apple[1] - 0.02,
          RYUK_AT[2] + 0.12,
        ]}
        rotation={[1.15, 0, 0.2]}
        scale={0.16}
      >
        <NotebookModel state={nb} textureSize={1024} castShadow={false} />
      </group>

      {/* The shot: one flash, nothing shown. */}
      <mesh position={[40.4, 1.55, 1.2]} renderOrder={10}>
        <planeGeometry args={[6, 4]} />
        <meshBasicMaterial
          ref={flashMat}
          color="#fff6ea"
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
          fog={false}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}
