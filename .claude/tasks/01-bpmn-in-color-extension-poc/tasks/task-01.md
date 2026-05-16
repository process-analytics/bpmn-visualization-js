# Task: Define extension point interfaces and migrate extension types

## Problem

There are no extension point interfaces in the codebase. The extension types (`ShapeExtensions`, `EdgeExtensions`, `LabelExtensions`) are type aliases, which prevents TypeScript module augmentation.

## Proposed Solution

Create the extension point interfaces (`ParsingExtensionPoint`, `StyleExtensionPoint`, `BpmnExtension`) in a new file. Migrate the three extension types from type aliases to empty interfaces.

## Dependencies

- None (can start immediately)

## Context

- New file: `src/component/extension/extension-points.ts`
- Types to migrate: `src/model/bpmn/internal/types.ts` (lines 20-37)
- ADR describes the interfaces: `docs/contributors/adr/001-bpmn-extensions-management.md`
- `ParsingExtensionPoint`: `onShapeDeserialized(shape, bpmnShape)`, `onEdgeDeserialized(edge, bpmnEdge)`
- `StyleExtensionPoint`: `enrichShapeStyle(shape, styleValues)`, `enrichEdgeStyle(edge, styleValues)`
- `styleValues` is `Map<string, string | number>` mutated in place

## Success Criteria

- Extension point interfaces exist and compile
- Extension types are empty interfaces (not type aliases)
- All existing tests pass unchanged (the empty interfaces are structurally compatible with the old types)
