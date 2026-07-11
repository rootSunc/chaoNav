import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useSceneQuality } from '../hooks/useSceneQuality';

describe('useSceneQuality', () => {
  it('disables the scene in test mode', () => {
    const { result } = renderHook(() => useSceneQuality());

    expect(result.current).toEqual({
      quality: 'off',
      particleCount: 0,
      vinylStage: false,
    });
  });
});
