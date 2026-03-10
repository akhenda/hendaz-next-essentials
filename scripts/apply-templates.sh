#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TEMPLATE_ROOT="$SKILL_ROOT/assets/templates"

OVERWRITE=true
BACKUP=false
WITH_CONVEX=false
TARGET_DIR=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-overwrite)
      OVERWRITE=false
      shift
      ;;
    --backup)
      BACKUP=true
      shift
      ;;
    --with-convex)
      WITH_CONVEX=true
      shift
      ;;
    -h|--help)
      echo "Usage: $(basename "$0") [--no-overwrite] [--backup] [--with-convex] [target-dir]"
      exit 0
      ;;
    *)
      if [[ -n "$TARGET_DIR" ]]; then
        echo "Unexpected argument: $1" >&2
        exit 1
      fi
      TARGET_DIR="$1"
      shift
      ;;
  esac
done

TARGET_DIR="${TARGET_DIR:-$PWD}"

if [[ ! -d "$TARGET_DIR" ]]; then
  echo "Target directory does not exist: $TARGET_DIR" >&2
  exit 1
fi

ensure_src_layout() {
  local src_dir="$TARGET_DIR/src"
  local moved_any=false
  local candidate=""
  local -a move_targets=(
    "app"
    "pages"
    "components"
    "lib"
    "utils"
    "hooks"
    "styles"
    "types"
    "middleware.ts"
    "instrumentation.ts"
  )

  if [[ -d "$src_dir" ]]; then
    echo "Using existing src/ directory."
    return
  fi

  for candidate in "${move_targets[@]}"; do
    if [[ -e "$TARGET_DIR/$candidate" ]]; then
      moved_any=true
      break
    fi
  done

  if [[ "$moved_any" == false ]]; then
    echo "No root-level Next.js source directories found. Creating src/ for skill templates."
    mkdir -p "$src_dir"
    return
  fi

  mkdir -p "$src_dir"

  for candidate in "${move_targets[@]}"; do
    if [[ -e "$TARGET_DIR/$candidate" ]]; then
      mv "$TARGET_DIR/$candidate" "$src_dir/$candidate"
      echo "Moved into src/: $candidate"
    fi
  done
}

backup_file() {
  local dest="$1"
  if [[ "$BACKUP" == true && -f "$dest" ]]; then
    local stamp
    stamp="$(date +%Y%m%d%H%M%S)"
    cp "$dest" "${dest}.bak.${stamp}"
    echo "Backed up: ${dest}.bak.${stamp}"
  fi
}

copy_file() {
  local rel="$1"
  local src="$TEMPLATE_ROOT/$rel"
  local dest="$TARGET_DIR/$rel"

  mkdir -p "$(dirname "$dest")"

  if [[ -f "$dest" && "$OVERWRITE" == false ]]; then
    echo "Skipped (exists): $rel"
    return
  fi

  backup_file "$dest"
  cp "$src" "$dest"
  echo "Applied: $rel"
}

copy_file_as() {
  local src_rel="$1"
  local dest_rel="$2"
  local src="$TEMPLATE_ROOT/$src_rel"
  local dest="$TARGET_DIR/$dest_rel"

  mkdir -p "$(dirname "$dest")"

  if [[ -f "$dest" && "$OVERWRITE" == false ]]; then
    echo "Skipped (exists): $dest_rel"
    return
  fi

  backup_file "$dest"
  cp "$src" "$dest"
  echo "Applied: $dest_rel"
}

upsert_package_json() {
  local package_json="$TARGET_DIR/package.json"

  if [[ ! -f "$package_json" ]]; then
    echo "No package.json found. Skipping package.json script/config enforcement."
    return
  fi

  node -e "
const fs = require('fs');
const packageJsonPath = process.argv[1];
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const bunVersion = process.argv[2];

pkg.packageManager = 'bun@' + bunVersion;

pkg.scripts = {
  ...(pkg.scripts ?? {}),
  lint: 'biome check . --error-on-warnings',
  format: 'biome check . --write',
  typecheck: 'tsc --noEmit',
  commit: 'git-cz',
  commitlint: 'commitlint --edit',
  prepare: 'lefthook install',
  test: 'bun run test:unit && bun run test:e2e',
  'test:unit': 'vitest run --coverage',
  'test:unit:watch': 'vitest',
  'test:e2e': 'playwright test --grep-invert @visual',
  'test:e2e:headed': 'playwright test --headed',
  'test:e2e:debug': 'playwright test --debug',
  'test:e2e:update': 'playwright test --update-snapshots',
  'test:e2e:visual': 'playwright test --grep @visual',
  validate: 'bun run format && bun run lint && bun run typecheck && bun run test',
};

pkg.config = {
  ...(pkg.config ?? {}),
  commitizen: {
    path: 'cz-git',
  },
};

fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\\n');
" "$package_json" "$(bun --version)"

  echo "Updated package.json scripts and cz-git config."
}

ensure_src_layout

copy_file ".commitsage"
copy_file ".commitlintrc.mjs"
copy_file ".gitignore"
copy_file "lefthook.yml"
copy_file ".markdownlint.json"
copy_file "bunfig.toml"
copy_file "biome.jsonc"
copy_file ".lintstagedrc.cjs"
copy_file ".vscode/extensions.json"
copy_file ".vscode/settings.json"
copy_file ".vscode/tailwind.json"
copy_file "playwright.config.ts"
copy_file "vitest.config.ts"
copy_file "src/types/common.ts"
copy_file "src/types/components.ts"
copy_file "src/types/domain.ts"
copy_file "src/types/helpers.ts"
copy_file "src/types/navigation.ts"
copy_file "src/types/index.ts"
copy_file "src/utils/logger/types.ts"
copy_file "src/utils/logger/index.ts"
copy_file "src/modules/core/api/config/axios.ts"
copy_file "src/modules/core/api/config/client.ts"
copy_file "src/modules/core/api/config/index.ts"
copy_file "src/modules/core/api/react-query/client.ts"
copy_file "src/modules/core/api/react-query/provider.tsx"
copy_file "src/modules/core/api/react-query/index.ts"
copy_file "src/modules/core/api/resources/countries/endpoints/README.md"
copy_file "src/modules/core/api/resources/countries/endpoints/africa.ts"
copy_file "src/modules/core/api/resources/countries/endpoints/index.ts"
copy_file "src/modules/core/api/resources/countries/endpoints/types.ts"
copy_file "src/modules/core/api/resources/countries/hooks/index.ts"
copy_file "src/modules/core/api/resources/countries/index.ts"
copy_file "src/modules/core/api/resources/countries/utils.ts"
copy_file "src/modules/core/api/resources/index.ts"
copy_file "src/modules/core/api/provider.tsx"
copy_file "src/modules/core/api/index.ts"
copy_file "src/modules/core/api/config/axios.test.ts"
copy_file "src/modules/core/api/react-query/client.test.ts"
copy_file "src/modules/core/api/provider.test.tsx"
copy_file "tests/e2e/home.spec.ts"

if [[ "$WITH_CONVEX" == true ]]; then
  copy_file_as "src/modules/core/api/provider.convex.tsx" "src/modules/core/api/provider.tsx"
  copy_file_as "src/modules/core/api/index.convex.ts" "src/modules/core/api/index.ts"
  copy_file_as "src/modules/core/api/resources/index.convex.ts" "src/modules/core/api/resources/index.ts"
  copy_file "src/modules/core/api/convex/index.ts"
  copy_file "src/modules/core/api/convex/provider.tsx"
  copy_file "src/modules/core/api/resources/settings/types.ts"
  copy_file "src/modules/core/api/resources/settings/utils.ts"
  copy_file "src/modules/core/api/resources/settings/hooks/index.ts"
  copy_file "src/modules/core/api/resources/settings/index.ts"
  copy_file "src/modules/core/api/resources/users/types.ts"
  copy_file "src/modules/core/api/resources/users/utils.ts"
  copy_file "src/modules/core/api/resources/users/hooks/index.ts"
  copy_file "src/modules/core/api/resources/users/index.ts"
  copy_file "convex/test.setup.ts"
  copy_file "convex/schema.ts"
  copy_file "convex/queries.ts"
  copy_file "convex/mutations.ts"
  copy_file "convex/actions.ts"
  copy_file "convex/schema.test.ts"
  copy_file "convex/queries.test.ts"
  copy_file "convex/mutations.test.ts"
  copy_file "convex/actions.test.ts"
fi

"$SCRIPT_DIR/enforce-agent-instructions.sh" "$TARGET_DIR"

rm -f "$TARGET_DIR/.eslintrc" "$TARGET_DIR/.eslintrc.js" "$TARGET_DIR/.eslintrc.cjs" \
  "$TARGET_DIR/.eslintrc.json" "$TARGET_DIR/eslint.config.js" "$TARGET_DIR/eslint.config.mjs"
rm -rf "$TARGET_DIR/.husky"

echo "Installing dependencies with Bun..."
(
  cd "$TARGET_DIR"

  upsert_package_json

  bun remove husky eslint eslint-config-next @typescript-eslint/eslint-plugin @typescript-eslint/parser \
    eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-import >/dev/null 2>&1 || true

  bun add -d \
    @testing-library/react \
    @playwright/test \
    @vitest/coverage-v8 \
    @biomejs/biome \
    @commitlint/cli \
    @commitlint/config-conventional \
    commitizen \
    cz-git \
    jsdom \
    lefthook \
    lint-staged \
    playwright \
    vitest \
    ultracite

  bun add \
    @tanstack/react-query \
    axios \
    @logtail/next \
    @sentry/nextjs \
    consola \
    sonner

  if [[ "$WITH_CONVEX" == true ]]; then
    bun add -d \
      @edge-runtime/vm \
      convex-test

    bun add convex
  fi

  bun install
  bunx lefthook install
  bunx playwright install
)

if [[ "$WITH_CONVEX" == true ]]; then
  echo "Done. src/ layout enforced, templates applied, Convex examples configured, package.json scripts configured, AGENTS/CLAUDE rules enforced, husky/eslint removed, Bun deps installed, and Playwright is configured."
else
  echo "Done. src/ layout enforced, templates applied, package.json scripts configured, AGENTS/CLAUDE rules enforced, husky/eslint removed, Bun deps installed, and Playwright is configured."
fi
