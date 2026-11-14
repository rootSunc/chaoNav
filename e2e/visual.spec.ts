import { expect, test } from "@playwright/test";
import {
  mobileVisualDiffTolerance,
  prepareVisualPage,
  visualDiffTolerance,
  waitForStableShell,
} from "./helpers";

test.describe("visual regression", () => {
  test("workbench field desktop dark", async ({ page }) => {
    await prepareVisualPage(page, "dark");
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto("/");
    await waitForStableShell(page);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Systems built for permanence/i,
      }),
    ).toBeVisible();

    await expect(page).toHaveScreenshot("home-desktop-dark.png", {
      fullPage: true,
      maxDiffPixelRatio: visualDiffTolerance(),
    });
  });

  test("workbench field desktop light", async ({ page }) => {
    await prepareVisualPage(page, "light");
    await page.setViewportSize({ width: 1280, height: 860 });
    await page.goto("/");
    await waitForStableShell(page);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Systems built for permanence/i,
      }),
    ).toBeVisible();

    await expect(page).toHaveScreenshot("home-desktop-light.png", {
      fullPage: true,
      maxDiffPixelRatio: visualDiffTolerance(),
    });
  });

  test("systems ledger desktop dark", async ({ page }) => {
    await prepareVisualPage(page, "dark");
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/projects");
    await waitForStableShell(page);
    await expect(
      page.getByRole("heading", { level: 1, name: "Systems" }),
    ).toBeVisible();

    await expect(page).toHaveScreenshot("projects-desktop-dark.png", {
      fullPage: true,
      maxDiffPixelRatio: visualDiffTolerance(),
    });
  });

  test("systems ledger desktop light", async ({ page }) => {
    await prepareVisualPage(page, "light");
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/projects");
    await waitForStableShell(page);
    await expect(
      page.getByRole("heading", { level: 1, name: "Systems" }),
    ).toBeVisible();

    await expect(page).toHaveScreenshot("projects-desktop-light.png", {
      fullPage: true,
      maxDiffPixelRatio: visualDiffTolerance(),
    });
  });

  test("workbench field mobile dark", async ({ page }) => {
    await prepareVisualPage(page, "dark");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await waitForStableShell(page);
    await expect(
      page.getByRole("navigation", { name: /primary destinations/i }),
    ).toBeVisible();

    await expect(page).toHaveScreenshot("home-mobile-dark.png", {
      fullPage: true,
      maxDiffPixelRatio: mobileVisualDiffTolerance(),
    });
  });

  test("workbench field mobile light", async ({ page }) => {
    await prepareVisualPage(page, "light");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await waitForStableShell(page);
    await expect(
      page.getByRole("navigation", { name: /primary destinations/i }),
    ).toBeVisible();

    await expect(page).toHaveScreenshot("home-mobile-light.png", {
      fullPage: true,
      maxDiffPixelRatio: mobileVisualDiffTolerance(),
    });
  });

  test("systems ledger mobile dark", async ({ page }) => {
    await prepareVisualPage(page, "dark");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/projects");
    await waitForStableShell(page);
    await expect(
      page.getByRole("heading", { level: 1, name: "Systems" }),
    ).toBeVisible();

    await expect(page).toHaveScreenshot("projects-mobile-dark.png", {
      fullPage: true,
      maxDiffPixelRatio: mobileVisualDiffTolerance(),
    });
  });

  test("systems ledger mobile light", async ({ page }) => {
    await prepareVisualPage(page, "light");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/projects");
    await waitForStableShell(page);
    await expect(
      page.getByRole("heading", { level: 1, name: "Systems" }),
    ).toBeVisible();

    await expect(page).toHaveScreenshot("projects-mobile-light.png", {
      fullPage: true,
      maxDiffPixelRatio: mobileVisualDiffTolerance(),
    });
  });
});
