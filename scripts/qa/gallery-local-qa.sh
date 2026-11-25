#!/usr/bin/env bash
# Local testing; never deploys.
set -euo pipefail
MODE="--unit"
if [[ "$#" -ge 1 ]];then MODE="$1";fi
cd "$(git rev-parse --show-toplevel)"
if [[ "$MODE" == "--browser" ]];then P0_GALLERY_URL=http://127.0.0.1:3003 node tests/gallery-browser.cjs;exit;fi
if [[ "$MODE" != "--unit" && "$MODE" != "--build" ]];then echo "Usage: $0 [--unit|--build|--browser]" >&2;exit 2;fi
node --test tests/gallery-core.test.mjs
node tests/gallery-admin.test.mjs
node tests/admin-cms.mjs
node tests/admin-cms-rich.mjs
node tests/admin-staging-security.mjs
python3 scripts/verify-hero-lock.py
if [[ "$MODE" == "--unit" ]];then echo "Unit/Admin QA done. Stop 3003 server before running --build.";exit;fi
if lsof -nP -iTCP:3003 -sTCP:LISTEN >/dev/null 2>&1;then echo "STOP: stop dev server on 3003 before build (.next contention)" >&2;exit 6;fi
npm run build
python3 tests/production.py
echo "Build QA done. Restart PORT=3003 npm run dev, then run --browser in second terminal."
