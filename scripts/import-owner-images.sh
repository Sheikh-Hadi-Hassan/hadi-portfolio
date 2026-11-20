#!/usr/bin/env bash
# Install original artwork packages into a cloned portfolio checkout.
# Usage: bash scripts/import-owner-images.sh ~/Downloads
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE="${1:-$HOME/Downloads}"
DEST="$ROOT/public/assets/expertise"
BRANCH="$(git -C "$ROOT" branch --show-current)"

if [[ "$BRANCH" != "feature/expertise-portfolios-20261113" ]]; then
  echo "This import is intended for feature/expertise-portfolios-20261113. Current: $BRANCH" >&2
  exit 1
fi

if [[ ! -d "$SOURCE" ]]; then
  echo "Source directory does not exist: $SOURCE" >&2
  exit 1
fi

mkdir -p "$DEST"
import_zip(){
  local zip_name="$1"
  local zip_file="$SOURCE/$zip_name"
  if [[ ! -f "$zip_file" ]]; then
    echo "Not found: $zip_file (skipping)"
    return
  fi
  echo "Importing $zip_name..."
  # The packages use different parent directories. Extract into a temporary
  # directory, then copy only files that match the original export filenames.
  local temp
  temp="$(mktemp -d)"
  unzip -q "$zip_file" -d "$temp"
  local count=0
  while IFS= read -r -d '' image; do
    cp "$image" "$DEST/$(basename "$image")"
    count=$((count+1))
  done < <(find "$temp" -type f -path '*/public/assets/expertise/*.webp' -print0)
  rm -rf "$temp"
  echo "Imported $count original WebP files"
}

import_zip 'hadi-portfolio-image-update.zip'
import_zip 'consumer-connect-phone-stack-originals.zip'

echo ""
echo 'Ready. Run:'
echo '  npm ci && npm run dev'
echo 'Visit: http://127.0.0.1:3000/expertise/product-development/'
echo 'Once validated, publish assets with:'
echo '  git add public/assets/expertise'
echo '  git commit -m "Add portfolio owner original UI screenshots"'
echo '  git push origin feature/expertise-portfolios-20261113'
