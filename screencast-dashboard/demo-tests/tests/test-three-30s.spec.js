import { test } from '../fixtures.js';

test('Test Three (30s)', async ({ page }) => {
  await page.waitForTimeout(30_000);
});
