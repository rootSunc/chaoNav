import { PerspectiveCamera, View } from '@react-three/drei';
import type { NavigationId } from '../../../data/siteContent';
import { Suspense, useState } from 'react';
import { TurntableScene } from '../turntable/TurntableScene';
import { getLinkAccentColor } from '../turntable/linkColors';

export type VinylStageViewProps = {
  readonly activeLinkId: NavigationId;
  readonly activeLinkLabel: string;
  readonly isPlaying: boolean;
  readonly onTogglePlaying: () => void;
};

export function VinylStageView({
  activeLinkId,
  activeLinkLabel,
  isPlaying,
  onTogglePlaying,
}: VinylStageViewProps) {
  const [hoverTilt, setHoverTilt] = useState(0);

  return (
    <div
      className="vinyl-stage-shell"
      onPointerLeave={() => setHoverTilt(0)}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;

        setHoverTilt(normalizedX);
      }}
    >
      <View className="vinyl-stage-3d" index={2}>
        <PerspectiveCamera makeDefault fov={34} position={[0, 0.92, 2.75]} />
        <Suspense fallback={null}>
          <TurntableScene
            accentColor={getLinkAccentColor(activeLinkId)}
            activeLinkLabel={activeLinkLabel}
            hoverTilt={hoverTilt}
            isPlaying={isPlaying}
          />
        </Suspense>
      </View>

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
