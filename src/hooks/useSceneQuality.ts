import { useEffect, useState } from 'react';
import { getGpuTier } from '../lib/webgl';

export type SceneQuality = 'off' | 'low' | 'high';

export type SceneQualityState = {
  readonly quality: SceneQuality;
  readonly particleCount: number;
  readonly projectStage: boolean;
  readonly audioStage: boolean;
};

const MOBILE_QUERY = '(max-width: 680px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const AUDIO_STAGE_QUERY = '(min-width: 681px)';
const PROJECT_STAGE_QUERY = '(min-width: 681px)';

function matchesMediaQuery(query: string): boolean {
  if (typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia(query).matches;
}

function resolveSceneQuality(): SceneQualityState {
  if (typeof window === 'undefined') {
    return { quality: 'off', particleCount: 0, projectStage: false, audioStage: false };
  }

  if (import.meta.env.MODE === 'test') {
    return { quality: 'off', particleCount: 0, projectStage: false, audioStage: false };
  }

  if (matchesMediaQuery(REDUCED_MOTION_QUERY)) {
    return { quality: 'off', particleCount: 0, projectStage: false, audioStage: false };
  }

  if (matchesMediaQuery(MOBILE_QUERY)) {
    return { quality: 'off', particleCount: 0, projectStage: false, audioStage: false };
  }

  const gpuTier = getGpuTier();

  if (gpuTier === 0) {
    return { quality: 'off', particleCount: 0, projectStage: false, audioStage: false };
  }

  const projectStage = matchesMediaQuery(PROJECT_STAGE_QUERY);
  const audioStage = matchesMediaQuery(AUDIO_STAGE_QUERY);

  if (gpuTier === 1) {
    return { quality: 'low', particleCount: 88, projectStage, audioStage };
  }

  return { quality: 'high', particleCount: 168, projectStage, audioStage };
}

export function useSceneQuality(): SceneQualityState {
  const [state, setState] = useState<SceneQualityState>(() => resolveSceneQuality());

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return;
    }

    const mobileQuery = window.matchMedia(MOBILE_QUERY);
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    const sync = () => setState(resolveSceneQuality());

    mobileQuery.addEventListener('change', sync);
    reducedMotionQuery.addEventListener('change', sync);
    window.addEventListener('resize', sync);

    sync();

    return () => {
      mobileQuery.removeEventListener('change', sync);
      reducedMotionQuery.removeEventListener('change', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);

  return state;
}
