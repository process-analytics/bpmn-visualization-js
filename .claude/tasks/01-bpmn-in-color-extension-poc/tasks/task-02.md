# Task: Implement BPMN in Color as extension

## Problem

The BPMN in Color parsing and style logic is hardcoded in `DiagramConverter` and `StyleComputer`. It needs to be extracted into a `BpmnExtension` implementation using the new extension point interfaces.

## Proposed Solution

Create a new module that implements `ParsingExtensionPoint` and `StyleExtensionPoint` for BPMN in Color. Move the existing color logic from DiagramConverter and StyleComputer into this module, including module augmentation to declare the color properties on the extension interfaces.

## Dependencies

- Task #1: Extension point interfaces and migrated types must exist

## Context

- New file: `src/component/extension/bpmn-in-color-extension.ts`
- Parsing logic to move: `src/component/parser/json/converter/DiagramConverter.ts` lines 166-169 (label color), 191-202 (`setColorExtensionsOnShape`), 212-218 (`setColorExtensionsOnEdge`)
- Style logic to move: `src/component/mxgraph/renderer/StyleComputer.ts` lines 85-95 (shape colors), 103-106 (edge colors), 121-124 (label font color)
- Module augmentation targets internal types file to add `fillColor`, `strokeColor`, `color` properties
- Label color handling moves from `deserializeLabel` into `onShapeDeserialized`/`onEdgeDeserialized` (label accessible via `shape.label` / `edge.label`, raw data via `bpmnShape.BPMNLabel`)
- `enrichShapeStyle`/`enrichEdgeStyle` also handle font color (via `shape.label.extensions.color`)
- Pools/lanes special case: fillColor also sets `STYLE_SWIMLANE_FILLCOLOR`
- Export `bpmnInColorParsingExtension` and `bpmnInColorStyleExtension` separately

## Success Criteria

- Module compiles and exports both extension point implementations
- Module augmentation adds color properties to the empty extension interfaces
- All color-related logic from DiagramConverter and StyleComputer is replicated in the extension
