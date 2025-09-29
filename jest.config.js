export default {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  collectCoverageFrom: ['src/scripts/**/*.js'],
  testMatch: ['<rootDir>/tests/unit/**/*.test.js'],
  testPathIgnorePatterns: ['<rootDir>/tests/integration/', '<rootDir>/tests/accessibility/'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  moduleNameMapper: {
    '^@scripts/(.*)$': '<rootDir>/src/scripts/$1',
    '^@core/(.*)$': '<rootDir>/src/scripts/core/$1',
    '^@state/(.*)$': '<rootDir>/src/scripts/state/$1',
    '^@ui/(.*)$': '<rootDir>/src/scripts/ui/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/unit/setup-tests.js'],
  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: './babel.config.cjs' }]
  }
};
