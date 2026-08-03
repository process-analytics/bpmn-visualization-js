# Task: POC Bonita connector BPMN extension, phase 1 (feasibility study)

Paint an icon on the top-right of a task when it has connectors. Always active (like BPMN in Color was before
configurability). The implementation must stay extractable to a separate library.

Branch: `poc/bpmn_extension_bonita_connector`. No reporting to `master`.

## KEY UNKNOWN: where to branch the semantic parsing hook

**Resolved. A new extension point is required, and a new model carrier for its output.**

### Why the existing hook cannot work

`ParsingExtensionPoint.onShapeDeserialized(shape: Shape, bpmnShape: BPMNShape)` is called from
`DiagramConverter.deserializeShape` (`src/component/parser/json/converter/DiagramConverter.ts:133`), during the
**diagram interchange** phase. It receives:
- `shape: Shape`, whose `bpmnElement` is the already-built, **typed** `ShapeBpmnElement`. It has no `implementation`
  property and no reference to the raw semantic JSON.
- `bpmnShape: BPMNShape`, the raw **DI** object. It carries `id`, `bpmnElement`, `Bounds`, `BPMNLabel`, and the
  BPMN in Color attributes. It never carries semantic attributes such as `implementation`.

`implementation="BonitaConnector"` lives on the raw semantic `model:serviceTask`, consumed only by
`ProcessConverter`. Nothing in the pipeline carries it forward: `ConvertedElements` stores built
`ShapeBpmnElement` instances (`src/component/parser/json/converter/utils.ts:64`), not the raw JSON.

### The precise branch point

`ProcessConverter.buildFlowNodeBpmnElements` (`ProcessConverter.ts:190-211`) is the only place where a raw
`TFlowNode` and its freshly built `ShapeBpmnElement` coexist:

```ts
for (const bpmnElement of ensureIsArray(bpmnElements)) {
  const shapeBpmnElement = this.buildFlowNodeBpmnElement(kind, bpmnElement, parentId, processedSemanticType);
  // ...
  if (shapeBpmnElement) {
    this.convertedElements.registerFlowNode(shapeBpmnElement);   // <-- hook goes just before/after this
    // ...
  }
}
```

Proposed signature, mirroring the naming of the existing hooks:

```ts
interface ParsingExtensionPoint {
  /** Called after a flow node has been converted from the BPMN semantic XML. */
  onFlowNodeConverted?(shapeBpmnElement: ShapeBpmnElement, bpmnElement: TFlowNode): void;
}
```

### Where the parsed result is stored: 3 options

The style extension point receives `Shape` and reads `shape.extensions` (`ShapeExtensions`). But at semantic
parsing time `Shape` does not exist yet, only `ShapeBpmnElement`.

| Option | Mechanism | Assessment |
|---|---|---|
| **A. New extensions carrier on `ShapeBpmnElement`** | Add `readonly extensions: ShapeBpmnElementExtensions = {}` to `ShapeBpmnElement`, augmented by the extension. Style extension reads `shape.bpmnElement.extensions.bonita?.hasConnector`. | **CONFIRMED BY THE USER.** Symmetric with `Shape.extensions` (`Shape.ts:26`), zero state in the extension, honours the ADR's module-augmentation approach, and models the real distinction between semantic and DI extensions. Cost: one new empty interface plus one field on a core model class. |
| B. Side map inside the extension | `onFlowNodeConverted` records ids in a `Set`, `onShapeDeserialized` reads it to fill `shape.extensions`. | Rejected. Gives the extension mutable state across parses (leaks between `load()` calls), and relies on hook ordering (semantic before DI, true today but unguaranteed). |
| C. Keep raw JSON in `ConvertedElements` | Store the raw `TFlowNode` per id so a DI-phase hook can read it. | Rejected. Enlarges core memory footprint and the core API for one extension's benefit. |

**ADR deviation to record:** ADR 001 states the parsing extension point is "called at the end of the existing
parsing pipeline in converters (`DiagramConverter`, `ProcessConverter`, potentially others)", but the interface it
specifies only has DI-shaped hooks. The semantic hook and the semantic extensions carrier are both missing.

## Codebase Context

### Parsing pipeline

- `src/component/parser/json/converter/ProcessConverter.ts:190` `buildFlowNodeBpmnElements` — the semantic loop, hook target.
- `ProcessConverter.ts:213` `buildFlowNodeBpmnElement` — dispatches by kind; service tasks land in `buildShapeBpmnActivity` (`:239`) and produce a plain `ShapeBpmnActivity` (`:249`). `implementation` is read nowhere today.
- `src/component/parser/json/converter/DiagramConverter.ts:48` — `private readonly parsingExtensions: ParsingExtensionPoint[] = [bpmnInColorParsingExtension]`, the hardcoded internal registration. The connector parsing extension is added to this array for the POC.
- `DiagramConverter.ts:133` / `:157` / `:171` — the three existing call sites.
- `src/component/parser/json/converter/utils.ts:36` `ConvertedElements`, `:64-68` flow node registry.

### JSON model: no augmentation needed, but a typing obstacle

- `src/model/bpmn/json/baseElement/flowNode/activity/task.ts:43` — `TServiceTask extends TTask` already declares `implementation?: tImplementation` and `operationRef?: string`. **No JSON model augmentation is required** (unlike BPMN in Color, which had to declare non-standard DI attributes).
- **Obstacle:** `tImplementation` (`src/model/bpmn/json/baseElement/rootElement/globalTask.ts:46`) is an **enum** with only `Unspecified = '##unspecified'` and `WebService = '##WebService'`. `'BonitaConnector'` is not a member, so a direct `=== 'BonitaConnector'` comparison is a type error, and an interface augmentation cannot widen an existing property. Resolution options, in order of preference:
  1. Compare after an explicit widening to `string`, with the literal held in an extension-owned constant. Simple, local, no core change.
  2. Enum declaration merging (`declare module ... { enum tImplementation { BonitaConnector = 'BonitaConnector' } }`). More in the spirit of the ADR, but merging an enum from another module is fragile and adds a Bonita-specific member to a BPMN-spec type.
  Option 1 is planned; note the choice as an ADR input, since any extension reading a spec-constrained attribute hits the same wall.

### Internal model

- `src/model/bpmn/internal/types.ts` — `ShapeExtensions`, `EdgeExtensions`, `LabelExtensions`, all empty interfaces marked `@internal`, each with an eslint disable for `no-empty-object-type`. A new `ShapeBpmnElementExtensions` follows the same shape.
- `src/model/bpmn/internal/shape/Shape.ts:26` — `readonly extensions: ShapeExtensions = {}`.
- `src/model/bpmn/internal/shape/ShapeBpmnElement.ts:24` — base class, all-`readonly` constructor properties. Option A adds the `extensions` field here.

### BPMN in Color reference implementation (the pattern to follow)

- `src/component/extension/extension-points.ts` — `ParsingExtensionPoint` (`:27`), `StyleExtensionPoint` (`:65`). Both `@internal`, both tagged `@since 0.48.0`.
- `src/component/extension/bpmn-in-color/parsing-extension.ts` — module-level plain functions plus one exported const object typed as `ParsingExtensionPoint`. No class, no state. `import './types'` pulls in the augmentation.
- `src/component/extension/bpmn-in-color/style-extension.ts` — same shape for `StyleExtensionPoint`, writes into the `styleValues` map.
- `src/component/extension/bpmn-in-color/types.ts` — the augmentation file. Note the `export {}` marker at `:23` and the comment explaining why it is required (`TS2436` and `verbatimModuleSyntax`). Uses **relative** module paths in `declare module`.

### Style computing

- `src/component/mxgraph/renderer/StyleComputer.ts:51` — `this.styleExtensions = (options?.ignoreBpmnColors ?? true) ? [] : [bpmnInColorStyleExtension]`. **The list is empty by default.** The connector style extension must be registered unconditionally, so the initialization needs restructuring (e.g. a base always-on array concatenated with the gated colors entry).
- `StyleComputer.ts:72-93` `computeShapeStyleValues`, extension call at `:90`.
- `StyleComputer.ts:54` `computeStyle` returns the joined `key=value` style string.
- `src/component/mxgraph/style/identifiers.ts:25` `BpmnStyleIdentifier` — dotted keys (`bpmn.markers`, `bpmn.subProcessKind`). `bonita.hasConnector` fits the convention. The extension should own its constant rather than adding to `BpmnStyleIdentifier`, which is public `@experimental` API.

### Rendering

- `src/component/mxgraph/BpmnCellRenderer.ts:89` `createShape` — **the insertion point** (see "Rendering mechanism" below). Shape classes are NOT modified.
  ```text
  override createShape(state: mxCellState): mxShape {
    const shape = super.createShape(state);
    if ('iconPainter' in shape) {
      shape.iconPainter = this.iconPainter;
    }
    overrideCreateSvgCanvas(shape);
    return shape;
  }
  ```
  It already decorates the freshly created shape instance (injecting `iconPainter`, overriding `createSvgCanvas`), so decorating `paintForeground` there follows an established idiom of this class.
- `src/component/mxgraph/BpmnGraph.ts:88` — `createCellRenderer()` returns `new BpmnCellRenderer(pendingIconPainter)`, the single instantiation site. Relevant for phase 2 (passing extensions in).
- `src/component/mxgraph/shape/activity-shapes.ts:94` `BaseTaskShape` — the 8 task shapes (`TaskShape`, `ServiceTaskShape`, `UserTaskShape`, `ReceiveTaskShape`, `SendTaskShape`, `ManualTaskShape`, `ScriptTaskShape`, `BusinessRuleTaskShape`) extend it and only implement `paintTaskIcon`. `BaseTaskShape` is **not exported**, so `instanceof` is unavailable outside the module: use the runtime discriminator `'paintTaskIcon' in shape`, which mirrors the existing `'iconPainter' in shape` idiom and excludes `SubProcessShape` and `CallActivityShape`.
- Reading the style inside a shape: `mxUtils.getValue(this.style, BpmnStyleIdentifier.MARKERS, undefined)` (`activity-shapes.ts:65`). Style values are strings, hence the "style property as a string" requirement: test `=== 'true'`.
- `activity-shapes.ts:73-79` `paintMarkerIcons` brackets each icon with `canvas.save()` / `canvas.restore()` to avoid leaking canvas configuration (colors) into later painting. The connector painting must do the same.
- `buildPaintParameter` is exported from `./shape/render/icon-painter` but **not** re-exported by the `./shape/render` barrel (`index.ts` exports only `render-types`, `BpmnCanvas`, `IconPainter`, `PaintParameter`). Import it from the module directly.
- `icon-painter.ts:104` `newBpmnCanvas(paintParameter, originalIconSize)` is **`protected`** on `IconPainter`: it maps a `PaintParameter` onto a `BpmnCanvas` constructor call. A standalone painting function cannot call it. `BpmnCanvas` itself is exported by the barrel, so the mapping would have to be duplicated. Preferred fix: extract the body into an exported module-level function in `icon-painter.ts` and have the method delegate to it (also what phase 3 needs for out-of-library extensions).
- Reusing the script icon in step 3: `paintScriptIcon` is an `IconPainter` **method**, but `IconPainter` is stateless and publicly exported, so the extension can hold a module-level instance and call it with a top-right origin function. It mutates `paintParameter.iconStyleConfig.fillColor`, so pass a copied `iconStyleConfig`.
- `src/component/mxgraph/shape/render/icon-painter.ts:50` `buildPaintParameter` — builds `PaintParameter` from the shape style; `ratioFromParent` defaults to `0.25`.
- `icon-painter.ts:693` `paintScriptIcon` — the icon to reuse in step 3. It is a `paintXxxIcon(paintParameter)` method reading `paintParameter.iconStyleConfig` and calling `this.newBpmnCanvas(...)` with an original size of `458.75 x 461.64`. It mutates `iconStyleConfig.fillColor`, so a copy of the parameter is safer when reusing.
- `src/component/mxgraph/shape/render/BpmnCanvas.ts:120` `setIconOriginToShapeTopLeftProportionally(20)` — the existing top-left positioning, used by every task icon. `:138` `setIconOriginForIconCentered` and `:147` `setIconOriginForIconBottomCentered` show how to offset by the scaled icon size (`this.iconOriginalSize.width * this.scaleX`), which the top-right variant needs.
- Icon **scaling** comes from `ratioFromParent` via `computeScaledIconSize` (`BpmnCanvas.ts:102`); positioning proportional to `shape.width/height` comes from the `Proportionally` origin method. Both are size-relative, so the "icon follows the task size" requirement is satisfied by construction if both mechanisms are used.

### Fixtures

- `test/fixtures/bpmn/_extension_bonita_connector/Diagram_1 - 1.0_v3.bpmn` — 2 pools. `serviceTask _7NczwC6UEfGig-korpJRBw` "task1 with connector out" has `implementation="BonitaConnector"`. `userTask _ziQF0C6YEfG8cPxsk-PSZQ` and `scriptTask _-_KK0C6UEfGig-korpJRBw` are named "with connector" but carry no markup (expected: Bonita only exports connector data on service tasks).
- `test/fixtures/bpmn/_extension_bonita_connector/testouille_20260622_1119_MonDiagramme - 1.0.bpmn` — service tasks `_OCwuoGTUEfGaGtIl2XhuBQ`, `_qtnxUGVoEfG3FuVyjhLrTA`, `_tpvuwGVpEfG3FuVyjhLrTA` with the attribute; `serviceTask _RxvvUGV4EfG3FuVyjhLrTA` "Étape9" **without** it (useful negative case).
- `test/fixtures/bpmn/xml-parsing/bonita-community-2021.1-A.2.0.export.bpmn` — Bonita 7.12.1 export, plain tasks only, no `implementation` anywhere, yet it declares `xmlns:bonitaConnector`. Confirms the namespace is not a usable signal, and acts as a regression guard that nothing is detected here.
- The two POC fixture filenames contain spaces and a version suffix. `getBpmnDiagramNames` (`test/shared/visu/test-utils.ts:51`) strips only the last dot segment, so they would yield snapshot keys like `Diagram_1 - 1.0_v3`. Dedicated, cleanly named diagrams are preferable for e2e.

### Tests

- `test/unit/component/extension/bpmn-in-color/parsing-extension.test.ts` and `style-extension.test.ts` — per-extension unit tests, the closest model for connector unit tests.
- `test/integration/mxGraph.model.bpmn.colors.test.ts` — uses `bpmnVisualization` from `./helpers/model-expect` and the custom matcher `expect(id).toBeTask({...})`. **This is exactly the dependency the connector integration test must avoid.** The extraction-friendly alternative is the public `bpmnVisualization.graph` accessor (`src/component/BpmnVisualization.ts:49`, `readonly graph: BpmnGraph`, `@experimental`), reading the cell style directly from the model.
- `test/e2e/bpmn.colors.test.ts` — the visual-regression template: an `ImageSnapshotThresholdsModelColors extends MultiBrowserImageSnapshotThresholds` subclass, `AvailableTestPages`/`PageTester`, `getBpmnDiagramNames('<dir>')` driving the cases from a fixture directory.
- e2e diagram directories are flat, e.g. `test/fixtures/bpmn/bpmn-in-color/elements.colors.01.no.label.bpmn`.

## Rendering mechanism (decided)

**Shape classes must not be modified. The cell renderer decorates `paintForeground` on the shape instance.**

Rationale: once the extension lives outside the library it cannot subclass or edit `BaseTaskShape`, but it can be
applied by the cell renderer, which is library code already responsible for per-instance shape customization.

Sketch, in `BpmnCellRenderer.createShape`:

```
const shape = super.createShape(state);
if ('iconPainter' in shape) shape.iconPainter = this.iconPainter;
overrideCreateSvgCanvas(shape);

if ('paintTaskIcon' in shape) {
  const originalPaintForeground = shape.paintForeground.bind(shape);
  shape.paintForeground = (c, x, y, w, h) => {
    originalPaintForeground(c, x, y, w, h);
    if (mxUtils.getValue(shape.style, 'bonita.hasConnector', undefined) === 'true') {
      c.save();
      paintBonitaConnectorIcon(buildPaintParameter({ canvas: c, x, y, width: w, height: h, shape }));
      c.restore();
    }
  };
}
return shape;
```

Two constraints behind this sketch:
- The style is read **at paint time**, not at `createShape` time. `mxCellRenderer` reuses shape instances across
  redraws, and the style API can change a cell style at runtime, so a decision taken once at creation would go stale.
- `save()`/`restore()` bracket the painting, as `paintMarkerIcons` does, so the connector icon cannot leak canvas
  configuration into subsequent painting.

**ADR deviation to record:** ADR 001 describes the rendering extension point as hooking "into the mxGraph shape
painting methods (e.g. `paintForeground` in `BaseTaskShape`)". The mechanism chosen here applies it from
`BpmnCellRenderer.createShape` instead, leaving shape classes untouched. The ADR should state that rendering
extensions are applied by the cell renderer.

## Patterns to Follow

- Extension = one directory under `src/component/extension/<name>/` with `types.ts` (augmentations), `parsing-extension.ts`, `style-extension.ts`. Exported consts typed by the extension-point interfaces, plain module-level functions, no classes, no state.
- Augmentation files start with `export {}` and use relative `declare module` paths (see the comment at `bpmn-in-color/types.ts:17`).
- Style keys are dotted lowercase-camel strings; style values are strings when read back in shapes.
- New `@internal` API needs no `@since`; the existing extension points nonetheless carry `@since 0.48.0`. Confirm the target version with the user before adding `@since` to anything public.
- License header (Apache 2.0, "Copyright 2026 Bonitasoft S.A." for new files) on every source file.
- Comment sparingly, but do document non-obvious constraints inline, as `bpmn-in-color/types.ts` and the `hasLabelExtensionData` comment in `extension-points.ts:44` do.

## Dependencies and prerequisites

- No new npm dependency.
- Core files that must change (unavoidable in phase 1, all to be justified in the ADR update):
  1. `src/component/extension/extension-points.ts` — add the semantic hook.
  2. `src/model/bpmn/internal/types.ts` + `ShapeBpmnElement.ts` — add the semantic extensions carrier (option A).
  3. `src/component/parser/json/converter/ProcessConverter.ts` — call the semantic hook, and receive the extension list (today `parsingExtensions` lives only in `DiagramConverter`).
  4. `src/component/mxgraph/renderer/StyleComputer.ts` — register an always-on style extension alongside the colors-gated one.
  5. `src/component/mxgraph/shape/render/BpmnCanvas.ts` — top-right proportional origin.
  6. `src/component/mxgraph/BpmnCellRenderer.ts` — decorate `paintForeground` on task shape instances. **`activity-shapes.ts` is NOT modified.**

## Decisions taken (answers to the open points)

1. **Semantic extensions carrier: option A confirmed.** New `ShapeBpmnElementExtensions` empty interface in `src/model/bpmn/internal/types.ts`, new `readonly extensions` field on `ShapeBpmnElement`, augmented by the connector extension with `bonita?: { hasConnector?: boolean }`.
2. **No plumbing for the extension list.** The connector parsing extension is hardcoded in the property holding the extension list, exactly as `bpmnInColorParsingExtension` is at `DiagramConverter.ts:48`. `ProcessConverter` gets its own hardcoded list property. No constructor parameter, no registry: that is phase 2's job.
3. **Style extension registered unconditionally** in `StyleComputer`, always active, independent of `ignoreBpmnColors`.
4. **Rendering: cell renderer decorates the shape instance**, shape classes untouched. See "Rendering mechanism" above.
5. **Test diagrams: create new focused fixtures**, small, with few elements, rather than reusing the two Bonita exports (which are large, carry messy filenames, and mix unrelated content). The Bonita exports stay as parsing references. Needed cases: a service task with a connector, a service task without one, a non-service task, and one diagram with an enlarged task for the scaling check.

6. **Style key constant**: `bonita.hasConnector` is a constant exported by a file of the extension directory, not added to the public `BpmnStyleIdentifier`.
7. **Top-right positioning helper**: `BpmnCanvas.setIconOriginToShapeTopRightProportionally(shapeDimensionProportion: number)`, same signature and approach as `setIconOriginToShapeTopLeftProportionally` (`BpmnCanvas.ts:120`). Note: the X computation must additionally subtract the scaled icon width (`this.iconOriginalSize.width * this.scaleX`), as `setIconOriginForIconCentered` does at `:140`, otherwise the icon overflows the right border.
8. **Integration test reads the style through the public graph accessor**, no library test helper and no custom matcher:
   ```text
   const cell = bpmnVisualization.graph.getModel().getCell(id);
   const style = bpmnVisualization.graph.getView().getState(cell).style;
   ```
   `getState(cell).style` returns the resolved key/value style object, so assertions target `style['bonita.hasConnector']` directly.
