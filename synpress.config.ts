import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/unit/components',
  testMatch: '**/ConnectButtonWithWallet.test.ts',
  fullyParallel: false, // MetaMask tests cannot run in parallel
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Must be 1 for MetaMask tests
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
