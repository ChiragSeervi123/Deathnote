import { useEffect, useMemo, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { InkFigure, type InkFigureHandle } from '@/characters/shared/InkFigure';
import { personParts } from '@/characters/shared/people';
import { nearParts } from '@/characters/successors/near';
import { useRuntime } from '@/state/runtime';
import { keyframes, smoothstep } from '@/utils/math';
import { Motes } from '../props/Motes';
import { NotebookModel } from '../props/notebook/NotebookModel';
import { createNotebookState } from '../props/notebook/notebookState';
import { QUALITY_PROFILES } from '../shared/quality';
import { useSceneFrame } from '../shared/sceneFrame';
import { beamGeometry, beamMaterial, concreteTexture, corrugatedTexture } from './warehouseAssets';

/**
 * Chapter 14 — Final Confrontation. An original empty warehouse: corrugated
 * walls, high windows, dust in the shafts. Near sits on the floor; the two
 * teams stand; Light stands apart. Behind a door left ajar, someone writes.
 */
type V3 = readonly [number, number, number];

const LIGHT_AT: V3 = [-1.5, 0, -2.2];
const NEAR_AT: V3 = [0.8, 0, -0.6];
const DOOR_HINGE: V3 = [-4.6, 0, -6];
const DOOR_W = 1.1;
const NOTEBOOK_AT: V3 = [-2.4, 0.02, -4.2];
const TEAM: ReadonlyArray<{
  x: number;
  z: number;
  hair: 'short' | 'neat' | 'long' | 'curly' | 'bob';
  h: number;
}> = [
  { x: 2.0, z: -2.2, hair: 'neat', h: 1.8 },
  { x: 2.7, z: -2.6, hair: 'long', h: 1.7 },
  { x: 3.4, z: -2.1, hair: 'short', h: 1.82 },
  { x: 4.1, z: -2.7, hair: 'curly', h: 1.75 },
  { x: 4.8, z: -2.3, hair: 'neat', h: 1.78 },
  { x: 5.5, z: -2.8, hair: 'short', h: 1.76 },
  { x: 6.1, z: -2.2, hair: 'bob', h: 1.72 },
];

const CAM: ReadonlyArray<{ t: number; pos: V3; tgt: V3 }> = [
  { t: 0, pos: [0.4, 3.4, 9.5], tgt: [-0.6, 2.4, -3] },
  { t: 0.11, pos: [0.6, 2.8, 8], tgt: [-0.4, 2.0, -3] },
  { t: 0.14, pos: [3.4, 1.6, 5.4], tgt: [3.1, 1.15, -1.8] },
  { t: 0.25, pos: [3.1, 1.6, 4.6], tgt: [3.0, 1.1, -1.8] },
  { t: 0.28, pos: [-2.55, 1.45, -2.7], tgt: [-4.5, 1.2, -6.4] },
  { t: 0.39, pos: [-2.7, 1.45, -3.1], tgt: [-4.55, 1.2, -6.4] },
  { t: 0.42, pos: [0.6, 0.45, 6.5], tgt: [0.4, 3.4, -3] },
  { t: 0.53, pos: [0.6, 0.5, 5.6], tgt: [0.4, 3.2, -3] },
  { t: 0.56, pos: [-2.6, 1.05, -3.0], tgt: [-1.95, 0.05, -4.2] },
  { t: 0.67, pos: [-2.55, 0.9, -3.25], tgt: [-1.95, 0.05, -4.2] },
  { t: 0.7, pos: [-2.2, 1.55, 1.3], tgt: [-2.35, 1.35, -2.2] },
  { t: 0.82, pos: [-2.1, 1.5, 0.7], tgt: [-2.3, 1.35, -2.2] },
  { t: 1, pos: [0.5, 5.5, 8.5], tgt: [0, 0.8, -2.5] },
];
const CAM_POS = CAM.map((k) => ({ t: k.t, v: k.pos }));
const CAM_TGT = CAM.map((k) => ({ t: k.t, v: k.tgt }));

/** High windows along the left wall and the floor patches their light falls on. */
const SHAFTS: ReadonlyArray<{ from: V3; to: V3 }> = [
  { from: [-7.9, 6.2, -4.5], to: [-2.4, 0, -4.2] },
  { from: [-7.9, 6.2, -1.5], to: [-1.5, 0, -1.8] },
  { from: [-7.9, 6.2, 1.5], to: [-0.6, 0, 1.2] },
  { from: [-7.9, 6.2, 4.5], to: [0.4, 0, 4.3] },
];

const DIM = new THREE.Color();
const RED = new THREE.Color('#ff3a40');
const GOLD = new THREE.Color('#cdb48a');

export default function WarehouseScene() {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const lightRef = useRef<InkFigureHandle>(null);
  const nearRef = useRef<InkFigureHandle>(null);
  const mikamiRef = useRef<InkFigureHandle>(null);
  const teamRefs = useRef<(InkFigureHandle | null)[]>([]);
  const standGroups = useRef<(THREE.Group | null)[]>([]);
  const door = useRef<THREE.Group>(null);
  const v = useMemo(() => new THREE.Vector3(), []);
  const size = useThree((s) => s.size);
  const tier = useRuntime((s) => s.tier);
  const profile = QUALITY_PROFILES[tier];
  const nb = useMemo(() => createNotebookState(2), []);
  const parts = useMemo(
    () => ({
      light: personParts({
        hair: 'neat',
        height: 1.79,
        clothes: '#2b2f3a',
        face: '#d9c3ad',
        hairColor: '#6e4a31',
        seed: 2,
      }),
      near: nearParts(),
      // Behind the door only a shape is visible.
      mikami: personParts({ hair: 'bob', sitting: true, build: 0.9, seed: 31 }),
      team: TEAM.map((m, i) =>
        personParts({
          hair: m.hair,
          height: m.h,
          coat: i % 2 === 0,
          clothes: i < 3 ? '#23252b' : '#2c2a27',
          face: '#b5a596',
          hairColor: i === 1 ? '#c9a46a' : '#16120f',
          seed: 40 + i,
        }),
      ),
    }),
    [],
  );

  const a = useMemo(() => {
    const wall = corrugatedTexture();
    wall.repeat.set(4, 1);
    const floor = concreteTexture();
    floor.repeat.set(4, 3);
    const shafts = SHAFTS.map((s) => ({
      geo: beamGeometry(new THREE.Vector3(...s.from), new THREE.Vector3(...s.to), 0.55, 1.1),
      mat: beamMaterial('#f1e4c8', 0.3),
    }));
    return { wall, floor, shafts };
  }, []);
  useEffect(
    () => () => {
      a.wall.dispose();
      a.floor.dispose();
      a.shafts.forEach((s) => {
        s.geo.dispose();
        s.mat.dispose();
      });
    },
    [a],
  );

  useSceneFrame((f) => {
    const p = f.reduced ? Math.round(f.progress * 6) / 6 : f.progress;
    const cam = camRef.current;
    if (!cam) return;
    const pos = keyframes(CAM_POS, p);
    const tgt = keyframes(CAM_TGT, p);
    const back = size.width / size.height < 0.9 ? 1.45 : 1;
    cam.position.set(
      tgt[0] + (pos[0] - tgt[0]) * back + f.pointer.x * 0.08,
      pos[1] + f.pointer.y * 0.04,
      tgt[2] + (pos[2] - tgt[2]) * back,
    );
    cam.lookAt(tgt[0], tgt[1], tgt[2]);
    const t = f.reduced ? 0 : f.time;

    // Forty seconds: everything holds still; the dust is the only thing moving.
    const proof = smoothstep(0.69, 0.75, p) * (1 - smoothstep(0.9, 1, p));
    DIM.setScalar(1 - 0.75 * proof);
    teamRefs.current.forEach((h) => h?.setTint(DIM));
    nearRef.current?.setTint(DIM);
    const light = lightRef.current;
    if (light) light.setRim(GOLD.clone().lerp(RED, proof));
    a.shafts[1]!.mat.uniforms.uOpacity!.value = 0.3 + 0.25 * proof;
    a.shafts.forEach((s, i) => {
      if (i !== 1) s.mat.uniforms.uOpacity!.value = 0.3 * (1 - 0.6 * proof);
    });

    // Behind the door, the pen moves in sharp strokes until the forty seconds begin.
    const writing = p < 0.45 ? 1 : 0;
    const body = mikamiRef.current?.part('body');
    if (body) body.rotation.z = Math.sin(t * 11) * 0.012 * writing;
    if (door.current) door.current.rotation.y = -0.3 - Math.sin(t * 0.4) * 0.004;
    nb.coverOpen = 1;
    nb.pages[0]!.write = 1;

    for (const g of standGroups.current) {
      if (!g) continue;
      g.getWorldPosition(v);
      g.rotation.y = Math.atan2(cam.position.x - v.x, cam.position.z - v.z);
    }
  });

  const standRef = (i: number) => (g: THREE.Group | null) => void (standGroups.current[i] = g);

  return (
    <>
      <PerspectiveCamera
        ref={camRef}
        makeDefault
        fov={38}
        near={0.05}
        far={80}
        position={[0.4, 3.4, 9.5]}
      />
      <color attach="background" args={['#0c0c0d']} />
      <fog attach="fog" args={['#121212', 8, 30]} />
      <hemisphereLight args={['#a4a5aa', '#24201b', 1.3]} />
      <directionalLight position={[-8, 7, 0]} intensity={2.2} color="#f1e2c6" />
      <pointLight position={[-3.9, 1.6, -6.9]} intensity={4} distance={5} color="#ffd9a8" />

      {/* Shell: concrete floor, corrugated walls, a dark roof. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial map={a.floor} roughness={0.85} />
      </mesh>
      <mesh position={[0, 7.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 14]} />
        <meshStandardMaterial color="#141414" roughness={1} />
      </mesh>
      {/* Back wall, built around the doorway. */}
      <mesh position={[-6.3, 3.75, -6]}>
        <planeGeometry args={[3.4, 7.5]} />
        <meshStandardMaterial map={a.wall} roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[2.25, 3.75, -6]}>
        <planeGeometry args={[11.5, 7.5]} />
        <meshStandardMaterial map={a.wall} roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[-4.05, 4.9, -6]}>
        <planeGeometry args={[1.1, 5.2]} />
        <meshStandardMaterial map={a.wall} roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[-8, 3.75, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[14, 7.5]} />
        <meshStandardMaterial map={a.wall} roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[8, 3.75, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[14, 7.5]} />
        <meshStandardMaterial map={a.wall} roughness={0.7} metalness={0.1} />
      </mesh>
      {/* High windows. */}
      {SHAFTS.map((s, i) => (
        <mesh key={i} position={[-7.98, 6.2, s.from[2]]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.6, 0.9]} />
          <meshBasicMaterial color={[2.2, 2.05, 1.8]} toneMapped={false} />
        </mesh>
      ))}
      {a.shafts.map((s, i) => (
        <mesh key={i} geometry={s.geo} material={s.mat} />
      ))}

      {/* The door, ajar, and the room behind it. */}
      <group ref={door} position={DOOR_HINGE as unknown as [number, number, number]}>
        <mesh position={[DOOR_W / 2, 1.15, 0]}>
          <boxGeometry args={[DOOR_W, 2.3, 0.05]} />
          <meshStandardMaterial color="#3b3a37" roughness={0.5} metalness={0.4} />
        </mesh>
      </group>
      <mesh position={[-4.05, 1.5, -8.6]}>
        <planeGeometry args={[4, 3]} />
        <meshBasicMaterial color={[1.25, 1.12, 0.95]} toneMapped={false} />
      </mesh>
      <group position={[-3.9, 0, -7.3]}>
        <InkFigure ref={mikamiRef} parts={parts.mikami} rimColor="#000000" />
      </group>

      {/* The forged notebook on the floor, in the light. */}
      <group
        position={NOTEBOOK_AT as unknown as [number, number, number]}
        rotation={[0, 0.5, 0]}
        scale={0.2}
      >
        <NotebookModel state={nb} textureSize={1024} castShadow={false} />
      </group>

      <group ref={standRef(0)} position={LIGHT_AT as unknown as [number, number, number]}>
        <InkFigure ref={lightRef} parts={parts.light} rimColor="#cdb48a" />
      </group>
      <group ref={standRef(1)} position={NEAR_AT as unknown as [number, number, number]}>
        <InkFigure ref={nearRef} parts={parts.near} inkColor="#2e2c28" rimColor="#ffffff" />
      </group>
      {TEAM.map((m, i) => (
        <group key={i} ref={standRef(2 + i)} position={[m.x, 0, m.z]}>
          <InkFigure
            ref={(h) => void (teamRefs.current[i] = h)}
            parts={parts.team[i]!}
            rimColor="#a9a497"
          />
        </group>
      ))}

      {profile.particles > 0.2 ? (
        <Motes
          count={Math.round(420 * profile.particles)}
          box={DUST_BOX}
          position={DUST_POS}
          drift={DUST_DRIFT}
          color="#efe3cc"
          size={9}
          opacity={0.5}
          seed={14}
        />
      ) : null}
    </>
  );
}

const DUST_BOX: [number, number, number] = [9, 6, 11];
const DUST_POS: [number, number, number] = [-3, 3, 0];
const DUST_DRIFT: [number, number, number] = [0.01, -0.005, 0];
