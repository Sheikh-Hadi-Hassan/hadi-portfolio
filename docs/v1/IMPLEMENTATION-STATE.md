# Portfolio V1 implementation state

Entry commit:5cf52793b5468c005a890fde7b6981eab6bcf4cd. Development branch:work/v01-booking-contract-20261103. This is an implementation checkpoint, not a completed V1 release.

## Stage1: booking authoritative verification

Implemented in both existing Code.gs copies: authoritative GET against configured Calendar before booked status; exact derived event ID/private reference, expected UTC instant, duration/end, explicit offset and configured zone checks; Meet request correlation; cancelled/pending/failed handling. Normal insert has no attendees and sendUpdates=none. Outbox adds attendees only after verification, persists/flushed invitation intent before PATCH, checks GET acknowledgement and reconciles accepted markers/recipients. Unknown PATCH outcomes quarantine rather than silently resend. Owner mail rechecks authoritative event. No live calls made.

PASS locally: node tests/booking-authority.mjs; booking-status.mjs; booking-release-integration.mjs; booking-recovery.mjs; notification-crash.mjs; booking-validation.mjs. New faults cover missing/timed-out GET, wrong ID/reference/start/end/zone/Meet request, contradictory Meet failure, malformed conference data, invitation timeout before/after send and lost invitation readback. Existing recovery assertions retained. Tests use in-memory Google adapters, not deployed Google/host verification.

Files:integrations/calendar-v8/Code.gs; integrations/leads/Code.gs; tests/booking-authority.mjs; tests/helpers/booking-harness.mjs; tests/booking-status.mjs; tests/booking-release-integration.mjs.

The Phase5 frozen package remains historical. Its old checksum must not be used for this changed source; a new V1 component manifest/package is needed after the implementation commit is pinned. No source was silently swapped in the old ZIP or activation performed.

## Next executable work

1. Pin a new booking component manifest and focused regression command to this tested source.
2. Complete server-only OpenRouter/free-only routing and its public/admin policy validation without enabling credentials or paid inference.
3. Reconcile all243atomic requirements with implementation/test/production status separately; retain original IDs and explicit external blockers. Do not call verified/243 an implementation-completion percentage.
4. Continue CRM/CMS/public-page and release automation gaps that do not need external approval.

Still blocked: approved hero-lock and production build/198route browser acceptance; actual patched PHP8.4/web configuration identity; deployed Apps Script/ACL/trigger/schema mapping; verified key custody and live-provider account/privacy authorization; connected staging and live Calendar/Meet/mail/rollback acceptance. Source-level fix is not live production acceptance. No approved hero hash activated; no production/main/recovery mutation. Release NOT_READY/NO-GO; global manifest STALE.

Follow-up: status now repairs a missing persisted event ID after successful authoritative readback, without reinsertion, and flushes durable event/state updates before confirmation. Added failing initial/final lead-persistence tests. A failed save cannot return confirmed success; later status reconciles the original event. All affected booking suites pass locally.

## Stage2: free-only provider routing and public bridge

Parent checkpoint:32a6e44adb71e5750a799e708717ca3c5268ec81. Added disabled-by-default OpenRouter protocol support: pinned :free IDs only, fixed endpoint, zero price limits, denied provider data collection, ZDR request, no upstream fallback and exact numeric zero returned cost. Account privacy settings and actual catalogue eligibility remain unverified. No candidate is enabled and no live quota consumed.

Public ask now accepts only an actual trusted server-configured private-runtime object; invalid configured routing fails closed rather than entering legacy fallback. Relevant redacted structured context, consent and field allowlist remain enforced. Three bounded provider attempts preserve questionnaire state. Daily application/IP counters use a separate private HMAC key, locking, durable counters and link checks; legacy counter permissions tighten without resetting counts.

PASS: npm test (20 JavaScript suites); PHP8.3.6 CLI tests sera-openrouter, sera-router-bridge, sera-request-budget, sera-provider-adapters, admin-provider-runtime, admin-public-config, sera-provider-transport; ask syntax. Component browser sera-runtime-browser.cjs passed with Chromium153/Playwright1.64.1/axe4.14.0. This is isolated fixture coverage, not production-build acceptance; 0/198 remains unchanged.

Independent key custody, actual web cURL/PHP identity, live provider eligibility/privacy and activation authorization remain BLOCKED. Next: pin new booking component manifest, complete CRM local workflows and reconcile243 rows; do not reuse historical package checksums.

## Stage3: operational CRM and current component packaging

LeadsDesk joins latest non-archived CRM records to the bounded recent200 leads. Added stage/date/notes/tags editing through existing server role/token/revision/audit contracts, duplicate-email hints without merging, stage/search/sort controls and formula-neutralized private CSV export. Unknown save acknowledgement retains entries and freezes payload editing; retry reuses the same operation ID. Cross-reference reassignment is rejected. This is owner-workspace authorization, not customer tenancy.

PASS: node tests/crm-workspace.mjs (fake Sheets); node tests/crm-browser.cjs (fake RPC, real Chromium, mobile320/tablet768/desktop1440, keyboard tab order, zero tested-state axe findings). Fixed select accessible name after first browser run; corrected browser fixture context for axe. No live Google authentication or production acceptance claimed.

New docs/v1/BOOKING-CANDIDATE.json pins booking source32a6e44. Historical candidate unchanged. npm run test:booking-release PASS: eight JavaScript suites and deterministic artifact/tamper tests. Initial run lacked src/app/lead-api.mjs in partial local snapshot; restored exact remote file, rerun passed without changing that source.

Next: reconcile all243 traceability rows and implementation ledger, add isolated lifecycle safety where contracts permit; full V1 is not complete. Deployment and live acceptance remain blocked.

## Stage4: quota-store and approved-runtime integration hardening

Provider ledger now requires private directory/regular0600 single-link file, rejects symlink ancestors/hardlinks, verifies opened inode identity and validates every stored quota/circuit counter before mutation. Corrupt metadata is not reset. New-file creation uses restrictive umask. PASS: sera-ledger-security.php, sera-provider-ledger.php, 20-process quota test (exactly3 reservations). Initial permission-change test exposed stale PHP stat cache; cache invalidation fixed and rerun passed.

Current public approved artifact is passed into trusted routing per request, so stale private-runtime snapshots do not freeze approved budgets/tone. Only fixed enum-derived tone enters provider system instructions; names/welcome remain data. PASS: sera-runtime-approval.php; affected adapter/runtime/bridge tests. No provider calls, credential activation or filesystem production changes.

## Stage5: requirements and release reconciliation

27/243 = 11.11% bounded local acceptance (previous22/243=9.05%);183 partial,2 missing,31 externally blocked. Production-build acceptance0/198. Manifest STALE; release NO-GO.

All243 statuses/source/evidence/action entries retained with separate UNVERIFIED production acceptance; five new bounded booking criteria promoted. Exact evidence JSON includes failed prerequisite runs and final reruns, not fabricated passes. Current source-seo/utility tests lack dist and remain blocked by approved build. New booking-only ZIP verified; no full V1 artifact produced. See IMPLEMENTATION-LEDGER.md for unfinished functionality and PRODUCT_ROADMAP.md for next local task.

## Stage6: bounded full-history CRM paging

Server snapshot/cursor pagination reads at most200 Leads rows per request, validates all cursor fields and never accepts a Sheet/file identifier. Older/Newer controls preserve snapshot row boundary across new appends; search/filter/duplicate hints are explicitly page-scoped. Dirty editing requires a navigation decision. Unit test visits500 records exactly once, excludes a later appended row until refresh, rejects invalid cursors and handles empty sheets. Updated CRM component browser checks older/newer navigation plus existing retry/filter/export/accessibility states PASS. Full-history search/export remains the next independent enhancement; no unbounded Sheet scans added.

No Hostinger tools or authenticated server configuration are available in this execution session; only read-only availability checked, no sign-in attempt/config modification. Existing reviewed evidence/owner procedure remains the path to runtime proof.

## Publishing checkpoint

Final rerun npm test21 suites and npm run test:evidence PASS. Current source byte hashes are in SOURCE-EVIDENCE.json. Provider account review candidates remain disabled, current official references recorded without inference calls. New r2 booking-only artifact changes notice to current V1 handoff; code source remains32a6e44. Full V1 artifact is not available. Next independent work is bounded cross-history CRM search/export and remaining183 requirement criteria; missing authenticated lifecycle operations remain P0. Do not describe this checkpoint as V1 complete or all local work finished.

## Stage7: bounded cross-history CRM search/export

Implemented in existing LeadsDesk: explicit batches of at most5 page reads/1000 records,8s per-read timeout, stable snapshot/cursor, preserved matches on error and retry from last confirmed page. At most500 matches; cap is explicitly incomplete and asks to refine search. Export shown filters rows already authorized/loaded, excludes private notes and formula-neutralizes cells; latest200 server export remains distinct. Mobile header wraps action controls.

PASS: crm-history-search.mjs (faults, cursors, caps, deduplication, CSV); crm-workspace.mjs (server source, including newline formula protection); updated real Chromium CRM fixture (interrupted search/retry, two exports, keyboard,320/768/1440,axe0 tested states). npm test22 suites PASS. Requirements remain27/243, not inflated for owner-admin features. Source byte hashes refreshed before publishing. Next: P0/P1 review of183 unresolved original criteria and safe lifecycle authorization/reconciliation contracts; keep missing lifecycle IDs and external acceptance blocked.
