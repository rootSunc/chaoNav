import { expect, test, type Page } from '@playwright/test';

async function prepareVisualPage(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem('chaonav-theme', 'dark');
    document.documentElement.dataset.theme = 'dark';
  });

  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
}

async function waitForStableShell(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    if ('fonts' in document) {
      await document.fonts.ready;
    }
  });
  await page.waitForTimeout(250);
}

test.describe('visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await prepareVisualPage(page);
  });

  test('home command deck desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await waitForStableShell(page);
    await expect(page.getByRole('heading', { level: 1, name: 'Chao' })).toBeVisible();

    await expect(page).toHaveScreenshot('home-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.015,
    });
  });

  test('projects page desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/projects');
    await waitForStableShell(page);
    await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();

    await expect(page).toHaveScreenshot('projects-desktop.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.015,
    });
  });

  test('home command deck mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await waitForStableShell(page);
    await expect(page.getByRole('navigation', { name: /primary destinations/i })).toBeVisible();

    await expect(page).toHaveScreenshot('home-mobile.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
});
