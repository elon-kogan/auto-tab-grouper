---
title: "Unit Tests (Initial Coverage)"
change_id: test-coverage-and-deps-1
type: feature
workflow_id: t3c8d2
parent: test-coverage-and-deps-epic
spec: ./SPEC.md
status: approved
created: 2026-03-24
sdd_version: 7.3.0
---

# Unit Tests (Initial Coverage)

## Overview

Add Jest test suite with reasonable coverage for all source files in the `auto-tab-grouper` Chrome extension.

## Background

The codebase currently has no test framework or tests. This is the first step in making the codebase safe to change.

## Scope

- Install: `jest`, `ts-jest`, `jest-chrome`, `@types/jest`
- Configure `jest.config.js`
- Write tests for `utils.ts` (100%), `config.ts` (100%), `background.ts` (100%)
- Write tests for `options.ts` (best-effort), `popup.ts` (best-effort)
- Exclude from coverage: `chrome.d.ts`, `types.ts`
- Add `"test": "jest"` to `package.json` scripts

## Coverage Targets

| File | Target |
|------|--------|
| `src/shared/utils.ts` | 100% |
| `src/shared/config.ts` | 100% |
| `src/background/background.ts` | 100% |
| `src/options/options.ts` | best-effort |
| `src/popup/popup.ts` | best-effort |

## Technical Design

### jest.config.js

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['jest-chrome/setup'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/types.ts',
  ],
};
```

### tsconfig.json

May need `"types": ["jest"]` added to `compilerOptions`.

## Edge Cases to Test

- `extractDomain`: empty string, `chrome://`, `file://`, URL without protocol, international domains
- `isValidHttpUrl`: malformed URLs, `ftp://`, relative paths
- `isValidDomain`: empty, spaces, special chars, valid subdomains
- `loadConfig`: storage returns null, storage throws, malformed data
- `saveConfig`: storage write failure
- `groupTabByDomain`: tab without URL, tab with `chrome://` URL, tab already in a group
- `getOrCreateGroup`: existing group match, no match (create new), color assignment

## Test Files

| Source | Test File |
|--------|-----------|
| `src/shared/utils.ts` | `src/shared/utils.test.ts` |
| `src/shared/config.ts` | `src/shared/config.test.ts` |
| `src/background/background.ts` | `src/background/background.test.ts` |
| `src/options/options.ts` | `src/options/options.test.ts` |
| `src/popup/popup.ts` | `src/popup/popup.test.ts` |

## Acceptance Criteria

- **Given** the repo is cloned, **when** `npm test` is run, **then** all tests pass
- **Given** tests run, **when** coverage report is generated, **then** `utils.ts`, `config.ts`, `background.ts` show 100%
- **Given** invalid URL passed to `extractDomain`, **when** test runs, **then** function handles it gracefully
- **Given** `chrome.storage` is mocked to fail, **when** `loadConfig` is called, **then** default config is returned

## Dependencies

### New devDependencies

| Package | Purpose |
|---------|---------|
| `jest` | Test runner |
| `ts-jest` | TypeScript transform for Jest |
| `jest-chrome` | Chrome API mock |
| `@types/jest` | TypeScript types for Jest |

## Out of Scope

- Coverage thresholds (enforced in Feature 3)
- Integration or E2E tests
