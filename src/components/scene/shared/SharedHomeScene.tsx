import type { RefObject } from 'react';
import { useEffect } from 'react';
import type { NavigationId } from '../../../data/siteContent';
import { preloadHomeSceneTextures } from '../../../lib/sceneTextures';
import type { SceneQuality } from '../../../hooks/useSceneQuality';
import { SceneErrorBoundary } from '../SceneErrorBoundary';
import { HomeBackgroundViewBoundary } from './HomeBackgroundView';
import { SharedHomeSceneCanvas } from './SharedHomeSceneCanvas';

export type SharedHomeSceneProps = {
  readonly activeLinkId: NavigationId;
  readonly containerRef: RefObject<HTMLElement | null>;
  readonly isPlaying: boolean;
  readonly particleCount: number;
  readonly quality: Exclude<SceneQuality, 'off'>;
};

export function SharedHomeScene({
  activeLinkId,
  containerRef,
  isPlaying,
  particleCount,
  quality,
}: SharedHomeSceneProps) {
  useEffect(() => {
    preloadHomeSceneTextures();
  }, []);

  return (
    <>
      <SceneErrorBoundary fallback={null} label="shared-home-background">
        <HomeBackgroundViewBoundary
          activeLinkId={activeLinkId}
          isPlaying={isPlaying}
          particleCount={particleCount}
          quality={quality}
        />
      </SceneErrorBoundary>

      <SceneErrorBoundary fallback={null} label="shared-home-canvas">
        <SharedHomeSceneCanvas containerRef={containerRef} quality={quality} />
      </SceneErrorBoundary>
    </>
  );
}
