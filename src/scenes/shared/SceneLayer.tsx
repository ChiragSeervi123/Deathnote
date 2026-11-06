import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';
import * as THREE from 'three';
import type { SceneKey } from '@/chapters/types';
import { ErrorBoundary } from '@/app/ErrorBoundary';
import { useRuntime } from '@/state/runtime';
import { SCENES } from '../registry';
import { QUALITY_PROFILES } from './quality';
import { PRIORITY, SceneKeyContext } from './sceneFrame';
import { isLayerActive, stageState } from './stageState';

/**
 * One chapter environment rendered off-screen: its own THREE.Scene and camera
 * (through an R3F portal) into its own HDR render target. Unmounting the
 * layer disposes everything the scene created (SPEC §10.2).
 */
export function SceneLayer({ sceneKey }: { sceneKey: SceneKey }) {
  const entry = SCENES[sceneKey];
  const [portalScene] = useState(() => {
    const s = new THREE.Scene();
    s.name = `scene:${sceneKey}`;
    return s;
  });
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const tier = useRuntime((s) => s.tier);
  const setSceneStatus = useRuntime((s) => s.setSceneStatus);
  const samples =
    dpr > 1.3 ? Math.min(2, QUALITY_PROFILES[tier].msaa) : QUALITY_PROFILES[tier].msaa;

  const target = useFBO(
    Math.max(1, Math.round(size.width * dpr)),
    Math.max(1, Math.round(size.height * dpr)),
    {
      type: THREE.HalfFloatType,
      samples,
      depthBuffer: true,
      stencilBuffer: false,
    },
  );

  useLayoutEffect(() => {
    stageState.textures.set(sceneKey, target.texture);
    return () => {
      if (stageState.textures.get(sceneKey) === target.texture)
        stageState.textures.delete(sceneKey);
    };
  }, [sceneKey, target]);

  useEffect(() => {
    setSceneStatus(sceneKey, 'loading');
    return () => {
      stageState.ready.delete(sceneKey);
      stageState.failed.delete(sceneKey);
      // Anything attached directly to the portal scene (e.g. environment maps) is released here.
      portalScene.environment?.dispose();
      if (portalScene.background instanceof THREE.Texture) portalScene.background.dispose();
    };
  }, [sceneKey, portalScene, setSceneStatus]);

  if (!entry.Component) return null;
  const SceneComponent = entry.Component;

  return createPortal(
    <SceneKeyContext.Provider value={sceneKey}>
      <LayerRenderer sceneKey={sceneKey} target={target} />
      <ErrorBoundary
        fallback={<StatusSignal sceneKey={sceneKey} status="error" />}
        onError={(err) => console.warn(`[scene:${sceneKey}] failed`, err)}
      >
        <Suspense fallback={null}>
          <SceneComponent />
          <StatusSignal sceneKey={sceneKey} status="ready" />
        </Suspense>
      </ErrorBoundary>
    </SceneKeyContext.Provider>,
    portalScene,
  );
}

function StatusSignal({ sceneKey, status }: { sceneKey: SceneKey; status: 'ready' | 'error' }) {
  const setSceneStatus = useRuntime((s) => s.setSceneStatus);
  useEffect(() => {
    if (status === 'ready') {
      stageState.ready.add(sceneKey);
      stageState.warmFrames = Math.max(stageState.warmFrames, 3);
    } else stageState.failed.add(sceneKey);
    setSceneStatus(sceneKey, status);
    return () => {
      stageState.ready.delete(sceneKey);
    };
  }, [sceneKey, status, setSceneStatus]);
  return null;
}

/** Renders the portal scene into its target when it contributes to the frame. */
function LayerRenderer({
  sceneKey,
  target,
}: {
  sceneKey: SceneKey;
  target: THREE.WebGLRenderTarget;
}) {
  const warmed = useRef(false);

  useFrame((state) => {
    const ready = stageState.ready.has(sceneKey);
    if (!ready) {
      warmed.current = false;
      return;
    }
    // First frame after loading: render once off-screen to compile shaders and
    // upload textures before the scene is ever shown (avoids hitches, R6).
    if (!isLayerActive(sceneKey) && warmed.current) return;
    const { gl, scene, camera } = state;
    const prev = gl.getRenderTarget();
    gl.setRenderTarget(target);
    // The post-processing composer disables renderer.autoClear, so clear
    // explicitly: otherwise scenes without a colour background accumulate stale
    // pixels and depth from previous frames.
    gl.setClearColor(0x000000, 1);
    gl.clear(true, true, false);
    gl.render(scene, camera);
    gl.setRenderTarget(prev);
    warmed.current = true;
  }, PRIORITY.layerRender);

  return null;
}
