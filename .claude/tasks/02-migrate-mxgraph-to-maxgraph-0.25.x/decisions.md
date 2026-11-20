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

## Open items

### O1. ECMAScript target of the generated code

maxGraph ships ES2020 code, bpmn-visualization targets ES2015. If a dependency ships ES2020 syntax, an environment
supporting only ES2015 fails anyway, so targeting ES2015 gives no compatibility gain. To analyse: the target of every
runtime dependency (maxGraph and the others), then whether bpmn-visualization should target ES2020 to be consistent.
