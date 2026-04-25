import { test } from '../fixtures.js';

test('Delta (35s)', async ({ page }) => {
  await page.waitForTimeout(35_000);
});
