// Renders public/og.png (1200x630), the card shown when the site is shared.
// Run: PLAYWRIGHT_CHANNEL=chrome node scripts/make-og.mjs
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
// Inlined as a data URL: a page set from a string cannot read local files.
const font = `data:font/woff2;base64,${readFileSync(
  join(
    root,
    "node_modules/@fontsource-variable/recursive/files/recursive-latin-full-normal.woff2",
  ),
).toString("base64")}`;

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: R; src: url("${font}") format("woff2-variations"); font-weight: 300 1000; }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; padding: 64px 72px; background: #f4f3ee; color: #1c2ec4;
  font-family: R, sans-serif; display: flex; flex-direction: column; justify-content: space-between; }
.top { display: flex; justify-content: space-between; font-size: 26px; font-weight: 700; }
.top span:last-child { font-weight: 440; opacity: .76; }
h1 { font-size: 94px; line-height: .98; letter-spacing: -0.04em;
  font-variation-settings: "wght" 880, "CASL" 1, "slnt" -6, "MONO" 0; }
.foot { display: flex; justify-content: space-between; align-items: flex-end; }
.names { font-size: 27px; font-weight: 560; letter-spacing: -0.01em; }
.seal { width: 124px; height: 124px; border-radius: 8px; background: #df3b1f; color: #f4f3ee;
  transform: rotate(-5deg); display: grid; place-items: center; font-size: 53px; line-height: .92;
  text-align: center; letter-spacing: 0.02em; font-variation-settings: "wght" 900, "CASL" 1, "MONO" 0; }
</style>
<div class="top"><span>Chao Sun</span><span>chaosun.xyz</span></div>
<h1>Data tools that<br>show their sources.</h1>
<div class="foot">
  <p class="names">CNEquity · USEquity · Suomeksi · ArkiWatch<br><span style="opacity:.76;font-weight:440">Software architect in Helsinki</span></p>
  <div class="seal">CH<br>AO</div>
</div>`;

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(async () => {
  await document.fonts.load('900 94px "R"');
  await document.fonts.ready;
});
await page.screenshot({ path: join(root, "public/og.png") });
await browser.close();
