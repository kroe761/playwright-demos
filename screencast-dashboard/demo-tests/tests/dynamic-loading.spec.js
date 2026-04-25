import { test } from '../fixtures.js';

test('The Internet — dynamic loading', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/2');
  await page.waitForTimeout(1500);

  await page.getByRole('button', { name: 'Start' }).click();
  await page.waitForTimeout(5500); // watch the spinner

  await page.waitForTimeout(2000);
});
