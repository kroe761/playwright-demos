import { test } from '../fixtures.js';

test('Fill TodoMVC list', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
  await page.waitForTimeout(1500);

  const todos = ['Buy milk', 'Walk the dog', 'Write talk', 'Test parallel demo', 'Ship it'];
  for (const todo of todos) {
    await page.getByPlaceholder('What needs to be done?').fill(todo);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(700);
  }

  await page.waitForTimeout(1500);

  // Check off a couple
  await page.getByRole('checkbox').first().check();
  await page.waitForTimeout(800);
  await page.getByRole('checkbox').nth(1).check();
  await page.waitForTimeout(2000);
});
