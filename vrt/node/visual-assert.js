// Node — toHaveScreenshot() is built in.
// No helper needed; shown here for completeness and side-by-side comparison.
//
// Usage:
//   const { test, expect } = require('@playwright/test');
//
//   test('homepage', async ({ page }) => {
//     await page.goto('https://example.com');
//     await expect(page).toHaveScreenshot('homepage.png', { maxDiffPixelRatio: 0.001 });
//   });
//
// First run: pass --update-snapshots to create baselines.
// Baselines land in __snapshots__/ next to your spec file.
//
// Options worth knowing:
//   maxDiffPixels        — absolute pixel count instead of ratio
//   threshold            — per-pixel color distance (0–1, default 0.2)
//   mask: [locator]      — exclude dynamic regions (timestamps, ads)
//   animations: 'disabled' — freeze CSS animations before capture
