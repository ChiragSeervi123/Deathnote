import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useRuntime } from '@/state/runtime';
import { urlFlags } from '@/utils/urlFlags';
import { Compositor } from './Compositor';
import { FrameDriver } from './FrameDriver';
import { PostFX } from './PostFX';
import { QualityController } from './QualityController';
import { QUALITY_PROFILES } from './quality';
import { SceneDirector } from './SceneDirector';
import { StatsProbe } from './StatsProbe';
import './Stage.css';

/**
 * The single shared WebGL canvas for the main route (SPEC §10.2). Fixed behind
 * the DOM; decorative (aria-hidden) — every scene has a text equivalent.
 */
export default function Stage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tier = useRuntime((s) => s.tier);
  const setWebGL = useRuntime((s) => s.setWebGL);
  const profile = QUALITY_PROFILES[tier];

  return (
    <div ref={wrapperRef} className="stage" aria-hidden="true" style={{ opacity: 0 }}>
      <Canvas
        frameloop="never"
        flat
        dpr={[1, profile.dprMax]}
        gl={{
          antialias: false,
          alpha: false,
          depth: false,
          stencil: false,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, 1], near: 0.1, far: 10 }}
        eventSource={document.body}
        eventPrefix="client"
        onCreated={({ gl }) => {
          setWebGL('ready');
          const canvas = gl.domElement;
          canvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            setWebGL('lost', 'The graphics context was lost.');
          });
          canvas.addEventListener('webglcontextrestored', () => setWebGL('ready'));
        }}
      >
        <FrameDriver wrapperRef={wrapperRef} />
        <QualityController />
        <SceneDirector />
        <Compositor />
        <PostFX />
        {urlFlags.debug ? <StatsProbe /> : null}
      </Canvas>
    </div>
  );
}
