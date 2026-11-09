import type { QualityTier } from '@/scenes/shared/quality';

/**
 * Developer / QA switches read once from the URL:
 *   ?debug              performance overlay + window.__DN__
 *   ?webgl=0            force the 2D fallback
 *   ?quality=high|balanced|performance
 *   ?motion=reduce|full
 *   ?gate=0             skip the spoiler gate (testing only)
 */
export interface UrlFlags {
  debug: boolean;
  webgl: boolean;
  quality: QualityTier | null;
  motion: 'reduce' | 'full' | null;
  gate: boolean;
  /** `?grain=0` disables film grain (diagnostics). */
  grain: boolean;
  /** `?wip` renders scenes still under construction (scene builders only). */
  wip: boolean;
}

function read(): UrlFlags {
  const p =
    typeof window === 'undefined'
      ? new URLSearchParams()
      : new URLSearchParams(window.location.search);
  const q = p.get('quality');
  const m = p.get('motion');
  return {
    debug: p.has('debug'),
    webgl: p.get('webgl') !== '0',
    quality: q === 'high' || q === 'balanced' || q === 'performance' ? q : null,
    motion: m === 'reduce' || m === 'full' ? m : null,
    gate: p.get('gate') !== '0',
    grain: p.get('grain') !== '0',
    wip: p.has('wip'),
  };
}

export const urlFlags: UrlFlags = read();
