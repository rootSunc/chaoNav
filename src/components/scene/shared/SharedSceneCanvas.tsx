import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';
import type { RefObject } from 'react';
import { useEffect, useState } from 'react';
import {
  getSceneDpr,
  getSceneFrameLoop,
  SCENE_GL,
  shouldAntialias,
  type ActiveSceneQuality,
} from '../../../lib/sceneConfig';

export type SharedSceneCanvasProps = {
  readonly className: string;
  readonly containerRef: RefObject<HTMLElement | null>;
  readonly quality: ActiveSceneQuality;
};

export function SharedSceneCanvas({ className, containerRef, quality }: SharedSceneCanvasProps) {
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    const sync = () => {
      setIsPageVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', sync);
    sync();

    return () => {
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return (
    <Canvas
      className={className}
      dpr={getSceneDpr(quality)}
      eventSource={containerRef as RefObject<HTMLElement>}
      frameloop={getSceneFrameLoop(isPageVisible)}
      gl={{
        ...SCENE_GL,
        antialias: shouldAntialias(quality),
      }}
      style={{
        height: '100vh',
        inset: 0,
        pointerEvents: 'none',
        position: 'fixed',
        width: '100vw',
        zIndex: 0,
      }}
    >
      <View.Port />
    </Canvas>
  );
}
