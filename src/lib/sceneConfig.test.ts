import { describe, expect, it } from 'vitest';
import { getSceneDpr, getSceneFrameLoop, shouldAntialias } from './sceneConfig';

describe('sceneConfig', () => {
  it('caps dpr for low quality', () => {
    expect(getSceneDpr('low')).toBeLessThanOrEqual(1);
  });

  it('switches frame loop based on activity', () => {
    expect(getSceneFrameLoop(true)).toBe('always');
    expect(getSceneFrameLoop(false)).toBe('never');
  });

  it('enables antialiasing only on high quality', () => {
    expect(shouldAntialias('high')).toBe(true);
    expect(shouldAntialias('low')).toBe(false);
  });
});
