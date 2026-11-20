# Bundle sizes: maxGraph 0.25.2 POC compared with the maxGraph 0.23.0 POC and master

## Summary

- Compared with the maxGraph 0.23.0 POC, the minified IIFE bundle **decreases by about 83 kB / 17.2%**, and the demo
  chunk of maxGraph by about 83 kB / 25.7%. The bpmn-visualization code (ESM bundle, demo chunk) barely changes.
  About 80 kB of it come from the cell handlers, no longer bundled since maxGraph 0.25.0 (see the cause below).
- Compared with master (mxGraph 4.2.2), the minified IIFE bundle **decreases by about 603 kB / 59.9%**, and the demo
  chunk of the graph library by about 595 kB / 71.2%.

## master, maxGraph 0.23.0 POC and this POC

| Bundle | mxGraph 4.2.2 (master 1e77ee536) | maxGraph 0.23.0 | maxGraph 0.25.2 | Δ vs 0.23.0 | Δ vs master |
|---|---:|---:|---:|---:|---:|
| IIFE raw | 1757.19 | 991.22 | 827.18 | -164.04 kB (-16.55%) | -930.01 kB (-52.93%) |
| IIFE minified | 1005.42 | 486.23 | 402.79 | -83.44 kB (-17.16%) | -602.63 kB (-59.94%) |
| ESM | 209.79 | 204.41 | 203.59 | -0.82 kB (-0.40%) | -6.20 kB (-2.95%) |
| Demo chunk mxgraph / maxgraph | 836.00 | 323.98 | 240.74 | -83.24 kB (-25.69%) | -595.26 kB (-71.20%) |
| Demo chunk bpmn-visualization | 87.77 | 84.21 | 84.22 | +0.01 kB (+0.01%) | -3.55 kB (-4.04%) |
| Demo chunk es-toolkit | 0.85 | 0.85 | 0.85 | +0.00 kB (+0.47%) | +0.00 kB (+0.47%) |
| Demo chunk fast-xml-parser | 41.28 | 41.28 | 41.28 | +0.01 kB (+0.01%) | +0.01 kB (+0.01%) |

## maxGraph 0.23.0 POC compared with this POC

| Bundle | maxGraph 0.23.0 | maxGraph 0.25.2 | Δ kB | Δ % |
|---|---:|---:|---:|---:|
| IIFE raw | 991.22 | 827.18 | -164.04 | -16.55% |
| IIFE minified | 486.23 | 402.79 | -83.44 | -17.16% |
| ESM | 204.41 | 203.59 | -0.82 | -0.40% |
| Demo chunk mxgraph / maxgraph | 323.98 | 240.74 | -83.24 | -25.69% |
| Demo chunk bpmn-visualization | 84.21 | 84.22 | +0.01 | +0.01% |
| Demo chunk es-toolkit | 0.85 | 0.85 | +0.00 | +0.47% |
| Demo chunk fast-xml-parser | 41.28 | 41.28 | +0.01 | +0.01% |

## master compared with this POC

| Bundle | mxGraph 4.2.2 (master 1e77ee536) | maxGraph 0.25.2 | Δ kB | Δ % |
|---|---:|---:|---:|---:|
| IIFE raw | 1757.19 | 827.18 | -930.01 | -52.93% |
| IIFE minified | 1005.42 | 402.79 | -602.63 | -59.94% |
| ESM | 209.79 | 203.59 | -6.20 | -2.95% |
| Demo chunk mxgraph / maxgraph | 836.00 | 240.74 | -595.26 | -71.20% |
| Demo chunk bpmn-visualization | 87.77 | 84.22 | -3.55 | -4.04% |
| Demo chunk es-toolkit | 0.85 | 0.85 | +0.00 | +0.47% |
| Demo chunk fast-xml-parser | 41.28 | 41.28 | +0.01 | +0.01% |

## Measured commits and sources

The three sides share the same base: master `1e77ee536539d7d8567ea0ac48e449aad2cb44e2`.

- master and maxGraph 0.23.0 POC: values taken from the description of the 0.23.0 POC pull request (#3605), section
  "On top of the latest master", not measured again. Commits: master `1e77ee536539d7d8567ea0ac48e449aad2cb44e2`, POC
  `5201eecb21a57313928c9024b4f9cc2a3bd245d6`.
- maxGraph 0.25.2 POC: measured locally on `fc79a54bf` (local commit, not pushed), with the same tool as #3605, the
  `pr-bundle-size` skill (`bundle-sizes.sh measure`): `npm ci`, `build-bundles` and `demo:build` in a temporary worktree.
  `npm ci` used the committed lock file, without fallback.

## Reading the tables

- Sizes in kB of 1000 bytes, not gzipped, as in #3605.
- The #3605 values are rounded to 10 bytes (2 decimals in kB), so the small deltas are rounding noise: the +0.47% of
  es-toolkit is 850 bytes (rounded) against 854 bytes (measured). Only the deltas above a few tenths of kB matter.
- Toolchain: `bundle-sizes.sh toolchain 5201eecb2 fc79a54bf` reports no difference (same Node, rollup, plugins, vite,
  typescript, esbuild). Between the two POCs, `package.json` and `package-lock.json` only change by the maxGraph version
  and the new `generate-types:add-module-augmentation` script, which only touches the declarations, not the bundles.
- The ECMAScript target is ES2015 on the three sides. This POC is deliberately not rebased on master before this
  comparison: the switch to ES2020 (#3609) also changes the sizes, and would mix with the maxGraph effect (see O1 in
  `decisions.md`).
- The ESM bundle does not include maxGraph (dependencies are external): its -0.82 kB only comes from the bpmn-visualization
  code that differs between the two POCs.
- The decrease between the two POCs comes from the maxGraph code: the demo chunk of maxGraph and the IIFE bundle lose
  the same 83 kB. Its cause is analysed below.

## Cause of the decrease between the two POCs

Hypothesis: the cell handlers are no longer bundled. **Confirmed**, they explain about 80 of the 83 kB.

maxGraph 0.25.0 moved the cell handler factories from `AbstractGraph` to the `SelectionCellsHandler` plugin
([CHANGELOG at v0.25.2](https://github.com/maxGraph/maxGraph/blob/bd728a2afec38753b7de42c2b336edd00e3532fc/CHANGELOG.md#0250),
[maxGraph#823](https://github.com/maxGraph/maxGraph/pull/823), merge commit
`adcb78e8bae29fc2c408fe78c1b8a7efdad11e99`): "`BaseGraph` consumers that do not register `SelectionCellsHandler` no
longer bundle these classes" (`VertexHandler`, `EdgeHandler`, `ElbowEdgeHandler`, `EdgeSegmentHandler`).

Evidence:
- in maxGraph 0.23.0, `AbstractGraph.ts` imports the four handlers
  ([source at v0.23.0](https://github.com/maxGraph/maxGraph/blob/363e80291f9f0f5e91d93cc188af6abda04d4719/packages/core/src/view/AbstractGraph.ts#L44-L47)),
  so any `BaseGraph` bundled them. In 0.25.2, it no longer imports any of them;
- `BpmnGraph` only registers `PanningHandler` and `FitPlugin`, not `SelectionCellsHandler`;
- the IIFE bundle of this POC (`dist/bpmn-visualization.js`, not minified, so the class names are kept) contains no
  occurrence of `VertexHandler`, `EdgeHandler`, `ElbowEdgeHandler`, `EdgeSegmentHandler` nor `ConstraintHandler`, while
  `PanningHandler`, `FitPlugin` and `EdgeStyleRegistryImpl` are there;
- maxGraph#823 measured the same order of magnitude on its examples that do not register `SelectionCellsHandler`:
  -80.94 kB (`js-example-without-defaults`) and -78.59 kB (`ts-example-without-defaults`), against -83.44 kB here for
  the minified IIFE bundle. The bundlers and minifiers differ, so the values are close but not identical.

The remaining 2 to 4 kB are not attributed precisely. Candidates, from the release notes, each small:
- maxGraph 0.24.0 converted `ImageMixin` to `ImageBundlePlugin`, not registered by `BpmnGraph`:
  [maxGraph#1050](https://github.com/maxGraph/maxGraph/pull/1050) measured -0.3 to -0.5 kB on the examples without it;
- maxGraph 0.25.1, "code modernization reducing the bundle size" (mostly `for of` loops instead of indexed loops),
  not measured in the release notes;
- the bpmn-visualization code itself: -0.82 kB on the ESM bundle, which does not include maxGraph.
