import { type Page } from "@playwright/test";

export type VisualTheme = "dark" | "light";
export type MotionPreference = "reduce" | "no-preference";

type PreparePageOptions = {
  readonly theme?: VisualTheme;
  readonly motion?: MotionPreference;
};

export async function preparePage(
  page: Page,
  { theme = "dark", motion = "reduce" }: PreparePageOptions = {},
) {
  await page.addInitScript((selectedTheme) => {
    if (!window.localStorage.getItem("chaonav-theme")) {
      window.localStorage.setItem("chaonav-theme", selectedTheme);
    }
  }, theme);

  await page.clock.setFixedTime(new Date("2026-09-28T12:00:00Z"));

  await page.emulateMedia({
    reducedMotion: motion,
    colorScheme: theme,
  });
}

export async function prepareVisualPage(
  page: Page,
  theme: VisualTheme = "dark",
) {
  await preparePage(page, { theme, motion: "reduce" });
}

export async function waitForStableShell(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.images).map(async (image) => {
        image.loading = "eager";
        await image.decode();
      }),
    );
    if ("fonts" in document) {
      await document.fonts.ready;
    }
  });
  await page.waitForTimeout(250);
}

export function visualDiffTolerance(): number {
  return process.env.CI ? 0.03 : 0.015;
}

export function mobileVisualDiffTolerance(): number {
  return process.env.CI ? 0.035 : 0.02;
}
