# Task: Disable e2e on CI, revert arcSize, inventory snapshots, consolidate breaking changes

## Problem
e2e visual tests will show small diffs after the migration (expected) and must not block CI for this POC. The v1 arcSize halving (2.5) became obsolete when maxGraph 0.21.0 fixed the arc computation, but reverting it changes edge rendering so it needs an isolated visual check. Finally, the accumulated breaking changes must be consolidated for the PR.

## Proposed Solution
Disable the e2e jobs on CI (v1 trick `if: github.event_name == 'NOT_SUPPORTED'`) with a comment referencing this migration and Q8. As a dedicated, individually-revertable commit, restore the original arcSize value (remove the halving and its TODO), running the e2e suite locally before and after to isolate its visual impact. Run e2e locally and write `e2e-diff-inventory.md` characterizing every failing snapshot (edge rounding, marker rendering, font metrics, ...) for user review WITHOUT updating snapshots. Consolidate `breaking-changes.md` into the final `BREAKING CHANGE:` footer content and PR description. Re-evaluate the two `.eslintrc.cjs` mxGraph rule disables and run `npm run lint`.

## Dependencies
- Tasks #12 and #13 green (unit + integration are the definition of done).

## Context
- `plan.md` Phase 8 + Final steps A/B/C, and Testing Strategy (lint) have the detail.
- Key files: `.github/workflows/test-e2e.yml`, `StyleConfigurator`/`StyleDefault` (arcSize), `.eslintrc.cjs`.
- Create `.claude/tasks/01-migrate-mxgraph-to-maxgraph-0.23.0/e2e-diff-inventory.md`.
- Snapshots are NEVER silently updated; the inventory is for the user to review.

## Success Criteria
- e2e disabled on CI with a documented reason.
- arcSize reverted in its own commit, with before/after e2e impact noted.
- `e2e-diff-inventory.md` lists every diff with a short characterization.
- `breaking-changes.md` finalized; `npm run lint` clean.
