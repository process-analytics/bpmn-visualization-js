# Implementation Plan: POC Bonita connector extension, phase 1

## Overview

Three ordered, independently verifiable steps. Each ends with a green build and test run, so the POC can be
stopped or reviewed after any of them.

- **Step 1** (end-to-end feature with an existing icon): parse the connector information, expose it as the
  `bonita.hasConnector` style key, and have the cell renderer paint the **existing script task icon** on the
  top-right of tasks that carry it. This is a complete, visible feature, covered by unit, integration and visual
  tests.
- **Step 2** (icon painter injection mechanism): introduce the extension point that injects a **new method** into
  the `IconPainter` at library initialization, declared through TypeScript declaration merging. The injected method
  paints a **green rectangle**, and the cell renderer calls it instead of `paintScriptIcon`. Seeing green is the
  proof that the injection works rather than the built-in painting path.
- **Step 3** (definitive icon): replace the green rectangle inside the injected method with the definitive
  connector glyph.

Everything Bonita-specific lives under `src/component/extension/bonita-connector/`. Core files are touched only
where the mechanism genuinely requires it, and every such touch is listed in "ADR deviations" so the later ADR
rewrite has the complete list. Registration stays hardcoded in the properties holding the extension lists: making
it configurable is phase 2.

Reference implementation to mirror throughout: `src/component/extension/bpmn-in-color/`.

## Dependencies

Order is strict inside each step. Step 2 depends on step 1's style key, cell renderer decoration and top-right
positioning helper. Step 3 depends on step 2's injected method.

No new npm dependency. No public API addition (everything touched is `@internal` or `@experimental`), so no
`@since` tag is needed. Confirm the target version with the user before adding one anywhere.

---

# Step 1: parsing, style, and rendering with the existing script task icon

## Core changes

### `src/model/bpmn/internal/types.ts`
- Add a new exported empty interface `ShapeBpmnElementExtensions`, for extension properties computed from the
  BPMN **semantic** model (as opposed to `ShapeExtensions`, computed from the diagram interchange model).
- Follow the three existing declarations exactly: `@internal` JSDoc, and the
  `eslint-disable-next-line @typescript-eslint/no-empty-object-type` comment with the same trailing explanation.
- Document in the JSDoc why a second carrier exists, so the distinction is not mistaken for duplication.
- Add a `TODO` comment: the internal model diagram
  (`docs/users/architecture/images/architecture/internal-model.drawio`, and its generated `.svg`) must be updated
  to show the new `ShapeBpmnElement.extensions: ShapeBpmnElementExtensions` property.
- Add a second `TODO` comment: that same diagram never declares the extension types themselves. `ShapeExtensions`,
  `EdgeExtensions` and `LabelExtensions` appear only as the declared type of an `extensions` property on `Shape`,
  `Edge` and `Label`, with no box of their own. `ShapeExtensions` in particular should be added.
- Consider: both TODOs are documentation debt, not blockers. Keep them as comments here rather than editing the
  diagram in this POC, since the ADR rewrite will very likely change these types again.

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

### `src/component/mxgraph/BpmnCellRenderer.ts`
- In `createShape` (`:89`), after the existing `overrideCreateSvgCanvas(shape)` call, wrap the shape instance's
  `paintForeground` when the shape is a task shape.
- Task detection: use the `'paintTaskIcon' in shape` runtime check. `BaseTaskShape` is not exported so `instanceof`
  is unavailable, and this idiom matches the neighbouring `'iconPainter' in shape` check. It correctly excludes
  `SubProcessShape` and `CallActivityShape`.
- The wrapper must call the original implementation first, then read the `bonita.hasConnector` style entry from
  the shape style **at paint time** and, when it is the string `'true'`, paint the connector icon.
- For this step, paint by calling `paintScriptIcon` on the renderer's own `this.iconPainter` instance, passing a
  paint parameter built by `buildPaintParameter` and overridden with a `setIconOriginFunct` that calls the new
  `setIconOriginToShapeTopRightProportionally`. Follow the call style of `ScriptTaskShape.paintTaskIcon`
  (`activity-shapes.ts:189-201`) for the parameter overrides, including its `ratioFromParent` value.
- `paintScriptIcon` assigns `fillColor` from `strokeColor` on the `iconStyleConfig` object it receives, so pass a
  **copy** of `iconStyleConfig` rather than the shape's own.
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
- Consider: the connector-specific parts of this wrapper (the style key and the icon call) are what step 2 turns
  into a generic extension point. Keep them grouped in a single small private method so step 2 is a local change.

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
- Add one small focused diagram for the integration level: a single pool with a service task carrying
  `implementation="BonitaConnector"`, a service task without it, and one user task. Keep only what the assertions
  need: no data associations, no ioSpecification, no `itemDefinition`, no documentation.
- Place it under `xml-parsing/` and not under a top-level directory, mirroring
  `test/fixtures/bpmn/xml-parsing/bpmn-in-color/`. Critical: `getBpmnDiagramNames` turns **every** `.bpmn` in an
  e2e diagram directory into an e2e snapshot case, so parsing fixtures must stay outside those directories.
- Keep the two existing Bonita exports in `test/fixtures/bpmn/_extension_bonita_connector/` untouched, as
  reference material. They are too large and too messily named to drive tests.

### `test/fixtures/bpmn/bonita-connector/` (new e2e diagram directory)
- `connector.01.tasks.bpmn`: one pool, a service task with a connector, a service task without one, and a user
  task. Default task dimensions. No labels beyond short names, to keep snapshot diffs driven by the icon rather
  than by font rendering.
- `connector.02.large.task.bpmn`: the same service task with a connector, but with markedly larger `BPMNShape`
  bounds, to verify the icon scales with the task exactly like the built-in task icon does.
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
- `npm run dev`, load the new fixtures, and check the script icon sits inside the top-right corner, does not
  overlap the task's own top-left icon, and grows with the shape when zooming and on the large-task diagram.
- On `connector.01.tasks.bpmn`, confirm the service task without a connector and the user task show no extra icon.

## Verification of step 1
- `npm run build` (type check, catches the enum/cast issue and the augmentation wiring).
- `npx jest test/unit/component/extension/bonita-connector --config=./test/unit/jest.config.cjs`.
- `npx jest test/integration/bonita.connector.extension.test.ts --config=./test/integration/jest.config.cjs`.
- Full `npm run test:unit` and `npm run test:integration`: no existing test may change. In particular
  `StyleComputer.test.ts` and `mxGraph.model.bpmn.elements.test.ts` must stay green, which proves the new style
  key never appears on non-connector diagrams.
- `npm run test:e2e` for the new file only, then confirm `git status` shows no modification to existing files
  under `test/e2e/__image_snapshots__/`.

---

# Step 2: inject a new icon painter method through a new extension point

Goal: stop calling a built-in painter method and start calling a method **provided by the extension and injected
into the `IconPainter` at library initialization**, declared to TypeScript through declaration merging. The glyph
is a green rectangle, so the visual result proves the injected method is the one being executed.

## Core changes

### `src/component/mxgraph/shape/render/icon-painter.ts`
- Change `newBpmnCanvas` (`:104`) from `protected` to `public`, keeping it `@internal`.
- Rationale: an injected method is not declared inside the class body, so TypeScript forbids it from touching a
  protected member even when `this` is typed as `IconPainter`. Making it public is the minimal change and is what
  phase 3 needs anyway for out-of-library extensions. Do **not** extract it into a module-level function: that
  would create a second way of doing the same thing.
- Add a JSDoc line stating it is the entry point for icon painter methods contributed by extensions.

### `src/component/extension/extension-points.ts`
- Add a new extension point for icon painter contributions: a type describing a set of methods to be injected into
  the `IconPainter`, keyed by method name, each value being the implementation. Type the implementations so that
  `this` is the `IconPainter`, which is what gives access to `newBpmnCanvas`.
- Document that the extension is responsible for declaring the same method names on `IconPainter` through
  declaration merging, otherwise callers cannot see them.
- Keep the naming consistent with the existing `ParsingExtensionPoint` / `StyleExtensionPoint` pair.
- Consider: a name-keyed record is what ADR 001 already proposed as an option, and it avoids the multiple-painters
  conflict the ADR flags as an open question, since extensions contribute methods rather than whole painters.

### `src/component/extension/bonita-connector/icon-painter-extension.ts` (new)
- Export the icon painter extension object for the connector: one entry, the connector icon painting method.
- Implement it as a function typed to receive a `PaintParameter`, using `this.newBpmnCanvas` to obtain a
  `BpmnCanvas`, then painting a filled **green rectangle** in the icon coordinate space so that it scales like any
  other icon. Mark the green rectangle as a placeholder replaced in step 3.
- Set the top-right origin through the paint parameter's `setIconOriginFunct`, reusing the helper added in step 1.
- Add the declaration merging that makes the method visible on `IconPainter`: augment the icon painter module,
  declaring an `interface IconPainter` with the new method. Interface-to-class merging is what makes this legal.
  Put it in this file or in `types.ts`, next to the model augmentations, whichever keeps the augmentations
  discoverable; state the choice in a comment.
- Consider: this file is the concrete answer to the ADR's open question about icon painters. Keep it small and
  self-explanatory, it will be quoted in the ADR rewrite.

### `src/component/mxgraph/GraphConfigurator.ts`
- In `createNewBpmnGraph` (`:28`), after resolving the icon painter (`rendererOptions?.iconPainter ?? new IconPainter()`),
  apply the icon painter extensions to the resolved instance before passing it to `BpmnGraph`.
- Keep the list of icon painter extensions hardcoded here for the POC, holding only the connector one, consistent
  with how the parsing and style extension lists are hardcoded.
- The injection must work on a user-supplied painter as well as on the default one, since the option allows a
  custom painter. Apply it to whatever instance was resolved, never to the class prototype: mutating the prototype
  would leak across `BpmnVisualization` instances.
- Consider: this is the "factory" location ADR 001 identified for icon painter registration. Add a comment
  pointing at that, since phase 2 will replace the hardcoded list with configuration.

### `src/component/mxgraph/BpmnCellRenderer.ts`
- Replace the `paintScriptIcon` call from step 1 with a call to the injected connector method on
  `this.iconPainter`. Everything else in the wrapper (task detection, paint-time style read, save/restore
  bracketing, paint parameter construction) stays unchanged.
- Consider: the call is now to a method the core does not implement. Guard against the method being absent so a
  library build without the extension cannot throw at paint time; this also previews the phase 2 behaviour where
  the extension is optional.

## Tests for step 2

### `test/unit/component/extension/bonita-connector/icon-painter-extension.test.ts` (new)
- Assert the shape of the contribution: the expected method name is present and is a function.
- Assert that applying the extension to a fresh `IconPainter` instance makes the method callable on that instance,
  and that a second, untouched instance does not have it. That second assertion is what guards against prototype
  pollution.
- Do not attempt to assert the drawn output here: the canvas painting is covered visually by the e2e snapshots.

### e2e
- Regenerate the two snapshots from step 1. They must now show a green rectangle instead of the script icon.
- That change is the acceptance criterion for this step: if the snapshots do not change, the injected method is not
  being called and the mechanism does not work.
- Alternative if snapshot churn across steps is unwanted: verify the green rectangle manually on the dev page and
  regenerate the snapshots only in step 3. Prefer regenerating, since the diff is the proof.

## Verification of step 2
- `npm run build`: this also proves the declaration merging works, since the cell renderer calls a method that
  exists only through the augmentation.
- `npm run test:unit`, `npm run test:integration`: unchanged and green. The style key and parsing are untouched by
  this step, which is the point of having split it out.
- `npm run test:e2e` for the connector file: snapshots updated to the green rectangle after visual inspection.

---

# Step 3: replace the placeholder with the definitive icon

## Core changes

### `src/component/extension/bonita-connector/icon-painter-extension.ts`
- Replace the green rectangle with the definitive connector glyph, keeping the method name, the top-right origin
  and the scaling behaviour from step 2 unchanged.
- Starting point: the script task glyph (`icon-painter.ts:693`). Either delegate to `this.paintScriptIcon` with the
  top-right origin, now trivially possible since the method runs with the painter as `this`, or draw the definitive
  path. Delegating keeps the POC free of duplicated path data; drawing is only justified once the definitive glyph
  actually differs from the script icon.
- If delegating, pass a **copy** of `iconStyleConfig`: `paintScriptIcon` assigns `fillColor` from `strokeColor` on
  the object it receives.
- Remove the placeholder comment added in step 2.
- Consider: the script icon's original size is much larger than the shape, so the `ratioFromParent` value may need
  adjusting for visual balance. Tune it against the rendered result, not by calculation.

## Tests for step 3
- No new test file. The unit and integration tests assert the style key and the contribution shape, and are
  unaffected by the glyph.
- Regenerate the two e2e snapshots and inspect them: the icon must sit in the top-right corner and scale on the
  large-task diagram.
- Report the snapshot regeneration explicitly: these are updates to snapshots created earlier in this same work,
  not modifications of pre-existing ones.

## Verification of step 3
- `npm run build`, `npm run test:unit`, `npm run test:integration`, `npm run test:e2e` for the connector file.
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
4. **Icon painter injection is confirmed as the right mechanism, and its open questions are answered.** Extensions
   contribute **methods**, injected into the resolved painter instance at library initialization in
   `createNewBpmnGraph`, and declared through interface-to-class declaration merging. Contributing methods rather
   than whole painters removes the ADR's "two competing painters" problem. The library must additionally expose
   `IconPainter.newBpmnCanvas`, currently `protected`, since it is what an injected method needs.
5. **Style extension gating is not generic.** `StyleComputer` hardcodes `ignoreBpmnColors` as the only gate, so an
   always-on extension has to be appended by hand. The ADR already lists this as follow-up work; the POC confirms
   it is required as soon as a second extension exists.
6. **Spec-constrained JSON attributes are a blind spot.** `tImplementation` is a closed enum, so an extension
   reading a vendor value from a standard BPMN attribute cannot do it type-safely through module augmentation. The
   ADR's "augment the JSON model" guidance covers added attributes but not constrained existing ones.
7. **Internal model documentation debt.** The internal model diagram does not declare the extension types at all
   (`ShapeExtensions`, `EdgeExtensions`, `LabelExtensions` appear only as property types), and will need the new
   semantic carrier added. Tracked as TODOs in `src/model/bpmn/internal/types.ts`.
