---
title: CI Workflow (100% Coverage Enforcement)
type: feature
status: draft
domain: CI/CD
issue: TBD
created: 2026-03-24
updated: 2026-03-24
sdd_version: 7.3.0
parent_epic: ../SPEC.md
change_id: test-coverage-and-deps-3
depends_on: test-coverage-and-deps-2
---

# CI Workflow (100% Coverage Enforcement)

> Parent epic spec: [SPEC.md](../SPEC.md)
> Depends on: [02-refactoring](../02-refactoring/SPEC.md)

## Overview

Add GitHub Actions CI workflow that runs tests with 100% coverage threshold on every PR and push to `main`.

## Scope

**New files:**
- `.github/workflows/test.yml`

**Modified files:**
- `jest.config.js` — add `coverageThreshold`

## CI Workflow Spec

**Triggers:** `push` to `main`, `pull_request` (all branches)

**Steps:**
1. `actions/checkout@v4`
2. `actions/setup-node@v4` with `node-version: lts/*` and `cache: npm`
3. `npm ci`
4. `npm test -- --coverage --ci`

**Coverage threshold in `jest.config.js`:**
```js
coverageThreshold: {
  // 100% for core logic files
  './src/shared/utils.ts': { branches: 100, functions: 100, lines: 100, statements: 100 },
  './src/shared/config.ts': { branches: 100, functions: 100, lines: 100, statements: 100 },
  './src/background/background.ts': { branches: 100, functions: 100, lines: 100, statements: 100 },
  './src/options/options-logic.ts': { branches: 100, functions: 100, lines: 100, statements: 100 },
  './src/popup/popup-logic.ts': { branches: 100, functions: 100, lines: 100, statements: 100 },
}
```

Note: `options.ts` and `popup.ts` (DOM shells) excluded from threshold.

## Acceptance Criteria

- [ ] **AC1:** Given a PR is opened, when CI runs, then tests execute and coverage is checked
- [ ] **AC2:** Given coverage drops below 100% on a core/logic file, when CI runs, then build fails
- [ ] **AC3:** Given push to `main`, when CI runs, then workflow triggers automatically
- [ ] **AC4:** Given `npm ci && npm test -- --coverage --ci` runs locally, then matches CI behavior
