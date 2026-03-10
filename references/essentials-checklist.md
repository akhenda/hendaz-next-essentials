# Hendaz Next Essentials Checklist

1. Ensure the project uses `src/` layout; if source directories are still at the root, move them into `src/` first.
2. Ensure Bun is package manager and `bunfig.toml` exists.
3. Install commit tooling: `commitizen`, `commitlint`, `cz-git`, `.commitsage`, `.commitlintrc.mjs`.
4. Install Biome + Ultracite and remove ESLint configs when present.
5. Install Lefthook + lint-staged and remove Husky when present.
6. Install and configure Vitest + Playwright for unit and e2e testing.
7. Upsert `package.json` scripts and `config.commitizen.path = "cz-git"`.
8. Add project files: `.markdownlint.json`, `lefthook.yml`, `.lintstagedrc.cjs`, `playwright.config.ts`, `vitest.config.ts`.
9. Add editor files under `.vscode/`.
10. Add shared types under `src/types/` and logger under `src/utils/logger/`.
11. Add an initial e2e smoke test under `tests/e2e/`.
12. Run `bun install` and `bunx playwright install` at the end.

Use `scripts/apply-templates.sh <project-path>` to apply all templates and installs in one pass.
