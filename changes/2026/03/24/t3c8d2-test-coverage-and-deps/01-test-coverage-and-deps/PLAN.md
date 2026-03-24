---
title: Test Coverage and Dependencies Update - Implementation Plan
change: test-coverage-and-deps
type: epic
spec: ./SPEC.md
status: draft
created: 2026-03-24
sdd_version: 7.3.0
---

# Implementation Plan: Test Coverage and Dependencies Update

## Overview

Implementation plan for epic: Test Coverage and Dependencies Update

Specification: [SPEC.md](./SPEC.md)

## Change Order

Implement child changes in this order:

| # | Change | Description | Dependencies | Branch | Status |
|---|--------|-------------|--------------|--------|--------|
| 1 | [01-unit-tests](changes/01-unit-tests/SPEC.md) | Jest unit tests for all source files | None | `feat/tests` | pending |
| 2 | [02-refactoring](changes/02-refactoring/SPEC.md) | Extract logic from options/popup, improve tests to 100% | 01-unit-tests | `feat/refactor-for-tests` | pending |
| 3 | [03-ci](changes/03-ci/SPEC.md) | GitHub Actions with 100% coverage enforcement | 02-refactoring | `feat/ci-coverage` | pending |
| 4 | [04-deps-update](changes/04-deps-update/SPEC.md) | Update all deps to latest stable | 03-ci | `chore/deps-update` | pending |

## Dependency Graph

```
01-unit-tests
      ↓
02-refactoring (requires: 01-unit-tests — tests must exist before refactoring)
      ↓
03-ci (requires: 02-refactoring — 100% coverage must be achievable)
      ↓
04-deps-update (requires: 03-ci — full test suite as safety net)
```

## PR Strategy

One PR per child change. Branch naming: `feat/<change-name>` or `chore/<change-name>`

Each PR merges to `main` before the next child change begins.

## Progress Tracking

- [ ] 01-unit-tests: Unit Tests (Initial Coverage)
- [ ] 02-refactoring: Refactoring + Improved Tests
- [ ] 03-ci: CI Workflow (100% Coverage Enforcement)
- [ ] 04-deps-update: Dependencies Update

## Resource Usage

| Change | Tokens (Input) | Tokens (Output) | Turns | Duration | Notes |
|--------|----------------|-----------------|-------|----------|-------|
| 01-unit-tests | - | - | - | - | |
| 02-refactoring | - | - | - | - | |
| 03-ci | - | - | - | - | |
| 04-deps-update | - | - | - | - | |
| **Total** | **-** | **-** | **-** | **-** | |
