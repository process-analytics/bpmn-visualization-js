# Task: Wire extension into DiagramConverter and StyleComputer

## Problem

DiagramConverter and StyleComputer still contain hardcoded BPMN in Color logic. They need to use the new extension points instead.

## Proposed Solution

Update DiagramConverter to internally register the BPMN in Color parsing extension and call it via the extension point loop. Update StyleComputer to internally register the BPMN in Color style extension (when `ignoreBpmnColors` is false) and call it via the extension point loop. Remove the hardcoded color functions and blocks.

## Dependencies

- Task #2: BPMN in Color extension implementation must exist

## Context

- DiagramConverter (`src/component/parser/json/converter/DiagramConverter.ts`):
  - Constructor unchanged. Add private field `parsingExtensions` initialized to `[bpmnInColorParsingExtension]`
  - Replace `setColorExtensionsOnShape(shape, bpmnShape)` (line 127) with extension loop
  - Replace `setColorExtensionsOnEdge(edge, bpmnEdge)` (line 151) with extension loop
  - Remove label color block in `deserializeLabel` (lines 166-169)
  - Delete `setColorExtensionsOnShape` and `setColorExtensionsOnEdge` functions
- StyleComputer (`src/component/mxgraph/renderer/StyleComputer.ts`):
  - Constructor unchanged. Add private field `styleExtensions` populated based on `ignoreBpmnColors`
  - Replace `if (!this.ignoreBpmnColors)` blocks in `computeShapeStyleValues` (lines 85-95) and `computeEdgeStyleValues` (lines 103-106) with extension loops
  - Remove font color block in `computeFontStyleValues` (lines 121-124) — handled by style extension
  - Keep `computeMessageFlowIconStyle` color logic inline (line 132-134) — different data structure
  - Keep `ignoreBpmnColors` field for message flow icon logic and extension registration decision

## Success Criteria

- All existing tests pass unchanged (unit, integration, e2e)
- No BPMN in Color-specific logic remains in DiagramConverter except the extension array
- StyleComputer's color logic is delegated to the extension (except message flow icon)
- `npm run lint-check` passes
