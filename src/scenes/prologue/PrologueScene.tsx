import { useMemo, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { RyukSilhouette, type RyukSilhouetteHandle } from '@/characters/ryuk/RyukSilhouette';
import { useRuntime } from '@/state/runtime';
import { clamp, keyframes, lerp, range, smoothstep } from '@/utils/math';
import { urlFlags } from '@/utils/urlFlags';
import { Motes } from '../props/Motes';
import { NotebookModel } from '../props/notebook/NotebookModel';
import { createNotebookState } from '../props/notebook/notebookState';
import { QUALITY_PROFILES } from '../shared/quality';
import { useSceneFrame } from '../shared/sceneFrame';
import { CityGrid } from './CityGrid';
import { CloudLayers } from './CloudLayers';
import { Rain } from './Rain';
import { RealmTerrain } from './RealmTerrain';
import { SkyDome } from './SkyDome';
import { humanWorldBlend, WORLD } from './world';

/**
 * Chapter 00 — Prologue (docs/SCENE_SPECIFICATIONS.md §00). One unbroken
 * vertical shot: the realm, Ryuk at the hole, the notebook's fall through the
 * cloud decks, and its landing in a school courtyard in Tokyo.
 */

type V3 = readonly [number, number, number];
const R = WORLD.realmY;
const RY = WORLD.ryuk;

/** Realm shots (before the fall). */
const REALM_POS: ReadonlyArray<{ t: number; v: V3 }> = [
  { t: 0.0, v: [-40, R + 16, 62] },
  { t: 0.12, v: [-34, R + 12, 48] },
  { t: 0.28, v: [-16, R + 5.5, 17] },
  { t: 0.4, v: [-7.6, R + 3.1, 5.6] },
  { t: 0.46, v: [-5.4, R + 3.3, 3.4] },
];
const REALM_TGT: ReadonlyArray<{ t: number; v: V3 }> = [
  { t: 0.0, v: [-8, R + 12, -90] },
  { t: 0.12, v: [-6, R + 4, -20] },
  { t: 0.28, v: [-3.6, R + 2.2, -1] },
  { t: 0.4, v: [-3.4, R + 2.0, -0.6] },
  { t: 0.46, v: [-2.6, R + 1.2, -0.5] },
];

/** Notebook altitude during the fall (linear segments: it never stops). */
const FALL_Y: ReadonlyArray<{ t: number; v: number }> = [
  { t: 0.46, v: R + 2.0 },
  { t: 0.49, v: R - 6 },
  { t: 0.57, v: 245 },
  { t: 0.69, v: 125 },
  { t: 0.83, v: 22 },
  { t: 0.92, v: WORLD.landing[1] },
];

/** Camera offset from the notebook during the fall. */
const FALL_OFFSET: ReadonlyArray<{ t: number; v: V3 }> = [
  { t: 0.46, v: [-1.6, 2.4, 2.6] },
  { t: 0.5, v: [0.6, 2.6, 1.2] },
  { t: 0.62, v: [1.2, 3.4, 2.0] },
  { t: 0.78, v: [5, 9, 9] },
  { t: 0.88, v: [3.2, 2.6, 5.2] },
  { t: 1.0, v: [2.1, 0.9, 3.0] },
];

const REDUCED_ANCHORS = [0.04, 0.2, 0.34, 0.44, 0.6, 0.8, 0.97];

const ASH_BOX: [number, number, number] = [90, 30, 90];
const ASH_POS: [number, number, number] = [-6, R + 10, 0];
const ASH_DRIFT: [number, number, number] = [0.35, -0.12, 0.08];

const REALM_FOG = new THREE.Color('#1d1c1a');
const NIGHT_FOG = new THREE.Color('#07090d');

function quantize(p: number, anchors: readonly number[]): number {
  let best = anchors[0]!;
  for (const a of anchors) if (p >= a - 0.07) best = a;
  return best;
}

export default function PrologueScene() {
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const ryukRef = useRef<RyukSilhouetteHandle>(null);
  const ryukGroup = useRef<THREE.Group>(null);
  const nbRef = useRef<THREE.Group>(null);
  const fogRef = useRef<THREE.FogExp2>(null);
  const realmLights = useRef<THREE.Group>(null);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const realmHemi = useRef<THREE.HemisphereLight>(null);
  const nightHemi = useRef<THREE.HemisphereLight>(null);
  const moonRef = useRef<THREE.DirectionalLight>(null);
  const lampRef = useRef<THREE.PointLight>(null);
  const blend = useRef(0);
  const rain = useRef(0);
  const tier = useRuntime((s) => s.tier);
  const profile = QUALITY_PROFILES[tier];
  const nbState = useMemo(() => createNotebookState(5), []);
  const tmp = useMemo(
    () => ({ hand: new THREE.Vector3(), nb: new THREE.Vector3(), cam: new THREE.Vector3(), tgt: new THREE.Vector3(), e: new THREE.Euler() }),
    [],
  );

  useSceneFrame((f, state) => {
    const p = f.reduced ? quantize(f.progress, REDUCED_ANCHORS) : f.progress;
    const cam = camRef.current;
    const nb = nbRef.current;
    const ryuk = ryukRef.current;
    if (!cam || !nb || !ryuk) return;

    // --- Ryuk -----------------------------------------------------------
    const release = range(p, 0.445, 0.47);
    ryuk.pose(f.time, lerp(-0.05, -0.22, range(p, 0.38, 0.5)), lerp(0, 0.18, release), 0.55 + 0.45 * smoothstep(0.2, 0.36, p));
    // Billboard yaw so the flat silhouette always faces the lens.
    if (ryukGroup.current) {
      const dx = cam.position.x - ryukGroup.current.position.x;
      const dz = cam.position.z - ryukGroup.current.position.z;
      ryukGroup.current.rotation.y = clamp(Math.atan2(dx, dz), -0.9, 0.9);
    }

    // --- Notebook -------------------------------------------------------
    ryuk.handWorld(tmp.hand);
    const falling = p >= 0.46;
    if (!falling) {
      nb.position.copy(tmp.hand);
      nb.rotation.set(-Math.PI / 2 + 0.1, 0.4, 0.05);
    } else {
      const y = keyframes(FALL_Y, p, (t) => t);
      const t = range(p, 0.46, 0.92);
      const drift = Math.sin(t * Math.PI);
      const startX = tmp.hand.x;
      const x = lerp(startX, WORLD.landing[0], smoothstep(0, 1, t)) + drift * 1.4;
      const z = lerp(tmp.hand.z, WORLD.landing[2], smoothstep(0, 1, t)) + Math.sin(t * 9) * 0.6 * drift;
      nb.position.set(x, y, z);
      const land = smoothstep(0.86, 0.92, p);
      const spin = t * 26;
      tmp.e.set(spin * 0.9 * (1 - land), spin * 0.37 * (1 - land) + land * 0.65, spin * 0.61 * (1 - land));
      nb.rotation.copy(tmp.e);
    }

    // --- Camera ---------------------------------------------------------
    if (!falling) {
      const pos = keyframes(REALM_POS, p);
      const tgt = keyframes(REALM_TGT, p);
      tmp.cam.set(pos[0], pos[1], pos[2]);
      tmp.tgt.set(tgt[0], tgt[1], tgt[2]);
    } else {
      const off = keyframes(FALL_OFFSET, p);
      tmp.cam.set(nb.position.x + off[0], nb.position.y + off[1], nb.position.z + off[2]);
      const look = 1 - smoothstep(0.82, 0.93, p);
      tmp.tgt.set(nb.position.x, nb.position.y - 12 * look, nb.position.z);
    }
    // Arrival from the gate / previous content: settle from slightly above.
    tmp.cam.y += (1 - f.enter) * 3;
    tmp.cam.x += f.pointer.x * 0.5;
    tmp.cam.y += f.pointer.y * 0.3;
    // Never let the camera sink into the ground at the landing.
    tmp.cam.y = Math.max(tmp.cam.y, 0.35);
    cam.position.copy(tmp.cam);
    cam.lookAt(tmp.tgt);
    if (urlFlags.debug) {
      (window as unknown as { __DN_CAM__?: unknown }).__DN_CAM__ = {
        p: Math.round(p * 1000) / 1000,
        cam: cam.position.toArray().map((v) => Math.round(v * 10) / 10),
        nb: nb.position.toArray().map((v) => Math.round(v * 10) / 10),
      };
    }

    // --- World blend: realm ↔ human night -------------------------------
    const w = humanWorldBlend(cam.position.y);
    blend.current = w;
    rain.current = smoothstep(150, 60, cam.position.y);
    const fog = fogRef.current;
    if (fog) {
      fog.color.copy(REALM_FOG).lerp(NIGHT_FOG, w);
      fog.density = lerp(0.0105, 0.0024, w);
    }
    if (sunRef.current) sunRef.current.intensity = 1.5 * (1 - w);
    if (realmHemi.current) realmHemi.current.intensity = 0.65 * (1 - w);
    if (nightHemi.current) nightHemi.current.intensity = 0.55 * w;
    if (moonRef.current) moonRef.current.intensity = 0.35 * w;
    if (lampRef.current) lampRef.current.intensity = 60 * smoothstep(60, 8, cam.position.y);
    if (realmLights.current) realmLights.current.visible = w < 0.999;
    state.scene.background = null;
  });

  const ashCount = Math.round(900 * profile.particles);

  return (
    <>
      <PerspectiveCamera ref={camRef} makeDefault fov={38} near={0.08} far={2600} position={[-40, R + 16, 62]} />
      <fogExp2 ref={fogRef} attach="fog" args={['#1d1c1a', 0.0105]} />
      <SkyDome blendRef={blend} />

      {/* Realm lighting */}
      <group ref={realmLights}>
        <directionalLight ref={sunRef} position={[18, R + 10, -100]} color="#c2bcae" intensity={1.5} />
        <hemisphereLight ref={realmHemi} args={['#45433e', '#121110', 0.65]} />
      </group>
      {/* Human world lighting */}
      <hemisphereLight ref={nightHemi} args={['#1b2233', '#0a0806', 0]} />
      <directionalLight ref={moonRef} position={[-40, 120, 60]} color="#7b8db5" intensity={0} />
      <pointLight
        ref={lampRef}
        position={[3.2, 4.8, -2.2]}
        color="#ffbf80"
        intensity={0}
        distance={30}
        decay={2}
        castShadow={profile.shadows}
        shadow-mapSize={[512, 512]}
      />

      <RealmTerrain density={profile.particles >= 0.6 ? 1 : 0.55} />
      <group ref={ryukGroup} position={[RY[0], RY[1], RY[2]]}>
        <RyukSilhouette ref={ryukRef} />
      </group>
      {ashCount > 0 ? (
        <Motes count={ashCount} box={ASH_BOX} position={ASH_POS} drift={ASH_DRIFT} color="#b8b2a4" size={34} opacity={0.42} seed={9} />
      ) : null}

      <CloudLayers quality={profile.particles} />
      <CityGrid density={profile.particles >= 0.6 ? 1 : 0.5} />
      <Rain count={Math.round(1400 * profile.particles)} opacityRef={rain} />

      <group ref={nbRef} scale={WORLD.notebookScale}>
        {/* Centre the model on its own origin so it tumbles around its middle. */}
        <group position={[-0.74, -0.08, 0]}>
          <NotebookModel state={nbState} textureSize={Math.min(1024, profile.textureSize)} castShadow={profile.shadows} />
        </group>
      </group>
    </>
  );
}
