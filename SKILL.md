---
name: hendaz-next-essentials
description: "Scaffold a newly created Next.js project with Hendaz defaults: commitizen + commitlint + cz-git, .commitsage, markdownlint config, bunfig.toml, Biome + Ultracite (and ESLint removal), lefthook + lint-staged (and Husky removal), VS Code workspace files, shared src/types utilities, and a production-ready logger. Use when a user asks to bootstrap, standardize, or initialize a Next.js project with these recurring essentials."
---

# Hendaz Next Essentials

## Workflow

1. Confirm target directory is a Next.js project root and normalize it to `src/` layout if it is still using root-level source directories.
2. Run `scripts/apply-templates.sh [--no-overwrite] [--backup] <project-path>` from this skill.
3. Verify created files, removed files, and any moved source directories now live under `src/`.
4. Verify root `AGENTS.md`/`CLAUDE.md` include enforced strict rules block.
5. Run quality checks (`bun run lint`, `bun run typecheck`) when available.

## Agent Instruction Enforcement

This skill must update project instruction files with strict rules.

- It checks only root-level instruction files:
  - `<project-root>/AGENTS.md`
  - `<project-root>/CLAUDE.md`
- It upserts a managed block into each file with these rules:
  - prohibit `any`
  - allow `AnyType` or `AnyValue` only sparingly, and only when imported from `src/types/common`
  - stop and ask if typing intent is unclear
  - prohibit `console.*`
  - require custom logger usage
- If neither file exists, it creates `<project-root>/AGENTS.md` with the managed block.

Managed by script:

```bash
/Users/hendaz/.codex/skills/hendaz-next-essentials/scripts/enforce-agent-instructions.sh /path/to/project
```

## Apply Script

Use the script for deterministic setup:

```bash
/Users/hendaz/.codex/skills/hendaz-next-essentials/scripts/apply-templates.sh [--no-overwrite] [--backup] /path/to/project
```

Options:

- `--no-overwrite`: skip files that already exist.
- `--backup`: create timestamped backups before overwriting existing files.

The script will:

1. Ensure the project uses `src/` layout. If root-level Next.js source directories/files such as `app`, `pages`, `components`, `lib`, `utils`, `hooks`, `styles`, `types`, `middleware.ts`, or `instrumentation.ts` exist and `src/` does not, the script moves them into `src/` first.
2. Copy templates from `assets/templates` into the target project.
3. Enforce strict rules in root `AGENTS.md`/`CLAUDE.md`.
4. Remove ESLint config files if present.
5. Remove `.husky/` if present.
6. Install all required packages with Bun.
7. Run `bun install` to refresh lockfile state.

## Templates Included

- Root configs: `.commitsage`, `.commitlintrc.mjs`, `lefthook.yml`, `.markdownlint.json`, `.lintstagedrc.cjs`, `bunfig.toml`, `biome.jsonc`
- Editor configs: `.vscode/extensions.json`, `.vscode/settings.json`, `.vscode/tailwind.json`
- Types: `src/types/common.ts`, `src/types/components.ts`, `src/types/domain.ts`, `src/types/helpers.ts`, `src/types/navigation.ts`, `src/types/index.ts`
- Logger: `src/utils/logger/index.ts`, `src/utils/logger/types.ts`

## Package Installation Rules

Use Bun only.

Dev dependencies installed by the script:

- `@biomejs/biome`
- `@commitlint/cli`
- `@commitlint/config-conventional`
- `commitizen`
- `cz-git`
- `lefthook`
- `lint-staged`
- `ultracite`

Runtime dependencies installed by the script:

- `@logtail/next`
- `@sentry/nextjs`
- `consola`
- `sonner`

## Notes

- The user corrected lockfile intent to `bunfig.toml`; do not add lockfile-specific templates.
- If template updates are requested, update files in `assets/templates/` first, then re-run the apply script.
- A provided template labeled as `src/types/common.ts` (barrel exports) is intentionally stored as `src/types/index.ts`.
- The `src/` normalization step runs before template copying so all generated Hendaz defaults land in a consistent Next.js source layout.
