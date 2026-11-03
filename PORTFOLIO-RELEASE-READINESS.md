# Latest local acceptance — notification reliability and isolated browser checks

Current branch continues 259a04319905a9a6deb0b6235a983c0cc7322f9f. Acceptance: **20/243 → 22/243 (9.05%)**. Counts: {'Partially implemented': 188, 'Implemented and verified': 22, 'Missing': 2, 'Blocked by external dependency': 31}; total 243. Future obligations remain 233. Original 476 catalogue/IDs preserved.

## Implemented and tested

- Persist/flush per-recipient send intent before MailApp. Suppress uncertain automatic replay for ordinary notices and owner review alerts. Corrupt delivery metadata fails closed. Uncertain jobs become manual reconciliation. Pre-send quota exhaustion remains retryable; already acknowledged recipients are skipped.
- Isolated crash fixtures: failed intent write (no send), crash after intent/before transmission (quarantine), lost acknowledgement after send (no replay), partial quota retry (only unattempted recipient), completed delivery replay (skip), review alert acknowledgement loss (no replay).
- Isolated real Chromium widget fixture: default off, explicit opt-in causes one mocked request, withdrawal rejects late response, reload resets consent. Initial fixture failures were corrected (UTF-8 response encoding and rendered launcher selector); final fixture passes with no page errors. These were fixture defects, not accepted production browser failures. No live provider, email or booking calls.
- Lifecycle contract specification names both Missing IDs and keeps them in V0.1. No public lifecycle write endpoint or live provider mutation.

## Current test evidence

|Command|Result|Boundary|
|---|---|---|
|All non-browser JavaScript files under tests/ and tests/support/|23 PASS|docs/v01-current-regression-results.json; final alert scenario also passed separately|
|`CHROMIUM_PATH=/tmp/v01-chromium node tests/sera-browser.cjs`|PASS|Real browser, fake provider, isolated widget fixture; not 198-case export acceptance|
|`python3 tests/source-seo.py`|PASS|22 source-template routes only|
|`python3 tests/utility-routes.py`|PASS|Utility/CV hashes and preserved hero source|
|`python3 tests/image-cache.py`|PASS|Isolated image corruption recovery|
|`python3 tests/package-security.py`|PASS|Rejects private packaging inputs; final production package not created|
|`npm audit --json`|Zero known vulnerabilities|Current dependency tree; no new project dependency|
|`python3 tests/requirements-matrix.py`|PASS|Catalogue/count structure, not semantic certification|
|Proposed hero hash comparison|PASS|Matches preserved inputs; inactive; no active design/hero-lock.json|
|`npm run build`, export/type/production package acceptance|BLOCKED|Approved hero lock unavailable; no bypass and no repeated recovery search|
|Production-build browser matrix|BLOCKED: 0/198|22 routes × nine widths preserved|
|Manual screen-reader/visual accessibility|NOT PERFORMED|No WCAG conformance claim|

## Remaining defects and owner gates

P0: approved hero integrity artifact; authenticated production PHP/cURL/config/Apps Script identity and cleanup; authorized correlated E2E acceptance. Notification replay is now conservatively contained locally, but delivery remains ambiguous and may be omitted pending manual review. Calendar invite delivery and actual storage durability/worker concurrency remain unverified. Exactly-once delivery is not claimed.

P1: PV-474D07E1 rescheduled lifecycle and PV-15E525B9 authorized cancellation remain Missing. Required actor/token/policy decisions and verified provider contracts are documented in docs/BOOKING-LIFECYCLE-CONTRACT.md. Remaining matrix rows retain unmet criteria; no implementation-only pass. Operational retention/deletion facts need owner confirmation. All-route visual, focus, form, accessibility and performance acceptance remain pending approved build.

Owner actions: provide authentic hero lock or explicitly approve the exact proposed hashes for local QA; provide sanitized hosting/deployment/cleanup evidence; confirm retention/deletion procedures and lifecycle authority/policies; authorize controlled live acceptance only after prerequisites pass. Deployment remains separately gated.

**NO-GO. Manifest STALE.** Production, main and recovery unchanged. No live bookings, emails or deployment.


---
Previous evidence retained below; latest counts/policy above supersede earlier summaries.

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

## Sera guided-discovery milestone

See docs/sera/SERA-IMPLEMENTATION-STATE.md and SERA-TEST-EVIDENCE.md. Deterministic guided UI and non-binding brief implemented; six service-tree units and one isolated browser journey pass. Router/knowledge/error foundations are explicitly distinguished from live integration. Original catalogue stays 22/243; no automatic count increase. Platform/support scope remains future. Hero approval/198-case export acceptance remain blocked. NO-GO; manifest STALE.

Sera follow-up: all eleven isolated intent journeys now pass. Relevant backend retrieval is wired with bounded context. Multi-provider routing remains a mock policy foundation; no new provider enabled. Portfolio counts remain 22/243. No change to hero or release gates.

## Business control center development slice

See docs/admin/ADMIN-IMPLEMENTATION-STATE.md. Bound-Sheet admin foundation and private versioned knowledge/FAQ/personality/voice, disabled provider drafts, CRM annotations, appointment requests and metadata reports have local tests. No standalone portal, encrypted key management, CMS publishing, live analytics/marketing or admin AI agent acceptance is claimed. No production installation. Portfolio catalogue unchanged at 22/243; admin expansion tracked separately. NO-GO; manifest STALE.
