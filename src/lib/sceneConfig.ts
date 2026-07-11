import type { SceneQuality } from '../hooks/useSceneQuality';

export type ActiveSceneQuality = Exclude<SceneQuality, 'off'>;

export const SCENE_GL = {
  alpha: true,
  antialias: false,
  powerPreference: 'high-performance',
} as const;

export function getSceneDpr(quality: ActiveSceneQuality): number {
  if (typeof window === 'undefined') {
    return 1;
  }

  return Math.min(window.devicePixelRatio, quality === 'low' ? 1 : 1.5);
}

export function getSceneFrameLoop(isActive: boolean): 'always' | 'never' {
  return isActive ? 'always' : 'never';
}

export function shouldAntialias(quality: ActiveSceneQuality): boolean {
  return quality === 'high';
}
