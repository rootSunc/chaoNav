import { describe, expect, it } from 'vitest';
import { getGpuTier, hasWebGLSupport } from '../lib/webgl';

describe('webgl helpers', () => {
  it('reports no support in test mode without throwing', () => {
    expect(hasWebGLSupport()).toBe(false);
    expect(getGpuTier()).toBe(0);
  });
});
