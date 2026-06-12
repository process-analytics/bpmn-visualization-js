# Tasks: Migrate from mxGraph to maxGraph 0.23.0

**Note**: explore done with Claude Opus 4.8 on 2026-06-12

## Overview
Big-bang migration on branch `poc/claude/bump_maxgraph_0.23.0_bpmn-visu_0.48.0`, executed area by area in dependency order, reapplying the proven `poc/bump_maxgraph_0.20.0_v1` PATTERNS onto the current architecture (never cherry-picking old diffs). Full detail per file lives in `../plan.md`; the exploration and decisions in `../explore.md`.

Global rules for every task: keep inherited `TODO maxgraph@<version>` comments verbatim; tag new uncertainties `TODO maxgraph@0.23.0`; update JSDoc mentioning mxGraph (user docs out of scope); `@since 0.48.0` on new public API; record every public API break in `../breaking-changes.md` as it happens.

Definition of done: `npm run build`, `npm run test:unit`, `npm run test:integration` all green; e2e visual diffs acceptable but inventoried for review.

## Task List

- [x] **Task 1**: Swap dependency and build config to maxGraph - `task-01.md`
- [ ] **Task 2**: Introduce style types and remove the mxGraph initializer - `task-02.md` (depends on 1)
- [ ] **Task 3**: Adopt BaseGraph in BpmnGraph and GraphConfigurator - `task-03.md` (depends on 2; pairs with 4)
- [ ] **Task 4**: Register shapes/markers/perimeters and rework BpmnCellRenderer overlays - `task-04.md` (depends on 2; pairs with 3)
- [ ] **Task 5**: Migrate StyleComputer and the read/compute style side - `task-05.md` (depends on 2)
- [ ] **Task 6**: Migrate StyleConfigurator, identifiers and style/utils - `task-06.md` (depends on 2, 5)
- [ ] **Task 7**: Migrate runtime style/CSS updaters and the SVG canvas override - `task-07.md` (depends on 2, 6)
- [ ] **Task 8**: Migrate shapes and icons, run the BpmnConnector experiment - `task-08.md` (depends on 4, 6, 7)
- [ ] **Task 9**: Migrate overlays - `task-09.md` (depends on 2, 4)
- [ ] **Task 10**: Migrate navigation (fit, panning, zoom) - `task-10.md` (depends on 3)
- [ ] **Task 11**: Migrate renderer, coordinates, facade, version, dev demo - `task-11.md` (depends on 3, 5, 6) - FIRST full-green `npm run build`
- [ ] **Task 12**: Migrate unit tests to typed style objects - `task-12.md` (depends on 5, 6, 7, 8, 11)
- [ ] **Task 13**: Migrate integration tests and the custom matchers - `task-13.md` (depends on 12 + all production tasks)
- [ ] **Task 14**: Disable e2e on CI, revert arcSize, inventory snapshots, consolidate breaking changes - `task-14.md` (depends on 12, 13)

## Execution Order
Tasks are numbered in dependency order; running them in sequence is always safe. Parallelism opportunities once their shared prerequisite is met:

1. **Task 1** first (unblocks everything).
2. **Task 2** next (the style types + import rewiring foundation).
3. After Task 2: **Tasks 3+4** (graph core, build/compile together), **Task 5** (style compute side), and **Task 9** (overlays, after 4) can progress in parallel streams.
4. **Task 6** after 5, then **Task 7** after 6; **Task 8** after 4+6+7.
5. **Task 10** after 3; **Task 11** after 3+5+6 and closes with the first full-green `npm run build`.
6. **Task 12** (unit) after the production tasks; **Task 13** (integration) after 12; **Task 14** (CI/arcSize/inventory) last.

## Checkpoints
- `npm run build` after each phase once Task 2 is done (first full-green at Task 11).
- `npm run test:unit` at Task 12; `npm run test:integration` at Task 13.
- `npm run lint` during Task 14.
- Suggested commits: roughly one per task; dedicated revertable commits for the Task 8 BpmnConnector experiment and the Task 14 arcSize revert.
