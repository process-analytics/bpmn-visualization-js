# Implementation Plan: POC Bonita connector extension, phase 1

## Overview

Three ordered, independently verifiable steps. Each ends with a green build and green test run, so the POC can be
stopped or reviewed after any of them.

- **Step 1** (parsing plus style): the `bonita.hasConnector` style key appears on the computed style of service
  tasks that carry `implementation="BonitaConnector"`. Nothing is rendered yet. Verified by unit and integration tests.
- **Step 2** (rendering, placeholder): a green rectangle is painted on the top-right of any task whose style has
  the key. Verified visually and by e2e snapshots.
- **Step 3** (real icon): the green rectangle is replaced by the script task icon glyph. Only the extension's paint
  function changes; e2e snapshots are updated.

Everything Bonita-specific lives under `src/component/extension/bonita-connector/`. Core files are touched only
where the mechanism genuinely requires it, and every such touch is listed in "ADR deviations" so the later ADR
rewrite has the complete list. Registration stays hardcoded in the properties holding the extension lists: making
it configurable is phase 2.

Reference implementation to mirror throughout: `src/component/extension/bpmn-in-color/`.

## Dependencies

Order is strict inside each step. Step 2 depends on step 1 producing the style key. Step 3 depends on step 2's
positioning helper and paint function.

No new npm dependency. No public API addition (everything touched is `@internal` or `@experimental`), so no
`@since` tag is needed. Confirm the target version with the user before adding one anywhere.

---

# Step 1: parsing to internal model, and style computing

## Core changes

### `src/model/bpmn/internal/types.ts`
- Add a new exported empty interface `ShapeBpmnElementExtensions`, for extension properties computed from the
  BPMN **semantic** model (as opposed to `ShapeExtensions`, computed from the diagram interchange model).
- Follow the three existing declarations exactly: `@internal` JSDoc, and the
  `eslint-disable-next-line @typescript-eslint/no-empty-object-type` comment with the same trailing explanation.
- Document in the JSDoc why a second carrier exists, so the distinction is not mistaken for duplication.

### `src/model/bpmn/internal/shape/ShapeBpmnElement.ts`
- On the base `ShapeBpmnElement` class only (not the subclasses, they inherit), add a
  `readonly extensions: ShapeBpmnElementExtensions = {}` instance field, placed before the constructor.
- Mirror `Shape.ts:26` for placement, modifier and initializer.
- Add the type-only import from `../types`.
- Consider: all other properties of this class are constructor parameter properties. This field is deliberately not
  one, because it is populated after construction by the parsing extensions, exactly like `Shape.extensions`.

### `src/component/extension/extension-points.ts`
- Add an optional `onFlowNodeConverted` method to `ParsingExtensionPoint`, receiving the built `ShapeBpmnElement`
  and the raw semantic `TFlowNode` it was built from.
- Place it before the existing DI-oriented hooks and add a short comment separating semantic-phase hooks from
  diagram-interchange-phase hooks, since the interface now spans both.
- JSDoc in the style of the existing hooks: one line of description plus `@param` for both parameters. State
  explicitly that it is called during semantic parsing, before any `Shape` exists.
- Add the two type-only imports (`ShapeBpmnElement`, `TFlowNode`).

### `src/component/extension/bonita-connector/types.ts` (new)
- Start with the `export {}` marker and reproduce the explanatory comment from `bpmn-in-color/types.ts:17-23`
  (TS2436 plus `verbatimModuleSyntax`), since the same constraint applies.
- Augment `../../../model/bpmn/internal/types` with `ShapeBpmnElementExtensions`, adding an optional `bonita`
  sub-object holding an optional `hasConnector` boolean. Use relative module paths, as BPMN in Color does.
- Do **not** augment the JSON model: `TServiceTask.implementation` and `operationRef` already exist
  (`src/model/bpmn/json/baseElement/flowNode/activity/task.ts:43`). Add a comment recording that, so a future
  reader does not look for a missing augmentation.

### `src/component/extension/bonita-connector/identifiers.ts` (new)
- Export the style key constant for `bonita.hasConnector`. It must live in its own small file because both the
  style extension and `BpmnCellRenderer` import it, and the renderer must not pull in the whole extension.
- Do not add the key to `BpmnStyleIdentifier` (`src/component/mxgraph/style/identifiers.ts:25`): that object is
  public `@experimental` API and must stay free of vendor-specific keys.
- Export the `'BonitaConnector'` implementation-attribute literal from here too, so the parsing rule is named
  rather than inlined.

### `src/component/extension/bonita-connector/parsing-extension.ts` (new)
- Export a `bonitaConnectorParsingExtension` const typed as `ParsingExtensionPoint`, implementing only
  `onFlowNodeConverted`. Plain module-level helper functions plus one exported const object, no class, no state,
  as in `bpmn-in-color/parsing-extension.ts`.
- Add `import './types'` so the augmentation is pulled in, as BPMN in Color does at line 22.
- Logic: return early unless the element kind is `ShapeBpmnElementKind.TASK_SERVICE`; then narrow the raw element
  to `TServiceTask` and compare its `implementation` against the constant.
- **Typing obstacle**: `tImplementation` is an enum with only `##unspecified` and `##WebService`
  (`globalTask.ts:46`), so a direct comparison to `'BonitaConnector'` does not type-check. Widen the read value to
  `string` for the comparison and leave a short comment explaining why the cast exists, referencing the enum.
- Only assign the `bonita` sub-object when a connector is detected. Never create an empty sub-object, so
  `extensions.bonita?.hasConnector` stays a reliable falsy check, consistent with how BPMN in Color only sets
  properties when the source value is present.
- Consider: `operationRef` and the `bonitaConnector:` namespace are deliberately **not** used as signals. The
  namespace is declared on every Bonita export even without connectors.

### `src/component/extension/bonita-connector/style-extension.ts` (new)
- Export a `bonitaConnectorStyleExtension` const typed as `StyleExtensionPoint`, implementing only
  `enrichShapeStyle`, following `bpmn-in-color/style-extension.ts`.
- Read `shape.bpmnElement.extensions.bonita?.hasConnector` and, when true, set the style key from
  `identifiers.ts` to the string `'true'`.
- The value must be a string, not a boolean: mxGraph style values round-trip as strings and the shape reads them
  back with `mxUtils.getValue`, as `activity-shapes.ts:65` does for markers.
- Do not set the key at all when there is no connector, to keep computed styles unchanged for every other diagram.

### `src/component/parser/json/converter/ProcessConverter.ts`
- Add a private readonly array property holding the parsing extensions, initialized with
  `bonitaConnectorParsingExtension` only. Mirror `DiagramConverter.ts:48` for naming and placement.
- In `buildFlowNodeBpmnElements` (`:190-211`), inside the existing `if (shapeBpmnElement)` block, iterate the
  extensions and call `onFlowNodeConverted` with the built element and the raw `bpmnElement`. Place the call next
  to `registerFlowNode`, using the same `for (const extension of ...) extension.hook?.(...)` form as
  `DiagramConverter.ts:133`.
- Consider: the loop variable `bpmnElement` is the raw `TFlowNode` for the current iteration, so no extra lookup
  is needed. Do not hook `buildFlowNodeBpmnElement` instead: it has several early returns and would need the call
  duplicated per branch.

### `src/component/mxgraph/renderer/StyleComputer.ts`
- Restructure the `styleExtensions` initialization at `:51`. Today it evaluates to an empty array whenever colors
  are ignored, which is the default. The connector style extension must always be registered.
- Build the list as an always-on base containing `bonitaConnectorStyleExtension`, to which
  `bpmnInColorStyleExtension` is appended only when `ignoreBpmnColors` is falsy. Keep the existing
  `options?.ignoreBpmnColors ?? true` default semantics untouched.
- Consider: this is the one place where "always active" is expressed for the POC. Phase 2 replaces it with
  injected configuration, so keep it to a single readable expression rather than spreading conditionals.

## Tests for step 1

### `test/unit/component/extension/bonita-connector/parsing-extension.test.ts` (new)
- Follow the structure of `test/unit/component/extension/bpmn-in-color/parsing-extension.test.ts`: `@lib/...`
  imports, small local factory helpers, one `describe` per hook.
- Cases: service task with `implementation="BonitaConnector"` sets `hasConnector`; service task with a different
  `implementation` value does not; service task without the attribute does not; a non-service-task kind with the
  attribute does not (guards the kind gate); the `bonita` sub-object is absent, not empty, when no connector.

### `test/unit/component/extension/bonita-connector/style-extension.test.ts` (new)
- Follow `bpmn-in-color/style-extension.test.ts`, including its local `newShape` helper pattern.
- Cases: `hasConnector` true sets the style key to the string `'true'`; `hasConnector` false or absent leaves the
  map untouched (assert with `has(...)` returning false, as the colors test does for the swimlane key); no other
  style entry is added.

### `test/integration/bonita.connector.extension.test.ts` (new)
- **Self-contained on purpose**: no import from `test/integration/helpers/`, no custom matcher such as
  `toBeShape`. This test is the rehearsal for the extracted library, which will not have that infrastructure.
- Instantiate `BpmnVisualization` locally against a container, load the fixture, then for each asserted id get the
  cell from the mxGraph model and read the resolved style through the view state, following the decision recorded
  in `explore.md` ("Decisions taken", item 8).
- Assert only on the presence and value of the `bonita.hasConnector` style entry. Assert nothing about geometry,
  labels, or any other style property.
- Cases: the service task with a connector has the key set to `'true'`; a service task without a connector and a
  non-service task do not have the key at all.
- Add one case loading `test/fixtures/bpmn/xml-parsing/bonita-community-2021.1-A.2.0.export.bpmn` and asserting no
  cell carries the key. It is a real Bonita 7.12.1 export that declares the `bonitaConnector` namespace with no
  connector anywhere, so it guards against detecting on the namespace.
- Reading a file: use `readFileSync` from `@test/shared/file-helper`, as the colors integration test does. It is
  shared test tooling rather than library-specific test infrastructure, so it does not conflict with the
  self-containment constraint. If it turns out to pull in more than expected, inline a small local read instead.

### `test/fixtures/bpmn/xml-parsing/bonita-connector/` (new fixture directory)
- Add one small focused diagram for the integration and unit level: a single pool with a service task carrying
  `implementation="BonitaConnector"`, a service task without it, and one user task. Keep only what the assertions
  need: no data associations, no ioSpecification, no `itemDefinition`, no documentation.
- Place it under `xml-parsing/` and not under a top-level directory, mirroring
  `test/fixtures/bpmn/xml-parsing/bpmn-in-color/`. Critical: `getBpmnDiagramNames` turns **every** `.bpmn` in an
  e2e diagram directory into an e2e snapshot case, so parsing fixtures must stay outside those directories.
- Keep the two existing Bonita exports in `test/fixtures/bpmn/_extension_bonita_connector/` untouched, as
  reference material. They are too large and too messily named to drive tests.

## Verification of step 1
- `npm run build` (type check, catches the enum/cast issue and the augmentation wiring).
- `npx jest test/unit/component/extension/bonita-connector --config=./test/unit/jest.config.cjs`.
- `npx jest test/integration/bonita.connector.extension.test.ts --config=./test/integration/jest.config.cjs`.
- Full `npm run test:unit` and `npm run test:integration`: no existing test may change. In particular
  `StyleComputer.test.ts` and `mxGraph.model.bpmn.elements.test.ts` must stay green, which proves the new style
  key never appears on non-connector diagrams.

---

# Step 2: render a green rectangle on the top-right

## Core changes

### `src/component/mxgraph/shape/render/BpmnCanvas.ts`
- Add a public `setIconOriginToShapeTopRightProportionally(shapeDimensionProportion: number)` method immediately
  after `setIconOriginToShapeTopLeftProportionally` (`:120`), with the same signature, the same JSDoc shape and
  the same `@internal` tag.
- Vertical origin: identical to the top-left variant.
- Horizontal origin: shape right edge, minus the proportional margin, minus the **scaled icon width**. The scaled
  width term is what the top-left variant does not need; take the expression from
  `setIconOriginForIconCentered` (`:140`), which already multiplies `iconOriginalSize.width` by `scaleX`.
- Mutualization: factor the shared proportional-margin computation only if it stays readable. Two symmetrical
  three-line methods are acceptable and match the existing style of this class; do not force an abstraction that
  obscures the geometry.
- Consider: both the margin and the icon size are derived from the shape dimensions, which is what makes the icon
  follow the task size. Do not introduce any constant pixel offset here.

### `src/component/mxgraph/shape/render/icon-painter.ts`
- Extract the body of the `protected newBpmnCanvas` method (`:104-116`) into an exported module-level function
  taking the same two arguments, and make the method delegate to it.
- Rationale: the standalone connector paint function cannot call a protected method, and duplicating the
  `PaintParameter` to `BpmnCanvas` mapping is the kind of duplication the project forbids. Phase 3 needs this
  exported anyway for out-of-library extensions.
- Keep the method in place so no existing caller changes.

### `src/component/extension/bonita-connector/icon.ts` (new)
- Export a `paintBonitaConnectorIcon(paintParameter: PaintParameter)` function. Standalone, not a method, and not
  injected into `IconPainter`: the painter is stateless, so there is nothing to extend.
- Build a `BpmnCanvas` from the paint parameter using the newly exported helper, with a top-right origin function
  and a `ratioFromParent` chosen to match the visual weight of the existing task icons (they use `0.25` by
  default, and `20` as the proportional margin divisor).
- For this step, paint a filled green rectangle sized from the canvas's icon coordinate space, so it scales like a
  real icon. Add a comment marking it as a placeholder replaced in step 3.
- Consider: pass a copy of `iconStyleConfig` rather than mutating the caller's object, since the icon needs its own
  fill color.

### `src/component/mxgraph/BpmnCellRenderer.ts`
- In `createShape` (`:89`), after the existing `overrideCreateSvgCanvas(shape)` call, wrap the shape instance's
  `paintForeground` when the shape is a task shape.
- Task detection: use the `'paintTaskIcon' in shape` runtime check. `BaseTaskShape` is not exported so `instanceof`
  is unavailable, and this idiom matches the neighbouring `'iconPainter' in shape` check. It correctly excludes
  `SubProcessShape` and `CallActivityShape`.
- The wrapper must call the original implementation first, then read the `bonita.hasConnector` style entry from
  the shape style **at paint time** and, when it is the string `'true'`, call `paintBonitaConnectorIcon` with a
  paint parameter built by `buildPaintParameter`.
- Read the style inside the wrapper, never at `createShape` time: `mxCellRenderer` reuses shape instances across
  redraws and the style API can mutate a cell style at runtime, so a decision cached at creation would go stale.
- Bracket the call with canvas `save()` and `restore()`, as `paintMarkerIcons` does (`activity-shapes.ts:73-79`),
  so icon colors cannot leak into later painting.
- Import `buildPaintParameter` from `./shape/render/icon-painter` directly: the `./shape/render` barrel does not
  re-export it.
- **Do not modify `src/component/mxgraph/shape/activity-shapes.ts`.** Shape classes stay untouched, because the
  extracted extension will never be able to edit or subclass them.
- Consider: bind or otherwise capture the original method before replacing it, so the original still executes with
  the shape as its receiver.

## Tests for step 2

### `test/fixtures/bpmn/bonita-connector/` (new e2e diagram directory)
- `connector.01.tasks.bpmn`: one pool, a service task with a connector, a service task without one, and a user
  task. Default task dimensions. No labels beyond short names, to keep snapshot diffs driven by the icon rather
  than by font rendering.
- `connector.02.large.task.bpmn`: the same service task with a connector, but with a markedly larger
  `BPMNShape` bounds, to verify the icon scales with the task exactly like the built-in task icon does.
- Keep both diagrams minimal: every extra element widens the snapshot surface and the threshold noise.
- Naming: use the `<feature>.<nn>.<variant>` convention of the existing e2e fixtures, since the file name becomes
  the snapshot key through `getBpmnDiagramNames`.

### `test/e2e/bonita.connector.test.ts` (new)
- Follow `test/e2e/bpmn.colors.test.ts`: a `MultiBrowserImageSnapshotThresholds` subclass, a `PageTester` on
  `AvailableTestPages.BPMN_RENDERING` with the new diagram subfolder, `getBpmnDiagramNames` driving `it.each`, and
  `toMatchImageSnapshot` with the configurator's config.
- Do **not** add any per-snapshot threshold entry. Per the class JSDoc, thresholds are added only once a test
  actually fails on CI. Start from browser-family defaults.
- These are new snapshots, which the definition of done allows. Report explicitly if any **existing** snapshot
  changes: that would mean the decoration affects tasks without connectors, which is a defect, not noise.

### Manual verification
- `npm run dev`, load one of the new fixtures, and check the rectangle sits inside the top-right corner, does not
  overlap the task's own top-left icon, and grows with the shape when zooming and on the large-task diagram.

## Verification of step 2
- `npm run build`, then `npm run test:unit` and `npm run test:integration` still green and unchanged.
- `npm run test:e2e` for the new file: new snapshots are generated. Inspect them, and confirm that the task
  without a connector has no rectangle.
- Confirm `git status` shows no modification to existing files under `test/e2e/__image_snapshots__/`.

---

# Step 3: replace the placeholder with the real icon

## Core changes

### `src/component/extension/bonita-connector/icon.ts`
- Replace the green rectangle with the script task glyph, keeping the function signature, the top-right origin and
  the scaling behaviour from step 2 unchanged.
- Reuse `IconPainter.paintScriptIcon` (`icon-painter.ts:693`) rather than copying its path data: hold a
  module-level `IconPainter` instance in the extension. The painter is stateless and publicly exported, so this is
  both duplication-free and reproducible from outside the library.
- Call it with a paint parameter whose `setIconOriginFunct` is the new top-right origin and whose
  `iconStyleConfig` is a **copy**: `paintScriptIcon` assigns `fillColor` from `strokeColor` on the object it
  receives, and must not mutate the shape's own configuration.
- Remove the placeholder comment added in step 2.
- Consider: the script icon's original size is much larger than the shape, so the `ratioFromParent` value chosen in
  step 2 may need adjusting for visual balance. Tune it against the rendered result, not by calculation.

## Tests for step 3
- No new test file. The unit and integration tests assert the style key and are unaffected by the glyph.
- Regenerate the two e2e snapshots from step 2 and inspect them: the icon must sit in the top-right corner and
  scale on the large-task diagram.
- Report the snapshot regeneration explicitly: these are updates to snapshots created in step 2, within this same
  work, and not modifications of pre-existing ones.

## Verification of step 3
- `npm run build`, `npm run test:unit`, `npm run test:integration`, `npm run test:e2e` for the new file.
- `npm run lint-check`.
- Full `npm run all` as the final gate.

---

# ADR deviations to carry into the ADR rewrite

Recorded here only; the rewrite is out of scope. Sources are in `explore.md`.

1. **A semantic parsing hook is missing from the ADR.** `ParsingExtensionPoint` only exposes diagram-interchange
   objects, but connector data lives in the semantic model. `onFlowNodeConverted`, called from `ProcessConverter`,
   is required.
2. **A semantic extensions carrier is missing.** `Shape.extensions` does not exist yet at semantic parsing time, so
   `ShapeBpmnElement` needs its own `extensions` field and a matching `ShapeBpmnElementExtensions` interface. The
   ADR describes only the three DI-oriented extension interfaces.
3. **The rendering extension point belongs in the cell renderer, not in the shapes.** The ADR says it hooks into
   `paintForeground` in `BaseTaskShape`; the workable mechanism decorates the shape instance from
   `BpmnCellRenderer.createShape`, leaving shape classes untouched. That is mandatory once the extension lives
   outside the library.
4. **Icon painter injection is unnecessary.** The ADR's open question about injecting methods into `IconPainter`,
   or composing several painters, dissolves: the painter is stateless, so an extension just calls a standalone
   paint function, and may reuse the exported painter's methods. What the library must expose instead is the
   `PaintParameter` to `BpmnCanvas` mapping (`newBpmnCanvas`), currently `protected`.
5. **Style extension gating is not generic.** `StyleComputer` hardcodes `ignoreBpmnColors` as the only gate, so an
   always-on extension has to be appended by hand. The ADR already lists this as follow-up work; the POC confirms
   it is required as soon as a second extension exists.
6. **Spec-constrained JSON attributes are a blind spot.** `tImplementation` is a closed enum, so an extension
   reading a vendor value from a standard BPMN attribute cannot do it type-safely through module augmentation. The
   ADR's "augment the JSON model" guidance covers added attributes but not constrained existing ones.
