# Task: Migrate integration tests and the custom matchers

## Problem
Integration tests import from the deleted `initializer`, build `mxPoint`, assert style strings, and rely on a test-side `BpmnCellStyle` helper that now clashes with the production type. The custom matchers compare raw/resolved/view-state styles as strings. The fit navigation expectations must stay unchanged as the acceptance criterion.

## Proposed Solution
Repoint imports to `@maxgraph/core` (`Geometry`, `Point`, value types), rename the test-side helper to `ComparedBpmnCellStyle`, and rewrite the matchers (`matcher-utils`, `toBeCell`/`toBeShape`/`toBeEdge`) to compare `CellStyle` objects structurally with maxGraph value types (`AlignValue`, `ShapeValue`, arrow values) and boolean `horizontal`, reading `extraCssClasses`/`markers`/`isInitiating` from `rawStyle.bpmn.*`. Update `mxgraph-config.ts` (`Client.NO_FO`, optional rename to `maxgraph-config.ts` + jest setup path), `model-expect.ts` (`cell.filterDescendants`, pool detection via typed `bpmn.kind`), and the model/colors/css/style test bodies. Keep `diagram.navigation.test.ts` expectations UNCHANGED (adapt only mock types/plugin plumbing). Update the typescript-support package to the `@maxgraph/core` `Stylesheet` type.

## Dependencies
- Task #12 (unit green) and all production tasks; `npm run build` green.

## Context
- `plan.md` Phase 7 lists the files (`mxgraph-config.ts`, `model-expect.ts`, matchers, `mxGraph.model.*` tests, `diagram.navigation.test.ts`, `BpmnVisualization.test.ts`, `typescript-support`, perf/bundles greps).
- Renaming `mxGraph.model.*` test files is allowed but NOT required; defer, low priority.

## Success Criteria
- `npm run test:integration` is fully green (definition of done).
- Fit navigation expectation table unchanged and passing.
- typescript-support compiles against the published maxGraph `.d.ts`.
