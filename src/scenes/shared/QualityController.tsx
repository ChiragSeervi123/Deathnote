import { useEffect, useMemo, useRef } from 'react';
import { PerformanceMonitor } from '@react-three/drei';
import { useRuntime } from '@/state/runtime';
import { useSettings } from '@/state/settings';
import { isSoftwareRenderer, probeWebGL2 } from '@/utils/webgl';
import { guessTier, readDeviceHints, stepTier, TIER_ORDER, type QualityTier } from './quality';

/**
 * Resolves the quality tier (SPEC §11.2). In `auto`, starts from device
 * heuristics, then steps down on sustained low frame rates and back up at
 * most to the initial guess. Manual choices are respected as-is.
 */
export function QualityController() {
  const pref = useSettings((s) => s.quality);
  const setTier = useRuntime((s) => s.setTier);
  const ceiling = useRef<QualityTier>('high');

  const initial = useMemo<QualityTier>(() => {
    if (pref !== 'auto') return pref;
    const probe = probeWebGL2();
    const software = probe.ok ? isSoftwareRenderer(probe.renderer) : true;
    return guessTier(readDeviceHints(software));
  }, [pref]);

  useEffect(() => {
    ceiling.current = initial;
    setTier(initial);
  }, [initial, setTier]);

  if (pref !== 'auto') return null;

  return (
    <PerformanceMonitor
      ms={400}
      iterations={8}
      flipflops={4}
      bounds={(refresh) => (refresh > 100 ? [55, 100] : [42, 58])}
      onDecline={() => {
        const cur = useRuntime.getState().tier;
        setTier(stepTier(cur, -1));
      }}
      onIncline={() => {
        const cur = useRuntime.getState().tier;
        const next = stepTier(cur, 1);
        if (TIER_ORDER.indexOf(next) <= TIER_ORDER.indexOf(ceiling.current)) setTier(next);
      }}
    />
  );
}
