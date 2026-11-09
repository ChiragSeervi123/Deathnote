import { Suspense, useEffect, useState, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { urlFlags } from '@/utils/urlFlags';
import { isSoftwareRenderer, probeWebGL2 } from '@/utils/webgl';
import { guessTier, QUALITY_PROFILES, readDeviceHints, type QualityTier } from '../shared/quality';
import { TributeScene } from './TributeScene';
import { measureSections } from './tributeTimeline';

interface Props {
  mainRef: RefObject<HTMLElement | null>;
  reduced: boolean;
  /** First frames rendered: the DOM may hide its CSS page art. */
  onReady: () => void;
  /** Context lost: fall back to the CSS page art. */
  onLost: () => void;
}

function initialTier(): QualityTier {
  if (urlFlags.quality) return urlFlags.quality;
  const probe = probeWebGL2();
  return guessTier(readDeviceHints(probe.ok ? isSoftwareRenderer(probe.renderer) : true));
}

/**
 * The tribute's own small WebGL canvas (lazy chunk), fixed behind the DOM and
 * decorative (aria-hidden): every word on the page stays in the DOM.
 */
export default function TributeStage({ mainRef, reduced, onReady, onLost }: Props) {
  const [tier] = useState(initialTier);
  const profile = QUALITY_PROFILES[tier];

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const measure = () => measureSections(main);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(main);
    window.addEventListener('resize', measure);
    void document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [mainRef]);

  return (
    <div className="t-stage" aria-hidden="true">
      <Canvas
        dpr={[1, Math.min(profile.dprMax, 1.75)]}
        shadows={profile.shadows ? 'percentage' : false}
        gl={{
          antialias: profile.msaa > 0,
          powerPreference: 'high-performance',
          toneMapping: THREE.AgXToneMapping,
          toneMappingExposure: 1.0,
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            onLost();
          });
          if (urlFlags.debug) gl.info.autoReset = false;
        }}
      >
        <Suspense fallback={null}>
          <TributeScene tier={tier} reduced={reduced} onReady={onReady} />
        </Suspense>
        {urlFlags.debug ? <TributeStats tier={tier} /> : null}
      </Canvas>
    </div>
  );
}

/** `?debug`: publish renderer stats to window.__DN__ (same shape as the main stage). */
function TributeStats({ tier }: { tier: QualityTier }) {
  const [state] = useState(() => ({ samples: [] as number[], last: performance.now() }));
  // Priority > 0 takes over rendering, so this probe renders the frame itself.
  useFrame(({ gl, scene, camera }) => {
    gl.render(scene, camera);
    const now = performance.now();
    state.samples.push(now - state.last);
    state.last = now;
    if (state.samples.length > 90) state.samples.shift();
    const avg = state.samples.reduce((a, b) => a + b, 0) / state.samples.length;
    window.__DN__ = {
      fps: Math.round(1000 / avg),
      frameMsP95: 0,
      calls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
      geometries: gl.info.memory.geometries,
      textures: gl.info.memory.textures,
      programs: gl.info.programs?.length ?? 0,
      tier,
      mounted: ['tribute'],
      ready: ['tribute'],
      a: 'tribute',
      b: null,
      mix: 0,
    };
    gl.info.reset();
  }, 1);
  return null;
}
