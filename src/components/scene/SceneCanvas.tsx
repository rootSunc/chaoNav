import { AmbientParticles } from './AmbientParticles';
import { EmbeddedSceneCanvas } from './EmbeddedSceneCanvas';
import { useGatherPulse } from '../../hooks/useGatherPulse';
import { useCanvasLifecycle } from '../../hooks/useCanvasLifecycle';
import { usePointerParallax } from '../../hooks/usePointerParallax';
import type { SceneQuality } from '../../hooks/useSceneQuality';

export type SceneCanvasProps = {
  readonly activeLinkId: string;
  readonly isPlaying: boolean;
  readonly particleCount: number;
  readonly quality: Exclude<SceneQuality, 'off'>;
};

export function SceneCanvas({
  activeLinkId,
  isPlaying,
  particleCount,
  quality,
}: SceneCanvasProps) {
  const pointer = usePointerParallax(true);
  const gather = useGatherPulse(activeLinkId);
  const { isActive, ref } = useCanvasLifecycle<HTMLDivElement>();

  return (
    <div
      aria-hidden="true"
      className="scene-canvas"
      data-scene-quality={quality}
      ref={ref}
    >
      <EmbeddedSceneCanvas
        camera={{ fov: 44, position: [0, 0, 6.2] }}
        isActive={isActive}
        quality={quality}
      >
        <AmbientParticles
          count={particleCount}
          gather={gather}
          isPlaying={isPlaying}
          pointer={pointer}
        />
      </EmbeddedSceneCanvas>
    </div>
  );
}
