# Task: phase 2, inject the extensions through configuration

Replace the 5 hardcoded extension lists by extensions passed at `BpmnVisualization` construction. Goals: prove the
handling is generic, and discover which API has to become public for an extension implemented outside the library.

Phase 1 is committed. Its 4 extension points work and are registered internally. See
`.claude/tasks/01-poc-bonita-connector-extension/` and the reworked `docs/contributors/adr/001-bpmn-extensions-management.md`.

## The 5 hardcoded lists to replace

| # | Location | Content today |
|---|---|---|
| 1 | `src/component/parser/json/converter/DiagramConverter.ts:48` | `parsingExtensions = [bpmnInColorParsingExtension]` |
| 2 | `src/component/parser/json/converter/ProcessConverter.ts:99` | `parsingExtensions = [bonitaConnectorParsingExtension]` |
| 3 | `src/component/mxgraph/renderer/StyleComputer.ts:45-57` | `styleExtensions`, connector always on, colors gated by `ignoreBpmnColors` |
| 4 | `src/component/mxgraph/BpmnCellRenderer.ts:32` | `renderingExtensions = [bonitaConnectorRenderingExtension]` |
| 5 | `src/component/mxgraph/GraphConfigurator.ts:30` | `iconPainterExtensions = [bonitaConnectorIconPainterExtension]` |

## Codebase Context: the 3 creation chains

`BpmnVisualization` (`src/component/BpmnVisualization.ts:78-87`) stores `rendererOptions` and `parserOptions`, and
creates the graph in the constructor. The parser and the renderer are created **per `load()` call**
(`:99-101`), not in the constructor. So the extensions must be stored as a field of `BpmnVisualization`, next to the
two option fields, and handed to 3 different chains.

### Chain A, parsing: recreated on every `load()`

```
BpmnVisualization.load                        BpmnVisualization.ts:99
└── newBpmnParser(parserOptions)              parser/BpmnParser.ts:43
    └── newBpmnJsonParser(messageCollector)   parser/json/BpmnJsonParser.ts:57
        ├── new ProcessConverter(convertedElements, parsingMessageCollector)   BpmnJsonParser.ts:64
        └── new DiagramConverter(convertedElements, parsingMessageCollector)   BpmnJsonParser.ts:65
```

3 signatures to change: `newBpmnParser`, `newBpmnJsonParser`, and the 2 converter constructors. `BpmnParser`
(`BpmnParser.ts:28`) itself only holds the json and xml parsers, so it does not need the extensions, only its factory
does. The other 4 converters created by `newBpmnJsonParser` (`Category`, `Collaboration`, `EventDefinition`,
`GlobalTask`) consume no extension point today and are left untouched.

**Test impact**: `newBpmnJsonParser` is called by `test/unit/helpers/JsonTestUtils.ts:52`, used by the whole
`test/unit/component/parser/json/` suite. `newBpmnParser` is called by `test/unit/component/parser/BpmnParser.test.ts`.
Adding a parameter is source-compatible only if it is optional or last with a default.

### Chain B, style: recreated on every `load()`

```
BpmnVisualization.load                                     BpmnVisualization.ts:101
└── newBpmnRenderer(graph, rendererOptions)                mxgraph/BpmnRenderer.ts:165
    └── new StyleComputer(options)                         BpmnRenderer.ts:166
```

The shortest chain: 2 signatures, `newBpmnRenderer` and `StyleComputer`. `StyleComputer` already takes
`RendererOptions`, so if the extensions travel inside the options object, **no signature changes at all** on this
chain.

**Test impact**: `new StyleComputer(...)` is instantiated directly 3 times in
`test/unit/component/mxgraph/renderer/StyleComputer.test.ts:132,484,540`.

### Chain C, rendering and icon painter: built once, in the constructor

```
BpmnVisualization constructor                              BpmnVisualization.ts:81
└── createNewBpmnGraph(container, rendererOptions)         mxgraph/GraphConfigurator.ts:34
    ├── resolveIconPainter(rendererOptions)                GraphConfigurator.ts:47  <-- list 5 lives here
    └── new BpmnGraph(container, iconPainter)              GraphConfigurator.ts:35
        └── super(container)  ==> mxGraph constructor
            └── createCellRenderer()                       BpmnGraph.ts:87
                └── new BpmnCellRenderer(pendingIconPainter)  <-- list 4 must arrive here
```

**List 5 is already solved**: `resolveIconPainter` receives `rendererOptions`, so the icon painter extensions can be
read from the options with no signature change.

**List 4 is the obstacle.** `createCellRenderer` is called by the mxGraph super constructor, before any instance field
of `BpmnGraph` is initialized. This is why `iconPainter` is passed through the module-level `pendingIconPainter`
variable (`BpmnGraph.ts:50`, with a long comment at `:23-49` documenting why every cleaner option fails: `this` is
unavailable before `super()`, `this.container` is set after `createGraphView`, and constructor parameters are not
reachable from the method).

Options for the rendering extensions:
1. **Extend the existing workaround** to a second module-level variable, or better, replace `pendingIconPainter` by a
   single `pendingCellRendererDependencies` object holding both the painter and the rendering extensions. Minimal, and
   it reuses a mechanism already reviewed and documented.
2. **Assign after construction**: `createCellRenderer` returns the renderer, and `BpmnGraph` sets the extensions on
   `this.cellRenderer` after `super()`. Works because no shape is created during construction, but it makes
   `renderingExtensions` mutable and splits the initialization in two places.
3. Pass them to `BpmnGraph` and have `createCellRenderer` read them: **impossible**, that is exactly what the comment
   at `BpmnGraph.ts:36-40` rules out.

Option 1 is recommended: one variable instead of two, same lifecycle, and the comment already in place explains it.

## Options types

`src/component/options.ts`:
- `GlobalOptions` (`:23`): `container`, `navigation?`, `parser?: ParserOptions`, `renderer?: RendererOptions`.
- `ParserOptions` (`:171`): `additionalXmlAttributeProcessor?`, `disableConsoleLog?`.
- `RendererOptions` (`:201`): `iconPainter?`, `ignoreActivityLabelBounds?`, `ignoreBpmnColors?`, `ignoreLabelStyles?`,
  `ignoreTaskLabelBounds?`.

Where `bpmnExtensions` fits, 2 candidate shapes:

**A. One list at the root of `GlobalOptions`** (what the ADR sketches):
`new BpmnVisualization({ container, bpmnExtensions: [bonitaConnectorExtension] })`. The user registers one grouping
object per extension and the library splits it across the 3 chains. Best for the end user, who should not know how an
extension is internally decomposed. Requires `BpmnVisualization` to distribute the parts, which is exactly the
"generic handling" this phase must prove.

**B. Per-phase lists inside `ParserOptions` and `RendererOptions`.** Threading is trivial, since both objects already
travel down every chain, but it leaks the internal decomposition to the user and needs one registration per phase.
Rejected as an end-user API, though it may be a useful internal intermediate representation after the split.

Recommendation: A for the public option, with a small internal splitter turning `BpmnExtension[]` into the per-phase
lists that the chains carry.

The `BpmnExtension` grouping interface the ADR proposes (`Q8`) is required by this phase:

```ts
interface BpmnExtension {
  parsing?: ParsingExtensionPoint;
  style?: StyleExtensionPoint;
  rendering?: RenderingExtensionPoint;
  iconPainter?: IconPainterExtensionPoint;
}
```

## Public API surface

The entry point `src/bpmn-visualization.ts` exports today:

| Line | Export | Relevance for an out-of-library extension |
|---|---|---|
| 24 | `* from './component/options'` | where `bpmnExtensions` will live, already public |
| 25 | `BpmnVisualization` | registration point |
| 26 | `* from './component/registry'` | not needed |
| 27 | `* from './component/version'` | not needed |
| 28 | `type Navigation` | not needed |
| 29 | `* from './model/bpmn/internal'` | exports `ShapeBpmnElementKind`, `ShapeUtil`, needed by the parsing extension |
| 30 | `type BpmnGraph` | needed by the integration tests reading the computed style |
| 31 | `type * from './component/types'` | not needed |
| 34 | `* from './component/mxgraph/style'` | `BpmnStyleIdentifier`, useful reference |
| 35 | `* from './component/mxgraph/shape/render'` | **already exports `IconPainter`, `PaintParameter`, `BpmnCanvas`, `render-types`** |
| 38 | `mxgraph` | the mxGraph namespace object |

What is **missing** and must become public, with its current visibility:

| Needed by | Symbol | Today |
|---|---|---|
| all extension points | `ParsingExtensionPoint`, `StyleExtensionPoint`, `RenderingExtensionPoint`, `IconPainterExtensionPoint`, and the new `BpmnExtension` | `src/component/extension/extension-points.ts`, `@internal`, not exported by the entry point |
| parsing extension | `Shape`, `Edge`, `ShapeBpmnElement`, `Label` | internal model classes, `@internal`, not exported |
| parsing extension | `ShapeExtensions`, `EdgeExtensions`, `LabelExtensions`, `ShapeBpmnElementExtensions` | `src/model/bpmn/internal/types.ts`, `@internal`. **Their module path must be publicly reachable**, since extensions augment them by `declare module` |
| parsing extension | the JSON model types (`TFlowNode`, `BPMNShape`, `BPMNEdge`, `TServiceTask`, ...) | `src/model/bpmn/json/`, not exported by the entry point, and also augmented by `declare module` |
| rendering extension | `mxShape`, `mxCellState` | come from the `mxgraph` package types, not from this library |
| icon painter extension | `IconPainter.newBpmnCanvas`, `PaintParameter`, `BpmnCanvas` | already public since phase 1 |

Two findings worth flagging:

1. **The module augmentation constraint is the hard part, not the exports.** An extension augments
   `ShapeBpmnElementExtensions` and the JSON model interfaces with `declare module '<path>'`. Inside the library the
   path is relative (`'../../../model/bpmn/internal/types'`). From outside, the augmented module must be addressable
   by its published name, so either the package exposes those submodule paths (`exports` map in `package.json`), or
   the interfaces are re-exported from the root module and augmented as `declare module 'bpmn-visualization'`. The ADR
   already shows the second form. This needs verifying against the bundle layout, and it is the main risk of phase 3.
2. **`mxShape`/`mxCellState` in `RenderingExtensionPoint` leak mxGraph** into an otherwise wrapped implementation
   detail. Already recorded as `Q4` in the ADR. Phase 2 does not have to solve it, but it should not make it worse.

## BPMN in Color: move the properties under a `bpmnInColor` root

The properties are `fillColor` and `strokeColor` on `ShapeExtensions`, `strokeColor` on `EdgeExtensions`, `color` on
`LabelExtensions`. They must move under a `bpmnInColor` sub-object, mirroring `bonita`.

Every place reading or writing them, and nothing else:

**Source, 3 files, all inside the extension:**
- `src/component/extension/bpmn-in-color/types.ts:52-69` the augmentation itself.
- `src/component/extension/bpmn-in-color/parsing-extension.ts:26,28,33,39` the writes.
- `src/component/extension/bpmn-in-color/style-extension.ts:28,35,42,47,51` the reads.

That the change is confined to the extension directory is the point of the refactoring: the core reads none of these
properties.

**Tests, 3 files:**
- `test/unit/component/extension/bpmn-in-color/parsing-extension.test.ts` asserts on `shape.extensions.fillColor` and
  siblings, including `Object.hasOwn(shape.extensions, 'fillColor')` checks that will have to target the sub-object.
- `test/unit/component/extension/bpmn-in-color/style-extension.test.ts` sets them before computing the style.
- `test/unit/component/mxgraph/renderer/StyleComputer.test.ts:63,554-603` sets them to test the color styling. This one
  lives in the core test suite while manipulating extension-specific properties, so it will have to be updated too.

**Not affected:** `test/unit/helpers/bpmn-model-expect.ts:22,39,76,85` references the `ShapeExtensions`,
`EdgeExtensions`, `LabelExtensions` types but not their properties, so it compiles unchanged.

## Test impact of making the extensions configurable

The risk is behavioral: BPMN in Color and the Bonita connector are always active today, and would become opt-in.

- **`ignoreBpmnColors`**: used in `src/component/options.ts:247` and `StyleComputer.ts:55` only. Test usage:
  `test/unit/component/mxgraph/renderer/StyleComputer.test.ts:540`, `test/e2e/bpmn.colors.test.ts`, and
  `test/shared/visu/bpmn-page-utils.ts` which maps a `rendererIgnoreBpmnColors` query parameter for the e2e pages.
  Its semantics (colors ignored **by default**) must be preserved exactly, otherwise the whole colors e2e suite shifts.
  It is also the gating mechanism the ADR flags as non-generic (`Q3`): the decision on generic enabling and disabling
  cannot be avoided in this phase.
- **Bonita connector**: becoming opt-in means the e2e diagrams of phase 1 must register it explicitly. The e2e page
  loads diagrams through `test/shared/visu/bpmn-page-utils.ts`, so registering an extension from an e2e test requires a
  new page option, mirroring `rendererIgnoreBpmnColors`. This is the piece of test infrastructure phase 2 has to add.
- **Integration test**: `test/integration/bonita.connector.extension.test.ts` builds its own `BpmnVisualization`, so it
  only needs the new option, and it keeps avoiding the library test infrastructure as required.
- **Everything else**: the 3167 other unit tests and the 15 integration suites do not reference extensions. They stay
  green as long as the default behavior is unchanged, which is the acceptance criterion inherited from step 1.

## Patterns to Follow

- Factory functions (`newBpmnParser`, `newBpmnJsonParser`, `newBpmnRenderer`, `createNewBpmnGraph`) are the seams where
  collaborators are wired. Add parameters there rather than inside the classes when possible.
- Options objects already travel down every chain, which is why putting the per-phase lists inside the existing options
  costs no signature change on chains B and C.
- Everything internal is marked `@internal`. Anything promoted to public API needs a `@category` tag and, per
  `CLAUDE.md`, a `@since` tag whose version must be confirmed with the user once per session.
- New public API also means documentation: `docs/users/` and the typedoc output.

## Dependencies and prerequisites

- Decide the public option shape (`bpmnExtensions` at the root of `GlobalOptions`) and the `BpmnExtension` grouping
  interface, ADR `Q8`.
- Decide how the rendering extensions reach `BpmnCellRenderer`, given the mxGraph constructor constraint.
- Decide generic enabling and disabling, ADR `Q3`, and how `ignoreBpmnColors` maps onto it without changing behavior.
- Decide whether phase 2 exports the extension point types publicly, or defers that to phase 3. The phase goal says
  "discover which API has to become public", which can be satisfied by this report plus the ADR, without exporting
  anything yet.

## Open points for the plan phase

1. Public option shape: single `bpmnExtensions` list at the root of `GlobalOptions`, split internally? Recommended.
2. `BpmnExtension` grouping interface: confirm the property names (`parsing`, `style`, `rendering`, `iconPainter`) and
   the interface name.
3. Rendering extensions to `BpmnCellRenderer`: extend the `pendingIconPainter` workaround into a single pending
   dependencies object? Recommended.
4. Does BPMN in Color stay built-in and always registered internally, with `ignoreBpmnColors` untouched, while only the
   Bonita connector becomes configurable? That keeps the whole existing test suite green and still proves the generic
   path end to end.
5. Do the extension point types and internal model types get exported publicly in this phase, or is that phase 3?
6. Confirm the target version for any `@since` tag on newly public API.
