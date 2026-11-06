import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import { HalfFloatType } from 'three';
import { useRuntime } from '@/state/runtime';
import { QUALITY_PROFILES } from './quality';
import { PRIORITY } from './sceneFrame';

/**
 * One post-processing chain for the whole stage (SPEC §9.4): controlled bloom,
 * AgX tone mapping, vignette and film grain. Effects follow the quality tier.
 */
export function PostFX() {
  const tier = useRuntime((s) => s.tier);
  const p = QUALITY_PROFILES[tier];

  const effects = [
    p.bloom ? (
      <Bloom
        key="bloom"
        mipmapBlur
        intensity={tier === 'high' ? 0.62 : 0.5}
        luminanceThreshold={0.82}
        luminanceSmoothing={0.22}
        radius={0.72}
        levels={tier === 'high' ? 8 : 6}
      />
    ) : null,
    <ToneMapping key="tonemap" mode={ToneMappingMode.AGX} />,
    <Vignette key="vignette" offset={0.28} darkness={0.66} />,
    p.grain ? <Noise key="grain" premultiply blendFunction={BlendFunction.SCREEN} opacity={0.32} /> : null,
  ].filter((e): e is NonNullable<typeof e> => e !== null);

  return (
    <EffectComposer
      key={tier}
      multisampling={0}
      frameBufferType={HalfFloatType}
      renderPriority={PRIORITY.composer}
      enableNormalPass={false}
    >
      {effects}
    </EffectComposer>
  );
}
