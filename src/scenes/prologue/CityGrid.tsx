import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { BLOCK, buildingMaterial, groundMaterial, STREET } from './cityMaterials';
import { NOISE_GLSL } from '@/shaders/noise.glsl.ts';
import { mulberry32 } from '@/utils/math';

/**
 * Night Tokyo from above: instanced towers on a street grid, a school and its
 * courtyard at the origin where the notebook lands.
 */
export function CityGrid({ density = 1 }: { density?: number }) {
  const a = useMemo(() => {
    const rnd = mulberry32(77);
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    boxGeo.translate(0, 0.5, 0);
    const material = buildingMaterial();
    const transforms: THREE.Matrix4[] = [];
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const pitch = BLOCK + STREET;
    const half = Math.round(9 * Math.sqrt(density) + 4);

    // The school: long, low, three floors — instance 0.
    transforms.push(
      m.clone().compose(new THREE.Vector3(0, 0, -30), q, new THREE.Vector3(70, 13, 16)),
    );
    // A gymnasium block.
    transforms.push(
      m.clone().compose(new THREE.Vector3(42, 0, 8), q, new THREE.Vector3(26, 10, 34)),
    );

    for (let i = -half; i <= half; i++) {
      for (let j = -half; j <= half; j++) {
        const cx = i * pitch + pitch / 2;
        const cz = j * pitch + pitch / 2;
        if (Math.abs(cx) < 75 && Math.abs(cz) < 65) continue; // keep the school grounds open
        // Low residential district around the school; the skyline rises far to the north.
        const dist = Math.hypot(cx, cz);
        const downtown =
          Math.exp(-Math.pow((cz + 640) / 300, 2)) * Math.exp(-Math.pow(cx / 520, 2));
        const near = 1 - Math.exp(-Math.pow(dist / 260, 2));
        const n = 1 + Math.floor(rnd() * 3);
        for (let k = 0; k < n; k++) {
          const w = BLOCK / n - 2 - rnd() * 4;
          const d = BLOCK - 4 - rnd() * 10;
          const x = cx - BLOCK / 2 + (k + 0.5) * (BLOCK / n);
          const z = cz + (rnd() - 0.5) * 4;
          const h = 7 + Math.pow(rnd(), 2.2) * (14 + 30 * near) + downtown * (50 + rnd() * 150);
          q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), (rnd() < 0.15 ? 0.2 : 0) * (rnd() - 0.5));
          transforms.push(
            m
              .clone()
              .compose(
                new THREE.Vector3(x, 0, z),
                q.clone(),
                new THREE.Vector3(Math.max(6, w), Math.max(6, h), Math.max(8, d)),
              ),
          );
        }
      }
    }
    q.identity();
    const towers = new THREE.InstancedMesh(boxGeo, material, transforms.length);
    transforms.forEach((t, i) => towers.setMatrixAt(i, t));
    towers.instanceMatrix.needsUpdate = true;
    towers.computeBoundingSphere();

    const groundGeo = new THREE.PlaneGeometry(4000, 4000);
    groundGeo.rotateX(-Math.PI / 2);
    const ground = groundMaterial();

    const grassGeo = new THREE.PlaneGeometry(60, 40);
    grassGeo.rotateX(-Math.PI / 2);
    const grass = new THREE.MeshStandardMaterial({ color: '#33402a', roughness: 0.9 });
    // Wet, patchy lawn: world-space noise for colour and sheen (no texture).
    grass.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vGPos;')
        .replace(
          '#include <worldpos_vertex>',
          '#include <worldpos_vertex>\nvGPos = (modelMatrix * vec4(transformed, 1.0)).xyz;',
        );
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>\nvarying vec3 vGPos;\n${NOISE_GLSL}`)
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
          float gn = fbm(vGPos.xz * 1.7);
          float blades = vnoise(vGPos.xz * 60.0);
          diffuseColor.rgb *= 0.45 + 0.75 * gn + 0.25 * blades;`,
        )
        .replace(
          '#include <roughnessmap_fragment>',
          `#include <roughnessmap_fragment>
          roughnessFactor = mix(0.35, 0.95, smoothstep(0.35, 0.6, fbm(vGPos.xz * 0.6 + 4.0)));`,
        );
    };

    return { boxGeo, material, towers, groundGeo, ground, grassGeo, grass };
  }, [density]);

  useEffect(
    () => () => {
      a.boxGeo.dispose();
      a.material.dispose();
      a.towers.dispose();
      a.groundGeo.dispose();
      a.ground.dispose();
      a.grassGeo.dispose();
      a.grass.dispose();
    },
    [a],
  );

  return (
    <group>
      <mesh geometry={a.groundGeo} material={a.ground} receiveShadow />
      <mesh geometry={a.grassGeo} material={a.grass} position={[0, 0.02, 2]} receiveShadow />
      <primitive object={a.towers} />
      {/* Courtyard tree */}
      <group position={[-9, 0, 6]}>
        <mesh position={[0, 2.2, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.32, 4.4, 7]} />
          <meshStandardMaterial color="#17120e" roughness={1} />
        </mesh>
        {[
          [0, 5.4, 0, 2.6],
          [1.4, 4.8, 0.6, 1.9],
          [-1.3, 5, -0.4, 2],
          [0.3, 6.6, -0.5, 1.7],
        ].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x!, y!, z!]} castShadow>
            <icosahedronGeometry args={[r!, 1]} />
            <meshStandardMaterial color="#121a11" roughness={1} flatShading />
          </mesh>
        ))}
      </group>
      {/* Courtyard lamp */}
      <group position={[2.2, 0, -1.0]}>
        <mesh position={[0, 2.4, 0]}>
          <cylinderGeometry args={[0.05, 0.07, 4.8, 6]} />
          <meshStandardMaterial color="#202024" roughness={0.6} metalness={0.5} />
        </mesh>
        <mesh position={[0, 4.85, 0]}>
          <sphereGeometry args={[0.18, 12, 8]} />
          <meshBasicMaterial color={[4, 3.1, 2.2]} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
