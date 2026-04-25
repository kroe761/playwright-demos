import { test } from '../fixtures.js';

test('Bravo (25s)', async ({ page }) => {
  await page.waitForTimeout(25_000);
});
