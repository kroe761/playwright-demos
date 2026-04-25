import { test } from '../fixtures.js';

test('Browse Playwright docs', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.waitForTimeout(2000);

  await page.getByRole('link', { name: 'Get started' }).first().click();
  await page.waitForTimeout(2500);

  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(1500);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(1500);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(2000);
});
