import { useEffect, useMemo } from 'react';
import { useFrame, type ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';
import { NOISE_GLSL } from '@/shaders/noise.glsl.ts';

const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * Night city seen through rain-covered glass. Original shader: hashed static
 * droplets + sliding drops with trails refract an out-of-focus city.
 */
const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uAspect;
uniform float uIntensity;
uniform float uRain;
varying vec2 vUv;
${NOISE_GLSL}

vec3 city(vec2 uv) {
  // Night sky, almost black, with a faint sodium haze over the skyline.
  vec3 col = mix(vec3(0.003, 0.004, 0.008), vec3(0.008, 0.009, 0.014), smoothstep(1.0, 0.2, uv.y));
  col += vec3(0.035, 0.022, 0.014) * smoothstep(0.5, 0.0, uv.y) * 0.5;
  // Out-of-focus city lights: sparse, concentrated low in the frame.
  for (int L = 0; L < 3; L++) {
    float fl = float(L);
    vec2 g = vec2(uv.x * uAspect, uv.y) * (6.0 + fl * 6.0) + fl * 13.1;
    vec2 id = floor(g);
    vec2 f = fract(g) - 0.5;
    float h = hash12(id + fl * 3.7);
    float density = smoothstep(0.62, 0.05, uv.y);
    if (h < 0.22 * density) {
      vec2 o = (vec2(hash12(id + 1.3), hash12(id + 7.7)) - 0.5) * 0.6;
      float d = length(f - o);
      float r = (0.1 + 0.16 * hash12(id + 3.1)) * (1.0 - fl * 0.2);
      float b = smoothstep(r, r * 0.6, d);
      float sel = hash12(id + 9.0);
      vec3 c = sel < 0.7 ? vec3(1.0, 0.58, 0.28) : sel < 0.94 ? vec3(0.5, 0.64, 1.0) : vec3(1.0, 0.2, 0.15);
      float flick = 0.85 + 0.15 * sin(uTime * (0.3 + h) + h * 40.0);
      col += c * b * flick * (0.16 - fl * 0.04);
    }
  }
  return col;
}

// Static beads of water: offset (xy) and coverage (z).
vec3 beads(vec2 uv, float scale, float seed) {
  vec2 g = vec2(uv.x * uAspect, uv.y) * scale;
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  float h = hash12(id + seed);
  vec2 o = (vec2(hash12(id + seed + 2.1), hash12(id + seed + 5.3)) - 0.5) * 0.6;
  float r = 0.08 + 0.18 * h * h;
  vec2 d = f - o;
  float l = length(d);
  float m = smoothstep(r, r * 0.7, l) * step(0.35, h);
  return vec3(d / max(l, 1e-3) * (1.0 - l / r) * m, m);
}

// Drops sliding down with a wet trail: offset (xy), coverage (z).
vec3 runners(vec2 uv, float t) {
  float cols = 9.0;
  vec2 g = vec2(uv.x * uAspect * cols / uAspect, uv.y);
  float cx = floor(uv.x * cols);
  float h = hash12(vec2(cx, 4.2));
  float speed = 0.05 + 0.1 * h;
  float y = fract(-t * speed + h * 9.0) * 1.3 - 0.15;
  float x = (cx + 0.5 + (hash12(vec2(cx, 1.7)) - 0.5) * 0.5) / cols;
  x += sin(uv.y * 30.0 + h * 10.0) * 0.003;
  vec2 d = vec2((uv.x - x) * uAspect * 3.2, (uv.y - y) * 2.2);
  float l = length(d);
  float drop = smoothstep(0.06, 0.035, l) * step(0.45, h);
  float trail = smoothstep(0.01, 0.0, abs(uv.x - x) - 0.0025) * smoothstep(y, y + 0.35, uv.y) * step(0.45, h) * (1.0 - smoothstep(y + 0.3, y + 0.6, uv.y));
  return vec3(d / max(l, 1e-3) * drop * 0.6, max(drop, trail * 0.35));
}

void main() {
  vec2 uv = vUv;
  vec3 b1 = beads(uv, 22.0, 1.0) * uRain;
  vec3 b2 = beads(uv, 41.0, 7.0) * uRain;
  vec3 rn = runners(uv, uTime) * uRain;
  vec2 offs = b1.xy * 0.035 + b2.xy * 0.02 + rn.xy * 0.05;
  float wet = clamp(b1.z + b2.z * 0.6 + rn.z, 0.0, 1.0);
  vec3 col = city(uv + offs);
  // Water catches a little more light and focuses the bokeh.
  col *= 1.0 + wet * 0.5;
  col += vec3(0.004, 0.005, 0.008) * wet;
  gl_FragColor = vec4(col * uIntensity, 1.0);
}
`;

type Props = ThreeElements['mesh'] & { width?: number; height?: number; intensity?: number; rain?: number };

export function RainWindow({ width = 6, height = 3.4, intensity = 1.6, rain = 1, ...props }: Props) {
  const assets = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTime: { value: 0 },
        uAspect: { value: width / height },
        uIntensity: { value: intensity },
        uRain: { value: rain },
      },
      toneMapped: false,
    });
    return { geometry, material };
  }, [width, height, intensity, rain]);

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

  return <mesh geometry={assets.geometry} material={assets.material} {...props} />;
}
