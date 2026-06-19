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

### Root cause: the `HorizontalVertical` fit computes a slightly different scale

The diff is a **uniform ~0.18% scale difference of the whole diagram** between mxGraph and maxGraph, introduced by the fit applied on load (`FitType.HorizontalVertical`). It is NOT a Chromium-version artifact and NOT an edge/dash rendering difference.

Investigation chain (each step ruling out the previous hypothesis):

1. **Regenerating the baseline with the current Chromium did not fix it.** A baseline regenerated from `master` (mxGraph) with today's Chromium still diffs from the maxGraph render by the same ~2.5%. So it is not (only) a Chromium-version difference.
2. **Solid shapes shift too, not just the dash.** An ImageMagick `compare` of the regenerated-mxGraph baseline vs the maxGraph render highlights the solid text-annotation bracket and the arrowheads as shifted ~1px, not only the dotted line. A dash-rendering difference would leave solid shapes untouched, so this is a geometry shift of the whole diagram.
3. **At scale 1 (jsdom) the SVG is byte-for-byte identical.** Rendering the diagram with mxGraph (`master` worktree, `mxgraph` 4.2.2) and maxGraph 0.23.0 in the same jsdom harness produced identical SVG for all 5 association paths (same `stroke-dasharray="1.5 3"`, `stroke-width="1.5"`, and full `d`). This is why the jsdom integration tests pass. But jsdom does not apply the on-load fit (scale stays 1), so it never exercises the divergence.
4. **In a real browser at the fit scale, the scale differs.** Capturing the rendered SVG from each engine's dev server at 800x600 with `fitTypeOnLoad=HorizontalVertical`:

   | | fit scale | association `stroke-dasharray` | first path point |
   |---|---|---|---|
   | maxGraph 0.23.0 | `1.3973955994611584` | `2.0960933991917376 4.192186798383475` | `M 322.8 197.03` |
   | mxGraph 4.2.2 | `1.3999100314889790` | `2.0998650472334686 4.199730094466937` | `M 323.38 197.39` |

   The coordinate ratio is constant (`323.38/322.8 = 197.39/197.03 = 1.0018`), i.e. a pure uniform scale difference; nothing else diverges.
5. **The fit scale formula is byte-identical** between mxGraph `mxGraph.fit()` and maxGraph `FitPlugin.fit()` (`w1 = offsetWidth - cssBorder.x - cssBorder.width - 1`, `b = (keepOrigin ? border : 2*border) + margin + 1`, `s2 = min(w1/w2, h1/h2)`). Both are called with the same arguments, in the same dev page (same container, CSS border, margin), with the same starting scale 1. Therefore `w1`/`h1` are identical, and the only differing input is `w2`/`h2 = graphBounds / scale`.
6. **So maxGraph computes a slightly larger graph bounding box** in the binding dimension (factor ~1.0018), which yields a smaller fit scale. The cell geometries come from the BPMN model (identical), so the difference is in the **label/text bounding boxes** that `getGraphBounds()` unions in. Real text metrics exist only in a browser, which is exactly why integration (jsdom, stubbed metrics) passes while e2e (real browser) diffs, and why diagrams with text-annotation labels (`associations.and.annotations.*`) are the ones affected.

**This is a genuine maxGraph-vs-mxGraph behavioral difference (not Chromium, not dash rendering, not the edge pipeline).** The earlier "byte-identical SVG / pure Chromium-version" conclusion was correct only at scale 1; it missed the fit-scale divergence that appears in the browser.

Why only these snapshots cross the threshold: the whole diagram scales by ~0.18%, so every element shifts a fraction of a pixel (more the farther from the fit origin). Solid thick shapes mostly stay within the per-snapshot tolerance, but a long fine `1 2` dotted association accumulates many sub-pixel-shifted dots, exceeding the 0.16%/0.31% threshold. The coarser `8 5` message-flow dash and shorter/simpler associations stay under it.

**Possible fixes / next steps:** (a) confirm by capturing `getGraphBounds()` from both engines in a browser and diffing the per-cell bounds to pin the exact label-measurement source; (b) investigate maxGraph's label text-extent measurement (`getTextSize`/SVG text width) vs mxGraph; (c) evaluate `FitPlugin.fitCenter`; or (d) accept the new rendering and regenerate the snapshots under the maxGraph toolchain (the diffs are sub-pixel scale, visually negligible).

### Ruled out: edge `arcSize`

To isolate the cause, the failing suites were re-run with `style.arcSize` set back to the old 0.20.0 POC value (2.5) instead of the restored original 5:

| `arcSize` | Failures in `overlays.rendering` + `bpmn.rendering` |
|---|---|
| 5 (restored original mxGraph value, current) | 6 |
| 2.5 (old 0.20.0 POC value) | 18 |

So `arcSize = 5` matches the existing (mxGraph-baseline) snapshots **more** closely, not less. The revert from 2.5 to 5 reduces visual diffs and is confirmed correct (maxGraph 0.21.0 fixed the arc computation, so the original value 5 renders as it did under mxGraph). The 6 residual diffs are independent of `arcSize`.

## Recommendation

The 6 failing snapshots all trace to a single, real cause: a uniform ~0.18% difference in the on-load `HorizontalVertical` fit scale between maxGraph and mxGraph, driven by a small difference in `getGraphBounds()` (label text-extent measurement in the browser). The diagrams render correctly; they are just fit at a fractionally different zoom. The 251 unchanged snapshots confirm the migration is visually faithful for everything else.

Decision for this POC: either (a) dig into the `getGraphBounds`/label-measurement difference (or switch to `FitPlugin.fitCenter`) to reproduce the mxGraph fit scale exactly, or (b) accept the fractional fit-scale change and regenerate the affected snapshots under the maxGraph toolchain (`npm run test:e2e -- -u`, ideally across the full CI browser matrix). Given the difference is sub-pixel and visually negligible, (b) is reasonable for the POC; (a) is the follow-up if pixel-identical fit with mxGraph is required.
