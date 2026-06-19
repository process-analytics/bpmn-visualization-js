# e2e visual snapshot diff inventory (mxGraph -> maxGraph 0.23.0)

**Date:** 2026-06-19
**Run:** `npm run test:e2e` locally, browser **chromium** only (the default; CI matrix browsers were not run, and e2e is disabled on CI per Q8).
**Snapshots are NOT updated.** This inventory is for review; regenerate snapshots only after the diffs are accepted.

## Summary

| | Count |
|---|---|
| Test suites | 11 (9 passed, 2 failed) |
| Snapshots | 257 (251 passed, **6 failed**) |
| Tests | 261 (255 passed, 6 failed) |

All 6 failing snapshots are **association-flow edges** (dashed `1 2` pattern, rounded, with multiple waypoints). Every diff is ~2.4-2.6% of pixels, localized to the edge stroke along the rounded bends/waypoints. No shape, label, event, gateway, pool/lane, color, theme, or SVG-export snapshot regressed.

## Failing snapshots

| Suite | Test | Diff % | Threshold | Diff image |
|---|---|---|---|---|
| `bpmn.rendering.test.ts` | `associations.and.annotations.02.complex.paths` | 2.50% | 0.16% | `bpmn-rendering/associations.and.annotations.02.complex.paths-diff.png` |
| `bpmn.rendering.test.ts` | `associations.and.annotations.03.waypoints.02.outside.shape` | 2.49% | 0.16% | `bpmn-rendering/associations.and.annotations.03.waypoints.02.outside.shape-diff.png` |
| `overlays.rendering.test.ts` | `overlays.edges.associations.complex.paths > add overlay on association flow on start` | 2.52% | 0.31% | `overlays/on.edge/on-position-start/add.overlay.on.association.flow-diff.png` |
| `overlays.rendering.test.ts` | `... add overlay on association flow on middle` | 2.51% | 0.31% | `overlays/on.edge/on-position-middle/add.overlay.on.association.flow-diff.png` |
| `overlays.rendering.test.ts` | `... add overlay on association flow on end` | 2.59% | 0.31% | `overlays/on.edge/on-position-end/add.overlay.on.association.flow-diff.png` |
| `overlays.rendering.test.ts` | `... remove all overlays of association flow` | 2.44% | 0.31% | `overlays/on.edge/remove.all.overlays.of.association.flow-diff.png` |

(Diff images are under `build/test-report/e2e/__diff_output__/`.)

## Characterization

- **What changed visually:** on the fine `1 2` association dash, the dotted line rasterizes slightly differently (dot density/anti-aliasing) along the route, strongest at the bends. In the overlay tests the overlay badge sits on the edge, so it tracks the edge path (no independent overlay-placement regression). The maxGraph and mxGraph engines emit the **same** SVG (proven below); only the rasterized pixels differ.
- **Root cause (investigated, not a code defect):** the maxGraph edge-rendering pipeline was compared function-by-function against mxGraph, both against the maxGraph `main` source and the installed `@maxgraph/core` 0.23.0 build. Every layer that could shift a dashed/rounded edge stroke is equivalent: `Shape.addPoints` (rounded-corner polyline), `PolylineShape.paintLine` + `getBaseArcSize()` (the `(arcSize ?? lineArcSize) / 2`, matching mxGraph; `LINE_ARCSIZE = 20` in both), `ConnectorShape.paintEdgeShape` (line drawn dashed, markers forced solid afterwards), `SvgCanvas2D.createDashPattern` (`Number(dash[i]) * scale`), `updateStroke` dash emission (no `stroke-dashoffset` in either engine), `setDashed(value, fixDash)`, `AbstractCanvas2D.scale` (multiplies `strokeWidth`, identical in both), and `SvgCanvas2D.format` (2-decimal rounding). bpmn-visualization's own overrides (`BpmnGraphView.getFloatingTerminalPoint`, `overrideCreateSvgCanvas`) are engine-neutral and, for the failing multi-waypoint associations, return the existing BPMN waypoints without re-running perimeter math. The association style is also unchanged from mxGraph-era master (`dashed`, `dashPattern '1 2'`, `strokeWidth 1.5`). No porting divergence was found. The only historical divergence (the pre-0.21.0 arc computation) was already fixed upstream and is correctly handled here by restoring `arcSize` to 5 (see below).
- **Decisive proof (done): SVG output is byte-for-byte identical.** The same failing diagram (`associations.and.annotations.02.complex.paths`) was rendered with the actual mxGraph implementation (the `master` worktree, `mxgraph` 4.2.2) and with maxGraph 0.23.0, in the same jsdom harness, and the produced SVG was diffed. All 5 association `<path>` elements are identical between the two engines: same `stroke-dasharray="1.5 3"`, same `stroke-width="1.5"`, same `stroke-linecap` (none/butt), and the same full `d` coordinate string (928 chars, `diff` reports IDENTICAL). This comparison is chromium-independent (it compares the SVG the engines emit, not rasterized pixels), so it isolates the engine from the browser.
- **Therefore the PNG diff is purely a Chromium-version difference, not a maxGraph defect.** The committed baseline PNGs were generated with an older Chromium than the one used today; that older Chromium rasterized the identical `stroke-dasharray="1.5 3"` fine dotted line slightly differently. This is why only the fine `1 2` association dash shows a diff while the coarser `8 5` message-flow dash (e.g. `flows.message.02.labels.and.complex.paths`) and simpler associations do not: a fine dot pattern is far more sensitive to the rasterizer's dash-rendering change. The fix is simply to regenerate the snapshots with the current toolchain; no source change is warranted.

### Ruled out: edge `arcSize`

To isolate the cause, the failing suites were re-run with `style.arcSize` set back to the old 0.20.0 POC value (2.5) instead of the restored original 5:

| `arcSize` | Failures in `overlays.rendering` + `bpmn.rendering` |
|---|---|
| 5 (restored original mxGraph value, current) | 6 |
| 2.5 (old 0.20.0 POC value) | 18 |

So `arcSize = 5` matches the existing (mxGraph-baseline) snapshots **more** closely, not less. The revert from 2.5 to 5 reduces visual diffs and is confirmed correct (maxGraph 0.21.0 fixed the arc computation, so the original value 5 renders as it did under mxGraph). The 6 residual diffs are independent of `arcSize`.

## Recommendation

Accept the 6 association-flow diffs as expected migration noise and regenerate the affected snapshots (`npm run test:e2e -- -u`, ideally across the full CI browser matrix) when the migration is finalized. No source change is warranted for these diffs. The 251 unchanged snapshots confirm the migration is visually faithful for all other element kinds.
