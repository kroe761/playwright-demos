import { test } from '../fixtures.js';

test('Test One (20s)', async ({ page, testPage }) => {
  await page.goto(testPage);
  await page.waitForTimeout(20_000);
});
