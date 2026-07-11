import { expect, test } from '@playwright/test';
import {
  mobileVisualDiffTolerance,
  prepareVisualPage,
  visualDiffTolerance,
  waitForStableShell,
} from './helpers';

test.describe('visual regression', () => {
  test('home command deck desktop dark', async ({ page }) => {
    await prepareVisualPage(page, 'dark');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await waitForStableShell(page);
    await expect(page.getByRole('heading', { level: 1, name: 'Chao' })).toBeVisible();

    await expect(page).toHaveScreenshot('home-desktop-dark.png', {
      fullPage: true,
      maxDiffPixelRatio: visualDiffTolerance(),
    });
  });

  test('home command deck desktop light', async ({ page }) => {
    await prepareVisualPage(page, 'light');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await waitForStableShell(page);
    await expect(page.getByRole('heading', { level: 1, name: 'Chao' })).toBeVisible();

    await expect(page).toHaveScreenshot('home-desktop-light.png', {
      fullPage: true,
      maxDiffPixelRatio: visualDiffTolerance(),
    });
  });

  test('projects page desktop dark', async ({ page }) => {
    await prepareVisualPage(page, 'dark');
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/projects');
    await waitForStableShell(page);
    await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();

    await expect(page).toHaveScreenshot('projects-desktop-dark.png', {
      fullPage: true,
      maxDiffPixelRatio: visualDiffTolerance(),
    });
  });

  test('projects page desktop light', async ({ page }) => {
    await prepareVisualPage(page, 'light');
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/projects');
    await waitForStableShell(page);
    await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();

    await expect(page).toHaveScreenshot('projects-desktop-light.png', {
      fullPage: true,
      maxDiffPixelRatio: visualDiffTolerance(),
    });
  });

  test('home command deck mobile dark', async ({ page }) => {
    await prepareVisualPage(page, 'dark');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await waitForStableShell(page);
    await expect(page.getByRole('navigation', { name: /primary destinations/i })).toBeVisible();

    await expect(page).toHaveScreenshot('home-mobile-dark.png', {
      fullPage: true,
      maxDiffPixelRatio: mobileVisualDiffTolerance(),
    });
  });

  test('home command deck mobile light', async ({ page }) => {
    await prepareVisualPage(page, 'light');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await waitForStableShell(page);
    await expect(page.getByRole('navigation', { name: /primary destinations/i })).toBeVisible();

    await expect(page).toHaveScreenshot('home-mobile-light.png', {
      fullPage: true,
      maxDiffPixelRatio: mobileVisualDiffTolerance(),
    });
  });

  test('projects page mobile dark', async ({ page }) => {
    await prepareVisualPage(page, 'dark');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/projects');
    await waitForStableShell(page);
    await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();

    await expect(page).toHaveScreenshot('projects-mobile-dark.png', {
      fullPage: true,
      maxDiffPixelRatio: mobileVisualDiffTolerance(),
    });
  });

  test('projects page mobile light', async ({ page }) => {
    await prepareVisualPage(page, 'light');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/projects');
    await waitForStableShell(page);
    await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible();

    await expect(page).toHaveScreenshot('projects-mobile-light.png', {
      fullPage: true,
      maxDiffPixelRatio: mobileVisualDiffTolerance(),
    });
  });
});
