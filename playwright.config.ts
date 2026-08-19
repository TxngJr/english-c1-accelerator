import { defineConfig } from "@playwright/test";

const isCI = Boolean(process.env.CI);
const diagnostic = process.env.E2E_DIAGNOSTIC === "1";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI && !diagnostic ? 1 : 0,
  workers: isCI ? 1 : undefined,
  timeout: diagnostic ? 10_000 : 30_000,
  expect: {
    timeout: diagnostic ? 3_000 : 5_000
  },
  reporter: isCI
    ? [["line"], ["html", { open: "never", outputFolder: "playwright-report" }]]
    : [["list"]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: diagnostic ? "retain-on-failure" : "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  webServer: {
    command: isCI
      ? "npm start -- -H 127.0.0.1 -p 3000"
      : "npm run dev -- -H 127.0.0.1 -p 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !isCI,
    timeout: 120_000
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" }
    }
  ]
});
