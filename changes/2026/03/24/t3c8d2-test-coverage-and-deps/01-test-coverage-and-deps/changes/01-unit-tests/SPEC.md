---
title: Unit Tests (Initial Coverage)
type: feature
status: draft
domain: Testing
issue: TBD
created: 2026-03-24
updated: 2026-03-24
sdd_version: 7.3.0
parent_epic: ../SPEC.md
change_id: test-coverage-and-deps-1
---

# Unit Tests (Initial Coverage)

> Parent epic spec: [SPEC.md](../SPEC.md)

## Overview

Add Jest unit test suite to the project. Achieve 100% coverage for core logic files and best-effort coverage for UI files.

## Scope

**Install:**
- `jest`, `ts-jest`, `jest-chrome`, `@types/jest`

**Configure:**
- `jest.config.js` with `ts-jest`, `jsdom` environment, coverage collection
- `tsconfig.json` — add `types: ["jest"]` if needed

**Test files to create:**

| Source File | Test File | Coverage Target |
|-------------|-----------|----------------|
| `src/shared/utils.ts` | `src/shared/utils.test.ts` | 100% |
| `src/shared/config.ts` | `src/shared/config.test.ts` | 100% |
| `src/background/background.ts` | `src/background/background.test.ts` | 100% |
| `src/options/options.ts` | `src/options/options.test.ts` | best-effort |
| `src/popup/popup.ts` | `src/popup/popup.test.ts` | best-effort |

**Exclude from coverage:** `chrome.d.ts`, `types.ts`

**Add to `package.json`:** `"test": "jest"`

## Edge Cases (Must Cover)

- `extractDomain`: empty string, `chrome://`, `file://`, no protocol, international domains
- `isValidHttpUrl`: malformed, ftp://, relative paths
- `isValidDomain`: empty, spaces, special chars, valid subdomains
- `loadConfig`: storage returns null, storage throws, malformed data
- `saveConfig`: storage write failure
- `groupTabByDomain`: tab without URL, `chrome://` tab, tab already in group
- `getOrCreateGroup`: existing group match, no match (create new)
- `options.ts` / `popup.ts`: all reachable branches with jsdom + mocked Chrome API

## Acceptance Criteria

- [ ] **AC1:** Given the repo is cloned, when `npm test` is run, then all tests pass
- [ ] **AC2:** Given tests run with `--coverage`, then `utils.ts`, `config.ts`, `background.ts` show 100%
- [ ] **AC3:** Given invalid URL passed to `extractDomain`, when test runs, then handled gracefully without throw
- [ ] **AC4:** Given `chrome.storage` mocked to fail, when `loadConfig` called, then default config returned
- [ ] **AC5:** Given `saveConfig` fails, when called, then error propagates (does not silently fail)
