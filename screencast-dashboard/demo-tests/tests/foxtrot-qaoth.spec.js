import { test } from '../fixtures.js';

test('Foxtrot — QAotHwy (45s)', async ({ page }) => {
  await page.goto('https://www.qaorthehwy.com/');
  await page.waitForTimeout(45_000);
});
