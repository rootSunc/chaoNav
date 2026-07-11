import { defineConfig, devices } from '@playwright/test';

const previewHost = '127.0.0.1';
const previewPort = 4173;
const previewUrl = `http://${previewHost}:${previewPort}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}{ext}',
  use: {
    baseURL: previewUrl,
    trace: 'on-first-retry',
    colorScheme: 'dark',
  },
  webServer: {
    command: `pnpm build && pnpm preview --host ${previewHost} --port ${previewPort}`,
    url: previewUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      testMatch: /visual\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        reducedMotion: 'reduce',
      },
    },
    {
      name: 'chromium-webgl',
      testMatch: /webgl\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        reducedMotion: 'no-preference',
      },
    },
  ],
});
