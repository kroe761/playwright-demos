import { test } from '../fixtures.js';

test('Echo (40s)', async ({ page }) => {
  await page.waitForTimeout(40_000);
});
