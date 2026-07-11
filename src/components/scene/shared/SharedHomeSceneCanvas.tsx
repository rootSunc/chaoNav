import type { RefObject } from 'react';
import type { ActiveSceneQuality } from '../../../lib/sceneConfig';
import { SharedSceneCanvas } from './SharedSceneCanvas';

export type SharedHomeSceneCanvasProps = {
  readonly containerRef: RefObject<HTMLElement | null>;
  readonly quality: ActiveSceneQuality;
};

export function SharedHomeSceneCanvas(props: SharedHomeSceneCanvasProps) {
  return <SharedSceneCanvas className="shared-home-canvas" {...props} />;
}
