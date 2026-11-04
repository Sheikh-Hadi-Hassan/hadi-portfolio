# Booking release test evidence — 2026-11-04

Candidate source commit1d4ea2a51a01502feab50bb2ea5a358173aa6f67, inspected current branch HEAD. No production source was changed. Candidate Code.gs/mirror/review manifest, gateway and source-client Git blob IDs matched the remote inspected tree before packaging; this establishes repository identity only.

Executed `npm run test:booking-release` with final result **PASS**:

|Command within suite|Actual coverage|
|---|---|
|node tests/booking-status.mjs|Persisted lead/event/start correlation; confirmed/pending/failed/cancelled/absent states; mirror consistency|
|node tests/booking-client-contract.cjs|Incomplete legacy/partial confirmations rejected and pending draft retained|
|node tests/booking-recovery.mjs|Duplicate/mismatched operations, busy slots, timeout/denial, lost response, durable mock lead, ambiguous partial owner-mail suppression. Existing assertions preserved; shared fixture extracted|
|node tests/booking-validation.mjs|UUID/payload/honeypot/timezone, formula/HTML escaping, bounded read retry, fail-closed availability|
|node tests/notification-crash.mjs|Intent-before-send, failed persistence/flush, lost send acknowledgement, quota-safe retries, review-alert quarantine and corrupt metadata|
|node tests/lead-api.mjs|Contact/enquiry success/error/HTML404, pending202, network/timeout, stable reference retention|
|node tests/booking-release-integration.mjs|Actual frontend request/acceptResult + Apps Script doPost in VMs, in-memory Sheet/Calendar/Meet/MailApp. Stable reference/event/time/zone, owner intents, customer attendee invitation request, duplicates, mismatched payload, lost response, pending/timeout/busy/denial/invalid contact/auth|
|python3 tests/booking-release-package.py|Fixed allowlist, deterministic bytes, pinned source/mirrors, no overwrite,0600 ZIP, activation/config flags false, added/traversal/tampered entry rejection|

Seven JS suites and one Python suite passed. The new integrated test initially exposed a **fixture defect**: its reused busy interval was fixed to December1 while the new test chooses tomorrow. Corrected only that new fixture interval to match its dynamic slot; the final integration and full focused command pass. No production booking defect was masked or changed.

`python3 scripts/booking-release/package.py /tmp/hadi-booking-phase5/staging/booking-candidate.zip` PASS, readback SHA-256 recorded in STAGING-ARTIFACT.json. Archive contains four fixed entries; only apps-script/Code.gs is a proposed deploy file. No admin/PHP/frontend/private config included. Rebuilding into a second unused path yields the same checksum.

This is **protocol/mock integration**, not a real browser, actual PHP HTTP handler, Apps Script deployment or Google delivery test. Client→gateway hop is a fake transport injecting a synthetic backend-only key; it cannot prove Hostinger authentication/TLS/rate limiting/configuration or live frontend compatibility. MailApp mock acceptance and Calendar sendUpdates are not mail receipt evidence. No new live requests/appointments/emails/quotas/deployments were used.

Full Next/hero build is excluded from this backend-only artifact; it was not rerun or bypassed. Original22×9production-build coverage remains0/198. PHP files are not changed or packaged; real PHP8.4 web compatibility remains an operational blocker. Existing preserved-gateway comparison found logging-only repository differences but is not fresh production parity. No whole-site recovery scan, obsolete kit regeneration or unchanged unrelated admin tests were repeated.

Additional actual checks: `python3 tests/package-security.py` PASS (private/env/key packaging guards); `python3 tests/requirements-matrix.py` PASS (476catalogue/243Portfolio/22verified consistency); `node --check` on the new helper/integration test and Python py_compile PASS. Final candidate ZIP readback matched STAGING-ARTIFACT.json; no approved hero lock was created. All assertions pass after the fixture correction; connected staging/production gates remain BLOCKED.
