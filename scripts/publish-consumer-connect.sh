#!/usr/bin/env bash
# Publish the nine original Consumer Connect screens, and nothing else.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
EXPECTED="feature/expertise-portfolios-20261113"
ACTUAL="$(git branch --show-current)"
if [[ "$ACTUAL" != "$EXPECTED" ]]; then
  printf 'Expected branch %s, found %s. No changes made.\n' "$EXPECTED" "$ACTUAL" >&2
  exit 1
fi
DIR="public/assets/expertise"
FILES=(
 consumer-connect-01-home.webp
 consumer-connect-02-projects.webp
 consumer-connect-03-sections.webp
 consumer-connect-04-choice.webp
 consumer-connect-05-written.webp
 consumer-connect-06-emotion.webp
 consumer-connect-07-preferences.webp
 consumer-connect-08-rating.webp
 consumer-connect-09-community.webp
)
for name in "${FILES[@]}"; do
  if [[ ! -s "$DIR/$name" ]]; then
    printf 'Missing original screenshot: %s/%s\n' "$DIR" "$name" >&2
    exit 1
  fi
done
# Do not accidentally include generated assets, local CSS, scripts, or unrelated edits.
for name in "${FILES[@]}"; do git add -- "$DIR/$name"; done
if git diff --cached --quiet; then
 printf 'All nine original images are already committed.\n'
else
 git commit -m "Add nine original Consumer Connect mobile screenshots"
fi
git push origin "$EXPECTED"
printf 'Verified all 9 original screenshots and pushed the feature branch.\n'
