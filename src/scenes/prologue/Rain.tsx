import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mulberry32 } from '@/utils/math';

const vertex = /* glsl */ `
uniform float uTime;
uniform vec3 uCenter;
uniform vec3 uBox;
uniform float uLen;
attribute vec3 aBase;
attribute float aEnd;
attribute float aSpeed;
varying float vEnd;
void main() {
  // Wrap the field around the camera (world-stable on every axis) so rain is
  // always present, never ends, and doesn't travel with the camera.
  vec3 local = vec3(
    mod(aBase.x - uCenter.x, uBox.x),
    mod(aBase.y - uTime * aSpeed - uCenter.y, uBox.y),
    mod(aBase.z - uCenter.z, uBox.z)
  ) - uBox * 0.5;
  vec3 world = uCenter + local;
  world.y -= aEnd * uLen;
  world.x -= aEnd * uLen * 0.08;
  vEnd = aEnd;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`;

const fragment = /* glsl */ `
precision highp float;
uniform float uOpacity;
varying float vEnd;
void main() {
  gl_FragColor = vec4(vec3(0.62, 0.68, 0.8) * uOpacity * (1.0 - vEnd * 0.8), 1.0);
}
`;

/** Rain streaks that follow the camera. `opacityRef` is driven per frame by the scene. */
export function Rain({ count, opacityRef }: { count: number; opacityRef: { current: number } }) {
  const a = useMemo(() => {
    const rnd = mulberry32(5);
    const base = new Float32Array(count * 2 * 3);
    const end = new Float32Array(count * 2);
    const speed = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const x = rnd() * 40;
      const y = rnd() * 30;
      const z = rnd() * 40;
      const s = 9 + rnd() * 5;
      for (let k = 0; k < 2; k++) {
        base.set([x, y, z], (i * 2 + k) * 3);
        end[i * 2 + k] = k;
        speed[i * 2 + k] = s;
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(count * 2 * 3), 3),
    );
    geometry.setAttribute('aBase', new THREE.BufferAttribute(base, 3));
    geometry.setAttribute('aEnd', new THREE.BufferAttribute(end, 1));
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
      uniforms: {
        uTime: { value: 0 },
        uCenter: { value: new THREE.Vector3() },
        uBox: { value: new THREE.Vector3(40, 30, 40) },
        uLen: { value: 0.45 },
        uOpacity: { value: 0 },
      },
    });
    const lines = new THREE.LineSegments(geometry, material);
    lines.frustumCulled = false;
    return { geometry, material, lines };
  }, [count]);

  useEffect(
    () => () => {
      a.geometry.dispose();
      a.material.dispose();
    },
    [a],
  );

  useFrame(({ camera }, dt) => {
    const u = a.material.uniforms;
    u.uTime!.value += Math.min(dt, 0.1);
    (u.uCenter!.value as THREE.Vector3).copy(camera.position);
    u.uOpacity!.value = opacityRef.current * 0.32;
    a.lines.visible = opacityRef.current > 0.01;
  });

  return <primitive object={a.lines} />;
}
