# Hendaz Next Essentials Checklist

1. Ensure the project uses `src/` layout; if source directories are still at the root, move them into `src/` first.
2. Ensure Bun is package manager and `bunfig.toml` exists.
3. Install commit tooling: `commitizen`, `commitlint`, `cz-git`, `.commitsage`, `.commitlintrc.mjs`.
4. Install Biome + Ultracite and remove ESLint configs when present.
5. Install Lefthook + lint-staged and remove Husky when present.
6. Add project files: `.markdownlint.json`, `lefthook.yml`, `.lintstagedrc.cjs`.
7. Add editor files under `.vscode/`.
8. Add shared types under `src/types/` and logger under `src/utils/logger/`.
9. Run `bun install` at the end to refresh lockfile.

Use `scripts/apply-templates.sh <project-path>` to apply all templates and installs in one pass.
