import { test } from '../fixtures.js';

test('Test Two (25s)', async ({ page }) => {
  await page.waitForTimeout(25_000);
});
