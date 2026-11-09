import * as THREE from 'three';

export const BLOCK = 46;
export const STREET = 14;

/** Night windows, generated per face in world space (no textures). */
export function buildingMaterial(): THREE.MeshStandardMaterial {
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
export function groundMaterial(): THREE.MeshStandardMaterial {
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
