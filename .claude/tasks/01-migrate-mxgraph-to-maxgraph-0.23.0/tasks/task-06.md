# Task: Migrate StyleConfigurator, identifiers and style/utils

## Problem
`StyleConfigurator` registers stylesheets as mxGraph `StyleMap` strings, `BpmnStyleIdentifier` holds many `bpmn.*` DATA keys that typed properties now replace, and `style/utils.ts` mutates style strings. All must move to `CellStyle` objects.

## Proposed Solution
Convert every `StyleMap` to a `CellStyle` object passed to `putCellStyle`, and the specific-style maps to `(style: CellStyle) => void` mutators. Use registered perimeter strings and typed arrow values; `delete style.endArrow` to unset; use native maxGraph marker fill color support (Q4, with the custom-route fallback documented). Keep the edge `arcSize` at the v1 halved value (2.5) with a `TODO maxgraph@0.23.0` for the final revert. Shrink `BpmnStyleIdentifier` to the names still needed as REGISTERED identifiers (`MESSAGE_FLOW_ICON`, and `EDGE` only if `BpmnConnector` survives Task 8); keep `MarkerIdentifier.ARROW_DASH`. Rewrite `style/utils.ts` helpers to mutate `CellStyle` objects, guarding `setStyleFlag` against undefined. No `StyleDefaultsConfig` (Q7).

## Dependencies
- Task #2 (style types); Task #5 (typed properties replacing the removed identifier keys).

## Context
- `plan.md` Phase 4 (`StyleConfigurator.ts`, `identifiers.ts`, `style/utils.ts`) has the detail.
- Key files: `src/component/mxgraph/config/StyleConfigurator.ts`, `src/component/mxgraph/style/identifiers.ts`, `src/component/mxgraph/style/utils.ts`.
- `BpmnStyleIdentifier` is public `@experimental` API: log removed members in `breaking-changes.md`, update JSDoc.

## Success Criteria
- Stylesheets register as `CellStyle` objects; perimeters/arrows are typed/registered values.
- `BpmnStyleIdentifier` reduced to registered names; removals logged in breaking-changes.
- `style/utils.ts` mutates objects with the undefined guard.
- arcSize kept at 2.5 with the revert TODO.
