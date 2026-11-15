import { type Page } from "@playwright/test";

export type VisualTheme = "dark" | "light";
export type MotionPreference = "reduce" | "no-preference";

type PreparePageOptions = {
  readonly theme?: VisualTheme;
  readonly motion?: MotionPreference;
  readonly lang?: "en" | "zh";
};

/** Pin everything that changes between runs: theme, language, clock, network. */
export async function preparePage(
  page: Page,
  { theme = "light", motion = "reduce", lang = "en" }: PreparePageOptions = {},
) {
  await page.addInitScript(
    ([selectedTheme, selectedLang]) => {
      if (!window.localStorage.getItem("chaonav-theme")) {
        window.localStorage.setItem("chaonav-theme", selectedTheme);
      }
      if (!window.localStorage.getItem("chaonav-lang")) {
        window.localStorage.setItem("chaonav-lang", selectedLang);
      }
    },
    [theme, lang] as const,
  );

  // Live sources are third parties: tests see them as unreachable, so the
  // page shows its dated snapshots and "unavailable" labels.
  await page.route(/api\.github\.com|open-meteo\.com/, (route) => route.abort());

  await page.clock.setFixedTime(new Date("2026-09-28T12:00:00Z"));
  await page.emulateMedia({ reducedMotion: motion, colorScheme: theme });
}

export async function waitForStablePage(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.locator("html.ready").waitFor();
  await page.waitForTimeout(300);
}
