# Task: Register shapes, markers, perimeters and rework BpmnCellRenderer overlays

## Problem
maxGraph's `BaseGraph` registers no shapes, markers, or perimeters, so pools/lanes/edges render blank without explicit registration. Separately, `BpmnCellRenderer.createCellOverlays()` reimplements overlay creation using `mxDictionary`, which maxGraph removed in 0.21.0.

## Proposed Solution
Convert the registration helpers to the maxGraph registries (`ShapeRegistry.add`, `EdgeMarkerRegistry.add`, `PerimeterRegistry.add`) and add manual registration of the built-ins the styles reference: the `swimlane` shape, the `blockThin`/`openThin`/`oval`/`diamondThin` edge markers, and the `ellipse`/`rectangle`/`rhombus` perimeters. Replace the `mxDictionary`-based `createCellOverlays()` reimplementation with the `createOverlayShape`/`configureOverlayShape` extension points maxGraph introduced in 0.20.0. Keep `createShape()` (icon painter injection + `overrideCreateSvgCanvas`) and `createLabel()` with renamed types.

## Dependencies
- Task #2 (maxGraph imports).
- Pairs with Task #3 (its `registerDefaults()` calls these functions).

## Context
- `plan.md` Phase 3 (`register-style-definitions.ts`, `BpmnCellRenderer.ts`) has the detail.
- Key files: `src/component/mxgraph/config/register-style-definitions.ts`, `src/component/mxgraph/BpmnCellRenderer.ts`.
- Dash marker factory signature changes (`source` is now `boolean`, canvas types renamed).
- `BpmnCellRenderer` did not exist in v1; apply the PATTERN (proper subclass extension points), not a diff.

## Success Criteria
- Custom and built-in shapes/markers/perimeters register through the maxGraph registries.
- `BpmnCellRenderer` no longer references `mxDictionary`; overlays go through the extension points.
- Compiles together with Task 3; pools, lanes, and edges have their shapes available for rendering.
