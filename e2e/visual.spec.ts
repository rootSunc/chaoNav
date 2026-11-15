import { expect, test } from "@playwright/test";
import { preparePage, waitForStablePage, type VisualTheme } from "./helpers";

const TOLERANCE = process.env.CI ? 0.04 : 0.02;

// The first screen is the sentence and the seal. The next chapter starts
// below the fold.
for (const theme of ["light", "dark"] as const satisfies readonly VisualTheme[]) {
  test(`first screen, desktop, ${theme}`, async ({ page }) => {
    await preparePage(page, { theme });
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto("/");
    await waitForStablePage(page);

    await expect(page).toHaveScreenshot(`home-desktop-${theme}.png`, {
      maxDiffPixelRatio: TOLERANCE,
    });
  });

  test(`first screen, phone, ${theme}`, async ({ page }) => {
    await preparePage(page, { theme });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await waitForStablePage(page);

    await expect(page).toHaveScreenshot(`home-mobile-${theme}.png`, {
      maxDiffPixelRatio: TOLERANCE,
    });
  });
}
