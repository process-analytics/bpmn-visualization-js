# Task: Migrate from mxGraph to maxGraph 0.23.0

Part of https://github.com/process-analytics/bpmn-visualization-js/issues/3238.

**Scope**: production code in `src/`, test code, build configuration, JSDoc comments. Out of scope: user documentation and docs referencing mxGraph.
**Reference branch**: `poc/bump_maxgraph_0.20.0_v1` (user-designated; `poc/bump_maxgraph_0.20.0_v2` is a stalled tsc-fixing replay onto v0.47.0, useful only for TODO hints).
**Definition of done**: `npm run build`, unit and integration tests pass; e2e visual snapshot differences acceptable for this POC but must be listed for review.
**Breaking changes**: expected and must each be documented. New public API elements get `@since 0.48.0`.

Companion document: `codebase-map.md` (same folder) holds the full current-state inventory with `path:line` references. This report synthesizes it with the POC branch analysis and maxGraph 0.23.0 research.

---

## Codebase Context (current master architecture)

Full detail in `codebase-map.md`. Essentials:

- **Initialization**: single point `src/component/mxgraph/initializer.ts` (factory call, `window.mx*` flags, destructured re-exports since commit 993603bab, public `export { mxgraph }`). Whole file disappears; every `from '../initializer'` import becomes named `@maxgraph/core` imports.
- **Architecture changed since the 2023-era POC v1**: these files did NOT exist in v1 and must receive the v1 patterns rather than the v1 diffs:
  - `src/component/mxgraph/BpmnCellRenderer.ts:25` - `extends mxCellRenderer`, overrides `createCellOverlays()` (uses `mxDictionary`, REMOVED in maxGraph 0.21.0), `createShape()`, `createLabel()`. Injected via `BpmnGraph.createCellRenderer()` with a module-level `pendingIconPainter` workaround that BaseGraph constructor injection eliminates (noted in file comment).
  - `src/component/navigation.ts:53` - `NavigationImpl` + `ZoomSupport`: panning handler wiring, mouse-wheel zoom, and `graph.fit(7 args)` at line 131 (fit moved to `FitPlugin` in maxGraph 0.21.0).
  - `src/component/mxgraph/style/style-updater.ts` + `css-classes-updater.ts` (split of the former GraphCellUpdater) with `StyleManager` caching raw style STRINGS.
  - `src/component/extension/bpmn-in-color/style-extension.ts` - style extension hook writing `mxConstants.STYLE_*` keys into StyleComputer maps (ADR 001, commit fee41ab8e).
- **Style system is 100% string-based**: `StyleComputer.computeStyle()` returns `'kind;bpmn.k=v;fontFamily=...'`; `style-utils.ts` parses `style.split(';')` for CSS class names; `StyleManager` caches strings; `BpmnStyleIdentifier` holds 13 `bpmn.*` string keys. Biggest migration surface.
- **Fit integration tests** (`test/integration/diagram.navigation.test.ts`, commit d9faaaa60) already spy on `view.getGraphBounds/scaleAndTranslate/setScale` mirroring maxGraph FitPlugin tests: deliberate prep, the new implementation must satisfy the same expectations.
- **Recent prep refactors** easing the migration: dde897426 (StyleConfigurator/mxImageExport no longer exported), 993603bab (destructured initializer imports, makes the import rewiring mechanical), bc8de315f (insertEdge isolated), fee41ab8e (BPMN-in-Color extracted from StyleComputer).
- **Public API breakage surface** (each must be documented as BREAKING CHANGE):
  1. `export { mxgraph }` (`src/bpmn-visualization.ts:38`) disappears, no replacement.
  2. `@typed-mxgraph/typed-mxgraph` runtime dep + triple-slash reference (`src/bpmn-visualization.ts:21`) removed; maxGraph ships its own types.
  3. `BpmnGraph` base class changes (`mxGraph` -> maxGraph); experimental `BpmnVisualization.graph` keeps existing but its API follows maxGraph naming.
  4. Theme/style customization contract: style strings / `StyleMap` -> `CellStyle` objects.
  5. `IconPainter`/`BpmnCanvas` public types: `mxAbstractCanvas2D` -> `AbstractCanvas2D`.
  6. `getVersion()` reports `maxGraph` instead of `mxGraph` (`src/component/version.ts:17`, uses `mxClient.VERSION`; maxGraph: `constants.VERSION` since 0.16.0).

---

## Former POC Analysis (poc/bump_maxgraph_0.20.0_v1)

54 files changed (+1776/-1368), only the rendering layer + tests + build config; parser/model untouched. v1 converged by incremental version stepping with `TODO maxgraph@<version>` tagging; v2 (big-bang replay onto a moved master) stalled in tsc-fixing. **Lesson: reapply v1 patterns file-by-file onto the current architecture, do not cherry-pick either branch.**

### Established patterns to reuse (proven on 0.20.0)

- **Style types** (new file `src/component/mxgraph/style/types.ts` in v1): `BpmnCellStyle extends CellStyle { bpmn?: BpmnCellStyleExtension }` (idem `BpmnCellStateStyle`). Custom keys become typed properties under `style.bpmn.*`; `extraCssClasses` becomes `string[]`; `markers` becomes `ShapeBpmnMarkerKind[]`; booleans replace `'true'/'false'`. Open TODO from v1: try interface augmentation of `CellStyle` instead of extension types to avoid casts.
- **StyleComputer**: returns `BpmnCellStyle` object; former first style token becomes `baseStyleNames: string[]` (e.g. `['sequenceFlow', 'normal']`); `mxConstants.FONT_BOLD` -> `constants.FONT_STYLE_MASK.BOLD`; `style.horizontal = !shape.isHorizontal` (boolean, inverted); do NOT set `fontStyle` to 0 (late behavior fix in v1).
- **Critical setStyle identity gotcha** (maxGraph#326): `model.setStyle` no-ops if the passed object IS the cell's style instance; always mutate `cell.getClonedStyle()`. Root cause of "CSS classes disappear on navigation" bugs in the POC. StyleManager caches `CellStyle` clones instead of strings.
- **`setStyleFlag` toggles on undefined**: guard `if (value == undefined) return;` before calling.
- **BaseGraph registers nothing**: must manually register swimlane shape (`['swimlane', SwimlaneShape]`, pools render blank otherwise), perimeters (`PerimeterRegistry.add('ellipsePerimeter'|'rectanglePerimeter'|'rhombusPerimeter', ...)`), built-in edge markers used (`blockThin: EdgeMarker.createArrow(3)`, `openThin: EdgeMarker.createOpenArrow(3)`, `oval`, `diamondThin`), and plugins (`PanningHandler`). v1 added `config/register-style-definitions.ts` for this; current master already has that file (different content) for custom shapes/markers.
- **BpmnGraph**: `extends BaseGraph` with options-object constructor `super({ container, view: graph => new BpmnGraphView(graph), plugins: [...] })`; custom `batchUpdate` removed (built-in); zoom overrides as property arrow functions if any; `graph.getModel()` -> `graph.getDataModel()` everywhere; `foldingEnabled` -> `graph.options.foldingEnabled`; `graph.panningHandler` -> `graph.getPlugin<PanningHandler>('PanningHandler')`.
- **insertVertex/insertEdge**: single options-object signatures with `position: [x, y]` / style objects.
- **Shapes**: base class renames (`mxEllipse`->`EllipseShape` etc.), `mxUtils.getValue(style, key, default)` -> typed property access with `??`, `strokewidth` -> `strokeWidth`, `canvas.arcTo` large-arc/sweep flags `0|1` -> booleans (mechanical, all icon-painter paths), `canvas.format(number)`.
- **Overlays**: `CellOverlay` constructor needs a real `new Point()` offset; `mxConstants.ALIGN_*` -> string literals; use the `createOverlayShape`/`configureOverlayShape` extension points (>=0.20.0) inside `BpmnCellRenderer` instead of reimplementing `createCellOverlays` (v1 TODO, now feasible since master has the subclass).
- **Events**: `mxEvent` -> `InternalEvent` + `eventUtils`; mouse-wheel listener arg must be narrowed (`event instanceof MouseEvent`); `customFit`/jsdom: guard scale `0 -> 1` and NaN translations to keep integration tests green.
- **Markers**: factory `source` param is now `boolean` (was `mxCell`). `BpmnConnector` + `bpmn.edge.startFillColor/endFillColor` kept in v1 as workaround pending maxGraph native start/endFillColor (maxGraph#201/PR#157): check status on 0.23.0, delete if resolved.
- **Tests**: StyleComputer expectations -> `toStrictEqual(<BpmnCellStyle>{...})`; integration matchers compare style objects structurally (`graph.getCellStyle(cell)` returns the object); `model.filterDescendants(f, cell)` -> `cell.filterDescendants(f)`; `mxClient.NO_FO` -> `Client.NO_FO` in `test/integration/config/mxgraph-config.ts`; maxGraph value types (`AlignValue`, `ShapeValue`...) reused in expectations.
- **Build**: deps swap (`mxgraph` + `@typed-mxgraph/typed-mxgraph` -> `@maxgraph/core`); vite manualChunks `lib-mxgraph` -> maxGraph chunk; chunkSizeWarningLimit 838 -> ~330; NO jest ESM work needed (maxGraph ships CJS since 0.20.0; v1's mid-POC ESM jest setup was fully reverted).
- **Process**: tag every uncertainty `TODO maxgraph@0.23.0`; disable e2e CI until compile+render works, re-enable and inventory snapshot diffs at the end.

---

## Documentation Insights (maxGraph 0.23.0)

### Migration guide caveats
The official guide is frozen at 0.18.0; for later versions the CHANGELOG is authoritative. Official style-string conversion reference: `packages/core/src/serialization/codecs/mxGraph/utils.ts` in the maxGraph repo. `ignoreDefaultStyle: true` in `CellStyle` replicates the leading-semicolon trick.

### Delta 0.20.0 -> 0.23.0 (everything the POC did NOT absorb)

**0.21.0 (breaking)**:
- `AbstractGraph.fit` (+ `minFitScale`/`maxFitScale`) moved to **`FitPlugin`** (plugin id `'fit'`); single options parameter; `graph.getPlugin<FitPlugin>('fit')?.fit(...)` / `fitCenter({ margin })`. Directly hits `navigation.ts:131`.
- **`Dictionary` class removed** -> native `Map`. Directly hits `BpmnCellRenderer.createCellOverlays` (uses `mxDictionary`); strongest argument for switching to the `createOverlayShape`/`configureOverlayShape` extension points.
- **`arcSize` computation fixed to match mxGraph**: "to keep the previous rendering for edges, multiply arcSize by 2". The v1 workaround (halving 5 -> 2.5) is therefore OBSOLETE at 0.23.0: keep the original mxGraph value and verify rendering.
- `getPlugin()` now returns `undefined` explicitly: TypeScript callers must handle it.

**0.22.0 (no breaking)**: `StyleDefaultsConfig` global defaults (`fontFamily`, `fontSize`, `markerSize`, `startSize`, `lineArcSize`...): may simplify StyleConfigurator defaults.

**0.23.0 (breaking)**:
- `getTooltip`/`getTooltipForCell` moved from `AbstractGraph` to `TooltipHandler` plugin (bpmn-visualization does not override them and does not register TooltipHandler: no impact expected, verify at compile).
- `xmlUtils.getViewXml` -> `xmlViewUtils.getViewXml` (only Editor-internal; check `dev/ts/component/SvgExporter.ts` usage of `xmlUtils`).
- New `resetGlobalConfig()` helper (useful for tests), critical memory-leak fixes in `destroy` methods (aligns with `BpmnVisualization.dispose()` -> `graph.destroy()`).

**Post-0.23.0 unreleased heads-up** (do not absorb now): `ImageMixin` -> `ImageBundlePlugin`; `EdgeStyleRegistry.add()` metadata param.

### Package characteristics (@maxgraph/core 0.23.0)
ESM-first (`"type": "module"`) with dual CJS/ESM exports (validated by arethetypeswrong), bundled TS types, zero runtime deps, `sideEffects` only for CSS, subpath exports (`/css/*` etc.). Tree-shaking: `BaseGraph` (registers nothing) vs `Graph` (batteries included); canonical tree-shaken setup in `packages/ts-example-selected-features` (BaseGraph subclass with `protected override registerDefaults()`, plugins array in constructor, `getPlugin<FitPlugin>('fit')?.fitCenter(...)`).

### Issue #3238 context
Evaluation issue (parent #3237, mxGraph EOL). Prior POC PRs: #3340 (0.20.0, the v1 branch: all unit+integration green, >75% e2e), #3270, #3098, #2756, #2366. IIFE bundle 984 KB -> 467 KB at 0.20.0 (~52% reduction). Team contributes upstream to maxGraph; some bpmn-visualization customizations were already integrated upstream.

---

## Key Files

Implementation order will be refined in plan phase; the complete inventory with line refs is in `codebase-map.md` section 2.

| Area | Files |
|---|---|
| To delete | `src/component/mxgraph/initializer.ts` |
| Graph core | `src/component/mxgraph/BpmnGraph.ts`, `GraphConfigurator.ts`, `BpmnCellRenderer.ts` |
| Style (hardest) | `renderer/StyleComputer.ts`, `renderer/style-utils.ts`, `config/StyleConfigurator.ts`, `style/identifiers.ts`, `style/utils.ts`, `style/style-updater.ts`, `style/css-classes-updater.ts`, new `style/types.ts`, `extension/bpmn-in-color/style-extension.ts` |
| Renderer | `BpmnRenderer.ts`, `renderer/CoordinatesTranslator.ts` |
| Shapes/icons | `config/register-style-definitions.ts`, all of `shape/` (`activity-shapes.ts`, `event-shapes.ts`, `gateway-shapes.ts`, `flow-shapes.ts`, `edges.ts`, `text-annotation-shapes.ts`, `utils.ts`, `render/BpmnCanvas.ts`, `render/icon-painter.ts`) |
| Overlays | `overlay/custom-overlay.ts`, `overlay/shapes.ts`, `overlay/updater.ts` |
| Navigation | `src/component/navigation.ts` (FitPlugin, PanningHandler plugin, InternalEvent/eventUtils) |
| Facade/API | `src/bpmn-visualization.ts`, `src/component/BpmnVisualization.ts`, `src/component/version.ts`, `src/component/registry/query-selectors.ts` (verify SVG structure) |
| dev demo | `dev/ts/component/SvgExporter.ts`, `ThemedBpmnVisualization.ts`, `CustomIconPainter.ts` |
| Tests | `test/unit/component/mxgraph/**` (StyleComputer.test.ts biggest), `test/integration/matchers/**`, `helpers/model-expect.ts`, `config/mxgraph-config.ts`, `mxGraph.model.*.test.ts`, `diagram.navigation.test.ts`, `BpmnVisualization.test.ts`, `test/typescript-support/src/index.ts`, `test/shared/visu/bpmn-page-utils.ts` |
| Build | `package.json`, `package-lock.json`, `vite.config.js`, `rollup.config.mjs`, jest configs (verify, likely no change), `.eslintrc.cjs` (2 rule comments) |

## Patterns to Follow

1. v1 style-object patterns (`BpmnCellStyle`/`baseStyleNames`/`bpmn.*` sub-object) applied to current files.
2. `cell.getClonedStyle()` before any style mutation (maxGraph#326).
3. `BaseGraph` subclass + explicit registration (`ShapeRegistry`, `PerimeterRegistry`, `EdgeMarkerRegistry`, swimlane) + plugins `[PanningHandler, FitPlugin]` per ts-example-selected-features.
4. Overlay rendering via `createOverlayShape`/`configureOverlayShape` in `BpmnCellRenderer` (no `createCellOverlays` reimplementation, no `Dictionary`).
5. `TODO maxgraph@0.23.0` tagging convention for uncertainties. IMPORTANT: the `TODO maxgraph@<version>` comments coming from the former branch (v1/v2) that are NOT addressed in this branch MUST be kept verbatim in the migrated code, they carry the upstream follow-up history and will be reconsidered at the next maxGraph bumps.
6. Conventional commits per repo rules; JSDoc `@since 0.48.0` for new public APIs; every public break documented.

## Dependencies

- `@maxgraph/core@0.23.0` replaces `mxgraph@4.2.2` + `@typed-mxgraph/typed-mxgraph@~1.0.8`. No peer deps, types bundled.
- Node/npm per `.nvmrc`; jest stays CJS (maxGraph ships CJS).
- Reference materials: maxGraph CHANGELOG (authoritative post-0.18 breaks), `packages/ts-example-selected-features`, v1 branch diffs (`git diff e8fa9071b..poc/bump_maxgraph_0.20.0_v1 -- <file>`).

## Decisions (user-validated) and Open Questions for Plan Phase

Decided:

- **Q1 - `BaseGraph`** (tree-shaking, v1 choice): confirmed by the user.
- **Q2 - `CellStyle` interface augmentation: NOT possible for now**, keep the v1 `BpmnCellStyle` extension-type approach. Mark in the code (TODO) that augmentation will become possible with maxGraph 0.24.0 (to be released).
- **Q3 - arcSize: revert v1's halving** (0.21.0 fixed the computation), BUT not in the first shot. Do it at the END of the migration as a dedicated step, because the visual (e2e) tests must be checked against this change.
- **Q5 - FitType.Center: keep the own computation** (integration tests pin exact scaleAndTranslate args). Add a TODO in the code to switch to the maxGraph `FitPlugin.fitCenter` implementation in the future: the maxGraph implementation changes the rendering.

Still open:

- **Q4** - `BpmnConnector`/start-end fill color workaround: check if maxGraph 0.23.0 natively supports marker fill colors (maxGraph#201/PR#157); delete if so.
- **Q6** - Public replacement (if any) for `export { mxgraph }`: probably none (users import `@maxgraph/core` directly); confirm BREAKING CHANGE wording.
- **Q7** - `StyleDefaultsConfig` (0.22.0) adoption now or later (could simplify StyleConfigurator but adds delta vs v1 reference).
- **Q8** - e2e strategy: disable e2e CI during migration like v1, or run locally only and inventory diffs at the end (definition of done requires the diff list).
