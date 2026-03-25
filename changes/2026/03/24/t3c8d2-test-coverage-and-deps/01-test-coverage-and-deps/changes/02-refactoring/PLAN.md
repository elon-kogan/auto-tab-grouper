---
title: "Implementation Plan: Refactoring + Improved Tests"
change: test-coverage-and-deps-2
type: feature
spec: ./SPEC.md
created: 2026-03-24
sdd_version: 7.3.0
---

# Implementation Plan: Refactoring + Improved Tests

## Overview

**Spec:** [SPEC.md](./SPEC.md)

## Affected Components

- `src/options/options.ts` — stripped to DOM-only shell
- `src/options/options-logic.ts` — new file (pure functions)
- `src/options/options-logic.test.ts` — new file
- `src/options/options.test.ts` — updated
- `src/popup/popup.ts` — stripped to DOM-only shell
- `src/popup/popup-logic.ts` — new file (pure functions)
- `src/popup/popup-logic.test.ts` — new file
- `src/popup/popup.test.ts` — updated

## Phases

### Phase 1: Extract options-logic.ts

**Outcome:** Business logic extracted from `options.ts` into `options-logic.ts`; all tests pass

**Deliverables:**
- `src/options/options-logic.ts` — pure functions: `collectGroupsFromUI` logic, `validateGroup`, `importConfig` parsing
- `src/options/options.ts` — DOM-only shell that calls logic module
- `src/options/options-logic.test.ts` — 100% coverage on logic module
- `src/options/options.test.ts` — updated to reflect new structure

**Constraint:** Every pre-existing test from Feature 1 must either (a) still pass unchanged, or (b) fail for a reason directly explainable by the refactor (e.g. function moved to logic module). No silent regressions allowed. Document any intentional test changes inline.

### Phase 2: Extract popup-logic.ts

**Outcome:** Business logic extracted from `popup.ts` into `popup-logic.ts`; all tests pass

**Deliverables:**
- `src/popup/popup-logic.ts` — pure functions: updateUI data prep, `escapeHtml`, status text logic
- `src/popup/popup.ts` — DOM-only shell
- `src/popup/popup-logic.test.ts` — 100% coverage on logic module (including `escapeHtml` XSS test)
- `src/popup/popup.test.ts` — updated to reflect new structure

**Constraint:** Same as Phase 1 — every pre-existing test must pass or fail with an explicit documented reason. Total coverage after Phase 2 must equal or exceed coverage after Feature 1.

### Phase 3: PR

**Branch:** `feat/refactor-for-tests`

**Outcome:** Changes merged to `main` via PR

**Deliverables:**
- Commit all changes on `feat/refactor-for-tests` (branched from `feat/tests` merge into `main`)
- Open PR targeting `main` via GitHub MCP
- PR title: `refactor: extract options-logic and popup-logic for 100% test coverage`
- PR must pass all checks before merge

## Tests

### Unit Tests

- [ ] `test_collectGroupsFromUI_valid`
- [ ] `test_collectGroupsFromUI_empty`
- [ ] `test_validateGroup_missing_title`
- [ ] `test_validateGroup_missing_domains`
- [ ] `test_importConfig_valid_json`
- [ ] `test_importConfig_invalid_json`
- [ ] `test_importConfig_invalid_structure`
- [ ] `test_updateUI_enabled_state`
- [ ] `test_updateUI_disabled_state`
- [ ] `test_updateUI_zero_groups`
- [ ] `test_updateUI_multiple_groups`
- [ ] `test_statusText_singular`
- [ ] `test_statusText_plural`
- [ ] `test_escapeHtml_xss_prevention`
- [ ] `test_escapeHtml_no_special_chars`

## Expected Files

### Files to Create

- `src/options/options-logic.ts`
- `src/options/options-logic.test.ts`
- `src/popup/popup-logic.ts`
- `src/popup/popup-logic.test.ts`

### Files to Modify

- `src/options/options.ts`
- `src/options/options.test.ts`
- `src/popup/popup.ts`
- `src/popup/popup.test.ts`

## Implementation State

- **Current Phase:** Phase 3: PR
- **Status:** in_progress
- **Completed Phases:**
  - [x] Phase 1: Extract options-logic.ts
  - [x] Phase 2: Extract popup-logic.ts
  - [ ] Phase 3: PR
- **Actual Files Changed:**
  - `src/options/options-logic.ts` (created)
  - `src/options/options-logic.test.ts` (created)
  - `src/options/options.ts` (modified)
  - `src/popup/popup-logic.ts` (created)
  - `src/popup/popup-logic.test.ts` (created)
  - `src/popup/popup.ts` (modified)
- **Blockers:** none

## Risks

| Risk | Mitigation |
|------|------------|
| Logic extraction changes observable behavior | Run full test suite after each extraction; any breakage must be explainable |
| `escapeHtml` accidentally removed | Explicit test for XSS prevention ensures it stays |
