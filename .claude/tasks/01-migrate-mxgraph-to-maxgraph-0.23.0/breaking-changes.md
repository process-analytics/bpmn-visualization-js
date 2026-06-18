# Breaking changes: mxGraph to maxGraph 0.23.0 migration

Living log of every public API break, enriched as each task lands. Feeds the final `BREAKING CHANGE:` commit footer and the PR description.

Status legend: `[ ]` not yet implemented, `[x]` implemented and confirmed.

## Known break categories (seeded from explore.md)

- [x] **1. `export { mxgraph }` removed** (formerly `src/bpmn-visualization.ts:38`). The aggregated mxGraph namespace re-export disappears with no replacement (Q6). Consumers reaching into `mxgraph.*` must depend on `@maxgraph/core` directly. `src/component/mxgraph/initializer.ts` (which produced it) is deleted.
- [x] **2. `@typed-mxgraph/typed-mxgraph` dependency removed.** The runtime dependency and the triple-slash `/// <reference types="@typed-mxgraph/typed-mxgraph" />` directive (formerly `src/bpmn-visualization.ts:21`) are gone; maxGraph ships its own bundled types. Consumers no longer install typed-mxgraph.
- [ ] **3. `BpmnGraph` base class changed** from `mxGraph` to maxGraph (`BaseGraph`). The experimental `BpmnVisualization.graph` property still exists but its API now follows maxGraph naming (e.g. `getDataModel()` instead of `getModel()`).
- [ ] **4. Theme/style customization contract changed.** Style strings / `StyleMap` are replaced by typed `CellStyle` objects. Extension points and any deep style customization now receive/return `CellStyle` (`BpmnCellStyle`) objects instead of style strings.
- [x] **5. Public icon/canvas types renamed.** `IconPainter` / `BpmnCanvas` public types switch from `mxAbstractCanvas2D` to `AbstractCanvas2D` (and sibling maxGraph type names). See also the `BpmnCanvas.arcTo` boolean-flags change below.
- [x] **6. `getVersion()` output changed.** The dependencies map reports `maxGraph` (from `constants.VERSION`) instead of `mxGraph` (`src/component/version.ts`). Code reading `getVersion().dependencies.get('mxGraph')` must switch to `get('maxGraph')`.

## Additional breaks discovered during implementation

- [x] **`load()` throws on non-numeric coordinates.** maxGraph's `Point` setter rejects `NaN` (`Invalid x supplied.`), in both 0.20.0 and 0.23.0. mxGraph silently stored `NaN` and rendered a broken/invisible shape while still loading the rest of the diagram; with maxGraph a single malformed coordinate aborts the whole diagram load. The parser still produces `NaN` for non-numeric numeric attributes (unchanged, intended). Mirrors the 0.20.0 POC decision. Follow-up (out of scope, TODO in the integration test): validate coordinates during parsing (e.g. `mathUtils.isNumber`) or rethrow with a friendly message so only the bad shape degrades.


- [x] **`BpmnStyleIdentifier` members removed** (public `@experimental` API, `src/component/mxgraph/style/identifiers.ts`). The former `bpmn.*` style-string data keys are replaced by typed properties on the maxGraph `CellStyle` (under its `bpmn` property, see `BpmnCellStyle`). Removed members: `EDGE_START_FILL_COLOR`, `EDGE_END_FILL_COLOR` (now the native maxGraph `startFillColor`/`endFillColor` style properties), `EVENT_BASED_GATEWAY_KIND`, `EVENT_DEFINITION_KIND`, `GLOBAL_TASK_KIND`, `SUB_PROCESS_KIND`, `IS_INITIATING`, `IS_INSTANTIATING`, `IS_INTERRUPTING`, `EXTRA_CSS_CLASSES`, `MARKERS`. Only `EDGE` and `MESSAGE_FLOW_ICON` (registered shape names) remain.
- **`bpmn.edge` style name** (`BpmnStyleIdentifier.EDGE`): KEPT (Q4 resolved). A minimal `BpmnConnector` survives, only to restrict click capture to the edge stroke; the marker fill colors are now applied natively by maxGraph. No break here.
- [x] **Public icon/canvas render types signatures changed** (`@experimental` `BpmnCanvas`, `IconPainter`, `PaintParameter`, ...). The canvas type is now maxGraph `AbstractCanvas2D` (was `mxAbstractCanvas2D`), and `BpmnCanvas.arcTo(rx, ry, angle, largeArcFlag, sweepFlag, x, y)` takes `boolean` flags instead of `0 | 1` numbers.
- [x] **Theme customization helpers operate on `CellStyle` objects** (public `@experimental` `StyleConfigurator`, `StyleDefault`). The stylesheet entries and the runtime style-update helpers now read/write typed `CellStyle` objects instead of mxGraph style strings.
