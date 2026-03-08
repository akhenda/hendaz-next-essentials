#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-$PWD}"
if [[ ! -d "$TARGET_DIR" ]]; then
  echo "Target directory does not exist: $TARGET_DIR" >&2
  exit 1
fi

START_MARKER="<!-- hendaz-next-essentials:strict-rules:start -->"
END_MARKER="<!-- hendaz-next-essentials:strict-rules:end -->"

read -r -d '' POLICY_BLOCK <<'BLOCK' || true
<!-- hendaz-next-essentials:strict-rules:start -->
## Hendaz Strict Type And Logging Rules

- Use of `any` type is prohibited.
- `AnyType` or `AnyValue` can be used only as a rare escape hatch and sparingly, and must be imported from `src/types/common`.
- Prefer precise type definitions at all times.
- If type intent is unclear, stop and ask the user clarifying questions before coding.
- Use of `console.*` is not allowed in application code.
- Use the project custom logger instead of `console.*`.
<!-- hendaz-next-essentials:strict-rules:end -->
BLOCK

mapfile -t instruction_files < <(find "$TARGET_DIR" -type f \( -name 'AGENTS.md' -o -name 'CLAUDE.md' \) | sort)

upsert_block() {
  local file="$1"
  local tmp
  tmp="$(mktemp)"

  if [[ -f "$file" ]]; then
    awk -v start="$START_MARKER" -v end="$END_MARKER" '
      BEGIN { skip = 0 }
      $0 == start { skip = 1; next }
      $0 == end { skip = 0; next }
      skip == 0 { print }
    ' "$file" > "$tmp"
  else
    : > "$tmp"
  fi

  if [[ -s "$tmp" ]]; then
    printf "\n%s\n" "$POLICY_BLOCK" >> "$tmp"
  else
    printf "%s\n" "$POLICY_BLOCK" > "$tmp"
  fi

  mv "$tmp" "$file"
  echo "Updated instructions: $file"
}

if [[ ${#instruction_files[@]} -eq 0 ]]; then
  fallback_file="$TARGET_DIR/AGENTS.md"
  upsert_block "$fallback_file"
  echo "No AGENTS.md/CLAUDE.md found. Created: $fallback_file"
  exit 0
fi

for file in "${instruction_files[@]}"; do
  upsert_block "$file"
done
