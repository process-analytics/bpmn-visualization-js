#!/usr/bin/env bash
# List npm package bundles from dist/ with their sizes (bytes and kB).
# Outputs a plain list and a markdown table for tracking size evolution in PRs, issues, or release notes.
# Usage: list-npm-bundle-sizes.sh [--md-simple]
#   --md-simple  Output a simple markdown table (Bundle | Size)
set -euo pipefail

MD_SIMPLE=false
if [[ "${1:-}" = "--md-simple" ]]; then
  MD_SIMPLE=true
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_DIR="${SCRIPT_DIR}/../dist"

if [[ ! -d "$DIST_DIR" ]]; then
  echo "Error: dist directory not found. Run 'npm run build-bundles' first." >&2
  exit 1
fi

BUNDLES=(
  "bpmn-visualization.min.js"
  "bpmn-visualization.js"
  "bpmn-visualization.esm.js"
)

declare -a names=()
declare -a bytes=()
declare -a kb=()

for bundle in "${BUNDLES[@]}"; do
  file="$DIST_DIR/$bundle"
  if [[ ! -f "$file" ]]; then
    echo "Error: bundle not found: $file. Run 'npm run build-bundles' first." >&2
    exit 1
  fi
  size_bytes=$(stat --format=%s "$file")
  size_kb=$(LC_NUMERIC=C awk "BEGIN {printf \"%.1f\", $size_bytes / 1024}")
  # Format bytes with space as thousands separator (e.g. 998629 -> "998 629")
  size_bytes_fmt=$(echo "$size_bytes" | sed ':a;s/\B[0-9]\{3\}\>/ &/;ta')
  names+=("$bundle")
  bytes+=("$size_bytes_fmt")
  kb+=("$size_kb")
done

if [[ "$MD_SIMPLE" = true ]]; then
  echo "| Bundle | Size |"
  echo "|---|---|"
  for i in "${!names[@]}"; do
    echo "| ${names[$i]} | ${kb[$i]} kB |"
  done
else
  echo "=== NPM package bundles ==="
  for i in "${!names[@]}"; do
    printf "%-30s %12s bytes  %8s kB\n" "${names[$i]}" "${bytes[$i]}" "${kb[$i]}"
  done
  echo ""
  echo "=== Markdown table ==="
  echo "| bundle | before | now |"
  echo "|---|---|---|"
  for i in "${!names[@]}"; do
    echo "| ${names[$i]} | | ${bytes[$i]} bytes |"
    echo "| | | ${kb[$i]} kB |"
  done
fi
