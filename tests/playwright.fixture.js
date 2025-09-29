import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Provide an Axe builder helper so tests can request accessibility scans when needed.
export const test = base.extend({
  makeAxeBuilder: async ({ page }, use) => {
    await use(() => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']));
  }
});

export { expect };
