import { afterEach, jest } from '@jest/globals';

// Reset Jest mocks after each test run to avoid cross-test contamination.
afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});
