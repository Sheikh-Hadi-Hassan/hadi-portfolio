# Browser failure triage, 9 November 2026

Base: 7ca76e04668e561f7a86dddb59536221958c0e4a, work/v01-booking-contract-20261103.
Targeted fixes PASS. No complete build or 198-case rerun executed. Historical 29 PASS / 169 FAIL remains unchanged. Manifest STALE, release NO-GO.

|Category|Root cause and classification|Corrective change|Targeted evidence|
|---|---|---|---|
|Navigation/history|Harness synchronization defect reproduced: DOMContentLoaded-only back-to-back navigation allows the next evaluation to overlap history document replacement. /@320 failed historically; /work/@320 passed historically but reproduced the same context error. Events show multiple navigation/document events before settling. No user-visible app navigation defect reproduced in these sampled routes; not a blanket clearance of all routes.|Wait for destination URL, load, interactive site-content and loader release before assertions. Real menu/home link clicks, Back, Forward and restored title/URL remain asserted. No execution-context exceptions swallowed.|browser-triage-before-fix.json contains original failure; browser-triage-navigation.json shows both routes pass corrected canonical history helper, plus three bounded repeated synchronized round trips each.|
|Lightbox images|Harness false positive: the source-less image is hidden in a closed native dialog, not a broken visible artwork.|Exclude only a hidden source-less/srcset-less image inside a CLOSED dialog. Visible empty images and assigned-but-broken URLs remain failures.|Mackenzie Cramblit and Morganics: open first image, load visible image and caption, close via button, open different image, close via Escape; verify different sources, nonzero dimensions, dialog closed and body scrolling restored. A synthetic visible empty image still fails corrected assertion. browser-triage-interactions.json.|
|Sera optional config|Unconfigured local export intentionally lacks optional approved runtime-config.json/current previous snapshot; built-in assistant remains operational. Source defect: loader silently collapsed 404 absence, malformed data, HTTP errors, timeouts and network failures into one outcome.|Publish safe typed status/attempt diagnostics. Genuine failures produce a visible non-blocking status notice and code-only warning. Preserve approved fallback/last-known-good and questionnaire answers. Accept console 404 only when correlated with that exact optional resource's recorded NOT_FOUND outcome; unconfigured mode requires explicit SERA_CONFIG_EXPECTATION=builtin. Other 404 assets, 500, invalid schema and network failures remain QA failures.|Seven isolated real-browser/mock-configuration scenarios PASS: absent, approved, corrupt-current/valid-previous, both-invalid, 500, network failure, timeout. Questionnaire entry remains interactive in all; zero POSTs. Separate last-good unit regression PASS.|

## Scope and test commands

Pinned Chromium headless shell 156.0.8078.4 revision 1248, same installed browser.
- Before-fix reproducer: actual previously approved out/ export over ephemeral loopback; one historical failing route / and one historical passing route /work/, width 320. /work reproduced context loss within bounded legacy retries; genuine user menu -> About -> Back -> Forward worked with ready conditions. Preserved event trace in browser-triage-before-fix.json.
- CHROMIUM_PATH=<pinned-shell> node tests/browser-triage.cjs: initial corrected-ready checks and lightboxes PASS on immutable prior assembled export. The test server overrides ONLY the served widget with current source; this explicitly tests a source overlay, not a rebuilt candidate. Lightbox source and hero unchanged.
- TRIAGE_NAV_ONLY=1 CHROMIUM_PATH=<pinned-shell> node tests/browser-triage.cjs: final canonical history helper PASS on / and /work/. Document URL, title, real link navigation, Back and Forward checked. Uses previously assembled export, NOT new production-build acceptance.
- CHROMIUM_PATH=<pinned-shell> node tests/sera-config-failures.cjs: 7/7 isolated widget browser/mock scenarios PASS. Genuine error notice visible; deterministic inquiry still usable; no uncaught page errors; zero POSTs. HTTP 404/500 and network errors are deliberately injected and retained as diagnostics, not provider operations.
- node tests/sera-config-retention.mjs: PASS, approved snapshot and valid answer preserved after bounded failed reload; 3 total mock fetches.
- node tests/browser-assertions-unit.cjs: PASS, expected absence is narrowly scoped and opt-in; other failures are not suppressed.
- node tests/browser-plan.cjs: PASS, exact 22 x 9 inventory, known framework /404 support, unknown-route rejection and evidence accounting retained.
- node tests/admin-public-config.mjs: PASS, schema/public allowlist, private/secret rejection, publication conflict/staging/rollback and approved FAQ behavior.
- CHROMIUM_PATH=<pinned-shell> node tests/sera-config-browser.cjs: PASS, approved identity/FAQ/voice disable, previous fallback, invalid -> built-in; no provider/booking/notification calls.
- node tests/sera-consent.cjs and node tests/sera-runtime-controls.mjs: PASS, relevant consent/withdrawal and pinned questionnaire regressions.
- npm run verify: PASS. Exact owner-approved inputs and lock byte-identical to base; no activation changes.
- node --check on modified widget, canonical runner, QA runner and triage browser scripts: PASS.

Test-development failures were corrected before completion: a supplemental test initially selected nonexistent /work/ in the menu (corrected to existing About link); a status message placed in the animated caption was overwritten (source corrected to a dedicated role=status notice); the last-good unit fixture needed its existing voiceStop dependency stub. No unresolved targeted test failures remain.

## Safeguards and follow-up

Current and previous config requests remain bounded to two fixed public filenames, 3-second timeout each, 128 KiB schema validation and public allowlist. No secret response bodies or private config are logged. Source config module and served v9 bundles are updated together; legacy alias bundles were not regenerated in this narrow change. No provider activated. Public and private Sera boundaries unchanged.

All 198 historical cases are NOT reclassified from these representative tests. No new full-build accessibility acceptance claimed. The old export receipt is now stale relative to changed scripts/public widget; it was not rewritten or bypassed. A fresh guarded acceptance build is required before running the canonical complete suite again.

Full rerun is justified AFTER that fresh build. For this explicitly unconfigured local profile:

    SITE_URL=https://hadi.intellignce.net npm run build:acceptance
    SERA_CONFIG_EXPECTATION=builtin CHROMIUM_PATH=<pinned-shell> npm run test:browser-v01

For an environment expected to contain approved configuration, omit SERA_CONFIG_EXPECTATION=builtin; missing configuration must fail. Do not use the built-in expectation to conceal an integration deployment failure.

The full suite should retain all 198 cases and strict navigation, asset, console, layout, focus, axe and screenshot assertions. Confirm the former 96 interrupted cases now finish, then investigate any remaining failures rather than extrapolating from samples.

No staging/production deployment, main/recovery changes, live bookings, emails, provider requests or paid services. Prior build-generated public CSS/script/sitemap outputs are preserved locally and excluded from this commit. No manual changes to protected source or source copying from production.
