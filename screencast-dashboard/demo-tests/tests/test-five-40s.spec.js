import { test } from '../fixtures.js';

test('Test Five (40s)', async ({ page }) => {
  await page.waitForTimeout(40_000);
});
