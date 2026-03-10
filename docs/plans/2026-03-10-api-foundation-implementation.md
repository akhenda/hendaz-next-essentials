# API Foundation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update the skill to scaffold a reusable API foundation under `src/modules/core/api`, including React Query, Axios, provider composition, example resources, and optional Convex integration.

**Architecture:** The skill will always scaffold the base API layer for third-party APIs. Convex remains optional and extends the same foundation rather than living in an unrelated hook directory. The script remains deterministic and controlled by `--with-convex`.

**Tech Stack:** Next.js, Axios, TanStack Query, Convex, Vitest, Bash, Bun

---

### Task 1: Update docs to describe the new API foundation

**Files:**
- Modify: `/Users/hendaz/.codex/skills/hendaz-next-essentials/SKILL.md`
- Modify: `/Users/hendaz/.codex/skills/hendaz-next-essentials/references/essentials-checklist.md`

### Task 2: Add API foundation templates

**Files:**
- Create templates under `/Users/hendaz/.codex/skills/hendaz-next-essentials/assets/templates/src/modules/core/api`
- Remove deprecated template usage under `/Users/hendaz/.codex/skills/hendaz-next-essentials/assets/templates/src/hooks/convex`

### Task 3: Update apply script and package setup

**Files:**
- Modify: `/Users/hendaz/.codex/skills/hendaz-next-essentials/scripts/apply-templates.sh`

### Task 4: Keep unified Vitest coverage and Convex support aligned

**Files:**
- Modify: `/Users/hendaz/.codex/skills/hendaz-next-essentials/assets/templates/vitest.config.ts`

### Task 5: Verify script and template consistency

**Files:**
- Verify: `/Users/hendaz/.codex/skills/hendaz-next-essentials/scripts/apply-templates.sh`
- Verify key templates and docs by readback
