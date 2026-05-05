import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const isCI = process.env.CI === 'true';
const isHeadless = process.env.HEADLESS !== 'false';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.ts'],
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  ...(isCI && { workers: 2 }),
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL ?? 'https://eventhub.rahulshettyacademy.com',
    browserName: 'chromium',
    headless: isHeadless,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  outputDir: 'test-results',
});
