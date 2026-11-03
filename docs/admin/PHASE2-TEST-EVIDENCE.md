# Phase 2 test evidence

Published pipeline/CMS slice: 06e89289e8ae6f2f793d2c7a1e69f8eab4725698. Source restored after workspace reset from that exact commit; 124 text files and required media/CV matched Git blob hashes. Only recovered provider/voice changes and evidence are added. No production operations.

## Current recovered snapshot

Commands run from continued-phase2; PHP is local 8.3.6 CLI, not Hostinger web PHP.

|Command|Result / scope|
|---|---|
|`npm test`|PASS, 14 JS suites: reel, booking status/client/recovery/validation, consent, notification crash, discovery/errors/knowledge, admin authorization/export, public config/staging, CMS and voice-disable guards|
|`../php-local/usr/bin/php8.3 tests/admin-public-config.php`|PASS strict config/tone and corrupt-current/previous fallback|
|`../php-local/usr/bin/php8.3 tests/sera-provider-adapters.php`|PASS Gemini/Groq envelopes, mocked 429 failover, immutable state, consent/free/privacy gates and redacted failures; zero network|
|`../php-local/usr/bin/php8.3 tests/sera-provider-ledger.php`|PASS storage gate, durable debit, uncertain-call no-refund, circuit, explicit reset and corrupt data rejection|
|`PHP_BINARY=../php-local/usr/bin/php8.3 python3 tests/sera-provider-ledger-concurrency.py`|PASS 20 processes, exactly three accepted reservations; empty-corrupt file closed|
|`../php-local/usr/bin/php8.3 tests/sera-router.php`|PASS existing routing/bounds/eligibility fixtures|
|`../php-local/usr/bin/php8.3 tests/sera-retrieval.php`|PASS bounded source-referenced retrieval|
|`python3 tests/package-security.py`|PASS sensitive-file packaging exclusions|
|`python3 tests/requirements-matrix.py`|PASS 476 stable IDs; 243 portfolio, 233 future; structural/count validation only|
|`node tests/leads-desk.mjs`|PASS prior CRM contract|
|`node --check public/intellignce-support/widget-v9.js` and affected `php8.3 -l`|PASS syntax; widget source rebuilt without a site build|

The first recovered npm run stopped at an absent CV file; exact source CV/media were restored and all suites then passed. The concurrency test initially assumed PHP errors appeared on stderr; the assertion now checks both streams and passes. No unresolved code test failure is hidden.

## Earlier executed isolated browser evidence, preserved

Before reset, Chromium fixtures passed: admin draft-to-approval, overflow at 320/768/1280 and zero axe findings in its tested final state; approved FAQ/identity/previous-config fallback; consent withdrawal/late response/reload; eleven guided journeys. See browser-results.json and config-browser-results.json. A reload assertion and a shadow-root selector were corrected during harness expansion before the successful rerun.

Current final browser rerun is BLOCKED: the reset removed Chromium and the axe dependency. Earlier reports are not new executions or production acceptance. Voice-disable entry/resume/read-aloud paths are verified in the current VM suite. Manual WCAG and full-page rendering are not accepted.

## Remaining acceptance boundaries

No real Google roles/ACL/deployment or Hostinger identity/key custody accepted. No credential CRUD/encryption, real-provider entitlement/connectivity/evaluations, full CMS build/media publication or production cleanup acceptance. Hero lock remains unavailable; production build and all 198 production-build cases remain blocked. Existing staging tests cover stale/conflicting writes, lock/symlink rejection, invalid candidate preserving active, absent rollback, verified prior-version rollback and protected/new-project rejection. CLI readback passed before reset; current module tests passed again.

Dependencies/lockfile unchanged; no new security-audit result is claimed. Manifest STALE. NO-GO.
