import { test } from '../fixtures.js';

test('Charlie (30s)', async ({ page }) => {
  await page.waitForTimeout(30_000);
});
