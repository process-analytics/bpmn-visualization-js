# Decisions: migration to maxGraph 0.25.x

Starting point: squash of the 0.23.0 POC branch (`poc/claude/bump_maxgraph_0.23.0_bpmn-visu_0.48.0`), then bump to
maxGraph 0.25.1.

## Rules applied

- Every check runs on chromium only.
- No change to e2e snapshots, visual rendering or e2e thresholds: a change means a behavior change.
- No removal of a workaround unless a test proves it is no longer needed (invert the values, the test must fail).
- A TODO whose resolution would break one of these rules stays as is, and the reason is logged here.
- Touchy decisions (public API change, choice between several valid implementations) are taken, logged here, and the
  work continues.

## Checks

The checks mirror the CI workflows:

| Check | Command | CI workflow |
|---|---|---|
| Lint | `npm run lint-check` | `build.yml` |
| Source type check | `npm run build` | `build.yml` |
| Test type check | `npm run test:perf:compile` | `build.yml` |
| Unit tests | `npm run test:unit` | `build.yml` |
| Integration tests | `npm run test:integration` | `build.yml` |
| E2E tests | `BROWSERS=chromium npm run test:e2e` | `test-e2e.yml` |
| Performance tests | `BROWSERS=chromium npm run test:perf` | `test-performance.yml` |
| Bundles | `npm pack` then `BROWSERS=chromium npm run test:bundles` | `test-npm-package.yml` |
| TypeScript consumers | `npm test` in `test/typescript-support` and `test/typescript-moduleResolution-bundler` | `test-npm-package.yml` |

`tsc -p tsconfig.test.json` is not a check: it includes the consumer projects, which resolve the types from the built
package (`dist/`) and need the dedicated `npm install` of the workflow. `test:perf:compile` is the CI type check of the
tests, and it excludes these two projects.

## Decisions

### D1. Bump to maxGraph 0.25.1: impact of the breaking changes

Breaking changes of 0.24.0 and 0.25.0 (0.25.1 has none), from the changelog and the GitHub releases:

| Breaking change | Impact on bpmn-visualization |
|---|---|
| 0.24.0: `EdgeHandler.isHandleVisible` uses `EdgeStyleRegistry.allowsIntermediateHandles` | None: `EdgeStyle.EntityRelation` is not registered |
| 0.24.0: `ImageMixin` converted to `ImageBundlePlugin`, not shipped by `BaseGraph` | None: image bundles are not used |
| 0.25.0: cell handler factory methods moved to `SelectionCellsHandler` | None: no handler override |
| 0.25.0: TypeScript 3.9 minimum | None: `test/typescript-support` uses TypeScript 4.0.2 |
| 0.25.0: style types declared with `interface` (no implicit index signature) | None: all checks pass without change |

The bump needs no code change. All the checks pass on chromium (e2e: 261 tests, 257 snapshots, no threshold change).

`npm run test:perf` rewrites `test/performance/data/linux/data.js` with the measurements of the run. It is reverted
after each run: the measurements of a local POC run are not reference data.

### D2. Remove the `endFill` workaround of the message flow end marker

maxGraph fixed the default of `endFill` in 0.2.0 (https://github.com/maxGraph/maxGraph/pull/157), so forcing
`endFill = true` is no longer needed.

Proof of coverage: with `endFill = false`, the theme test with the yellow background (`bpmn.theme.test.ts`,
`container-background`) still passes, since its chromium threshold (0.98%) absorbs the difference. The full e2e suite
fails on 2 other tests, which is the proof:
- `add.overlay.on.message.flow`: 0.1857% different, threshold 0.18%;
- `fill.color.gradient`: 0.1142% different, threshold 0.11%.

Without the line, every check passes (e2e: 261 tests, 257 snapshots).

### D3. Remove the association `startSize` workaround

maxGraph 0.24.0 stopped growing the bounding box of edges whose start arrow is unset
(https://github.com/maxGraph/maxGraph/commit/b4ebeb4fb0b3a0550b7ce51037f68caee905e420, PR #1094, included in 0.25.1). `startSize` is set back on the
`ASSOCIATION_FLOW` style, as in the mxGraph implementation, instead of only on the `BOTH` direction.

Proof of coverage, in two parts:
- the risk of the change is the bounding box bug: with maxGraph 0.23.0 it shifted the fit scale by about 0.18% and
  broke the e2e snapshots, as recorded by the 0.23.0 POC in the removed TODO. With 0.25.1 every check passes;
- **finding**: no e2e test pins the `startSize` of `Both` associations. Removing it entirely (start marker of 6
  instead of 12) keeps the whole e2e suite passing, because the chromium default threshold of `bpmn.rendering.test.ts`
  (0.16%) absorbs the difference on the single `Both` association of the fixtures. The change keeps the size of this
  marker unchanged, so this gap does not affect it, but a dedicated test would be needed to pin it.

### D4. Rename `extraCssClasses` to `cssClasses`

Public API change on `BpmnCellStyleExtension`, taken without compatibility alias: the type is introduced by the
maxGraph migration (`@since 0.x.y`, experimental) and was never released, so no consumer depends on the old name.

The test helpers carrying the same value (`ExpectedModelElement`, `ComparedBpmnCellStyle`) are renamed as well, to
keep a single name for one concept.

### D5. Flatten the BPMN style properties with the `bv` prefix

The BPMN properties move from the nested `bpmn` object to the top level of the style, each name prefixed with `bv`
(`bpmn.kind` becomes `bvKind`, `bpmn.cssClasses` becomes `bvCssClasses`), as the TODO prescribed, following the
maxGraph recommendation to keep custom properties flat.

Choices:
- `BpmnCellStyleExtension` is kept as the interface listing the `bv` properties, and `BpmnCellStyle` /
  `BpmnCellStateStyle` extend both the maxGraph type and this interface. It gives a single place to declare the BPMN
  properties, reusable by the module augmentation of the next TODO.
- No compatibility alias for the nested form: like D4, these types are not released yet.
- The style reset (`style-updater.ts`) now copies the style with a plain spread: the nested copy of `bpmn` existed only
  to avoid mutating the shared nested object.
- The integration matchers no longer wrap the BPMN properties in `expect.objectContaining`: their caller already wraps
  the whole style in it, so extra properties of the cell are still accepted.

### D6. Module augmentation of `CellStyle`: shipped in the public types

The TODO set its own criterion: the augmentation is useful only if the libraries consuming bpmn-visualization see it.

First experiment, with maxGraph 0.25.1: `declare module '@maxgraph/core' { interface CellStateStyle extends
BpmnCellStyleExtension {} }` in `types.ts` compiles, and `tsc` emits it in `build/types`. But API Extractor
(`generate-types:dist`) drops it from `dist/bpmn-visualization.d.ts`, the only declaration file of the package, so a
consumer never sees it. The change was reverted and the finding recorded.

Options considered:
1. append the augmentation to the generated declarations (post-processing step, like the license header one);
2. apply it for the internal code only, the public types keeping `BpmnCellStyle` / `BpmnCellStateStyle`;
3. keep the extended types and decide during the real migration.

Option 1 chosen during the review of the POC, test first:
- `test/typescript-support/src/style-module-augmentation.ts`, modeled on the maxGraph `ts-support` test: it writes the
  `bv` properties on a `CellStyle`, reads them from a `CellStateStyle` without cast, and rejects an undeclared property
  with `@ts-expect-error`, otherwise it would pass if the style types accepted any property. Run against the published
  types before the change, it fails with 5 errors (the `bv` properties are unknown), as expected.
- new step `generate-types:add-module-augmentation` (`scripts/add-module-augmentation.mjs`), between API Extractor and
  the license header: it copies the `declare module '@maxgraph/core'` blocks emitted by `tsc` in `build/types` to the
  end of `dist/bpmn-visualization.d.ts`. Copying from the `tsc` output rather than writing the block in the script
  keeps a single source. It fails when it finds no block, so a change of the `tsc` output format cannot silently ship
  declarations without the augmentation.
- the augmentation targets `CellStateStyle`: `CellStyle` extends it, so both get the properties, as do `Shape.style`
  and `CellState.style`.

Touchy decision: `BpmnCellStyle` and `BpmnCellStateStyle` are removed rather than kept. With the augmentation, they
are identical to `CellStyle` / `CellStateStyle`, and they were introduced by the migration, never released, so no
consumer depends on them. All their usages, including the extension points and the casts in the shapes, now use the
maxGraph types directly. `BpmnCellStyleExtension` stays public: it is the type the augmentation is built on.

Side effect to keep in mind: a consumer who imports bpmn-visualization also gets the `bv` properties on its own maxGraph
style types. The `bv` prefix makes a clash with another extension unlikely.

### D7. Rename `BpmnStyleIdentifier` to `BpmnShapeIdentifier`

Unlike D4 and D5, this object is part of the released public API. It is renamed without compatibility alias anyway:
- the migration already broke its content: on master it lists the keys of the mxGraph style strings, and only the
  shape name `MESSAGE_FLOW_ICON` remains, so a consumer of the former keys has to migrate whatever the name;
- it is `@experimental`.

The JSDoc mentions the former name, so a consumer searching for it finds the new one.

### D8. A coordinate that is not a number degrades only its shape

Behavior on master (mxGraph): a non-numeric BPMN coordinate is parsed to `NaN`, stored as is in the geometry, and the
rest of the diagram is loaded. Behavior of the 0.23.0 POC: maxGraph rejects `NaN` in `Point` and `Rectangle`, so the
whole load throws `Invalid x supplied.`. That is a behavior change, so the option "validate the coordinates" of the TODO
is chosen over "rethrow with a convenient message", which would keep the load aborted.

Choices:
- the conversion happens in the renderer (`BpmnRenderer`), where the maxGraph geometry objects are built, not in the
  parser: the parser is independent of maxGraph, and a unit test pins that it produces `NaN` on purpose;
- `NaN` becomes 0, through the `convertNaNToZero` helper already used by the fit computation, moved to
  `helpers/validators.ts` to be shared. It applies to the shape and label bounds and to the edge waypoints;
- remaining difference with master: the geometry holds 0 instead of `NaN`. Both keep the rest of the diagram.

Comparison with master (requested during the review of the POC), on the fixture
`simple-start-task-end_numbers_not_parsable_as_number.bpmn` in the `bpmn-rendering.html` demo page, chromium:
- master (`1607c248b`, mxGraph): nothing is rendered for `Activity_1`, neither the shape nor the label, and the DOM
  holds no node with `data-bpmn-id="Activity_1"`. The other elements are rendered;
- POC: the shape of `Activity_1` is not drawn either (negative width and height), but its label group is rendered at
  the top left corner of the container (10, 10), in a 2px wide box: a "1" of "Task 1" is visible there. The other
  elements are rendered exactly as on master.

So the fix restored the load of the rest of the diagram, but not the rendering of the malformed shape: the POC showed a
label artifact that master does not. No e2e test covers this fixture.

Follow-up fix: when the bounds of a shape hold `NaN`, the renderer sets `noLabel: true` on its style. Compared with
master on the same page: same DOM (no node for `Activity_1`, same nodes for the other elements), and the screenshots of
both pages are identical (0 differing pixels with ImageMagick `compare -metric AE`). The integration test checks the
`noLabel` style of the malformed shape, and its absence on the other ones.

Rejected on the way:
- hiding the cell (`cell.setVisible(false)`): nothing is rendered for the shape, but the 2 sequence flows connected to
  it disappear, while master renders them. maxGraph `GraphView.updateEdgeState` removes an edge connected to a terminal
  that has no visible state;
- hiding the cell and giving the connected edges terminal points from their waypoints: no effect, the same condition
  of `updateEdgeState` applies whatever the terminal points, as long as the edge stays connected to the hidden cell.
  Disconnecting the edge would change the model compared with master.

Remaining difference, not covered by the fixture: a shape with a `NaN` coordinate but a positive size is drawn at the
coordinate 0, where mxGraph drew nothing.

### D9. `FitPlugin.fitCenter`: not applied, TODO kept

Experiment with maxGraph 0.25.1: replacing the own computation of `FitType.Center` by `FitPlugin.fitCenter({ margin })`
makes 29 of the 135 tests of `diagram.navigation.fit.test.ts` fail on chromium, from 2.2% to 18.7% different from the
snapshots. `fitCenter` applies the margin on both sides (`2 * margin`), rounds the translation down and the scale to 2
digits, where the own computation does not. It is a rendering change, forbidden by the rules, so the change is reverted
and the TODO records the measurement.

### D10. Interpretation of the "additional check" TODO of the style API tests

The TODO (`mxGraph.model.style.api.test.ts`) did not say which check. Its origin, in the history of the first maxGraph
POC (commit `8f4ee05391b259ecfb14eab0f213b50cf0eee640`, 2023-06-16), shows it: an `expect` added between two
`updateStyle` calls, checking the intermediate state. The TODO asked to apply it to every test chaining several update
actions.

Scope: the 8 tests chaining two `updateStyle` calls without intermediate check (4 on shapes, 4 on edges: "Update the
style twice" and "Font style already set"). The other tests found with several calls either already check the
intermediate state (`Common shape`, `Fill color as gradient`, `Lane`, `Pool`, restore of the edge default values) or
belong to the reset tests, out of the scope of the TODO.

The expectations are factored in assertion functions, so each state is checked with one call and no duplication.

### D11. Test matchers: keep the projection of the received styles

Two TODOs of `test/integration/matchers/matcher-utils.ts`, both from the first maxGraph POC:
- "rename into 'receivedStateStyle'": it targeted a local variable `expectedStateStyle` holding the received style
  (commit `2895cc964d1457a6125523a52b081515cd43a7d4`, 2022-12-05). That code no longer exists, so the TODO is removed
  as obsolete.
- "why building ExpectedStateStyle now maxGraph manage style in object, use 'stateStyle' directly": answered, the
  projection (`toBpmnStyle`) is kept, and a comment replaces the TODO. Without it:
  - the names and values of the received style would have to match the expected model as is (`textOpacity` instead of
    `fontOpacity`, `bv` prefixed properties, markers in rendering order);
  - the matchers compare with `subsetEquality`, which requires the property to exist on the received object for every
    expected key, including the ones expected `undefined` (checked in `@jest/expect-utils`). The raw style resolved by
    maxGraph omits the absent properties, so the expectations of absence (no gradient, no CSS class) would fail, or
    would have to be removed, which weakens the tests.

### D12. Bump to maxGraph 0.25.2: impact of the behavior changes

0.25.2 has no breaking change, but 4 behavior changes, from the changelog and the GitHub release:

| Behavior change | Impact on bpmn-visualization |
|---|---|
| `setCellStyles` removes the keys set to `null` (`insertEdge` no longer stores `sourcePort: null` / `targetPort: null`) | None: `setCellStyles` is not used, and the tests check the edge styles with `expect.objectContaining` |
| `GraphLayout` stores booleans in `noEdgeStyle` and `orthogonal` | None: no layout is used |
| `entryPerimeter` / `exitPerimeter` default to `true` | None: no fixed connection point (`entryX`, `exitX`, ...) is set |
| `setCellStyles` value typed after the key | None: not used |

The bump needs no code change. All the checks pass on chromium (e2e: 261 tests, 257 snapshots), and the demo pages
load with no console error.

## Open items

### O1. ECMAScript target of the generated code

maxGraph ships ES2020 code, bpmn-visualization targets ES2015. If a dependency ships ES2020 syntax, an environment
supporting only ES2015 fails anyway, so targeting ES2015 gives no compatibility gain. To analyse: the target of every
runtime dependency (maxGraph and the others), then whether bpmn-visualization should target ES2020 to be consistent.

Progress (analysis in progress, nothing decided):
- tool: `es-check` 9.9.0, lowest ECMAScript version parsing every file;
- `@maxgraph/core` 0.25.1, `lib/esm`: ES2020;
- `fast-xml-parser` 5.8.0, `src`: ES2020 for the code used by `XMLParser` (`??` in `xmlparser/OptionsBuilder.js:110`).
  The whole `src` folder requires more, but only because of code the library does not use: the CLI (`src/cli/cli.js`,
  shebang, ES2023) and the experimental v6 parser (`src/v6/`, class fields, ES2022);
- `es-toolkit` 1.46.1, `debounce` and `throttle` (the only functions used): ES2020;
- master already uses the same versions of `fast-xml-parser` and `es-toolkit`, so the README claim "they must at least
  support ES2015" is probably already false before the migration.

Conclusion (measured with `es-check` 9.9.0 on the bundles built by `npm run build-bundles`):

| Bundle | master `f90f6d3543330139d59a8e3e002aeaa0dfa28236` | POC |
|---|---|---|
| IIFE `bpmn-visualization.js` | ES2020 (`signal?.aborted`, es-toolkit `debounce`) | ES2020 (`navigator.appName?.`, maxGraph `Client`) |
| IIFE `bpmn-visualization.min.js` | ES2020 | ES2020 |
| ESM `bpmn-visualization.esm.js` | ES2015 (dependencies not bundled) | ES2015 (dependencies not bundled) |

Master already requires ES2020, because of es-toolkit and fast-xml-parser (with its `path-expression-matcher`
dependency). The maxGraph migration does not change the requirement. Switching the target to ES2020 is independent of
the migration, so it is proposed as a separate task in the 0.49.0 milestone, not done in this POC.

Follow-up: the switch to ES2020 is handled on master by issue #3608 and PR #3609 (open, about to be merged). The POC
does not change the target itself: it gets the change when it is rebased on master.

Do not rebase the POC on master before comparing its bundle sizes with the previous POC (maxGraph 0.23.0): ES2020 also
reduces the size (no down-leveling of `?.`, `??`, ...), and the comparison would no longer isolate the maxGraph effect.
