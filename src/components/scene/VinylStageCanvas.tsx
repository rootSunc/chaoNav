import { Suspense, useState } from 'react';
import type { NavigationId } from '../../data/siteContent';
import { useCanvasLifecycle } from '../../hooks/useCanvasLifecycle';
import type { SceneQuality } from '../../hooks/useSceneQuality';
import { EmbeddedSceneCanvas } from './EmbeddedSceneCanvas';
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
  const { isActive, ref } = useCanvasLifecycle<HTMLDivElement>();

  return (
    <div
      className="vinyl-stage-3d"
      onPointerLeave={() => setHoverTilt(0)}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;

        setHoverTilt(normalizedX);
      }}
      ref={ref}
    >
      <EmbeddedSceneCanvas
        camera={{ fov: 36, position: [0, 1.55, 3.35] }}
        isActive={isActive}
        quality={quality}
      >
        <Suspense fallback={null}>
          <TurntableScene
            accentColor={getLinkAccentColor(activeLinkId)}
            activeLinkLabel={activeLinkLabel}
            hoverTilt={hoverTilt}
            isPlaying={isPlaying}
          />
        </Suspense>
      </EmbeddedSceneCanvas>

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
