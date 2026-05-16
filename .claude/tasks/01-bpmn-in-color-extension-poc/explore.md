# Task: PoC — Manage BPMN in Color as extension

Based on the ADR `docs/contributors/adr/001-bpmn-extensions-management.md`, implement the minimal extension mechanism to refactor BPMN in Color as a built-in extension.

## Codebase Context

### Current BPMN in Color implementation

**3 touchpoints** to refactor:

#### 1. Parsing — DiagramConverter
`src/component/parser/json/converter/DiagramConverter.ts`
- `setColorExtensionsOnShape(shape, bpmnShape)` (lines 191-202): reads `background-color`/`fill` → `shape.extensions.fillColor`, `border-color`/`stroke` → `shape.extensions.strokeColor`
- `setColorExtensionsOnEdge(edge, bpmnEdge)` (lines 212-218): reads `border-color`/`stroke` → `edge.extensions.strokeColor`
- Label color handling inline in `deserializeLabel()` (lines 166-169): reads `color` → `label.extensions.color`
- Called from: `deserializeShape()` line 127, edge loop line 151, `deserializeLabel()` line 166

#### 2. Style computing — StyleComputer
`src/component/mxgraph/renderer/StyleComputer.ts`
- `computeShapeStyleValues()` lines 85-95: reads `shape.extensions.fillColor`/`strokeColor`, sets mxConstants. Special case for pools/lanes (`STYLE_SWIMLANE_FILLCOLOR`)
- `computeEdgeStyleValues()` lines 103-106: reads `edge.extensions.strokeColor`
- `computeFontStyleValues()` lines 121-124: reads `bpmnCell.label?.extensions.color`
- `computeMessageFlowIconStyle()` lines 132-134: reads `edge.extensions.strokeColor`
- All gated by `if (!this.ignoreBpmnColors)` flag
- `ignoreBpmnColors` defaults to `true` (colors disabled by default), set in constructor line 45

#### 3. Extension types — Internal model
`src/model/bpmn/internal/types.ts`
- `ShapeExtensions` (type alias, lines 20-23): `{ fillColor?: string; strokeColor?: string }`
- `EdgeExtensions` (type alias, lines 28-30): `{ strokeColor?: string }`
- `LabelExtensions` (type alias, lines 35-37): `{ color?: string }`
- Used in Shape (line 26), Edge (line 27), Label (line 24) as `readonly extensions: XxxExtensions = {}`
- **NOT publicly exported** — internal only

### Initialization & wiring chain

```
BpmnVisualization(options: GlobalOptions)
  ├─ options.renderer → this.rendererOptions
  ├─ createNewBpmnGraph(container, rendererOptions) → BpmnGraph
  └─ load(xml):
       ├─ newBpmnParser(this.parserOptions).parse(xml)
       │    ├─ BpmnXmlParser.parse(xml) → JSON
       │    └─ BpmnJsonParser.parse(json) → BpmnModel
       │         └─ DiagramConverter.deserialize() ← COLOR PARSING HERE
       ├─ bpmnModelRegistry.load(bpmnModel)
       └─ newBpmnRenderer(graph, rendererOptions).render(renderedModel)
            └─ StyleComputer ← COLOR STYLE HERE
```

**Parser creation**: `newBpmnParser()` in `src/component/parser/BpmnParser.ts` lines 43-45. Creates `BpmnJsonParser` which creates `DiagramConverter`.

**BpmnJsonParser factory**: `src/component/parser/json/BpmnJsonParser.ts` lines 57-67. Creates all 6 converters. `DiagramConverter` is one of them.

**Renderer creation**: `newBpmnRenderer()` in `src/component/mxgraph/BpmnRenderer.ts` lines 162-164. Creates `StyleComputer(options)`.

### GlobalOptions / RendererOptions
`src/component/options.ts`
- `GlobalOptions` (lines 23-32): `{ container, navigation?, parser?, renderer? }`
- `RendererOptions` (lines 201-267): `{ iconPainter?, ignoreActivityLabelBounds?, ignoreBpmnColors?, ignoreLabelStyles?, ignoreTaskLabelBounds? }`

## Key Files

- `src/model/bpmn/internal/types.ts` — Extension type definitions to migrate (type → interface)
- `src/model/bpmn/internal/shape/Shape.ts:26` — Shape.extensions property
- `src/model/bpmn/internal/edge/edge.ts:27` — Edge.extensions property
- `src/model/bpmn/internal/Label.ts:24` — Label.extensions property
- `src/component/parser/json/converter/DiagramConverter.ts:127,151,166-169,191-218` — Color parsing functions
- `src/component/mxgraph/renderer/StyleComputer.ts:40-47,85-95,103-106,121-124,132-134` — Color style computing
- `src/component/parser/json/BpmnJsonParser.ts:57-67` — Parser factory (where to inject parsing extension)
- `src/component/parser/BpmnParser.ts:43-45` — Top-level parser factory
- `src/component/mxgraph/BpmnRenderer.ts:162-164` — Renderer factory (where to inject style extension)
- `src/component/BpmnVisualization.ts:78-87,95-103` — Constructor and load() method
- `src/component/options.ts:23-32,201-267` — GlobalOptions and RendererOptions

## Tests that must keep passing

| Category | File | Focus |
|----------|------|-------|
| Unit: Parsing | `test/unit/component/parser/BpmnParser.test.ts` lines 58-297 | Color attribute parsing, bpmn.io fallback |
| Unit: Style | `test/unit/component/mxgraph/renderer/StyleComputer.test.ts` lines 537-610 | Color style computation, ignoreBpmnColors flag |
| Integration | `test/integration/mxGraph.model.bpmn.colors.test.ts` | Default behavior (colors ignored) |
| E2E | `test/e2e/bpmn.colors.test.ts` lines 150-170 | Visual regression with/without colors |

**Test fixtures**: `test/fixtures/bpmn/bpmn-in-color/` and `test/fixtures/bpmn/xml-parsing/bpmn-in-color/`

**Test helpers**: `test/unit/helpers/bpmn-model-expect.ts` (ExpectedShape/Edge/Label with extensions), `test/unit/helpers/JsonTestUtils.ts` (verifyLabel with extensions)

## Patterns to Follow

1. **Extension types are `readonly` on model objects** but contents are mutated after construction (e.g., `shape.extensions.fillColor = ...`)
2. **`ignoreBpmnColors` flag** gates all color application in StyleComputer — this must be preserved
3. **BPMN in Color supports fallback** to bpmn.io attributes (`fill`/`stroke` vs `background-color`/`border-color`)
4. **Pools/lanes have special handling**: fillColor also sets `STYLE_SWIMLANE_FILLCOLOR`
5. **Message flow icon** has separate style computation using `push()` instead of `set()` on a different data structure

## Scope for PoC (minimal)

Based on the ADR migration plan, the minimal PoC should:

1. **Create extension point interfaces**: `ParsingExtensionPoint`, `StyleExtensionPoint`, `BpmnExtension`
2. **Migrate types**: `ShapeExtensions`, `EdgeExtensions`, `LabelExtensions` from type alias to empty interface
3. **Create built-in BPMN in Color extension** implementing the interfaces
4. **Wire into DiagramConverter**: call parsing extension points instead of hardcoded functions
5. **Wire into StyleComputer**: call style extension points instead of hardcoded color logic
6. **All existing tests must pass unchanged**

NOT in scope: `RenderingExtensionPoint`, `BpmnVisualization` constructor API for custom extensions, `iconPainter` injection.
