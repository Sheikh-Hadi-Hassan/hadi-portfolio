# Booking-only release readiness — 2026-11-04

**Decision: NO-GO for production deployment now.** This is an independently bounded candidate, not a requirement to finish the Business Control Center. Code and local mock tests cannot establish what Google/Hostinger currently execute. No deployment, trigger installation, booking or email was performed.

## Exact candidate and exclusions

Inspected branch HEAD: `1d4ea2a51a01502feab50bb2ea5a358173aa6f67`. The candidate source is frozen at that commit:

|Artifact entry|Repository source|Deployment role|
|---|---|---|
|apps-script/Code.gs|integrations/calendar-v8/Code.gs|Only proposed production change: update this file in the **verified existing booking project**, then a numbered version on the same existing web-app deployment|
|review/appsscript.expected.json|integrations/calendar-v8/appsscript.json|Comparison only; never automatically replace manifest/scopes/services|
|release.json; READ-ME-FIRST.txt|Fixed builder metadata/notices|Review only; do not upload to hosting or add as script files|

Code SHA-256: `b69db08a3819c38a2f240585cf0a7222bf7b9b246c874bb1045726284e621382`. Both existing Code.gs source copies are identical and match the inspected remote Git blobs. CANDIDATE.json pins source/mirror/manifest hashes. STAGING-ARTIFACT.json records deterministic ZIP SHA-256 `8d9ede9b82a6202c6f4bab022710eb16e3d6f70a6003294bfd0bcb387f5602dc`, prepared locally at `/tmp/hadi-booking-phase5/staging/booking-candidate.zip`. No package has been uploaded. Reproduce with an unused absolute output path:

```sh
python3 scripts/booking-release/package.py /tmp/hadi-booking-phase5/staging/booking-candidate.zip
npm run test:booking-release
```

The builder never overwrites an existing artifact; choose another unused filename to reproduce. Its checksum establishes artifact integrity, not owner approval or cryptographic release authorization. The archive contains original resource settings; **do not execute it against staging before isolated Sheet/Calendar/recipient settings are reviewed**. Do not run setup/activateSetup from the archive.

Excluded: all PHP files/private configuration, consultation.php, frontend/widget aliases, public Sera/AI providers/vault, hero/locked inputs, CMS/admin/CRM code, static site output, Sheet records and existing Calendar events. No paid service or database is introduced. Unfinished Studio/provider custody/CMS publishing are not prerequisites for this candidate. Existing booking API-key custody/private config still must pass.

Hero approval/full Next build/198-route export are **not applicable to this source-only Apps Script artifact**, because no frontend build or protected input is released. The existing hero guard is untouched and full-portfolio coverage stays0/198. A frontend/PHP/config change would expand scope and require a new assessment; do not add one to this ZIP. PHP8.4 remains the project target: actual patched web runtime, cURL/TLS/config and gateway compatibility remain unverified. This package neither switches PHP nor claims PHP8.4 acceptance; any PHP switch/replacement requires separate tested approval.

## What exists and what is verified

|Area|Implementation / evidence|Missing acceptance|
|---|---|---|
|Booking API|Existing /api/leads.php forwards four public actions to keyed Apps Script; strict Origin, size/UUID checks, honeypot, IP-HMAC80/10min limit, bounded timeout, pending semantics|Live code/config/SAPI/permissions/TLS/rate-store evidence. Origin is not visitor authentication; direct HTTP clients can forge it|
|Google authentication|Script checks private API_KEY before handling; script lock serializes own writes|Actual project/executing principal/deployment/access/key-loader identity; no end-user accounts assumed|
|Persistence/idempotency|Stable UUID/reference/fingerprint; durable lead before Calendar call; derived event ID and mismatched retry rejection|Actual existing row schema/backlog and old-record compatibility|
|Calendar/Meet|Live free/busy recheck under script lock; insert with conferenceDataVersion1; status correlates lead/event/start; pending/failed Meet never confirms|Real permissions, actual event/Meet and source revision. Other Calendar writers can race free/busy+insert; no global atomic reservation guarantee|
|Customer confirmation|Calendar attendee invitation requested with sendUpdates=all; no extra custom customer email added|Actual received Calendar invitation, correct time/Meet and invite-update behavior. Requested is not delivered|
|Owner notifications|MailApp outbox; per-recipient intent before send, known-sent skip, ambiguous send quarantined|Actual trigger identity/state, mail quota and both approved owner deliveries. Calendar-booked does not mean all mail delivered|
|Frontend compatibility|Current source client rejects partial confirmation; preserved PHP backup already fails legacy pending results safely|Current live widget/API hashes and isolated replay of the exact deployed client. No frontend change is included|
|Rollback|Source candidate and deterministic artifact prepared; local failure/recovery tests pass|Existing numbered Google version/source, same deployment identity and tested isolated rollback availability|

Observed candidate PHP vs **preserved** gateway difference is audit logging only. The preserved gateway already has protocol8/legacy pending guards. This supports excluding the PHP logging change; it is **not fresh production parity**. Actual Apps Script delta is UNKNOWN until its deployed numbered source is supplied. If that source already contains these fixes, do not redeploy unnecessarily.

## Mandatory deployment gates

|Gate|Now|Required evidence / responsible action|
|---|---|---|
|Live source parity and minimal diff|BLOCKED|Owner: exact gateway/client hashes and deployed numbered Script source, all project files/global names, current release/version. Codex: compare to this pinned source; preserve unrelated project files|
|Host runtime/private config|BLOCKED|Owner: existing reviewed-kit/request-level evidence for web PHP/SAPI/cURL/TLS/extensions/restrictions, actual selected private path and deployment-ID fingerprint, modes/owner, prior diagnostic cleanup. No new diagnostic is authorized|
|Google identity and permissions|BLOCKED|Owner: actual matching deployment/version/execute-as/access; Calendar/Sheet fingerprints, timezones, write/conference/mail scopes/services and quotas. No permission broadening or secret values in report|
|Data/schema and queued operations|BLOCKED|Owner: current Leads headers match all18expected columns without collisions, row count, delivery-metadata compatibility, JOB_ backlog and existing outbox triggers. No blind setup or header overwrite|
|Connected isolated staging|BLOCKED|Owner: authorize an isolated project/Sheet/Calendar and test mailboxes with explicit recipient resolution. Codex: test actual gateway/client chain and rollback there. Source contains production-oriented defaults, not a safe staging configuration|
|Backup and rollback|BLOCKED|Owner: preserve current numbered deployment/source/manifest and private property backup securely, trigger inventory, encrypted Sheet/metadata snapshot and tested previous-version recovery. Never return secrets or overwrite live rows from a snapshot|
|Release authorization|BLOCKED|Owner: explicitly approve the exact source hash/version/deployment diff and one QA booking/recipients/cleanup. Approval of this assessment is not deployment approval|

The verified recovery commit c4097990bccabea53af798eaf80012c239d6a418 is preserved. It cannot substitute for a fresh pre-change Script/Sheet/trigger backup or prove today's live source. Global release manifest remains STALE; no atomic portfolio requirement is promoted.

## Isolated staging sequence

1. Verify source identities first. Use a separately approved isolated Apps Script/Sheet/Calendar with restricted ACLs and approved mailboxes. Privately map all Script Properties and source SETTINGS to those resources; ensure no source default/fallback targets production. Record fingerprints of the staged overrides and effective principals. Keep the production configuration unchanged.
2. Start from an isolated clone of the **actual deployed** project, including its existing manifest/trigger configuration. Diff only the pinned Code.gs changes; review any global-name conflicts. Validate the18-column schema against representative redacted old rows. There is no SQL migration. Missing/conflicting Sheet columns require a separately reviewed reversible append/mapping plan; setup overwrites headers16–18 and is not an approved migration.
3. Install only the minimum already-approved services/scopes. Do not blindly follow legacy integrations/leads/SETUP.md: it creates projects/keys, runs setup and suggests outdated runtime/trigger steps. Do not rotate API_KEY/SHEET_ID, create production triggers or enable services as a side effect of this repair.
4. Reproduce the package/source hashes, run local tests, then exercise the **actual** existing browser → PHP → deployed test Script → persisted lead → Calendar → Meet → mail flow with a single QA identifier. No mock counts as this gate. Test legacy and protocol8 pending handling with the exact live client/gateway; verify unaffected enquiry behavior. Maintain original UUID across retries and query status before another write.
5. Inspect actual lead/event/timezone/conference identities; independently inspect customer Calendar invitation and owner mail receipts, not HTTP200 or MailApp return values. Observe trigger completion/known-sent skip. Use mocks for crash/failure injection, never disruptive production injection.
6. Test the previous Script version/rollback in isolation without deleting row/event/intent state, verify expected source/version and that no new lead/event/mail intent is replayed. Record results and cleanup. If any required gate fails, remain NO-GO.

## Approved production procedure (not executed)

After every gate passes, request approval naming this source commit/hash and exact **existing** deployment/project/version. Prepare a brief booking-only change window with pending requests accounted for; preserve contact enquiries and the rest of the site. If a safe booking-only pause is needed but no approved control exists, design/review it separately rather than disabling the shared enquiry endpoint.

1. Record preflight hashes/version, Sheet row count/headers, trigger inventory and pending/uncertain intents. Securely preserve deployed source/manifest/properties and data backup. Do not copy private config into the package or repository.
2. Apply only reviewed Code.gs to the existing verified booking project, preserving other files, resources, manifest and properties. Create a numbered version, update the **same deployment** to it, then read back version/source identity. No PHP upload, static build, new /exec URL, API-key rotation, setup call or trigger duplication is included.
3. Resume only existing verified triggers after inspecting queued work and compatibility; old queued intents must not be blindly drained/resubmitted. Monitor sanitized logs and reference-level status. A rollback decision stops new booking writes through the approved booking-only control; do not disrupt contact enquiries.
4. Perform read-only smoke checks: homepage/Sera/contact load, gateway readiness, exact version/config identity and availability. Readiness/availability do not prove booking. Then execute the single separately approved QA test below. Pause and reconcile any uncertain result; do not generate a second UUID to obtain a successful screen.

## One QA booking and cleanup

Record approved runUUID/idempotency key, QA label, customer/owner mailbox aliases, time/offset/IANA zone, isolated staging results and cleanup owner before starting. After deployment approval, submit once through the actual existing browser. Verify: response reference; durable row/brief; same deterministic Calendar event ID and actual start/end; conference success/Meet URL; customer invitation received; each owner email received. Record message IDs/timestamps privately, with sanitized aliases in the report. Pending stays unconfirmed; mail delivery remains separately pending if not evidenced. Reuse the same authorized UUID only for the approved duplicate/status check and verify exactly one row/event and each notification intent once.

Preserve redacted audit evidence. Cleanup **only** the positively identified QA event and QA lead row after approval, preserving other rows, existing appointments and necessary reconciliation/audit history. Event deletion/cancellation can notify attendees, so approve that behavior for the named QA recipients in advance. Re-search runUUID and record results. Before cleanup, verify the matching JOB_ intent has completed and no lease/notification reconciliation is outstanding; otherwise removal can provoke later review emails. Do not physically delete a Sheet row while queued jobs store row-number pointers: shifting later rows can associate jobs with the wrong lead. Use an owner-approved exact-record logical cleanup with reference/audit retained, or separately prove safe row-index handling before physical deletion. If this cannot be established, report QA cleanup BLOCKED and retain the isolated QA record for reconciliation. Do not bulk-delete by date/name, reset global queues or delete arbitrary inbox messages.

## Rollback

Before deployment, record the previous immutable Script version and verify it can be selected on the same deployment. On failure, use the approved booking-only control, reconcile operations begun under the new version, select the recorded previous version on that same deployment and read back its source/version. Restore only configuration/trigger changes that were specifically authorized; this scope plans none. Never restore an entire old Sheet snapshot over newly received leads or reset idempotency/delivery metadata. Preserve confirmed event IDs and uncertain intents for reconciliation; never recreate events or resend ambiguous mail as part of rollback. Verify old-version schema compatibility before releasing pending work. If rollback cannot be verified, keep booking paused and escalate; do not report recovery from a successful UI click alone.

## Decision rules

GO requires all mandatory gates and isolated real integration/rollback evidence, then explicit production approval. CONDITIONAL GO may describe a completed technical release with narrowly named operational conditions, but it must not conceal unverified backend identity or unsafe data/notification behavior. **Current decision is NO-GO** because these mandatory identities, data/queue compatibility and connected staging evidence are absent. The remaining blockers are booking-specific, not unfinished Business Control Center features.

## Phase6 evidence reconciliation — 2026-11-04

All three named historical Library reports were read and reused. They explicitly leave web runtime/effective config/active Apps Script identity blocked. New read-only metadata/header checks establish access to the candidate Sheet and Calendar through connected accounts only;17/18Sheet labels match, A1 differs, active Script mappings/ACLs/trigger state remain unverified. No customer rows or events were read, no mocks/recovery comparisons repeated, no approved staging resources supplied.

The historical Gate6 contract adds an unresolved **P0 source acceptance gap**: this frozen candidate can report booked from an insert response without unconditional authoritative GET and complete deterministic ID/private-reference/start/end/time validation. Existing status correlation/outbox reads do not fully close it. Do not interpret old mock passes or newly supplied identity evidence as satisfying that criterion. Candidate/package hashes remain unchanged; no silent source replacement or package rebuild. See PHASE6-RECONCILIATION.md and PHASE6-EVIDENCE.json. Deployment, connected staging and rollback acceptance remain NO-GO/BLOCKED.
