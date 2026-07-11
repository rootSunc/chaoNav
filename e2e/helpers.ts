import { expect, type Page } from '@playwright/test';

export type VisualTheme = 'dark' | 'light';
export type MotionPreference = 'reduce' | 'no-preference';

type PreparePageOptions = {
  readonly theme?: VisualTheme;
  readonly motion?: MotionPreference;
};

export async function preparePage(
  page: Page,
  { theme = 'dark', motion = 'reduce' }: PreparePageOptions = {},
) {
  await page.addInitScript((selectedTheme) => {
    window.localStorage.setItem('chaonav-theme', selectedTheme);
    document.documentElement.dataset.theme = selectedTheme;
  }, theme);

  await page.emulateMedia({
    reducedMotion: motion,
    colorScheme: theme,
  });
}

export async function prepareVisualPage(page: Page, theme: VisualTheme = 'dark') {
  await preparePage(page, { theme, motion: 'reduce' });
}

export async function prepareWebGLPage(page: Page, theme: VisualTheme = 'dark') {
  await preparePage(page, { theme, motion: 'no-preference' });
}

export async function waitForStableShell(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    if ('fonts' in document) {
      await document.fonts.ready;
    }
  });
  await page.waitForTimeout(250);
}

export async function waitForWebGLCanvas(page: Page, hostSelector: string) {
  const canvas = page.locator(`${hostSelector} canvas`).first();
  await expect(canvas).toBeVisible({ timeout: 20_000 });
  await page.waitForFunction(
    (selector) => {
      const host = document.querySelector(selector);
      const element = host?.querySelector('canvas');

      return (
        element instanceof HTMLCanvasElement &&
        element.width > 0 &&
        element.height > 0
      );
    },
    hostSelector,
    { timeout: 20_000 },
  );
}

export async function expectSceneQuality(page: Page, mode: 'off' | 'active') {
  if (mode === 'off') {
    await expect(page.locator('body')).not.toHaveAttribute('data-scene', /.+/);
    return;
  }

  await expect(page.locator('body')).toHaveAttribute('data-scene', /^(low|high)$/);
}

export function visualDiffTolerance(): number {
  return process.env.CI ? 0.03 : 0.015;
}

export function mobileVisualDiffTolerance(): number {
  return process.env.CI ? 0.035 : 0.02;
}
