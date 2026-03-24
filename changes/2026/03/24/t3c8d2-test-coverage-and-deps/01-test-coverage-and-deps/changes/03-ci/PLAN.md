---
title: "Implementation Plan: CI Workflow (100% Coverage Enforcement)"
change: test-coverage-and-deps-3
type: feature
spec: ./SPEC.md
created: 2026-03-24
sdd_version: 7.3.0
---

# Implementation Plan: CI Workflow (100% Coverage Enforcement)

## Overview

**Spec:** [SPEC.md](./SPEC.md)

## Affected Components

- `.github/workflows/test.yml` — new file
- `jest.config.js` — add coverage thresholds

## Phases

### Phase 1: Add Coverage Thresholds to jest.config.js

**Outcome:** `npm test -- --coverage` fails locally if coverage drops below 100% on core files

**Deliverables:**
- `jest.config.js` updated with `coverageThreshold` for:
  - `src/shared/utils.ts`
  - `src/shared/config.ts`
  - `src/background/background.ts`
  - `src/options/options-logic.ts`
  - `src/popup/popup-logic.ts`
- `options.ts` and `popup.ts` excluded from thresholds
- `npm test -- --coverage` passes locally

### Phase 2: GitHub Actions Workflow

**Outcome:** CI runs on every PR and push to `main`

**Deliverables:**
- `.github/workflows/test.yml` with:
  - Triggers: `push` to `main`, `pull_request`
  - Steps: checkout → setup Node lts/* → `npm ci` → `npm test -- --coverage`
  - Coverage report uploaded as artifact
- CI passes on current branch

### Phase 3: PR

**Branch:** `feat/ci-coverage`

**Outcome:** Changes merged to `main` via PR

**Deliverables:**
- Commit all changes on `feat/ci-coverage`
- Open PR targeting `main` via GitHub MCP
- PR title: `feat: add CI workflow with 100% coverage enforcement`
- CI must pass on the PR itself before merge (self-validating)

## Expected Files

### Files to Create

- `.github/workflows/test.yml`

### Files to Modify

- `jest.config.js`

## Implementation State

- **Current Phase:** pending
- **Status:** pending
- **Completed Phases:**
  - [ ] Phase 1: Coverage Thresholds
  - [ ] Phase 2: GitHub Actions Workflow
  - [ ] Phase 3: PR
- **Actual Files Changed:** —
- **Blockers:** none

## Risks

| Risk | Mitigation |
|------|------------|
| CI takes > 5 min | Chrome extension has minimal deps; should be fast |
| Coverage threshold path mismatch | Test locally with `--coverage` before pushing |
