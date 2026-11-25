#!/usr/bin/env bash
# Apply ONLY PR #19 gallery changes to existing Mac worktree. No clone, checkout, reset or stash.
set -euo pipefail
BASE="b497cb6537950600768531f89a7998eb5a2203ba"
FEATURE="feature/p0-dynamic-gallery-admin-categories-20261125"
MODE="--check"
if [[ "$#" -ge 1 ]];then MODE="$1";fi
if [[ "$MODE" != "--check" && "$MODE" != "--apply" ]];then echo "Usage: $0 [--check|--apply]" >&2;exit 2;fi
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
case "$(git remote get-url origin)" in *Sheikh-Hadi-Hassan/hadi-portfolio*) ;; *) echo "STOP: wrong origin" >&2;exit 3;; esac
echo "Existing repo: $ROOT";git status --short
echo "Port 3003 listener:";lsof -nP -iTCP:3003 -sTCP:LISTEN || true
git fetch --no-tags origin "$FEATURE"
SHA="$(git rev-parse FETCH_HEAD)"
git cat-file -e "$BASE^{commit}" || { echo "STOP: V5.4 base SHA missing" >&2;exit 3; }
PATCH="/tmp/hadi-gallery-pr19-$(git rev-parse --short=12 FETCH_HEAD).patch"
git diff --binary "$BASE" "$SHA" > "$PATCH"
echo "Incoming:";git diff --name-status "$BASE" "$SHA"
while IFS= read -r -d '' file;do
 if ! git diff --quiet -- "$file" || ! git diff --cached --quiet -- "$file";then echo "STOP: overlapping tracked edits in $file" >&2;exit 4;fi
 if [[ -n "$(git ls-files --others --exclude-standard -- "$file")" ]];then echo "STOP: untracked file collision in $file" >&2;exit 4;fi
done < <(git diff --name-only -z "$BASE" "$SHA")
if ! git apply --check "$PATCH";then echo "STOP: incompatible local baseline. Reconcile with Codex, do not force-reset." >&2;exit 5;fi
echo "Safe patch: $PATCH"
if [[ "$MODE" == "--check" ]];then echo "Dry run only; apply using --apply";exit 0;fi
git apply "$PATCH"
echo "Applied uncommitted changes; original local edits untouched."
echo "Rollback before further edits: git apply --reverse --check '$PATCH' && git apply --reverse '$PATCH'"
