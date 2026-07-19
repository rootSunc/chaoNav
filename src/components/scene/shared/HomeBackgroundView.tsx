import { PerspectiveCamera, View } from '@react-three/drei';
import { Suspense } from 'react';
import { useGatherPulse } from '../../../hooks/useGatherPulse';
import { usePointerParallax } from '../../../hooks/usePointerParallax';
import type { SceneQuality } from '../../../hooks/useSceneQuality';
import { AmbientParticles } from '../AmbientParticles';

export type HomeBackgroundViewProps = {
  readonly activeLinkId: string;
  readonly introPhase?: number;
  readonly isPlaying: boolean;
  readonly particleCount: number;
  readonly quality: Exclude<SceneQuality, 'off'>;
};

export function HomeBackgroundView({
  activeLinkId,
  introPhase = 0,
  isPlaying,
  particleCount,
}: HomeBackgroundViewProps) {
  const pointer = usePointerParallax(true);
  const gather = useGatherPulse(activeLinkId);

  return (
    <View className="scene-canvas" index={1}>
      <PerspectiveCamera makeDefault fov={44} position={[0, 0, 6.2]} />
      <AmbientParticles
        count={particleCount}
        gather={gather}
        introPhase={introPhase}
        isPlaying={isPlaying}
        pointer={pointer}
      />
    </View>
  );
}

export type HomeBackgroundViewBoundaryProps = HomeBackgroundViewProps;

export function HomeBackgroundViewBoundary(props: HomeBackgroundViewBoundaryProps) {
  return (
    <Suspense fallback={null}>
      <HomeBackgroundView {...props} />
    </Suspense>
  );
}
