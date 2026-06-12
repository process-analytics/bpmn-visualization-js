# Task: Migrate runtime style/CSS updaters and the SVG canvas override

## Problem
The runtime updaters cache style strings and mutate them in place. maxGraph caches `CellStyle` objects, and (maxGraph#326) `model.setStyle` no-ops when handed the cell's own style instance, which was the root cause of "CSS classes disappear on navigation" in v1. The `overrideCreateSvgCanvas` patch also reads CSS classes from a style string.

## Proposed Solution
Make `StyleManager` cache `CellStyle` CLONES. Every mutation must operate on `cell.getClonedStyle()` before `model.setStyle(cell, clone)`, with an explanatory comment linking maxGraph#326. `resetStyle` restores the cached clone while preserving `style.bpmn.extraCssClasses`. The CSS classes updater writes `extraCssClasses` as a real `string[]` (delete when empty) on a cloned style. Update `overrideCreateSvgCanvas` to read extra CSS classes from the typed style and to rename canvas/dialect types; `canvas.format` takes a number. Replace `graph.getModel()` with `graph.getDataModel()`.

## Dependencies
- Task #2 (style types); Task #6 (typed style helpers).

## Context
- `plan.md` Phase 4 (`style-updater.ts`, `css-classes-updater.ts`, `shape/utils.ts`) has the detail.
- Key files: `src/component/mxgraph/style/style-updater.ts`, `src/component/mxgraph/style/css-classes-updater.ts`, `src/component/mxgraph/shape/utils.ts`.
- These files post-date v1; apply the clone-before-mutate PATTERN, not a diff.

## Success Criteria
- Updaters cache and mutate cloned `CellStyle` objects; `setStyle` always receives a clone.
- maxGraph#326 comment present at the mutation site.
- `resetStyle` preserves `extraCssClasses`; the updater writes a real `string[]`.
- `overrideCreateSvgCanvas` keeps the pointer-events #920 patch and the class + `data-bpmn-id` bridge.
