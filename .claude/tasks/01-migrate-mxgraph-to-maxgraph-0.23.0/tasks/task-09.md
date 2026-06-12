# Task: Migrate overlays

## Problem
The overlay classes extend `mxCellOverlay`/`mxText`, accept a `null` offset, use `mxConstants.ALIGN_*`, query edges via `graph.getModel().isEdge(cell)`, and use the `strokewidth` property name. maxGraph renames these and rejects a null offset.

## Proposed Solution
Make the custom overlay `extends CellOverlay` with a real `new Point()` offset, string-literal alignment values, `cell.isEdge()` for edge detection, and renamed `Point`/`Rectangle`/`CellState` types. Make the badge shape `extends TextShape` with `strokeWidth`. Update the overlay updater to `graph.getDataModel().getCell` and verify `addCellOverlay`/`removeCellOverlays` names on 0.23.0.

## Dependencies
- Task #2 (maxGraph imports); Task #4 (overlay creation extension points in `BpmnCellRenderer`).

## Context
- `plan.md` Phase 5 (`overlay/custom-overlay.ts`, `overlay/shapes.ts`, `overlay/updater.ts`) has the detail.
- Key files: `src/component/mxgraph/overlay/custom-overlay.ts`, `src/component/mxgraph/overlay/shapes.ts`, `src/component/mxgraph/overlay/updater.ts`.

## Success Criteria
- Overlay classes extend maxGraph base classes with a non-null `Point` offset.
- Edge detection uses `cell.isEdge()`; updater uses `getDataModel()`.
- Overlays compile and render against maxGraph.
