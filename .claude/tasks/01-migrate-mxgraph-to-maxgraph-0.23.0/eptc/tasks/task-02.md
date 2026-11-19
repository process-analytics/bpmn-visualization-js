# Task: Introduce style types and remove the mxGraph initializer

## Problem
maxGraph replaces mxGraph's style STRINGS with typed `CellStyle` OBJECTS, and the codebase currently funnels all mxGraph access through `initializer.ts` (a factory plus destructured re-exports plus the public `export { mxgraph }`). Both the type foundation and the central import indirection must change before any behavioral file can compile against maxGraph.

## Proposed Solution
Create the BPMN style extension types (`BpmnCellStyle`, `BpmnCellStateStyle`, `BpmnCellStyleExtension`) that carry the typed `bpmn.*` data. Delete `initializer.ts` and mechanically rewire every import across `src/`, `dev/`, `test/` to named `@maxgraph/core` imports using the rename table. Drop the typed-mxgraph triple-slash reference and the `export { mxgraph }` from the public entry. This task is foundational and mechanical: imports and type plumbing only, no per-file behavior change yet.

## Dependencies
- Task #1 (dependency installed).

## Context
- `plan.md` Phase 2 has the detail; rename table is in `explore.md` "Former POC Analysis".
- New file: `src/component/mxgraph/style/types.ts` (full JSDoc, `@since 0.48.0`, `TODO maxgraph@0.24.0` for interface augmentation). Reference: `git show poc/bump_maxgraph_0.20.0_v1:src/component/mxgraph/style/types.ts`.
- Include v2-flagged props (e.g. `linkEventSourceIds`/`linkEventTargetId`) in the extension type.
- Delete: `src/component/mxgraph/initializer.ts`.
- Edit: `src/bpmn-visualization.ts:21` (triple-slash), `src/bpmn-visualization.ts:38` (`export { mxgraph }`).
- Log in `breaking-changes.md`: `export { mxgraph }` removed without replacement (Q6).

## Success Criteria
- `types.ts` exports the three types and is re-exported from `style/index.ts`.
- No remaining import from `'.../initializer'` anywhere in the repo.
- The whole tree references `@maxgraph/core` named imports (later tasks fix the behavior those imports drive).
- Breaking-changes log updated with the `mxgraph` export removal.
