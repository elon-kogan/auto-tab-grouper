---
title: Refactoring + Improved Tests
type: refactor
status: draft
domain: Testing
issue: TBD
created: 2026-03-24
updated: 2026-03-24
sdd_version: 7.3.0
parent_epic: ../SPEC.md
change_id: test-coverage-and-deps-2
depends_on: test-coverage-and-deps-1
---

# Refactoring + Improved Tests

> Parent epic spec: [SPEC.md](../SPEC.md)
> Depends on: [01-unit-tests](../01-unit-tests/SPEC.md)

## Overview

Extract business logic from `options.ts` and `popup.ts` into pure, testable modules. Update tests to achieve 100% coverage on all files.

## Scope

**New files:**
- `src/options/options-logic.ts` — pure functions extracted from `options.ts`
- `src/popup/popup-logic.ts` — pure functions extracted from `popup.ts`

**Modified files:**
- `src/options/options.ts` — thin DOM shell, imports from `options-logic.ts`
- `src/popup/popup.ts` — thin DOM shell, imports from `popup-logic.ts`
- `src/options/options.test.ts` — updated for refactored structure
- `src/popup/popup.test.ts` — updated for refactored structure

**New test files:**
- `src/options/options-logic.test.ts` — 100% coverage, no DOM needed
- `src/popup/popup-logic.test.ts` — 100% coverage, no DOM needed

## Extracted Logic

**`options-logic.ts`** (pure functions, no DOM):
- `parseDomainsFromText(text: string): string[]`
- `validateGroupData(title: string, domains: string[]): boolean`
- `collectGroupsFromCards(cards: CardData[]): TabGroupConfig[]`
- `parseImportedConfig(json: string): Config` (throws on invalid)
- `validateImportedConfig(config: unknown): Config` (type guard + validation)

**`popup-logic.ts`** (pure functions, no DOM):
- `buildStatusText(config: Config): { text: string; className: string }`
- `buildGroupsHtml(groups: TabGroupConfig[]): string`
- `escapeHtml(text: string): string`
- `countActiveGroups(groups: TabGroupConfig[]): number`

## Mandatory Checks

- `npm test` must pass at end of this change
- All test breakages must be explainable by the refactor (no silent regressions)
- Total coverage must be equal or higher after refactor

## Acceptance Criteria

- [ ] **AC1:** Given refactored code, when `npm test` runs, then all tests pass
- [ ] **AC2:** Given `options-logic.test.ts` runs, then 100% coverage on `options-logic.ts`
- [ ] **AC3:** Given `popup-logic.test.ts` runs, then 100% coverage on `popup-logic.ts`
- [ ] **AC4:** Given overall coverage report, then total coverage >= pre-refactor baseline
- [ ] **AC5:** Given `options.ts` and `popup.ts`, then they contain no business logic (only DOM calls + imports)
- [ ] **AC6:** Given `escapeHtml` is tested, then XSS prevention confirmed (special chars escaped correctly)
