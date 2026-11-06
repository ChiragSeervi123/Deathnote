import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NOISE_GLSL } from '@/shaders/noise.glsl.ts';
import { WORLD } from './world';

const vertex = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  vec4 p = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * p;
  gl_Position.z = gl_Position.w; // always at the far plane
}
`;

const fragment = /* glsl */ `
precision highp float;
uniform float uBlend;  // 0 realm, 1 human night
uniform vec3 uSunDir;
uniform float uTime;
varying vec3 vDir;
${NOISE_GLSL}

vec3 realmSky(vec3 d) {
  float h = d.y;
  vec3 zenith = vec3(0.008, 0.008, 0.0085);
  vec3 horizon = vec3(0.05, 0.047, 0.042);
  vec3 col = mix(horizon, zenith, smoothstep(-0.05, 0.45, h));
  // Dead sun: a pale disc smothered in haze, never bright enough to warm anything.
  float s = max(dot(d, normalize(uSunDir)), 0.0);
  col += vec3(0.62, 0.6, 0.55) * pow(s, 900.0) * 2.4;
  col += vec3(0.32, 0.3, 0.27) * pow(s, 28.0) * 0.55;
  col += vec3(0.12, 0.11, 0.1) * pow(s, 4.0) * 0.3;
  // Slow, banded ash clouds.
  float n = fbm(vec2(atan(d.z, d.x) * 3.0, h * 9.0) + vec2(uTime * 0.004, 0.0));
  col *= 0.82 + 0.3 * n;
  return col;
}

vec3 nightSky(vec3 d) {
  float h = d.y;
  vec3 col = mix(vec3(0.03, 0.026, 0.03), vec3(0.004, 0.006, 0.012), smoothstep(-0.1, 0.5, h));
  // City glow reflected by the low cloud.
  col += vec3(0.09, 0.05, 0.03) * smoothstep(0.25, -0.15, h);
  return col;
}

void main() {
  vec3 d = normalize(vDir);
  vec3 col = mix(realmSky(d), nightSky(d), uBlend);
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Sky that follows the camera and blends realm ↔ night by the camera's height. */
export function SkyDome({ blendRef }: { blendRef: { current: number } }) {
  const a = useMemo(() => {
    const geometry = new THREE.SphereGeometry(1500, 32, 16);
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        uBlend: { value: 0 },
        uSunDir: { value: new THREE.Vector3(...WORLD.sunDir).normalize() },
        uTime: { value: 0 },
      },
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    mesh.renderOrder = -10;
    return { geometry, material, mesh };
  }, []);

  useEffect(
    () => () => {
      a.geometry.dispose();
      a.material.dispose();
    },
    [a],
  );

  useFrame(({ camera }, dt) => {
    a.material.uniforms.uBlend!.value = blendRef.current;
    a.material.uniforms.uTime!.value += Math.min(dt, 0.1);
    a.mesh.position.copy(camera.position);
  });

  return <primitive object={a.mesh} />;
}
