# Hendaz Next Essentials Checklist

1. Ensure the project uses `src/` layout; if source directories are still at the root, move them into `src/` first.
2. Ask whether Convex should also be set up; if yes, use the `--with-convex` path.
3. Ensure Bun is package manager and `bunfig.toml` exists.
4. Install commit tooling: `commitizen`, `commitlint`, `cz-git`, `.commitsage`, `.commitlintrc.mjs`.
5. Install Biome + Ultracite and remove ESLint configs when present.
6. Install and configure Vitest + Playwright for unit and e2e testing, using one root Vitest config with projects and coverage thresholds of 95/95/90/95 for statements/functions/branches/lines.
7. Upsert `package.json` scripts and `config.commitizen.path = "cz-git"`.
8. Add project files: `.gitignore`, `.markdownlint.json`, `lefthook.yml`, `.lintstagedrc.cjs`, `playwright.config.ts`, `vitest.config.ts`.
9. Add editor files under `.vscode/`.
10. Add shared types under `src/types/` and logger under `src/utils/logger/`.
11. Add the API foundation under `src/modules/core/api`, including Axios config, React Query setup, countries resource examples, and the base `APIProvider`.
12. Add an initial e2e smoke test under `tests/e2e/`.
13. If Convex is enabled, add `convex/` example backend files, `src/modules/core/api/convex/`, Convex-backed `settings` and `users` resources, preferred cached/status Convex hooks, and Convex-specific dependencies while keeping the single root Vitest config.
14. Run `bun install` and `bunx playwright install` at the end.

Use `scripts/apply-templates.sh <project-path>` to apply all templates and installs in one pass.
