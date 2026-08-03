# Implementation: POC Bonita connector extension, step 1

Scope: step 1 of `plan.md` only. Steps 2 (icon painter injection extension point) and 3 (definitive icon) are not
implemented.

## Completed

### Core, internal model
- `src/model/bpmn/internal/types.ts`: added the `ShapeBpmnElementExtensions` empty interface, for extension
  properties computed from the BPMN **semantic** model, with a JSDoc explaining why a second carrier is needed next
  to `ShapeExtensions`. Added the two requested `TODO` comments about the internal model diagram: reference the new
  property, and declare the extension types themselves (`ShapeExtensions` first), which the diagram currently only
  mentions as property types.
- `src/model/bpmn/internal/shape/ShapeBpmnElement.ts`: added `readonly extensions: ShapeBpmnElementExtensions = {}`
  on the base class, with a comment on why it is not a constructor parameter property.

### Core, extension point
- `src/component/extension/extension-points.ts`: added `onFlowNodeConverted(shapeBpmnElement, bpmnElement)` to
  `ParsingExtensionPoint`, grouped under a comment separating the semantic-phase hook from the
  diagram-interchange-phase hooks.

### The extension itself, `src/component/extension/bonita-connector/`
- `types.ts`: augments `ShapeBpmnElementExtensions` with `bonita?: { hasConnector?: boolean }`. Records that no JSON
  model augmentation is needed, since `implementation` and `operationRef` are already declared on `TServiceTask`.
- `identifiers.ts`: `bonitaHasConnectorStyleIdentifier` (`'bonita.hasConnector'`) and
  `bonitaConnectorImplementation` (`'BonitaConnector'`).
- `parsing-extension.ts`: detects a connector on a service task whose `implementation` equals `BonitaConnector`, and
  sets `extensions.bonita = { hasConnector: true }` only in that case.
- `style-extension.ts`: sets the style key to the string `'true'` when the element has a connector.

### Core, pipeline wiring
- `src/component/parser/json/converter/ProcessConverter.ts`: hardcoded `parsingExtensions` property holding the
  connector extension, and the `onFlowNodeConverted` call in `buildFlowNodeBpmnElements`, next to `registerFlowNode`.
- `src/component/mxgraph/renderer/StyleComputer.ts`: the connector style extension is always registered; BPMN in
  Color remains gated by `ignoreBpmnColors`.

### Core, rendering
- `src/component/mxgraph/shape/render/BpmnCanvas.ts`: added
  `setIconOriginToShapeTopRightProportionally(shapeDimensionProportion)`, mirroring the top-left variant and
  subtracting the scaled icon width.
- `src/component/mxgraph/BpmnCellRenderer.ts`: `createShape` now decorates the `paintForeground` of task shapes
  (detected with `'paintTaskIcon' in shape`) through the module-level `paintBonitaConnectorIconOnTaskShape`
  function. It reads the style at paint time, brackets the painting with `save()`/`restore()`, and calls
  `paintScriptIcon` with `ratioFromParent: 0.22` and the top-right origin.
- `src/component/mxgraph/shape/activity-shapes.ts` was **not** modified, as required.

### Tests and fixtures
- `test/unit/component/extension/bonita-connector/parsing-extension.test.ts`: 8 tests, including the kind gate over
  5 non-service-task kinds and the "no empty sub-object" check.
- `test/unit/component/extension/bonita-connector/style-extension.test.ts`: 3 tests.
- `test/integration/bonita.connector.extension.test.ts`: 4 tests, self-contained (no matcher, no
  `helpers/model-expect`), reading the style with
  `bpmnVisualization.graph.getView().getState(cell).style`. Includes the regression case on the real Bonita 7.12.1
  export that declares the `bonitaConnector` namespace without any connector.
- `test/fixtures/bpmn/xml-parsing/bonita-connector/connector.detection.bpmn`: focused parsing fixture.
- `test/fixtures/bpmn/bonita-connector/connector.01.tasks.bpmn` and `connector.02.large.task.bpmn`: focused e2e
  diagrams.
- `test/e2e/bonita.connector.test.ts`: visual regression, no per-snapshot threshold, browser-family defaults at
  `0 / 100`.

## Deviations from plan

1. **No copy of `iconStyleConfig` in the cell renderer.** The plan asked for one because `paintScriptIcon` mutates
   `fillColor` on the object it receives. Reading `buildPaintParameter` showed it already builds a fresh
   `iconStyleConfig` literal on every call, so nothing shared can be mutated and the copy would have been dead
   code. `ratioFromParent` is passed to `buildPaintParameter` directly instead of being overridden afterwards.
2. **`ratioFromParent` is `0.22`**, copied from `ScriptTaskShape.paintTaskIcon`, so the connector icon has the same
   visual weight as the built-in script task icon.
3. **Playwright browsers had to be installed** (`npx playwright install chromium`): the cached build was stale after
   the recent playwright 1.58.2 to 1.61.1 bump, and the e2e run could not start without it. No project file changed.

## Test results

- `npm run build` (tsc --noEmit): pass.
- `npm run lint-check`: pass.
- `npm run test:unit`: 56 suites, 3167 tests, all pass. The 2 new suites contribute 11 tests.
- `npm run test:integration`: 15 suites, 323 tests, all pass. The new suite contributes 4 tests.
- `npx jest test/e2e/bonita.connector.test.ts` (chromium): 2 tests pass, 2 snapshots written.
- **No pre-existing test changed. No pre-existing image snapshot changed.** `git status` lists only the 7
  intentionally modified source files plus the new files.

Visual check of the generated snapshots:
- `connector.01.tasks.png`: the service task with a connector shows the gear icon top-left **and** the script icon
  top-right. The service task without a connector and the user task show only their own icon.
- `connector.02.large.task.png`: on the 300x240 task, both the position and the size of the connector icon scale
  with the shape, exactly as the gear icon does.

## Follow-up tasks

- Step 2: icon painter injection extension point, green rectangle glyph, `newBpmnCanvas` from `protected` to
  `public`.
- Step 3: definitive connector icon.
- The 7 ADR deviations listed at the end of `plan.md`, for the ADR rewrite.
- The 2 TODOs left in `src/model/bpmn/internal/types.ts` about the internal model diagram.
