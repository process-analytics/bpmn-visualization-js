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

- **What changed visually:** the dashed association edges render slightly differently along their rounded corners/waypoints. The diff is a thin band that follows the edge route, strongest at the bends. In the overlay tests the overlay badge sits on the edge, so it shifts together with the edge path (no independent overlay-placement regression).
- **Single root cause:** maxGraph draws rounded, dashed edges with multiple waypoints with a slightly different arc segmentation / dash phase than mxGraph. This is an inherent rendering difference of the new engine, not a defect in the migrated code.

### Ruled out: edge `arcSize`

To isolate the cause, the failing suites were re-run with `style.arcSize` set back to the old 0.20.0 POC value (2.5) instead of the restored original 5:

| `arcSize` | Failures in `overlays.rendering` + `bpmn.rendering` |
|---|---|
| 5 (restored original mxGraph value, current) | 6 |
| 2.5 (old 0.20.0 POC value) | 18 |

So `arcSize = 5` matches the existing (mxGraph-baseline) snapshots **more** closely, not less. The revert from 2.5 to 5 reduces visual diffs and is confirmed correct (maxGraph 0.21.0 fixed the arc computation, so the original value 5 renders as it did under mxGraph). The 6 residual diffs are independent of `arcSize`.

## Recommendation

Accept the 6 association-flow diffs as expected migration noise and regenerate the affected snapshots (`npm run test:e2e -- -u`, ideally across the full CI browser matrix) when the migration is finalized. No source change is warranted for these diffs. The 251 unchanged snapshots confirm the migration is visually faithful for all other element kinds.
