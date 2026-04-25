import { test } from '../fixtures.js';

test('Test Four (35s)', async ({ page, testPage }) => {
  await page.goto(testPage);
  await page.waitForTimeout(35_000);
});
