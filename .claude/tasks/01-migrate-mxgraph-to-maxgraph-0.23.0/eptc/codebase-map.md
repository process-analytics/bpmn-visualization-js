# Codebase map: mxGraph usage in bpmn-visualization (preparation for maxGraph 0.23.0)

State of the codebase at commit `dde897426` (branch `poc/claude/bump_maxgraph_0.23.0_bpmn-visu_0.48.0`, equal to recent master).
Current dependency: `mxgraph@4.2.2` + `@typed-mxgraph/typed-mxgraph@~1.0.8`.

---

## 1. INITIALIZATION

Single initialization point: `src/component/mxgraph/initializer.ts`.

- `src/component/mxgraph/initializer.ts:17` imports the factory: `import factory, { type mxGraphExportObject } from 'mxgraph';`
- `src/component/mxgraph/initializer.ts:34` calls it once at module load: `export const mxgraph = initialize();` (this namespace object is part of the public API, see section 5).
- `src/component/mxgraph/initializer.ts:38-59` destructures and re-exports the mx objects used across the codebase (introduced by commit 993603bab):
  `mxCellOverlay, mxCellRenderer, mxClient, mxConnector, mxConstants, mxDictionary, mxEllipse, mxEvent, mxGeometry, mxGraphView, mxImageShape, mxMarker, mxPerimeter, mxPoint, mxRectangle, mxRectangleShape, mxRhombus, mxSvgCanvas2D, mxText, mxUtils`
- `src/component/mxgraph/initializer.ts:62` exports `mxGraph` separately to preserve constructor types in the api-extractor `.d.ts`: `export const mxGraph: typeof mxgraph.mxGraph = mxgraph.mxGraph;`
- `src/component/mxgraph/initializer.ts:64-73` declares the global `Window` augmentation for the mxClient load flags.

Key snippet (`src/component/mxgraph/initializer.ts:75-85`):

```typescript
function initialize(): mxGraphExportObject {
  // set options globally, as it is not working when passing options to the factory (https://github.com/jgraph/mxgraph/issues/479)
  // Required otherwise 'Uncaught ReferenceError: assignment to undeclared variable mx...'
  window.mxForceIncludes = false;
  window.mxLoadResources = false;
  // Required otherwise we got 'Uncaught ReferenceError: assignment to undeclared variable mx...'
  window.mxLoadStylesheets = false;
  window.mxResourceExtension = '.txt';

  return factory({});
}
```

maxGraph note: the factory, the `window.mx*` flags, and the `mxgraph` namespace object all disappear with maxGraph (plain ESM imports). Every `import { mxX } from '../initializer'` site in the inventory below must be rewired to `from '@maxgraph/core'` equivalents.

---

## 2. FILE INVENTORY

All src/ files importing/referencing mxgraph or mx* types (grep for `from 'mxgraph'`, `initializer`, `mx[A-Z]`).

### Graph core
| File | Purpose | Main mxGraph APIs used |
|---|---|---|
| `src/component/mxgraph/initializer.ts` | Factory call + re-export of all mx objects (see section 1) | `factory({})`, `mxGraphExportObject`, all destructured exports |
| `src/component/mxgraph/BpmnGraph.ts:52` | `BpmnGraph extends mxGraph`; overrides `createGraphView()` (line 75) and `createCellRenderer()` (line 87); adds `batchUpdate()` (line 100, `model.beginUpdate/endUpdate`); contains `BpmnGraphView extends mxGraphView` overriding `getFloatingTerminalPoint` (lines 110-122). Uses module-level `pendingIconPainter` workaround (lines 50, 59, 69) because the mxGraph super constructor calls `createCellRenderer()` before instance fields are set; the file comment (lines 46-48) already states this disappears with maxGraph BaseGraph constructor injection | `mxGraph`, `mxGraphView`, `mxCellState`, `mxPoint`, `mxCellRenderer` type |
| `src/component/mxgraph/GraphConfigurator.ts:27-29` | `createNewBpmnGraph()` factory; `GraphConfigurator.configure()` (line 42) runs `StyleConfigurator.configureStyles()`, `registerShapes()`, `registerEdgeMarkers()`; `configureGraph()` (line 50) sets graph behavior | `setCellsLocked`, `setCellsSelectable`, `setEdgeLabelsMovable`, `setHtmlLabels`, `setConstrainChildren`, `setExtendParents`, `foldingEnabled = false` |
| `src/component/mxgraph/BpmnCellRenderer.ts:25` | `BpmnCellRenderer extends mxCellRenderer`, injected with `IconPainter`; overrides `createCellOverlays()` (line 30, reimplements the mxGraph method to support `CustomCellOverlay`/`OverlayBadgeShape`), `createShape()` (line 89, injects iconPainter + `overrideCreateSvgCanvas`), `createLabel()` (line 98) | `mxCellRenderer`, `mxDictionary`, `mxImageShape`, `mxRectangle`, `getCellOverlays`, `initializeOverlay`, `installCellOverlayListeners`, `state.overlays`, `graph.dialect` |

### Renderer
| File | Purpose | Main mxGraph APIs used |
|---|---|---|
| `src/component/mxgraph/BpmnRenderer.ts:36` | Converts `RenderedModel` to cells. `insertShapesAndEdges` (line 54) wraps in `batchUpdate` + `model.clear()`; private `insertShape`/`insertEdge`/`insertVertex`/`insertWaypoints`/`insertMessageFlowIconIfNeeded`; `messageFlowIconId()` helper (line 172) | `graph.insertVertex` (lines 96, 138), `graph.insertEdge` (line 119), `graph.getDefaultParent`, `model.getCell`, `model.clear`, `mxPoint`, `cell.geometry.(points/offset/relative/width/height)` |
| `src/component/mxgraph/renderer/CoordinatesTranslator.ts` | BPMN absolute coords -> mxGraph parent-relative coords; `computeRelativeCoordinates` (line ~33), `computeEdgeCenter` (line ~61) | `mxPoint`, `model.getGeometry`, `model.getParent`, `mxCell` |
| `src/component/mxgraph/renderer/StyleComputer.ts:42` | Builds the cell style STRING per BPMN element (see section 3) | `mxConstants.STYLE_*`, `FONT_*` flags |
| `src/component/mxgraph/renderer/style-utils.ts` | Computes CSS class names from the raw style string: `computeAllBpmnClassNamesOfCell` (line ~30, reads `cell.style`), `computeAllBpmnClassNames` (parses `style.split(';')`), `computeBpmnBaseClassName` | `mxCell.style` (string format assumption: `kind;key=value;...`) |

### Config
| File | Purpose | Main mxGraph APIs used |
|---|---|---|
| `src/component/mxgraph/config/StyleConfigurator.ts:118` | Registers default styles in the stylesheet (see section 3). NOT exported from the package anymore (commit dde897426); still exported internally and used by `GraphConfigurator` and `dev/ts/component/ThemedBpmnVisualization.ts` | `graph.getStylesheet()`, `stylesheet.putCellStyle`, `getDefaultVertexStyle`, `getDefaultEdgeStyle`, `StyleMap` type, `mxConstants.STYLE_*`, `mxPerimeter.EllipsePerimeter/RhombusPerimeter` |
| `src/component/mxgraph/config/register-style-definitions.ts` | `registerShapes()` (line ~40): maps all `ShapeBpmnElementKind` + `BpmnStyleIdentifier.EDGE`/`MESSAGE_FLOW_ICON` to custom shape classes via `mxCellRenderer.registerShape(name, class)`; `registerEdgeMarkers()` (line ~95): `mxMarker.addMarker(MarkerIdentifier.ARROW_DASH, dashMarkerFactory)` with a custom canvas-drawing marker factory | `mxCellRenderer.registerShape`, `mxMarker.addMarker`, `mxAbstractCanvas2D`, `mxPoint`, `mxShape`, `mxCell` types |

There is no MarkerConfigurator / ShapeConfigurator class anymore: both were merged into `register-style-definitions.ts` (plain functions).

### Shapes (`src/component/mxgraph/shape/`)
| File | Purpose | Main mxGraph APIs used |
|---|---|---|
| `activity-shapes.ts` | `TaskShape`, `UserTaskShape`, `ServiceTaskShape`, `ReceiveTaskShape`, `SendTaskShape`, `ManualTaskShape`, `ScriptTaskShape`, `BusinessRuleTaskShape`, `CallActivityShape`, `SubProcessShape` extend `mxRectangleShape` | `mxRectangleShape`, `mxUtils.getValue(this.style, BpmnStyleIdentifier.MARKERS/GLOBAL_TASK_KIND/SUB_PROCESS_KIND, ...)`, `mxAbstractCanvas2D` |
| `event-shapes.ts` | `EventShape`, `EndEventShape`, `IntermediateEventShape`, `ThrowIntermediateEventShape` extend `mxEllipse` | `mxEllipse`, `mxUtils.getValue` (EVENT_DEFINITION_KIND, IS_INTERRUPTING), `mxAbstractCanvas2D` |
| `gateway-shapes.ts` | `ExclusiveGatewayShape`, `ParallelGatewayShape`, `InclusiveGatewayShape`, `ComplexGatewayShape`, `EventBasedGatewayShape` extend `mxRhombus` | `mxRhombus`, `mxUtils.getValue` (EVENT_BASED_GATEWAY_KIND), `getBpmnIsInstantiating` |
| `flow-shapes.ts` | `MessageFlowIconShape` extends `mxRectangleShape` (non-initiating envelope icon) | `mxRectangleShape`, `mxUtils.getValue` (IS_INITIATING) |
| `edges.ts:22` | `BpmnConnector extends mxConnector`; overrides `paintEdgeShape` to paint markers with dedicated fill colors (`BpmnStyleIdentifier.EDGE_START_FILL_COLOR`/`EDGE_END_FILL_COLOR`); reimplements `paintEdgeLine` (mxPolyline copy) tweaking `pointerEventsValue` on `mxSvgCanvas2D` | `mxConnector`, `mxSvgCanvas2D.pointerEventsValue`, `mxUtils.getValue`, `createMarker`, `c.setFillColor/setShadow/setDashed` |
| `text-annotation-shapes.ts` | `TextAnnotationShape extends mxRectangleShape` (paints only the left bracket) | `mxRectangleShape`, `mxAbstractCanvas2D` |
| `utils.ts:23` | `overrideCreateSvgCanvas(shape)`: monkey-patches `shape.createSvgCanvas` and `canvas.getTextCss` to (a) force `pointerEvents=false` on labels (#920) and (b) set the `class` attribute + `data-bpmn-id` dataset on the SVG node from `computeAllBpmnClassNamesOfCell` + `BpmnStyleIdentifier.EXTRA_CSS_CLASSES`. This is THE bridge between cell styles and DOM-based registries | `mxShape.createSvgCanvas`, `mxSvgCanvas2D.getTextCss/pointerEvents`, `this.state.cell/style/dialect`, `mxConstants.DIALECT_STRICTHTML` |
| `render/BpmnCanvas.ts` | Canvas wrapper for icon painting (translation/scaling for icons) | `mxAbstractCanvas2D` (full drawing API: begin, moveTo, lineTo, curveTo, arcTo, fillAndStroke...) |
| `render/icon-painter.ts` | `IconPainter` (public, replaceable via `RendererOptions.iconPainter`): paints all BPMN icons; `buildPaintParameter` (line ~71) reads style values | `mxUtils.getValue(shape.style, mxConstants.STYLE_STROKEWIDTH/STYLE_FILLCOLOR/STYLE_STROKECOLOR/STYLE_MARGIN, ...)`, `mxShape`, `mxAbstractCanvas2D` |
| `render/index.ts`, `render/render-types.ts`, `render/utils.ts` | Re-exports / types (ShapeConfiguration, PaintParameter) / marker ordering. No direct mx API except types | none / indirect |

### Overlays (`src/component/mxgraph/overlay/`)
| File | Purpose | Main mxGraph APIs used |
|---|---|---|
| `custom-overlay.ts:38` | `CustomCellOverlay extends mxCellOverlay` with label + style; overrides `getBounds(state)` reimplementing edge/shape positioning | `mxCellOverlay`, `mxPoint`, `mxRectangle`, `mxConstants.ALIGN_*`, `state.view.scale`, `state.absolutePoints` |
| `shapes.ts` | `OverlayBadgeShape extends mxText` (positional-arg mega-constructor, sets `fillOpacity`, `strokewidth`) | `mxText` |
| `converter.ts` | Converts public `Overlay` API type to `CustomCellOverlayOptions` (positions, fill/stroke/font defaults from `StyleDefault`) | none directly |
| `updater.ts` | `OverlaysUpdater`: add/remove overlays on cells | `graph.getModel().getCell`, `graph.addCellOverlay`, `graph.removeCellOverlays` |

### Style runtime (`src/component/mxgraph/style/`)
| File | Purpose | Main mxGraph APIs used |
|---|---|---|
| `identifiers.ts:25` | `BpmnStyleIdentifier` (custom style keys, see section 3) + `MarkerIdentifier.ARROW_DASH` (line 54). Public API (`@experimental`) | none (string constants) |
| `utils.ts` | `StyleDefault` (public theme defaults), `getBpmnIsInstantiating`, `setStyle`, `setStyleFlag`, `updateStroke`, `updateFont`, `updateFill`, `getStyleValue`, gradient direction conversion | `mxUtils.getValue/setStyle/setStyleFlag`, `mxConstants.STYLE_*`, `FONT_*`, `DIRECTION_*` |
| `style-updater.ts:41` | `StyleUpdater` + internal `StyleManager` (line 99): runtime `updateStyle`/`resetStyle` with original-style cache (see section 3) | `graph.getModel`, `model.getCell/setStyle`, `cell.getStyle/getId`, `graph.batchUpdate`, `mxConstants.STYLE_OPACITY` |
| `css-classes-updater.ts:35` | `CssClassesUpdater`: writes `BpmnStyleIdentifier.EXTRA_CSS_CLASSES` into the cell style (DOM refresh happens via `overrideCreateSvgCanvas`) | `graph.getModel`, `model.getCell/setStyle`, `cell.getStyle` |
| `index.ts` | Re-exports `StyleDefault` + identifiers | none |

### Navigation
| File | Purpose | Main mxGraph APIs used |
|---|---|---|
| `src/component/navigation.ts:53` | `NavigationImpl` (public `Navigation` interface at line 37) + internal `ZoomSupport` (line 122). See section 4 | `mxEvent.PAN_START/PAN_END/isLeftMouseButton/isMultiTouchEvent/addMouseWheelListener/removeListener/isConsumed/consume`, `graph.panningHandler` (`addListener`, `usePopupTrigger`, `isForcePanningEvent`, `setPinchEnabled`, `destroy`), `graph.setPanning`, `graph.fit`, `graph.zoomIn/zoomOut/zoomActual/zoomFactor/border`, `graph.getGraphBounds`, `view.scale/translate/scaleAndTranslate`, `mxMouseEvent` type |

### Registry bridge (`src/component/registry/`)
| File | Purpose | Main mxGraph APIs used |
|---|---|---|
| `bpmn-elements-registry.ts:~30` | Aggregates registries; `createNewBpmnElementsRegistry(bpmnModelRegistry, graph)` wires `graph.container` into `HtmlElementRegistry` and passes `graph` to css/overlays/style registries | `graph.container` only (everything else delegated) |
| `css-registry.ts:24` | `CssClassesRegistryImpl` -> `createNewCssClassesUpdater(graph)` (`src/component/mxgraph/style/css-classes-updater.ts`) | indirect |
| `style-registry.ts:23` | `StyleRegistryImpl` -> `createNewStyleUpdater(graph)` (`src/component/mxgraph/style/style-updater.ts`) | indirect |
| `overlays-registry.ts` | `OverlaysRegistry` -> `createNewOverlaysRegistry(graph)` (`src/component/mxgraph/overlay/updater.ts`) | indirect |
| `query-selectors.ts:~45` | CSS selectors `svg > g > g > g[data-bpmn-id=...]`; the doc comment (lines 17-55) documents the 4-`<g>` SVG structure generated by mxGraphView (background/elements/overlays/decorators). maxGraph keeps the same structure but verify | depends on mxGraph DOM output |
| `types.ts` | Public registry types; JSDoc mentions mxGraph behaviors (e.g. `StyleRegistry#updateStyle` doc updated by dde897426 to explain style replacement now that StyleConfigurator is not exported) | none (types only) |
| `bpmn-model-registry.ts`, `bpmn-model-filters.ts`, `index.ts` | mxGraph-free | none |

### Others
| File | Purpose | Main mxGraph APIs used |
|---|---|---|
| `src/component/version.ts:17` | `getVersion()` reports `dependencies: new Map([['mxGraph', mxClient.VERSION]])` (line ~29) | `mxClient.VERSION` |
| `src/component/BpmnVisualization.ts:48` | Public facade: `readonly graph: BpmnGraph` (experimental), `navigation`, `bpmnElementsRegistry`; `load()` calls `navigation.fit(options?.fit)` (line 102); `dispose()` calls `graph.destroy()` (line 119) | `graph.destroy` |
| `src/component/extension/bpmn-in-color/style-extension.ts:25` | BPMN-in-Color style extension: sets `mxConstants.STYLE_FONTCOLOR/STYLE_FILLCOLOR/STYLE_SWIMLANE_FILLCOLOR/STYLE_STROKECOLOR` into StyleComputer style maps | `mxConstants` |
| `src/bpmn-visualization.ts` | Package entry (see section 5) | triple-slash typed-mxgraph reference, `export { mxgraph }` |

### dev/ demo (not shipped, but must compile)
| File | Purpose | Main mxGraph APIs used |
|---|---|---|
| `dev/ts/component/SvgExporter.ts:17-19` | SVG export demo | `mxgraph.mxImageExport` (namespace access, since `mxImageExport` is no longer re-exported after dde897426), `mxClient.IS_FF`, `mxUtils.getXml/createXmlDocument/extractTextWithWhitespace/trim`, `mxConstants.NS_SVG`, `class CanvasForExport extends mxSvgCanvas2D`, `mxGraph` type |
| `dev/ts/component/ThemedBpmnVisualization.ts:18-19` | Custom theme demo: imports `StyleConfigurator` directly from `src/component/mxgraph/config/StyleConfigurator` (deep import since dde897426) and `mxConstants` from the initializer; mutates stylesheet StyleMaps | `mxConstants.STYLE_STROKECOLOR/STYLE_FILLCOLOR`, `graph.getStylesheet()` |
| `dev/ts/component/CustomIconPainter.ts` | extends `IconPainter` (lib API, no direct mx) | indirect |

---

## 3. STYLE SYSTEM

### 3a. StyleComputer (style string construction at render time)

`src/component/mxgraph/renderer/StyleComputer.ts` (fully read). Structure:

- Class `StyleComputer` (line 42), constructed with `RendererOptions` (line 46): `ignoreLabelStyles` flag + hardcoded `styleExtensions` list (`bpmnInColorStyleExtension` when `ignoreBpmnColors === false`, line 51, see ADR 001).
- `computeStyle(bpmnCell, labelBounds): string` (line 54): starts with `[bpmnCell.bpmnElement.kind]` as the first style entry (the registered style/shape name), appends edge base styles (sequenceFlowKind / associationDirectionKind, lines 150-162), then key=value entries from three maps:
  - `computeShapeStyleValues` (line 72): events -> `BpmnStyleIdentifier.EVENT_DEFINITION_KIND` + `IS_INTERRUPTING` (lines 127-133); activities -> `SUB_PROCESS_KIND`, `IS_INSTANTIATING` (receive task), `GLOBAL_TASK_KIND`, `MARKERS` (lines 135-148); pool/lane -> `mxConstants.STYLE_HORIZONTAL` inverted vs BPMN `isHorizontal` (line 84); event-based gateway -> `IS_INSTANTIATING` + `EVENT_BASED_GATEWAY_KIND` (lines 86-87). Extension hook `enrichShapeStyle` (line 90).
  - `computeFontStyleValues` (line 103): `STYLE_FONTFAMILY`, `STYLE_FONTSIZE`, `STYLE_FONTSTYLE` (via `getFontStyleValue`, line 201: sums `mxConstants.FONT_BOLD/FONT_ITALIC/FONT_STRIKETHROUGH/FONT_UNDERLINE`).
  - `computeLabelStyleValues` (line 164): `STYLE_VERTICAL_ALIGN=ALIGN_TOP`, `STYLE_ALIGN=ALIGN_CENTER`, `STYLE_LABEL_WIDTH=labelBounds.width+1`, `STYLE_LABEL_POSITION='ignore'` (undocumented mxGraph behavior, comment lines 178-181, links to mxGraphView.js#L1183-L1252), `STYLE_VERTICAL_LABEL_POSITION=ALIGN_MIDDLE`.
- `computeMessageFlowIconStyle(edge)` (line 116): `shape=bpmn.messageFlowIcon;bpmn.isInitiating=...`.
- Serialization: `toArrayOfMxGraphStyleEntries` (line 218) -> `key=value` joined with `;`. The whole system is STRING based (maxGraph 0.x uses `CellStyle` objects: this is the biggest migration surface).

`BpmnStyleIdentifier` keys (`src/component/mxgraph/style/identifiers.ts:25-46`): `bpmn.edge`, `bpmn.edge.startFillColor`, `bpmn.edge.endFillColor`, `bpmn.gatewayKind`, `bpmn.eventDefinitionKind`, `bpmn.globalTaskKind`, `bpmn.subProcessKind`, `bpmn.isInitiating`, `bpmn.isInstantiating`, `bpmn.isInterrupting`, `bpmn.extra.css.classes`, `bpmn.markers`, `bpmn.messageFlowIcon`. Plus `MarkerIdentifier.ARROW_DASH = 'bpmn.dash'` (line 54).

mxConstants used by StyleComputer: `STYLE_HORIZONTAL`, `STYLE_FONTFAMILY`, `STYLE_FONTSIZE`, `STYLE_FONTSTYLE`, `STYLE_VERTICAL_ALIGN`, `STYLE_ALIGN`, `STYLE_LABEL_WIDTH`, `STYLE_LABEL_POSITION`, `STYLE_VERTICAL_LABEL_POSITION`, `ALIGN_TOP`, `ALIGN_CENTER`, `ALIGN_MIDDLE`, `FONT_BOLD`, `FONT_ITALIC`, `FONT_STRIKETHROUGH`, `FONT_UNDERLINE`.

### 3b. StyleConfigurator (default styles registration)

Lives in `src/component/mxgraph/config/StyleConfigurator.ts:118`. Since commit dde897426 it is NO LONGER exported from `src/bpmn-visualization.ts` (it remains `@experimental` in source but the export was removed); it is instantiated only by `GraphConfigurator.configure()` (`src/component/mxgraph/GraphConfigurator.ts:44`) and deep-imported by the dev demo (`dev/ts/component/ThemedBpmnVisualization.ts:18`).

Registration mechanism: `graph.getStylesheet().putCellStyle(name, StyleMap)`:
- default vertex style (line 146): `STYLE_ABSOLUTE_ARCSIZE`, `STYLE_ARCSIZE` + common font/fill/stroke (`configureCommonDefaultStyle`, line 274, includes `STYLE_WHITE_SPACE='wrap'`).
- pool/lane (lines 154-179): `STYLE_SHAPE=mxConstants.SHAPE_SWIMLANE`, `STYLE_STARTSIZE`, `STYLE_SWIMLANE_LINE`.
- events (line 181): `STYLE_SHAPE=<kind>`, `STYLE_PERIMETER=mxPerimeter.EllipsePerimeter`, gateways (line 228): `mxPerimeter.RhombusPerimeter` (function references stored in the StyleMap).
- text annotation (192), group (203), activities (217).
- default edge style (line 244): `STYLE_SHAPE=BpmnStyleIdentifier.EDGE`, `delete style[STYLE_ENDARROW]`.
- flow-specific styles via `MapWithDefault` maps (lines 37-108): `specificFlowStyles` (sequence/message/association: `STYLE_ENDARROW=ARROW_BLOCK_THIN`, `STYLE_DASHED`, `STYLE_DASH_PATTERN`, `STYLE_STARTARROW=ARROW_OVAL`, custom `BpmnStyleIdentifier.EDGE_START/END_FILL_COLOR`), `specificSequenceFlowStyles` (default flow -> `STYLE_STARTARROW=MarkerIdentifier.ARROW_DASH`; conditional -> `ARROW_DIAMOND_THIN`), `specificAssociationFlowStyles` (`ARROW_OPEN_THIN`).

Shape and marker registration is in `src/component/mxgraph/config/register-style-definitions.ts` (called by GraphConfigurator lines 45-46): `mxCellRenderer.registerShape` for the 23 shape names, `mxMarker.addMarker('bpmn.dash', dashMarkerFactory)`.

### 3c. Runtime style updates

- `src/component/mxgraph/style/style-updater.ts`: `createNewStyleUpdater(graph)` (line 30) builds `StyleUpdater` + private `StyleManager` (line 99). `updateStyle` (line 51): resolves cells (`model.getCell`), including the companion message flow icon cell (`withCellIdsOfMessageFlowIcons`, line 35, uses `messageFlowIconId()` from BpmnRenderer), wraps in `graph.batchUpdate`, caches the original style (`StyleManager.ensureStyleIsStored`, line 135), then mutates the style string via `setStyle/updateStroke/updateFont/updateFill` (from `style/utils.ts`) and `model.setStyle(cell, cellStyle)`. `resetStyle` (line 85): restores the cached style while preserving `bpmn.extra.css.classes` (`StyleManager.resetStyle`, line 126).
- `src/component/mxgraph/style/css-classes-updater.ts`: `CssClassesUpdater.updateAndRefreshCssClassesOfCell` (line 38) sets `BpmnStyleIdentifier.EXTRA_CSS_CLASSES` in the cell style via `model.setStyle`; the DOM class refresh happens because changing the style triggers re-render through the patched `createSvgCanvas` (`src/component/mxgraph/shape/utils.ts:23`).
- Callers in `src/component/registry/`:
  - `style-registry.ts:23`: `createNewStyleRegistry(graph)` -> `StyleRegistryImpl` wraps `StyleUpdater` (`clearCache` -> `styleUpdater.clear()`, `updateStyle`, `resetStyle`).
  - `css-registry.ts:24`: `createNewCssRegistry(graph)` -> `CssClassesRegistryImpl` wraps `CssClassesUpdater` + a class-name cache.
  - Both are aggregated by `BpmnElementsRegistry` (`bpmn-elements-registry.ts`), which clears the caches on each model load via `registerOnLoadCallback`.

---

## 4. NAVIGATION / FIT

Navigation lives in `src/component/navigation.ts` (consolidated module, commit 6b3b4b25c; `dispose` added by 9e5bd8a43).

- Public `Navigation` interface (line 37): `fit(options?)`, `zoom(type)`.
- `NavigationImpl` (line 53): delegates to internal `ZoomSupport`; `configure()` (line 72) sets up panning (`graph.panningHandler.addListener(mxEvent.PAN_START/PAN_END)`, `usePopupTrigger = false`, custom `isForcePanningEvent` using `mxEvent.isLeftMouseButton/isMultiTouchEvent`, `graph.setPanning(true|false)`, `panningHandler.setPinchEnabled(false)`); `dispose()` (line 67) calls `zoomSupport.dispose()` + `graph.panningHandler.destroy()`.
- `createNewNavigation(graph, options)` factory (line 107), called from `BpmnVisualization` constructor (`src/component/BpmnVisualization.ts:83`); `load()` ends with `this.navigation.fit(options?.fit)` (line 102).
- `ZoomSupport` (line 122):
  - constructor sets `graph.zoomFactor = 1.25` (line 127).
  - `fit(fitOptions)` (line 155): ALWAYS calls `zoomActual()` first (zoom/fit reset, issue #888); `FitType.None`/undefined -> return; `FitType.Center` (line 166): own computation from `graph.getGraphBounds()`, `graph.container.clientWidth/Height`, `view.scale`, maxScale 3, then `graph.view.scaleAndTranslate(scale, tx, ty)` (line 178); other types (Horizontal/Vertical/HorizontalVertical) -> `graphFit()` (line 130) which calls **`this.graph.fit(border, keepOrigin, margin, enabled, ignoreWidth, ignoreHeight, maxHeight)`** (line 131), i.e. the built-in `mxGraph.fit` with its 7-argument signature, and tracks the returned scale.
  - `zoomIn/zoomOut/zoomActual` (lines 140-153): `graph.zoomIn()`, `graph.zoomOut()`, `graph.zoomActual()`, each re-reading `graph.view.scale`.
  - Mouse wheel zoom (lines 201-276): `mxEvent.addMouseWheelListener(listener, graph.container)`, debounce/throttle from es-toolkit, `mxEvent.isConsumed/consume`, zoom-to-cursor via `graph.view.scaleAndTranslate(newScale, view.translate.x + dx, view.translate.y + dy)` (line 235), delta math copied from mxGraph.js#L8074-L8085 (comment line 257). `dispose()` (line 212) removes listeners with `mxEvent.removeListener(container, 'wheel', listener)`.
- `BpmnGraph` custom fit/zoom overrides: NONE. `BpmnGraph` does not override `fit`/`zoom*`; it only overrides `createGraphView`/`createCellRenderer` and the view's `getFloatingTerminalPoint` (`src/component/mxgraph/BpmnGraph.ts:75,87,110`).

Complete fit/zoom/view API call list:
| API | Call sites |
|---|---|
| `graph.fit(border, keepOrigin, margin, enabled, ignoreWidth, ignoreHeight, maxHeight)` | `src/component/navigation.ts:131` |
| `graph.zoomActual()` | `src/component/navigation.ts:141` |
| `graph.zoomIn()` / `graph.zoomOut()` | `src/component/navigation.ts:146,151` |
| `graph.zoomFactor` (write) | `src/component/navigation.ts:127` |
| `graph.border` (read, passed to fit) | `src/component/navigation.ts:197` |
| `graph.getGraphBounds()` | `src/component/navigation.ts:170` |
| `graph.view.scale` (read) | `src/component/navigation.ts:137,173,174,264,274` |
| `graph.view.translate` (read) | `src/component/navigation.ts:235` |
| `graph.view.scaleAndTranslate(scale, tx, ty)` | `src/component/navigation.ts:178,235` |
| `graph.setPanning`, `graph.panningHandler.*` | `src/component/navigation.ts:69,73-94` |
| `mxEvent.addMouseWheelListener/removeListener/isConsumed/consume/isLeftMouseButton/isMultiTouchEvent/PAN_START/PAN_END` | `src/component/navigation.ts:76,77,82,93,208,215,223,236` |

Fit integration tests (commit d9faaaa60, `test/integration/diagram.navigation.test.ts`) assert the mxGraphView calls:
- spies on `view.getGraphBounds` (mocked with `mxRectangle`, line 54), `view.scaleAndTranslate` (line 56), `view.setScale` (line 57); asserts `view.scale` values, `scaleAndTranslate` exact args for Center (lines 99-128) and for the delegating types (lines 137-174, expected scale/translate table including margin and max-scale-8 capping), and that `setScale` is never called. The test comment (lines 40-42) explicitly says it reproduces the approach of the maxGraph `FitPlugin` tests.

maxGraph impact: maxGraph 0.21.0 moved `fit()` to a `FitPlugin`; `graph.fit` at `navigation.ts:131` must become `graph.getPlugin('fit').fit(...)` (or equivalent), and panning relies on `PanningHandler` being registered as a plugin. The zoom-related members (`zoomIn/zoomOut/zoomActual/zoomFactor`) and `getGraphBounds`/`view.scaleAndTranslate` must be checked against the 0.23.0 API (zoom may also be plugin-based in recent versions; verify against the maxGraph 0.23.0 changelog).

---

## 5. PUBLIC API

Package entry: `src/bpmn-visualization.ts`.

mxGraph-related exports:
- `src/bpmn-visualization.ts:21`: `/// <reference types="@typed-mxgraph/typed-mxgraph" preserve="true"/>` - the generated `.d.ts` requires consumers to resolve typed-mxgraph types (it is a runtime `dependency` in package.json for this reason).
- `src/bpmn-visualization.ts:30`: `export type { BpmnGraph }` - the class extends `mxGraph`, so its public type surface exposes the whole mxGraph type (typed-mxgraph).
- `src/bpmn-visualization.ts:34`: `export * from './component/mxgraph/style'` -> `StyleDefault`, `BpmnStyleIdentifier`, `MarkerIdentifier` (string constants, theme customization).
- `src/bpmn-visualization.ts:35`: `export * from './component/mxgraph/shape/render'` -> `IconPainter`, `BpmnCanvas`, `PaintParameter`, `IconStyleConfiguration`, etc. (`IconPainter` methods take `mxAbstractCanvas2D`-based `BpmnCanvas`).
- `src/bpmn-visualization.ts:38`: `export { mxgraph } from './component/mxgraph/initializer'` - the raw mxGraph namespace (`mxGraphExportObject`), documented `@since 0.30.0` for advanced users (`initializer.ts:19-34`).
- `BpmnVisualization.graph: BpmnGraph` experimental property (`src/component/BpmnVisualization.ts:48`).
- `Navigation` interface (`src/bpmn-visualization.ts:29` -> `src/component/navigation.ts:37`): mxGraph-free signature, safe.
- NOT exported since dde897426: `StyleConfigurator` and `mxImageExport` (removed from `initializer.ts` destructuring and from the entry point).

What breaks for library users on maxGraph migration:
1. `export { mxgraph }` disappears entirely (no factory/namespace in maxGraph). Users calling `mxgraph.mxClient`, `mxgraph.mxUtils`, etc. break.
2. `@typed-mxgraph/typed-mxgraph` dependency and the triple-slash reference are removed; maxGraph ships its own types. Any user code importing `from 'mxgraph'` types against our `BpmnGraph` breaks.
3. `BpmnGraph` type changes base class (`mxGraph` -> maxGraph `Graph`/`BaseGraph`): the experimental `bpmnVisualization.graph` property keeps existing but every method/property users call on it follows maxGraph naming (e.g. `getModel()` -> `getDataModel()`, style strings -> `CellStyle` objects).
4. Theme customization contract changes: `BpmnStyleIdentifier`/`StyleDefault` keys remain ours, but users who write raw style strings or `StyleMap` objects (as in `ThemedBpmnVisualization` and the published examples) must move to maxGraph `CellStyle` objects and new constant names.
5. `IconPainter`/`BpmnCanvas` public types reference `mxAbstractCanvas2D`; custom icon painters need a (mechanical) type swap to `AbstractCanvas2D`.
6. `getVersion()` will report a `maxGraph` dependency entry instead of `mxGraph` (`src/component/version.ts`).

---

## 6. TESTS

### test/unit (jsdom not needed except where noted; config `test/unit/jest.config.cjs`)
| File | What it asserts |
|---|---|
| `test/unit/component/mxgraph/renderer/StyleComputer.test.ts` | The exact computed style STRINGS for every BPMN kind/marker/font/label-bounds combination (e.g. `'userTask;bpmn.markers=...;fontFamily=...'`); imports `StyleComputer` directly. Largest style-string assertion surface; must be rewritten for `CellStyle` objects |
| `test/unit/component/mxgraph/renderer/style-utils.test.ts` | `computeBpmnBaseClassName` and `computeAllBpmnClassNames` from raw style-string inputs |
| `test/unit/component/mxgraph/style/utils.test.ts` | `getStyleValue` parsing of `key=value;` style strings, `BpmnStyleIdentifier` keys |
| `test/unit/component/mxgraph/BpmnRenderer.test.ts` | `isLabelBoundsIgnored` only (pure logic, no mx API) |
| `test/unit/component/mxgraph/overlay/converter.test.ts` | `OverlayConverter` position/style conversion (no mx API) |
| `test/unit/component/mxgraph/shape/render/BpmnCanvas.test.ts` | `BpmnCanvas` translation/scaling math against a mocked `mxAbstractCanvas2D` |
| `test/unit/component/mxgraph/shape/render/utils.test.ts` | `orderActivityMarkers` (no mx API) |
| `test/unit/component/extension/bpmn-in-color/style-extension.test.ts` | Style maps populated with `mxConstants.STYLE_*` keys by the color extension |
| `test/unit/component/version.test.ts:34` | `getVersion().dependencies.get('mxGraph')` is defined |

### test/integration (jsdom env: `test/integration/jest.config.cjs:24` "mxgraph initialization needs to access to the window object")
| File | What it asserts |
|---|---|
| `test/integration/config/mxgraph-config.ts:21` | Setup file (registered in `jest.config.cjs:40`): `mxClient.NO_FO = false` to force ForeignObject support under jsdom |
| `test/integration/helpers/model-expect.ts` | Registers all `toBeXxx` jest matchers; typed with `mxCell`/`mxGeometry` from 'mxgraph'; builds received cells from the live graph model |
| `test/integration/matchers/matcher-utils.ts` | Core matcher machinery: `getCell` via `graph.getModel().getCell`, raw `cell.style` string, resolved model style via `graph.getCellStyle(cell)` (`buildReceivedResolvedModelCellStyle`, line ~181), view-state style via `graph.getView().getState(cell).style` (`buildReceivedViewStateStyle`, line ~167), geometry comparisons, overlay expectations |
| `test/integration/matchers/toBeCell/index.ts`, `toBeShape/index.ts`, `toBeEdge/index.ts` | Cell existence, parent + `mxGeometry` (incl. waypoints as `mxPoint[]`), per-kind style assertions (font, markers, kind-specific `bpmn.*` entries) |
| `test/integration/mxGraph.model.bpmn.elements.test.ts:39` | Imports `mxConstants, mxGeometry, mxPoint` from `@lib/component/mxgraph/initializer`; asserts the full mxGraph model after parse+render: geometry, waypoints (`new mxPoint(...)`, line 1593), label offsets, arrow constants (`mxConstants.ARROW_DIAMOND_THIN`, line 1494) |
| `test/integration/mxGraph.model.bpmn.colors.test.ts` | Model styles when `ignoreBpmnColors: false` (BPMN-in-Color extension values in cell styles) |
| `test/integration/mxGraph.model.css.api.test.ts` | `bpmn.extra.css.classes` entries in cell styles after add/remove/toggle CSS class API calls |
| `test/integration/mxGraph.model.style.api.test.ts` | Cell style strings after `updateStyle`/`resetStyle` (shapes lines 26+, edges 391+, message flow icons 586+) |
| `test/integration/cross.css.and.style.api.test.ts` | Interaction between CSS classes API and style API on the same cells |
| `test/integration/diagram.navigation.test.ts` | Fit/zoom: spies on `view.getGraphBounds`/`scaleAndTranslate`/`setScale`, asserts exact scale/translate (see section 4) |
| `test/integration/BpmnVisualization.test.ts` | `graph.container` filling by mxGraph (lines 120-121), `dispose()` -> `graph.container` null + emptied DOM (125-126), custom `IconPainter` injection |

### test/e2e and shared helpers
| File | What it asserts |
|---|---|
| `test/e2e/diagram.navigation.zoom.pan.test.ts` | Visual regression (image snapshots) of fit/zoom/pan in a real browser; only a comment references mxGraph source (line 197) |
| `test/shared/visu/bpmn-page-utils.ts:50,65` | Waits for the mxGraph-generated SVG structure in the DOM (initialization + `data-bpmn-id` elements) |
| `test/typescript-support/src/index.ts:19` | Validates the published npm package types: `import type { mxStylesheet } from 'mxgraph'`, `const graph: BpmnGraph = bpmnVisualization.graph`, `graph.getStylesheet()`. Directly exercises the typed-mxgraph triple-slash chain; will need a maxGraph equivalent |

---

## 7. BUILD CONFIG

- `package.json:107` `"@typed-mxgraph/typed-mxgraph": "~1.0.8"` and `package.json:110` `"mxgraph": "4.2.2"` (both in `dependencies`; typed-mxgraph must be a runtime dep because of the triple-slash reference in the published `.d.ts`). No mxgraph-specific npm scripts.
- `vite.config.js:50` `manualChunks`: `if (id.includes('node_modules/mxgraph')) return 'lib-mxgraph';` (dedicated chunk to track dependency size in the demo); `vite.config.js:57` `chunkSizeWarningLimit: 838, // mxgraph`.
- `rollup.config.mjs`: no explicit mxgraph entry; dependencies are externalized via `rollup-plugin-node-externals` (`rollup.config.mjs:22,80`), so mxgraph stays external in the npm bundles. Replacing the dep with `@maxgraph/core` is transparent here, but bundle-size tracking values will change (maxGraph is tree-shakeable, mxgraph is a monolith).
- Jest configs (`test/unit/jest.config.cjs`, `test/integration/jest.config.cjs`, `test/e2e/jest.config.cjs`): `transform` = ts-jest with `tsconfig.test.json`; shared `moduleNameMapper` from `test/config/ts-jest.cjs` (maps the `@lib`/`@test` path aliases from `tsconfig.test.json` `paths`, nothing mxgraph-specific); NO `transformIgnorePatterns` override (mxgraph is CJS so it needs no transform; maxGraph is ESM, so `transformIgnorePatterns`/ESM handling may need adjustment). mxgraph-specific bits: `test/integration/jest.config.cjs:24` (`testEnvironment: 'jsdom'` for mxgraph window access) and `:40` (setup file `./test/integration/config/mxgraph-config.ts`).
- tsconfig files (`tsconfig.json`, `tsconfig.test.json`, `tsconfig.npm-package.json`, `tsconfig.typedoc.json`): NO `typeRoots`/`types` entries for typed-mxgraph; the types are wired only through the triple-slash directive in `src/bpmn-visualization.ts:21` plus normal node resolution.
- `.eslintrc.cjs:62-63`: two rules disabled because of mxGraph code (`unicorn/no-null`: "We don't know the impact on mxGraph code"; `unicorn/no-useless-undefined`: "useful where we ... change some mxGraph code"). No mxgraph import restrictions configured.

---

## 8. RECENT PREP REFACTORS (from `git log --oneline -40`)

Commits touching the mxgraph layer, most recent first (`git show --stat`):

- `dde897426` refactor!: stop exporting StyleConfigurator and mxImageExport (#3528)
  - `src/bpmn-visualization.ts` (export removed), `src/component/mxgraph/initializer.ts` (mxImageExport removed from destructuring), `src/component/registry/types.ts` (JSDoc), `dev/ts/component/SvgExporter.ts`, `dev/ts/component/ThemedBpmnVisualization.ts`, `dev/ts/shared/main.ts` (switched to deep imports / `mxgraph.mxImageExport`), 2 workflows.
  - Shrinks the public API surface that must be re-expressed in maxGraph terms.
- `d9faaaa60` test(fit): assert mxGraphView calls in the fit integration tests (#3527)
  - `test/integration/diagram.navigation.test.ts` (+151): the fit tests now spy on `view.getGraphBounds/scaleAndTranslate/setScale`, mirroring the maxGraph FitPlugin test approach, so the future FitPlugin-based implementation can be verified against the same expectations.
- `bc8de315f` refactor: extract insertEdge private method in BpmnRenderer (#3524)
  - `src/component/mxgraph/BpmnRenderer.ts` only: isolates the `graph.insertEdge` + waypoints + label geometry block (single place to adapt to the maxGraph `insertEdge` options-object signature).
- `382b0bd61` ci: restore running e2e tests on chrome macos (#3458)
  - `.github/workflows/test-e2e.yml`, `test/e2e/bpmn.rendering.ignore.options.test.ts` (CI only, no mxgraph code).

Slightly older but directly migration-relevant (same `git log -40` window):

- `fee41ab8e` refactor: introduce internal extension mechanism for BPMN extensions (#3519): extracted BPMN-in-Color out of `StyleComputer` into `src/component/extension/bpmn-in-color/style-extension.ts` + `extension-points.ts` (ADR 001), reducing StyleComputer churn for the migration.
- `1e52d6a0a` chore!: prefer interfaces over types for public type definitions (#3517): touched `BpmnGraph.ts`, `icon-painter.ts`, `registry/types.ts`, `options.ts` (public typings cleanup before the type-system switch).
- `cefb908ed` refactor: remove "Bpmn" prefix from renderer ignore option names (#3484): `BpmnRenderer.ts`, `StyleComputer.ts`, `options.ts`.
- `993603bab` refactor: export mxGraph objects directly instead of via mxgraph namespace (#3491): rewrote `initializer.ts` to destructured exports and updated all internal call sites (`BpmnCellRenderer`, `BpmnGraph`, `register-style-definitions`, overlays, shapes, `SvgExporter`, one integration test). This makes the future find/replace to `@maxgraph/core` named imports mechanical.
- Also relevant context from file history: `4d7525d45` (IconPainter via constructor options, origin of the `pendingIconPainter` workaround in `BpmnGraph.ts`), `9e5bd8a43` (dispose method), `6b3b4b25c` (navigation consolidated into `src/component/navigation.ts`).
