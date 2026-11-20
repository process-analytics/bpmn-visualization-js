# Bundle sizes: maxGraph 0.25.2 POC compared with the maxGraph 0.23.0 POC and master

## Summary

- Compared with the maxGraph 0.23.0 POC, the minified IIFE bundle **decreases by about 83 kB / 17.2%**, and the demo
  chunk of maxGraph by about 83 kB / 25.7%. The bpmn-visualization code (ESM bundle, demo chunk) barely changes.
- Compared with master (mxGraph 4.2.2), the minified IIFE bundle **decreases by about 603 kB / 59.9%**, and the demo
  chunk of the graph library by about 595 kB / 71.2%.

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
- The decrease between the two POCs comes from the maxGraph code (the demo chunk of maxGraph and the IIFE bundle lose
  the same 83 kB). Which maxGraph changes cause it is not analysed here.
