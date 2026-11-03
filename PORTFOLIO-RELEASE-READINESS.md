# Portfolio V0.1 release readiness

**NO-GO — 2026-11-03. Production unchanged. Manifest STALE.** This checkpoint completes targeted development, not the entire original-plan acceptance.

## Provenance and branch

Local branch: `work/v01-booking-contract-20261103`.
Source downloaded from GitHub branch `work/portfolio-v01-requirements-20261103`, observed commit `22c9579dfc6ddea2aec37b652c01710fc0aa0c62`. Local Git history starts with a snapshot commit; it is not the remote ancestor history. No push, merge or deployment performed.
Recovery commit `c4097990bccabea53af798eaf80012c239d6a418` remains preserved and untouched. No live booking/email or diagnostic deployment performed. Existing reviewed verification kit reused by reference; no regeneration or repeated authentication attempt.

## Changes

- Apps Script returns pending until event status, identity, start time and Meet readiness satisfy the local confirmation contract. Both source copies remain identical; pending rows/outbox records remain Pending.
- Sera no longer turns legacy successful booking envelopes into booked status. Incomplete confirmation keeps the pending draft/reference. Generated public widget aliases rebuilt.
- Next.js 16.4.0 upgraded to 16.4.4 after registry advisory; dependency audit reports zero vulnerabilities at this checkpoint. This is not a guarantee against undisclosed vulnerabilities.
- Image optimizer rejects corrupt/empty/wrong-size cached WebPs and writes atomically. Isolated corruption regression added.
- Footer privacy copy corrected to Google Gemini. Full consent/privacy acceptance remains open.
- Footer width and dock text inheritance corrected; statistic labels given a permitted accessible role.

## Verification

- 19 local JavaScript suites passed after dependency installation (`docs/v01-local-test-results.json`). These do not exercise live providers.
- `npm test`: reel motion, backend booking status and new client confirmation contract pass.
- Source-asset preflight: 461 referenced assets exist. Package-security tests pass.
- Isolated corrupt-image cache regression passes.
- CI-equivalent export on Next 16.4.4 succeeds: 17 content routes plus framework missing-page outputs.
- Hydration, SEO, production links/assets/IDs and image export checks pass; 480 responsive images and 432 image metadata/sitemap entries.
- Browser evidence: `docs/v01-browser-results.json`; all nine widths pass horizontal-overflow/dock bounds, menu opens/closes with Escape, zero automated axe findings at the tested final viewport; local Chromium, nine requested widths, external requests blocked, reduced motion, no submissions. This is a homepage smoke test, not full visual/WCAG acceptance.
- `npm run verify` and therefore the standard `npm run build` entry remain blocked by absent historical `design/hero-lock.json`. CI explicitly uses the remaining pipeline without that orphaned guard. No substitute approval hash has been invented.

## Remaining mandatory gates

|Gate|Status|Required evidence/action|
|---|---|---|
|Web PHP/cURL/runtime restrictions|BLOCKED|Authenticated web-handler output using reviewed kit|
|Actual selected private configuration|BLOCKED|Runtime-selected path and non-reversible deployment fingerprint|
|Apps Script deployed identity|BLOCKED|Project, active deployment/version, deployed source, executor/access, Calendar identity/scopes and timezones|
|Diagnostic cleanup|BLOCKED|Owner cleanup.json if diagnostics were installed; otherwise explicit no-install evidence|
|End-to-end booking/delivery|BLOCKED|Prior identity gates then explicit approval, isolated recipients and correlated records|
|Failure/concurrency/reconciliation acceptance|BLOCKED|Isolated full provider/Calendar/email crash scenarios; no production injection|
|Release build entry/hero approval baseline|FAIL|Resolve missing historical lock without silently redefining approved design|
|Full page/mobile/accessibility/Lighthouse|BLOCKED|Extend beyond homepage smoke; manual keyboard/screenreader and measured performance|
|Manifest and full production comparison|STALE|Validated candidate and full authenticated comparison before generation|

## Deployment preparation (not authorization)

1. Rebase/apply the reviewed source patch to the known GitHub work-branch ancestor; never overwrite main or recovery.
2. Restore approved hero-lock provenance/policy, complete remaining acceptance, then run clean dependency install, all unit/security tests, full export audits and browser checks.
3. Pin source revision, lockfile, Apps Script version/mapping and artifact hashes; generate corrected manifest only then. Inspect package for private configs, credentials, logs, leads and diagnostics.
4. Compare candidate with actual production read-only. Preserve a dated full hosting snapshot and current private/live data separately with restricted access.
5. Obtain explicit production and Apps Script deployment approvals. Plan compatibility: older deployed Apps Script responses will remain pending under the stricter client; do not deploy only the new client against an unverified old integration.
6. Upload only the approved artifact via authorized hosting access; preserve private configuration and data. Verify static smoke tests first. A booking test needs separate explicit approval.

## Rollback

Record the exact predeployment hosting artifact and Apps Script deployment version. Restore only changed application/static files from that artifact, not database/Sheet lead data or event history. Restore the compatible Apps Script version only with approval. Purge relevant caches, verify routes, health and existing request-status recovery. Preserve logs and newly saved leads/events for reconciliation. Do not blindly replay notifications or create replacement events. The recovery baseline is evidence, not permission to overwrite current live state.

## Owner actions

Return sanitized `EVIDENCE.md`, `evidence.json`, `cleanup.json` from authenticated sessions using the reviewed kit. Do not send credentials. Supply the original approved hero-lock artifact or decide its replacement approval policy. Authorize a controlled booking only after runtime/config/deployment gates pass. Deployment remains separately gated.

Next local work: exhaustive plan decomposition, remaining route/resume parity, broader Sera/consent/fault-injection and all-page visual/accessibility acceptance. No overall portfolio completion percentage is claimed.

## 3 November continuation evidence

Added About, Work, Contact, Privacy and Resume routes using existing shared layout. Menu includes About/Resume/Contact; original 2026 CV PDF included with pinned SHA-256 identity. Fixed utility breadcrumb labels and removed spurious Portfolio ancestor for utility pages. Existing Archive/project data retained.

Commands and current results:

- `python3 scripts/build.py && python3 tests/utility-routes.py`: PASS, 22 source-template routes, 5 new utility pages, original PDF and unchanged home/hero/shared CSS. This is not the gated production export.
- All 20 non-browser JavaScript suites: PASS, individual results in `docs/v01-local-test-results.json`.
- `python3 tests/source-assets.py`: PASS (461 existing source asset references).
- `python3 tests/package-security.py`: PASS.
- `python3 tests/image-cache.py`: PASS.
- `npm audit --json`: zero known vulnerabilities in current lockfile.
- `npm run build`: FAIL at unchanged integrity guard because approved `design/hero-lock.json` is missing. No bypass performed.
- `node --check tests/browser-v01.cjs`: PASS syntax. Runtime suite BLOCKED at integrity prerequisite. All 198 route/width cases are explicitly blocked in `docs/v01-all-route-browser-results.json`.
- Current production-export SEO/image/hydration/type/build checks and manual keyboard/screen-reader/contrast acceptance remain BLOCKED after the new route changes. Earlier passing evidence is historical and is not promoted to a current pass.

Hero investigation: no file in current snapshot, no PDF/hero lock in preserved hosting ZIP, no exact-name Library lock result; GitHub default-branch and integration-branch path-history queries returned no commits. This is bounded evidence, not proof that no artifact exists anywhere. Required owner artifact: original approved `design/hero-lock.json` with provenance, or explicit approval of a replacement baseline. Current hero inputs remain byte-identical to checkpoint. No automatic baseline generation.

P0: hero integrity/build gate, authenticated runtime/config/Apps Script identity, cleanup and authorized E2E booking gates; notification send-before-record crash ambiguity remains. P1: full original-plan atomic mapping, all-route visual/accessibility/SEO acceptance after build, consent/privacy completeness and cancellation/rescheduling acceptance. Manual browser checks were not performed in this continuation.

Manifest STALE. NO-GO. Production, main and recovery remain untouched. No real booking, email or diagnostic deployment. Existing five-report checkpoint remains in the development branch; this continuation does not claim every local task is finished.

## Consent and integrity continuation

- Confirmed defect: public Sera defaulted AI on; both consent buttons only dismissed the notice. Corrected `integrations/sera-v9-source/runtime.js`: default off; distinct Enable optional AI and Continue without AI actions; opening Privacy does not enable AI; no provider readiness request on initial open without opt-in. Generated public widget aliases rebuilt.
- `node tests/sera-consent.cjs`: PASS default/handler/focus checks and static request-gate assertion. This is not a browser/network consent acceptance test. `npm test` booking/reel suites pass after client bundle changes.
- Inactive replacement proposal: `docs/hero-baseline-PROPOSED-NOT-APPROVED.json`. Contains current hashes, explicit unknown approved-baseline differences and owner activation instructions. It is outside `design/` and cannot satisfy the build guard. Approved artifact still unavailable; earlier bounded recovery evidence retained. No integrity bypass or approved-baseline substitution.
- Cancellation/rescheduling source review: existing Calendar-cancelled events are recognized; no authenticated customer cancellation/rescheduling actions are exposed by the public gateway. Safe owner-contact workflow remains available. Do not expose unauthenticated destructive actions as a shortcut. Full lifecycle functionality and acceptance remain P1.
- Contact/booking errors: prior regression tests cover pending reference retention, invalid confirmations, duplicate keys, unavailable slots, provider/Calendar failures and partial notification retry. Mail send-before-durable-metadata crash ambiguity remains P0; no claim of exactly-once email delivery.
- Privacy remains incomplete as a full policy: backend/Google retention, access and deletion procedures need owner-confirmed operational facts. No invented retention commitments.
- Original-plan atomic traceability remains incomplete. Full-plan denominator and verified percentage are unavailable; prior 5/39 is historical grouped evidence only. This continuation is not all requested local work complete.
- Build integrity and browser acceptance remain BLOCKED. Browser coverage completed for current all-route suite: 0/198. Manual accessibility not performed. Existing reports remain NO-GO; manifest STALE.
