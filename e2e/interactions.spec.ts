import { expect, test } from "@playwright/test";
import { preparePage } from "./helpers";

test.beforeEach(async ({ page }) => {
  await preparePage(page, { motion: "no-preference" });
});

test("lens navigation, history, direct routes, and field note disclosure", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  await page.getByRole("link", { name: "Systems", exact: true }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Systems" }),
  ).toBeFocused();
  await expect(page.locator(".system-specimen")).toHaveCount(5);

  await page.reload();
  await expect(
    page.getByRole("heading", { level: 1, name: "Systems" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Cadence", exact: true }).click();
  await expect(page).toHaveURL(/\/notes$/);
  const note = page.getByRole("button", { name: /Calmer study tools/ });
  await note.click();
  await expect(note).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("link", { name: "Ask for the longer essay" }),
  ).toBeVisible();

  await page.goBack();
  await expect(
    page.getByRole("heading", { level: 1, name: "Systems" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("interactive micro-specimens, solar scrub, real audio playback, clipboard, and theme", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");

  // Scrub Helsinki solar horizon slider via keyboard
  const solarSlider = page.getByRole("slider", {
    name: "Scrub Helsinki time of day",
  });
  await solarSlider.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(
    page.getByRole("button", { name: "Return to live Helsinki time" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Return to live Helsinki time" })
    .click();

  // Exercise inline micro-specimen (Suomeksi morphology + CNEquity plate toggle)
  await page.getByRole("button", { name: "+ni" }).click();
  await expect(page.getByText(/“in my house”/)).toBeVisible();

  // Exercise classical audio playback & persistence across lenses
  await page.getByRole("button", { name: "Play classical music" }).click();
  await expect
    .poll(() =>
      page
        .locator("audio")
        .evaluate((element: HTMLAudioElement) => element.currentTime),
    )
    .toBeGreaterThan(0);

  await page.getByRole("button", { name: "Next track" }).click();
  await expect(
    page.getByRole("heading", { name: "S. Rachmaninoff" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Systems", exact: true }).click();
  await page.getByRole("button", { name: "Pause classical music" }).click();
  await expect
    .poll(() =>
      page
        .locator("audio")
        .evaluate((element: HTMLAudioElement) => element.paused),
    )
    .toBe(true);

  // Clipboard & persistent polarity toggle
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(page.getByRole("status")).toHaveText("Email address copied.");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "chao.sun.me@gmail.com",
  );

  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await page.evaluate(() => localStorage.getItem("chaonav-theme"))).toBe(
    "light",
  );
});

for (const width of [320, 390, 768, 1280]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/projects", "/notes"]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
  });
}

test("keyboard skip-link entry and reduced-motion preference", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to main content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Systems built for permanence/i,
    }),
  ).toBeFocused();
  expect(
    await page
      .locator(".lens-main")
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
});
