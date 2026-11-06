/**
 * Adaptive quality (SPEC §11.2). Pure data + heuristics; no React, no Three.
 */
export type QualityTier = 'high' | 'balanced' | 'performance';
export type QualityPreference = 'auto' | QualityTier;

export interface QualityProfile {
  tier: QualityTier;
  /** Upper bound for devicePixelRatio. */
  dprMax: number;
  /** MSAA samples on scene render targets (WebGL2). */
  msaa: number;
  bloom: boolean;
  grain: boolean;
  /** Multiplier for particle and instance counts. */
  particles: number;
  shadows: boolean;
  shadowMapSize: number;
  /** Character/illustration texture long edge, px. */
  textureSize: number;
}

export const QUALITY_PROFILES: Record<QualityTier, QualityProfile> = {
  high: {
    tier: 'high',
    dprMax: 2,
    msaa: 4,
    bloom: true,
    grain: true,
    particles: 1,
    shadows: true,
    shadowMapSize: 2048,
    textureSize: 2048,
  },
  balanced: {
    tier: 'balanced',
    dprMax: 1.5,
    msaa: 2,
    bloom: true,
    grain: true,
    particles: 0.6,
    shadows: true,
    shadowMapSize: 1024,
    textureSize: 1536,
  },
  performance: {
    tier: 'performance',
    dprMax: 1,
    msaa: 0,
    bloom: false,
    grain: true,
    particles: 0.3,
    shadows: false,
    shadowMapSize: 512,
    textureSize: 1024,
  },
};

export const TIER_ORDER: readonly QualityTier[] = ['performance', 'balanced', 'high'];

export interface DeviceHints {
  coarsePointer: boolean;
  viewportWidth: number;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  softwareRenderer: boolean;
}

/** Initial guess for `auto`; PerformanceMonitor refines it at runtime. */
export function guessTier(h: DeviceHints): QualityTier {
  if (h.softwareRenderer) return 'performance';
  if (h.coarsePointer && h.viewportWidth < 1024) return 'performance';
  if ((h.deviceMemory !== undefined && h.deviceMemory <= 4) || (h.hardwareConcurrency ?? 8) <= 4) {
    return 'balanced';
  }
  if (h.coarsePointer) return 'balanced';
  return 'high';
}

export function stepTier(tier: QualityTier, dir: -1 | 1): QualityTier {
  const i = TIER_ORDER.indexOf(tier);
  const next = TIER_ORDER[Math.min(TIER_ORDER.length - 1, Math.max(0, i + dir))];
  return next ?? tier;
}

export function readDeviceHints(softwareRenderer: boolean): DeviceHints {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return {
    coarsePointer: window.matchMedia?.('(pointer: coarse)').matches ?? false,
    viewportWidth: window.innerWidth,
    hardwareConcurrency: nav.hardwareConcurrency,
    deviceMemory: nav.deviceMemory,
    softwareRenderer,
  };
}
