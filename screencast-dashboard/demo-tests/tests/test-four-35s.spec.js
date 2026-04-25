import { test } from '../fixtures.js';

test('Test Four (35s)', async ({ page }) => {
  await page.waitForTimeout(35_000);
});
