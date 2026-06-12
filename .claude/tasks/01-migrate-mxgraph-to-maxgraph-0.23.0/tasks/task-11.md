# Task: Migrate renderer, coordinates, facade, version and dev demo

## Problem
The remaining production and dev files still call mxGraph APIs: `BpmnRenderer` uses positional `insertVertex`/`insertEdge` and `getModel()`; `CoordinatesTranslator` uses `mxPoint` and model-based geometry access; the facade and `version.ts` reference mxGraph; the dev demo (`SvgExporter`, `ThemedBpmnVisualization`, custom icon painter, main) use mxGraph utility namespaces.

## Proposed Solution
Switch `BpmnRenderer` insert calls to single-options-object signatures consuming the `BpmnCellStyle` objects from StyleComputer, rename `mxPoint`→`Point`, and use `getDataModel()`. In `CoordinatesTranslator` rename `Point` and use `cell.getGeometry()`/`cell.getParent()`. In `BpmnVisualization` keep `graph.destroy()` and update the experimental `graph` property JSDoc to maxGraph. In `version.ts` emit `'maxGraph'` with `constants.VERSION` (log the `getVersion()` output change in breaking-changes). Migrate the dev demo files (`ImageExport`, `xmlUtils`/`domUtils`/`stringUtils`, `constants.NS_SVG`, `SvgCanvas2D`, `Client.IS_FF`) and update registry JSDoc wording.

## Dependencies
- Task #5/#6 (StyleComputer emits typed styles consumed here); Task #3 (graph core).

## Context
- `plan.md` Phase 6 (`BpmnRenderer.ts`, `CoordinatesTranslator.ts`, `BpmnVisualization.ts`, `version.ts`, `registry/*`, `dev/ts/component/*`, `dev/ts/main.ts`) has the detail.
- v1 references exist for `SvgExporter.ts` and `ThemedBpmnVisualization.ts`.
- `registry/query-selectors.ts` + `types.ts`: JSDoc-only (DOM selectors unchanged; validated by integration/e2e).

## Success Criteria
- `BpmnRenderer` inserts via options objects with typed styles; uses `getDataModel()`.
- `version.ts` reports `maxGraph` + `constants.VERSION`; logged in breaking-changes.
- Dev demo files compile against maxGraph.
- `npm run build` is GREEN across the whole tree (first full-green checkpoint).
