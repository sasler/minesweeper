import { test, expect } from '../playwright.fixture.js';

test.describe('Accessibility smoke checks', () => {
  test('keyboard navigation and color contrast pass axe checks', async ({ page, makeAxeBuilder }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="tile-0-0"]')).toBeFocused();

    const axeBuilder = makeAxeBuilder();
    const results = await axeBuilder.analyze();
    expect(results.violations).toHaveLength(0);
  });
});
