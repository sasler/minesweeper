import { test, expect } from '../playwright.fixture.js';

test.describe('Game loss flow', () => {
  test('revealing a mine ends the game and allows restart', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /new game/i }).click();
    await page.getByTestId('tile-2-2').click();

    await expect(page.getByRole('status')).toContainText(/boom|lost/i);

    await page.getByRole('button', { name: /restart/i }).click();
    await expect(page.getByRole('status')).toContainText(/ready/i);
  });
});
