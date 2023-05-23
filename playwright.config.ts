import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 120000,
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    bypassCSP: true
  },

  projects: [
    {
      name: 'mobile',
      use: {
        viewport: { width: 412, height: 732 },
        isMobile: true
      }
    },
    {
      name: 'tablet',
      use: {
        viewport: { width: 768, height: 1024 },
        isMobile: true
      }
    }
  ],

  webServer: {
    command: 'npx ionic serve --nobrowser',
    url: 'http://localhost:8100',
    reuseExistingServer: !process.env.CI
  }
});
