import { test, expect } from '../playwright.fixture.js';

test.describe('Performance instrumentation', () => {
  test('logs reveal latency markers within the performance budget', async ({ page }) => {
    const consoleMessages = [];
    page.on('console', (message) => {
      if (message.type() === 'info' || message.type() === 'log') {
        consoleMessages.push(message.text());
      }
    });

    await page.goto('/');
    await page.getByRole('button', { name: /new game/i }).click();
    await page.getByTestId('tile-0-0').click();

    await test.step('wait for instrumentation output', async () => {
      await page.waitForTimeout(150);
    });

    expect(consoleMessages.some((text) => text.includes('interaction latency'))).toBe(true);
  });
});
