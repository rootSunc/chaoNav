import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import type { NavigationId } from '../../../data/siteContent';
import { useCanvasLifecycle } from '../../../hooks/useCanvasLifecycle';
import { usePointerParallax } from '../../../hooks/usePointerParallax';
import type { SceneQuality } from '../../../hooks/useSceneQuality';
import {
  getSceneDpr,
  getSceneFrameLoop,
  SCENE_GL,
  shouldAntialias,
} from '../../../lib/sceneConfig';
import { getLinkAccentColor } from '../audio/linkColors';
import { SonicCoreScene } from '../audio/SonicCoreScene';

export type CosmicStageProps = {
  readonly activeLinkId: NavigationId;
  readonly isPlaying: boolean;
  readonly quality: Exclude<SceneQuality, 'off'>;
};

// Shift the sculpture toward the open left/hero side of the composition so it
// reads as a glowing centerpiece instead of hiding behind the terminal panel.
function CosmicCamera({ isPlaying }: { readonly isPlaying: boolean }) {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const target = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    const wide = size.width >= 1024;
    target.current.x = wide ? 1.45 : 0;
    target.current.y = wide ? -0.12 : 0;

    const targetZ = (isPlaying ? 3.7 : 3.95) - (wide ? 0.1 : 0);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 3.4, delta);
    camera.lookAt(target.current);
  });

  return null;
}

export function CosmicStage({ activeLinkId, isPlaying, quality }: CosmicStageProps) {
  const pointer = usePointerParallax(true);
  const { isActive, ref } = useCanvasLifecycle<HTMLDivElement>();

  return (
    <div
      aria-hidden="true"
      className={`cosmic-stage${isPlaying ? ' is-playing' : ''}`}
      ref={ref}
    >
      <Canvas
        camera={{ fov: 40, position: [0, 0, 4.35] }}
        className="sonic-stage-3d"
        dpr={getSceneDpr(quality)}
        frameloop={getSceneFrameLoop(isActive)}
        gl={{
          ...SCENE_GL,
          antialias: shouldAntialias(quality),
        }}
      >
        <CosmicCamera isPlaying={isPlaying} />
        <Suspense fallback={null}>
          <SonicCoreScene
            accentColor={getLinkAccentColor(activeLinkId)}
            hovered={false}
            isPlaying={isPlaying}
            pointer={[pointer.x, pointer.y]}
            quality={quality}
          />
        </Suspense>
      </Canvas>

      <div className="cosmic-stage-caption">
        <span>Resonance field</span>
        <span>{isPlaying ? 'signal live' : 'ambient drift'}</span>
      </div>
    </div>
  );
}
