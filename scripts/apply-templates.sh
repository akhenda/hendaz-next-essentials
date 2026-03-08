#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE_ROOT="$SKILL_ROOT/assets/templates"
TARGET_DIR="${1:-$PWD}"

if [[ ! -d "$TARGET_DIR" ]]; then
  echo "Target directory does not exist: $TARGET_DIR" >&2
  exit 1
fi

copy_file() {
  local rel="$1"
  mkdir -p "$TARGET_DIR/$(dirname "$rel")"
  cp "$TEMPLATE_ROOT/$rel" "$TARGET_DIR/$rel"
  echo "Applied: $rel"
}

copy_file ".commitsage"
copy_file ".commitlintrc.mjs"
copy_file "lefthook.yml"
copy_file ".markdownlint.json"
copy_file "bunfig.toml"
copy_file "biome.jsonc"
copy_file ".lintstagedrc.cjs"
copy_file ".vscode/extensions.json"
copy_file ".vscode/settings.json"
copy_file ".vscode/tailwind.json"
copy_file "src/types/common.ts"
copy_file "src/types/components.ts"
copy_file "src/types/domain.ts"
copy_file "src/types/helpers.ts"
copy_file "src/types/navigation.ts"
copy_file "src/types/index.ts"
copy_file "src/utils/logger/types.ts"
copy_file "src/utils/logger/index.ts"

"$SCRIPT_DIR/enforce-agent-instructions.sh" "$TARGET_DIR"

rm -f "$TARGET_DIR/.eslintrc" "$TARGET_DIR/.eslintrc.js" "$TARGET_DIR/.eslintrc.cjs" \
  "$TARGET_DIR/.eslintrc.json" "$TARGET_DIR/eslint.config.js" "$TARGET_DIR/eslint.config.mjs"
rm -rf "$TARGET_DIR/.husky"

echo "Installing dependencies with Bun..."
(
  cd "$TARGET_DIR"

  if [[ -f package.json ]]; then
    BUN_VERSION="$(bun --version)"
    node -e "
const fs = require('fs');
const p = 'package.json';
const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
if (!pkg.packageManager || !String(pkg.packageManager).startsWith('bun@')) {
  pkg.packageManager = 'bun@' + process.argv[1];
  fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + '\\n');
  console.log('Set packageManager to', pkg.packageManager);
}
" "$BUN_VERSION"
  fi

  bun remove husky eslint eslint-config-next @typescript-eslint/eslint-plugin @typescript-eslint/parser \
    eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-import >/dev/null 2>&1 || true

  bun add -d \
    @biomejs/biome \
    @commitlint/cli \
    @commitlint/config-conventional \
    commitizen \
    cz-git \
    lefthook \
    lint-staged \
    ultracite

  bun add \
    @logtail/next \
    @sentry/nextjs \
    consola \
    sonner

  bun install
  bunx lefthook install
)

echo "Done. Templates applied, AGENTS/CLAUDE rules enforced, husky/eslint removed, Bun deps installed."
