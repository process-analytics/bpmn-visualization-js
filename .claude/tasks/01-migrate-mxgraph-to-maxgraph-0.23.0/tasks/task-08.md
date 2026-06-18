# Task: Migrate shapes and icons, and run the BpmnConnector experiment

## Problem
Every custom shape extends an `mx*` base class and reads style via `mxUtils.getValue(this.style, <string key>, default)` with `'true'/'false'` string comparisons. The icon painter has ~45 `arcTo`/`curveTo` sites using `0|1` arc flags. Separately, `BpmnConnector` exists partly to support edge marker fill colors that maxGraph 0.23.0 may now provide natively (Q4).

## Proposed Solution
Rename base classes (`RectangleShape`, `EllipseShape`, `RhombusShape`, canvas `AbstractCanvas2D`) and replace `mxUtils.getValue` reads with typed `(this.style as BpmnCellStateStyle).bpmn?.<prop> ?? default` access, converting string comparisons to undefined-aware booleans. Convert `arcTo`/`curveTo` arc flags from `0|1` to booleans in `BpmnCanvas` and `icon-painter`. For Q4: FIRST try deleting `BpmnConnector` and relying on native marker fill colors; verify the `paintEdgeLine` pointer-events concern is still covered (by `overrideCreateSvgCanvas` or a minimal `BpmnConnector extends ConnectorShape`); if native fill colors fail, keep `BpmnConnector` with typed style reads and the inherited TODO. Record the outcome in `breaking-changes.md`.

## Dependencies
- Task #4 (registration), Task #6 (identifiers/markers), Task #7 (typed style reads).

## Context
- `plan.md` Phase 5 (`activity-/event-/gateway-/flow-/text-annotation-shapes.ts`, `edges.ts`, `render/BpmnCanvas.ts`, `render/icon-painter.ts`, `render-types.ts`) has the detail.
- The BpmnConnector experiment should be its own commit so it is individually revertable.
- Public types (`PaintParameter` etc.): swap `mx*` types, log type-level breaks in breaking-changes.

## Success Criteria
- All shapes extend maxGraph base classes and read typed style; no `mxUtils.getValue`.
- arc flags are booleans throughout `BpmnCanvas` and `icon-painter`.
- Q4 outcome decided and recorded; if `BpmnConnector` deleted, its style assertions removed (not ported).

## Outcome (Q4)
`BpmnConnector` was first slimmed to the pointer-events tweak only, then fully deleted (`edges.ts` removed, along with the `bpmn.edge` registration and `BpmnStyleIdentifier.EDGE`). maxGraph applies the start/end marker fill colors natively via the `startFillColor`/`endFillColor` style properties; the visual theme e2e tests still pass after removal, confirming native handling. The click-capture concern (issue #920) is handled independently in `shape/utils.ts`. See `breaking-changes.md`.
