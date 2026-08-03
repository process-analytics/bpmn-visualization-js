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
| **A. New extensions carrier on `ShapeBpmnElement`** | Add `readonly extensions: ShapeBpmnElementExtensions = {}` to `ShapeBpmnElement`, augmented by the extension. Style extension reads `shape.bpmnElement.extensions.bonita?.hasConnector`. | **Recommended.** Symmetric with `Shape.extensions` (`Shape.ts:26`), zero state in the extension, honours the ADR's module-augmentation approach, and models the real distinction between semantic and DI extensions. Cost: one new empty interface plus one field on a core model class. |
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

- `src/component/mxgraph/shape/activity-shapes.ts:94` `BaseTaskShape.paintForeground` — **single insertion point covering every task kind**: `TaskShape`, `ServiceTaskShape`, `UserTaskShape`, `ReceiveTaskShape`, `SendTaskShape`, `ManualTaskShape`, `ScriptTaskShape`, `BusinessRuleTaskShape` all extend it and only implement `paintTaskIcon`.
  ```ts
  override paintForeground(c, x, y, w, h): void {
    super.paintForeground(c, x, y, w, h);
    this.paintTaskIcon(buildPaintParameter({ canvas: c, x, y, width: w, height: h, shape: this }));
  }
  ```
- Reading the style inside a shape: `mxUtils.getValue(this.style, BpmnStyleIdentifier.MARKERS, undefined)` (`activity-shapes.ts:65`). Style values are strings, hence the "style property as a string" requirement: test `=== 'true'`.
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
  6. `src/component/mxgraph/shape/activity-shapes.ts` — call the connector painting function from `BaseTaskShape.paintForeground`.
- How `ProcessConverter` gets the extension list is an open design point: `BpmnJsonParser` constructs the converters, so the list has to be threaded there or hoisted to a shared internal registry. Worth deciding in the plan phase, since phase 2 will inject it from `BpmnVisualization` options anyway.

## Open points for the plan phase

1. Confirm option A for the semantic extensions carrier.
2. Decide how the parsing extension list reaches `ProcessConverter` (constructor parameter vs shared registry), knowing phase 2 will make it configurable.
3. Decide whether `paintForeground` calls a standalone `paintBonitaConnectorIcon(paintParameter)` function imported directly (user's stated preference, since `IconPainter` is stateless) or goes through a rendering extension point. The user asked for the direct call in phase 1; record the ADR consequence.
4. Naming and ownership of the style key constant `bonita.hasConnector`.
5. Whether to add dedicated e2e fixtures with clean names (recommended) plus one with an enlarged task, versus reusing the two Bonita exports as-is.
