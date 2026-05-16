# Tasks: BPMN in Color Extension PoC

## Overview

Refactor the hardcoded BPMN in Color support into the new extension mechanism defined in the ADR. Pure internal refactoring — no user-facing behavior change.

## Task List

- [ ] **Task 1**: Define extension point interfaces and migrate extension types - `task-01.md`
- [ ] **Task 2**: Implement BPMN in Color as extension - `task-02.md` (depends on Task 1)
- [ ] **Task 3**: Wire extension into DiagramConverter and StyleComputer - `task-03.md` (depends on Task 2)

## Execution Order

Sequential: Task 1 → Task 2 → Task 3 (each depends on the previous)

## Validation

After Task 3, run `npm run all` to verify the full check passes (lint, build, all tests).
