#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-$PWD}"
if [[ ! -d "$TARGET_DIR" ]]; then
  echo "Target directory does not exist: $TARGET_DIR" >&2
  exit 1
fi

find "$TARGET_DIR" -type f \( -name 'AGENTS.md' -o -name 'CLAUDE.md' \) | sort
