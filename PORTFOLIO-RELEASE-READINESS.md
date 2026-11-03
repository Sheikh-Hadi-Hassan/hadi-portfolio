## Evidence acceptance update after ce1b299

Verified before: 5/243 (2.06%). Verified after: 20/243 (8.23%). Denominator remains exactly 243 portfolio / 476 total; 233 future unchanged. Counts: {"Partially implemented": 190, "Implemented and verified": 20, "Missing": 2, "Blocked by external dependency": 31}.

New checks: `node tests/booking-validation.mjs`, updated `node tests/booking-status.mjs` and `node tests/booking-recovery.mjs`, and `python3 tests/source-seo.py` PASS locally. Existing contact error transport, hashed gateway logging, consent/withdrawal, utility/CV/hero checks also passed when checked against these changes. Browser harness syntax passes; no browser run and no active hero lock.

Fixed P0: status recovery formerly trusted a Calendar event without a saved lead. It now requires saved reference/event/start correlation. Orphan and mismatch regression fixtures stay pending. Both Apps Script source copies match. This is undeployed.

New local acceptance covers deterministic references, saved mock contact/timezone/state/event ID, cancelled-event recognition, bounded provider read retry and standard spreadsheet formula prefixes. Seven generated source-template SEO obligations pass across 22 pages. Full Google persistence/delivery, deployed identity and current Next export remain unverified. No notification exactly-once claim.

Remaining P0: approved hero integrity, authenticated runtime/config/deployment and cleanup evidence, controlled E2E authorization and notification send-before-record ambiguity. P1: remaining matrix acceptance including authenticated cancellation/rescheduling contracts, operational privacy retention and all-route visual/accessibility checks. Browser completed: 0/198. Manual accessibility not performed. Manifest STALE; NO-GO.

---

Historical checkpoint below (superseded counts; retained provenance):

# Portfolio V0.1 release readiness

**NO-GO. Manifest STALE.** No production, main, recovery or active Apps Script changes. No live bookings/emails. Branch: `work/v01-booking-contract-20261103`, continued from `925a3299844baff46414629cb4420341e090b8bb`.

Original-plan acceptance catalogue: 5/243 = 5 ÷ 243 × 100 = 2.06%, strictly local evidence; 476 total obligations across portfolio and future workstreams. The denominator counts distinct named acceptance obligations, not original paragraphs or checkpoint groups. Repeated historical requirements are merged; independent backend/platform, commercial product and growth/outreach execution are future scope. Source references and exclusion/counting policy are in the matrix. This engineering interpretation is reproducible in the JSON catalogue and can be revised if scope changes; it is not a production certification.

## Current verification

|Check / command|Result|Limits|
|---|---|---|
|`npm test`|PASS|Five suites: reel, booking status, client contract, isolated recovery, consent. No live provider calls|
|`node --check public/intellignce-support/widget-v9.js`|PASS|Generated syntax only|
|`node --check tests/browser-v01.cjs`|PASS|Prepared harness, not browser execution|
|`python3 tests/utility-routes.py`|PASS|Source utility routes, original CV hash, unchanged hero inputs|
|`python3 tests/requirements-matrix.py`|PASS|Unique IDs, fields, deduplication and count arithmetic; not an independent semantic review|
|Source asset/package-security/image-cache suites|Prior PASS retained|Unchanged relevant implementations; not rerun unnecessarily|
|Dependency security audit|Prior zero findings retained|Lockfile unchanged in this continuation|
|`npm run build`|BLOCKED/previous FAIL|Unchanged missing approved `design/hero-lock.json`; no bypass|
|Current export SEO/image/hydration/type checks|BLOCKED|Require approved build; historical passes not promoted|
|All-route browser/accessibility|BLOCKED, 0/198 executed|22 distinct routes × nine widths; source inventory and harness checked|
|Manual visual/keyboard/screen-reader checks|NOT EXECUTED|No WCAG certification|
|Live backend identity and end-to-end acceptance|BLOCKED|Authenticated evidence then explicit booking authorization|

## Hero decision

`docs/HERO-APPROVAL-REVIEW.md` contains exact input paths/hashes, proposed three-key lock, bounded historical comparison, explicit owner approval wording and rollback. Proposal stays outside design/ and inactive. Byte-identical scoped inputs are confirmed; rendered appearance has not been re-verified. No approval inferred.

## Browser acceptance preparation

Harness requires a passing integrity guard and existing export. It verifies exact 22-route inventory, nine widths, HTTP 200, H1 count, overflow, dock bounds, per-case axe findings, console/page errors, menu open/Escape, keyboard focus containment/restoration. Evidence records route/width. External requests are blocked and no submissions occur. Manual image/crop/visual/assistive-tech and full reduced/non-reduced-motion checks remain separate. Prepared coverage is not executed coverage.

## Owner actions and remaining gates

1. Supply authenticated approved hero lock or explicitly approve exact replacement hashes; this authorizes local baseline installation/QA only.
2. Supply sanitized reviewed-kit runtime/config/deployment/cleanup evidence. Do not send keys or credentials.
3. Confirm Google/Sheet/log retention, access and deletion/export responsibilities.
4. Authorize isolated live booking acceptance only after identity gates pass. Deployment approval remains separate.

## Deployment and rollback preparation

After accepted build and local QA, compare candidate with actual production read-only; pin source, artifact, private-config mapping and Apps Script version. Preserve full recovery baseline and dated production snapshot. Generate a corrected manifest only from the validated candidate. Inspect package for secrets/private files. Request explicit deployment approval; never overwrite main or private/live data.

For rollback, restore only approved changed application/static files and compatible integration version, with separate authorization. Preserve newly saved leads, events and delivery records. Do not replay uncertain notifications. Verify routes and pending-reference recovery; retain incident evidence. Rolling back a future hero-lock activation means reverting only that activation and allowing the integrity guard to block again.
