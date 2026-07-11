import { useTexture } from '@react-three/drei';
import { siteContent } from '../data/siteContent';

export const GRAMOPHONE_TEXTURE = '/images/gramophone.png';

export function getProjectScreenshotUrls(): readonly string[] {
  return siteContent.projectsPage.projects.flatMap((project) => [
    project.screenshots.web.src,
    project.screenshots.mobile.src,
  ]);
}

export function preloadProjectTextures() {
  for (const url of getProjectScreenshotUrls()) {
    useTexture.preload(url);
  }
}

export function preloadGramophoneTexture() {
  useTexture.preload(GRAMOPHONE_TEXTURE);
}

export function preloadHomeSceneTextures() {
  preloadGramophoneTexture();
}
