# Implementation Plan: PoC — BPMN in Color as Extension

## Overview

Refactor the hardcoded BPMN in Color support into the new extension mechanism defined in the ADR. This is a pure internal refactoring — no user-facing behavior change, no new public API for custom extensions.

The approach:
1. Define extension point interfaces (internal)
2. Migrate extension types from type aliases to empty interfaces + module augmentation
3. Extract BPMN in Color logic into a `BpmnExtension` implementation
4. Wire extension points into DiagramConverter and StyleComputer
5. Remove hardcoded color code from core

Key design decisions:
- **Parsing**: DiagramConverter's constructor does **not** change. It internally imports and always uses the BPMN in Color parsing extension. Colors are always parsed from XML into the model — this matches the current behavior. The extension usage is an implementation detail.
- **Style**: StyleComputer's constructor does **not** change. It keeps its `options?: RendererOptions` parameter. Internally, when `ignoreBpmnColors` is false, it uses the BPMN in Color style extension. The extension registration is an internal implementation detail.

## Dependencies

Files must be changed in this order due to type dependencies:
1. Extension point interfaces (new file) — no dependencies
2. Extension types migration — needed by everything else
3. BPMN in Color extension implementation — depends on interfaces + types
4. DiagramConverter wiring — depends on extension interfaces
5. StyleComputer wiring — depends on extension interfaces

## File Changes

### NEW `src/component/extension/extension-points.ts`

- Define `ParsingExtensionPoint` interface with two optional methods: `onShapeDeserialized(shape, bpmnShape)` and `onEdgeDeserialized(edge, bpmnEdge)`. Both receive the internal model object and the raw JSON object.
- Define `StyleExtensionPoint` interface with two optional methods: `enrichShapeStyle(shape, styleValues)` and `enrichEdgeStyle(edge, styleValues)`. The `styleValues` parameter is a `Map<string, string | number>` that the extension mutates directly.
- Define `BpmnExtension` interface grouping `parsing?: ParsingExtensionPoint` and `style?: StyleExtensionPoint`
- All interfaces marked `@internal`

### `src/model/bpmn/internal/types.ts`

- Convert `ShapeExtensions` from type alias to empty interface: `export interface ShapeExtensions {}`
- Convert `EdgeExtensions` from type alias to empty interface: `export interface EdgeExtensions {}`
- Convert `LabelExtensions` from type alias to empty interface: `export interface LabelExtensions {}`
- Keep `@internal` JSDoc tags

### NEW `src/component/extension/bpmn-in-color-extension.ts`

- Add module augmentation block: `declare module` targeting the internal types file to add color properties (`fillColor`, `strokeColor` on ShapeExtensions, `strokeColor` on EdgeExtensions, `color` on LabelExtensions)
- Important: since extension types are internal (not publicly exported), the module augmentation path must target the relative internal types file, not `'bpmn-visualization'`
- Implement a `ParsingExtensionPoint` object with:
  - `onShapeDeserialized`: move logic from `setColorExtensionsOnShape` (DiagramConverter lines 191-202) + label color handling (lines 166-169, read from bpmnShape's BPMNLabel)
  - `onEdgeDeserialized`: move logic from `setColorExtensionsOnEdge` (DiagramConverter lines 212-218) + label color handling for edge labels
- Implement a `StyleExtensionPoint` object with:
  - `enrichShapeStyle`: move logic from StyleComputer `computeShapeStyleValues` lines 85-95 (fillColor, strokeColor, swimlaneFillColor for pools/lanes). Receives the Shape and the existing styleValues Map.
  - `enrichEdgeStyle`: move logic from StyleComputer `computeEdgeStyleValues` lines 103-106 (strokeColor)
- Consider: `computeFontStyleValues` reads `bpmnCell.label?.extensions.color` — this is label styling on both shapes and edges. The style extension's `enrichShapeStyle` and `enrichEdgeStyle` methods handle this by accessing `shape.label` / `edge.label` to set font color.
- Consider: `computeMessageFlowIconStyle` uses a different data structure (`[string, string][]` with `push()` instead of `Map` with `set()`). For the PoC, keep message flow icon color logic inline in StyleComputer — it's just one line and uses a different structure. It still reads from the extension data populated by the parsing extension.
- Export `bpmnInColorParsingExtension` (the `ParsingExtensionPoint`) and `bpmnInColorStyleExtension` (the `StyleExtensionPoint`) separately, so they can be consumed independently by DiagramConverter and StyleComputer

### `src/component/parser/json/converter/DiagramConverter.ts`

- Constructor signature **does not change**. Keep `constructor(convertedElements, parsingMessageCollector)`.
- Add a private field `private readonly parsingExtensions: ParsingExtensionPoint[]` initialized to `[bpmnInColorParsingExtension]`. Import `bpmnInColorParsingExtension` from the extension module.
- In `deserializeShape()` (after line 126, after shape construction): replace `setColorExtensionsOnShape(shape, bpmnShape)` with a loop calling `ext.onShapeDeserialized?.(shape, bpmnShape)` for each parsing extension
- In `deserializeEdges()` (after line 150, after edge construction): replace `setColorExtensionsOnEdge(edge, bpmnEdge)` with a loop calling `ext.onEdgeDeserialized?.(edge, bpmnEdge)` for each parsing extension
- In `deserializeLabel()` (lines 166-169): remove the inline `if ('color' in bpmnLabel)` block — this is now handled by the parsing extension's `onShapeDeserialized`/`onEdgeDeserialized` which access the label via `shape.label` / `edge.label` and read color from the raw `bpmnShape.BPMNLabel` / `bpmnEdge.BPMNLabel`
- Delete `setColorExtensionsOnShape` function (lines 190-202)
- Delete `setColorExtensionsOnEdge` function (lines 211-218)

### `src/component/mxgraph/renderer/StyleComputer.ts`

- Constructor signature **does not change**. Keep `constructor(options?: RendererOptions)`.
- Add a private field `private readonly styleExtensions: StyleExtensionPoint[]` initialized in the constructor: if `!this.ignoreBpmnColors`, include `bpmnInColorStyleExtension` in the array; otherwise, empty array.
- Import `bpmnInColorStyleExtension` from the extension module
- In `computeShapeStyleValues()`: replace lines 85-95 (the `if (!this.ignoreBpmnColors)` block) with a loop calling `ext.enrichShapeStyle?.(shape, styleValues)` for each style extension
- In `computeEdgeStyleValues()`: replace lines 103-106 (the `if (!this.ignoreBpmnColors)` block) with a loop calling `ext.enrichEdgeStyle?.(edge, styleValues)` for each style extension
- In `computeFontStyleValues()`: remove lines 121-124 (the `if (!this.ignoreBpmnColors)` block for label color) — now handled by the style extension within `enrichShapeStyle`/`enrichEdgeStyle`
- In `computeMessageFlowIconStyle()`: keep the color logic inline (lines 132-134) — it uses a `[string, string][]` structure different from the `Map`. It still reads `edge.extensions.strokeColor` which is populated by the parsing extension. Keep the `if (!this.ignoreBpmnColors)` guard here for now.
- The `ignoreBpmnColors` private field is kept for: (a) deciding which style extensions to register, (b) the message flow icon inline color logic

### `src/component/parser/json/BpmnJsonParser.ts`

- No change needed. DiagramConverter handles its own extension registration internally.

### `src/component/parser/BpmnParser.ts`

- No change needed.

### `src/component/mxgraph/BpmnRenderer.ts`

- No change needed. StyleComputer handles its own extension registration internally.

### `src/component/BpmnVisualization.ts`

- No change needed. The `ignoreBpmnColors` flag flows through `RendererOptions` to `StyleComputer` as before. Parsing extensions are wired in `newBpmnJsonParser`.

### `src/component/options.ts`

- No change needed.

## Testing Strategy

### No new tests needed for behavior
This is a pure refactoring — all existing tests must pass. The test suite is the validation.

### Tests to verify pass (run after each step):
- `npm run test:unit` — particularly `BpmnParser.test.ts` (color parsing) and `StyleComputer.test.ts` (color styling)
- `npm run test:integration` — particularly `mxGraph.model.bpmn.colors.test.ts`
- `npm run test:e2e` — particularly `bpmn.colors.test.ts`

### Note on test compatibility
- `StyleComputer.test.ts` tests create `StyleComputer` directly with `{ ignoreBpmnColors: false }`. Since StyleComputer's constructor signature is unchanged and it internally registers the BPMN in Color style extension based on that flag, **these tests require no changes**.
- `BpmnParser.test.ts` tests use the parser factory which now always includes the parsing extension. Since colors were always parsed before, **these tests require no changes**.

## Rollout Considerations

- No breaking changes — this is internal refactoring only
- `ignoreBpmnColors` public API behavior is preserved
- Extension types are internal, so the type→interface migration has no public API impact
- Module augmentation for BPMN in Color is internal, not user-facing
- No changes to BpmnVisualization, BpmnRenderer, BpmnParser, BpmnJsonParser, or options — minimal blast radius
- DiagramConverter and StyleComputer constructors are unchanged — no ripple effect on callers or tests
