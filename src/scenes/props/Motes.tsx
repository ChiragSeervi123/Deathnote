import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mulberry32 } from '@/utils/math';

const vertex = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
uniform vec3 uDrift;
uniform vec3 uBox;
attribute float aSeed;
varying float vSeed;
varying vec3 vWorld;
void main() {
  // Drift, wrapped so the motes never leave their box however long the page is open.
  vec3 p = mod(position + uDrift * uTime + uBox * 0.5, uBox) - uBox * 0.5;
  float t = uTime * (0.4 + aSeed * 0.6);
  p += vec3(sin(t + aSeed * 31.0), sin(t * 0.7 + aSeed * 17.0) * 0.6, cos(t * 0.8 + aSeed * 9.0)) * 0.08;
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  vSeed = aSeed;
  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.5 + aSeed) / -mv.z;
}
`;

const fragment = /* glsl */ `
precision highp float;
uniform vec3 uColor;
uniform float uOpacity;
uniform vec3 uBeamPos;
uniform vec3 uBeamDir;
uniform float uBeamCos;
uniform float uUseBeam;
varying float vSeed;
varying vec3 vWorld;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.0, d);
  float beam = 1.0;
  if (uUseBeam > 0.5) {
    vec3 L = normalize(vWorld - uBeamPos);
    beam = smoothstep(uBeamCos, uBeamCos + 0.08, dot(L, uBeamDir));
  }
  float tw = 0.6 + 0.4 * sin(vSeed * 60.0);
  gl_FragColor = vec4(uColor * a * beam * tw * uOpacity, 1.0);
}
`;

interface Props {
  count: number;
  /** Box the motes live in: [width, height, depth]. */
  box: [number, number, number];
  position?: [number, number, number];
  color?: string;
  size?: number;
  opacity?: number;
  /** Optional light cone so only motes inside the beam glow. */
  beam?: { pos: [number, number, number]; target: [number, number, number]; angle: number };
  drift?: [number, number, number];
  seed?: number;
}

/** Dust, ash or snow motes. Additive points; optionally lit only inside a light cone. */
export function Motes({
  count,
  box,
  position,
  color = '#ffd9a8',
  size = 26,
  opacity = 1,
  beam,
  drift = [0, 0, 0],
  seed = 1,
}: Props) {
  const assets = useMemo(() => {
    const rnd = mulberry32(seed);
    const pos = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rnd() - 0.5) * box[0];
      pos[i * 3 + 1] = (rnd() - 0.5) * box[1];
      pos[i * 3 + 2] = (rnd() - 0.5) * box[2];
      seeds[i] = rnd();
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    const dir = beam
      ? new THREE.Vector3(...beam.target).sub(new THREE.Vector3(...beam.pos)).normalize()
      : new THREE.Vector3(0, -1, 0);
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: size },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uColor: { value: new THREE.Color(color) },
        uOpacity: { value: opacity },
        uDrift: { value: new THREE.Vector3(...drift) },
        uBox: { value: new THREE.Vector3(...box) },
        uBeamPos: { value: new THREE.Vector3(...(beam?.pos ?? [0, 0, 0])) },
        uBeamDir: { value: dir },
        uBeamCos: { value: Math.cos(beam?.angle ?? 1) },
        uUseBeam: { value: beam ? 1 : 0 },
      },
    });
    return { geometry, material };
  }, [count, box, color, size, opacity, beam, drift, seed]);

  useEffect(
    () => () => {
      assets.geometry.dispose();
      assets.material.dispose();
    },
    [assets],
  );

  useFrame((_, dt) => {
    assets.material.uniforms.uTime!.value += Math.min(dt, 0.1);
  });

  return (
    <points
      geometry={assets.geometry}
      material={assets.material}
      position={position}
      frustumCulled={false}
    />
  );
}

/** Imperative access to a Motes material (e.g. to fade opacity per frame). */
export type MotesMaterial = THREE.ShaderMaterial;
