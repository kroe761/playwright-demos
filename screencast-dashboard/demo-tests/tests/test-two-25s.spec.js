import { test } from '../fixtures.js';

test('Test Two (25s)', async ({ page, testPage }) => {
  await page.goto(testPage);
  await page.waitForTimeout(25_000);
});
