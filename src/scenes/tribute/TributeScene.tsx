import { Suspense, use, useEffect, useMemo, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ensureCanvasFonts } from '@/app/fonts';
import { damp, easeInOutSine, keyframes, lerp, smoothstep } from '@/utils/math';
import { Motes } from '../props/Motes';
import { NotebookModel } from '../props/notebook/NotebookModel';
import { createNotebookState } from '../props/notebook/notebookState';
import { Pencil } from '../props/Pencil';
import { QUALITY_PROFILES, type QualityTier } from '../shared/quality';
import { DipPen, Eraser, InkBottle } from './DeskProps';
import { createPageInk, DraftingPage, PAGE_W, pageToWorld } from './DraftingPage';
import { penAt, type PenSample } from './inkLayer';
import { buildArt, buildStory, buildTogether } from './pageLayers';
import { boardWood, windowCookie } from './tributeTextures';
import { scrollToT, timeline, win, WINDOWS } from './tributeTimeline';
import { CAM_DESKTOP, CAM_PORTRAIT, TRACK, type V3 } from './tributeCamera';

let fontsPromise: Promise<void> | null = null;
const fontsReady = () => (fontsPromise ??= ensureCanvasFonts());

const KEY_POS: V3 = [6.2, 8.6, -5.2];
const NOTEBOOK_POS: V3 = [4.6, 0, -0.1];
const PENCIL_REST = { tip: new THREE.Vector3(-1.5, 0.034, 1.05), yaw: 1.05 };
const PEN_REST = { tip: new THREE.Vector3(-1.55, 0.036, -0.4), yaw: -0.35 };

const X = new THREE.Vector3(1, 0, 0);
const restQuat = (yaw: number) => new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0));
const writeQuat = (d: V3) => new THREE.Quaternion().setFromUnitVectors(X, new THREE.Vector3(...d).normalize());

interface Props {
  tier: QualityTier;
  reduced: boolean;
  onReady: () => void;
}

/**
 * The tribute's drafting table in morning light (SPEC §8.2). One blank B4
 * manuscript page; Ohba's section writes and branches words in pencil, Obata's
 * draws ink compositions, "Together" inks the words into the drawing, and the
 * final page closes a black notebook while the light goes quiet.
 */
export function TributeScene({ tier, reduced, onReady }: Props) {
  use(fontsReady());
  const profile = QUALITY_PROFILES[tier];
  const layers = useMemo(() => ({ story: buildStory(), art: buildArt(), together: buildTogether() }), []);
  const ink = useMemo(createPageInk, []);
  const nb = useMemo(() => createNotebookState(1), []);

  const env = useMemo(() => {
    const wood = boardWood();
    const cookie = windowCookie();
    const tableGeo = new THREE.PlaneGeometry(26, 18);
    tableGeo.rotateX(-Math.PI / 2);
    const tableMat = new THREE.MeshStandardMaterial({ map: wood, roughness: 0.82, color: '#efe6d6' });
    return { wood, cookie, tableGeo, tableMat };
  }, []);
  useEffect(
    () => () => {
      env.wood.dispose();
      env.cookie.dispose();
      env.tableGeo.dispose();
      env.tableMat.dispose();
    },
    [env],
  );

  const cam = useRef<THREE.PerspectiveCamera>(null);
  const key = useRef<THREE.SpotLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const pencil = useRef<THREE.Group>(null);
  const pen = useRef<THREE.Group>(null);
  const motes = useRef<THREE.Group>(null);

  const rig = useMemo(
    () => ({
      T: -1,
      born: -1,
      frames: 0,
      track: new THREE.Vector3(),
      trackInit: false,
      tip: { x: 0, y: 0, lift: 0 },
      v: new THREE.Vector3(),
      pos: new THREE.Vector3(),
      tgt: new THREE.Vector3(),
      tPos: new THREE.Vector3(),
      tTgt: new THREE.Vector3(),
      q: new THREE.Quaternion(),
      pencilRest: restQuat(PENCIL_REST.yaw),
      pencilWrite: writeQuat([-0.5, -0.64, -0.58]),
      penRest: restQuat(PEN_REST.yaw),
      penWrite: writeQuat([-0.45, -0.72, -0.52]),
      warm: new THREE.Color('#ffe2bd'),
      cool: new THREE.Color('#e6e4e0'),
      motesMat: null as THREE.ShaderMaterial | null,
    }),
    [],
  );

  useEffect(() => {
    const k = key.current;
    if (!k) return;
    k.map = profile.shadows ? env.cookie : null;
    k.shadow.mapSize.set(profile.shadowMapSize, profile.shadowMapSize);
    k.shadow.needsUpdate = true;
  }, [env, profile]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const now = state.clock.elapsedTime;
    if (rig.born < 0) rig.born = now;
    if (++rig.frames === 3) onReady();

    // Scroll → T (damped for a soft camera; reduced motion holds compositions).
    const target = timeline.measured ? scrollToT(window.scrollY) : 0.5;
    rig.T = rig.T < 0 || reduced ? target : damp(rig.T, target, 3.2, dt);
    const T = rig.T;

    // Ink.
    if (reduced) {
      ink.fade = 1;
      ink.story = smoothstep(0.85, 1.25, T);
      ink.art = smoothstep(1.85, 2.25, T);
      ink.together = smoothstep(2.85, 3.25, T);
    } else {
      ink.fade = 0;
      ink.story = win(T, WINDOWS.story) * 1.01;
      ink.art = win(T, WINDOWS.art) * 1.01;
      ink.together = win(T, WINDOWS.together) * 1.01;
    }
    ink.pencil = 1 - 0.62 * smoothstep(2.05, 2.5, T) + 0.3 * smoothstep(3.0, 3.3, T);

    // Pen tip position on the page (page units), for the camera and the props.
    const tip = rig.tip;
    let pencilW = 0;
    let penW = 0;
    if (!reduced) {
      pencilW = smoothstep(0.86, 1.03, T) * (1 - smoothstep(1.86, 2.0, T));
      penW = smoothstep(1.9, 2.05, T) * (1 - smoothstep(3.72, 3.88, T));
    }
    const art = layers.art.samples;
    const tog = layers.together.samples;
    if (T < 1.95) penAt(layers.story.samples, ink.story, tip);
    else if (T <= WINDOWS.art[1]) penAt(art, ink.art, tip);
    else if (T < WINDOWS.together[0]) travel(art, tog, range01(T, WINDOWS.art[1], WINDOWS.together[0]), tip);
    else penAt(tog, ink.together, tip);

    // Props follow the tip; rest on the table otherwise.
    poseTool(pencil.current, rig, tip, pencilW, PENCIL_REST, rig.pencilRest, rig.pencilWrite);
    poseTool(pen.current, rig, tip, penW, PEN_REST, rig.penRest, rig.penWrite);

    // Camera: overview keyframes blended with a close shot that follows the tip.
    const portrait = state.size.width / Math.max(1, state.size.height) < 0.9;
    const keys = portrait ? CAM_PORTRAIT : CAM_DESKTOP;
    const Tc = reduced ? heldT(T) : T;
    rig.pos.set(...keyframes(keys.pos, Tc, easeInOutSine));
    rig.tgt.set(...keyframes(keys.tgt, Tc, easeInOutSine));
    // Portrait text covers the whole width, so the page is held whole instead.
    const trackW = reduced || portrait
      ? 0
      : easeInOutSine(smoothstep(0.62, 1.04, T) * (1 - smoothstep(2.86, 3.12, T)));
    if (trackW > 0) {
      pageToWorld(tip.x, tip.y, rig.v);
      if (!rig.trackInit) rig.track.copy(rig.v);
      rig.trackInit = true;
      rig.track.x = damp(rig.track.x, rig.v.x, 1.6, dt);
      rig.track.z = damp(rig.track.z, rig.v.z, 1.6, dt);
      const tr = portrait ? TRACK.portrait : TRACK.desktop;
      rig.tTgt.set(rig.track.x + tr.offset[0], 0, rig.track.z + tr.offset[2]);
      rig.tPos.set(rig.tTgt.x + tr.eye[0], tr.eye[1], rig.tTgt.z + tr.eye[2]);
      rig.pos.lerp(rig.tPos, trackW);
      rig.tgt.lerp(rig.tTgt, trackW);
    }
    const c = cam.current;
    if (c) {
      const drift = reduced ? 0 : 1;
      c.position.set(
        rig.pos.x + Math.sin(now * 0.11) * 0.03 * drift,
        rig.pos.y,
        rig.pos.z + Math.cos(now * 0.09) * 0.02 * drift,
      );
      c.lookAt(rig.tgt);
      const fov = portrait ? 40 : 30;
      if (c.fov !== fov) {
        c.fov = fov;
        c.updateProjectionMatrix();
      }
    }

    // Notebook: lies open at the table's edge; closes softly on the final page.
    // Open on a blank spread (first leaf turned over the inside cover); the leaf
    // falls back, then the cover closes.
    const shut = reduced ? (T > 5.3 ? 1 : 0) : win(T, WINDOWS.close);
    const leaf = nb.pages[0];
    if (leaf) leaf.turn = 1 - smoothstep(0, 0.42, shut);
    nb.coverOpen = 1 - smoothstep(0.32, 1, shut);

    // Light: morning arrives on load; the room goes quiet at the end.
    const arrive = reduced ? 1 : smoothstep(0, 2.8, now - rig.born);
    const quiet = win(T, WINDOWS.quiet);
    if (key.current) {
      key.current.intensity = lerp(0.8, 3.4, arrive) * (1 - 0.5 * quiet);
      key.current.color.copy(rig.warm).lerp(rig.cool, quiet);
    }
    if (hemi.current) hemi.current.intensity = lerp(1.7, 1.35, quiet);
    if (motes.current) {
      if (!rig.motesMat) {
        const pts = motes.current.children[0] as THREE.Points | undefined;
        rig.motesMat = (pts?.material as THREE.ShaderMaterial | undefined) ?? null;
      }
      const u = rig.motesMat?.uniforms.uOpacity;
      if (u) u.value = arrive * (1 - quiet) * 0.85;
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cam} makeDefault fov={30} near={0.1} far={60} position={[0, 6.3, 2]} />
      <color attach="background" args={['#cbbfa9']} />
      <fog attach="fog" args={['#cbbfa9', 9, 22]} />
      <hemisphereLight ref={hemi} args={['#fff6ea', '#b9a98f', 1.7]} />
      <spotLight
        ref={key}
        position={KEY_POS}
        angle={0.42}
        penumbra={0.55}
        decay={0}
        intensity={2.7}
        color="#ffe2bd"
        castShadow={profile.shadows}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-near={6}
        shadow-camera-far={22}
      />
      <mesh geometry={env.tableGeo} material={env.tableMat} receiveShadow />
      <DraftingPage layers={layers} ink={ink} textureWidth={Math.round(profile.textureSize * 0.6)} />
      <group ref={pencil}>
        <Pencil position={[-1.0, 0, 0]} />
      </group>
      <DipPen ref={pen} />
      <Eraser position={[-2.05, 0, -2.2]} rotation={[0, 0.42, 0]} />
      <InkBottle position={[-2.65, 0, -1.35]} rotation={[0, 0.3, 0]} />
      <group position={NOTEBOOK_POS} rotation={[0, -0.04, 0]}>
        <Suspense fallback={null}>
          <NotebookModel state={nb} textureSize={Math.min(1024, profile.textureSize)} castShadow={profile.shadows} />
        </Suspense>
      </group>
      {reduced ? null : (
        <group ref={motes}>
          <Motes
            count={Math.round(240 * profile.particles)}
            box={MOTE_BOX}
            position={MOTE_POS}
            color="#fff0d4"
            size={11}
            opacity={0}
            beam={MOTE_BEAM}
            drift={MOTE_DRIFT}
            seed={12}
          />
        </group>
      )}
    </>
  );
}

const MOTE_BOX: [number, number, number] = [6, 3, 5];
const MOTE_POS: [number, number, number] = [0.8, 1.6, -0.6];
const MOTE_BEAM = { pos: [...KEY_POS] as [number, number, number], target: [0, 0, 0] as [number, number, number], angle: 0.42 };
const MOTE_DRIFT: [number, number, number] = [-0.006, -0.004, 0.003];

const range01 = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));

/** Reduced motion: one held composition per section. */
function heldT(T: number): number {
  return Math.min(5.5, Math.floor(T) + 0.5);
}

/** Lifted travel from the end of one pen path to the start of the next. */
function travel(a: readonly PenSample[], b: readonly PenSample[], f: number, out: { x: number; y: number; lift: number }) {
  const p = a[a.length - 1];
  const q = b[0];
  if (!p || !q) return;
  const e = easeInOutSine(f);
  out.x = lerp(p.x, q.x, e);
  out.y = lerp(p.y, q.y, e);
  out.lift = Math.sin(f * Math.PI) * 0.12;
}

interface Rig {
  v: THREE.Vector3;
  q: THREE.Quaternion;
}

/** Place a tool by its tip: blend from its resting pose to the writing pose. */
function poseTool(
  g: THREE.Group | null,
  rig: Rig,
  tip: { x: number; y: number; lift: number },
  w: number,
  rest: { tip: THREE.Vector3 },
  qRest: THREE.Quaternion,
  qWrite: THREE.Quaternion,
): void {
  if (!g) return;
  const e = easeInOutSine(w);
  pageToWorld(tip.x, tip.y, rig.v);
  rig.v.y += tip.lift * PAGE_W * 0.4 + 0.004;
  g.position.lerpVectors(rest.tip, rig.v, e);
  g.position.y += Math.sin(e * Math.PI) * 0.6;
  rig.q.slerpQuaternions(qRest, qWrite, e);
  g.quaternion.copy(rig.q);
}
