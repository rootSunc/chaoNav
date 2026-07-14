import { useTexture } from '@react-three/drei';
import { siteContent } from '../data/siteContent';

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
