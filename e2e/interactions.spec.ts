import { expect, test } from "@playwright/test";
import { preparePage, waitForStablePage } from "./helpers";

test.beforeEach(async ({ page }) => {
  await preparePage(page, { motion: "no-preference" });
});

test("the intro sentence navigates to each chapter", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/");
  await waitForStablePage(page);

  await page
    .getByRole("navigation", { name: "Projects" })
    .getByRole("link", { name: "Suomeksi" })
    .click();
  await expect(page).toHaveURL(/#suomeksi$/);
  await expect(
    page.getByRole("heading", { level: 2, name: "Suomeksi" }),
  ).toBeInViewport();

  expect(errors).toEqual([]);
});

test("giant names fit the page width without overflowing it", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.goto("/");
  await waitForStablePage(page);

  const overflow = await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    return document.documentElement.scrollWidth - window.innerWidth;
  });
  expect(overflow).toBeLessThanOrEqual(0);

  const widths = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>(".fit-name")].map((name) => ({
      room: name.clientWidth,
      text: name.querySelector(".fit-text")!.getBoundingClientRect().width,
    })),
  );
  expect(widths).toHaveLength(5);
  for (const { room, text } of widths) {
    expect(text).toBeLessThanOrEqual(room + 1);
  }
});

test("old /projects and /notes links land on the single page", async ({ page }) => {
  await page.goto("/projects");
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("heading", { level: 2, name: "CNEquity" }),
  ).toBeVisible();

  await page.goto("/notes");
  await expect(page).toHaveURL(/\/$/);
});

test("language, theme, the lake, the word picker and the clipboard", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await waitForStablePage(page);

  // Theme cycles day -> night -> sky.
  await page.getByRole("button", { name: /^Theme: Day/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  // Language switch rewrites the page and survives a reload.
  await page.getByRole("button", { name: "切换到中文" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Moi，我是 Chao。",
  );
  await expect(
    page.getByText("Tell all the truth but tell it slant —"),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans");
  await page.getByRole("button", { name: "Switch to English" }).click();

  // The lake fills to all 86 datasets once it scrolls into view.
  const lake = page.locator(".lake");
  await lake.scrollIntoViewIfNeeded();
  await expect(lake.locator(".lake-cell[data-on]")).toHaveCount(86, {
    timeout: 10_000,
  });
  await expect(lake.locator(".lake-readout")).toHaveText(
    "86 datasets · 78 curated · 8 derived",
  );

  // Picking a Finnish word takes it apart.
  const picker = page.getByRole("group", { name: "Pick a word" });
  await picker.getByRole("button", { name: "kirjastossakin" }).click();
  await expect(page.locator(".morph-word")).toHaveAttribute("data-split", "true");
  await expect(page.getByText("“in the library, too”")).toBeVisible();

  // Without the network, readings say so instead of inventing a value.
  await expect(page.locator(".signals")).toContainText("unavailable, not faked");
  await expect(
    page.getByRole("row", { name: /CNEquity stars/ }),
  ).toContainText("snapshot");

  // Copy the address from the closing.
  await page.getByRole("button", { name: "Copy address" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "chao.sun.me@gmail.com",
  );
});

test("the player starts on open and can be stopped", async ({ page }) => {
  await page.goto("/");
  await waitForStablePage(page);

  const playing = () =>
    page.evaluate(() => !document.querySelector("audio")!.paused);

  // Browsers that block autoplay leave the play control. A click is a gesture.
  if (!(await playing())) {
    await page.getByRole("button", { name: "Play" }).click();
  }

  await expect.poll(playing).toBe(true);
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();

  await page.getByRole("button", { name: "Pause" }).click();
  await expect(page.getByRole("button", { name: "Play" })).toBeVisible();
  await expect.poll(playing).toBe(false);
});
