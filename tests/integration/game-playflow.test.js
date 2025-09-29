import { test, expect } from '../playwright.fixture.js';

test.describe('Game play flow', () => {
  test('player wins a game and sees HUD updates', async ({ page, makeAxeBuilder }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /new game/i }).click();
    await page.getByTestId('tile-0-0').click();
    await page.getByTestId('tile-0-1').click();
    await page.getByRole('button', { name: /flag mode/i }).click();
    await page.getByTestId('tile-1-1').click();
    await page.getByRole('button', { name: /reveal mode/i }).click();

    await expect(page.getByRole('status')).toContainText(/mines remaining/i);

    const axeBuilder = makeAxeBuilder();
    const report = await axeBuilder.analyze();
    expect(report.violations).toHaveLength(0);
  });
});
