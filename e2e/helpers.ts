import type { Page } from '@playwright/test';

export type VisualTheme = 'dark' | 'light';

export async function prepareVisualPage(page: Page, theme: VisualTheme = 'dark') {
  await page.addInitScript((selectedTheme) => {
    window.localStorage.setItem('chaonav-theme', selectedTheme);
    document.documentElement.dataset.theme = selectedTheme;
  }, theme);

  await page.emulateMedia({
    reducedMotion: 'reduce',
    colorScheme: theme,
  });
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

export function visualDiffTolerance(): number {
  return process.env.CI ? 0.03 : 0.015;
}
