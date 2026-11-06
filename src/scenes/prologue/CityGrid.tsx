import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { NOISE_GLSL } from '@/shaders/noise.glsl.ts';
import { mulberry32 } from '@/utils/math';

const BLOCK = 46;
const STREET = 14;

/** Night windows, generated per face in world space (no textures). */
function buildingMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ color: '#16171b', roughness: 0.82, metalness: 0.1 });
  m.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec3 vWPos;\nvarying vec3 vWNorm;\nvarying float vSeed;',
      )
      .replace(
        '#include <worldpos_vertex>',
        `#include <worldpos_vertex>
        #ifdef USE_INSTANCING
          vec4 wp = modelMatrix * instanceMatrix * vec4(transformed, 1.0);
          vWNorm = normalize(mat3(modelMatrix * instanceMatrix) * objectNormal);
          vSeed = float(gl_InstanceID);
        #else
          vec4 wp = modelMatrix * vec4(transformed, 1.0);
          vWNorm = normalize(mat3(modelMatrix) * objectNormal);
          vSeed = 0.0;
        #endif
        vWPos = wp.xyz;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec3 vWPos; varying vec3 vWNorm; varying float vSeed;
        float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        // Interpolation perturbs the varying's last bits; hashing would turn that
        // into per-pixel static, so snap the per-building seed to an integer.
        float seed = floor(vSeed + 0.5);
        vec3 n = normalize(vWNorm);
        if (abs(n.y) < 0.5) {
          vec2 t = normalize(vec2(-n.z, n.x));
          float u = dot(vWPos.xz, t);
          float v = vWPos.y;
          vec2 cell = vec2(floor(u / 3.1), floor(v / 3.4));
          vec2 f = vec2(fract(u / 3.1), fract(v / 3.4));
          float win = step(0.18, f.x) * step(f.x, 0.82) * step(0.28, f.y) * step(f.y, 0.8);
          float r = h21(cell + seed * 7.31);
          float lit = step(r, 0.17) * step(1.2, v);
          float warm = step(h21(cell * 1.7 + seed), 0.72);
          vec3 wc = mix(vec3(0.55, 0.7, 1.0) * 0.8, vec3(1.0, 0.66, 0.34), warm);
          // A few whole floors lit in cold office white.
          float office = step(h21(vec2(cell.y, seed)), 0.03);
          wc = mix(wc, vec3(0.62, 0.66, 0.72), office);
          lit = max(lit, office * step(0.4, h21(cell)));
          // Window cells shrink below a few pixels from altitude: blend to their
          // average glow instead of aliasing into sparkle.
          float fw = max(fwidth(u / 3.1), fwidth(v / 3.4));
          float detail = 1.0 - smoothstep(0.18, 0.55, fw);
          vec3 sharp = win * lit * wc * (0.9 + 0.6 * h21(cell + 3.0));
          vec3 avg = vec3(1.0, 0.72, 0.45) * 0.07 * step(1.2, v);
          totalEmissiveRadiance += mix(avg, sharp, detail) * 0.95;
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.03, 0.035, 0.045), win * (1.0 - lit) * detail);
        } else if (n.y > 0.5) {
          // Rooftops: a rare steady red beacon (never flashing).
          float beacon = step(0.985, h21(vec2(seed, 1.0)));
          vec2 c = vWPos.xz - floor(vWPos.xz / 6.0) * 6.0 - 3.0;
          totalEmissiveRadiance += vec3(1.0, 0.08, 0.05) * beacon * smoothstep(0.6, 0.0, length(c)) * 3.0;
        }`,
      );
  };
  return m;
}

/** Asphalt with sodium-lit street grid. */
function groundMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ color: '#0d0d0f', roughness: 0.55, metalness: 0.0 });
  m.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;')
      .replace(
        '#include <worldpos_vertex>',
        '#include <worldpos_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;',
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vWPos;`)
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        float pitch = ${(BLOCK + STREET).toFixed(1)};
        // Streets run along the block boundaries (integer multiples of the pitch).
        vec2 g = vWPos.xz / pitch;
        vec2 d = (0.5 - abs(fract(g) - 0.5)) * pitch;
        float road = min(d.x, d.y);
        float glow = exp(-road * road * 0.03);
        // Sodium lamp pools on both kerbs every 18 m.
        float along = d.x < d.y ? vWPos.z : vWPos.x;
        float a = mod(along, 18.0) - 9.0;
        float across = road - 5.0;
        float pool = exp(-(a * a + across * across) * 0.14);
        totalEmissiveRadiance += vec3(1.0, 0.52, 0.2) * (0.012 * glow + 0.11 * pool);`,
      );
  };
  return m;
}

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
