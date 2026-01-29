import * as dotenv from "dotenv"
import { defineConfig, devices, PlaywrightTestConfig } from "@playwright/test"

dotenv.config()

const testEnv = process.env.TEST_ENVIRONMENT?.toLowerCase() || "dev"
dotenv.config({ path: `.env.${testEnv}` })

const config: PlaywrightTestConfig = {
  snapshotDir: "./src/resources/visual_baselines",
  snapshotPathTemplate: "{snapshotDir}/{testFileDir}/{arg}{ext}",
  testDir: "./src/tests",
  globalTimeout: 3_600_000,
  timeout: 4_200_000,
  retries: 0,

  reporter: [
    ["html", { open: "never" }],
    [
      "allure-playwright",
      {
        outputFolder: "allure-results",
        detail: true,
        suiteTitle: false,
      },
    ],
  ],

  use: {
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
    navigationTimeout: 40_000,
    actionTimeout: 30_000,
  },

  projects: [
    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: {
          width: Number(process.env.AUTOMATION_UI_WIDTH) || 1280,
          height: Number(process.env.AUTOMATION_UI_HEIGHT) || 720,
        },
        headless: true,
      },
    },
    {
      name: "chrome-parallel",
      fullyParallel: true,
      use: {
        ...devices["Desktop Chrome"],
        viewport: {
          width: Number(process.env.AUTOMATION_UI_WIDTH) || 1280,
          height: Number(process.env.AUTOMATION_UI_HEIGHT) || 720,
        },
        headless: true,
      },
    },
    {
      name: "debug",
      use: {
        ...devices["Desktop Chrome"],
        viewport: {
          width: Number(process.env.AUTOMATION_UI_WIDTH) || 1280,
          height: Number(process.env.AUTOMATION_UI_HEIGHT) || 720,
        },
        headless: false,
      },
    },
    {
      name: "api",
      fullyParallel: true,
      use: {
        headless: true,
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "api-parallel",
      fullyParallel: true,
      use: {
        headless: true,
        ignoreHTTPSErrors: true,
      },
    },
  ],
}

export default defineConfig(config)
