import { test } from '../fixtures.js';

test('Random Wikipedia article', async ({ page }) => {
  await page.goto('https://en.wikipedia.org/wiki/Special:Random');
  await page.waitForTimeout(2500);

  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(1500);
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(1500);
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(2000);
});
