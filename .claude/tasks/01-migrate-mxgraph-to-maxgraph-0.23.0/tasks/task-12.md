# Task: Migrate unit tests to typed style objects

## Problem
Unit tests assert mxGraph style STRINGS and use `mx*` mock types. With the production code now emitting typed `CellStyle` objects, every style-string expectation and mock type is wrong. `StyleComputer.test.ts` is the biggest churn.

## Proposed Solution
Rewrite the affected unit tests so style expectations use `toStrictEqual` against `BpmnCellStyle` objects (`baseStyleNames`, typed `bpmn.*`, booleans/enums/arrays instead of encoded strings). Update inputs that were raw style strings to style objects, swap mock types (`AbstractCanvas2D`), express arc flags as booleans, expect typed properties from the BPMN-in-Color extension, and assert `dependencies.get('maxGraph')` in the version test.

## Dependencies
- Tasks #5, #6, #7, #8, #11 (production behavior these tests assert).
- `npm run build` must be green (Task 11) before starting.

## Context
- `plan.md` Phase 6b lists the files: `StyleComputer.test.ts`, `style-utils.test.ts`, `style/utils.test.ts`, `shape/render/BpmnCanvas.test.ts`, `extension/bpmn-in-color/style-extension.test.ts`, `version.test.ts`.
- v1 reference exists for `StyleComputer.test.ts` (+343/-79) but must be adapted to master's extension-hook tests.

## Success Criteria
- `npm run test:unit` is fully green (definition of done).
- No remaining style-string expectations or `mx*` mock types in unit tests.
