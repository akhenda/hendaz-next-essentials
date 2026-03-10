# Optional Convex Setup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an optional Convex scaffold path to the Hendaz Next.js essentials skill, including backend examples, frontend hooks, tests, and Convex-aware Vitest coverage thresholds.

**Architecture:** Keep Convex setup opt-in. The skill will instruct the agent to ask the user whether Convex should be added, while the deterministic script will support `--with-convex` to copy Convex templates, update package installation, and configure testing in the existing root Vitest config.

**Tech Stack:** Bash, Bun, Next.js, Convex, Vitest, Playwright

---

### Task 1: Document the optional Convex workflow

**Files:**
- Modify: `SKILL.md`
- Modify: `references/essentials-checklist.md`

**Step 1: Write the failing documentation gap**

The skill currently has no optional Convex branch, no prompt requirement, and no Convex verification notes.

**Step 2: Implement minimal docs**

Add:
- an explicit ask-user step for Convex
- a `--with-convex` deterministic path
- references to Convex example files, tests, hooks, and coverage thresholds

### Task 2: Extend the apply script for optional Convex setup

**Files:**
- Modify: `scripts/apply-templates.sh`

**Step 1: Add flag handling**

Support `--with-convex`.

**Step 2: Add conditional template copying**

When enabled, copy Convex templates and example hooks.

**Step 3: Add conditional dependency installation**

Install Convex packages and keep non-Convex setup unchanged by default.

### Task 3: Add Convex templates and tests

**Files:**
- Create: `assets/templates/convex/schema.ts`
- Create: `assets/templates/convex/queries.ts`
- Create: `assets/templates/convex/mutations.ts`
- Create: `assets/templates/convex/actions.ts`
- Create: `assets/templates/convex/schema.test.ts`
- Create: `assets/templates/convex/queries.test.ts`
- Create: `assets/templates/convex/mutations.test.ts`
- Create: `assets/templates/convex/actions.test.ts`
- Create: `assets/templates/src/hooks/convex/use-example-query.ts`
- Create: `assets/templates/src/hooks/convex/use-example-mutation.ts`
- Create: `assets/templates/src/hooks/convex/use-example-action.ts`

**Step 1: Add minimal but realistic examples**

Backend examples should show schema, query, mutation, and action patterns. Hooks should demonstrate `useQuery`, `useMutation`, and `useAction`.

**Step 2: Add tests**

Use Convex-oriented tests that fit a root Vitest config and make the examples executable.

### Task 4: Make Vitest Convex-aware with coverage thresholds

**Files:**
- Modify: `assets/templates/vitest.config.ts`

**Step 1: Add Convex-aware environment matching**

Configure Convex tests to run with the environment expected by Convex tooling while preserving `jsdom` for Next.js tests.

**Step 2: Add separate coverage thresholds**

Keep the existing app thresholds and add Convex thresholds so the skill enforces coverage for optional Convex tests as well.

### Task 5: Verify

**Files:**
- Verify: `scripts/apply-templates.sh`
- Verify: `assets/templates/vitest.config.ts`

**Step 1: Run shell syntax validation**

Run: `bash -n scripts/apply-templates.sh`

**Step 2: Read back docs and key templates**

Confirm the optional Convex path, files, and coverage thresholds are documented consistently.
