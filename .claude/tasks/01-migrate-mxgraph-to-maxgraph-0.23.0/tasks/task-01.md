# Task: Swap dependency and build config to maxGraph

## Problem
The project depends on `mxgraph` + `@typed-mxgraph/typed-mxgraph` and its build config (chunking, size limits) is tuned for the mxgraph bundle. maxGraph ships its own types and a differently sized bundle, so the dependency and build configuration must move first to unblock everything else.

## Proposed Solution
Replace the mxGraph dependencies with `@maxgraph/core` pinned to exact `0.23.0`, regenerate the lockfile, and retune the Vite chunk rule / size warning for the maxGraph bundle. Verify the Rollup config still externalizes deps correctly. Create the `breaking-changes.md` log that every later task will enrich.

## Dependencies
- None (first task).

## Context
- `plan.md` Phase 1 has the file-by-file detail.
- Key files: `package.json`, `vite.config.js:50` (`manualChunks`), `vite.config.js:57` (`chunkSizeWarningLimit`), `rollup.config.mjs`.
- Create `.claude/tasks/01-migrate-mxgraph-to-maxgraph-0.23.0/breaking-changes.md` seeded with the 6 known break categories from `explore.md` "Public API breakage surface".
- maxGraph chunk was ~330 KB in the v1 POC; set the real value at first successful build.

## Success Criteria
- `npm install` succeeds; lockfile references `@maxgraph/core@0.23.0` only, no mxgraph.
- Vite chunk rule targets `node_modules/@maxgraph/core` with chunk name `lib-maxgraph`.
- `breaking-changes.md` exists with the seeded checklist.
- Note: `npm run build` will NOT pass yet (imports still reference mxgraph); that is expected until Task 2.
