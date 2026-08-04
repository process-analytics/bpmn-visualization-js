# BPMN Extensions Management

## Status

| Field             | Value      |
|-------------------|------------|
| **Status**        | Proposal   |
| **Date**          | 2026-05-13 |
| **Updated**       | 2026-08-04 |
| **Supersedes**    | -          |
| **Superseded by** | -          |

**IMPORTANT:** this is a proposal. Steps 1 and 2 of the [progression](#progression) are implemented, the rest is not.
The design is subject to change based on feedback and further analysis.

The questions that remain undecided are gathered in [Open questions](#open-questions) at the end of this document, and
referenced inline as `Qn`.

## Context

The [BPMN specification](https://www.omg.org/spec/BPMN/2.0.2/) allows for extensions: custom elements and attributes
that can be added to BPMN models to provide additional functionality or information beyond the standard.
Extensions can be applied to both the semantic model (process elements like tasks, events, gateways) and the diagram
interchange model (visual elements like shapes, edges, labels).

Examples of BPMN extensions:

| Extension                                                                                                | Adds                                                                                              | Kind of change                                            |
|----------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|-----------------------------------------------------------|
| [BPMN in Color](https://github.com/bpmn-miwg/bpmn-in-color)                                              | color attributes (`background-color`, `border-color`, ...) on shapes, edges and labels             | styling of existing elements, from diagram interchange data |
| [Bonita Connector](https://documentation.bonitasoft.com/bonita/2025.2/process/connectivity-overview)      | connector metadata on tasks, displayed as an icon on the top right of the tasks                   | decoration of existing elements, from semantic data       |
| [DF-BPMN](https://github.com/NourEldin-Ali/df-bpmn/)                                                     | DataFlow BPMN, a low-coding visual solution to model the relationship between process and data     | **new BPMN entities**, see [out of scope](#out-of-scope-extensions-adding-new-bpmn-entities) |

The three do not require the same things from the library, and that difference drives this ADR: the first two enrich
elements the library already knows how to draw, the third introduces elements it does not know at all.

Managing BPMN extensions in a consistent and extensible way is important to allow `bpmn-visualization` to support known
extensions and to let users implement their own (`Q1`).

## What supporting an extension involves

Before discussing any mechanism, it is worth stating what data an extension touches and when.

**Data layers:**

- **BPMN model (XML)** — the extension definition as expressed in the BPMN XML, either via custom attributes or via
  dedicated extension elements.
- **JSON model (raw data)** — the typed JSON representation of the XML, produced by the XML parser. Extensions augment
  this model to expose their custom attributes in a type-safe way.
- **Internal model (computed properties)** — the domain model used by the rest of the library. Extensions augment it
  with **computed** properties derived from parsing. These properties may or may not come from XML extensions.

**Pipeline phases:**

- **Parsing** — reads the XML/JSON extension data and populates the internal model's extension properties. It happens
  in two distinct passes, semantic then diagram interchange, and an extension may need either or both.
- **Style computing** — derives mxGraph styles from the internal model's extension properties.
- **Rendering** — paints additional visual elements (icons, decorations) on existing shapes, based on the computed
  style.

**Data flow:** BPMN model (XML) → JSON model (raw data) → internal model (computed properties) → computed style →
rendering. Extensions hook into the three phases, and augment the JSON and internal models.

## Situation before this ADR

`bpmn-visualization` did not provide any mechanism for managing BPMN extensions.

The only supported extension was **BPMN in Color**, hardcoded in the codebase:

- **Parsing**: `DiagramConverter` contained dedicated functions (`setColorExtensionsOnShape`,
  `setColorExtensionsOnEdge`) reading color attributes from the raw JSON and populating the internal model.
- **Style computing**: `StyleComputer` read those properties and mapped them to mxGraph style constants.
- **Model**: `ShapeExtensions`, `EdgeExtensions` and `LabelExtensions` were type aliases in
  `src/model/bpmn/internal/types.ts`, with hardcoded color properties.

This was not replicable: there was no extension point allowing a new BPMN extension to be added without modifying the
core library code.

## Progression

The work is split into steps that each answer one question. Only the first two are implemented.

### Step 1 — extract BPMN in Color behind internal extension points (done)

**Question answered:** can the hardcoded logic be expressed as objects conforming to extension point interfaces,
without changing any public interface?

**Before:** color logic inline in `DiagramConverter` and `StyleComputer`, extension types as type aliases.

**After:** `ParsingExtensionPoint` and `StyleExtensionPoint` interfaces exist; the color logic lives in
`src/component/extension/bpmn-in-color/` as `bpmnInColorParsingExtension` and `bpmnInColorStyleExtension`; the
extension types are empty interfaces augmented by the extension; `DiagramConverter` and `StyleComputer` iterate over a
list of extension points instead of calling color functions.

**Deliberately not delivered:** the extensions are still registered by a hardcoded array literal inside the components
that consume them. No public API changed, and all existing tests kept passing unmodified.

This step is the reference implementation every other extension follows.

### Step 2 — validate the mechanism with a second extension (done, as a POC)

**Question answered:** does the mechanism actually generalise, or was it shaped by the single extension it was
extracted from?

The Bonita Connector extension was implemented as a POC: detect the tasks holding connectors and paint an icon on their
top right. It lives in `src/component/extension/bonita-connector/`, and is always active, exactly as BPMN in Color was
before this ADR.

**Answer: it generalised only partly.** Three things had to be added, because BPMN in Color happens to be the easiest
possible case: its data sits in the diagram interchange model, and it only changes existing style properties.

1. **A semantic parsing hook.** Connector data lives on the semantic `serviceTask`, and the diagram-interchange hooks
   only receive `BPMNShape`/`BPMNEdge`. Nothing carried the semantic attributes forward, so `onFlowNodeConverted` was
   added, called from `ProcessConverter`.
2. **A second internal model carrier.** At semantic parsing time no `Shape` exists yet, only `ShapeBpmnElement`, so the
   computed property could not be stored in `ShapeExtensions`. `ShapeBpmnElementExtensions` was added.
3. **Two rendering extension points**, one to decorate a shape and one to contribute icon painting methods. See
   [Extension points](#extension-points).

The POC also confirmed that an extension can be implemented without touching the shape classes, and that the
positioning and scaling helpers it needs are missing rather than impossible: a
`BpmnCanvas.setIconOriginToShapeTopRightProportionally` was added next to the existing top-left one.

### Step 3 — inject the extensions from the outside (not started)

**Question to answer:** what has to change so that an extension is registered by the user instead of by a hardcoded
array literal?

Scope: a public registration API, a `BpmnExtension` grouping interface so one extension is registered as a single
object, generic enabling/disabling of an extension, and passing the extension lists down to the components that
consume them (`Q2`, `Q3`).

### Step 4 — support extensions living outside the library (not started)

**Question to answer:** what must the library expose so that an extension can be implemented in a separate package?

This is the real target. It requires deciding which of the types used by the extension points become public API, which
is not obvious: the rendering extension point exposes mxGraph types, while mxGraph is otherwise an implementation
detail fully wrapped by the library (`Q4`).

## Decision

Introduce extension points in the library to manage BPMN extensions consistently, and let users create and manage their
own extensions.

### Extension model: use TypeScript module augmentation

#### JSON model

The JSON model interfaces must be extended when a parsing extension reads custom attributes absent from the base
types. For example, BPMN in Color reads color attributes that are not part of the BPMN diagram interchange model:

```ts
// In src/component/extension/bpmn-in-color/types.ts
declare module '../../../model/bpmn/json/bpmndi' {
  interface BPMNShape {
    'background-color'?: string;
    fill?: string;
    'border-color'?: string;
    stroke?: string;
  }
}
```

This is only needed for attributes the base model does not declare. The Bonita Connector extension needs no JSON model
augmentation at all, because it reads `implementation` and `operationRef`, both already declared on `TServiceTask`.

That case revealed a limit worth recording: an extension reading a **vendor value from a standard, spec-constrained
attribute** cannot do it type-safely through augmentation. `implementation` is typed with the `tImplementation` enum,
restricted to `##unspecified` and `##WebService`, and an interface augmentation cannot widen an existing property. The
POC widens the value to `string` for the comparison (`Q5`).

#### Internal model: two carriers, semantic and diagram interchange

The extension types are empty interfaces, augmented by the extensions that need them:

```ts
// In bpmn-visualization (library code)
export interface ShapeBpmnElementExtensions {} // computed from the BPMN semantic model
export interface ShapeExtensions {}            // computed from the BPMN diagram interchange model
export interface EdgeExtensions {}
export interface LabelExtensions {}
```

Two carriers are needed because they are populated at different moments of the pipeline: semantic parsing builds
`ShapeBpmnElement` instances long before the `Shape` objects that hold `ShapeExtensions` exist. An extension stores its
computed properties in the carrier matching the phase it reads from.

```ts
// In src/component/extension/bonita-connector/types.ts
declare module '../../../model/bpmn/internal/types' {
  interface ShapeBpmnElementExtensions {
    bonita?: { hasConnector?: boolean };
  }
}
```

Practical note: inside a `declare module` block, the scope is the augmented module. Types declared there need no import,
and importing them at the top of the augmenting file makes the compilation fail with `TS6133`, the import being seen as
unused.

The pattern of augmenting empty interfaces is used by libraries such as
[MUI for theme customization](https://mui.com/material-ui/customization/theming/#typescript). It was first suggested
during the BPMN in Color implementation, in [this PR comment](https://github.com/process-analytics/bpmn-visualization-js/pull/2614#discussion_r1200547629).

#### JSON model versus internal model independence

The JSON model already provides `TExtension` to represent XML extension elements. The internal model extensions serve a
different purpose: they store **computed results** derived from parsing, which may or may not come from XML extensions.

These two must remain independent:

- a user may want internal model extensions without any XML extension, for instance computed from external data;
- a user may want XML extensions without enriching the internal model;
- when both are used, the parsing extension point is the bridge.

### Extension points

Four categories, matching the phases of the pipeline.

#### 1. Parsing

```ts
interface ParsingExtensionPoint {
  // BPMN semantic model
  onFlowNodeConverted?(shapeBpmnElement: ShapeBpmnElement, bpmnElement: TFlowNode): void;

  // BPMN diagram interchange model
  onShapeDeserialized?(shape: Shape, bpmnShape: BPMNShape): void;
  onEdgeDeserialized?(edge: Edge, bpmnEdge: BPMNEdge): void;
  hasLabelExtensionData?(bpmnLabel: unknown): boolean;
}
```

`onFlowNodeConverted` is called by `ProcessConverter`, where a raw `TFlowNode` and the `ShapeBpmnElement` built from it
coexist. It is the only place the raw semantic data is reachable: the converted elements registry stores built model
objects, not raw JSON.

The other three are called by `DiagramConverter`. Labels are children of shapes and edges, so their extensions are
populated through the parent, and there is no dedicated label hook.

`hasLabelExtensionData` is a workaround for a constraint found during step 1: labels are immutable once set on a shape
or an edge, so an extension needing a label must signal it before label creation. `DiagramConverter.deserializeLabel`
calls it on all registered extensions and creates a `Label` if any returns `true` (`Q6`).

#### 2. Style

Called by `StyleComputer` to compute additional mxGraph style properties from the internal model extensions. The
extension mutates the style entries map directly, which avoids merging in the caller.

```ts
interface StyleExtensionPoint {
  enrichShapeStyle?(shape: Shape, styleValues: Map<string, string | number>): void;
  enrichEdgeStyle?(edge: Edge, styleValues: Map<string, string | number>): void;
  enrichMessageFlowIconStyle?(edge: Edge, styleValues: Map<string, string | number>): void;
}
```

Values are `string | number` because mxGraph style properties can be either. `enrichMessageFlowIconStyle` targets a
sub-element of an edge, the message flow icon, which is a distinct visual element requiring its own style values
(`Q7`).

An extension owns its style keys, and must not add them to `BpmnStyleIdentifier`, which is public API and must stay
free of vendor-specific keys. The keys follow the dotted convention of the library, for instance
`bonita.hasConnector`. Values are read back as strings by the shapes, so a boolean property is stored as `'true'`.

#### 3. Rendering

```ts
interface RenderingExtensionPoint {
  onShapeCreated?(shape: mxShape, state: mxCellState): void;
}
```

Called by `BpmnCellRenderer.createShape`, which is where the library already customizes each freshly created shape
instance. The extension decorates the instance, typically by overriding one of its painting methods, and reads the
computed style to decide whether to do anything at all.

**The hook belongs to the cell renderer, not to the shape classes.** An earlier version of this ADR proposed hooking
into `paintForeground` in `BaseTaskShape`. That does not work for the target state: an extension living outside the
library can never modify or subclass the shape classes, whereas the cell renderer is a library-side seam it can be
plugged into.

Two constraints discovered while implementing it:

- the shape passed to the hook is not attached to the state yet and its `style` property is not assigned, mxGraph does
  that later in `configureShape`. The extension must read `state.style`;
- because the style is read once at creation, a style change applied at runtime is not reflected. This is acceptable
  today, as the public style API cannot set extension style keys, but it is a constraint to revisit if that changes.

#### 4. Icon painter methods

An extension needing to paint an icon contributes **methods**, which are injected into the `IconPainter` in use:

```ts
type IconPainterExtensionPoint = Record<string, (this: IconPainter, paintParameter: PaintParameter) => void>;
```

The methods are injected at library initialization, in `createNewBpmnGraph`, into the resolved painter **instance** and
never into the `IconPainter` prototype, so they cannot leak to the painters of the other `BpmnVisualization` instances.
A user-provided painter is augmented the same way. The extension declares the same method names on `IconPainter` with
declaration merging, otherwise callers cannot see them, and declares them optional since a painter only holds them once
the extension has been registered.

This settles two questions the previous version of this ADR left open:

- **contributing methods rather than a whole painter removes the conflict** between two extensions each providing their
  own `IconPainter`, since only one painter can be in use at a time;
- **the painter instance does not need to be replaced.** `IconPainter` is stateless and its methods are independent, so
  injecting methods into the existing instance is enough. There is a single place to configure icon painting, and it
  stays the `RendererOptions.iconPainter` renderer property.

Consequence on the library API: `IconPainter.newBpmnCanvas` had to become public. An injected method is not declared
within the class, so TypeScript denies it access to a protected member even with `this` typed as `IconPainter`. It is
the only thing an injected method needs from the painter, and it will have to be public API at step 4.

### Registration and configuration

#### Today: hardcoded internal lists

Each component consuming extension points holds a hardcoded list: `DiagramConverter` and `ProcessConverter` for
parsing, `StyleComputer` for style, `BpmnCellRenderer` for rendering, `createNewBpmnGraph` for the icon painter
methods. This is deliberate for steps 1 and 2, and is what step 3 replaces.

One limit is already visible: `StyleComputer` gates its extension list with `ignoreBpmnColors`, the only gating option
available. An always-active extension has to be appended by hand next to the gated one. Generic enabling and disabling
of an extension is required as soon as a second extension exists (`Q3`).

#### Target: a single registration point for the end user

A single extension involves several elements: model augmentations, a parsing extension point, a style extension point,
a rendering extension point, and icon painter methods. Requiring end users to configure each separately would be
impractical, as they should not need to know how an extension is internally decomposed. Only the extension developer
needs that.

A `BpmnExtension` interface groups them, so the user registers one object and the library distributes the individual
extension points to the relevant components (`Q8`):

```ts
interface BpmnExtension {
  parsing?: ParsingExtensionPoint;
  style?: StyleExtensionPoint;
  rendering?: RenderingExtensionPoint;
  iconPainter?: IconPainterExtensionPoint;
}

const bpmnVisualization = new BpmnVisualization({
  container: 'bpmn-container',
  bpmnExtensions: [bonitaConnectorExtension],
});
```

#### Built-in versus custom extensions

BPMN in Color is a **built-in** extension: always active internally, not exposed nor configurable. Its behavior does not
change and users do not register it. The Bonita Connector extension is currently built-in too, because it is a POC
inside the library; it becomes a custom extension at step 4.

## Out of scope: extensions adding new BPMN entities

Everything above covers extensions that **enrich elements the library already knows**. It does not cover extensions
introducing **new BPMN entities**, such as DF-BPMN.

Such an extension is not supported, and the mechanism described here is not sufficient for it. Beyond parsing and style
computing, it would at least need:

- a way to declare new element kinds, today a closed `ShapeBpmnElementKind` enum used across the whole library;
- parsing of the new elements, which the current hooks cannot express since they are called for elements the core
  already converted;
- a way to contribute the associated style sheet definitions, today hardcoded in `StyleConfigurator`;
- a way to register the shapes rendering the new elements, today hardcoded in `registerShapes`.

This is a materially larger change than the extension points above, and it should be assessed on its own rather than
grafted onto this ADR (`Q9`).

## Validation

The mechanism is validated by implementing two extensions.

### 1. Migrating BPMN in Color (done, step 1)

An internal refactoring with no user-facing behavior change. All existing BPMN in Color tests pass unmodified, which is
the acceptance criterion: behavior is unchanged.

Done in [PR #3519](https://github.com/process-analytics/bpmn-visualization-js/pull/3519), commit `fee41ab8` on the
`master` branch.

### 2. Implementing Bonita Connector (done as a POC, step 2)

Parsing reads the connector information from the semantic model and stores it in the internal model; style computing
exposes it as a cell style property; rendering paints the connector icon on the top right of the tasks.

This validation also produced a constraint on how an extension is tested, which matters for step 4: an extension living
outside the library only has access to the public API, so the only verifications available to it are the **computed
style of the cells**, read through the graph accessor, and **visual comparison**. The POC integration test therefore
asserts nothing but the cell style, and uses none of the test infrastructure of the library.

## Consequences

### Positive

- **Uniform mechanism**: all BPMN extensions follow the same pattern.
- **User-extensible**: users can implement their own BPMN extensions without forking the library, once step 4 is done.
- **Decoupled**: extensions are isolated from core code, making both easier to maintain and test.
- **Type-safe**: module augmentation provides TypeScript checking of the extension properties.
- **No change to the shape classes**: decorating shape instances from the cell renderer keeps the rendering hook usable
  by an extension that cannot modify the library.

### Negative

- **Indirection**: extension points add a level of indirection compared to a direct implementation.
- **API surface**: the extension point interfaces, plus what they transitively expose, increase the public API.
- **mxGraph leaks into an extension point**: the rendering extension point exposes `mxShape` and `mxCellState`, whereas
  mxGraph is otherwise an implementation detail (`Q4`).
- **Migration effort**: the existing hardcoded code has to be refactored, and the internal model documentation follows
  (the internal model diagram does not declare the extension types, and lacks the semantic carrier).

## Open questions

| Id  | Question                                                                                                                                                                 | Raised at |
|-----|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| Q1  | Should the ADR mention more extension examples, to widen the scope beyond colors and connectors, for instance extensions adding custom properties or visual decorations?  | initial   |
| Q2  | How do the extension lists reach the components consuming them once they are configurable: constructor parameters threaded through the parser, or a shared registry?      | step 2    |
| Q3  | How is an extension generically enabled or disabled? `ignoreBpmnColors` is extension-specific and cannot generalise.                                                      | step 2    |
| Q4  | Should mxGraph types be exposed to extensions? The rendering extension point needs `mxShape` and `mxCellState`, which contradicts mxGraph being an implementation detail.  | step 2    |
| Q5  | How can an extension read a vendor value from a spec-constrained attribute in a type-safe way? Enums such as `tImplementation` are closed and cannot be widened.          | step 2    |
| Q6  | Find a generic approach for label handling. `hasLabelExtensionData` is a workaround tied to the current immutable label design.                                           | step 1    |
| Q7  | Is "enrich" the right term for the style extension point? It also allows overriding. Alternatives: "compute", "mutate", "apply".                                          | initial   |
| Q8  | Naming: drop the "Point" suffix if it stays clear? Is `BpmnExtension` too generic if non-BPMN extensions are supported later, versus `BpmnVisualizationExtension`?        | initial   |
| Q9  | Should extensions adding new BPMN entities be supported, and in which ADR is that assessed?                                                                              | step 2    |
