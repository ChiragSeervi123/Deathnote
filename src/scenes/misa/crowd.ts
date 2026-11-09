import * as THREE from 'three';
import { capsule, disc } from '@/characters/shared/shapes';
import { mulberry32 } from '@/utils/math';
import { LABEL_COLS, LABEL_ROWS } from './stageAssets';

/**
 * The faceless crowd Misa looks at through the Eyes, and the labels the Eyes
 * show above their heads. Both are instanced, yaw-billboarded in the vertex
 * shader (so the flat silhouettes never turn edge-on) and fogged by hand.
 */
const vertex = /* glsl */ `
attribute vec2 aCell;
uniform vec2 uCellSize;
varying vec2 vUv;
varying float vDepth;
void main() {
  vec3 c = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  float s = length(instanceMatrix[0].xyz);
  vec3 toCam = cameraPosition - c;
  toCam.y = 0.0;
  toCam = normalize(toCam);
  vec3 right = vec3(toCam.z, 0.0, -toCam.x);
  vec3 world = c + right * position.x * s + vec3(0.0, position.y * s, 0.0);
  vec4 mv = viewMatrix * vec4(world, 1.0);
  vDepth = -mv.z;
  vUv = (aCell + uv) * uCellSize;
  gl_Position = projectionMatrix * mv;
}
`;

const fragment = /* glsl */ `
precision highp float;
uniform sampler2D uMap;
uniform float uUseMap;
uniform vec3 uColor;
uniform float uOpacity;
uniform vec3 uFogColor;
uniform vec2 uFog;
varying vec2 vUv;
varying float vDepth;
void main() {
  vec4 tex = uUseMap > 0.5 ? texture2D(uMap, vUv) : vec4(1.0);
  vec3 col = uColor * tex.rgb;
  float f = smoothstep(uFog.x, uFog.y, vDepth);
  col = mix(col, uFogColor, f);
  float a = tex.a * uOpacity;
  if (a < 0.01) discard;
  gl_FragColor = vec4(col, a);
}
`;

export interface CrowdBuild {
  crowd: THREE.InstancedMesh;
  labels: THREE.InstancedMesh;
  labelMat: THREE.ShaderMaterial;
  dispose: () => void;
}

/** `owner` is where the notebook owner stands; cell 0 of the atlas is placed above him. */
export function buildCrowd(
  count: number,
  owner: readonly [number, number],
  ownerHeight: number,
  atlas: THREE.Texture,
  fogColor: THREE.Color,
  fog: readonly [number, number],
): CrowdBuild {
  const rnd = mulberry32(19);
  const person = new THREE.ShapeGeometry(
    [
      disc([0, 1.62], 0.11, 0.13),
      ...capsule([0, 1.45], [0, 0.9], 0.21, 0.17),
      ...capsule([0, 0.9], [0, 0.05], 0.17, 0.12),
    ],
    6,
  );
  person.setAttribute('aCell', new THREE.InstancedBufferAttribute(new Float32Array(count * 2), 2));
  const shared = {
    uFogColor: { value: fogColor },
    uFog: { value: new THREE.Vector2(fog[0], fog[1]) },
    uCellSize: { value: new THREE.Vector2(1 / LABEL_COLS, 1 / LABEL_ROWS) },
  };
  const crowdMat = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      ...shared,
      uMap: { value: null },
      uUseMap: { value: 0 },
      uColor: { value: new THREE.Color('#050506') },
      uOpacity: { value: 1 },
    },
    side: THREE.DoubleSide,
  });
  const crowd = new THREE.InstancedMesh(person, crowdMat, count);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const heads: THREE.Vector3[] = [];
  // Two labelled ranks, staggered so no label hides another from where she
  // stands; everyone else fills out behind them, unlabelled.
  const ranks: Array<[number, number]> = [];
  for (let k = 0; k < 7; k++) ranks.push([(k - 3) * 1.45, 5.4]);
  for (let k = 0; k < 6; k++) ranks.push([(k - 2.5) * 1.45, 7.9]);
  // The owner takes one of the front places.
  const freeRanks = ranks.filter(([x, z]) => Math.hypot(x - owner[0], z - owner[1]) > 0.5);
  for (let i = 0; i < count; i++) {
    const front = freeRanks[i];
    let x = 0;
    let z = 0;
    if (front) [x, z] = front;
    else
      for (let tries = 0; tries < 8; tries++) {
        x = (rnd() - 0.5) * 13;
        z = 9 + rnd() * 8;
        if (Math.hypot(x - owner[0], z - owner[1]) > 0.75) break;
      }
    const s = front ? 0.95 + rnd() * 0.1 : 0.88 + rnd() * 0.22;
    m.compose(new THREE.Vector3(x, 0, z), q, new THREE.Vector3(s, s, s));
    crowd.setMatrixAt(i, m);
    if (front) heads.push(new THREE.Vector3(x, 1.75 * s + 0.3, z));
  }
  crowd.frustumCulled = false;

  const n = Math.min(heads.length, LABEL_COLS * LABEL_ROWS - 1) + 1;
  const quad = new THREE.PlaneGeometry(0.52, 0.195);
  quad.translate(0, 0.098, 0);
  const cells = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    cells[i * 2] = i % LABEL_COLS;
    // Canvas row 0 is at the top of the texture; UV v grows upward.
    cells[i * 2 + 1] = LABEL_ROWS - 1 - Math.floor(i / LABEL_COLS);
  }
  quad.setAttribute('aCell', new THREE.InstancedBufferAttribute(cells, 2));
  const labelMat = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      ...shared,
      uMap: { value: atlas },
      uUseMap: { value: 1 },
      uColor: { value: new THREE.Color(1.6, 1.5, 1.45) },
      uOpacity: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const labels = new THREE.InstancedMesh(quad, labelMat, n);
  labels.frustumCulled = false;
  labels.renderOrder = 2;
  for (let i = 0; i < n; i++) {
    const p = i === 0 ? new THREE.Vector3(owner[0], ownerHeight + 0.32, owner[1]) : heads[i - 1]!;
    m.compose(p, q, new THREE.Vector3(1, 1, 1));
    labels.setMatrixAt(i, m);
  }

  return {
    crowd,
    labels,
    labelMat,
    dispose: () => {
      person.dispose();
      crowdMat.dispose();
      crowd.dispose();
      quad.dispose();
      labelMat.dispose();
      labels.dispose();
    },
  };
}
