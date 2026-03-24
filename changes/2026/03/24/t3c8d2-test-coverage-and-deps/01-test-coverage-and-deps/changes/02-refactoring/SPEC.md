---
title: "Refactoring + Improved Tests"
change_id: test-coverage-and-deps-2
type: feature
workflow_id: t3c8d2
parent: test-coverage-and-deps-epic
spec: ./SPEC.md
status: approved
created: 2026-03-24
sdd_version: 7.3.0
---

# Refactoring + Improved Tests

## Overview

Extract business logic from `options.ts` and `popup.ts` into pure, testable modules. Update and improve tests to achieve 100% coverage on all core and logic modules.

## Background

After Feature 1, `options.ts` and `popup.ts` have best-effort coverage because they mix DOM manipulation with business logic. This feature separates concerns to enable 100% coverage.

## Scope

- Extract business logic from `options.ts` → `options-logic.ts`
- Extract business logic from `popup.ts` → `popup-logic.ts`
- Logic modules must be pure functions with no DOM dependencies
- Update existing tests (some will break predictably due to refactor; fix them)
- Add tests for new logic modules to reach 100%
- `npm test` must pass at end of this feature

## Refactoring Pattern

```
src/options/options.ts         → DOM-only shell, calls options-logic.ts
src/options/options-logic.ts   → pure functions: collectGroupsFromUI logic, validateGroup, importConfig parsing
src/popup/popup.ts             → DOM-only shell, calls popup-logic.ts
src/popup/popup-logic.ts       → pure functions: updateUI data preparation, escapeHtml, status text logic
```

## Coverage Targets

| File | Target |
|------|--------|
| `src/shared/utils.ts` | 100% |
| `src/shared/config.ts` | 100% |
| `src/background/background.ts` | 100% |
| `src/options/options-logic.ts` | 100% |
| `src/popup/popup-logic.ts` | 100% |
| `src/options/options.ts` | DOM-only (best-effort) |
| `src/popup/popup.ts` | DOM-only (best-effort) |

## Edge Cases to Test in Logic Modules

- `options-logic`: invalid JSON import, invalid group structure, empty title/domains
- `popup-logic`: enabled/disabled state, 0 groups, multiple groups, singular/plural
- `escapeHtml`: must remain in place and be tested explicitly (XSS prevention)

## Security

- `escapeHtml` in `popup.ts` prevents XSS from group titles — must remain after refactor and be explicitly tested

## Mandatory Checks

- All broken tests must be explainable by the refactor (no silent regressions)
- Total coverage must be equal or higher after refactor

## Test Files

| Source | Test File |
|--------|-----------|
| `src/options/options-logic.ts` | `src/options/options-logic.test.ts` |
| `src/popup/popup-logic.ts` | `src/popup/popup-logic.test.ts` |

## Acceptance Criteria

- **Given** refactored code, **when** `npm test` runs, **then** all tests pass (no unresolved breakages)
- **Given** coverage report, **when** generated after refactor, **then** total coverage equals or exceeds pre-refactor
- **Given** logic modules, **when** tested in isolation, **then** 100% coverage achieved without DOM mocks

## Dependencies

- Depends on: Feature 1 (tests must exist as safety net before refactoring)
