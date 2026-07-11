import { expect, test } from '@playwright/test';
import {
  expectSceneQuality,
  prepareWebGLPage,
  waitForStableShell,
  waitForWebGLCanvas,
} from './helpers';

test.describe('webgl scenes', () => {
  test('home desktop mounts shared canvas with vinyl stage', async ({ page }) => {
    await prepareWebGLPage(page, 'dark');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await waitForStableShell(page);
    await expectSceneQuality(page, 'active');

    await waitForWebGLCanvas(page, '.shared-home-canvas');
    await expect(page.locator('.vinyl-stage-3d')).toBeVisible();
    await expect(page.locator('.scene-canvas')).toBeVisible();
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
    await expect(page.locator('.vinyl-stage-3d')).toHaveCount(0);
  });

  test('home tablet shows gramophone fallback without vinyl stage', async ({ page }) => {
    await prepareWebGLPage(page, 'dark');
    await page.setViewportSize({ width: 900, height: 900 });
    await page.goto('/');
    await waitForStableShell(page);
    await expectSceneQuality(page, 'active');

    await expect(page.locator('.gramophone-frame')).toBeVisible();
    await expect(page.locator('.gramophone-image')).toBeVisible();
    await expect(page.locator('.vinyl-stage-3d')).toHaveCount(0);
    await expect(page.locator('.shared-home-canvas')).toHaveCount(0);
    await expect(page.locator('.scene-canvas canvas')).toBeVisible();
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
