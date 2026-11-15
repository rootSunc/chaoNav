import { expect, test } from "@playwright/test";
import { preparePage, waitForStablePage } from "./helpers";

test.beforeEach(async ({ page }) => {
  await preparePage(page);
});

test("phone layout stacks without horizontal scroll", async ({ page }) => {
  await page.goto("/");
  await waitForStablePage(page);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Email" })).toBeHidden();

  const body = page.locator(".chapter-body").first();
  const [text, specimen] = await Promise.all([
    body.locator(".chapter-text").boundingBox(),
    body.locator(".specimen").boundingBox(),
  ]);
  expect(specimen!.y).toBeGreaterThan(text!.y + text!.height - 1);
});

test("touch works for the theme, language and word picker", async ({ page }) => {
  await page.goto("/");
  await waitForStablePage(page);

  await page.getByRole("button", { name: /^Theme:/ }).tap();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  const picker = page.getByRole("group", { name: "Pick a word" });
  await picker.getByRole("button", { name: "juoksentelisinkohan" }).tap();
  await expect(
    page.getByText("“I wonder if I should run around a bit”"),
  ).toBeVisible();

  const word = page.locator(".morph-word");
  const stage = page.locator(".morph-stage");
  const [wordBox, stageBox] = await Promise.all([
    word.boundingBox(),
    stage.boundingBox(),
  ]);
  expect(wordBox!.width).toBeLessThanOrEqual(stageBox!.width + 1);
});
