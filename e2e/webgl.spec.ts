import { expect, test } from '@playwright/test';
import {
  expectSceneQuality,
  prepareWebGLPage,
  waitForStableShell,
  waitForWebGLCanvas,
} from './helpers';

test.describe('webgl scenes', () => {
  test('home desktop mounts shared canvas with interactive sonic stage', async ({ page }) => {
    await prepareWebGLPage(page, 'dark');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await waitForStableShell(page);
    await expectSceneQuality(page, 'active');

    await waitForWebGLCanvas(page, '.shared-home-canvas');
    await expect(page.locator('.sonic-stage-3d')).toBeVisible();
    await expect(page.getByText('Resonance field')).toBeVisible();
    await expect(page.locator('.scene-canvas')).toBeVisible();

    const playControl = page.locator('.player-dock .transport-button-play');
    await expect(playControl).toHaveAccessibleName(/play classical music/i);
    await playControl.click();
    await expect(playControl).toHaveAttribute('aria-pressed', 'true');
    await expect(playControl).toHaveAccessibleName(/pause classical music/i);
    await expect(page.getByText('signal live')).toBeVisible();
  });

  test('projects desktop mounts shared canvas with device stage', async ({ page }) => {
    await prepareWebGLPage(page, 'dark');
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/projects');
    await waitForStableShell(page);
    await expectSceneQuality(page, 'active');

    await waitForWebGLCanvas(page, '.shared-projects-canvas');
    await page.locator('.project-device-stage').first().scrollIntoViewIfNeeded();
    await expect(page.locator('.project-device-view').first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test('home mobile keeps scenes off and hides shared canvas hosts', async ({ page }) => {
    await prepareWebGLPage(page, 'dark');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await waitForStableShell(page);
    await expectSceneQuality(page, 'off');

    await expect(page.locator('.shared-home-canvas')).toHaveCount(0);
    await expect(page.locator('.sonic-stage-3d')).toHaveCount(0);
  });

  test('home tablet mounts sonic stage in shared canvas', async ({ page }) => {
    await prepareWebGLPage(page, 'dark');
    await page.setViewportSize({ width: 900, height: 900 });
    await page.goto('/');
    await waitForStableShell(page);
    await expectSceneQuality(page, 'active');

    await waitForWebGLCanvas(page, '.shared-home-canvas');
    await expect(page.locator('.sonic-stage-3d')).toBeVisible();
    await expect(page.locator('.scene-canvas')).toBeVisible();
  });

  test('projects mobile keeps scenes off', async ({ page }) => {
    await prepareWebGLPage(page, 'dark');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/projects');
    await waitForStableShell(page);
    await expectSceneQuality(page, 'off');

    await expect(page.locator('.shared-projects-canvas')).toHaveCount(0);
    await expect(page.locator('.project-device-stage canvas')).toHaveCount(0);
  });
});
