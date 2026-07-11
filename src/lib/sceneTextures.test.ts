import { describe, expect, it, vi } from 'vitest';
import { getProjectScreenshotUrls } from './sceneTextures';

vi.mock('@react-three/drei', () => ({
  useTexture: {
    preload: vi.fn(),
  },
}));

describe('sceneTextures', () => {
  it('collects every project screenshot url for preloading', () => {
    const urls = getProjectScreenshotUrls();

    expect(urls).toHaveLength(8);
    expect(urls).toEqual(
      expect.arrayContaining([
        '/images/projects/sanakirja-web.jpg',
        '/images/projects/sanakirja-mobile.jpg',
        '/images/projects/luxestate-web.jpg',
        '/images/projects/luxestate-mobile.jpg',
      ]),
    );
  });
});
