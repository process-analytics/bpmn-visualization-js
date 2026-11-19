---
name: pr-bundle-size
description: "Build the bundle size comparison table of a bpmn-visualization branch or pull request: npm bundles (IIFE minified, IIFE raw, ESM) and demo library chunks, reference vs branch, in kB with deltas. Use when the user asks for the bundle size impact of a branch or a pull request, for instance a dependency upgrade or the mxGraph to maxGraph migration."
disable-model-invocation: true
argument-hint: "[<base-ref>] [<head-ref>]"
---

# Bundle size comparison of a branch

Compare the sizes of the bundles built from a reference commit with those built from the branch, and produce a
markdown table ready to paste into a pull request description.

All the commands below use the script of this skill, from the root of the repository:

```bash
S=.claude/skills/pr-bundle-size/bundle-sizes.sh
```

## What is measured

- **npm bundles**, from `npm run build-bundles`: `dist/bpmn-visualization.min.js` (IIFE minified),
  `dist/bpmn-visualization.js` (IIFE raw), `dist/bpmn-visualization.esm.js` (ESM, dependencies not bundled).
- **Demo chunks**, from `npm run demo:build`: one row per `lib-*.js` chunk of `build/demo/dev/public/assets`. The
  `lib-mxgraph` and `lib-maxgraph` chunks share the `Demo chunk mxgraph / maxgraph` row, so that a migration compares
  them directly.
- **Sizes are in kB of 1000 bytes**, raw output, never gzipped, as in `scripts/list-npm-bundle-sizes.sh` and
  `scripts/list-demo-lib-chunks.sh` on `master`.

The script reads the files itself instead of calling the repository scripts, so that both sides are measured the same
way whatever version of these scripts each ref contains (the kB divisor changed from 1024 to 1000 on `master`).

## Where the sizes can come from

The CI publishes sizes in job summaries, but not for every side of a comparison:

- the `Test npm package` workflow prints the npm bundle sizes, on pushes to `master` and on pull requests;
- the `Generate Demo Preview` workflow prints the demo chunk sizes, on pull requests only. `master` never builds the
  demo, so the demo reference always needs a local build;
- both workflows are path filtered: a commit or a pull request that changes none of their paths has no run.

A local build of both sides is therefore the default, and the CI summaries serve as a cross-check when they exist.

## 1. Choose the two refs

- **Reference**: by default the merge base of the branch with `origin/master`. When the branch is based on a release
  tag or a specific commit, use that commit. When the comparison is meant to show what merging the branch gives,
  rebase the branch first if `master` gained changes to `src/`, `package*.json`, `rollup.config.mjs` or
  `vite.config.js` since the merge base.
- **Branch**: `HEAD` by default. The script builds a committed ref: commit or stash local changes first, or say that
  they are not measured.

## 2. Check the toolchain

```bash
$S toolchain <base> <head>
```

It lists the Node version (`.nvmrc`) and the locked versions of the bundlers, plugins, minifier and compiler that
differ between the two refs. Any line means part of the size difference may come from the tooling, see the reading
rules.

## 3. Measure both sides

```bash
$S measure <base> <scratchpad>/bundle-sizes <scratchpad>/bundle-sizes/base.csv
$S measure <head> <scratchpad>/bundle-sizes <scratchpad>/bundle-sizes/head.csv
```

Each call checks out the ref in a temporary git worktree, runs `nvm use`, `npm ci`, `build-bundles` and `demo:build`,
writes the sizes, then removes the worktree. It takes a few minutes per ref: run both in the background, one after
the other.

When `npm ci` refuses the lock file because it is out of sync with `package.json` (this happened with `picomatch` on
commits around 0.48.0), the script falls back to `npm install` and writes the packages whose version changed to
`<name>.lock-changes.txt` next to the CSV. Report these changes with the table: that side was not built from exactly
the committed lock. When they include a runtime dependency (`@maxgraph/core`, `mxgraph`, `fast-xml-parser`,
`es-toolkit`) or a bundler, the measurement is not valid as is.

## 4. Build the table

```bash
$S table "<base label>" <scratchpad>/bundle-sizes/base.csv "<head label>" <scratchpad>/bundle-sizes/head.csv
```

Name the columns after what they contain, for instance `mxGraph 4.2.2 (master baf591fc0)` and `maxGraph 0.23.0`.
A bundle missing on one side shows `N/A`.

## 5. Report

Print the table, followed by a short explanation:

- the largest changes first, in kB;
- the toolchain changes found in step 2, stated as facts;
- the two commits measured, as full SHAs, and whether the branch side had unpushed commits.

### Reading rules

- **Never attribute a size change without evidence.** The sizes say how much a bundle changed, not why. Name a cause
  only when the diff explains it directly, for instance a dependency replaced by another one.
- **Lead with the largest changes in kB, not in %.** A large percentage on a small chunk is usually noise.
- **Compare measurements made with the same toolchain.** A different Node, bundler, minifier or TypeScript version
  is part of the difference.

Do not edit the pull request yourself. When the user asks to add the table to it, write it in the description draft
file first, following the drafted deliverables rules.
