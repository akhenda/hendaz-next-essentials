# Hendaz Next Essentials Checklist

1. Ensure Bun is package manager and `bunfig.toml` exists.
2. Install commit tooling: `commitizen`, `commitlint`, `cz-git`, `.commitsage`, `.commitlintrc.mjs`.
3. Install Biome + Ultracite and remove ESLint configs when present.
4. Install Lefthook + lint-staged and remove Husky when present.
5. Add project files: `.markdownlint.json`, `lefthook.yml`, `.lintstagedrc.cjs`.
6. Add editor files under `.vscode/`.
7. Add shared types under `src/types/` and logger under `src/utils/logger/`.
8. Run `bun install` at the end to refresh lockfile.

Use `scripts/apply-templates.sh <project-path>` to apply all templates and installs in one pass.
