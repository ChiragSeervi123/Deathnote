import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { smoothstep } from '@/utils/math';
import { useSceneFrame } from '../sceneFrame';
import { cardAspect, cardTexture, type CardSpec } from './cards';

/**
 * Evidence board: cards pin themselves to a dark wall as the chapter reaches
 * their moment; red string draws between them (signature "evidence-board
 * assembly", SPEC §9.2). Pure function of progress — reversible.
 */
export interface BoardCard {
  id: string;
  spec: CardSpec;
  /** Centre on the board (metres). */
  at: readonly [number, number];
  /** Width in metres (height follows the card aspect). */
  width: number;
  rot?: number;
  /** Chapter progress at which it is pinned. */
  appear: number;
}

export interface BoardString {
  from: string;
  to: string;
  appear: number;
  color?: string;
}

interface Props {
  cards: readonly BoardCard[];
  strings?: readonly BoardString[];
  /** Board size [w, h]. */
  size?: readonly [number, number];
  boardColor?: string;
}

export function EvidenceBoard({
  cards,
  strings = [],
  size = [9, 5],
  boardColor = '#15120f',
}: Props) {
  const groups = useRef<(THREE.Group | null)[]>([]);
  const strs = useRef<(THREE.Mesh | null)[]>([]);

  const a = useMemo(() => {
    const plane = new THREE.PlaneGeometry(1, 1);
    const items = cards.map((c, i) => {
      const map = cardTexture(c.spec, i * 13 + 5);
      const mat = new THREE.MeshStandardMaterial({ map, roughness: 0.85 });
      return { c, map, mat, h: c.width * cardAspect(c.spec) };
    });
    const pinGeo = new THREE.SphereGeometry(0.035, 12, 8);
    const pinMat = new THREE.MeshStandardMaterial({ color: '#b3121b', roughness: 0.35 });
    const strGeo = new THREE.BoxGeometry(1, 0.012, 0.004);
    strGeo.translate(0.5, 0, 0);
    const strMat = new THREE.MeshStandardMaterial({
      color: '#a8161e',
      roughness: 0.6,
      emissive: '#3a0306',
    });
    const boardMat = new THREE.MeshStandardMaterial({ color: boardColor, roughness: 0.95 });
    const byId = new Map(items.map((it) => [it.c.id, it]));
    const lines = strings.map((s) => {
      const A = byId.get(s.from)?.c.at ?? [0, 0];
      const B = byId.get(s.to)?.c.at ?? [0, 0];
      const len = Math.hypot(B[0] - A[0], B[1] - A[1]);
      const ang = Math.atan2(B[1] - A[1], B[0] - A[0]);
      return { s, A, len, ang };
    });
    return { plane, items, pinGeo, pinMat, strGeo, strMat, boardMat, lines };
  }, [cards, strings, boardColor]);

  useEffect(
    () => () => {
      a.plane.dispose();
      a.items.forEach((i) => {
        i.map.dispose();
        i.mat.dispose();
      });
      a.pinGeo.dispose();
      a.pinMat.dispose();
      a.strGeo.dispose();
      a.strMat.dispose();
      a.boardMat.dispose();
    },
    [a],
  );

  useSceneFrame((f) => {
    const p = f.progress;
    a.items.forEach((it, i) => {
      const g = groups.current[i];
      if (!g) return;
      const k = smoothstep(it.c.appear - 0.03, it.c.appear + 0.02, p);
      g.visible = k > 0.001;
      // Arrives from slightly in front and above, settling onto the pin.
      g.position.set(it.c.at[0], it.c.at[1] + (1 - k) * 0.25, 0.02 + (1 - k) * 0.6);
      g.rotation.z = (it.c.rot ?? 0) + (1 - k) * 0.25;
      g.scale.setScalar(0.85 + 0.15 * k);
    });
    a.lines.forEach((l, i) => {
      const m = strs.current[i];
      if (!m) return;
      const k = smoothstep(l.s.appear, l.s.appear + 0.05, p);
      m.visible = k > 0.001;
      m.scale.x = Math.max(0.0001, l.len * k);
    });
  });

  return (
    <group>
      <mesh
        geometry={a.plane}
        material={a.boardMat}
        scale={[size[0], size[1], 1]}
        position={[0, 0, -0.01]}
        receiveShadow
      />
      {a.items.map((it, i) => (
        <group key={it.c.id} ref={(g) => void (groups.current[i] = g)}>
          <mesh geometry={a.plane} material={it.mat} scale={[it.c.width, it.h, 1]} castShadow />
          <mesh geometry={a.pinGeo} material={a.pinMat} position={[0, it.h / 2 - 0.06, 0.03]} />
        </group>
      ))}
      {a.lines.map((l, i) => (
        <mesh
          key={i}
          ref={(m) => void (strs.current[i] = m)}
          geometry={a.strGeo}
          material={a.strMat}
          position={[l.A[0], l.A[1], 0.05]}
          rotation={[0, 0, l.ang]}
        />
      ))}
    </group>
  );
}
