import { expect, test } from "@playwright/test";
import { preparePage } from "./helpers";

test.beforeEach(async ({ page }) => {
  await preparePage(page, { motion: "reduce" });
});

test("thumb navigation stays reachable and mobile controls have touch targets", async ({
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
  await nav.getByRole("link", { name: "Work", exact: true }).tap();
  await expect(page.getByRole("heading", { name: "Projects." })).toBeVisible();
  await nav.getByRole("link", { name: "Notes", exact: true }).tap();
  await page.getByRole("button", { name: /Calmer study tools/ }).tap();
  await expect(
    page.getByRole("link", { name: "Ask for the longer essay" }),
  ).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Projects." })).toBeVisible();
});

test("contact sheet traps focus, copies, downloads vCard, and restores focus", async ({
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
  await page.getByRole("link", { name: "Say hello" }).tap();
  await expect(sheet).toBeVisible();
  await page.mouse.click(10, 40);
  await expect(sheet).not.toBeVisible();
});

test("native touch swipe and explicit buttons browse all five projects", async ({
  page,
  context,
}) => {
  await page.goto("/");
  const carousel = page.getByRole("region", { name: "Selected work carousel" });
  const track = page.getByLabel("Swipe through five projects");
  await track.scrollIntoViewIfNeeded();
  const box = (await track.boundingBox())!;
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: box.x + box.width - 25, y: box.y + 100 }],
  });
  for (let i = 1; i <= 8; i++) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        {
          x: box.x + box.width - 25 - (i * (box.width - 70)) / 8,
          y: box.y + 100,
        },
      ],
    });
  }
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect
    .poll(() => track.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(100);
  await expect(carousel.locator("[aria-live]")).not.toHaveText("01 / 05");
  for (let step = 0; step < 5; step++) {
    if (
      await carousel.getByRole("button", { name: "Next project" }).isDisabled()
    )
      break;
    await carousel.getByRole("button", { name: "Next project" }).tap();
    await page.waitForTimeout(100);
  }
  await expect(carousel.locator("[aria-live]")).toHaveText("05 / 05");
  await expect(
    carousel.getByRole("link", { name: /Ashare —/ }),
  ).toBeInViewport();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("music remains controllable after changing tabs", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Play classical music" }).tap();
  await expect
    .poll(() =>
      page
        .locator("audio")
        .evaluate((element: HTMLAudioElement) => element.currentTime),
    )
    .toBeGreaterThan(0);
  await page.getByRole("link", { name: "Work", exact: true }).tap();
  const mini = page.getByRole("complementary", { name: "Playing music" });
  await expect(mini).toBeVisible();
  await mini.getByRole("button", { name: "Next track" }).tap();
  await expect(mini).toContainText("Beethoven");
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

test("tab changes restore reading position and the contact sheet dismisses by dragging", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 900));
  const position = await page.evaluate(() => window.scrollY);
  await page.getByRole("link", { name: "Work", exact: true }).tap();
  await page.getByRole("link", { name: "About", exact: true }).tap();
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
