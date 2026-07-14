import { PerspectiveCamera, View } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';
import type { SceneQuality } from '../../../hooks/useSceneQuality';
import type { NavigationId } from '../../../data/siteContent';
import { TurntableScene } from '../turntable/TurntableScene';
import { getLinkAccentColor } from '../turntable/linkColors';

export type VinylStageViewProps = {
  readonly activeLinkId: NavigationId;
  readonly activeLinkLabel: string;
  readonly isPlaying: boolean;
  readonly onTogglePlaying: () => void;
  readonly quality: Exclude<SceneQuality, 'off'>;
};

function TurntableCamera({ isPlaying }: { readonly isPlaying: boolean }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const targetZ = useRef(2.62);

  useFrame((_, delta) => {
    if (!cameraRef.current) {
      return;
    }

    targetZ.current = isPlaying ? 2.48 : 2.62;
    cameraRef.current.position.z = THREE.MathUtils.lerp(
      cameraRef.current.position.z,
      targetZ.current,
      1 - Math.exp(-3.8 * delta),
    );
  });

  return (
    <PerspectiveCamera
      makeDefault
      fov={32}
      position={[0, 0.78, 2.62]}
      ref={cameraRef}
    />
  );
}

export function VinylStageView({
  activeLinkId,
  activeLinkLabel,
  isPlaying,
  onTogglePlaying,
  quality,
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
        <TurntableCamera isPlaying={isPlaying} />
        <Suspense fallback={null}>
          <TurntableScene
            accentColor={getLinkAccentColor(activeLinkId)}
            activeLinkLabel={activeLinkLabel}
            hoverTilt={hoverTilt}
            isPlaying={isPlaying}
            quality={quality}
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
