# Task: Adopt BaseGraph in BpmnGraph and GraphConfigurator

## Problem
`BpmnGraph` extends mxGraph and relies on a module-level `pendingIconPainter` workaround plus `createGraphView`/`createCellRenderer` overrides and a custom `batchUpdate()`. maxGraph's `BaseGraph` registers nothing by default and takes dependencies through a constructor options object, so the graph core wiring must be rebuilt.

## Proposed Solution
Make `BpmnGraph extends BaseGraph`, passing `container`, a `view` factory (`BpmnGraphView`), the `cellRenderer` instance, and `plugins: [PanningHandler, FitPlugin]` through the constructor options. Remove the `pendingIconPainter` workaround, the factory-method overrides, and the custom `batchUpdate()` (built in now). Override `registerDefaults()` to register custom shapes/markers/perimeters AND the needed built-ins. Update `GraphConfigurator` to build the icon painter + cell renderer and hand them to the constructor, and to set `foldingEnabled` via `graph.options`.

## Dependencies
- Task #2 (style types + maxGraph imports in place).
- Task #4 provides the registration functions `registerDefaults()` calls; build them together or stub the calls until Task 4 lands.

## Context
- `plan.md` Phase 3 (`BpmnGraph.ts`, `GraphConfigurator.ts`) has the detail.
- Key files: `src/component/mxgraph/BpmnGraph.ts` (file comment at lines 46-48 already announces the constructor-injection switch), `src/component/mxgraph/GraphConfigurator.ts`.
- Pattern: maxGraph `ts-example-selected-features` (BaseGraph + manual registration).
- Keep the `getFloatingTerminalPoint` override on `BpmnGraphView`.

## Success Criteria
- `BpmnGraph` constructs via options object, no `pendingIconPainter`, no custom `batchUpdate`.
- `GraphConfigurator` builds and injects the cell renderer; `foldingEnabled` set on `graph.options`.
- Compiles together with Task 4.
