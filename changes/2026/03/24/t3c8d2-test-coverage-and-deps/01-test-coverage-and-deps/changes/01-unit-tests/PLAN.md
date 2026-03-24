---
title: Unit Tests (Initial Coverage) - Implementation Plan
change: 01-unit-tests
type: feature
spec: ./SPEC.md
status: draft
created: 2026-03-24
sdd_version: 7.3.0
---

# Implementation Plan: Unit Tests (Initial Coverage)

## Overview

**Spec:** [SPEC.md](./SPEC.md)
**Branch:** `feat/tests`

## Phases

### Phase 1: Setup
**Outcome:** Jest configured, `npm test` runs (zero tests passing)

**Deliverables:**
- `package.json`: add `jest`, `ts-jest`, `jest-chrome`, `@types/jest` to devDependencies, add `"test": "jest"` script
- `jest.config.js`: ts-jest transform, jsdom environment, coverage config, exclude `*.d.ts` and `types.ts`
- `tsconfig.json`: add `"jest"` to types if needed

### Phase 2: Core Logic Tests
**Outcome:** 100% coverage on `utils.ts`, `config.ts`, `background.ts`

**Deliverables:**
- `src/shared/utils.test.ts` — all functions, all edge cases
- `src/shared/config.test.ts` — mocked `chrome.storage.sync`, all branches
- `src/background/background.test.ts` — mocked `chrome.tabs` + `chrome.tabGroups`

### Phase 3: UI File Tests (Best-Effort)
**Outcome:** Maximum achievable coverage for `options.ts` and `popup.ts`

**Deliverables:**
- `src/options/options.test.ts` — jsdom fixture, mocked Chrome API, all reachable branches
- `src/popup/popup.test.ts` — jsdom fixture, mocked Chrome API, all reachable branches

### Phase 4: Review
**Outcome:** All tests pass, coverage targets met, PR ready

## Expected Files

**Files to Create:**
- `jest.config.js`
- `src/shared/utils.test.ts`
- `src/shared/config.test.ts`
- `src/background/background.test.ts`
- `src/options/options.test.ts`
- `src/popup/popup.test.ts`

**Files to Modify:**
- `package.json` (add deps + script)
- `tsconfig.json` (possibly add jest types)

## Implementation State

- **Current Phase:** pending
- **Status:** pending
- **Completed Phases:** none
- **Actual Files Changed:** TBD
- **Blockers:** none

## Tests

### Unit Tests
- [ ] `extractDomain` — valid URL, empty string, chrome://, file://, no protocol
- [ ] `isValidHttpUrl` — valid http/https, ftp, malformed, relative
- [ ] `isValidDomain` — valid, empty, spaces, special chars, subdomains
- [ ] `loadConfig` — success, storage null, storage throws, malformed JSON
- [ ] `saveConfig` — success, storage write failure
- [ ] `initializeConfig` — first run, already initialized
- [ ] `groupTabByDomain` — normal tab, no URL tab, chrome:// tab, already grouped
- [ ] `getOrCreateGroup` — existing match, no match, color assignment
- [ ] `updateUI` (popup) — enabled, disabled, 0 groups, multiple groups
- [ ] `escapeHtml` — XSS chars, normal text
- [ ] `handleToggleChange` — enabled, disabled, no config
- [ ] `renderGroups` — empty, with groups, missing container
- [ ] `saveConfiguration` — valid, invalid groups, save failure
- [ ] `exportConfig` — normal, no config
- [ ] `importConfig` — valid JSON, invalid JSON, invalid structure

## Risks

| Risk | Mitigation |
|------|------------|
| `jest-chrome` doesn't cover all needed Chrome API methods | Supplement with manual mocks in jest setup file |
| jsdom missing browser APIs (`URL.createObjectURL`) | Mock in jest setup globals |
