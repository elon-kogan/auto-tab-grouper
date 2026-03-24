---
title: "CI Workflow (100% Coverage Enforcement)"
change_id: test-coverage-and-deps-3
type: feature
workflow_id: t3c8d2
parent: test-coverage-and-deps-epic
spec: ./SPEC.md
status: approved
created: 2026-03-24
sdd_version: 7.3.0
---

# CI Workflow (100% Coverage Enforcement)

## Overview

Add GitHub Actions workflow that runs tests with 100% coverage threshold on every PR and push to `main`.

## Background

After Features 1 and 2, the codebase has 100% coverage on all core and logic modules. This feature enforces that standard automatically via CI.

## Scope

- `.github/workflows/test.yml`
- Coverage threshold in `jest.config.js` for core + logic modules
- CI fails if threshold not met

## Technical Design

### .github/workflows/test.yml

```yaml
name: Tests
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage-report
          path: coverage/
```

### jest.config.js Coverage Thresholds

Add `coverageThreshold` to enforce 100% on core + logic modules:

```js
coverageThreshold: {
  './src/shared/utils.ts': { branches: 100, functions: 100, lines: 100, statements: 100 },
  './src/shared/config.ts': { branches: 100, functions: 100, lines: 100, statements: 100 },
  './src/background/background.ts': { branches: 100, functions: 100, lines: 100, statements: 100 },
  './src/options/options-logic.ts': { branches: 100, functions: 100, lines: 100, statements: 100 },
  './src/popup/popup-logic.ts': { branches: 100, functions: 100, lines: 100, statements: 100 },
}
```

`options.ts` and `popup.ts` are DOM-only shells — set a lower threshold rather than excluding entirely:

```js
  './src/options/options.ts': { lines: 70, functions: 70, branches: 70, statements: 70 },
  './src/popup/popup.ts':    { lines: 80, functions: 80, branches: 80, statements: 80 },
```

> **Note for implementer:** These percentages (70% / 80%) are estimates based on static analysis before tests are written. After Feature 2 tests are in place, run `npm test -- --coverage` and check the actual numbers. Adjust thresholds to the nearest round number at or below actual coverage — the goal is a meaningful floor, not an arbitrary ceiling.

## Observability

- Coverage report uploaded as CI artifact (HTML + lcov)
- CI badge can be added to README after this merges

## Non-Functional Requirements

- CI runtime < 5 min
- Tests must be deterministic (no flaky tests)

## Acceptance Criteria

- **Given** a PR is opened, **when** CI runs, **then** tests execute and coverage is checked
- **Given** coverage drops below 100% on a core file, **when** CI runs, **then** build fails
- **Given** push to `main`, **when** CI runs, **then** workflow triggers automatically

## Dependencies

- Depends on: Feature 2 (100% coverage must be achievable before enforcing it)
