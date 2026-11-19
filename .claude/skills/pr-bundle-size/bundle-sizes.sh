#!/usr/bin/env bash
# Measure and compare the bundle sizes of bpmn-visualization between two git refs.
#
# Commands:
#   measure <ref> <work-dir> <out.csv>
#       Check out <ref> in a temporary git worktree under <work-dir>, install the locked dependencies, build the npm
#       bundles and the demo, then write the sizes in bytes to <out.csv> (one "<name>,<bytes>" line per bundle).
#       The worktree is removed at the end.
#   table <label-a> <a.csv> <label-b> <b.csv>
#       Print a markdown table comparing two measurements: sizes in kB (1000 bytes), delta in kB and in %.
#   toolchain <ref-a> <ref-b>
#       Print the toolchain entries (Node, bundlers, minifier, compiler) that differ between two refs.
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"

NPM_BUNDLES=(
  "IIFE minified:dist/bpmn-visualization.min.js"
  "IIFE raw:dist/bpmn-visualization.js"
  "ESM:dist/bpmn-visualization.esm.js"
)
DEMO_ASSETS_DIR="build/demo/dev/public/assets"
TOOLCHAIN_PACKAGES=(rollup @rollup/plugin-commonjs @rollup/plugin-node-resolve @rollup/plugin-terser rollup-plugin-typescript2 vite typescript esbuild)

load_nvm() {
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  # shellcheck disable=SC1091
  [[ -s "$NVM_DIR/nvm.sh" ]] && source "$NVM_DIR/nvm.sh"
}

measure() {
  local ref="$1" work_dir="$2" out_csv="$3"
  local sha checkout
  sha="$(git -C "$REPO_ROOT" rev-parse --verify "$ref^{commit}")"
  checkout="$work_dir/checkout-${sha:0:9}"
  mkdir -p "$work_dir"
  out_csv="$(realpath -m "$out_csv")"

  local lock_report="${out_csv%.csv}.lock-changes.txt"
  rm -f "$lock_report"

  git -C "$REPO_ROOT" worktree add --detach "$checkout" "$sha" >&2
  # EXIT and not RETURN: a failing build exits the script through `set -e`, and the worktree must go anyway. The paths
  # are expanded now: the trap runs after this function returned, when its local variables no longer exist.
  # shellcheck disable=SC2064
  trap "git -C '$REPO_ROOT' worktree remove --force '$checkout' >&2 || true" EXIT

  (
    cd "$checkout"
    load_nvm
    nvm use >&2
    # npm ci refuses a lock file out of sync with package.json. npm install fixes the lock instead, so record what it
    # changed: the measurement then uses these versions, not exactly the committed lock.
    if ! npm ci --no-audit --no-fund >&2; then
      echo "npm ci failed, falling back to npm install" >&2
      npm install --no-audit --no-fund >&2
      git show HEAD:package-lock.json > ../committed-lock.json
      node -e '
        const fs = require("fs");
        const read = f => JSON.parse(fs.readFileSync(f, "utf8")).packages;
        const before = read(process.argv[1]), after = read(process.argv[2]);
        for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
          const vb = before[key]?.version, va = after[key]?.version;
          if (key && vb !== va) console.log(`${key.replace(/^node_modules\//, "")}: ${vb ?? "absent"} -> ${va ?? "absent"}`);
        }' ../committed-lock.json package-lock.json > "$lock_report"
      echo "package-lock.json changed by npm install, see $lock_report" >&2
    fi
    npm run build-bundles >&2
    npm run demo:build >&2

    : > "$out_csv"
    local entry name file
    for entry in "${NPM_BUNDLES[@]}"; do
      name="${entry%%:*}"
      file="${entry#*:}"
      echo "$name,$(stat --format=%s "$file")" >> "$out_csv"
    done
    for file in "$DEMO_ASSETS_DIR"/lib-*.js; do
      [[ -f "$file" ]] || continue
      name="$(basename "$file" .js | sed 's/^lib-//')"
      # mxGraph and maxGraph fill the same role: compare them on a single row
      [[ "$name" = "mxgraph" || "$name" = "maxgraph" ]] && name="mxgraph / maxgraph"
      name="Demo chunk $name"
      echo "$name,$(stat --format=%s "$file")" >> "$out_csv"
    done
  )
  echo "Sizes of $ref (${sha:0:9}) written to $out_csv" >&2
}

table() {
  local label_a="$1" csv_a="$2" label_b="$3" csv_b="$4"
  LC_NUMERIC=C awk -F, -v la="$label_a" -v lb="$label_b" '
    function kb(bytes) { return sprintf("%.2f", bytes / 1000) }
    FNR == NR { a[$1] = $2; if (!($1 in seen)) { seen[$1] = 1; order[++n] = $1 }; next }
    { b[$1] = $2; if (!($1 in seen)) { seen[$1] = 1; order[++n] = $1 } }
    END {
      printf "| Bundle | %s | %s | Δ kB | Δ %% |\n", la, lb
      print "|---|---:|---:|---:|---:|"
      for (i = 1; i <= n; i++) {
        k = order[i]
        if (!(k in a) || !(k in b)) {
          printf "| %s | %s | %s | N/A | N/A |\n", k, (k in a) ? kb(a[k]) : "N/A", (k in b) ? kb(b[k]) : "N/A"
          continue
        }
        d = b[k] - a[k]
        printf "| %s | %s | %s | %+.2f | %+.2f%% |\n", k, kb(a[k]), kb(b[k]), d / 1000, (a[k] ? 100 * d / a[k] : 0)
      }
    }' "$csv_a" "$csv_b"
}

toolchain() {
  local ref_a="$1" ref_b="$2" node_a node_b pkg va vb
  node_a="$(git -C "$REPO_ROOT" show "$ref_a:.nvmrc" 2>/dev/null || echo '?')"
  node_b="$(git -C "$REPO_ROOT" show "$ref_b:.nvmrc" 2>/dev/null || echo '?')"
  [[ "$node_a" != "$node_b" ]] && echo "node (.nvmrc): $node_a -> $node_b"
  for pkg in "${TOOLCHAIN_PACKAGES[@]}"; do
    va="$(locked_version "$ref_a" "$pkg")"
    vb="$(locked_version "$ref_b" "$pkg")"
    [[ "$va" != "$vb" ]] && echo "$pkg: ${va:-absent} -> ${vb:-absent}"
  done
  return 0
}

locked_version() {
  git -C "$REPO_ROOT" show "$1:package-lock.json" |
    node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const p=JSON.parse(s).packages["node_modules/"+process.argv[1]];console.log(p?p.version:"")})' "$2"
}

case "${1:-}" in
  measure) shift; measure "$@" ;;
  table) shift; table "$@" ;;
  toolchain) shift; toolchain "$@" ;;
  *) sed -n '2,14p' "$0"; exit 1 ;;
esac
