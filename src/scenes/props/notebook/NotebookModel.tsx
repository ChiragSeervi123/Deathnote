import { use, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { ensureCanvasFonts } from '@/app/fonts';
import { lerp, smoothstep } from '@/utils/math';
import {
  createCoverTitle,
  createInkAtlas,
  createInsideCover,
  createLeatherMaps,
  createPageEdge,
  createPaper,
  NB,
  PAGE_RULES,
  RULING,
} from './notebookTextures';
import type { NotebookState } from './notebookState';

let fontsPromise: Promise<void> | null = null;
function fontsReady(): Promise<void> {
  fontsPromise ??= ensureCanvasFonts();
  return fontsPromise;
}

const SEGMENTS = 28;
const W = NB.width;
const H = NB.height;
const C = NB.cover;
const P = NB.block;

/* ------------------------------------------------------------------ */
/* Materials                                                           */
/* ------------------------------------------------------------------ */

function leatherMaterial(normal: THREE.Texture, rough: THREE.Texture): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#151414'),
    roughness: 0.78,
    roughnessMap: rough,
    normalMap: normal,
    normalScale: new THREE.Vector2(0.16, 0.16),
    envMapIntensity: 0.55,
  });
  m.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vEdgeUv;')
      .replace('#include <uv_vertex>', '#include <uv_vertex>\nvEdgeUv = uv;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vEdgeUv;')
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
        float edgeD = min(min(vEdgeUv.x, 1.0 - vEdgeUv.x), min(vEdgeUv.y, 1.0 - vEdgeUv.y));
        float wear = 1.0 - smoothstep(0.0, 0.03, edgeD);
        roughnessFactor = mix(roughnessFactor, 0.38, wear * 0.8);
        diffuseColor.rgb += vec3(0.05, 0.047, 0.044) * wear;`,
      );
  };
  return m;
}

function pageFrontMaterial(paper: THREE.Texture, ink: THREE.Texture, channel: number, lines: number) {
  const uniforms = {
    uInk: { value: ink },
    uChannel: { value: new THREE.Vector4(...[0, 1, 2, 3].map((i) => (i === channel ? 1 : 0))) },
    uReveal: { value: 0 },
    uLineTop: { value: RULING.top },
    uLineStep: { value: RULING.step },
    uLineCount: { value: Math.max(1, lines) },
  };
  const m = new THREE.MeshStandardMaterial({ map: paper, roughness: 0.86, side: THREE.FrontSide });
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform sampler2D uInk; uniform vec4 uChannel; uniform float uReveal;
        uniform float uLineTop; uniform float uLineStep; uniform float uLineCount;`,
      )
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
        #ifdef USE_MAP
          float inkA = dot(texture2D(uInk, vMapUv), uChannel);
          float fromTop = 1.0 - vMapUv.y;
          float li = floor((fromTop - uLineTop) / uLineStep);
          float xf = clamp((vMapUv.x - 0.1) / 0.8, 0.0, 1.0);
          float lr = clamp(uReveal * uLineCount - li, 0.0, 1.0);
          float mask = 1.0 - smoothstep(lr - 0.012, lr + 0.012, xf);
          // Fresh ink near the pen front is a touch glossier/darker.
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.045, 0.038, 0.034), inkA * mask);
        #endif`,
      );
  };
  return { material: m, uniforms };
}

/* ------------------------------------------------------------------ */
/* Page curl                                                           */
/* ------------------------------------------------------------------ */

function createPageGeometry(): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  const count = (SEGMENTS + 1) * 2;
  const pos = new Float32Array(count * 3);
  const uv = new Float32Array(count * 2);
  const idx: number[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const u = i / SEGMENTS;
    uv.set([u, 1, u, 0], i * 4);
    if (i < SEGMENTS) {
      const a = i * 2;
      // Winding chosen so the front face points +y when the page lies on the right.
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

/**
 * Integrates the page along its width: the hinge sits at the spine, the free
 * edge lags behind mid-turn so the sheet bends like paper.
 */
function updatePageCurl(g: THREE.BufferGeometry, turn: number, yRight: number, yLeft: number): void {
  const pos = g.getAttribute('position') as THREE.BufferAttribute;
  const arr = pos.array as Float32Array;
  const t = smoothstep(0, 1, turn);
  const base = t * Math.PI;
  const lag = Math.sin(t * Math.PI) * 0.95;
  const ds = W / SEGMENTS;
  let x = 0;
  let y = lerp(yRight, yLeft, t);
  for (let i = 0; i <= SEGMENTS; i++) {
    const s = i / SEGMENTS;
    for (let k = 0; k < 2; k++) {
      const o = (i * 2 + k) * 3;
      arr[o] = x;
      arr[o + 1] = y;
      arr[o + 2] = k === 0 ? -H / 2 : H / 2;
    }
    const theta = base - lag * Math.pow(s, 1.5);
    x += Math.cos(theta) * ds;
    y += Math.sin(theta) * ds;
  }
  pos.needsUpdate = true;
  g.computeVertexNormals();
  g.computeBoundingSphere();
}

/* ------------------------------------------------------------------ */
/* Model                                                               */
/* ------------------------------------------------------------------ */

interface Props {
  state: NotebookState;
  /** Texture long-edge budget from the quality tier. */
  textureSize?: number;
  castShadow?: boolean;
}

/**
 * The Death Note — the site's hero object. Spine along x = 0, notebook body in
 * +x, lying on y = 0, page height along z. Fully procedural (ASSET_REGISTER).
 */
export function NotebookModel({ state, textureSize = 2048, castShadow = true }: Props) {
  use(fontsReady());

  const assets = useMemo(() => {
    const pageW = Math.min(1280, Math.round(textureSize * 0.62));
    const leather = createLeatherMaps(textureSize >= 2048 ? 1024 : 512);
    const title = createCoverTitle(Math.min(2048, textureSize));
    const inside = createInsideCover(pageW);
    const paper = createPaper(pageW, 21);
    const ink = createInkAtlas(Math.round(pageW * 0.85), PAGE_RULES);
    const edge = createPageEdge();

    const leatherMat = leatherMaterial(leather.normal, leather.rough);
    const titleMat = new THREE.MeshStandardMaterial({
      map: title,
      color: new THREE.Color('#e3dfd6'),
      transparent: true,
      roughness: 0.42,
      metalness: 0.2,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    });
    const insideMat = new THREE.MeshStandardMaterial({ map: inside, roughness: 0.82 });
    const paperMat = new THREE.MeshStandardMaterial({ map: paper, roughness: 0.88 });
    const backMat = new THREE.MeshStandardMaterial({ map: paper, roughness: 0.88, side: THREE.BackSide });
    const edgeTexX = edge.clone();
    edgeTexX.repeat.set(1, 1);
    const edgeMat = new THREE.MeshStandardMaterial({ map: edgeTexX, roughness: 0.95, color: '#ddd4c2' });

    const pages = state.pages.map((_, i) => {
      const rule = i < PAGE_RULES.length ? i : -1;
      const front =
        rule >= 0
          ? pageFrontMaterial(paper, ink.texture, rule, ink.lineCounts[rule] ?? 1)
          : { material: paperMat, uniforms: null };
      const geometry = createPageGeometry();
      return { geometry, front, back: backMat };
    });

    const coverGeo = new RoundedBoxGeometry(W + 0.03, C, H + 0.04, 3, 0.008);
    const spineGeo = new RoundedBoxGeometry(0.05, 2 * C + P, H + 0.04, 3, 0.02);
    const blockGeo = new THREE.BoxGeometry(W - 0.03, P, H - 0.03);
    const titleGeo = new THREE.PlaneGeometry(W * 0.64, W * 0.64 * 0.3);
    const insideGeo = new THREE.PlaneGeometry(W - 0.02, H - 0.02);

    return {
      textures: [leather.normal, leather.rough, title, inside, paper, ink.texture, edge, edgeTexX],
      materials: [leatherMat, titleMat, insideMat, paperMat, backMat, edgeMat, ...pages.flatMap((p) => (p.front.uniforms ? [p.front.material] : []))],
      geometries: [coverGeo, spineGeo, blockGeo, titleGeo, insideGeo, ...pages.map((p) => p.geometry)],
      leatherMat,
      titleMat,
      insideMat,
      paperMat,
      edgeMat,
      pages,
      coverGeo,
      spineGeo,
      blockGeo,
      titleGeo,
      insideGeo,
    };
  }, [state.pages, textureSize]);

  useEffect(
    () => () => {
      assets.textures.forEach((t) => t.dispose());
      assets.materials.forEach((m) => m.dispose());
      assets.geometries.forEach((g) => g.dispose());
    },
    [assets],
  );

  const coverPivot = useRef<THREE.Group>(null);
  const spineRef = useRef<THREE.Mesh>(null);
  const lastTurns = useRef<number[]>([]);

  useFrame(() => {
    // Cover hinge: pivot descends to the desk as it opens.
    const open = smoothstep(0, 1, state.coverOpen);
    const pivot = coverPivot.current;
    if (pivot) {
      pivot.rotation.z = open * Math.PI;
      // Closed: rests just above the loose pages. Open: lies on the desk.
      pivot.position.y = lerp(C + P + 0.009, C, open);
      pivot.position.x = -0.012 * Math.sin(open * Math.PI);
    }
    // The spine flattens into the gutter as the book opens (no ridge above the pages).
    const spine = spineRef.current;
    if (spine) {
      const sy = lerp(1, (C + P * 0.55) / (2 * C + P), open);
      spine.scale.y = sy;
      spine.position.y = ((2 * C + P) * sy) / 2;
    }
    const n = state.pages.length;
    const turnedCount = state.pages.filter((p) => p.turn >= 1).length;
    state.pages.forEach((p, i) => {
      const geo = assets.pages[i]!.geometry;
      const yRight = C + P + 0.0012 * (n - i);
      const yLeft = C + 0.002 + 0.0012 * Math.min(i, turnedCount);
      if (lastTurns.current[i] !== p.turn || !geo.boundingSphere) {
        updatePageCurl(geo, p.turn, yRight, yLeft);
        lastTurns.current[i] = p.turn;
      }
      const u = assets.pages[i]!.front.uniforms;
      if (u) u.uReveal.value = p.write;
    });
  });

  return (
    <group>
      {/* Back cover */}
      <mesh geometry={assets.coverGeo} material={assets.leatherMat} position={[W / 2, C / 2, 0]} castShadow={castShadow} receiveShadow />
      {/* Page block */}
      <mesh
        geometry={assets.blockGeo}
        material={[assets.edgeMat, assets.edgeMat, assets.paperMat, assets.edgeMat, assets.edgeMat, assets.edgeMat]}
        position={[W / 2 + 0.008, C + P / 2, 0]}
        castShadow={castShadow}
        receiveShadow
      />
      {/* Spine */}
      <mesh ref={spineRef} geometry={assets.spineGeo} material={assets.leatherMat} position={[-0.006, C + P / 2, 0]} castShadow={castShadow} />
      {/* Front cover on its hinge */}
      <group ref={coverPivot} position={[0, C + P + 0.009, 0]}>
        <mesh geometry={assets.coverGeo} material={assets.leatherMat} position={[W / 2, C / 2, 0]} castShadow={castShadow} receiveShadow />
        <mesh
          geometry={assets.titleGeo}
          material={assets.titleMat}
          position={[W / 2 + 0.01, C + 0.0015, -H * 0.2]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        <mesh geometry={assets.insideGeo} material={assets.insideMat} position={[W / 2, -0.0012, 0]} rotation={[Math.PI / 2, 0, Math.PI]} />
      </group>
      {/* Pages */}
      {assets.pages.map((p, i) => (
        <group key={i}>
          <mesh geometry={p.geometry} material={p.front.material} castShadow={castShadow} receiveShadow />
          <mesh geometry={p.geometry} material={p.back} receiveShadow />
        </group>
      ))}
    </group>
  );
}
