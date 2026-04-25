import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 5,
  reporter: 'list',
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
});
