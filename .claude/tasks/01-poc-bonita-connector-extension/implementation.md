# Implementation: POC Bonita connector extension, phase 1 complete

Scope: the 3 steps of `plan.md`. Phases 2 and 3, and the ADR rewrite, remain out of scope.

## Step 3: real icon in the injected method

- `src/component/extension/bonita-connector/icon-painter-extension.ts`: the injected method now delegates to
  `this.paintScriptIcon(paintParameter)` instead of painting the placeholder green rectangle. Delegating is possible
  because the injected method runs with the painter as `this`, and it keeps the POC free of duplicated path data.
- No copy of `iconStyleConfig` is passed, for the same reason as in step 1: `buildPaintParameter` builds a fresh
  `iconStyleConfig` literal on every paint, so the mutation `paintScriptIcon` performs on it cannot leak.
- The origin and the ratio are already set by the rendering extension, so nothing about the positioning or the scaling
  changes in this step.
- The e2e snapshots are back to their step 1 content: they were restored from commit `63ca085f4` and **passed
  unmodified**. That is the proof that the full extension path (rendering extension, then the icon painter method
  injected at library initialization) renders pixel-identically to the direct `paintScriptIcon` call of step 1.

Note on the icon itself: the definitive Bonita connector glyph is not available in this repository, so the script task
icon is used, as agreed. Swapping it later is a one-line change in this single function.

## Step 2: icon painter injection

- `src/component/mxgraph/shape/render/icon-painter.ts`: `newBpmnCanvas` went from `protected` to public, with a JSDoc
  explaining that it is the entry point of the methods contributed by extensions, which are injected into an instance
  and therefore cannot reach protected members.
- `src/component/extension/extension-points.ts`: added `IconPainterExtensionPoint`, a `Record` of method name to
  implementation, typed so `this` is the `IconPainter`.
- `src/component/extension/bonita-connector/icon-painter-extension.ts`: contributes `paintBonitaConnectorIcon`,
  painting the placeholder green rectangle through `this.newBpmnCanvas`.
- `src/component/extension/bonita-connector/types.ts`: declaration merging adding the optional
  `paintBonitaConnectorIcon` to `IconPainter`. All augmentations of the extension stay gathered in this file, which
  every other file of the extension already imports. Note: `PaintParameter` needs no import there, because inside a
  `declare module` block the scope is the augmented module, which declares it. Importing it at the top of the file
  actually breaks the build with TS6133, the import being seen as unused.
- `src/component/mxgraph/GraphConfigurator.ts`: new `resolveIconPainter`, which resolves the painter
  (`rendererOptions.iconPainter` or a new one) and injects the contributed methods into **that instance**, never into
  the prototype, so nothing leaks to the painters of the other `BpmnVisualization` instances.
- `src/component/extension/bonita-connector/rendering-extension.ts`: calls
  `shape.iconPainter.paintBonitaConnectorIcon?.(...)` instead of `paintScriptIcon`. The optional call is not
  defensive style: the method is declared optional because an `IconPainter` only holds it once the extension has been
  registered.
- `test/unit/component/extension/bonita-connector/icon-painter-extension.test.ts`: 3 tests, including the
  prototype-pollution guard (a second, untouched `IconPainter` must not have the method).

Acceptance criterion met: the 2 e2e snapshots changed, and the diff is confined to the top right corner of the task
holding the connector. That is the proof the injected method is the one executing, and not the built-in
`paintScriptIcon`. The icon still scales with the task.

## Completed

### Core, internal model
- `src/model/bpmn/internal/types.ts`: added the `ShapeBpmnElementExtensions` empty interface, for extension
  properties computed from the BPMN **semantic** model, with a JSDoc explaining why a second carrier is needed next
  to `ShapeExtensions`. Added the two requested `TODO` comments about the internal model diagram: reference the new
  property, and declare the extension types themselves (`ShapeExtensions` first), which the diagram currently only
  mentions as property types.
- `src/model/bpmn/internal/shape/ShapeBpmnElement.ts`: added `readonly extensions: ShapeBpmnElementExtensions = {}`
  on the base class, with a comment on why it is not a constructor parameter property.

### Core, extension points
- `src/component/extension/extension-points.ts`: added `onFlowNodeConverted(shapeBpmnElement, bpmnElement)` to
  `ParsingExtensionPoint`, grouped under a comment separating the semantic-phase hook from the
  diagram-interchange-phase hooks.
- Same file: added `RenderingExtensionPoint` with `onShapeCreated(shape, state, iconPainter)`, so no
  extension-specific code lives in the cell renderer.

### The extension itself, `src/component/extension/bonita-connector/`
- `types.ts`: augments `ShapeBpmnElementExtensions` with `bonita?: { hasConnector?: boolean }`. Records that no JSON
  model augmentation is needed, since `implementation` and `operationRef` are already declared on `TServiceTask`.
- `identifiers.ts`: `bonitaHasConnectorStyleIdentifier` (`'bonita.hasConnector'`) and
  `bonitaConnectorImplementation` (`'BonitaConnector'`).
- `parsing-extension.ts`: detects a connector on a service task whose `implementation` equals `BonitaConnector`, and
  sets `extensions.bonita = { hasConnector: true }` only in that case.
- `style-extension.ts`: sets the style key to the string `'true'` when the element has a connector.
- `rendering-extension.ts`: implements `RenderingExtensionPoint`. It owns the whole policy: the task shape detection
  (`'paintTaskIcon' in shape`), the gate on the style key, and the `paintForeground` decoration painting the script
  icon on the top right.

### Core, pipeline wiring
- `src/component/parser/json/converter/ProcessConverter.ts`: hardcoded `parsingExtensions` property holding the
  connector extension, and the `onFlowNodeConverted` call in `buildFlowNodeBpmnElements`, next to `registerFlowNode`.
- `src/component/mxgraph/renderer/StyleComputer.ts`: the connector style extension is always registered; BPMN in
  Color remains gated by `ignoreBpmnColors`.

### Core, rendering
- `src/component/mxgraph/shape/render/BpmnCanvas.ts`: added
  `setIconOriginToShapeTopRightProportionally(shapeDimensionProportion)`, mirroring the top-left variant and
  subtracting the scaled icon width.
- `src/component/mxgraph/BpmnCellRenderer.ts`: holds a hardcoded `renderingExtensions` list, with the same comment as
  the parsing and style lists, and `createShape` simply runs it. No connector-specific code, no style key, no task
  detection: everything is in the extension.
- `src/component/mxgraph/shape/activity-shapes.ts` was **not** modified, as required.

### Tests and fixtures
- `test/unit/component/extension/bonita-connector/parsing-extension.test.ts`: 8 tests, including the kind gate over
  5 non-service-task kinds and the "no empty sub-object" check.
- `test/unit/component/extension/bonita-connector/style-extension.test.ts`: 3 tests.
- `test/unit/component/extension/bonita-connector/rendering-extension.test.ts`: 4 tests on the gate, asserting that
  `paintForeground` is replaced only for a task shape whose style holds the connector. Needs the
  `@jest-environment jsdom` docblock, since the extension imports the mxGraph initializer.
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
3. **The gate now runs once at shape creation, not on every paint.** Requested explicitly. It works because
   `mxCellRenderer.createShape` returns a shape whose `style` is still unset (mxGraph assigns it later in
   `configureShape` through `shape.apply(state)`), so the extension reads `state.style`, which is already resolved at
   that point. Consequence: if a cell style were mutated at runtime to add or remove `bonita.hasConnector`, the
   decoration would not follow, because mxGraph only recreates a shape when the `shape` style key changes. Not
   reachable today, since the public style API cannot set that key: only parsing and style computing do, both before
   shape creation.
4. **Playwright browsers had to be installed** (`npx playwright install chromium`): the cached build was stale after
   the recent playwright 1.58.2 to 1.61.1 bump, and the e2e run could not start without it. No project file changed.

## Test results

- `npm run build` (tsc --noEmit): pass.
- `npm run lint-check`: pass.
- `npm run test:unit`: 57 suites, 3171 tests, all pass. The 3 new suites contribute 16 tests.
- `npm run test:integration`: 15 suites, 323 tests, all pass. The new suite contributes 4 tests.
- `npx jest test/e2e/bonita.connector.test.ts` (chromium): 2 tests pass. Snapshots written on the first run, then
  **2 snapshots passed unchanged** after the extraction into the rendering extension point, which proves the refactor
  is behaviour-preserving down to the pixel.
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
