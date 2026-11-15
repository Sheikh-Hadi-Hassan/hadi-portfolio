#!/usr/bin/env bash
set -euo pipefail

# Publish the nine ORIGINAL Consumer Connect screenshots already installed in the project.
# This script never stages generated files, source edits, or unrelated local changes.
repo="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$repo" ]]; then
  echo "Run this from inside the hadi-portfolio-final Git repository." >&2
  exit 1
fi
cd "$repo"
expected="feature/expertise-portfolios-20261113"
current="$(git branch --show-current)"
if [[ "$current" != "$expected" ]]; then
  echo "Please switch to $expected first; current branch: $current" >&2
  exit 1
fi
files=()
for suffix in 01-home 02-projects 03-sections 04-choice 05-written 06-emotion 07-preferences 08-rating 09-community; do
  file="public/assets/expertise/consumer-connect-$suffix.webp"
  if [[ ! -s "$file" ]]; then
    echo "Missing original screenshot: $file" >&2
    exit 1
  fi
  files+=("$file")
done
if [[ -n "$(git diff --cached --name-only)" ]]; then
  echo "You already have staged changes. Commit or unstage them before running this script." >&2
  exit 1
fi

git fetch origin "$expected"
git merge-base --is-ancestor "origin/$expected" HEAD || {
  echo "Your branch is behind GitHub. First run: git pull --ff-only" >&2
  exit 1
}
git add -f -- "${files[@]}"
git commit -m "Add nine original Consumer Connect screens for phone stack" -- "${files[@]}"
git push origin HEAD:"$expected"
echo "Success: nine original screenshots committed and pushed. Restart npm run dev."
