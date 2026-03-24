---
title: "Implementation Plan: Unit Tests (Initial Coverage)"
change: test-coverage-and-deps-1
type: feature
spec: ./SPEC.md
created: 2026-03-24
sdd_version: 7.3.0
---

# Implementation Plan: Unit Tests (Initial Coverage)

## Overview

**Spec:** [SPEC.md](./SPEC.md)

## Affected Components

- `package.json` — new devDependencies, test script
- `jest.config.js` — new file
- `tsconfig.json` — may need jest types
- `src/shared/utils.test.ts` — new file
- `src/shared/config.test.ts` — new file
- `src/background/background.test.ts` — new file
- `src/options/options.test.ts` — new file
- `src/popup/popup.test.ts` — new file

## Phases

### Phase 1: Test Infrastructure Setup

**Outcome:** Jest configured and `npm test` runs (no test files yet)

**Deliverables:**
- Install `jest`, `ts-jest`, `jest-chrome`, `@types/jest`
- Create `jest.config.js` with ts-jest preset, jsdom environment, jest-chrome setup, coverage collection config
- Add `"test": "jest"` to `package.json` scripts
- Update `tsconfig.json` if needed (`types: ["jest"]`)

### Phase 2: Core Module Tests (100% coverage)

**Outcome:** `utils.ts`, `config.ts`, `background.ts` at 100% coverage

**Deliverables:**
- `src/shared/utils.test.ts` — all edge cases per SPEC.md
- `src/shared/config.test.ts` — all edge cases per SPEC.md
- `src/background/background.test.ts` — all edge cases per SPEC.md
- All tests pass, 100% coverage on these 3 files

### Phase 3: UI Module Tests (best-effort)

**Outcome:** `options.ts` and `popup.ts` have reasonable test coverage

**Deliverables:**
- `src/options/options.test.ts` — best-effort coverage
- `src/popup/popup.test.ts` — best-effort coverage
- All tests pass

### Phase 4: PR

**Branch:** `feat/tests`

**Outcome:** Changes merged to `main` via PR

**Deliverables:**
- Commit all changes on `feat/tests`
- Open PR targeting `main` via GitHub MCP
- PR title: `feat: add Jest test suite with initial coverage`
- PR must pass all checks before merge

## Tests

### Unit Tests

- [ ] `test_extractDomain_empty_string`
- [ ] `test_extractDomain_chrome_protocol`
- [ ] `test_extractDomain_file_protocol`
- [ ] `test_extractDomain_no_protocol`
- [ ] `test_extractDomain_international_domain`
- [ ] `test_isValidHttpUrl_malformed`
- [ ] `test_isValidHttpUrl_ftp`
- [ ] `test_isValidHttpUrl_relative_path`
- [ ] `test_isValidDomain_empty`
- [ ] `test_isValidDomain_spaces`
- [ ] `test_isValidDomain_special_chars`
- [ ] `test_isValidDomain_valid_subdomain`
- [ ] `test_loadConfig_storage_null`
- [ ] `test_loadConfig_storage_throws`
- [ ] `test_loadConfig_malformed_data`
- [ ] `test_saveConfig_write_failure`
- [ ] `test_groupTabByDomain_no_url`
- [ ] `test_groupTabByDomain_chrome_url`
- [ ] `test_groupTabByDomain_already_grouped`
- [ ] `test_getOrCreateGroup_existing_match`
- [ ] `test_getOrCreateGroup_no_match_creates_new`
- [ ] `test_getOrCreateGroup_color_assignment`

## Expected Files

### Files to Create

- `jest.config.js`
- `src/shared/utils.test.ts`
- `src/shared/config.test.ts`
- `src/background/background.test.ts`
- `src/options/options.test.ts`
- `src/popup/popup.test.ts`

### Files to Modify

- `package.json` (add devDependencies + test script)
- `tsconfig.json` (add jest types if needed)

## Implementation State

- **Current Phase:** Phase 4: PR
- **Status:** complete
- **Completed Phases:**
  - [x] Phase 1: Test Infrastructure Setup
  - [x] Phase 2: Core Module Tests
  - [x] Phase 3: UI Module Tests
  - [ ] Phase 4: PR
- **Actual Files Changed:**
  - `package.json` — added `test` script, devDependencies: jest, ts-jest, jest-chrome, @types/jest, jest-environment-jsdom
  - `tsconfig.json` — added `jest` to types
  - `jest.config.js` — new file
  - `jest.setup.js` — new file (global chrome mock + manual mocks for tabGroups/action/tabs.group)
  - `__mocks__/styleMock.js` — new file (CSS mock)
  - `src/shared/utils.test.ts` — new file (100% coverage)
  - `src/shared/config.test.ts` — new file (100% coverage)
  - `src/background/background.test.ts` — new file (100% coverage)
  - `src/options/options.test.ts` — new file (best-effort coverage)
  - `src/popup/popup.test.ts` — new file (best-effort coverage)
- **Blockers:** none

## Risks

| Risk | Mitigation |
|------|------------|
| `jest-chrome` mock doesn't cover all Chrome APIs used | Use `chrome.runtime.sendMessage` mock patterns; add manual mocks if needed |
| `jsdom` missing browser globals | Add polyfills or mock via `setupFiles` |
