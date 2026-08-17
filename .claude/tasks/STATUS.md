# Bonita connector extension POC: status

Resume point for the whole POC. Branch `poc/bpmn_extension_bonita_connector`, nothing reported to `master`.
Last updated 2026-08-17.

## Goal

Display an icon on the top right of a task when it holds one or more Bonita connectors, implemented as a BPMN
extension. The implementation will eventually live in a **separate library**, so every choice must stay extractable.
The POC also feeds the rework of `docs/contributors/adr/001-bpmn-extensions-management.md`.

Overall progression, as recorded in the ADR:

| Step | Content | State |
|---|---|---|
| 1 | Extract BPMN in Color behind internal extension points | done before this branch, PR #3519, commit `fee41ab8` on `master` |
| 2 | Validate the mechanism with the Bonita connector (this POC, "phase 1") | **done and committed** |
| 3 | Inject the extensions through configuration (this POC, "phase 2") | **explored, not planned, not implemented** |
| 4 | Public mechanism for extensions living outside the library ("phase 3") | not started |

Careful with the vocabulary: the user's "phase 1/2/3" map to the ADR's steps 2/3/4.

## Where we are

**Phase 1 is complete, committed, all checks green** (build, lint-check, 3174 unit tests, 323 integration tests,
2 e2e snapshots). The full chain works: parse `implementation="BonitaConnector"` on service tasks, expose
`bonita.hasConnector` on the internal model then on the cell style, and paint the Bonita Studio connector icon on the
top right of the tasks.

**The ADR has been reworked and committed** (`ca4c2a816`): reorganized around the progression above, corrections from
the POC folded in, a section on extensions adding new BPMN entities, and an `Open questions` table `Q1`..`Q9`.

**Phase 2 is explored only.** `.claude/tasks/02-inject-extensions-by-configuration/explore.md` holds the 3 creation
chains, the public API gap analysis, and 6 open points awaiting a decision. **Nothing was implemented for phase 2.**

## What phase 2 needs before planning

The 6 open points are listed at the end of the phase 2 `explore.md`. The 2 that shape everything:

1. Public option shape: a single `bpmnExtensions` list at the root of `GlobalOptions`, split internally into per-phase
   lists? Recommended, and the splitting is the "generic handling" the phase must prove.
2. Does BPMN in Color stay built-in and always registered, with `ignoreBpmnColors` untouched, while only the Bonita
   connector becomes configurable? That keeps the existing suite green and still proves the generic path.

Then: the `BpmnExtension` property names, how the rendering extensions reach `BpmnCellRenderer` given the mxGraph
constructor constraint, whether the types become public now or in phase 3, and the `@since` version for any new public
API.

Phase 2 also has to move the BPMN in Color internal model properties (`fillColor`, `strokeColor`, `color`) under a
`bpmnInColor` root property, mirroring `bonita`. That change is to be reported to `master` if satisfying.

## What exists in the code

Extension points, in `src/component/extension/extension-points.ts`:

| Interface | Hook | Called by |
|---|---|---|
| `ParsingExtensionPoint` | `onFlowNodeConverted` (semantic) | `ProcessConverter` |
| `ParsingExtensionPoint` | `onShapeDeserialized`, `onEdgeDeserialized`, `hasLabelExtensionData` (diagram interchange) | `DiagramConverter` |
| `StyleExtensionPoint` | `enrichShapeStyle`, `enrichEdgeStyle`, `enrichMessageFlowIconStyle` | `StyleComputer` |
| `RenderingExtensionPoint` | `onShapeCreated` | `BpmnCellRenderer.createShape` |
| `IconPainterExtensionPoint` | record of method name to implementation | injected in `GraphConfigurator.resolveIconPainter` |

The extension itself, in `src/component/extension/bonita-connector/`: `types.ts` (all the augmentations),
`identifiers.ts` (style key and the `BonitaConnector` literal), `parsing-extension.ts`, `style-extension.ts`,
`rendering-extension.ts`, `icon-painter-extension.ts`.

Core files changed by phase 1: `model/bpmn/internal/types.ts` (new `ShapeBpmnElementExtensions` plus 2 TODOs on the
internal model diagram), `model/bpmn/internal/shape/ShapeBpmnElement.ts`, `extension/extension-points.ts`,
`parser/json/converter/ProcessConverter.ts`, `mxgraph/renderer/StyleComputer.ts`, `mxgraph/BpmnCellRenderer.ts`,
`mxgraph/GraphConfigurator.ts`, `mxgraph/shape/render/BpmnCanvas.ts` (new top-right origin),
`mxgraph/shape/render/icon-painter.ts` (`newBpmnCanvas` made public). `mxgraph/shape/activity-shapes.ts` was
deliberately **never** touched.

Tests: 4 unit files under `test/unit/component/extension/bonita-connector/`, a self-contained
`test/integration/bonita.connector.extension.test.ts`, `test/e2e/bonita.connector.test.ts` with 2 snapshots, and
fixtures in `test/fixtures/bpmn/xml-parsing/bonita-connector/` (parsing) and `test/fixtures/bpmn/bonita-connector/`
(e2e).

## Hard-won facts, do not rediscover

- Bonita exports connector data **only on service tasks**, from 7.12 to 11.1. Tasks named "with connector" that are
  user or script tasks legitimately carry no markup. The `xmlns:bonitaConnector` namespace is declared on every export
  even without connector, so it is not a usable signal.
- `tImplementation` is a **closed enum** (`##unspecified`, `##WebService`), so comparing `implementation` to
  `BonitaConnector` needs a widening to `string`. An interface augmentation cannot widen an existing property.
- Inside a `declare module` block the scope is the **augmented module**: types declared there need no import, and
  importing them at the top of the augmenting file fails the build with `TS6133`.
- `mxCellRenderer.createShape` returns a shape whose `style` is **not assigned yet** (mxGraph does it later in
  `configureShape`), so a rendering extension must read `state.style`.
- `BpmnGraph.createCellRenderer` is called from the mxGraph super constructor, hence the module-level
  `pendingIconPainter`. Same constraint applies to anything else `BpmnCellRenderer` needs.
- `IconPainter.newBpmnCanvas` had to become public: an injected method is not declared in the class body, so TypeScript
  denies it access to protected members even with `this` typed as `IconPainter`.
- `getBpmnDiagramNames` turns **every** `.bpmn` of an e2e diagram directory into a snapshot case, so parsing fixtures
  must live outside those directories.
- Unit tests default to the **node** environment; a test touching mxGraph needs the `@jest-environment jsdom` docblock.

## Documents

| Path | Content |
|---|---|
| `docs/contributors/adr/001-bpmn-extensions-management.md` | the ADR, reworked and committed |
| `.claude/tasks/01-poc-bonita-connector-extension/explore.md` | phase 1 exploration, resolved design points |
| `.claude/tasks/01-poc-bonita-connector-extension/plan.md` | phase 1 plan, and the 7 ADR deviations it found |
| `.claude/tasks/01-poc-bonita-connector-extension/implementation.md` | what was built, deviations, test results |
| `.claude/tasks/02-inject-extensions-by-configuration/explore.md` | phase 2 exploration and open points |
