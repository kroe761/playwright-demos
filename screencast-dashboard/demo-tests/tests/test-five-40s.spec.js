import { test } from '../fixtures.js';

test('Test Five (40s)', async ({ page, testPage }) => {
  await page.goto(testPage);
  await page.waitForTimeout(40_000);
});
