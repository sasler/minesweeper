import baseConfig from './playwright.config.js';
import { defineConfig, devices } from '@playwright/test';

const { projects: _ignored, ...sharedConfig } = baseConfig;

export default defineConfig({
  ...sharedConfig,
  projects: [
    {
      name: 'firefox-desktop',
      use: {
        ...sharedConfig.use,
        ...devices['Desktop Firefox']
      }
    },
    {
      name: 'webkit-desktop',
      use: {
        ...sharedConfig.use,
        ...devices['Desktop Safari']
      }
    },
    {
      name: 'webkit-ios',
      use: {
        ...sharedConfig.use,
        ...devices['iPhone 14 Pro Max']
      }
    }
  ]
});
