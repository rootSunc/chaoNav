import { Canvas } from '@react-three/fiber';
import { AmbientParticles } from './AmbientParticles';
import { useGatherPulse } from '../../hooks/useGatherPulse';
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
  const devicePixelRatio = typeof window === 'undefined' ? 1 : window.devicePixelRatio;

  return (
    <div aria-hidden="true" className="scene-canvas" data-scene-quality={quality}>
      <Canvas
        camera={{ fov: 44, position: [0, 0, 6.2] }}
        dpr={Math.min(devicePixelRatio, quality === 'low' ? 1 : 1.5)}
        frameloop="always"
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: 'high-performance',
        }}
      >
        <AmbientParticles
          count={particleCount}
          gather={gather}
          isPlaying={isPlaying}
          pointer={pointer}
        />
      </Canvas>
    </div>
  );
}
