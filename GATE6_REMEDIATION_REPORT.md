# Gate 6 remediation report — source and booking integrity
Date: 2026-10-21 UTC
Decision: **NO-GO — implementation stopped at source-parity gate.**

## Scope and repository state
Production baseline: recovery/verified-production-20261021, c4097990bccabea53af798eaf80012c239d6a418 (1,768 sanitized deployed files).
Prior audit: audit/gate6-production-20261021, 016196b3289b621759848a19f6d32c672eba2e69.
Report-only branch: remediation/gate6-source-booking-20261021.
This report's containing commit identifies the report revision; application remediation commit: **none**.
No production backup was restarted. Prior QA findings were reused rather than represented as newly executed.

## Exact source investigation
The original Sites project appgprj_6ace6d4470d48191b519a987326e4c76 was opened through its supported source workflow, without save, push or deployment. Version 104 source is 66e3e1df67331a92b2966dcab9724e70c8f11d90. The retrieved repository contains 116 reachable commits and editable src/, build scripts, package-lock.json and integration candidates. A stray untracked temporary image was observed after checkout and left untouched; it was not treated as authoritative source.

The retained dist/ was compared by path and SHA-256 against all 1,768 sanitized production inventory entries:
- MATCH: 1,604
- DIFFERENT: 21
- MISSING from candidate dist/: 143

These are differences in the retained candidate output, not missing production backup files. They do not prove that a fresh build can never match; they establish that matching build provenance remains unverified.
Every reachable commit was sampled using dist/style.css, dist/appbar.css, dist/intellignce-support/widget-v9.js, dist/intellignce-support/ask.php and dist/index.html. Each path had zero checksum matches to production across the 116 commits. This sampling does not exhaust all possible source paths or unreferenced Git objects.
Objects 935cf06 and 0279f05 are unavailable in this retrieved history. The separate retained source bundle HEAD ebd3ae1d11a814179bc09db5a391b308d3429db9 is an earlier release candidate based on version 104, not an accepted production mapping. Its incomplete parent history was not substituted for the recovered Site history.

Version104 package pins Next16.4.0, React/ReactDOM19.3.0, GSAP3.15.0 and Three0.185.0. The production RELEASE-MANIFEST names version104 but is historically stale: its index/widget/style/ask fingerprints do not establish the captured deployment. A manifest label alone is insufficient.
Evidence: audit/gate6-remediation/source-parity.json and history-fingerprints.json. No application install/build or editable-source modification was performed after parity failed.

Required missing inputs: the editable inputs for the post-version104 production changes (including current widget/ask/style/appbar), exact build/packaging commands and toolchain, and a verifiable source-to-capture mapping. Supply the missing revision/export through supported project access; do not recreate it from the generated HTML.

## Apps Script Version 7 identification
The recovered version104 integration candidate integrations/calendar-v8/Code.gs has SHA-256 32a80a8b781992a306435e65597b0993bbe936d5aae3bef879b6fe56e42dad6c.
Historical recorded deployed Version7 Code.gs SHA-256 is b5c4baf9ac8ec4ed34fa86f4a8d4c33b21f616c43bf3c3c9299e19b6f877f96d. They differ. Eight distinct reachable integration Code.gs/manifest objects were inspected; none matched that historical Code.gs fingerprint. This historical fingerprint is not a fresh deployment attestation.

Google Drive discovery returned no accessible Apps Script MIME-type project. A separate Google Doc containing older script code was read; it is an editable document, not proof of immutable deployed Version7. No script source, tokens or customer rows from that document were copied into this report branch.
The candidate uses calendar sheikh.hadi.hassan@gmail.com, Asia/Karachi, advanced Calendar v3, and OAuth scopes for Sheets, Calendar, mail and triggers. Those are candidate settings, not independently verified active settings or ACLs.
Historical observations name execute-as sheikh.hadi.hassan@gmail.com and public web-app access. Active execute-as identity, calendar ID/permissions, Version7 source, deployment mapping, script properties, trigger configuration and execution logs remain **BLOCKED**. No authenticated Apps Script execution API is available in the exposed connectors. Earlier Gate6 browser access did not reach the authenticated editor; that completed failed investigation was not repeated.

Missing access: read-only access to the actual script project and deployment/version metadata; immutable Version7 Code.gs/appsscript.json; redacted configuration identifying intended calendar/principal (never API keys); execution/Cloud logs around 2026-10-20 16:11 UTC and the availability timeout; provider event IDs and matching CRM/outbox audit trail.

## Booking investigation: confirmed versus unknown
Confirmed from prior Gate6 evidence:
- Incident HADI-f603e552-3429-476f-a943-36ec896a1944 had confirmation/Meet evidence, with no overlapping event returned across 11 connected calendars for 21Oct12:30–14:00 Asia/Karachi. This does not prove no event ever existed elsewhere or at another time.
- Captured PHP gateway forwards provider responses and preserves uncertain writes as pending; it does not independently read Calendar.
- Captured widget accepts booked/booking=true with a shaped reference without event ID. Its local no-network fixture was rerun in this task and again displayed “Your call is reserved. The Google Meet link is ready below.”
- Prior availability lookup timed out; it was not repeated.

New candidate-only static findings:
- Calendar reads use one bounded retry; lock acquisition is 1.5s. Insert uses deterministic event ID; duplicate/retryable insertion failures attempt readback and otherwise return pending.
- Successful insert results flow directly to Booked/bookingResult_ without an unconditional subsequent authoritative GET and full identity/time/reference validation.
- Outbox independently retrieves the event, handles cancelled/missing events and waits for Meet readiness before notifications. Meet URL alone does not establish the intended Calendar event.
- Older Google Doc candidate has a Booked-row short circuit returning booking=true without Calendar readback.
These are review findings in unverified candidates. They are not established causes of the live incident.

Still unknown: which code executed; actual insert response; target calendar and ACL; event deletion/cancellation; quota/provider errors; time-zone interpretation; Meet state; CRM/outbox order; gateway versus provider latency. No root cause is claimed without logs.

Required correction once exact source and safe staging are verified:
Return CONFIRMED only after authoritative Calendar GET in the intended calendar verifies deterministic ID, expected private reference, noncancelled state, start/end/timezone contract and request identity. Track event reservation separately from pending/failed Meet creation. Persist idempotency state before notifications; reconcile uncertain writes with the same request ID. Never retry insertion blindly or use email/CRM state as Calendar proof. Enforce the contract on backend; a client eventId check alone is insufficient.

## Staging and focused-test status
| Check | Result |
|---|---|
| Original Site metadata/source retrieval | PASS |
| Candidate retained-output versus production inventory | FAIL parity: 1604 match /21 differ /143 absent |
| Reachable history fingerprints | PASS investigation; no sampled matching revision |
| Candidate script history versus historical V7 hash | No match; active version BLOCKED |
| Captured widget no-event-ID fixture | Reproduced acceptance; no network/provider action |
| Booking success/provider failure/timeout/duplicates/retry | BLOCKED against matched application/provider |
| CRM persistence and reconciliation | BLOCKED; no isolated test store |
| Sera boundaries and affected navigation | BLOCKED for remediation regression; prior findings retained |
| Gallery defect fix and browser regression | NOT IMPLEMENTED; source parity gate failed |
| Real Calendar/Meet/mail/CRM integration | NOT EXECUTED |
| Isolated full staging | BLOCKED: matching source and dedicated test identities/calendar/CRM/mail missing |

Mocks were not claimed to prove production integrations. No live booking, customer email, CRM write, Apps Script trigger/deployment change, merge or production deployment occurred.
Once unblocked: use a separate service identity/test calendar, isolated Sheet/CRM and email sink, with production keys absent. Freeze fixture time and request IDs. Cover success plus verified GET, insert succeeds/readback fails, permission/quota failure, timeout before/after insert,409duplicate, reused ID with changed payload, retry/status reconciliation, CRM failure, Meet pending/failure, notification ordering, Sera injection/consent/fallback and click/tap/keyboard navigation.

## Gallery
Prior Gate6 twice reproduced Morganics pointer activation ending at AlFaraj; keyboard Enter reached Morganics. No new reproduction or fix is claimed. Moving transforms/hit areas are hypotheses. After parity, capture pointerdown/up target/coordinates and settled geometry locally, reproduce during motion, fix only the confirmed hit-testing mechanism, and test mouse/touch/keyboard with animations and reduced motion preserved.

## Social-preview/favicon branch review
Reviewed feat/social-preview-image-20261021 at e87540a329a2218404994a6d2fc53174d2f7ff78, its change guide and GitHub comparison. It is three commits ahead of the exact baseline,88 changed paths. No PHP, API, widget, script.js or .htaccess path is changed in the comparison. This is a path-scope review, not fresh image decoding/checksum or crawler certification.
The branch contains exported HTML/navigation metadata patches, wide1200x630 PNG, square1080 JPEG, portrait1080x1350 JPEG, ICO/PNG icons and180px Apple icon. No deployment performed.

Safe integration sequence for later separately approved release:
1. Resolve source parity and freeze the new source branch.
2. Apply metadata/icons in the matching editable source; carry supplied artwork with its recorded hashes, preserve titles/canonicals/noindex, mirror navigation metadata through the normal build.
3. Review all changes versus baseline and verify branch change inventory; run build and public-route metadata/navigation checks in staging. Do not blanket cherry-pick generated artifacts over a different build.
4. After owner approval, publish assets before referencing metadata; verify HTTPS200, MIME, dimensions, canonical metadata and icons, then inspect LinkedIn/social caches.
5. Roll back only the release's changed files from its immediately preceding verified capture. Search/social engines choose thumbnails; no promise of universal image display.

## Files changed, compatibility and rollback
Application files changed: **none**. This report-only branch adds GATE6_REMEDIATION_REPORT.md plus source-parity.json, history-fingerprints.json, candidate-script-fingerprints.json and script-history.json under audit/gate6-remediation/.
No remediation build or deployment compatibility claim is made. Existing production subtree and all recovery/restoration documents are inherited unchanged from the Gate6 audit commit.
Rollback for these documentation changes is simply to retain/use the prior audit ref. Production recovery remains baseline c4097990bccabea53af798eaf80012c239d6a418; preserve private configuration separately and follow its restoration documentation. Restoring web files does not restore Apps Script deployments, triggers, Calendar data or CRM state.

## Owner review and unblock order
P0: recover exact post-v104 editable inputs/build mapping and immutable active Apps Script evidence.
P0: identify incident event/identity/calendar/log chain; enforce authoritative Calendar confirmation in verified source and isolated staging.
P1: fix gallery hit testing and availability latency from reproduced evidence; run focused failure/retry/persistence/security tests.
P1: integrate social/favicon only through reviewed source/build and a separately approved release.
**NO-GO remains. Implementation stopped because the user's source-parity prerequisite is unmet. No Prompt7 or next gate is authorized by this report.**
