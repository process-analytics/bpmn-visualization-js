#!/usr/bin/env bash
# List library chunks from the demo build output with their sizes.
# Outputs a plain list and a markdown table for tracking size evolution in PRs, issues, or release notes.
# Usage: list-lib-chunks.sh [--md-simple]
#   --md-simple  Output a simple markdown table (Dependency | Size)
set -euo pipefail

MD_SIMPLE=false
if [[ "${1:-}" = "--md-simple" ]]; then
  MD_SIMPLE=true
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEMO_ASSETS_DIR="${SCRIPT_DIR}/../build/demo/dev/public/assets"

if [[ ! -d "$DEMO_ASSETS_DIR" ]]; then
  echo "Error: demo assets directory not found. Run 'npm run demo:build." >&2
  exit 1
fi

# Collect lib chunks with their size in KB
declare -a names=()
declare -a sizes=()

for file in "$DEMO_ASSETS_DIR"/lib-*.js; do
  [[ -f "$file" ]] || continue
  filename=$(basename "$file")
  # Extract dependency name: lib-<name>.js -> <name>
  dep_name=$(echo "$filename" | sed 's/^lib-//;s/\.js$//')
  size_kb=$(LC_NUMERIC=C awk "BEGIN {printf \"%.2f\", $(stat --format=%s "$file") / 1000}")
  names+=("$dep_name")
  sizes+=("$size_kb")
done

if [[ ${#names[@]} -eq 0 ]]; then
  echo "No lib-*.js chunks found in dist/assets." >&2
  exit 1
fi

# Compute total
total=$(LC_NUMERIC=C awk "BEGIN {t=0; $(for s in "${sizes[@]}"; do printf "t+=%s;" "$s"; done) printf \"%.2f\", t}")

if [[ "$MD_SIMPLE" = true ]]; then
  # Simple markdown table
  echo "| Dependency | Size |"
  echo "|---|---|"
  for i in "${!names[@]}"; do
    echo "| ${names[$i]} | ${sizes[$i]} kB |"
  done
  echo "| **TOTAL** | **${total} kB** |"
else
  # Plain list
  echo "=== Lib chunks ==="
  for i in "${!names[@]}"; do
    printf "%-25s %s kB\n" "${names[$i]}" "${sizes[$i]}"
  done
  printf "%-25s %s kB\n" "TOTAL" "$total"
  echo ""
  # Markdown table for tracking size evolution
  echo "=== Markdown table ==="
  echo "| Dependency | Before | Current |"
  echo "|---|---|---|"
  for i in "${!names[@]}"; do
    echo "| ${names[$i]} | | ${sizes[$i]} kB |"
  done
  echo "| **TOTAL** | | **${total} kB** |"
fi
