---
title: "Implementation Plan: Dependencies Update"
change: test-coverage-and-deps-4
type: feature
spec: ./SPEC.md
created: 2026-03-24
sdd_version: 7.3.0
---

# Implementation Plan: Dependencies Update

## Overview

**Spec:** [SPEC.md](./SPEC.md)

## Affected Components

- `package.json` — updated dependency versions
- `package-lock.json` — regenerated
- Various source/config files — breaking change fixes

## Phases

### Phase 1: Update Dependencies

**Outcome:** All dependencies updated to latest stable in `package.json`

**Deliverables:**
- Run `npx npm-check-updates -u`
- Review output — confirm no pre-release versions
- Run `npm install`
- `package.json` and `package-lock.json` updated

### Phase 2: Fix Breaking Changes — Build

**Outcome:** `npm run build` passes

**Deliverables:**
- Fix any TypeScript strict/new errors
- Fix any webpack/webpack-cli config API changes
- Fix any copy-webpack-plugin config changes
- `npm run build` passes cleanly

### Phase 3: Fix Breaking Changes — Tests

**Outcome:** `npm test` passes

**Deliverables:**
- Fix any ts-jest config format changes
- Fix any jest API changes
- Fix any `@types/jest` incompatibilities
- `npm test -- --coverage` passes with 100% on all thresholded files

### Phase 4: PR

**Branch:** `chore/deps-update`

**Outcome:** Changes merged to `main` via PR

**Deliverables:**
- Commit all changes on `chore/deps-update`
- Open PR targeting `main` via GitHub MCP
- PR title: `chore: update all dependencies to latest stable`
- CI must pass before merge

## Expected Files

### Files to Modify

- `package.json`
- `package-lock.json`
- `jest.config.js` (if ts-jest config format changed)
- `webpack.config.js` (if webpack-cli API changed)
- `tsconfig.json` (if TypeScript version requires changes)
- Source files (if new TypeScript strict errors)

## Implementation State

- **Current Phase:** pending
- **Status:** pending
- **Completed Phases:**
  - [ ] Phase 1: Update Dependencies
  - [ ] Phase 2: Fix Breaking Changes — Build
  - [ ] Phase 3: Fix Breaking Changes — Tests
  - [ ] Phase 4: PR
- **Actual Files Changed:** —
- **Blockers:** none

## Risks

| Risk | Mitigation |
|------|------------|
| TypeScript major version breaking changes | Fix type errors one by one; no functional changes needed |
| `jest-chrome` incompatible with new jest | Check `jest-chrome` release notes; may need config adjustment |
| Multiple breaking changes compound | Fix build first, then tests; rollback individual packages if needed |
