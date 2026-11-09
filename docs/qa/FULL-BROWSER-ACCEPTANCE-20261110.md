# Full local browser acceptance, 10 November 2026

Local browser gate PASS. Release NO-GO. Manifest STALE.
Application source checkpoint: 916f34aaa3c1d9f39e2ab8fa9eacfd23333664f4, descended from requested c142add on work/v01-booking-contract-20261103. b0bcb52 preserved an explicitly incomplete fresh QA checkpoint. The final evidence commit contains this report and the completed source/output receipt.

|Evidence|Historical baseline|Fresh verified run|
|---|---:|---:|
|Executed|198|198|
|PASS|29|198|
|FAIL|169|0|
|Unexecuted|0|0|
|Axe scans completed|102|198|
|Recorded axe violations|0 in completed scans|0|
|Case screenshots|102|198|

## Recovery and evidence integrity

A previous scratch session observed 198/198 PASS after corrections, but its unpublished checkout, screenshots and receipt vanished on resume. That observation was not promoted to current acceptance. GitHub still held c142add. A new clean checkout was made at portfolio-v1-verified, locked dependencies and the exact pinned browser were restored only because they were missing, and corrections were checkpointed on GitHub before rerunning. The new build, complete matrix and receipt below are the authoritative retained evidence. Earlier scratch-only intermediate counts are not reconstructed as raw results.

Original partial local work was not overwritten; the restored checkout is separate. Guard, owner-approved lock and protected hero HTML/CSS/shared CSS remain byte-identical to c142add. No new hero baseline or guard bypass.

## Corrections

- src/styles/bayfi-brand.css: darken non-hero reel-control and utility primary-action backgrounds to #593bbd; improve project/archive number contrast to #bcb5c6. Preserve geometry, copy, typography, hero inputs and secondary outlined actions.
- An auxiliary case-study stylesheet was not loaded by the Next export. The utility correction was placed in the already-loaded component stylesheet instead; no broad stylesheet/build-pipeline expansion.
- tests/browser-assertions.cjs: history load budget explicitly 30 seconds, consistent with initial navigation, with timing recorded. URL, title, load/readiness, Back and Forward assertions remain. No auto-retry or swallowed navigation failures. The previous scratch run had one 10-second goForward load timeout; it is not claimed as a new application defect or silently reclassified. The fresh run had no such failures. Maximum entire multi-page history round trip: 6742 ms, not a Core Web Vitals measurement.
- tests/browser-v01.cjs: optional 3-way workload partition only; default remains all198. Each shard checks the full route inventory, approved guard and current receipt. The merger rejects duplicate/unknown IDs and incomplete coverage.

## Actual assembled application

Complete Next.js static out/ export over three ephemeral loopback origins, actual routes/assets/Next chunks/scripts. No isolated HTML fixtures or asset overrides in the matrix or smoke. Widths: 320,360,375,390,430,768,1024,1280,1440; height900, reduced motion for the matrix. Pinned Chromium headless shell156.0.8078.4/revision1248, Playwright1.64.1; restored npm ci against committed lockfile. See recovered-runtime.json and pinned-browser/provenance.json in the local workspace.

The separate rebuilt-app smoke passed: normal-motion homepage React-driven reel initialization, Sera mount/open, explicit decline and deterministic project entry, actual links/Back/Forward, and two visible lightbox images each on Mackenzie Cramblit and Morganics (close/reopen another image; button and Escape closure; scrolling restored). No fixtures or source overrides. This is initialization/hydration smoke, not a claim that every component state was manually checked.

198 axe scans with WCAG2/2.1/2.2 A/AA tags recorded zero violations. Every matrix case recorded zero horizontal overflow, no broken media under the active-placeholder-aware assertion, no unexpected console/page errors, correct route/history, menu focus and screenshot. This is automated coverage, not full manual WCAG certification or all-animation/all-browser acceptance.

Both optional Sera config files are absent in this unconfigured local export. Explicit builtin mode is appropriate here. 739 expected optional-resource404 console events are retained in expectedOptionalResponses, correlated with typed NOT_FOUND diagnostics. They are not presented as zero raw console messages. Other resources, invalid settings, HTTP500 or network errors are not exempted. Do not use builtin mode for an environment expected to have approved published configuration.

## Commands and outcomes

    npm ci --no-audit --no-fund
    npm run verify
    SITE_URL=https://hadi.intellignce.net npm run build:acceptance
    CHROMIUM_PATH=<pinned-headless-shell> node tests/rebuilt-app-smoke.cjs
    V01_SHARD=0/3 SERA_CONFIG_EXPECTATION=builtin CHROMIUM_PATH=<pinned-headless-shell> npm run test:browser-v01
    V01_SHARD=1/3 SERA_CONFIG_EXPECTATION=builtin CHROMIUM_PATH=<pinned-headless-shell> npm run test:browser-v01
    V01_SHARD=2/3 SERA_CONFIG_EXPECTATION=builtin CHROMIUM_PATH=<pinned-headless-shell> npm run test:browser-v01
    node tests/merge-browser-shards.cjs docs/qa/browser-rerun-shard-0.json docs/qa/browser-rerun-shard-1.json docs/qa/browser-rerun-shard-2.json
    python3 scripts/qa/acceptance-build.py --verify

All above completed successfully. Build compiled Next16.4.4, generated22 routes, audited39 Flight text records and recorded the receipt. Merge confirmed198 unique planned case IDs; all workers exit0. Post-QA receipt PASS; guard rechecked PASS. The initial npm warning about unknown http-proxy environment config is retained in logs; no dependency files changed. Relevant focused assertion and syntax checks passed. Previously passing unrelated suites were not repeated.

## Route coverage

|Route|Executed|PASS|FAIL|
|---|---:|---:|---:|
|/|9|9|0|
|/archive/|9|9|0|
|/mackenzie-cramblit/|9|9|0|
|/morganics/|9|9|0|
|/linkedin-personal-brand/|9|9|0|
|/accessorize-by-hl/|9|9|0|
|/jules-capital-partners/|9|9|0|
|/intellignce/|9|9|0|
|/fakhr-e-qoum/|9|9|0|
|/edlytics/|9|9|0|
|/community-campaign/|9|9|0|
|/bits-hr-link/|9|9|0|
|/al-faraj-media/|9|9|0|
|/bw-sports/|9|9|0|
|/uiux-web-saas/|9|9|0|
|/nicemd-ai/|9|9|0|
|/ai-animation/|9|9|0|
|/about/|9|9|0|
|/resume/|9|9|0|
|/contact/|9|9|0|
|/privacy/|9|9|0|
|/work/|9|9|0|

## Remaining gates

PHP handlers were not executed. Local static server denies PHP/non-read operations; no authenticated Hostinger PHP/SAPI/cURL/TLS/private-config/permissions evidence collected here. No live Apps Script/Sheet/Calendar/Meet/lead persistence/email/provider credentials, admin authentication acceptance or operational rollback exercised. No live backend/provider writes, production credentials, paid calls, staging/production deployment, main merge or recovery change.

Next gates remain authenticated backend/deployment identity and permissions, credential custody where needed, separately authorized controlled booking/notifications acceptance and rollback verification. External links/services, manual screen-reader acceptance and performance/Core Web Vitals are not established by this matrix. No 243-obligation completion count is promoted solely from browser cases.

Final build output: /workspace/scratch/f1b54e9ce3cf/portfolio-v1-verified/out. Build-generated public/cache/output files remain local, excluded from source commits. Source and QA evidence are Git-backed; screenshot archive supplies durable images. Production release remains NO-GO.

## Durable screenshots

[198 matrix screenshots and 3 rebuilt-app smoke screenshots](https://chatgpt.com/library?file_id=libfile_bc1120fcfadc819186dfdbd81cb5dec6&account_id=personal). Archive SHA-256: `71c124349f48cae318c753e2280edb78bd96b2bfaf734806298031d3507fbc10`. Every image has a committed SHA-256 in browser-screenshot-manifest.json.
