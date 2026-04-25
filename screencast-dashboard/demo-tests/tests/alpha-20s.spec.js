import { test } from '../fixtures.js';

test('Alpha (20s)', async ({ page }) => {
  await page.waitForTimeout(20_000);
});
