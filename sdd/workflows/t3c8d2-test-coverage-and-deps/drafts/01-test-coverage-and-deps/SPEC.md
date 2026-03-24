---
title: Test Coverage and Dependencies Update
type: epic
status: draft
change_id: test-coverage-and-deps-epic
workflow_id: t3c8d2
created: 2026-03-24
---

# Test Coverage and Dependencies Update

## Overview

### Background

The `auto-tab-grouper` Chrome extension codebase currently has no test coverage and outdated dependencies. This creates risk when making changes and prevents catching regressions automatically.

### Current State

- No test framework configured
- No unit or integration tests exist
- Dependencies are several major versions behind latest stable
- No CI workflow for automated testing
- `options.ts` and `popup.ts` mix business logic with DOM manipulation, making them harder to test

### Goal

Bring the codebase to a high-quality state with full test coverage, clean architecture, automated CI enforcement, and up-to-date dependencies. Order matters: tests provide safety net for refactoring; refactoring enables 100% coverage; CI enforces the new standard; deps update validates everything still works.

---

## User Stories

1. **As a developer**, I want unit tests with 100% coverage for core modules, so I can make changes safely with confidence
2. **As a developer**, I want CI to run tests on every PR and push to `main`, so regressions are caught automatically
3. **As a developer**, I want `options.ts` and `popup.ts` business logic separated from DOM code, so it is fully testable and maintainable
4. **As a developer**, I want all dependencies at latest stable versions, so I benefit from security fixes and new features

---

## Features (Ordered)

This epic decomposes into 4 sequential features. Each depends on the previous.

### Feature 1 — Unit Tests (Initial Coverage)

Add Jest test suite with reasonable coverage for all source files.

**Scope:**
- Install: `jest`, `ts-jest`, `jest-chrome`, `@types/jest`
- Configure `jest.config.js`
- Tests: `utils.ts` (100%), `config.ts` (100%), `background.ts` (100%)
- Tests: `options.ts` (reasonable/best-effort), `popup.ts` (reasonable/best-effort)
- Exclude from coverage: `chrome.d.ts`, `types.ts`
- `npm test` added to scripts

**Coverage targets:**

| File | Target |
|------|--------|
| `src/shared/utils.ts` | 100% |
| `src/shared/config.ts` | 100% |
| `src/background/background.ts` | 100% |
| `src/options/options.ts` | best-effort |
| `src/popup/popup.ts` | best-effort |

---

### Feature 2 — Refactoring + Improved Tests

Refactor `options.ts` and `popup.ts` to extract business logic into pure, testable modules. Update and improve tests to achieve 100% coverage on refactored code.

**Scope:**
- Extract business logic from `options.ts` → e.g., `options-logic.ts`
- Extract business logic from `popup.ts` → e.g., `popup-logic.ts`
- Logic modules: pure functions, no DOM dependencies
- Update existing tests — some will break predictably due to refactor; fix them
- Add tests for new logic modules to reach 100% coverage
- `npm test` must pass at end of this feature

**Mandatory checks:**
- All broken tests must be explicable by the refactor (no silent regressions)
- Total coverage must be equal or higher after refactor

---

### Feature 3 — CI Workflow (100% Coverage Enforcement)

Add GitHub Actions workflow that runs tests with 100% coverage threshold on every PR and push to `main`.

**Scope:**
- `.github/workflows/test.yml`
  - Triggers: `push` to `main`, `pull_request`
  - Steps: checkout → setup Node (lts/*) → `npm ci` → `npm test -- --coverage`
- Coverage threshold in `jest.config.js`:
  - `branches: 100, functions: 100, lines: 100, statements: 100` for core files
  - `options.ts` / `popup.ts` excluded from threshold (covered by refactored logic modules)
- CI fails if threshold not met

---

### Feature 4 — Dependencies Update

Update all dependencies to latest stable versions. Validate build and tests pass.

**Scope:**
- Run `npx npm-check-updates -u && npm install`
- Fix breaking changes (TypeScript, webpack-cli, copy-webpack-plugin, etc.)
- No alpha/beta/RC versions — latest stable only
- Validate: `npm run build` passes
- Validate: `npm test` passes
- Dependabot PRs will auto-close after this merge

---

## Functional Requirements

| # | Requirement | Feature |
|---|-------------|---------|
| F1 | Jest configured with `ts-jest` and `jest-chrome` | 1 |
| F2 | 100% coverage for `utils.ts`, `config.ts`, `background.ts` | 1 |
| F3 | Best-effort coverage for `options.ts`, `popup.ts` | 1 |
| F4 | All edge cases covered: invalid URLs, empty storage, tabs without URL, duplicate groups | 1 |
| F5 | Business logic extracted from `options.ts` into pure functions | 2 |
| F6 | Business logic extracted from `popup.ts` into pure functions | 2 |
| F7 | 100% coverage on extracted logic modules | 2 |
| F8 | All test breakages from refactor are explainable and fixed | 2 |
| F9 | GitHub Actions workflow triggers on PR and push to `main` | 3 |
| F10 | CI enforces 100% coverage threshold on core + logic modules | 3 |
| F11 | All dependencies updated to latest stable versions | 4 |
| F12 | `npm run build` passes after deps update | 4 |
| F13 | `npm test` passes after deps update | 4 |

---

## Non-Functional Requirements

| # | Requirement |
|---|-------------|
| N1 | No pre-release (alpha/beta/RC) dependency versions |
| N2 | CI runtime should be reasonable (< 5 min) |
| N3 | Tests must be deterministic (no flaky tests) |
| N4 | Coverage report published as CI artifact |

---

## Acceptance Criteria

### Feature 1
- **Given** the repo is cloned, **when** `npm test` is run, **then** all tests pass
- **Given** tests run, **when** coverage report is generated, **then** `utils.ts`, `config.ts`, `background.ts` show 100%
- **Given** invalid URL passed to `extractDomain`, **when** test runs, **then** function handles it gracefully
- **Given** `chrome.storage` is mocked to fail, **when** `loadConfig` is called, **then** default config is returned

### Feature 2
- **Given** refactored code, **when** `npm test` runs, **then** all tests pass (no unresolved breakages)
- **Given** coverage report, **when** generated after refactor, **then** total coverage equals or exceeds pre-refactor
- **Given** logic modules, **when** tested in isolation, **then** 100% coverage achieved without DOM mocks

### Feature 3
- **Given** a PR is opened, **when** CI runs, **then** tests execute and coverage is checked
- **Given** coverage drops below 100% on a core file, **when** CI runs, **then** build fails
- **Given** push to `main`, **when** CI runs, **then** workflow triggers automatically

### Feature 4
- **Given** updated deps, **when** `npm run build` runs, **then** extension builds without errors
- **Given** updated deps, **when** `npm test` runs, **then** all tests pass
- **Given** TypeScript is upgraded, **when** type checking runs, **then** no new type errors

---

## Technical Design

### Test Setup

```
jest.config.js
  transform: ts-jest
  testEnvironment: jsdom
  setupFiles: jest-chrome mock setup
  collectCoverageFrom: src/**/*.ts (excluding *.d.ts, types.ts)
  coverageThreshold: (Feature 3) 100% for core + logic modules
```

### Refactoring Pattern (Feature 2)

Extract from UI files into co-located logic files:

```
src/options/options.ts         → DOM-only, thin shell
src/options/options-logic.ts   → pure functions: collectGroupsFromUI logic, validateGroup logic, importConfig parsing
src/popup/popup.ts             → DOM-only, thin shell
src/popup/popup-logic.ts       → pure functions: updateUI data preparation, escapeHtml, status text logic
```

### Edge Cases to Test

- `extractDomain`: empty string, `chrome://`, `file://`, URL without protocol, international domains
- `isValidHttpUrl`: malformed URLs, ftp://, relative paths
- `isValidDomain`: empty, spaces, special chars, valid subdomains
- `loadConfig`: storage returns null, storage throws, malformed data
- `saveConfig`: storage write failure
- `groupTabByDomain`: tab without URL, tab with `chrome://` URL, tab already in a group
- `getOrCreateGroup`: existing group match, no match (create new), color assignment
- `options-logic`: invalid JSON import, invalid group structure, empty title/domains
- `popup-logic`: enabled/disabled state, 0 groups, multiple groups, singular/plural

---

## Security Considerations

- `escapeHtml` in `popup.ts` prevents XSS from group titles — must remain in place after refactor and be tested explicitly

---

## Error Handling

- `loadConfig` must return default config on any storage error (never throw to caller)
- `importConfig` must show user-facing error on invalid JSON or invalid structure
- `saveConfig` failure must show user-facing error, not silently fail

---

## Observability

- Coverage report as CI artifact (HTML + lcov)
- CI badge can be added to README after Feature 3

---

## Testing Strategy

### Unit Tests

| File | Test File | Coverage Target |
|------|-----------|----------------|
| `src/shared/utils.ts` | `src/shared/utils.test.ts` | 100% |
| `src/shared/config.ts` | `src/shared/config.test.ts` | 100% |
| `src/background/background.ts` | `src/background/background.test.ts` | 100% |
| `src/options/options.ts` | `src/options/options.test.ts` | best-effort (F1), 100% after refactor (F2) |
| `src/popup/popup.ts` | `src/popup/popup.test.ts` | best-effort (F1), 100% after refactor (F2) |
| `src/options/options-logic.ts` | `src/options/options-logic.test.ts` | 100% (F2) |
| `src/popup/popup-logic.ts` | `src/popup/popup-logic.test.ts` | 100% (F2) |

### Integration Tests

None — unit tests sufficient for this project size.

### E2E Tests

Out of scope for this epic.

---

## Dependencies

### Internal

| Feature | Depends On |
|---------|-----------|
| Feature 2 (Refactor) | Feature 1 (Tests must exist first as safety net) |
| Feature 3 (CI) | Feature 2 (100% coverage must be achievable) |
| Feature 4 (Deps) | Feature 3 (Full test suite as safety net) |

### External (New)

| Package | Type | Purpose |
|---------|------|---------|
| `jest` | devDependency | Test runner |
| `ts-jest` | devDependency | TypeScript transform for Jest |
| `jest-chrome` | devDependency | Chrome API mock for Jest |
| `@types/jest` | devDependency | TypeScript types for Jest |

---

## Out of Scope

- Integration tests (headless Chrome / Puppeteer)
- E2E tests
- Performance benchmarks
- CHANGELOG update (separate release process)

---

## System Analysis

### Inferred Requirements

- `jest.config.js` must configure `testEnvironment: jsdom` for DOM files
- `tsconfig.json` may need `types: ["jest"]` added
- `package.json` needs `"test": "jest"` script

### Gaps & Assumptions

- Assumed Node LTS version for CI (exact version to be determined at implementation)
- Assumed `options-logic.ts` and `popup-logic.ts` naming — can be revised at implementation
- TypeScript 5→6 breaking changes assumed minimal; actual fixes TBD at implementation time

---

## Requirements Discovery

### Solicitation Phase

| # | Question | Answer | Source |
|---|----------|--------|--------|
| 1 | What problem does this epic solve? | No tests, outdated deps, hard to maintain safely | User |
| 2 | Integration tests with headless Chrome applicable? | No — unit tests only for this epic | User |
| 3 | Coverage goal for core files? | 100% | User |
| 4 | Coverage for options.ts / popup.ts? | Best-effort (initially), 100% after refactor | User |
| 5 | Close Dependabot PRs manually? | No — they auto-close when deps updated | User |
| 6 | CI trigger branches? | PR + push to `main` | User |
| 7 | Dependency version policy? | Latest stable only, no pre-release | User |
| 8 | Coverage thresholds in jest.config.js? | Nice to have — add in Feature 3 (CI) | User |
| 9 | Should options.ts/popup.ts be refactored for testability? | Yes — add as separate step in epic | User |
| 10 | Preferred order of epic features? | Tests → Refactor+Tests → CI → Deps | User |
| 11 | Node version in CI? | lts/* | User (implied) |

### Open Questions (BLOCKING)

None — all questions resolved.
