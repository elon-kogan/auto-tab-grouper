---
title: Dependencies Update
type: refactor
status: draft
domain: Maintenance
issue: TBD
created: 2026-03-24
updated: 2026-03-24
sdd_version: 7.3.0
parent_epic: ../SPEC.md
change_id: test-coverage-and-deps-4
depends_on: test-coverage-and-deps-3
---

# Dependencies Update

> Parent epic spec: [SPEC.md](../SPEC.md)
> Depends on: [03-ci](../03-ci/SPEC.md)

## Overview

Update all `package.json` dependencies to latest stable versions. No alpha/beta/RC versions.

## Scope

**Command:** `npx npm-check-updates -u && npm install`

**Known potential breaking changes:**
- TypeScript 5→6: possible new strict-mode errors
- webpack-cli 5→7: config format changes
- copy-webpack-plugin 12→14: API changes
- html-webpack-plugin: check for breaking changes
- ts-loader: check compatibility with new TypeScript

**Validation:**
- `npm run build` passes
- `npm test` passes (CI will enforce 100% coverage)

**Version policy:** Latest stable only. If a package's latest stable has breaking changes that require significant refactoring, pin to latest compatible minor and document why.

## Acceptance Criteria

- [ ] **AC1:** Given updated deps, when `npm run build` runs, then extension builds without errors
- [ ] **AC2:** Given updated deps, when `npm test` runs, then all tests pass
- [ ] **AC3:** Given TypeScript upgrade, when type checking runs, then no new type errors
- [ ] **AC4:** All dependency versions are stable releases (no alpha/beta/RC/canary)
- [ ] **AC5:** Dependabot PRs for updated packages auto-close after merge
