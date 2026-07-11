import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import type { NavigationId } from '../../data/siteContent';
import type { SceneQuality } from '../../hooks/useSceneQuality';
import { TurntableScene } from './turntable/TurntableScene';
import { getLinkAccentColor } from './turntable/linkColors';

export type VinylStageCanvasProps = {
  readonly activeLinkId: NavigationId;
  readonly activeLinkLabel: string;
  readonly isPlaying: boolean;
  readonly onTogglePlaying: () => void;
  readonly quality: Exclude<SceneQuality, 'off'>;
};

export function VinylStageCanvas({
  activeLinkId,
  activeLinkLabel,
  isPlaying,
  onTogglePlaying,
  quality,
}: VinylStageCanvasProps) {
  const [hoverTilt, setHoverTilt] = useState(0);
  const devicePixelRatio = typeof window === 'undefined' ? 1 : window.devicePixelRatio;

  return (
    <div
      className="vinyl-stage-3d"
      onPointerLeave={() => setHoverTilt(0)}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;

        setHoverTilt(normalizedX);
      }}
    >
      <Canvas
        camera={{ fov: 36, position: [0, 1.55, 3.35] }}
        dpr={Math.min(devicePixelRatio, quality === 'low' ? 1 : 1.5)}
        gl={{
          alpha: true,
          antialias: quality === 'high',
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <TurntableScene
            accentColor={getLinkAccentColor(activeLinkId)}
            activeLinkLabel={activeLinkLabel}
            hoverTilt={hoverTilt}
            isPlaying={isPlaying}
          />
        </Suspense>
      </Canvas>

      <button
        aria-label={isPlaying ? 'Pause classical music' : 'Play classical music'}
        aria-pressed={isPlaying}
        className="vinyl-stage-hit"
        data-music-control="true"
        onClick={onTogglePlaying}
        type="button"
      />
    </div>
  );
}
