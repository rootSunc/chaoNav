import { Canvas } from '@react-three/fiber';
import type { ReactNode } from 'react';
import type { CameraProps } from '@react-three/fiber';
import {
  getSceneDpr,
  getSceneFrameLoop,
  SCENE_GL,
  shouldAntialias,
  type ActiveSceneQuality,
} from '../../lib/sceneConfig';

export type EmbeddedSceneCanvasProps = {
  readonly camera: CameraProps;
  readonly children: ReactNode;
  readonly className?: string;
  readonly isActive: boolean;
  readonly quality: ActiveSceneQuality;
};

export function EmbeddedSceneCanvas({
  camera,
  children,
  className,
  isActive,
  quality,
}: EmbeddedSceneCanvasProps) {
  return (
    <Canvas
      camera={camera}
      className={className}
      dpr={getSceneDpr(quality)}
      frameloop={getSceneFrameLoop(isActive)}
      gl={{
        ...SCENE_GL,
        antialias: shouldAntialias(quality),
      }}
    >
      {children}
    </Canvas>
  );
}
