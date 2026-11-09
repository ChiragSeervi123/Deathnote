import { use, useEffect, useMemo, useRef } from 'react';
import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ensureCanvasFonts } from '@/app/fonts';
import { capsule, disc } from '@/characters/shared/shapes';
import { useRuntime } from '@/state/runtime';
import { keyframes, mulberry32, range, smoothstep } from '@/utils/math';
import { NOISE_GLSL } from '@/shaders/noise.glsl.ts';
import { buildingMaterial, groundMaterial } from '../prologue/cityMaterials';
import { Rain } from '../prologue/Rain';
import { QUALITY_PROFILES } from '../shared/quality';
import { useSceneFrame } from '../shared/sceneFrame';
import { drawScreen, screenTexture, type ScreenKind } from './screenTextures';

/**
 * Chapter 04 — Birth of Kira. A night street canyon of screens: heart-attack
 * bulletins, a climbing counter, a name whispered online, a city divided —
 * red ink spreads across every screen, until one white screen shows a letter.
 */

type V3 = readonly [number, number, number];

const SCREENS: ReadonlyArray<{ kind: ScreenKind; pos: V3; side: 1 | -1; w: number }> = [
  { kind: 'news', pos: [-9.6, 7, -10], side: 1, w: 9 },
  { kind: 'counter', pos: [9.6, 9, -18], side: -1, w: 8 },
  { kind: 'kira', pos: [-9.6, 13, -30], side: 1, w: 12 },
  { kind: 'justice', pos: [9.6, 7, -38], side: -1, w: 8 },
  { kind: 'murder', pos: [-9.6, 7, -46], side: 1, w: 8 },
  { kind: 'icpo', pos: [9.6, 12, -56], side: -1, w: 10 },
  { kind: 'news', pos: [-9.6, 16, -64], side: 1, w: 9 },
  { kind: 'kira', pos: [9.6, 6, -70], side: -1, w: 8 },
];

const CAM_POS: ReadonlyArray<{ t: number; v: V3 }> = [
  { t: 0, v: [0, 3.2, 14] },
  { t: 0.5, v: [0.5, 3.6, -16] },
  { t: 0.76, v: [0, 4.2, -44] },
  { t: 1, v: [0, 5.5, -58] },
];
const CAM_TGT: ReadonlyArray<{ t: number; v: V3 }> = [
  { t: 0, v: [-2, 6, -20] },
  { t: 0.5, v: [2, 7, -50] },
  { t: 0.76, v: [0, 12, -90] },
  { t: 1, v: [0, 14, -92] },
];

const screenVertex = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const screenFragment = /* glsl */ `
precision highp float;
uniform sampler2D map;
uniform sampler2D letter;
uniform float uInk;
uniform float uLetter;
uniform float uGain;
uniform float uSeed;
varying vec2 vUv;
${NOISE_GLSL}
void main() {
  vec3 c = texture2D(map, vUv).rgb;
  // Red ink bleeding in from the edges.
  float n = fbm(vUv * 4.0 + uSeed);
  float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  float field = edge * 1.6 + n * 0.6;
  float ink = smoothstep(uInk * 1.2, uInk * 1.2 - 0.12, field);
  c = mix(c, vec3(0.32, 0.01, 0.02) + c * vec3(0.4, 0.0, 0.0), ink * 0.92);
  vec3 l = texture2D(letter, vUv).rgb;
  c = mix(c, l, uLetter);
  gl_FragColor = vec4(c * uGain, 1.0);
}
`;

/** A standing person, as a flat ink silhouette (for the crowd). */
function personGeometry(): THREE.ShapeGeometry {
  const shapes = [
    disc([0, 1.62], 0.11, 0.13),
    ...capsule([0, 1.45], [0, 0.95], 0.2, 0.17),
    ...capsule([-0.09, 0.95], [-0.1, 0.05], 0.08, 0.06),
    ...capsule([0.09, 0.95], [0.1, 0.05], 0.08, 0.06),
  ];
  return new THREE.ShapeGeometry(shapes, 6);
}

let fontsPromise: Promise<void> | null = null;

export default function KiraScene() {
  use((fontsPromise ??= ensureCanvasFonts()));
  const camRef = useRef<THREE.PerspectiveCamera>(null);
  const rain = useRef(0.7);
  const lastCount = useRef(-1);
  const size = useThree((s) => s.size);
  const tier = useRuntime((s) => s.tier);
  const profile = QUALITY_PROFILES[tier];

  const a = useMemo(() => {
    const rnd = mulberry32(44);
    // Street canyon: two rows of towers facing the street at x = 0.
    const box = new THREE.BoxGeometry(1, 1, 1);
    box.translate(0, 0.5, 0);
    const towerMat = buildingMaterial();
    const count = 44;
    const towers = new THREE.InstancedMesh(box, towerMat, count);
    const m = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      const side = i % 2 ? 1 : -1;
      const z = 20 - Math.floor(i / 2) * 9.5;
      const w = 7 + rnd() * 5;
      m.compose(
        new THREE.Vector3(side * (10 + w / 2), 0, z),
        new THREE.Quaternion(),
        new THREE.Vector3(w, 14 + rnd() * 40, 8 + rnd() * 2),
      );
      towers.setMatrixAt(i, m);
    }
    // Far end: a tall tower closing the street, carrying the last screen.
    const endTower = new THREE.Mesh(box, towerMat);
    endTower.position.set(0, 0, -100);
    endTower.scale.set(34, 60, 10);
    const groundGeo = new THREE.PlaneGeometry(400, 400);
    groundGeo.rotateX(-Math.PI / 2);
    const ground = groundMaterial();

    // Screens.
    const plane = new THREE.PlaneGeometry(1, 1);
    const letter = screenTexture('letter');
    const screens = SCREENS.map((s, i) => {
      const { texture, ctx } = screenTexture(s.kind, 0);
      const mat = new THREE.ShaderMaterial({
        vertexShader: screenVertex,
        fragmentShader: screenFragment,
        uniforms: {
          map: { value: texture },
          letter: { value: letter.texture },
          uInk: { value: 0 },
          uLetter: { value: 0 },
          uGain: { value: 1.25 },
          uSeed: { value: i * 3.1 },
        },
        toneMapped: false,
      });
      return { s, texture, ctx, mat };
    });
    const finalMat = new THREE.ShaderMaterial({
      vertexShader: screenVertex,
      fragmentShader: screenFragment,
      uniforms: {
        map: { value: letter.texture },
        letter: { value: letter.texture },
        uInk: { value: 0 },
        uLetter: { value: 0 },
        uGain: { value: 1.1 },
        uSeed: { value: 9 },
      },
      toneMapped: false,
    });

    // Crowd on both pavements.
    const person = personGeometry();
    const crowdMat = new THREE.MeshBasicMaterial({ color: '#030304', side: THREE.DoubleSide });
    const crowdN = Math.round(170 * Math.max(0.4, profile.particles));
    const crowd = new THREE.InstancedMesh(person, crowdMat, crowdN);
    for (let i = 0; i < crowdN; i++) {
      const side = rnd() < 0.5 ? -1 : 1;
      const s = 0.92 + rnd() * 0.18;
      m.compose(
        new THREE.Vector3(side * (5.2 + rnd() * 3.6), 0, 6 - rnd() * 80),
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (rnd() - 0.5) * 0.6),
        new THREE.Vector3(s, s, s),
      );
      crowd.setMatrixAt(i, m);
    }
    return { box, towerMat, towers, endTower, groundGeo, ground, plane, letter, screens, finalMat, person, crowdMat, crowd };
  }, [profile.particles]);

  useEffect(
    () => () => {
      a.box.dispose();
      a.towerMat.dispose();
      a.towers.dispose();
      a.groundGeo.dispose();
      a.ground.dispose();
      a.plane.dispose();
      a.letter.texture.dispose();
      a.screens.forEach((s) => {
        s.texture.dispose();
        s.mat.dispose();
      });
      a.finalMat.dispose();
      a.person.dispose();
      a.crowdMat.dispose();
      a.crowd.dispose();
    },
    [a],
  );

  useSceneFrame((f) => {
    const p = f.reduced ? Math.round(f.progress * 4) / 4 : f.progress;
    const cam = camRef.current;
    if (!cam) return;
    const portrait = size.width / size.height < 0.9;
    const pos = keyframes(CAM_POS, p);
    const tgt = keyframes(CAM_TGT, p);
    cam.position.set(pos[0] + f.pointer.x * 0.6, pos[1] + f.pointer.y * 0.3 + (portrait ? 1 : 0), pos[2]);
    cam.lookAt(tgt[0], tgt[1], tgt[2]);

    // Climbing death counter (redrawn only when the number changes).
    const count = Math.round(range(p, 0.12, 0.8) * 214 + 3);
    if (count !== lastCount.current) {
      lastCount.current = count;
      for (const s of a.screens) {
        if (s.s.kind === 'counter') {
          drawScreen(s.ctx, 'counter', count);
          s.texture.needsUpdate = true;
        }
      }
    }
    const ink = smoothstep(0.55, 0.78, p);
    const letter = smoothstep(0.8, 0.88, p);
    for (const s of a.screens) {
      s.mat.uniforms.uInk!.value = ink;
      s.mat.uniforms.uLetter!.value = letter;
    }
    a.finalMat.uniforms.uGain!.value = 0.2 + 1.1 * smoothstep(0.72, 0.86, p);
    rain.current = 0.8;
  });

  return (
    <>
      <PerspectiveCamera ref={camRef} makeDefault fov={42} near={0.1} far={500} position={[0, 3, 14]} />
      <color attach="background" args={['#05060a']} />
      <fogExp2 attach="fog" args={['#0a0709', 0.016]} />
      <hemisphereLight args={['#2a2f42', '#0a0605', 0.5]} />

      <mesh geometry={a.groundGeo} material={a.ground} />
      <primitive object={a.towers} />
      <primitive object={a.endTower} />
      {a.screens.map(({ s, mat }, i) => (
        <mesh
          key={i}
          geometry={a.plane}
          material={mat}
          position={[s.pos[0] + s.side * 0.05, s.pos[1], s.pos[2]]}
          rotation={[0, (s.side * Math.PI) / 2, 0]}
          scale={[s.w, (s.w * 9) / 16, 1]}
        />
      ))}
      <mesh geometry={a.plane} material={a.finalMat} position={[0, 26, -94.8]} scale={[26, (26 * 9) / 16, 1]} />
      <primitive object={a.crowd} />
      <Rain count={Math.round(1000 * profile.particles)} opacityRef={rain} />
    </>
  );
}
