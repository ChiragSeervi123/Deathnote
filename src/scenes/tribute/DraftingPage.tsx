import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { canvasTexture } from '../shared/canvasTextures';
import { PAGE_ASPECT, type InkLayer } from './inkLayer';
import { contactBlot, manuscriptPaper, plainPaper } from './tributeTextures';

/** Page size in scene units (≈ decimetres: a B4 sheet). */
export const PAGE_W = 2.57;
export const PAGE_H = PAGE_W * PAGE_ASPECT;
export const PAGE_Y = 0.012;

/** Page units (x 0..1, y 0..aspect down) → world xz on the table. */
export function pageToWorld(x: number, y: number, out: THREE.Vector3): THREE.Vector3 {
  return out.set((x - 0.5) * PAGE_W, PAGE_Y, (y / PAGE_ASPECT - 0.5) * PAGE_H);
}

/** Mutable ink state written by the scene each frame. */
export interface PageInk {
  story: number;
  art: number;
  together: number;
  /** Opacity of the pencil layer (fades under the ink, returns for "Together"). */
  pencil: number;
  /** 1 = reduced motion: layers fade in whole instead of drawing. */
  fade: number;
}

export const createPageInk = (): PageInk => ({ story: 0, art: 0, together: 0, pencil: 1, fade: 0 });

interface Props {
  layers: { story: InkLayer; art: InkLayer; together: InkLayer };
  ink: PageInk;
  textureWidth: number;
}

const LAYER_GLSL = /* glsl */ `
uniform sampler2D uStoryTex; uniform sampler2D uArtTex; uniform sampler2D uTogTex;
uniform float uStory; uniform float uArt; uniform float uTog; uniform float uPencil; uniform float uFade;
float inkLayer(sampler2D tex, vec2 uv, float reveal) {
  vec3 s = texture2D(tex, uv).rgb;
  float cov = s.r;
  if (cov < 0.004) return 0.0;
  float inv = 1.0 / cov;
  float k = floor(s.b * inv * (255.0 / 16.0) + 0.5);
  float t = (k + clamp(s.g * inv, 0.0, 1.0)) / 16.0;
  float on = uFade > 0.5 ? clamp(reveal, 0.0, 1.0) : clamp((reveal - t) / 0.0025, 0.0, 1.0);
  return cov * on;
}
float graphiteGrain(vec2 uv) {
  vec2 c = floor(uv * vec2(900.0, 1275.0));
  return fract(sin(dot(c, vec2(12.9898, 78.233))) * 43758.5453);
}
`;

/** The blank manuscript page that writes and draws itself, on a small stack of sheets. */
export function DraftingPage({ layers, ink, textureWidth }: Props) {
  const assets = useMemo(() => {
    const paper = manuscriptPaper(Math.min(1536, textureWidth));
    const inkTex = (l: InkLayer) => {
      const c = document.createElement('canvas');
      l.render(c, textureWidth);
      return canvasTexture(c, { srgb: false, anisotropy: 4 });
    };
    const storyTex = inkTex(layers.story);
    const artTex = inkTex(layers.art);
    const togTex = inkTex(layers.together);
    const uniforms = {
      uStoryTex: { value: storyTex },
      uArtTex: { value: artTex },
      uTogTex: { value: togTex },
      uStory: { value: 0 },
      uArt: { value: 0 },
      uTog: { value: 0 },
      uPencil: { value: 1 },
      uFade: { value: 0 },
    };
    const pageMat = new THREE.MeshStandardMaterial({ map: paper, roughness: 0.92 });
    pageMat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>\n${LAYER_GLSL}`)
        .replace(
          '#include <map_fragment>',
          `#include <map_fragment>
          float pencil = inkLayer(uStoryTex, vMapUv, uStory) * uPencil;
          float g = graphiteGrain(vMapUv);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.34, 0.33, 0.32), pencil * (0.62 + 0.38 * g));
          float inkA = max(inkLayer(uArtTex, vMapUv, uArt), inkLayer(uTogTex, vMapUv, uTog));
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.045, 0.04, 0.036), inkA);`,
        )
        .replace(
          '#include <roughnessmap_fragment>',
          `#include <roughnessmap_fragment>
          roughnessFactor = mix(roughnessFactor, 0.55, inkA * 0.6);`,
        );
    };
    const under = plainPaper();
    const underMat = new THREE.MeshStandardMaterial({ map: under, roughness: 0.95, color: '#f2ede4' });
    const blot = contactBlot();
    const blotMat = new THREE.MeshBasicMaterial({
      map: blot,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
    });
    const pageGeo = new THREE.PlaneGeometry(PAGE_W, PAGE_H);
    pageGeo.rotateX(-Math.PI / 2);
    const blotGeo = new THREE.PlaneGeometry(PAGE_W * 1.32, PAGE_H * 1.22);
    blotGeo.rotateX(-Math.PI / 2);
    return {
      uniforms,
      pageMat,
      underMat,
      blotMat,
      pageGeo,
      blotGeo,
      dispose: () => {
        [paper, storyTex, artTex, togTex, under, blot].forEach((t) => t.dispose());
        [pageMat, underMat, blotMat].forEach((m) => m.dispose());
        [pageGeo, blotGeo].forEach((g) => g.dispose());
      },
    };
  }, [layers, textureWidth]);

  useEffect(() => () => assets.dispose(), [assets]);

  useFrame(() => {
    const u = assets.uniforms;
    u.uStory.value = ink.story;
    u.uArt.value = ink.art;
    u.uTog.value = ink.together;
    u.uPencil.value = ink.pencil;
    u.uFade.value = ink.fade;
  });

  return (
    <group>
      <mesh geometry={assets.blotGeo} material={assets.blotMat} position={[0.06, 0.001, 0.08]} renderOrder={1} />
      <mesh
        geometry={assets.pageGeo}
        material={assets.underMat}
        position={[0.12, 0.004, -0.06]}
        rotation={[0, 0.045, 0]}
        receiveShadow
      />
      <mesh
        geometry={assets.pageGeo}
        material={assets.underMat}
        position={[-0.05, 0.008, 0.04]}
        rotation={[0, -0.03, 0]}
        receiveShadow
      />
      <mesh geometry={assets.pageGeo} material={assets.pageMat} position={[0, PAGE_Y, 0]} receiveShadow />
    </group>
  );
}
