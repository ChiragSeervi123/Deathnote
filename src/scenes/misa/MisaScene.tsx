import { use, useEffect, useMemo, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ensureCanvasFonts } from '@/app/fonts';
import { misaParts } from '@/characters/misa/misa';
import { remParts } from '@/characters/rem/rem';
import { InkFigure, type InkFigureHandle } from '@/characters/shared/InkFigure';
import { personParts } from '@/characters/shared/people';
import { useRuntime } from '@/state/runtime';
import { keyframes, range, smoothstep } from '@/utils/math';
import { Motes } from '../props/Motes';
import { glowTexture } from '../shared/canvasTextures';
import { QUALITY_PROFILES } from '../shared/quality';
import { useSceneFrame } from '../shared/sceneFrame';
import { buildCrowd } from './crowd';
import { archesGeometry, labelAtlas, tapeTexture, tvFragment, tvVertex } from './stageAssets';

/**
 * Chapter 07 — Misa Amane. A gothic, monochrome stage: Misa in a pale
 * spotlight, Rem looming behind her, the second Kira's tape on a television,
 * and the crowd as the Eyes see it — names and lifespans above every head
 * except one.
 */
type V3 = readonly [number, number, number];

const REM_AT: V3 = [0.85, 0, -1.3];
const TV_AT: V3 = [-3.6, 0, 0.6];
const LIGHT_AT = [-1.45, 5.4] as const;
/** Where Light stands once she has found him: beside her, at the edge of the light. */
const LIGHT_STAGE = [-1.25, 0.5] as const;
const BG = '#060608';
const FOG: readonly [number, number] = [9, 30];
const MOTE_BOX: [number, number, number] = [2.4, 5, 2.4];
const MOTE_POS: [number, number, number] = [0, 2.5, 0];
const MOTE_DRIFT: [number, number, number] = [0, 0.02, 0];

const CAM: ReadonlyArray<{ t: number; pos: V3; tgt: V3 }> = [
  { t: 0, pos: [1.4, 1.7, 8], tgt: [1.3, 1.5, 0] },
  { t: 0.11, pos: [1.0, 1.55, 6.2], tgt: [1.1, 1.3, 0] },
  { t: 0.13, pos: [-4.25, 1.25, 3.0], tgt: [-4.1, 1.05, 0.6] },
  { t: 0.25, pos: [-4.15, 1.2, 2.6], tgt: [-4.05, 1.05, 0.6] },
  { t: 0.27, pos: [0.5, 1.42, 2.6], tgt: [0.55, 1.3, 0] },
  { t: 0.39, pos: [0.45, 1.42, 2.2], tgt: [0.5, 1.3, 0] },
  { t: 0.41, pos: [-0.9, 1.5, 5.6], tgt: [-0.45, 1.75, -0.6] },
  { t: 0.53, pos: [-0.9, 1.6, 5.0], tgt: [-0.45, 1.8, -0.6] },
  { t: 0.55, pos: [0.2, 1.46, 1.0], tgt: [0.21, 1.44, 0] },
  { t: 0.675, pos: [0.18, 1.46, 0.85], tgt: [0.2, 1.44, 0] },
  { t: 0.68, pos: [0.06, 1.5, 0.3], tgt: [-0.4, 1.6, 7] },
  { t: 0.82, pos: [0.06, 1.5, 0.4], tgt: [-0.55, 1.65, 7] },
  { t: 0.835, pos: [0.9, 1.9, 7.4], tgt: [1.0, 1.55, 0] },
  { t: 1, pos: [0.8, 1.8, 6.4], tgt: [0.95, 1.5, 0] },
];
const CAM_POS = CAM.map((k) => ({ t: k.t, v: k.pos }));
const CAM_TGT = CAM.map((k) => ({ t: k.t, v: k.tgt }));

const conVertex = /* glsl */ `
varying float vY;
varying float vFacing;
void main() {
  vY = position.y / 6.0 + 0.5;
  vec3 n = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vFacing = abs(dot(n, normalize(-mv.xyz)));
  gl_Position = projectionMatrix * mv;
}
`;
const conFragment = /* glsl */ `
precision highp float;
uniform float uOpacity;
varying float vY;
varying float vFacing;
void main() {
  float a = max(uOpacity * (0.35 + 0.65 * vY) * pow(max(vFacing, 1e-3), 1.6), 0.0);
  gl_FragColor = vec4(vec3(0.92, 0.94, 1.0) * a, a);
}
`;

let fontsPromise: Promise<void> | null = null;
const TINT = new THREE.Color();

export default function MisaScene() {
  use((fontsPromise ??= ensureCanvasFonts()));
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const misaRef = useRef<InkFigureHandle>(null);
  const remRef = useRef<InkFigureHandle>(null);
  const lightGroup = useRef<THREE.Group>(null);
  const crowdGroup = useRef<THREE.Group>(null);
  const remHalo = useRef<THREE.MeshBasicMaterial>(null);
  const size = useThree((s) => s.size);
  const tier = useRuntime((s) => s.tier);
  const profile = QUALITY_PROFILES[tier];
  const misa = useMemo(misaParts, []);
  const rem = useMemo(remParts, []);
  const light = useMemo(
    () =>
      personParts({
        hair: 'neat',
        height: 1.79,
        build: 0.95,
        clothes: '#3a3f4c',
        face: '#cdb9a6',
        hairColor: '#6e4a31',
        seed: 2,
      }),
    [],
  );

  const a = useMemo(() => {
    const arches = archesGeometry();
    const glow = glowTexture();
    const atlas = labelAtlas('LIGHT YAGAMI');
    const tape = tapeTexture();
    const tvMat = new THREE.ShaderMaterial({
      vertexShader: tvVertex,
      fragmentShader: tvFragment,
      uniforms: { uMap: { value: tape }, uTime: { value: 0 }, uSignal: { value: 0 } },
      toneMapped: false,
    });
    const coneGeo = new THREE.ConeGeometry(1.25, 6, 40, 1, true);
    const coneMat = new THREE.ShaderMaterial({
      vertexShader: conVertex,
      fragmentShader: conFragment,
      uniforms: { uOpacity: { value: 0.16 } },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const crowd = buildCrowd(
      Math.round(150 * Math.max(0.4, profile.particles)),
      LIGHT_AT,
      1.79,
      atlas,
      new THREE.Color(BG),
      FOG,
    );
    return { arches, glow, atlas, tape, tvMat, coneGeo, coneMat, crowd };
  }, [profile.particles]);
  useEffect(
    () => () => {
      a.arches.dispose();
      a.glow.dispose();
      a.atlas.dispose();
      a.tape.dispose();
      a.tvMat.dispose();
      a.coneGeo.dispose();
      a.coneMat.dispose();
      a.crowd.dispose();
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
      tgt[0] + (pos[0] - tgt[0]) * back + f.pointer.x * 0.08,
      pos[1] + f.pointer.y * 0.04,
      tgt[2] + (pos[2] - tgt[2]) * back,
    );
    cam.lookAt(tgt[0], tgt[1], tgt[2]);
    const t = f.reduced ? 0 : f.time;

    // Misa breathes; her pigtails sway a beat behind her head.
    const m = misaRef.current;
    if (m) {
      const head = m.part('head');
      if (head) head.rotation.z = Math.sin(t * 0.7) * 0.03 + 0.02;
      const l = m.part('tailL');
      const r = m.part('tailR');
      if (l) l.rotation.z = Math.sin(t * 1.3 - 0.6) * 0.06;
      if (r) r.rotation.z = Math.sin(t * 1.3 - 0.9) * 0.06;
      // The Eyes: the trade is made in the Eyes beat and they stay open after it.
      const eyes = smoothstep(0.57, 0.62, p);
      const eyesPart = m.part('eyesRed');
      if (eyesPart) eyesPart.visible = eyes > 0.01;
      m.setGlow(eyes * (1 + Math.sin(t * 2.2) * 0.12));
    }

    // Rem stands in the dark from the start and is lit when she enters the story.
    const remK = 0.04 + 0.96 * smoothstep(0.4, 0.47, p);
    const r = remRef.current;
    if (r) {
      r.setTint(TINT.setScalar(remK));
      // The promise: her eyes burn in the final beat.
      r.setGlow(0.6 + 1.6 * smoothstep(0.86, 0.92, p));
      const head = r.part('head');
      if (head) head.rotation.z = -0.04 + Math.sin(t * 0.3) * 0.015;
    }
    if (remHalo.current) remHalo.current.opacity = 0.42 * remK;

    // The tape: snow, then the message.
    a.tvMat.uniforms.uTime!.value = t;
    a.tvMat.uniforms.uSignal!.value = smoothstep(0.155, 0.19, p);

    // The crowd exists only once she looks through the Eyes.
    // In the final beat the crowd is gone and Light stands with her.
    const crowdOn = p > 0.6 && p < 0.83;
    if (crowdGroup.current) crowdGroup.current.visible = crowdOn;
    const lg = lightGroup.current;
    if (lg) {
      const at = p < 0.83 ? LIGHT_AT : LIGHT_STAGE;
      lg.visible = p > 0.6;
      lg.position.set(at[0], 0, at[1]);
      lg.rotation.y = Math.atan2(cam.position.x - at[0], cam.position.z - at[1]);
    }
    a.crowd.labelMat.uniforms.uOpacity!.value =
      range(p, 0.69, 0.74) * (1 - 0.35 * smoothstep(0.9, 1, p));
  });

  return (
    <>
      <PerspectiveCamera
        ref={camRef}
        makeDefault
        fov={35}
        near={0.05}
        far={120}
        position={[1.4, 1.7, 8]}
      />
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, FOG[0], FOG[1]]} />
      <hemisphereLight args={['#8d93a3', '#060608', 0.35]} />
      <spotLight
        position={[0, 6.2, 0.8]}
        angle={0.32}
        penumbra={0.6}
        intensity={60}
        distance={14}
        color="#eef0ff"
      />

      {/* Stage floor, the pale pool under the spotlight, and the beam itself. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0c0c0f" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 0]}>
        <planeGeometry args={[3.6, 3.6]} />
        <meshBasicMaterial
          map={a.glow}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#c9cede"
        />
      </mesh>
      {/* Rotated so the cone's seam faces away from every camera. */}
      <mesh
        geometry={a.coneGeo}
        material={a.coneMat}
        position={[0, 3, 0]}
        rotation={[0, Math.PI, 0]}
      />

      {/* Gothic arches against a cold backlight. */}
      <mesh position={[0, 3.2, -6.4]}>
        <planeGeometry args={[18, 9]} />
        <meshBasicMaterial
          map={a.glow}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color="#5c6274"
        />
      </mesh>
      <mesh geometry={a.arches} position={[0, 0, -6]}>
        <meshBasicMaterial color="#09090b" side={THREE.DoubleSide} />
      </mesh>

      {/* Rem, looming behind her. */}
      <group position={REM_AT as unknown as [number, number, number]}>
        <mesh position={[0, 1.9, -0.25]} renderOrder={-1}>
          <planeGeometry args={[4.6, 4.6]} />
          <meshBasicMaterial
            ref={remHalo}
            map={a.glow}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            color="#d6dbe3"
            opacity={0.1}
            toneMapped={false}
          />
        </mesh>
        <InkFigure
          ref={remRef}
          parts={rem}
          inkColor="#1b1a18"
          rimColor="#e8e3d8"
          rimOffset={[-0.006, 0.008]}
        />
      </group>

      <InkFigure ref={misaRef} parts={misa} rimColor="#e9e6f2" rimOffset={[0.004, 0.007]} />

      {/* The second Kira's tape. */}
      <group position={TV_AT as unknown as [number, number, number]} rotation={[0, 0.3, 0]}>
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[0.8, 0.76, 0.5]} />
          <meshStandardMaterial color="#141317" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.07, -0.02]}>
          <boxGeometry args={[0.78, 0.62, 0.56]} />
          <meshStandardMaterial color="#1d1c21" roughness={0.45} metalness={0.2} />
        </mesh>
        <mesh position={[0, 1.08, 0.262]} material={a.tvMat}>
          <planeGeometry args={[0.62, 0.465]} />
        </mesh>
        <mesh position={[0.12, 1.395, 0.05]} rotation={[0, 0.4, 0]}>
          <boxGeometry args={[0.19, 0.026, 0.105]} />
          <meshStandardMaterial color="#09090a" roughness={0.5} />
        </mesh>
        <pointLight position={[0, 1.1, 0.7]} intensity={1.5} distance={2.5} color="#cfd6ff" />
      </group>

      {/* What the Eyes see. */}
      <group ref={crowdGroup} visible={false}>
        <mesh position={[0, 3, 19]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[40, 12]} />
          <meshBasicMaterial
            map={a.glow}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            color="#4a1418"
            fog={false}
          />
        </mesh>
        <primitive object={a.crowd.crowd} />
        <primitive object={a.crowd.labels} />
      </group>
      <group ref={lightGroup} position={[LIGHT_AT[0], 0, LIGHT_AT[1]]} visible={false}>
        <InkFigure parts={light} rimColor="#c9c6c0" />
      </group>

      {profile.particles > 0.2 ? (
        <Motes
          count={Math.round(180 * profile.particles)}
          box={MOTE_BOX}
          position={MOTE_POS}
          drift={MOTE_DRIFT}
          color="#e8e3d8"
          size={10}
          opacity={0.4}
          seed={7}
        />
      ) : null}
    </>
  );
}
