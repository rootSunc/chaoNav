import type { RefObject } from 'react';
import type { SceneQuality } from '../../../hooks/useSceneQuality';
import { SceneErrorBoundary } from '../SceneErrorBoundary';
import { SharedSceneCanvas } from './SharedSceneCanvas';

export type SharedProjectsSceneProps = {
  readonly containerRef: RefObject<HTMLElement | null>;
  readonly quality: Exclude<SceneQuality, 'off'>;
};

export function SharedProjectsScene({ containerRef, quality }: SharedProjectsSceneProps) {
  return (
    <SceneErrorBoundary fallback={null} label="shared-projects-canvas">
      <SharedSceneCanvas
        className="shared-projects-canvas"
        containerRef={containerRef}
        quality={quality}
      />
    </SceneErrorBoundary>
  );
}
