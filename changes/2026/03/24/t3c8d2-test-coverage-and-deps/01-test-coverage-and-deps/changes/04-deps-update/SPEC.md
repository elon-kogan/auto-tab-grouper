---
title: "Dependencies Update"
change_id: test-coverage-and-deps-4
type: feature
workflow_id: t3c8d2
parent: test-coverage-and-deps-epic
spec: ./SPEC.md
status: approved
created: 2026-03-24
sdd_version: 7.3.0
---

# Dependencies Update

## Overview

Update all dependencies to latest stable versions. Validate that build and tests pass after update.

## Background

After Features 1-3, the codebase has a full test suite and CI. This provides a safe net for updating dependencies.

## Scope

- Run `npx npm-check-updates -u && npm install`
- Fix any breaking changes (TypeScript, webpack-cli, copy-webpack-plugin, etc.)
- No alpha/beta/RC versions — latest stable only
- Validate: `npm run build` passes
- Validate: `npm test` passes

## Procedure

1. Run `npx npm-check-updates -u` to see what will be updated
2. Run `npm install` to apply updates
3. Run `npm run build` — fix any TypeScript or webpack breaking changes
4. Run `npm test` — fix any test failures from API changes
5. Commit

## Breaking Change Areas

Known potentially breaking packages for a Chrome extension TypeScript project:

| Package | Risk |
|---------|------|
| TypeScript 5→latest | Stricter type checks, new strict flags |
| webpack-cli | Config API changes |
| copy-webpack-plugin | Config API changes |
| ts-jest | Config format changes |

## Acceptance Criteria

- **Given** updated deps, **when** `npm run build` runs, **then** extension builds without errors
- **Given** updated deps, **when** `npm test` runs, **then** all tests pass
- **Given** TypeScript is upgraded, **when** type checking runs, **then** no new type errors

## Non-Functional Requirements

- No pre-release (alpha/beta/RC) dependency versions
- Dependabot PRs will auto-close after this merges

## Dependencies

- Depends on: Feature 3 (full test suite + CI as safety net)
