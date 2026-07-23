import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config (docs/PLAN.md §7 Testing & QA).
 * Chromium-only by default; drives the responsive matrix, axe a11y gate,
 * and light/dark visual checks.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // Force the fixtures so specs assert against a deterministic dataset,
    // regardless of what CMS_SITE points at in a local .env.local.
    env: { CMS_USE_FIXTURES: "1" },
  },
});
