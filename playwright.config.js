// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests-e2e',
  fullyParallel: false, // Run tests sequentially (important for CRUD order)
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Start both servers before running tests
  webServer: [
    {
      command: 'cd backend && npm start',
      url: 'http://localhost:3000/api/books',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      // Use `preview` (production) when running in CI, else use dev server for local runs
      command: process.env.CI ? 'npm run preview' : 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
});
