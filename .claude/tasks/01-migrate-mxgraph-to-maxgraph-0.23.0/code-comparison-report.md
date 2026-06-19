# mxGraph -> maxGraph migration: implementation comparison (OLD POC 0.20.0 vs CURRENT 0.23.0)

Date: 2026-06-19

## 1. Intro

This report compares HOW the mxGraph -> maxGraph migration was implemented in two checkouts of the same library, zone by zone.

Repos compared:

- CURRENT (this branch):
  - `@maxgraph/core` 0.23.0, on the bpmn-visualization 0.47.0-post / 0.48.0 master architecture.
- OLD POC: branch `bump_maxgraph_0.20.0_v1`
  - `@maxgraph/core` 0.20.0, on an older bpmn-visualization master (0.37.0-post), incremental version stepping.
- maxGraph source/changelog used for verification: `main` branch commit 7f2e169d (`CHANGELOG.md`, `packages/core/src`).

Important framing: the OLD POC is ALREADY on maxGraph 0.20.0, not on raw mxGraph. So all maxGraph 0.20.0 breaking changes (ShapeRegistry instead of CellRenderer for shape registration, MarkerShape renamed to EdgeMarkerRegistry, StyleRegistry removed in favor of EdgeStyleRegistry/PerimeterRegistry, enum removals, CellStyle object model) apply to BOTH repos and are therefore NOT differentiators. The version-driven differentiators live in 0.21.0, 0.22.0, and 0.23.0.

Cause categories:

- (a) maxGraph version change 0.20.0 -> 0.23.0: a new/renamed/removed API, a changed default/behavior, or an upstream fix that landed between 0.20.0 and 0.23.0. This is the highlighted group, verified against the maxGraph CHANGELOG/source where possible.
- (b) base bpmn-visualization architecture: the difference comes from app code having moved/refactored between the two bases (~10 minor releases apart), not from maxGraph.
- (c) migration decision: a deliberate choice in the CURRENT branch (the 8 validated decisions Q1-Q8).

Verified maxGraph version facts used throughout (from `CHANGELOG.md`):

- 0.21.0: `AbstractGraph.fit` (plus `minFitScale`/`maxFitScale`) moved to `FitPlugin`, now single-parameter; `Dictionary` removed (use `Map`); arcSize of rounded shapes now computed consistently and matches mxGraph ("to have the same rendering as before for edges, you must multiply the arcSize by 2 in your styles"); `getPlugin` now returns `undefined` when not found.
- 0.22.0: default style properties made globally configurable via `StyleDefaultsConfig` (`packages/core/src/util/config.ts:104`, fields `@since 0.22.0`: arrowSize, lineArcSize, markerSize, startSize, fontSize, etc.).
- 0.23.0: `getTooltip`/`getTooltipForCell` moved from `AbstractGraph` to `TooltipHandler`; `xmlUtils.getViewXml` moved; described as improving modularity and fixing important memory leaks.
- Earlier (0.16.0): `CellRenderer.createOverlayShape`/`configureOverlayShape` extension points introduced (relevant to overlays).
- `registerEntityRelationEdgeStyle` / `EdgeStyleRegistry.allowsIntermediateHandles` are in the maxGraph "Unreleased" section, NOT in 0.23.0 (the installed 0.23.0 package does not export them).

---

## Zone 1. Graph core & plugins

Both repos extend `BaseGraph` (not `Graph`) and pass plugins through the constructor `plugins: [...]` option, so Q1 (use `BaseGraph`, register everything explicitly) was already the choice in the OLD POC and is unchanged. The visible differences are: CURRENT adds `FitPlugin` to the plugin list (because fit moved to a plugin in 0.21.0), injects a custom `cellRenderer` via the `BaseGraph` constructor, registers BPMN defaults through a `registerDefaults()` override, and extracts all navigation/zoom logic out of `BpmnGraph` into a new `navigation.ts`.

| Aspect | OLD POC (0.20.0) | CURRENT (0.23.0) | Cause | Evidence |
|---|---|---|---|---|
| Base class | `class BpmnGraph extends BaseGraph` | `class BpmnGraph extends BaseGraph` | (c) pre-existing | OLD `BpmnGraph.ts:27`; CUR `BpmnGraph.ts:25` |
| Plugin list | `plugins: [PanningHandler]` | `plugins: [PanningHandler, FitPlugin]` | (a) 0.21 fit -> FitPlugin | OLD `BpmnGraph.ts:35`; CUR `BpmnGraph.ts:38` |
| Cell renderer | global prototype patch (see zone 5) | `cellRenderer: new BpmnCellRenderer(iconPainter)` injected via `BaseGraph` constructor option | (a) BaseGraph cellRenderer option + (b) | CUR `BpmnGraph.ts:34-39`; maxGraph `BaseGraph.ts:36` |
| Default registration entry point | `GraphConfigurator.configure()` calls 3 configurators | `BpmnGraph.registerDefaults()` override calls `registerShapes/registerEdgeMarkers/registerPerimeters` | (b) refactor | OLD `GraphConfigurator.ts:45-47`; CUR `BpmnGraph.ts:54-58` |
| Navigation/zoom location | inside `BpmnGraph` (222 lines) | extracted to `component/navigation.ts` (`NavigationImpl`/`ZoomSupport`); `BpmnGraph` ~74 lines | (b) refactor | OLD `BpmnGraph.ts:27-202`; CUR `navigation.ts` |
| getTooltip/getTooltipForCell override | none | none | n/a (0.23 move had no impact) | grep: 0 hits in both |
| TooltipHandler in plugins | no | no | n/a | both plugin lists |

---

## Zone 2. Shape / marker / perimeter registration

Registration API names are identical in both repos (`ShapeRegistry.add`, `EdgeMarkerRegistry.add`, `PerimeterRegistry.add`) because both are >= 0.20.0. The differences are structural (class-based configurators vs functional module = base-arch refactor) and the CURRENT use of maxGraph bulk helpers `registerDefaultEdgeMarkers()` / `registerDefaultPerimeters()`. Neither repo registers a named edge style (`EdgeStyleRegistry` / `EntityRelation`).

| Aspect | OLD POC (0.20.0) | CURRENT (0.23.0) | Cause | Evidence |
|---|---|---|---|---|
| Structure | class configurators: `ShapeConfigurator`, `MarkerConfigurator` + perimeter module | single functional `register-style-definitions.ts` | (b) refactor | OLD `config/ShapeConfigurator.ts`, `config/MarkerConfigurator.ts`; CUR `config/register-style-definitions.ts` |
| Shape registration call | `ShapeRegistry.add(name, class)` in loop | `ShapeRegistry.add(name, class)` in loop | same (0.20 rename, both) | OLD `ShapeConfigurator.ts:90-92`; CUR `register-style-definitions.ts:73-75` |
| Built-in markers | hand-registered (`EdgeMarker.createArrow(3)`, `createOpenArrow`, `oval`, `diamond`) | `registerDefaultEdgeMarkers()` helper | (c)/(a) use maxGraph helper | OLD `MarkerConfigurator.ts:30-38`; CUR `register-style-definitions.ts:96` |
| Custom dash marker | `EdgeMarkerRegistry.add(ARROW_DASH, factory)` | `EdgeMarkerRegistry.add(ARROW_DASH, dashMarkerFactory)` | same | OLD `MarkerConfigurator.ts:67`; CUR `register-style-definitions.ts:97` |
| Perimeters | manual 3-entry array into `PerimeterRegistry.add` | `registerDefaultPerimeters()` helper | (c)/(a) use maxGraph helper | OLD `register-style-definitions.ts:27-36`; CUR `register-style-definitions.ts:103` |
| Edge shape registration | `[BpmnStyleIdentifier.EDGE, BpmnConnector]` registered | none (BpmnConnector removed) | (c) Q4 | OLD `ShapeConfigurator.ts:87`; absent in CUR |
| EdgeStyle.EntityRelation | not registered | not registered (and not in 0.23.0) | n/a | grep: 0 hits both |
| Prototype patches | `ShapeConfigurator` patches `SvgCanvas2D`/`Shape`/`CellRenderer` prototypes | none here (moved to BpmnCellRenderer + per-shape) | (b) refactor | OLD `ShapeConfigurator.ts:95-215` |

---

## Zone 3. Style as objects

Both repos use maxGraph `CellStyle` objects (no `;`-delimited mxGraph style strings remain), as expected since the object model predates 0.20.0. Both define `BpmnCellStyle extends CellStyle` and `BpmnCellStateStyle extends CellStateStyle` with BPMN data under a `bpmn?` property (Q2, present in both). The TODO about switching to interface augmentation exists in both but with a bumped version target.

| Aspect | OLD POC (0.20.0) | CURRENT (0.23.0) | Cause | Evidence |
|---|---|---|---|---|
| `BpmnCellStyle`/`BpmnCellStateStyle` extends `CellStyle`/`CellStateStyle` | yes, `bpmn?` property | yes, identical shape + JSDoc/`@since 0.48.0` | (c) Q2 (both) | OLD `style/types.ts:45-53`; CUR `style/types.ts:60-92` |
| Interface-augmentation TODO | `TODO maxgraph@0.10.2` | `TODO maxgraph@0.24.0` | (c) Q2 note bumped | OLD `style/types.ts:45`; CUR `style/types.ts:60` |
| `BpmnStyleIdentifier.EDGE` | present (`'bpmn.edge'`) | removed | (c) Q4 consequence | OLD `style/identifiers.ts:27`; CUR `style/identifiers.ts:30-32` |
| `// @ts-ignore` in `setStyle` | present (TODO fix type) | replaced by clean `Record<string, unknown>` cast | (b) cleanup | OLD `style/utils.ts:91-94`; CUR `style/utils.ts:96-104` |
| Fill gradient support | none | `isFillColorGradient`/`gradientColor`/`gradientDirection` | (b) new feature | CUR `style/utils.ts:129-191` |
| `bpmn` access | non-guarded `cellStyle.bpmn.kind` | guarded `cellStyle.bpmn?.kind`, `bpmn ??= {}` | (b) defensive refactor | OLD `style/utils.ts:124`; CUR `style/utils.ts:163,180-187` |

---

## Zone 4. StyleComputer

Both return a `BpmnCellStyle` object from `computeStyle` (object model confirmed both ways). The differences are base-architecture: OLD uses private static methods and spread-merge; CURRENT uses standalone module functions, single-object in-place mutation, and an extension-point mechanism (`StyleExtensionPoint`) for BPMN-color handling.

| Aspect | OLD POC (0.20.0) | CURRENT (0.23.0) | Cause | Evidence |
|---|---|---|---|---|
| Helper form | `private static` methods (TODO switch to function) | standalone module functions (TODO realized) | (b) refactor | OLD `renderer/StyleComputer.ts:121`; CUR `renderer/StyleComputer.ts` |
| `computeStyle` return type | `BpmnCellStyle` object | `BpmnCellStyle` object | same (object model) | OLD `StyleComputer.ts:49`; CUR `StyleComputer.ts:56` |
| Merge mechanism | object spread (`{ baseStyleNames, ...style, ...font, ...label }`) | in-place mutation of single `style`, `return style` | (b) refactor | OLD `StyleComputer.ts:65-68`; CUR `StyleComputer.ts:59-71` |
| BPMN color enrichment | inline `if (!ignoreBpmnColors)` branches | `StyleExtensionPoint` plugin array | (b) refactor (ADR) | OLD `StyleComputer.ts:88-98`; CUR `StyleComputer.ts:51-115` |

Edge arcSize (Q3), checked explicitly:

| Aspect | OLD POC (0.20.0) | CURRENT (0.23.0) | Cause | Evidence |
|---|---|---|---|---|
| default edge `arcSize` | `2.5` (halved) | `5` (original mxGraph value) | (a) 0.21 arcSize fix + (c) Q3 | OLD `config/StyleConfigurator.ts:244`; CUR `config/StyleConfigurator.ts:265` |
| comment | "value must be divided by two" (maxGraph regression suspicion) | references 0.21.0 arc computation fix; but the comment text still says "kept halved (2.5) for now" while code is `5` (stale comment) | (a)+(c) | OLD `StyleConfigurator.ts:242-243`; CUR `StyleConfigurator.ts:261-264` |
| `SHAPE_ARC_SIZE` / `absoluteArcSize` | 20 / true | 20 / true | same | both |

Note the direction: the 0.21.0 changelog says you must MULTIPLY arcSize by 2 to keep the same rendering. The OLD POC (on 0.20.0, before the fix) used the halved value 2.5; CURRENT (on 0.23.0, after the fix) reverts to 5. So CURRENT going from 2.5 back to 5 is consistent with the 0.21.0 fix. Flagged below: the CURRENT comment text is internally contradictory with its own value.

---

## Zone 5. CellRenderer & overlays

The headline change: OLD installs overlay hooks by monkey-patching `CellRenderer.prototype.createOverlayShape`/`configureOverlayShape` (with `@ts-ignore`, since they are protected). CURRENT introduces `BpmnCellRenderer extends CellRenderer` overriding those protected methods cleanly, injected via the `BaseGraph` `cellRenderer` constructor option. The extension points themselves are a 0.16.0 maxGraph feature; the clean subclass-injection design is enabled by `BaseGraph` accepting a `cellRenderer` option.

| Aspect | OLD POC (0.20.0) | CURRENT (0.23.0) | Cause | Evidence |
|---|---|---|---|---|
| Overlay hook install | `CellRenderer.prototype.createOverlayShape/configureOverlayShape` patched (`@ts-ignore`) | `class BpmnCellRenderer extends CellRenderer` with `protected override` | (b) refactor enabled by (a) BaseGraph cellRenderer option | OLD `ShapeConfigurator.ts:186-214`; CUR `BpmnCellRenderer.ts:26-51`; maxGraph `BaseGraph.ts:36` |
| Renderer wiring | global prototype mutation | constructor injection | (a)+(b) | CUR `BpmnGraph.ts:34-39` |
| Custom overlay class | `MxGraphCustomOverlay` | `CustomCellOverlay` (mx prefix dropped) | (b) rename | both `overlay/custom-overlay.ts:37` |
| Overlay converter | `OverlayConverter.ts` (class + statics) | `overlay/converter.ts` (module functions + thin class) | (b) refactor | OLD `overlay/OverlayConverter.ts`; CUR `overlay/converter.ts` |
| Overlay updater | none separate | new `overlay/updater.ts` (`OverlaysUpdater`) | (b) refactor | CUR `overlay/updater.ts` |
| `OverlayBadgeShape` | `extends TextShape` | identical | same | both `overlay/shapes.ts` |

---

## Zone 6. Shapes & icons

Shape base classes (`EllipseShape`, `RhombusShape`, `RectangleShape`) are identical names in both (the mx -> non-mx rename predates 0.20.0). Canvas drawing API (`arcTo`/`curveTo`/`begin`/`close`) uses boolean flags in both (no 0|1 numeric change). The real ZONE 6 movement is base-architecture (icon painter injection) plus the Q4 deletion of `BpmnConnector`/`edges.ts`.

| Aspect | OLD POC (0.20.0) | CURRENT (0.23.0) | Cause | Evidence |
|---|---|---|---|---|
| Shape base classes | `EllipseShape`/`RhombusShape`/`RectangleShape` | identical | n/a no change | event/gateway/activity/flow shape imports |
| Typed style read | `(this.style as BpmnCellStateStyle).bpmn.x` | `...bpmn?.x` with `?? NONE` fallbacks | (a)/(b) defensive | OLD `event-shapes.ts:93,105`; CUR `event-shapes.ts:94,106` |
| `arcTo`/`curveTo` flags | boolean `largeArcFlag`/`sweepFlag` | boolean (identical) | n/a no change | OLD `BpmnCanvas.ts:195`; CUR `BpmnCanvas.ts:184` |
| Icon painter source | `IconPainterProvider.get()` singleton | `iconPainter = undefined`, injected by `BpmnCellRenderer.createShape` | (b) refactor | OLD `flow-shapes.ts:27`; CUR `BpmnCellRenderer.ts:53-60` |
| `BpmnConnector`/`edges.ts` | present, registered for EDGE, manual `setFillColor` for markers | file deleted; native marker fill via style flags | (c) Q4 | OLD `shape/edges.ts:24,43,48`; absent in CUR; CUR `StyleConfigurator.ts:52-59` |
| `createSvgCanvas` override | global `Shape.prototype.createSvgCanvas` patch | per-shape `overrideCreateSvgCanvas(shape)` from `BpmnCellRenderer` | (b) refactor (no prototype mutation) | OLD `ShapeConfigurator.ts:141-184`; CUR `shape/utils.ts` + `BpmnCellRenderer.ts:53-65` |

---

## Zone 7. Navigation

Both use maxGraph `InternalEvent`/`eventUtils` (no `mxEvent` global) with identical event names; the API surface is the same because both are on maxGraph. The differences: navigation extracted into `navigation.ts` (base-arch); fit now goes through `FitPlugin` (0.21); `getPlugin` safe-typed + null guarded (0.21 returns undefined); a brand-new dispose/destroy lifecycle (0.23 memory-leak fixes); and the deliberate retention of the project's own `FitType.Center` computation (Q5).

| Aspect | OLD POC (0.20.0) | CURRENT (0.23.0) | Cause | Evidence |
|---|---|---|---|---|
| Events API | `InternalEvent`, `eventUtils` | identical | n/a (both maxGraph) | OLD `BpmnGraph.ts:22`; CUR `navigation.ts:22` |
| Zoom in/out/actual | `override` on graph calling `super.*` | wrapped in `ZoomSupport`, calls `graph.zoomIn()` | (b) refactor | OLD `BpmnGraph.ts:61-82`; CUR `navigation.ts:151-164` |
| fit (H/V/default) | `super.fit(7 args)` (graph method) | `getPlugin<FitPlugin>('fit')?.fit({...})` single options | (a) 0.21 fit -> FitPlugin | OLD `BpmnGraph.ts:47-51`; CUR `navigation.ts:140-145` |
| FitType.Center | own `getGraphBounds`+`scaleAndTranslate` | same, kept; TODO to consider `FitPlugin.fitCenter` | (c) Q5 | OLD `BpmnGraph.ts:111-130`; CUR `navigation.ts:177-196` |
| `getPlugin('PanningHandler')` | unsafe cast `<PanningHandler>` | `getPlugin<PanningHandler>(...)` + `if (!...) return` | (a) 0.21 getPlugin returns undefined | OLD `GraphConfigurator.ts:72`; CUR `navigation.ts:74-78` |
| NaN-in-Point guard | `scale==0 -> 1` + `convertNaNToZero`, comment "make integration tests pass" | same guards, comment "maxGraph rejects a NaN coordinate in Point, unlike mxGraph" | (a) maxGraph Point stricter than mxGraph | OLD `BpmnGraph.ts:123-129`; CUR `navigation.ts:190-196` |
| jsdom `navigator` detection | none (numeric guards only) | none (numeric guards only) | n/a | grep: none in both |
| dispose/destroy lifecycle | none at all | `Disposable`; `BpmnVisualization.dispose()` -> `navigation.dispose()` + `graph.destroy()`; `PanningHandler.onDestroy()`; mouse-wheel listener cleanup | (a) 0.23 destroy/memory-leak fixes + (b) lifecycle | CUR `navigation.ts:67-71`, `BpmnVisualization.ts:113-120`; OLD: none |

---

## Zone 8. Version & facade

The version mechanism is identical in both: `constants.VERSION` read from `@maxgraph/core`, stored under the literal map key `'maxGraph'`. The brief's `mxGraph` vs `maxGraph` dependency-key and `constants.VERSION` vs `Client.VERSION` hypotheses do NOT apply: neither repo uses `Client.VERSION`, and both already key on `'maxGraph'`. Q6 (`export { mxgraph }` namespace removal) is NOT observable in this pair: no such namespace exists in either checkout, so it was removed before the OLD POC's 0.37-based master.

| Aspect | OLD POC (0.20.0) | CURRENT (0.23.0) | Cause | Evidence |
|---|---|---|---|---|
| maxGraph version source | `constants.VERSION` | `constants.VERSION` | n/a same | OLD `version.ts:17,27`; CUR `version.ts:17,28`; maxGraph `util/Constants.ts:24` |
| dependency map key | `'maxGraph'` | `'maxGraph'` | n/a same | both `new Map([['maxGraph', constants.VERSION]])` |
| getVersion API | `version()` `@internal` | `getVersion()` public `@since 0.43.0` | (b) base drift | OLD `version.ts:26`; CUR `version.ts:27` |
| `export { mxgraph }` namespace (Q6) | absent | absent | n/a (predates OLD POC) | both `bpmn-visualization.ts` |
| facade exports | no `BpmnGraph`/`types`; explicit `IconPainter`/`StyleConfigurator` | adds `BpmnGraph`/`types` type exports; drops explicit `IconPainter`/`StyleConfigurator` (still via barrels) | (b) base drift | both `bpmn-visualization.ts` |

---

## Zone 9. Build config & deps

The only true maxGraph-version diff is `@maxgraph/core` 0.20.0 -> 0.23.0 plus an updated rollup commonjs-plugin TODO. `@typed-mxgraph/typed-mxgraph` is absent in BOTH (removed before the OLD POC; maxGraph ships its own types). Everything else (fast-xml-parser 4 -> 5 with `strnum` dropped, lodash-es -> es-toolkit, toolchain bumps, `.eslintrc.js` -> `.eslintrc.cjs`, stricter tsconfig) is base-version drift.

| Aspect | OLD POC (0.20.0) | CURRENT (0.23.0) | Cause | Evidence |
|---|---|---|---|---|
| `@maxgraph/core` | `0.20.0` | `0.23.0` | (a) | OLD `package.json:96`; CUR `package.json:107` |
| `@typed-mxgraph/typed-mxgraph` | absent | absent | n/a (predates) | both package.json + tsconfig |
| fast-xml-parser | `4.2.5` (+`strnum`) | `5.8.0` (`strnum` dropped) | (b) drift | OLD `package.json:97,99`; CUR `package.json:109` |
| lodash-es vs es-toolkit | `lodash-es` | `es-toolkit` | (b) drift | both package.json |
| rollup commonjs TODO | "needed to bundle mxGraph (CommonJS only)" | "mxGraph is now gone (maxGraph ESM only); plugin may be droppable" | (a) | OLD `rollup.config.mjs:28-31`; CUR `rollup.config.mjs:34-37` |
| eslint mxgraph rules | none | none (only 2 `unicorn/*` disables commented "mxGraph code") | (b) | CUR `.eslintrc.cjs:62-63` |
| tsconfig `types` (typed-mxgraph) | absent | absent | n/a | both tsconfig |

Q7 note (no `StyleDefaultsConfig`): neither repo defines or uses a `StyleDefaultsConfig`. This is a genuine cause-(c) decision because maxGraph 0.22.0 introduced its own global `StyleDefaultsConfig` (`packages/core/src/util/config.ts:104`, fields `@since 0.22.0` including `lineArcSize`, `arrowSize`, `markerSize`), which the CURRENT branch deliberately does not adopt. See open questions.

---

## Differences attributable to maxGraph 0.23.0 (cause (a) highlight)

These are the differences whose dominant cause is the maxGraph version jump 0.20.0 -> 0.23.0, with the version/changelog reference:

1. fit moved to `FitPlugin` (maxGraph 0.21.0). CURRENT adds `FitPlugin` to the plugin list (`BpmnGraph.ts:38`) and calls `getPlugin<FitPlugin>('fit')?.fit({...})` with a single options object (`navigation.ts:140-145`). OLD called the 7-argument `super.fit(...)` graph method (`BpmnGraph.ts:47-51`). Ref: CHANGELOG 0.21.0 ("AbstractGraph.fit method moved to FitPlugin ... now accepts a single parameter").

2. `getPlugin` returns `undefined` when not found (maxGraph 0.21.0). CURRENT uses `getPlugin<PanningHandler>('PanningHandler')` plus an explicit null guard / `?.` (`navigation.ts:74-78`). OLD used an unsafe cast `<PanningHandler>this.graph.getPlugin(...)` (`GraphConfigurator.ts:72`). Ref: CHANGELOG 0.21.0 ("getPlugin method now explicitly returns undefined ... must update ... to handle the undefined case").

3. arcSize computation fix (maxGraph 0.21.0). The edge `arcSize` goes from 2.5 (OLD, on 0.20.0 before the fix) back to 5 (CURRENT, after the fix). Ref: CHANGELOG 0.21.0 ("arcSize of rounded shapes was not always correctly computed ... now consistent ... matches mxGraph behavior ... multiply the arcSize by 2 in your styles"). This is the version-driven enabler; the actual flip to 5 is also a Q3 migration decision. Caveat: CURRENT's comment text still says "kept halved (2.5) for now" while the value is 5 (stale comment, see open questions).

4. New destroy / dispose memory-leak lifecycle (maxGraph 0.23.0). CURRENT adds a `Disposable` interface and a real teardown path: `BpmnVisualization.dispose()` -> `NavigationImpl.dispose()` (which calls `PanningHandler.onDestroy()`) -> `graph.destroy()` (`BpmnVisualization.ts:113-120`, `navigation.ts:67-71`). OLD has no dispose/destroy at all. Ref: CHANGELOG 0.23.0 ("fixes important memory leaks").

5. NaN-in-`Point` strictness (maxGraph behavior vs mxGraph). Both carry `convertNaNToZero` + `scale==0 -> 1` guards, but CURRENT documents the cause: "maxGraph rejects a NaN coordinate in Point, unlike mxGraph" (`navigation.ts:190`). This is a maxGraph-vs-mxGraph behavior, present since the maxGraph move; not specifically 0.23.0. Marked partially uncertain as to the exact introducing version.

6. `BaseGraph` accepts a `cellRenderer` constructor option, enabling the clean `BpmnCellRenderer extends CellRenderer` injection (`BpmnGraph.ts:34-39`, maxGraph `BaseGraph.ts:36`) instead of OLD's prototype monkey-patching. The overlay extension points (`createOverlayShape`/`configureOverlayShape`) themselves are 0.16.0; the constructor-injection ergonomics are a maxGraph capability the CURRENT base relies on. Mixed (a)+(b).

7. Bulk registration helpers `registerDefaultEdgeMarkers()` / `registerDefaultPerimeters()` used by CURRENT (`register-style-definitions.ts:96,103`) instead of OLD's hand-rolled arrays. These helpers are maxGraph API; adopting them is also a migration decision. Mixed (a)+(c).

8. `getTooltip`/`getTooltipForCell` moved to `TooltipHandler` (maxGraph 0.23.0): NO impact on this codebase (neither repo overrides them, no `TooltipHandler` used). Listed for completeness as a verified non-impact.

Not in 0.23.0 (verified): `registerEntityRelationEdgeStyle` and `EdgeStyleRegistry.allowsIntermediateHandles` are in the maxGraph "Unreleased" section and absent from the installed 0.23.0 package, so they correctly play no role in either repo.

---

## Open questions

1. ~~Stale arcSize comment (CURRENT).~~ **Resolved (2026-06-19).** `config/StyleConfigurator.ts` set `style.arcSize = 5` but the comment still said "Kept halved (2.5) for now", contradicting the code. The comment was rewritten to state that arcSize is restored to the original mxGraph value (5) because maxGraph 0.21.0 fixed the arc computation, with a `TODO maxgraph@0.23.0` to confirm via the (currently disabled) visual e2e tests. Matches Q3.

2. ~~Possible double `PanningHandler.onDestroy()` (CURRENT).~~ **Resolved (2026-06-19).** Confirmed it runs twice: explicitly in `NavigationImpl.dispose()` (`navigation.ts`), then via `graph.destroy()` → `plugins.forEach(p => p.onDestroy())` (`AbstractGraph.ts:1317`). Verified harmless: `PanningHandler.onDestroy()` only performs idempotent listener removals (`removeMouseListener`, `removeListener`, DOM `removeListener`, `panningManager.destroy`, `EventSource.destroy`). Kept the explicit call by design (each component frees the resources it uses) and added a comment documenting both the ownership rationale and the harmless redundancy.

3. `StyleDefaultsConfig` not adopted (Q7) although 0.22.0 added it. maxGraph 0.22.0 introduced a global `StyleDefaultsConfig` (`util/config.ts:104`) covering `lineArcSize`, `arrowSize`, `markerSize`, `startSize`, font defaults, etc. The CURRENT branch deliberately does not introduce one (Q7). This is a legitimate decision, but it is also a missed-improvement candidate: some of the project's `StyleDefault` constants and the manual arcSize handling could potentially be expressed through maxGraph's own config now. Worth a human review of whether any of the project's style defaults should ride on `StyleDefaultsConfig` rather than bespoke constants.

4. `FitPlugin.fitCenter` not adopted (Q5). CURRENT keeps its own `getGraphBounds`+`scaleAndTranslate` Center computation with a TODO (`navigation.ts:178`) noting `FitPlugin.fitCenter` exists (verified `view/plugin/FitPlugin.ts:238`) but changes the rendering. Intentional for now; revisit once visual diffs are acceptable.

5. CommonJS rollup plugin possibly removable. CURRENT's own TODO (`rollup.config.mjs:34-37`) says mxGraph is gone and fast-xml-parser is now 5.8.0 (dual ESM/CJS), so the commonjs plugin may be droppable. Not maxGraph-version-blocking; a build-hygiene follow-up.

6. startFill/endFill flags possibly redundant. CURRENT's `StyleConfigurator.ts:52-54` notes maxGraph PR#157 (native marker fill) landed, so the `startFill`/`endFill` flags it still sets may now be removable. Deferred pending e2e validation (Q8 disabled e2e on CI during the POC, so this could not be confirmed here).

7. NaN-in-Point introducing version uncertain. The "maxGraph rejects NaN in Point" behavior is real and documented in CURRENT's comment, but I could not pin it to a specific maxGraph release between 0.20.0 and 0.23.0 (it likely predates 0.20.0, as a general maxGraph-vs-mxGraph difference). Marked uncertain; not a blocker since both repos guard against it identically.

8. Q6 not verifiable in this pair. The `export { mxgraph }` namespace removal (Q6) cannot be observed here because neither checkout contains such a namespace; it was removed before the OLD POC's base. If the team wants evidence of Q6, compare against an even older mxGraph-based checkout, not this 0.20.0 POC.
