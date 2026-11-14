import { expect, test } from "@playwright/test";
import { preparePage, waitForStableShell } from "./helpers";

test.beforeEach(async ({ page }) => {
  await preparePage(page, { motion: "reduce" });
});

test("thumb lens bar stays reachable and mobile controls meet 44px touch targets", async ({
  page,
}) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary destinations" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const box = await nav.boundingBox();
  expect(box!.y + box!.height).toBeCloseTo(page.viewportSize()!.height, 0);

  for (const item of await nav.locator("a, button").all()) {
    const target = await item.boundingBox();
    expect(target!.height).toBeGreaterThanOrEqual(44);
    expect(target!.width).toBeGreaterThanOrEqual(44);
  }

  await nav.getByRole("link", { name: "Systems", exact: true }).tap();
  await expect(
    page.getByRole("heading", { level: 1, name: "Systems" }),
  ).toBeVisible();

  await nav.getByRole("link", { name: "Cadence", exact: true }).tap();
  await page.getByRole("button", { name: /Calmer study tools/ }).tap();
  await expect(
    page.getByRole("link", { name: "Ask for the longer essay" }),
  ).toBeVisible();

  await page.goBack();
  await expect(
    page.getByRole("heading", { level: 1, name: "Systems" }),
  ).toBeVisible();
});

test("contact sheet traps focus, copies email, downloads vCard, and restores focus", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Contact Chao" });
  await trigger.tap();

  const sheet = page.getByRole("dialog");
  await expect(sheet).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );

  await sheet.getByRole("button", { name: "Copy email", exact: true }).tap();
  await expect(sheet.getByRole("status")).toHaveText("Email copied.");

  const downloadPromise = page.waitForEvent("download");
  await sheet.getByRole("link", { name: "Save contact" }).tap();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("Chao-Sun.vcf");

  const response = await page.request.get("/chao.vcf");
  expect(await response.text()).toContain(
    "EMAIL;TYPE=INTERNET:chao.sun.me@gmail.com",
  );

  await page.keyboard.press("Tab");
  expect(
    await sheet.evaluate((element) => element.contains(document.activeElement)),
  ).toBe(true);

  await page.keyboard.press("Escape");
  await expect(sheet).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");

  await page.getByRole("button", { name: "Leave a note" }).tap();
  await expect(sheet).toBeVisible();
  await page.mouse.click(10, 40);
  await expect(sheet).not.toBeVisible();
});

test("mobile micro-specimens and interface plates work cleanly without horizontal overflow", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "NordPool FI" }).tap();
  await expect(page.getByText("3.18 c/kWh")).toBeVisible();

  const firstPlate = page
    .getByRole("button", { name: "Interface plate" })
    .first();
  await firstPlate.tap();
  await expect(
    page.getByAltText(
      "CNEquity and EquityLab quant research workbench screenshot",
    ),
  ).toBeVisible();

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("music remains controllable on Systems via mini-player", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Play classical music" }).tap();
  await expect
    .poll(() =>
      page
        .locator("audio")
        .evaluate((element: HTMLAudioElement) => element.currentTime),
    )
    .toBeGreaterThan(0);

  await page.getByRole("link", { name: "Systems", exact: true }).tap();
  const mini = page.getByRole("complementary", { name: "Playing music" });
  await expect(mini).toBeVisible();

  await mini.getByRole("button", { name: "Next track" }).tap();
  await expect(mini).toContainText("S. Rachmaninoff");

  await mini.getByRole("button", { name: "Pause classical music" }).tap();
  await expect(mini).not.toBeVisible();
  await expect
    .poll(() =>
      page
        .locator("audio")
        .evaluate((element: HTMLAudioElement) => element.paused),
    )
    .toBe(true);
});

test("lens changes restore scroll position and contact sheet dismisses by dragging", async ({
  page,
}) => {
  await page.goto("/");
  await waitForStableShell(page);
  await page.evaluate(() => window.scrollTo(0, 850));
  const position = await page.evaluate(() => window.scrollY);

  await page.getByRole("link", { name: "Systems", exact: true }).tap();
  await page.getByRole("link", { name: "Field", exact: true }).tap();
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeCloseTo(position, 0);

  await page.getByRole("button", { name: "Contact Chao" }).tap();
  const handle = (await page
    .getByRole("button", { name: "Dismiss contact panel" })
    .boundingBox())!;
  await page.mouse.move(
    handle.x + handle.width / 2,
    handle.y + handle.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    handle.x + handle.width / 2,
    handle.y + handle.height / 2 + 100,
    { steps: 8 },
  );
  await page.mouse.up();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});
