import type * as THREE from 'three';
import { PAGE_ASPECT } from './inkLayer';

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
