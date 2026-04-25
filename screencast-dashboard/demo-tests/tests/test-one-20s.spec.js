import { test } from '../fixtures.js';

test('Test One (20s)', async ({ page }) => {
  await page.waitForTimeout(20_000);
});
