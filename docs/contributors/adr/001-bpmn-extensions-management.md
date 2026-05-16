# BPMN Extensions Management

## Status

| Field             | Value          |
|-------------------|----------------|
| **Status**        | Early Proposal |
| **Date**          | 2026-05-13     |
| **Updated**       | -              |
| **Supersedes**    | -              |
| **Superseded by** | -              |


**IMPORTANT:** This is an early proposal for managing BPMN extensions in `bpmn-visualization`.
The design is subject to change based on feedback and further analysis. The goal is to introduce a consistent and extensible mechanism for handling BPMN extensions, allowing both built-in and user-defined extensions to coexist without modifying core library code.

## Context

The [BPMN specification](https://www.omg.org/spec/BPMN/2.0.2/) allows for extensions: custom elements and attributes that can be added to BPMN models to provide additional functionality or information beyond the standard.
Extensions can be applied to both the semantic model (process elements like tasks, events, gateways) and the diagram interchange model (visual elements like shapes, edges, labels).

Examples of BPMN extensions include:
- [BPMN in Color](https://github.com/bpmn-miwg/bpmn-in-color): Adds color attributes (`background-color`, `border-color`, ...) to shapes, edges, and labels.
- [Bonita Connector](https://documentation.bonitasoft.com/bonita/2025.2/process/connectivity-overview): Adds connector metadata to tasks and pools, displayed as a specific icon on the top-right of the Tasks (not displayed on Pools).

Managing BPMN extensions in a consistent and extensible way is important to allow `bpmn-visualization` to support known extensions and to let users implement their own.

**Open question**: should we mention other examples of extensions, to have a broader scope than just colors and connectors? For example, extensions that add custom properties to elements or extensions that add new visual decorations.

## Situation before this ADR

`bpmn-visualization` does not provide a generic mechanism for managing BPMN extensions.

The only extension currently supported is **BPMN in Color**, which is hardcoded in the codebase:
- **Parsing**: `DiagramConverter` contains dedicated functions (`setColorExtensionsOnShape`, `setColorExtensionsOnEdge`) that read color attributes from the raw JSON and populate the internal model's extension properties. See `src/component/parser/json/converter/DiagramConverter.ts` lines 191-218.
- **Style computing**: `StyleComputer` reads the extension properties and maps them to mxGraph style constants. See `src/component/mxgraph/renderer/StyleComputer.ts`.
- **Model**: `ShapeExtensions`, `EdgeExtensions`, and `LabelExtensions` are defined as type aliases in `src/model/bpmn/internal/types.ts`, with hardcoded color properties.

This approach is not replicable: there is no extension point that would allow adding a new BPMN extension without modifying the core library code.


## Decision

Introduce extension points in the library to manage BPMN extensions consistently and allow users to create and manage their own extensions.

### What is involved

Supporting BPMN extensions touches three layers of data and three phases of the pipeline.

**Data layers:**
- **BPMN model (XML)** — the extension definition as expressed in the BPMN XML, either via custom attributes or via dedicated extension elements.
- **JSON model (raw data)** — the typed JSON representation of the XML, produced by the XML parser. Extensions augment this model to expose their custom attributes in a type-safe way.
- **Internal model (computed properties)** — the domain model used by the rest of the library. Extensions augment this model with **computed** properties derived from parsing — these properties may or may not come from XML extensions.

**Pipeline phases:**
- **Parsing** — reads the XML/JSON extension data and populates the internal model's extension properties.
- **Style computing** — derives mxGraph styles from the internal model's extension properties.
- **Rendering** — paints additional visual elements (icons, decorations) on existing shapes, or creates new ones, based on the internal model.

**Summary of the data flow:** BPMN model (XML) ↔ JSON model (raw data) ↔ internal model (computed properties) ↔ extension points in the pipeline (hooks for parsing, style computing, rendering).


### Extension Model: use TypeScript module augmentation

#### JSON model: use TypeScript module augmentation

The JSON model interfaces (`BPMNShape`, `BPMNEdge`, `BPMNLabel` in `src/model/bpmn/json/bpmndi.ts`) must also be extended when parsing extensions read custom attributes from the raw BPMN XML data.

For example, the BPMN in Color parsing extension reads color attributes (`background-color`, `fill`, `border-color`, `stroke`, `color`) that are not part of the base JSON model types. Module augmentation is used to declare these properties on the JSON model interfaces:

```ts
// In the BPMN in Color extension (src/component/extension/bpmn-in-color/types.ts)
declare module '../../../model/bpmn/json/bpmndi' {
  interface BPMNShape {
    'background-color'?: string;
    fill?: string;
    'border-color'?: string;
    stroke?: string;
  }
  interface BPMNEdge {
    'border-color'?: string;
    stroke?: string;
  }
  interface BPMNLabel {
    color?: string;
  }
}
```

This way, the parsing extension can read these properties in a type-safe manner without modifying the base JSON model interfaces.

#### Internal model: use TypeScript module augmentation

The current extension types (`ShapeExtensions`, `EdgeExtensions`, `LabelExtensions`) are type aliases. They must be migrated to **interfaces** to enable [TypeScript module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation). This approach was first suggested during the BPMN in Color implementation in [this PR comment](https://github.com/process-analytics/bpmn-visualization-js/pull/2614#discussion_r1200547629).

After migration, the base interfaces in the library become empty:

```ts
// In bpmn-visualization (library code)
export interface ShapeExtensions {}
export interface EdgeExtensions {}
export interface LabelExtensions {}
```

Users (or built-in extensions like BPMN in Color) augment them to declare the properties they need:

```ts
// Example: a custom extension that adds connector metadata to shapes
declare module 'bpmn-visualization' {
  export interface ShapeExtensions {
    connectorType?: string;
    connectorVersion?: string;
  }
}
```

This pattern is used by libraries like [MUI for theme customization](https://mui.com/material-ui/customization/theming/#typescript).

The BPMN in Color extension augments both JSON and internal model interfaces in `src/component/extension/bpmn-in-color/types.ts`:

```ts
// Internal model augmentation
declare module '../../../model/bpmn/internal/types' {
  interface ShapeExtensions {
    fillColor?: string;
    strokeColor?: string;
  }
  interface EdgeExtensions {
    strokeColor?: string;
  }
  interface LabelExtensions {
    color?: string;
  }
}
```

#### JSON model versus internal model independence

The JSON model already provides `TExtension` (defined in `src/model/bpmn/json/Semantic.ts`) to represent XML extension elements.
The internal model extensions serve a different purpose: they store **computed results** derived from parsing, which may or may not come from XML extensions.

These two must remain independent:
- A user may want internal model extensions without any XML extensions (e.g., extensions computed from external data).
- A user may want XML extensions without enriching the internal model.
- When both are used, the parsing extension point acts as the bridge: it reads from the JSON model and populates the internal model extensions.

### Extension Points

Three categories of extension points, corresponding to the three phases of the library pipeline:

#### 1. Parsing extension point

Called at the end of the existing parsing pipeline in converters (`DiagramConverter`, `ProcessConverter`, potentially others). The extension point receives both the internal model object and the raw JSON data, and enriches the model's extension properties.

Labels are children of shapes and edges. Their extensions are populated during shape/edge deserialization (the label is accessible via the parent shape/edge object). There is no need for a separate label hook.

```ts
interface ParsingExtensionPoint {
  /** Called after a Shape has been deserialized. Use shape.label to enrich label extensions. */
  onShapeDeserialized?(shape: Shape, bpmnShape: BPMNShape): void;
  /** Called after an Edge has been deserialized. Use edge.label to enrich label extensions. */
  onEdgeDeserialized?(edge: Edge, bpmnEdge: BPMNEdge): void;
  /** Returns true if the given BPMN label data requires a label to be created during deserialization. */
  hasLabelExtensionData?(bpmnLabel: unknown): boolean;
}
```

The `hasLabelExtensionData` method is a workaround for a constraint discovered during the BPMN in Color refactoring: labels are immutable once set on a shape or edge, so extensions that need a label (e.g., to apply font color) must signal that requirement before label creation happens.
`DiagramConverter.deserializeLabel` calls `hasLabelExtensionData` on all registered extensions. If any extension returns `true`, a `Label` object is created even if the label has no font or bounds — ensuring that the extension can later populate the label's extension properties via `onShapeDeserialized` or `onEdgeDeserialized`.

**Open question**: find a more generic approach for label handling — `hasLabelExtensionData` is a workaround tied to the current immutable label design.

For example, the current `setColorExtensionsOnShape` function in `DiagramConverter` becomes an implementation of `onShapeDeserialized` in the BPMN in Color extension.

#### 2. Style extension point

Called by `StyleComputer` to compute additional mxGraph style properties from the internal model extensions.

The extension receives the existing style entries map and mutates it directly, avoiding the need for merging in the caller. As with parsing, label styles are handled through the parent shape/edge (accessible via the `label` property on the model object).

```ts
interface StyleExtensionPoint {
  /** Enrich style entries for a shape. Use shape.label to enrich label styles. */
  enrichShapeStyle?(shape: Shape, styleValues: Map<string, string | number>): void;
  /** Enrich style entries for an edge. Use edge.label to enrich label styles. */
  enrichEdgeStyle?(edge: Edge, styleValues: Map<string, string | number>): void;
  /** Enrich style entries for the message flow icon of an edge. */
  enrichMessageFlowIconStyle?(edge: Edge, styleValues: Map<string, string | number>): void;
}
```

The `styleValues` map uses `string | number` values because mxGraph style properties can be either strings (e.g., color hex codes) or numbers (e.g., font sizes, stroke widths).

The `enrichMessageFlowIconStyle` hook targets a sub-element of an edge — the message flow icon — which is a distinct visual element painted on a message flow edge and requires its own style values. Without a dedicated hook, the style computation for this icon would still need to hardcode color logic, defeating the goal of moving all extension-specific code out of the core.

**Open question**: is "enrich" the right term here? It implies that the extension adds to existing styles, but in practice it may also override them. Alternative terms could be "compute", "mutate", or simply "apply".

#### 3. Rendering extension point

> **Not implemented in this refactoring.** This extension point describes target-state behavior; it is deferred to follow-up work (cf. "Refactoring scope vs. follow-up work" below).

Called during shape rendering to paint additional elements (icons, decorations) on shapes and edges. This hooks into the mxGraph shape painting methods (e.g., `paintForeground` in `BaseTaskShape`, and potentially other painting methods depending on the extension's needs).

```ts
interface RenderingExtensionPoint {
  /** Paint additional elements on a shape */
  paintShape?(paintParameter: PaintParameter): void;
}
```

For the Bonita Connector use case, this extension point would paint a connector icon on the top-right of tasks. The extension provides its own icon painter implementation.


### Configuration

#### Refactoring scope vs. follow-up work

This ADR proposes an **internal refactoring to validate the extension mechanism**. Its scope is intentionally limited:

- **In scope** — **extracting** the hardcoded BPMN in Color logic from the core components into separate extension modules. The goal is to demonstrate that the implementation _can_ be extracted into objects that conform to the extension point interfaces, without changing any public interface of `DiagramConverter`, `StyleComputer`, or `BpmnVisualization`. Existing tests must keep passing without modification. The internal registration of the built-in extension is still hardcoded in the components that consume it (an array literal in `DiagramConverter` and `StyleComputer`).
- **Out of scope (follow-up work)** — **injecting** the extensions from the outside. This includes:
  - exposing a public API such as `new BpmnVisualization({ bpmnExtensions: [...] })`,
  - introducing a `BpmnExtension` grouping interface so that one extension is registered as a single object instead of multiple per-phase objects,
  - the icon painter injection mechanism described below,
  - generalizing the gating behavior of `ignoreBpmnColors` (currently only the style extension is gated; the parsing extension always runs because the internal registration is not yet configurable).

The rest of this section describes the **target state** for follow-up work, not what this refactoring delivers today.

#### Single registration point for the end user

As described above, a single extension involves multiple elements: model augmentation (JSON and internal), a parsing extension point, a style extension point, and potentially a rendering extension point and custom icon painter methods. Requiring end users to configure each of these separately would be impractical — they should not need to understand the internal decomposition of an extension. Only the extension developer needs this knowledge.

To address this, a `BpmnExtension` interface groups all extension points for a single extension. The end user registers one object (e.g., `bonitaConnectorExtension`) and the library takes care of distributing the individual extension points to the relevant components (parser, style computer, renderer). From the user's perspective, adding an extension is a single, opaque operation.

#### Icon Painter

The `IconPainter` is already configurable via `RendererOptions.iconPainter` in the renderer property. There must be a single place to configure icon painting, and it must remain in the renderer property — not be duplicated in the extension configuration.

An extension that needs custom shape painting should provide additional icon painter **methods** rather than a full `IconPainter` instance. These methods are injected into the existing icon painter implementation at registration time (in the factory). This avoids the conflict of multiple extensions each providing a competing full painter.

**Open question**: If two extensions each provide a different `IconPainter`, only one can be active. This needs further design work — possible approaches include composing painters, a chain-of-responsibility pattern, or scoping painters to specific element kinds. This will be addressed in a follow-up discussion.

**Open question**: should we pass individual icon painter methods (injected in the factory) instead of the whole painter?
- The `createNewBpmnGraph` function is currently in charge of selecting the icon painter implementation based on the options. It will have to apply the new methods.
- Interface for the options or Record: key = name of the methods, value = implementation of the method (can be a reference). What signature? This will prevent methods from depending on a property of the painter. It should not be a problem, we don't see this need for now.
- Also required to use interface augmentation on the `IconPainter` class to make TypeScript aware of these new methods.
- This would allow avoiding the issue of multiple painters, as each extension would only pass the methods.

**Open question**: the name of the interfaces may remove the "Point" suffix if it's clear enough without it. Also, the name "BpmnExtension" may be too generic if we want to support non-BPMN extensions in the future — consider "BpmnVisualizationExtension" or similar.

```ts
interface BpmnExtension {
  parsing?: ParsingExtensionPoint;
  style?: StyleExtensionPoint;
  rendering?: RenderingExtensionPoint;
}
```

#### Built-in vs. custom extensions

BPMN in Color is a **built-in extension**: it is always active internally and not exposed or configurable by users. The current behavior does not change — users do not need to register it. Internally, it will be refactored to use the same extension mechanism, but it remains an implementation detail of the library.

Only custom extensions (e.g., Bonita Connector) are passed to `BpmnVisualization` at construction time:

```ts
const bpmnVisualization = new BpmnVisualization({
  container: 'bpmn-container',
  bpmnExtensions: [bonitaConnectorExtension],
});
```

The naming of interfaces and the detailed API are subject to refinement during implementation.


## Validation

The solution will be validated by implementing two extensions:

### 1. Migrate BPMN in Color

Migrate the current hardcoded BPMN in Color implementation to the new extension mechanism. BPMN in Color remains a built-in, always-active extension — this migration is an internal refactoring with no user-facing behavior change.

#### Migration plan

1. **Introduce the extension point interfaces needed by this refactoring** — Create `ParsingExtensionPoint` and `StyleExtensionPoint`. `RenderingExtensionPoint` and the `BpmnExtension` grouping interface are deferred to follow-up work (cf. "Refactoring scope vs. follow-up work" above), as they are only useful once extensions can be injected by users.
2. **Migrate extension types** — Convert `ShapeExtensions`, `EdgeExtensions`, `LabelExtensions` from type aliases to empty interfaces. Move the BPMN in Color properties into a module augmentation declared alongside the built-in extension implementation.
3. **Create the built-in BPMN in Color extension** — Implement two separate objects, one per phase, since this refactoring does not introduce a `BpmnExtension` grouping interface (cf. "Refactoring scope vs. follow-up work" above):
   - `bpmnInColorParsingExtension`, an object implementing `ParsingExtensionPoint`, containing the logic currently in `setColorExtensionsOnShape` and `setColorExtensionsOnEdge` (from `DiagramConverter`).
   - `bpmnInColorStyleExtension`, an object implementing `StyleExtensionPoint`, containing the color-to-mxGraph-style mapping currently in `StyleComputer`.
4. **Wire the extension mechanism into the pipeline** — Update `DiagramConverter` and `StyleComputer` to call registered extension points instead of hardcoded color logic. Register the built-in BPMN in Color extension internally (not exposed to users).
5. **Remove hardcoded BPMN in Color code** — Delete the dedicated color functions from `DiagramConverter` and the color-specific branches from `StyleComputer`. The core code should no longer contain any BPMN in Color-specific logic.
6. **Validate** — Ensure all existing BPMN in Color tests pass without modification (behavior is unchanged).

### 2. Implement Bonita Connector

Implement the Bonita Connector extension as a new extension:
- **Parsing**: Read connector metadata from BPMN XML extensions on tasks/pools and store it in the internal model.
- **Rendering**: Paint a connector icon on the top-right of shapes that have connectors, using a custom icon painter implementation.


## Consequences

### Positive

- **Uniform mechanism**: All BPMN extensions follow the same pattern, making the codebase more consistent.
- **User-extensible**: Users can implement their own BPMN extensions without forking or modifying the library.
- **Decoupled**: Extensions are isolated from core code, making both easier to maintain and test.
- **Type-safe**: Module augmentation provides TypeScript type checking for extension properties.

### Negative

- **Indirection**: Extension points add a level of indirection compared to the current direct implementation.
- **API surface**: New public interfaces (`BpmnExtension`, `ParsingExtensionPoint`, `StyleExtensionPoint`, `RenderingExtensionPoint`) increase the API surface.
- **Migration effort**: Existing BPMN in Color code must be refactored to use the new mechanism.
