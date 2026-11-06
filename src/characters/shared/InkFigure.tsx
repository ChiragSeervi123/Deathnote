import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, type ReactNode } from 'react';
import * as THREE from 'three';
import type { P } from './shapes';

/**
 * InkFigure — the project's 2.5D character renderer (ARCHITECTURE §3.4).
 *
 * A figure is a tree of parts. Each part has an ink mass (the silhouette) and
 * optional flat-colour "lit" layers drawn on top (face planes, hair shine,
 * shirt, eye whites…), giving a cel-shaded, high-contrast look in the spirit
 * of ink illustration. A rim copy offset behind the ink catches the light.
 * Every part is a THREE.Group around its pivot so scenes can animate it.
 *
 * Coordinates: metres, y up, figure facing the camera on +z unless authored
 * in profile. Layers stack in z by their order (≈1 mm apart).
 */

export interface FigureLayer {
  shapes: THREE.Shape[];
  color: string;
  /** Multiplier > 1 makes the colour glow under bloom (eyes, screens). */
  emissive?: number;
  opacity?: number;
}

export interface FigurePart {
  id: string;
  /** Parent part id; omitted = root. */
  parent?: string;
  /** Pivot position in the parent's space (shapes are authored relative to it). */
  pivot?: P;
  /** Extra depth offset for parallax between parts. */
  z?: number;
  /** Silhouette mass (ink). */
  ink?: THREE.Shape[];
  /** Flat-colour layers drawn over the ink, in order. */
  layers?: FigureLayer[];
}

export interface InkFigureProps {
  parts: readonly FigurePart[];
  inkColor?: string;
  rimColor?: string;
  /** Rim offset in metres (direction the light comes from, reversed). */
  rimOffset?: P;
  /** Curve resolution for shapes. */
  curveSegments?: number;
  /** Honour scene fog. */
  fog?: boolean;
}

export interface InkFigureHandle {
  root: THREE.Group | null;
  part: (id: string) => THREE.Group | undefined;
  /** Scale emissive layers (eye glow) 0..n. */
  setGlow: (k: number) => void;
}

interface Built {
  id: string;
  parent?: string;
  pivot: P;
  z: number;
  ink: THREE.ShapeGeometry | null;
  layers: { geo: THREE.ShapeGeometry; mat: THREE.MeshBasicMaterial; base: THREE.Color; emissive: number }[];
}

export const InkFigure = forwardRef<InkFigureHandle, InkFigureProps>(function InkFigure(
  { parts, inkColor = '#050505', rimColor = '#6f6a62', rimOffset = [-0.008, 0.01], curveSegments = 8, fog = true },
  ref,
) {
  const rootRef = useRef<THREE.Group>(null);
  const groups = useRef(new Map<string, THREE.Group>());

  const built = useMemo(() => {
    const ink = new THREE.MeshBasicMaterial({ color: inkColor, side: THREE.DoubleSide, fog });
    const rim = new THREE.MeshBasicMaterial({ color: rimColor, side: THREE.DoubleSide, fog });
    const list: Built[] = parts.map((p) => ({
      id: p.id,
      parent: p.parent,
      pivot: p.pivot ?? [0, 0],
      z: p.z ?? 0,
      ink: p.ink?.length ? new THREE.ShapeGeometry(p.ink, curveSegments) : null,
      layers: (p.layers ?? []).map((l) => {
        const base = new THREE.Color(l.color);
        const mat = new THREE.MeshBasicMaterial({
          color: base.clone().multiplyScalar(l.emissive ?? 1),
          side: THREE.DoubleSide,
          transparent: (l.opacity ?? 1) < 1,
          opacity: l.opacity ?? 1,
          toneMapped: !(l.emissive && l.emissive > 1),
          fog: fog && !(l.emissive && l.emissive > 1),
        });
        return { geo: new THREE.ShapeGeometry(l.shapes, curveSegments), mat, base, emissive: l.emissive ?? 1 };
      }),
    }));
    return { ink, rim, list };
  }, [parts, inkColor, rimColor, curveSegments, fog]);

  useEffect(
    () => () => {
      built.ink.dispose();
      built.rim.dispose();
      for (const b of built.list) {
        b.ink?.dispose();
        for (const l of b.layers) {
          l.geo.dispose();
          l.mat.dispose();
        }
      }
    },
    [built],
  );

  useImperativeHandle(
    ref,
    () => ({
      get root() {
        return rootRef.current;
      },
      part: (id) => groups.current.get(id),
      setGlow: (k) => {
        for (const b of built.list)
          for (const l of b.layers)
            if (l.emissive > 1) l.mat.color.copy(l.base).multiplyScalar(l.emissive * k);
      },
    }),
    [built],
  );

  const render = (parentId: string | undefined): ReactNode =>
    built.list
      .filter((b) => b.parent === parentId)
      .map((b) => (
        <group
          key={b.id}
          ref={(g) => {
            if (g) groups.current.set(b.id, g);
            else groups.current.delete(b.id);
          }}
          position={[b.pivot[0], b.pivot[1], b.z]}
        >
          {b.ink ? (
            <>
              <mesh geometry={b.ink} material={built.rim} position={[rimOffset[0], rimOffset[1], -0.002]} />
              <mesh geometry={b.ink} material={built.ink} />
            </>
          ) : null}
          {b.layers.map((l, i) => (
            <mesh key={i} geometry={l.geo} material={l.mat} position={[0, 0, 0.001 * (i + 1)]} />
          ))}
          {render(b.id)}
        </group>
      ));

  return <group ref={rootRef}>{render(undefined)}</group>;
});
