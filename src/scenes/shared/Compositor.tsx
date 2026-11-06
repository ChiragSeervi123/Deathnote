import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SCENES, type Grade } from '../registry';
import { compositorFragment, compositorVertex, TRANSITION_INDEX } from './compositorShader';
import { PRIORITY } from './sceneFrame';
import { stageState } from './stageState';

function fullscreenTriangle(): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2));
  return g;
}

const NEUTRAL: Grade = {
  exposure: 1,
  contrast: 1,
  saturation: 1,
  tint: [1, 1, 1],
  lift: [0, 0, 0],
};

function applyGrade(u: Record<string, THREE.IUniform>, suffix: 'A' | 'B', g: Grade): void {
  (u[`uGrade${suffix}`]!.value as THREE.Vector3).set(g.exposure, g.contrast, g.saturation);
  (u[`uTint${suffix}`]!.value as THREE.Vector3).set(g.tint[0], g.tint[1], g.tint[2]);
  (u[`uLift${suffix}`]!.value as THREE.Vector3).set(g.lift[0], g.lift[1], g.lift[2]);
}

/** Full-screen pass blending the two active scene layers (ARCHITECTURE §3.2). */
export function Compositor() {
  const size = useThree((s) => s.size);
  const geometry = useMemo(fullscreenTriangle, []);
  const black = useMemo(() => {
    const t = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
    t.needsUpdate = true;
    return t;
  }, []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: compositorVertex,
        fragmentShader: compositorFragment,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
        uniforms: {
          tA: { value: black },
          tB: { value: black },
          uMix: { value: 1 },
          uKind: { value: 1 },
          uTime: { value: 0 },
          uRes: { value: new THREE.Vector2(1, 1) },
          uDimA: { value: 0 },
          uDimB: { value: 0 },
          uGradeA: { value: new THREE.Vector3(1, 1, 1) },
          uGradeB: { value: new THREE.Vector3(1, 1, 1) },
          uTintA: { value: new THREE.Vector3(1, 1, 1) },
          uTintB: { value: new THREE.Vector3(1, 1, 1) },
          uLiftA: { value: new THREE.Vector3() },
          uLiftB: { value: new THREE.Vector3() },
        },
      }),
    [black],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
      black.dispose();
    },
    [geometry, material, black],
  );

  useFrame((state) => {
    const u = material.uniforms;
    const { a, b, mix, kind } = stageState;
    const hasA = !!a.key && stageState.ready.has(a.key) && !stageState.failed.has(a.key);
    const hasB = !!b.key && stageState.ready.has(b.key) && !stageState.failed.has(b.key);
    const texA = hasA ? stageState.textures.get(a.key!) : undefined;
    const texB = hasB ? stageState.textures.get(b.key!) : undefined;
    u.tA!.value = texA ?? texB ?? black;
    u.tB!.value = texB ?? texA ?? black;
    u.uMix!.value = hasA && hasB ? mix : hasB ? 1 : 0;
    u.uKind!.value = TRANSITION_INDEX[kind];
    u.uTime!.value = state.clock.elapsedTime;
    u.uDimA!.value = hasA ? a.dim : b.dim;
    u.uDimB!.value = hasB ? b.dim : a.dim;
    applyGrade(
      u,
      'A',
      hasA && a.key ? SCENES[a.key].grade : hasB && b.key ? SCENES[b.key].grade : NEUTRAL,
    );
    applyGrade(
      u,
      'B',
      hasB && b.key ? SCENES[b.key].grade : hasA && a.key ? SCENES[a.key].grade : NEUTRAL,
    );
    (u.uRes!.value as THREE.Vector2).set(size.width, size.height);
  }, PRIORITY.compositor);

  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
}
