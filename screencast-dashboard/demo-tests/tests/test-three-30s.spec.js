import { test } from '../fixtures.js';

test('Test Three (30s)', async ({ page, testPage }) => {
  await page.goto(testPage);
  await page.waitForTimeout(30_000);
});
