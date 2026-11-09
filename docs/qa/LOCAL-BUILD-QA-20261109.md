# Authorized local build and QA, 9 November 2026

Decision: build PASS, browser acceptance FAIL, release NO-GO; manifest remains STALE.
Base source: a5683a3a0bd67939e34f67ae00f78366c6c0b819 on work/v01-booking-contract-20261103.
Owner explicitly accepted the automated hero audit and authorized the three exact hashes for LOCAL BUILD AND QA ONLY. Production/staging deployment, live providers, notifications and backend writes remain unauthorized.
Installed only the exact approved three-key JSON at design/hero-lock.json. Hero HTML/CSS/shared CSS and guard byte-identical to base commit. No protected source edits.

## Commands and actual outcomes

- Canonical three-input hash verification: PASS. Values recorded in design/hero-lock.json.
- npm run verify: PASS, exit 0.
- SITE_URL=https://hadi.intellignce.net npm run build:acceptance: PASS, exit 0. Built 22 pages, generated responsive assets, compiled Next 16.4.4 with webpack, completed its TypeScript phase and export, audited 39 Flight text records, recorded approved source/export receipt.
- python3 scripts/qa/acceptance-build.py --verify after QA: PASS.
- CHROMIUM_PATH=<pinned-headless-shell> npm run test:browser-v01: BLOCKED at route inventory before case 1, exit 1. Next emitted /404/ in addition to 22 portfolio routes. Original harness unchanged.
- CHROMIUM_PATH=<pinned-headless-shell> node docs/qa/local-build-browser-runner.cjs: 198 executed, 29 PASS, 169 FAIL, 0 unexecuted cases; exit 1.
- CHROMIUM_PATH=<pinned-headless-shell> node docs/qa/assembled-app-probe.cjs: completed, exit 0, with HTTP warnings recorded separately.

Pinned shell: /workspace/scratch/f1b54e9ce3cf/playwright-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell, Chromium 156.0.8078.4 revision 1248. Node 24.22.1 / npm 11.9.0 / Python 3.12.14.
The separate QA-only runner is derived from unchanged tests/browser-v01.cjs (SHA256 f51eee73aaf2c6f45fe4312aec90cb6dc00ae6acfe6264674ed5747d793bc61a). Differences: resolve planner from repository root and permit only the known generated /404/ route. It still rejects missing/other unexpected public routes, verifies the exact hero lock and build receipt, and retains every case assertion. No guard/build inputs altered by this runner.

## Browser evidence and limits

Real assembled out/ export served over ephemeral loopback HTTP, with actual Next chunks, assets and page scripts. No isolated HTML fixtures in this run. Normal harness uses reduced motion at every width. External requests blocked, PHP handlers return 503 rather than execute.
22 routes x widths 320,360,375,390,430,768,1024,1280,1440 = 198 attempted/executed cases.
102 cases reached axe and screenshots: zero violations recorded there. 96 cases aborted during page/history evaluation (execution context destroyed). Therefore their later accessibility scans/screenshots were NOT executed. No full 198-case accessibility pass claimed.
All 198 initial document-width metrics showed no horizontal overflow. No uncaught application PAGE_ERROR events recorded. These metrics do not cancel later failures.
Screenshot manifest records 102 actual files with exact bytes/SHA-256. Missing screenshots for 96 interrupted cases are genuine evidence gaps.

Failures (overlapping categories):
- 96 cases: navigation/history evaluation lost execution context. Harness synchronization versus application history behavior remains unresolved; do not call these confirmed visible website defects or passes.
- 135 case-study initial metrics flag [null] as broken image. Static HTML inspection identifies an empty <img alt=""> inside the lightbox dialog. This does not establish 135 missing visible artworks. Scope the image assertion to intended loaded content and verify opening lightboxes in follow-up QA.
- 28 cases recorded console errors (51 events). Separate HTTP tracing confirmed /intellignce-support/runtime-config.json and /intellignce-support/runtime-config.previous.json return 404. The built-in Sera UI still opens. Resolve optional-config loading/packaging and retest; absence must not be concealed as a pass.
No application-source corrections authorized/performed in this phase.

## Assembled-app smoke

Probe origin http://127.0.0.1:39223 (ephemeral). React-managed loader released, site content interactive, 6 Next scripts present, dynamically loaded reel initialized, Sera shadow root mounted and dialog opened through the hero CTA. Separate Enable optional AI and Continue without AI actions displayed. No AI enabled, no prompt submitted and no booking attempted.
About route loaded with correct title and back navigation restored homepage in this separate probe. No uncaught page errors; two console 404 warnings above. This establishes home initialization/hydration smoke, not successful hydration of every component on every route. Flight byte-length audit is serialization evidence, not a substitute for browser hydration.
Initial custom probe had a root-serving path-check bug (403 before app load); corrected only that QA server check, then traced HTTP failures in the second successful probe. This was test infrastructure, not application failure.

## PHP and external checks

Static export server does not execute PHP. Local PHP CLI 8.3.6 lacks cURL, and production private configuration/runtime identity remains unverified. No PHP handlers, Apps Script, Calendar, Meet, lead persistence, notification delivery, provider inference, authenticated admin runtime or live rollback were accepted by these public-route checks. No external operations performed.
Existing component suites were not rerun without changes. Production permissions, approved test recipients and separately authorized integration resources remain prerequisites.

## Route counts

|Route|Executed|PASS|FAIL|Axe completed|
|---|---:|---:|---:|---:|
|/|9|4|5|6|
|/archive/|9|3|6|3|
|/mackenzie-cramblit/|9|0|9|4|
|/morganics/|9|0|9|2|
|/linkedin-personal-brand/|9|0|9|5|
|/accessorize-by-hl/|9|0|9|5|
|/jules-capital-partners/|9|0|9|4|
|/intellignce/|9|0|9|4|
|/fakhr-e-qoum/|9|0|9|5|
|/edlytics/|9|0|9|5|
|/community-campaign/|9|0|9|5|
|/bits-hr-link/|9|0|9|3|
|/al-faraj-media/|9|0|9|6|
|/bw-sports/|9|0|9|5|
|/uiux-web-saas/|9|0|9|6|
|/nicemd-ai/|9|0|9|4|
|/ai-animation/|9|0|9|5|
|/about/|9|7|2|7|
|/resume/|9|3|6|3|
|/contact/|9|3|6|4|
|/privacy/|9|2|7|4|
|/work/|9|7|2|7|

## Next actions

1. Investigate and repair QA history synchronization without weakening assertions; separately verify real user history behavior.
2. Distinguish intentionally empty lightbox slots from visible broken media and verify lightbox interaction.
3. Address optional runtime-config 404 handling or supply only approved public-safe configuration through its existing publishing contract.
4. Rerun affected cases; execute the 96 missing axe/screenshot checks. Full browser acceptance currently FAILED.
5. Production acceptance still requires authenticated Hostinger/PHP/config evidence, deployed Apps Script/source/permissions/schema identity, cleanup proof, and separately authorized isolated/live booking and rollback acceptance.

## Files and scope

Commit only approved lock and QA evidence. Build-derived public CSS/JS/sitemaps, generated/, dist/, responsive cache and out/ are local build outputs and deliberately excluded from this commit. They remain in the workspace so the receipt continues matching the tested export. No main/recovery/production modifications.
The 243-requirement matrix is not automatically promoted by this run. No new requirement acceptance count claimed; 198 case attempts are not 198 passes.

Screenshot/evidence archive: [Hadi-V1-Authorized-Build-QA-a5683a3.zip](https://chatgpt.com/library?file_id=libfile_f01665cf005c8191864902dd9c574437&account_id=personal). SHA-256: `4bcdb25a6db277d979fb0dda5ce97f637d51ad8bc9f5a6c8ac6a299f7ec0362a`. Includes all 102 recorded case screenshots plus the assembled Sera smoke capture; screenshot identities are committed in browser-screenshot-manifest.json.
