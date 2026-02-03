import type { ConfigOptions } from "@nuxt/test-utils/playwright";

import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath } from "node:url";

export default defineConfig<ConfigOptions>({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  reporter: "html",
  retries: process.env.CI ? 2 : 0,
  testDir: "./tests",
  use: {
    nuxt: {
      rootDir: fileURLToPath(new URL(".", import.meta.url)),
    },
    trace: "on-first-retry",
  },
  workers: process.env.CI ? 1 : undefined,
});
