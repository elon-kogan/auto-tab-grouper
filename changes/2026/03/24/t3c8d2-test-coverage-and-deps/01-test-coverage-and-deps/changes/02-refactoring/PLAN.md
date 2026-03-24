---
title: Refactoring + Improved Tests - Implementation Plan
change: 02-refactoring
type: refactor
spec: ./SPEC.md
status: draft
created: 2026-03-24
sdd_version: 7.3.0
---

# Implementation Plan: Refactoring + Improved Tests

## Overview

**Spec:** [SPEC.md](./SPEC.md)
**Branch:** `feat/refactor-for-tests`
**Prerequisite:** `01-unit-tests` merged to main

## Phases

### Phase 1: Extract Logic
**Outcome:** `options-logic.ts` and `popup-logic.ts` created with extracted pure functions

**Deliverables:**
- `src/options/options-logic.ts`
- `src/popup/popup-logic.ts`
- `src/options/options.ts` — refactored to DOM-only shell
- `src/popup/popup.ts` — refactored to DOM-only shell

### Phase 2: Update & Improve Tests
**Outcome:** All tests pass, 100% coverage on logic modules

**Deliverables:**
- `src/options/options-logic.test.ts` — 100% coverage
- `src/popup/popup-logic.test.ts` — 100% coverage
- `src/options/options.test.ts` — updated for new structure
- `src/popup/popup.test.ts` — updated for new structure

### Phase 3: Review
**Outcome:** All tests pass, coverage >= pre-refactor baseline, PR ready

## Expected Files

**Files to Create:**
- `src/options/options-logic.ts`
- `src/popup/popup-logic.ts`
- `src/options/options-logic.test.ts`
- `src/popup/popup-logic.test.ts`

**Files to Modify:**
- `src/options/options.ts`
- `src/popup/popup.ts`
- `src/options/options.test.ts`
- `src/popup/popup.test.ts`

## Implementation State

- **Current Phase:** pending
- **Status:** pending
- **Completed Phases:** none

## Tests

### Logic Module Tests (100%)
- [ ] `parseDomainsFromText` — empty, whitespace, valid, mixed valid/invalid
- [ ] `validateGroupData` — empty title, empty domains, valid
- [ ] `collectGroupsFromCards` — empty, valid cards, invalid cards filtered
- [ ] `parseImportedConfig` — valid JSON, invalid JSON throws
- [ ] `validateImportedConfig` — valid structure, missing groups, invalid group fields
- [ ] `buildStatusText` — enabled with groups, enabled no groups, disabled
- [ ] `buildGroupsHtml` — empty groups, single, multiple, singular/plural domains
- [ ] `escapeHtml` — `<`, `>`, `&`, `"`, normal text, empty string
- [ ] `countActiveGroups` — 0 groups, groups without domains, groups with domains

## Risks

| Risk | Mitigation |
|------|------------|
| Existing tests break due to refactor | Document each breakage; all must be explainable by the structural change |
| Logic extraction misses edge cases | Run coverage before/after to confirm no regression |
