import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NOISE_GLSL } from '@/shaders/noise.glsl.ts';

const vertex = /* glsl */ `
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uCover;
uniform float uScale;
uniform vec3 uTop;
uniform vec3 uBottom;
uniform vec3 uCam;
uniform float uSeed;
uniform float uFadeNear;
uniform float uOpacity;
varying vec3 vWorld;
${NOISE_GLSL}
void main() {
  vec2 p = vWorld.xz * uScale + uSeed;
  vec2 warp = vec2(fbm(p * 0.7 + uTime * 0.01), fbm(p * 0.7 + 5.2 - uTime * 0.008));
  float n = fbm(p + warp * 1.6 + vec2(uTime * 0.006, 0.0));
  float a = smoothstep(1.0 - uCover, 1.0 - uCover + 0.32, n);
  // Never show the sheet edge-on: fade as the camera approaches the layer.
  float dy = abs(uCam.y - vWorld.y);
  a *= smoothstep(0.0, uFadeNear, dy);
  // Soft horizon falloff.
  float dist = length(vWorld.xz - uCam.xz);
  a *= 1.0 - smoothstep(380.0, 700.0, dist);
  // Lit from above when seen from above, glowing from the city when seen from below.
  float fromAbove = step(vWorld.y, uCam.y);
  vec3 col = mix(uBottom, uTop, fromAbove) * (0.75 + 0.5 * n);
  gl_FragColor = vec4(col, a * uOpacity);
}
`;

interface Layer {
  y: number;
  cover: number;
  scale: number;
  top: string;
  bottom: string;
  opacity: number;
}

const LAYERS: readonly Layer[] = [
  { y: 293, cover: 0.62, scale: 0.035, top: '#16181d', bottom: '#2a201a', opacity: 0.95 },
  { y: 284, cover: 0.58, scale: 0.028, top: '#1a1c22', bottom: '#2d2119', opacity: 0.92 },
  { y: 270, cover: 0.55, scale: 0.022, top: '#1b1d24', bottom: '#33241a', opacity: 0.9 },
  { y: 252, cover: 0.5, scale: 0.018, top: '#1d2027', bottom: '#3a291c', opacity: 0.85 },
  { y: 170, cover: 0.32, scale: 0.012, top: '#14161c', bottom: '#4a321f', opacity: 0.55 },
  { y: 135, cover: 0.26, scale: 0.01, top: '#121419', bottom: '#56371f', opacity: 0.45 },
];

/** Cloud decks between the realm and the city. Additive-free, cheap fbm sheets. */
export function CloudLayers({ quality = 1 }: { quality?: number }) {
  const a = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(1400, 1400, 1, 1);
    geometry.rotateX(-Math.PI / 2);
    const layers = LAYERS.slice(0, quality < 0.5 ? 4 : LAYERS.length).map((l, i) => {
      const material = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        fog: false,
        uniforms: {
          uTime: { value: 0 },
          uCover: { value: l.cover },
          uScale: { value: l.scale },
          uTop: { value: new THREE.Color(l.top) },
          uBottom: { value: new THREE.Color(l.bottom) },
          uCam: { value: new THREE.Vector3() },
          uSeed: { value: i * 17.3 },
          uFadeNear: { value: i < 4 ? 5 : 14 },
          uOpacity: { value: l.opacity },
        },
      });
      return { y: l.y, material };
    });
    return { geometry, layers };
  }, [quality]);

  useEffect(
    () => () => {
      a.geometry.dispose();
      a.layers.forEach((l) => l.material.dispose());
    },
    [a],
  );

  useFrame(({ camera }, dt) => {
    for (const l of a.layers) {
      l.material.uniforms.uTime!.value += Math.min(dt, 0.1);
      (l.material.uniforms.uCam!.value as THREE.Vector3).copy(camera.position);
    }
  });

  return (
    <group>
      {a.layers.map((l) => (
        <mesh key={l.y} geometry={a.geometry} material={l.material} position={[0, l.y, 0]} renderOrder={2} frustumCulled={false} />
      ))}
    </group>
  );
}
