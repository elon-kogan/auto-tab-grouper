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
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    // types.ts is excluded because it contains only type declarations and DEFAULT_CONFIG,
    // which is a re-exported constant tested indirectly via config.ts (loadConfig fallback).
    '!src/**/types.ts',
  ],
};
