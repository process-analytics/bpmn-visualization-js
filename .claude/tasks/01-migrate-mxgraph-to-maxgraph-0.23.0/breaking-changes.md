# Breaking changes: mxGraph to maxGraph 0.23.0 migration

Living log of every public API break, enriched as each task lands. Feeds the final `BREAKING CHANGE:` commit footer and the PR description.

Status legend: `[ ]` not yet implemented, `[x]` implemented and confirmed.

## Known break categories (seeded from explore.md)

- [ ] **1. `export { mxgraph }` removed** (`src/bpmn-visualization.ts:38`). The aggregated mxGraph namespace re-export disappears with no replacement (Q6). Consumers reaching into `mxgraph.*` must depend on `@maxgraph/core` directly.
- [ ] **2. `@typed-mxgraph/typed-mxgraph` dependency removed.** The runtime dependency and the triple-slash `/// <reference types="@typed-mxgraph/typed-mxgraph" />` directive (`src/bpmn-visualization.ts:21`) are gone; maxGraph ships its own bundled types. Consumers no longer install typed-mxgraph.
- [ ] **3. `BpmnGraph` base class changed** from `mxGraph` to maxGraph (`BaseGraph`). The experimental `BpmnVisualization.graph` property still exists but its API now follows maxGraph naming (e.g. `getDataModel()` instead of `getModel()`).
- [ ] **4. Theme/style customization contract changed.** Style strings / `StyleMap` are replaced by typed `CellStyle` objects. Extension points and any deep style customization now receive/return `CellStyle` (`BpmnCellStyle`) objects instead of style strings.
- [ ] **5. Public icon/canvas types renamed.** `IconPainter` / `BpmnCanvas` public types switch from `mxAbstractCanvas2D` to `AbstractCanvas2D` (and sibling maxGraph type names).
- [ ] **6. `getVersion()` output changed.** The dependencies map reports `maxGraph` (from `constants.VERSION`) instead of `mxGraph` (`src/component/version.ts`).

## Additional breaks discovered during implementation

(add entries here as tasks land: `BpmnStyleIdentifier` member removals, `bpmn.edge` style name removal if `BpmnConnector` is deleted, etc.)
