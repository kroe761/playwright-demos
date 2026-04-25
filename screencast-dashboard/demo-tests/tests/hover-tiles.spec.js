import { test } from '../fixtures.js';

test('The Internet — hover tiles', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/hovers');
  await page.waitForTimeout(1500);

  const figures = page.locator('.figure');
  const count = await figures.count();
  for (let i = 0; i < count; i++) {
    await figures.nth(i).hover();
    await page.waitForTimeout(1200);
  }

  await page.waitForTimeout(1500);
});
