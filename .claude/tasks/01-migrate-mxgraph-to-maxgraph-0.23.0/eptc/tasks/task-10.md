# Task: Migrate navigation (fit, panning, zoom)

## Problem
maxGraph 0.21.0 moved `fit()` to a `FitPlugin` and `minFitScale`/`maxFitScale` with it; panning moved behind `getPlugin('PanningHandler')` (which can return `undefined`); `mxEvent.*` split into `InternalEvent` + `eventUtils`. `navigation.ts` calls the 7-arg `graph.fit(...)` directly and wires panning/zoom against the old API. The integration fit expectation table (scale/translate, max-scale-8 capping) must be preserved exactly.

## Proposed Solution
Replace the 7-arg `graph.fit(...)` with `getPlugin<FitPlugin>('fit')?.fit(<options object>)`, mapping border/margin/keepOrigin/ignoreWidth/ignoreHeight/maxHeight to the FitPlugin options; the integration expectation table is the acceptance criterion. Keep the own `FitType.Center` `getGraphBounds` + `scaleAndTranslate` computation (Q5) with a `TODO maxgraph@0.23.0` to later switch to `FitPlugin.fitCenter`. Move panning to `getPlugin<PanningHandler>('PanningHandler')` (handle `undefined`), convert `mxEvent.*` to `InternalEvent` + `eventUtils`, narrow the wheel event, and clean up listeners/plugin in `dispose()`. Verify zoom methods stayed on the graph; keep the jsdom guards (scale 0→1, NaN translate) if integration tests need them.

## Dependencies
- Task #3 (graph constructs with `[PanningHandler, FitPlugin]` plugins).

## Context
- `plan.md` Phase 6 (`navigation.ts`) has the detail.
- Key file: `src/component/navigation.ts` (7-arg `graph.fit()` at line 131).
- Acceptance is pinned by `test/integration/diagram.navigation.test.ts` (expectations unchanged, set by d9faaaa60).

## Success Criteria
- Fit goes through `FitPlugin`; panning/zoom through the plugin/graph APIs with `undefined` handled.
- `FitType.Center` keeps its own computation + the switch TODO.
- `dispose()` removes listeners and destroys the plugin cleanly.
- The integration fit expectation table still holds (verified in Task 13).
