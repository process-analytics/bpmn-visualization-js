# Implementation Plan: Migrate from mxGraph to maxGraph 0.23.0

**Note**: plan created with Claude Fable 5 on 2026-06-12

## Overview

Big-bang migration on this branch, executed area by area in dependency order, reapplying the proven `poc/bump_maxgraph_0.20.0_v1` patterns onto the CURRENT architecture (never cherry-picking old diffs). For every file below, the v1 reference is available via `git diff e8fa9071b..poc/bump_maxgraph_0.20.0_v1 -- <path>` or `git show poc/bump_maxgraph_0.20.0_v1:<path>` when the file existed in v1; files created after v1 (`BpmnCellRenderer.ts`, `navigation.ts`, `style-updater.ts`, `css-classes-updater.ts`, `extension/`) receive the patterns, not the diffs.

Global rules (apply to every step):
- Keep verbatim any `TODO maxgraph@<version>` comment inherited from the former branches that this migration does not address.
- Tag every new uncertainty `TODO maxgraph@0.23.0`.
- JSDoc updates mentioning mxGraph are IN scope; user documentation is OUT of scope.
- New public API elements get `@since 0.48.0`.
- Record every public API break as it happens in `.claude/tasks/01-migrate-mxgraph-to-maxgraph-0.23.0/breaking-changes.md` (created in step 1); it feeds the final PR description and the `BREAKING CHANGE:` commit footer.

Validated decisions driving the plan: BaseGraph (Q1); `BpmnCellStyle` extension type with TODO about maxGraph 0.24.0 interface augmentation (Q2); arcSize halving reverted only in the FINAL step (Q3); try native marker fill colors, delete `BpmnConnector` if it works (Q4); keep own FitType.Center computation + TODO to later switch to `FitPlugin.fitCenter` (Q5); `export { mxgraph }` removed without replacement, documented breaking (Q6); no `StyleDefaultsConfig`, keep per-graph stylesheet configuration (Q7); e2e disabled on CI, run locally on demand for diff inventories (Q8).

Compile/test checkpoints: `npm run build` after each phase once phase 2 is done; `npm run test:unit` after phase 6; `npm run test:integration` after phase 7; `npm run lint` before finishing.

## Dependencies

Phase order (a phase assumes the previous ones are done):
1. Build config + breaking-changes log
2. Style types foundation + initializer removal (mechanical import rewiring everywhere)
3. Graph core (BpmnGraph, GraphConfigurator, BpmnCellRenderer, register-style-definitions)
4. Style system (StyleComputer, StyleConfigurator, runtime updaters, extension)
5. Shapes, icons, overlays
6. Navigation + renderer + facade/public API + dev demo, then unit tests
7. Integration tests
8. CI e2e disable + final arcSize revert + e2e snapshot inventory

## File Changes

### Phase 1 - Dependencies and build config

#### `package.json`
- Remove `mxgraph` and `@typed-mxgraph/typed-mxgraph` from `dependencies`; add `@maxgraph/core` pinned to exact `0.23.0` (same pinning policy as mxgraph had).
- Run `npm install` to regenerate `package-lock.json`.

#### `vite.config.js`
- `manualChunks` (line ~50): replace the `node_modules/mxgraph` test with `node_modules/@maxgraph/core`, chunk name `lib-maxgraph`.
- `chunkSizeWarningLimit` (line ~57): lower from 838; set per the actual maxGraph chunk size observed at first successful build (~330 in v1) and update the trailing comment.

#### `rollup.config.mjs`
- No structural change expected (deps externalized via `rollup-plugin-node-externals`). Verify the `@rollup/plugin-commonjs` usage note still only concerns fast-xml-parser; keep the existing TODO if present.

#### `.claude/tasks/01-migrate-mxgraph-to-maxgraph-0.23.0/breaking-changes.md`
- Create with the 6 known break categories from explore.md section "Public API breakage surface" as a checklist to enrich during implementation.

### Phase 2 - Style types foundation and initializer removal

#### `src/component/mxgraph/style/types.ts` (NEW)
- Create `BpmnCellStyleExtension` (typed `bpmn.*` properties: associationDirectionKind, eventDefinitionKind, extraCssClasses as string[], gatewayKind, globalTaskKind, isInitiating, isInstantiating, isInterrupting as booleans, kind, markers as ShapeBpmnMarkerKind[], sequenceFlowKind, subProcessKind), `BpmnCellStyle extends CellStyle`, `BpmnCellStateStyle extends CellStateStyle`, each holding `bpmn?: BpmnCellStyleExtension`. Reference: `git show poc/bump_maxgraph_0.20.0_v1:src/component/mxgraph/style/types.ts`.
- Add `TODO maxgraph@0.24.0`: switch to `CellStyle`/`CellStateStyle` interface augmentation when maxGraph 0.24.0 is released, removing the extension types and casts.
- Public API: re-export from `src/component/mxgraph/style/index.ts` (already `export *`-ed by the package entry); full JSDoc with `@since 0.48.0`.
- Check v2 TODOs for properties added on master after v1 (e.g. `linkEventSourceIds`/`linkEventTargetId` style props flagged in v2): include them in the extension type.

#### `src/component/mxgraph/initializer.ts` (DELETE)
- Delete the file (factory, `window.mx*` flags, destructured re-exports, public `mxgraph` export all disappear).
- Mechanically rewire every `from '.../initializer'` import in src/, dev/, test/ to named `@maxgraph/core` imports using the rename table in explore.md ("Former POC Analysis" section). This phase only fixes imports/renames; per-file behavioral changes happen in their own phase below.
- Log in breaking-changes.md: `export { mxgraph }` removed without replacement (Q6).

#### `src/bpmn-visualization.ts`
- Remove the `/// <reference types="@typed-mxgraph/typed-mxgraph" preserve="true"/>` directive (line 21) and the `export { mxgraph }` line (line 38).
- Keep all other exports; verify `export * from './component/mxgraph/style'` now also exposes the new style types.

### Phase 3 - Graph core

#### `src/component/mxgraph/BpmnGraph.ts`
- `BpmnGraph extends BaseGraph`; constructor takes the options object: `container`, `view` factory returning `BpmnGraphView`, `cellRenderer` (the `BpmnCellRenderer` instance built from the icon painter), `plugins: [PanningHandler, FitPlugin]`.
- Delete the module-level `pendingIconPainter` workaround and the `createGraphView`/`createCellRenderer` overrides (constructor injection replaces them; the file comment at lines 46-48 already announces this).
- Delete the custom `batchUpdate()` (built into maxGraph).
- `BpmnGraphView extends GraphView`, keep the `getFloatingTerminalPoint` override (types: `CellState`, `Point`).
- Override `protected registerDefaults()` to call the registration functions from `register-style-definitions.ts` (custom shapes/markers AND built-ins, see below), following the `ts-example-selected-features` pattern.
- Consider: zoom methods are class properties in maxGraph; if any override exists use property arrow functions (none expected on master).

#### `src/component/mxgraph/GraphConfigurator.ts`
- `createNewBpmnGraph()` builds the icon painter + `BpmnCellRenderer` and passes them to the `BpmnGraph` constructor options.
- Remove the `registerShapes()`/`registerEdgeMarkers()` calls if moved into `BpmnGraph.registerDefaults()`; keep `StyleConfigurator.configureStyles()`.
- `configureGraph()`: `foldingEnabled = false` becomes `graph.options.foldingEnabled = false`; verify each `set*` method still exists on `BaseGraph` (tag `TODO maxgraph@0.23.0` if behavior unverifiable before tests).

#### `src/component/mxgraph/config/register-style-definitions.ts`
- `registerShapes()`: `mxCellRenderer.registerShape(name, clazz)` becomes `ShapeRegistry.add(name, clazz)`; add manual registration of the built-in `['swimlane', SwimlaneShape]` (pools/lanes render blank without it).
- `registerEdgeMarkers()`: `mxMarker.addMarker` becomes `EdgeMarkerRegistry.add`; adapt the dash marker factory signature (`source` is now `boolean`, canvas types renamed); add manual registration of built-in markers used by the styles: `blockThin: EdgeMarker.createArrow(3)`, `openThin: EdgeMarker.createOpenArrow(3)`, `oval: EdgeMarker.oval`, `diamondThin: EdgeMarker.diamond`.
- Add a `registerPerimeters()` (or equivalent) registering `PerimeterRegistry.add` for `ellipsePerimeter`, `rectanglePerimeter` (declared in default vertex style), `rhombusPerimeter`.

#### `src/component/mxgraph/BpmnCellRenderer.ts`
- `extends CellRenderer`. Replace the full `createCellOverlays()` reimplementation (which uses `mxDictionary`, removed in maxGraph 0.21.0) with the `createOverlayShape`/`configureOverlayShape` extension points introduced in maxGraph 0.20.0 (this was the v1 TODO; v1 used prototype patching, master now has the proper subclass).
- Keep `createShape()` (iconPainter injection + `overrideCreateSvgCanvas`) and `createLabel()` with renamed types (`ImageShape`, `Rectangle`, dialect handling).

### Phase 4 - Style system

#### `src/component/mxgraph/renderer/StyleComputer.ts`
- `computeStyle()` returns `BpmnCellStyle`: first style token becomes `baseStyleNames: string[]` (kind + sequence/association flow kind for edges); the three value maps become typed property assignments (shape values under `style.bpmn.*`, font under `fontFamily/fontSize/fontStyle`, label under `verticalAlign/align/labelWidth/labelPosition/verticalLabelPosition` string literals).
- `mxConstants.FONT_*` sums become `constants.FONT_STYLE_MASK.*`; do NOT set `fontStyle` to 0 (v1 late fix).
- Pool/lane: `style.horizontal = !shape.isHorizontal` (boolean, inversion preserved; keep the explanatory comment).
- Booleans replace `'true'/'false'` strings (`isInterrupting` may now be undefined).
- `computeMessageFlowIconStyle()` returns `{ shape: BpmnStyleIdentifier.MESSAGE_FLOW_ICON, bpmn: { isInitiating } }`.
- Delete `toArrayOfMxGraphStyleEntries` serialization.
- Keep the `enrichShapeStyle` extension hook; its parameter becomes the style object (see extension-points below).
- Preserve the JSDoc/comments referencing undocumented mxGraph label behaviors, updating wording to maxGraph where the behavior carried over.

#### `src/component/extension/extension-points.ts` and `src/component/extension/bpmn-in-color/style-extension.ts`
- Extension contract: style parameter type changes from string-map to `BpmnCellStyle`.
- BPMN-in-Color extension writes typed properties (`fontColor`, `fillColor`, `swimlaneFillColor`, `strokeColor`) instead of `mxConstants.STYLE_*` keys.

#### `src/component/mxgraph/renderer/style-utils.ts`
- `computeAllBpmnClassNames` and `computeAllBpmnClassNamesOfCell`: stop parsing `style.split(';')`; read `style.bpmn?.kind ?? style.shape` (message flow icon case strips the `bpmn.` prefix) and typed properties. v1 reference exists for this file.

#### `src/component/mxgraph/config/StyleConfigurator.ts`
- Every `StyleMap` becomes a `CellStyle` object passed to `stylesheet.putCellStyle(name, style)`; the `MapWithDefault` specific-style maps hold `(style: CellStyle) => void` mutators.
- Perimeters become registered string values (`perimeter: 'ellipsePerimeter'` / `'rhombusPerimeter'`).
- Default edge style: `delete style.endArrow` to unset; arrows become typed values (`endArrow: 'blockThin'`, `startArrow: 'oval'` / `MarkerIdentifier.ARROW_DASH` / `'diamondThin'` / `'openThin'`).
- Edge `arcSize`: KEEP the v1 halved value (2.5) for now with `TODO maxgraph@0.23.0 revert arcSize halving (0.21.0 fixed the computation), dedicated final step` (Q3).
- `startFillColor`/`endFillColor` on flow styles: switch to the NATIVE maxGraph marker fill color support (Q4); if it does not work, keep the custom `BpmnStyleIdentifier.EDGE_START/END_FILL_COLOR` route with a TODO (see edges.ts).
- No `StyleDefaultsConfig` usage (Q7): all configuration stays on the per-graph stylesheet.

#### `src/component/mxgraph/style/identifiers.ts`
- Shrink `BpmnStyleIdentifier` to the entries still needed as REGISTERED NAMES: `EDGE` (`bpmn.edge`, only if `BpmnConnector` survives Q4) and `MESSAGE_FLOW_ICON` (`bpmn.messageFlowIcon`); all `bpmn.*` data keys (EVENT_DEFINITION_KIND, IS_INITIATING, MARKERS, EXTRA_CSS_CLASSES, START/END_FILL_COLOR...) are replaced by typed `style.bpmn.*` properties and removed.
- Keep `MarkerIdentifier.ARROW_DASH`.
- This is public `@experimental` API: log the removed members in breaking-changes.md, update JSDoc.

#### `src/component/mxgraph/style/utils.ts`
- `StyleDefault` unchanged (values only; arcSize note above).
- Rewrite `setStyle`, `setStyleFlag`, `updateStroke`, `updateFont`, `updateFill` to mutate `CellStyle` objects; guard `setStyleFlag` with `if (value == undefined) return;` (maxGraph toggles on undefined); gradient direction conversion returns typed `DirectionValue`.
- Remove `getStyleValue` string parsing (or retype if still needed).

#### `src/component/mxgraph/style/style-updater.ts`
- `StyleManager` caches `CellStyle` CLONES instead of strings.
- CRITICAL: every mutation works on `cell.getClonedStyle()` before `model.setStyle(cell, clone)` (maxGraph#326 identity no-op; v1's "CSS classes disappear on navigation" root cause). Add an explanatory comment with the issue link.
- `resetStyle` restores the cached clone while preserving `style.bpmn.extraCssClasses`.
- `graph.getModel()` becomes `graph.getDataModel()`.

#### `src/component/mxgraph/style/css-classes-updater.ts`
- Write `style.bpmn.extraCssClasses` as a real `string[]` (delete the property when empty) on a cloned style; same `getClonedStyle` rule; `getDataModel()`.

#### `src/component/mxgraph/shape/utils.ts` (overrideCreateSvgCanvas)
- Keep the two patches (pointer-events #920, class + `data-bpmn-id` bridge); rename types (`SvgCanvas2D`, dialect constant becomes its maxGraph equivalent), read extra CSS classes from `(state.cell.style as BpmnCellStyle).bpmn?.extraCssClasses`.
- `canvas.format(value)` takes a number now.

### Phase 5 - Shapes, icons, overlays

#### `src/component/mxgraph/shape/activity-shapes.ts`, `event-shapes.ts`, `gateway-shapes.ts`, `flow-shapes.ts`, `text-annotation-shapes.ts`
- Base class renames (`mxRectangleShape`→`RectangleShape`, `mxEllipse`→`EllipseShape`, `mxRhombus`→`RhombusShape`); canvas type `AbstractCanvas2D`.
- Replace every `mxUtils.getValue(this.style, <BpmnStyleIdentifier key>, default)` with typed access `(this.style as BpmnCellStateStyle).bpmn?.<prop> ?? default`; comparisons against `'true'/'false'` strings become boolean checks (undefined-aware).

#### `src/component/mxgraph/shape/edges.ts` (BpmnConnector) - Q4 experiment
- FIRST try deleting `BpmnConnector` entirely: rely on maxGraph 0.23.0 native marker fill color support (maxGraph#201/PR#157); the default edge style then uses the native connector shape, and the `bpmn.edge` ShapeRegistry entry + `BpmnStyleIdentifier.EDGE` disappear.
- Verify the second responsibility of the class is covered: `paintEdgeLine` pointer-events tweak; if the native connector does not provide it, check whether the `overrideCreateSvgCanvas` patch already covers edges; if not, keep a minimal `BpmnConnector extends ConnectorShape` for that concern only.
- If native fill colors do NOT work: keep `BpmnConnector` with typed style reads (`style.startFillColor ?? this.stroke` pattern from v1) and the inherited TODO about maxGraph native support.
- Record the outcome in breaking-changes.md (the `bpmn.edge` style name is observable by users).

#### `src/component/mxgraph/shape/render/BpmnCanvas.ts`
- Type rename `AbstractCanvas2D`; `arcTo` largeArcFlag/sweepFlag become booleans in the wrapper signatures.

#### `src/component/mxgraph/shape/render/icon-painter.ts`
- `mxUtils.getValue(shape.style, mxConstants.STYLE_*, default)` becomes typed property access (`strokeWidth`, `fillColor`, `strokeColor`, `margin`) with `??` fallbacks.
- All `arcTo`/`curveTo` icon paths: `0|1` arc flags become booleans (mechanical, ~45 sites in v1).
- Public types (`PaintParameter` etc. in `render-types.ts`): swap `mx*` types; log type-level breaks in breaking-changes.md.

#### `src/component/mxgraph/overlay/custom-overlay.ts`
- `extends CellOverlay`; constructor passes a real `new Point()` offset (null not accepted); `mxConstants.ALIGN_*` become string literals; `state.view.graph.getModel().isEdge(cell)` becomes `cell.isEdge()`; types `Point`, `Rectangle`, `CellState`.

#### `src/component/mxgraph/overlay/shapes.ts`
- `OverlayBadgeShape extends TextShape`; `strokewidth` property becomes `strokeWidth`.

#### `src/component/mxgraph/overlay/updater.ts`
- `graph.getModel().getCell` becomes `graph.getDataModel().getCell`; verify `addCellOverlay`/`removeCellOverlays` names on 0.23.0.

### Phase 6 - Navigation, renderer, facade, dev demo

#### `src/component/navigation.ts`
- Panning: `graph.panningHandler` becomes `graph.getPlugin<PanningHandler>('PanningHandler')` (handle the `undefined` return, 0.21.0); `mxEvent.*` becomes `InternalEvent.*` + `eventUtils.*`; mouse wheel listener narrows its event (`event instanceof MouseEvent`); `dispose()` removes listeners via `InternalEvent.removeListener` and destroys via the plugin (0.23.0 fixed destroy memory leaks).
- Fit: the 7-arg `graph.fit(...)` call (line 131) becomes `graph.getPlugin<FitPlugin>('fit')?.fit(<options object>)`; map border/margin/keepOrigin/ignoreWidth/ignoreHeight/maxHeight to the FitPlugin options; the integration test expectation table (scale/translate incl. max-scale-8 capping) is the acceptance criterion.
- FitType.Center: KEEP the own `getGraphBounds` + `scaleAndTranslate` computation (Q5); add `TODO maxgraph@0.23.0 consider switching to FitPlugin.fitCenter (changes the rendering)`.
- `minFitScale`/`maxFitScale` moved to FitPlugin (0.21.0): verify nothing references them on the graph.
- Zoom: `graph.zoomIn/zoomOut/zoomActual/zoomFactor` stayed on the graph in 0.23.0 (only fit moved); verify at compile and keep the jsdom guards from v1 if integration tests need them (scale 0→1, NaN translate).

#### `src/component/mxgraph/BpmnRenderer.ts`
- `insertVertex`/`insertEdge` switch to single-options-object calls with `BpmnCellStyle` objects from StyleComputer (the recently extracted private methods are the only call sites, commit bc8de315f).
- `mxPoint` becomes `Point` (waypoints, label offsets); `graph.getModel()` becomes `getDataModel()`; `model.clear()` equivalent verified.
- `messageFlowIconId()` helper unchanged (string-based).

#### `src/component/mxgraph/renderer/CoordinatesTranslator.ts`
- `Point` rename; `model.getGeometry(cell)`/`model.getParent(cell)` become `cell.getGeometry()`/`cell.getParent()`.

#### `src/component/BpmnVisualization.ts`
- `dispose()` keeps `graph.destroy()` (0.23.0 fixed destroy flows); verify container cleanup behavior matches the integration test expectations.
- Update JSDoc references to mxGraph (the experimental `graph` property doc must now describe maxGraph).

#### `src/component/version.ts`
- Dependency entry `'mxGraph': mxClient.VERSION` becomes `'maxGraph'` with `constants.VERSION` (moved from Client in maxGraph 0.16.0). Log in breaking-changes.md (observable `getVersion()` output change).

#### `src/component/registry/query-selectors.ts` and `src/component/registry/types.ts`
- No code change expected (DOM selectors); update the JSDoc describing the mxGraph-generated SVG structure to maxGraph wording; integration/e2e runs validate the structure survived.

#### `dev/ts/component/SvgExporter.ts`
- `mxgraph.mxImageExport` becomes the `ImageExport` import; `mxUtils.getXml/createXmlDocument` become `xmlUtils.*`, `extractTextWithWhitespace` from `domUtils`, `trim` from `stringUtils`; `mxConstants.NS_SVG` becomes `constants.NS_SVG`; `CanvasForExport extends SvgCanvas2D` (constructor takes a second boolean); `mxClient.IS_FF` becomes `Client.IS_FF`. v1 reference exists for this file.

#### `dev/ts/component/ThemedBpmnVisualization.ts`
- Keep the deep `StyleConfigurator` import; the stylesheet mutations become `CellStyle` property assignments. v1 reference exists.

#### `dev/ts/component/CustomIconPainter.ts` and `dev/ts/main.ts`
- Type-level adjustments only (follows the public `IconPainter`/`BpmnCanvas` types).

### Phase 6b - Unit tests (after `npm run build` is green)

#### `test/unit/component/mxgraph/renderer/StyleComputer.test.ts`
- Biggest churn: every style-string expectation becomes `toStrictEqual(<BpmnCellStyle>{ baseStyleNames: [...], ..., bpmn: {...} })`; booleans/enums/arrays replace encoded strings. v1 reference exists (+343/-79) but must be adapted to master's extension-hook era tests.

#### `test/unit/component/mxgraph/renderer/style-utils.test.ts`
- Inputs become style objects instead of raw strings.

#### `test/unit/component/mxgraph/style/utils.test.ts`
- Rewrite for object-based `setStyle`/`setStyleFlag`/update* helpers; drop string-parsing cases.

#### `test/unit/component/mxgraph/shape/render/BpmnCanvas.test.ts`
- Mock type becomes `AbstractCanvas2D`; arcTo boolean flags in expectations.

#### `test/unit/component/extension/bpmn-in-color/style-extension.test.ts`
- Expect typed properties instead of `mxConstants.STYLE_*` keys.

#### `test/unit/component/version.test.ts`
- Assert `dependencies.get('maxGraph')`.

### Phase 7 - Integration tests

#### `test/integration/config/mxgraph-config.ts`
- `mxClient.NO_FO = false` becomes `Client.NO_FO = false`; consider renaming the file to `maxgraph-config.ts` (update `test/integration/jest.config.cjs` setup path and its comment).

#### `test/integration/helpers/model-expect.ts`
- Types `Cell`/`Geometry` from `@maxgraph/core`; `model.filterDescendants(filter, cell)` becomes `cell.filterDescendants(filter)`; pool detection via `(cell.style as BpmnCellStyle).bpmn?.kind === ShapeBpmnElementKind.POOL`; lazy `getDefaultParent` if needed (v1 pattern).

#### `test/integration/matchers/matcher-utils.ts`, `matchers/toBeCell/index.ts`, `toBeShape/index.ts`, `toBeEdge/index.ts`
- Rename the test-side `BpmnCellStyle` helper type to `ComparedBpmnCellStyle` (v1 naming) to avoid clashing with the production type.
- Raw style assertions compare `CellStyle` objects structurally; resolved style via `graph.getCellStyle(cell)` returns the object; view-state style via `state.style` typed `BpmnCellStateStyle`; `horizontal` expectations become boolean; `extraCssClasses`/`markers`/`isInitiating` read from `rawStyle.bpmn.*`; reuse maxGraph value types (`AlignValue`, `ShapeValue`, arrow values) in expected shapes.

#### `test/integration/mxGraph.model.bpmn.elements.test.ts` (and `.colors`, `.css.api`, `.style.api`, `.parsing.entities`, `cross.css.and.style.api` test files)
- Imports from `@lib/component/mxgraph/initializer` become `@maxgraph/core` (`Geometry`, `Point`) and constants become typed values (`'diamondThin'` etc.).
- Style expectations become objects (driven by the matcher rewrite; the test bodies mostly change where they assert constants or build `mxPoint`).
- Keep file names (renaming `mxGraph.model.*` files is allowed but NOT required by scope; decide at the end, low priority).

#### `test/integration/diagram.navigation.test.ts`
- The view spies (`getGraphBounds`/`scaleAndTranslate`/`setScale`) were designed for FitPlugin parity (d9faaaa60): keep the expectation table UNCHANGED as acceptance criterion; adapt only the mock types (`Rectangle`) and any plugin access plumbing.

#### `test/integration/BpmnVisualization.test.ts`
- Container/destroy expectations: verify against maxGraph DOM behavior; custom IconPainter injection unchanged.

#### `test/typescript-support/src/index.ts`
- Replace `import type { mxStylesheet } from 'mxgraph'` with the `@maxgraph/core` equivalent (`Stylesheet` type via the package); this validates the published `.d.ts` chain without typed-mxgraph.

#### `test/shared/visu/bpmn-page-utils.ts`
- Comment updates only (SVG structure waits should keep working).

#### `test/performance/**` and `test/bundles/**`
- Grep for mxgraph imports/strings; expected: bundle-size assertions or chunk names referencing mxgraph need the new chunk name/sizes.

### Phase 8 - CI, final arcSize revert, e2e inventory

#### `.github/workflows/test-e2e.yml`
- Disable the e2e jobs on CI (v1 used `if: github.event_name == 'NOT_SUPPORTED'`); add a comment referencing this migration and Q8.

#### Final step A - arcSize revert (dedicated commit, Q3)
- In `StyleConfigurator` (and `StyleDefault` if the value lives there): restore the original mxGraph arcSize value (remove the v1 halving and its TODO).
- Run the e2e suite locally before and after this change to isolate its visual impact.

#### Final step B - e2e snapshot inventory (definition of done)
- Run `npm run test:e2e` locally; write `.claude/tasks/01-migrate-mxgraph-to-maxgraph-0.23.0/e2e-diff-inventory.md` listing every failing test/snapshot with a short characterization (e.g. edge rounding, marker rendering, font metrics) for user review. Do NOT update snapshots.

#### Final step C - breaking changes consolidation
- Finalize `breaking-changes.md`; it feeds the squashed-commit `BREAKING CHANGE:` footer and the PR description (commit conventions: `!` marker + uppercase footer with bullets).

## Testing Strategy

- Compile checkpoint after each phase from phase 2 on: `npm run build`.
- `npm run test:unit` at end of phase 6b; `npm run test:integration` at end of phase 7. Both must be fully green (definition of done).
- `npm run lint` before phase 8 (the two `.eslintrc.cjs` mxGraph-related rule disables: re-evaluate and update their comments; keep the rules disabled if maxGraph code still needs them).
- E2e: local on-demand runs only (Q8); snapshot diffs inventoried, never silently updated.
- No new test files expected; the migration adapts existing ones. If `BpmnConnector` is deleted (Q4), remove its dedicated style assertions rather than porting them.

## Documentation

- JSDoc only (in scope): update mxGraph mentions across migrated files; `@since 0.48.0` on new public types (`style/types.ts` exports); document removed/changed public APIs in their former JSDoc locations where applicable.
- User docs (docs/, README) NOT touched (out of scope).
- `breaking-changes.md` (task folder) is the single source for the BREAKING CHANGE footer and PR description.

## Rollout Considerations

- Single PR on this branch; PR title becomes the squashed commit message: type `feat!` or `refactor!` with `BREAKING CHANGE:` footer listing each break (commit-conventions.md format).
- Suggested commit granularity during the work (history is squashed at merge, so commits are checkpoints): one per phase, plus dedicated commits for the Q4 BpmnConnector experiment and final step A (arcSize) so they are individually revertable.
- Known risks: FitPlugin options mapping vs pinned integration expectations (phase 6); native marker fill colors uncertainty (Q4 experiment, fallback path defined); jsdom-specific guards (scale 0/NaN) may need re-tuning; `query-selectors.ts` SVG structure assumption is only validated by integration/e2e runs.
