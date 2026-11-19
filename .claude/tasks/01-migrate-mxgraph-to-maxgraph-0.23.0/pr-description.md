Proposed title: `refactor: [POC] Replace mxGraph with maxGraph 0.23.0`

## Overview

**This is a POC and it is not intended to be merged into master.**
This is a continuation of #3340 (maxGraph 0.20.0), itself a continuation of #3270.
Covers #3238

Start from master baf591fc0 (0.48.0 release, then the version bump to 0.48.0-post).
- unlike #3340, which replayed newer maxGraph versions on the 0.37.0 codebase, this POC applies maxGraph 0.23.0 to the current architecture of bpmn-visualization (extension points, typed style objects, dispose lifecycle)
- the patterns proven in #3340 were reapplied file by file, the old commits were not cherry-picked

**Please don't rebase on `master`**. If necessary, merge the master branch, or create a new POC with the latest changes from the master branch.

## Status

`npm run build`, unit tests (3168), integration tests (319) and lint pass.

The e2e visual tests pass locally on chromium: 257/257 snapshots, against the existing baselines, with no snapshot regeneration. They run on CI again, which covers the other browsers.

### Main improvements compared to #3340

- **for the first time in these POCs, all the e2e tests pass**, against the existing snapshots. This makes the migration a viable solution, even if it includes workarounds (see below) that will no longer be necessary with newer versions of maxGraph
- the edge `arcSize` is back to the mxGraph value (5): maxGraph 0.21.0 fixed the arc computation, so the halving to 2.5 needed in #3340 is gone
- fit uses the maxGraph `FitPlugin` (0.21.0) with a single options object, and `getPlugin` returns `undefined` when the plugin is missing (0.21.0), so the plugin access is null safe instead of cast
- `BpmnVisualization.dispose()` releases the graph and the navigation plugins, relying on the destroy lifecycle and the memory leak fixes of maxGraph 0.23.0. #3340 had no teardown at all
- custom overlays are provided by a `BpmnCellRenderer` passed to the `BaseGraph` constructor, instead of patching the `CellRenderer` prototype
- `BpmnConnector` is removed: maxGraph paints the fill color of the start and end markers natively (https://github.com/maxGraph/maxGraph/pull/157)
- the rollup `commonjs` plugin is removed: mxGraph is gone and fast-xml-parser 5 is ESM capable

### Workarounds and follow-ups

They are tracked as `TODO maxgraph@<version>` comments in the code.

- association edges: maxGraph treats an unset `startArrow` as present when computing the bounding box, which changed the fit scale and broke 6 e2e snapshots. Worked around by setting `startSize` only on the association direction that has a start arrow. Fixed in maxGraph 0.24.0 (https://github.com/maxGraph/maxGraph/pull/1094)
- the BPMN data of the style is nested under a `bpmn` property of the extended `BpmnCellStyle` type. To align with the maxGraph recommendation, use flat properties sharing a `bv` prefix, and module augmentation of `CellStyle`, available since maxGraph 0.25.0 (https://github.com/maxGraph/maxGraph/pull/1147)
- the new public types carry `@since 0.x.y` until the release that ships the migration is known

### Impact on the size of the bundles

The minified IIFE bundle **decreases by about 519 kB / 51.6%**, and the demo chunk of the graph library by about 512 kB / 61.2%.

| Bundle | mxGraph 4.2.2 (master baf591fc0) | maxGraph 0.23.0 | Δ kB | Δ % |
|---|---:|---:|---:|---:|
| IIFE raw | 1757.32 | 991.34 | -765.98 | -43.59% |
| IIFE minified | 1005.71 | 486.52 | -519.19 | -51.62% |
| ESM | 209.92 | 204.54 | -5.38 | -2.56% |
| Demo chunk mxgraph / maxgraph | 837.26 | 324.98 | -512.27 | -61.18% |
| Demo chunk bpmn-visualization | 88.17 | 84.69 | -3.48 | -3.94% |
| Demo chunk es-toolkit | 0.88 | 0.88 | +0.00 | +0.00% |
| Demo chunk fast-xml-parser | 41.55 | 41.55 | +0.00 | +0.00% |

- Sizes in kB of 1000 bytes, not gzipped.
- The ESM bundle does not include mxGraph or maxGraph: the rollup config marks the dependencies as external, and the bundle imports `@maxgraph/core`. So its change only comes from the bpmn-visualization code, as for the demo chunk of the bpmn-visualization code.
- The demo chunks of es-toolkit and fast-xml-parser are unchanged.
- The only toolchain difference between the two builds is the removal of the rollup `commonjs` plugin.
- On master, `npm ci` refused the lock file, out of sync with `package.json` for `picomatch` (fixed later on master by #3589). That side was installed with `npm install`, which only changed `picomatch` from 4.0.4 to 4.0.7, a build tool that is not part of the bundles. The POC side was installed with `npm ci` from its committed lock file.

**How the table was generated**: with the new `pr-bundle-size` Claude Code skill, added by this POC in `.claude/skills/pr-bundle-size/`. Its script builds each commit in a temporary git worktree with the locked dependencies (`npm ci`, `npm run build-bundles`, `npm run demo:build`), reads the sizes of the npm bundles and of the demo `lib-*.js` chunks, then compares the two measurements. The `lib-mxgraph` and `lib-maxgraph` chunks are compared on a single row. The measured commits are:
- master: baf591fc03678444b2f531146ce11abe5dc41291
- POC: 86dd502261d16abd58f1c069c38b801c7bae2621

### Breaking changes

- The rendering engine is now maxGraph. The experimental `BpmnVisualization.graph` property is a maxGraph `BaseGraph` and follows the maxGraph naming (e.g. `getDataModel()` instead of `getModel()`).
- The aggregated `mxgraph` namespace export is removed with no replacement. `@typed-mxgraph/typed-mxgraph` is no longer a dependency, maxGraph ships its own types.
- Theme and style customization use typed maxGraph `CellStyle` objects (`BpmnCellStyle`) instead of mxGraph style strings.
- `getVersion().dependencies` reports `maxGraph` instead of `mxGraph`.
- Most `@experimental` `BpmnStyleIdentifier` members are removed, only `MESSAGE_FLOW_ICON` remains. The former `bpmn.*` style keys are typed properties under `CellStyle.bpmn`.
- The `@experimental` render types (`BpmnCanvas`, `IconPainter`, `PaintParameter`) use the maxGraph `AbstractCanvas2D`, and `BpmnCanvas.arcTo` takes `boolean` flags.
- `load()` throws `Invalid x supplied.` when a diagram contains a non-numeric coordinate, instead of rendering a broken shape.
