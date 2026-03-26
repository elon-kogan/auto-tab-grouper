module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        module: 'commonjs',
        esModuleInterop: true,
        types: ['chrome', 'jest', 'node'],
      },
    }],
  },
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/styleMock.js',
  },
  coverageThreshold: {
    // Core modules must stay at 100%
    './src/background/background.ts':    { statements: 100, branches: 100, functions: 100, lines: 100 },
    './src/shared/config.ts':            { statements: 100, branches: 100, functions: 100, lines: 100 },
    './src/shared/utils.ts':             { statements: 100, branches: 100, functions: 100, lines: 100 },
    // Logic modules (pure, no DOM) must stay at 100%
    './src/options/options-logic.ts':    { statements: 100, branches: 100, functions: 100, lines: 100 },
    './src/popup/popup-logic.ts':        { statements: 100, branches: 100, functions: 100, lines: 100 },
    // DOM-dependent modules — coverage limited by untested event handlers
    './src/options/options.ts':          { statements: 45, branches: 45, functions: 30, lines: 45 },
    './src/popup/popup.ts':              { statements: 70, branches: 50, functions: 40, lines: 70 },
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/test-utils/**',
    // types.ts is excluded because it contains only type declarations and DEFAULT_CONFIG,
    // which is a re-exported constant tested indirectly via config.ts (loadConfig fallback).
    '!src/**/types.ts',
  ],
};
