# Task: Migrate StyleComputer and the read/compute style side

## Problem
This is the hardest area of the migration (flagged in the original request). `StyleComputer` builds mxGraph style STRINGS (`'kind;bpmn.k=v;...'`); maxGraph needs typed `CellStyle` OBJECTS with `baseStyleNames` and typed `bpmn.*` properties. The extension contract and the class-name reader parse those strings today.

## Proposed Solution
Rewrite `computeStyle()` to return a `BpmnCellStyle`: first token becomes `baseStyleNames`, value maps become typed property assignments (shape values under `style.bpmn.*`, font as `fontFamily`/`fontSize`/`fontStyle` via `constants.FONT_STYLE_MASK.*`, label as string-literal alignment props). Use booleans instead of `'true'/'false'`; do not set `fontStyle` to 0; keep the pool/lane `horizontal = !shape.isHorizontal` inversion. Update the extension contract and the BPMN-in-Color extension to write typed properties. Rewrite `style-utils.ts` class-name readers to read typed props instead of splitting on `;`. Delete the string-serialization helper.

## Dependencies
- Task #2 (style types).

## Context
- `plan.md` Phase 4 (`StyleComputer.ts`, `extension-points.ts`, `bpmn-in-color/style-extension.ts`, `style-utils.ts`) has the detail.
- Key files: `src/component/mxgraph/renderer/StyleComputer.ts`, `src/component/extension/extension-points.ts`, `src/component/extension/bpmn-in-color/style-extension.ts`, `src/component/mxgraph/renderer/style-utils.ts`.
- v1 reference exists for these files but must be adapted to master's extension-hook era.
- Preserve the JSDoc/comments documenting undocumented label behaviors (reword mxGraph→maxGraph where behavior carried over).

## Success Criteria
- `computeStyle()` returns typed `BpmnCellStyle` objects; no string serialization remains.
- The BPMN-in-Color extension and class-name readers operate on typed properties.
- Compiles against the new style types.
