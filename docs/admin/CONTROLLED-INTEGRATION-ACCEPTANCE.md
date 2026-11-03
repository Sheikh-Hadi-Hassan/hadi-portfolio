# Controlled booking acceptance — prepared, not authorized or executed

Execution is BLOCKED. Reuse OWNER-ACCEPTANCE.md and PHASE4-ACCEPTANCE.md evidence. All real operations need explicit owner authorization for named isolated resources/recipients. This plan grants no authorization.

## Preflight record (complete before a browser submission)

Record: approved source commit and artifact hash; production runtime/effective-config/deployed-source evidence references; approved test build; isolated Apps Script deployment/version; isolated Sheet and Calendar aliases/fingerprints and ACLs; execution principal alias; script and Calendar IANA timezones; start/end in UTC and local timezone with explicit offset; owner-approved customer/owner recipient aliases (resolve actual addresses privately); cleanup owner/window; test authorization reference and maximum one booking. Use a new run UUID in the display name/brief, booking idempotency key and all evidence. Verify the target slot is free without writing. Reject configuration that points at real customer lists, production lead storage or the normal working Calendar. Confirm actual mail destination resolution; test mode banners are not isolation.

Identity, permissions, sodium/cURL/TLS, selected configuration, cleanup and hero/build/browser gates must first pass. Owner must accept any remaining declared limits. Take isolated encrypted/config/source backups; no secrets in the report. Record expected current versions and known rollback target. Confirm deterministic manual booking remains available independent of Sera/AI consent. No failure injection against production or real recipients.

## One authorized happy path

1. Submit a clearly labelled synthetic inquiry from the isolated browser once. Record consent choice, service/answers, run UUID, browser request ID and idempotency key. Capture a redacted request/response and backend correlation ID; no authorization headers.
2. Inspect actual durable lead row and audit transition: same booking/request identifiers, persisted service/brief, selected slot and explicit timezone. A received/pending response is not confirmed. Close/reload UI as a read check; never create a fresh booking to query status.
3. Inspect the correlated Calendar event directly: unique event ID/booking marker, correct Calendar, start/end/timezone/UTC instant and customer/owner participant aliases. Search the test window for the run marker; exactly one event is required.
4. Inspect conference data: nonempty conference request ID, creation status success, actual Meet entry point/URI. An event ID without successful conference details is partial success, not confirmation.
5. Inspect customer and owner deliveries separately in authorized test mailboxes: matching run/booking/event IDs, timestamps and correct timezone/Meet details; record message IDs and received status. MailApp/provider acceptance alone is not inbox delivery evidence. Do not forward or send additional messages to prove delivery.
6. Reconcile browser/backend/lead/event/conference/both messages. Only mark confirmed when the actual contract's mandatory steps are confirmed. Record pending, failed or reconciliation-required truthfully; preserve original IDs and valid answers.
7. Resubmit the same authorized operation/idempotency key only within the approved test cap; verify same stored booking/result and exactly one event/notification per intent. A different payload with the same key must reject without changing the original. Do not generate a new key to recover an uncertain operation.

## Isolated failure/recovery matrix

Use deterministic mock transports/injected storage failures first; real provider failures require a separate isolated authorization. Preserve booking/lead/event/notification intent identities across process restarts.

|Scenario|Required result/evidence|
|---|---|
|Invalid payload / consent-independent direct booking|Field-specific error, no side effects; direct path never requires AI consent|
|Unavailable slot / duplicate clicks|Conflict or existing operation, no second event/notification|
|Provider timeout / lost Calendar response|Pending/reconciliation state, retained durable intent, query provider by correlation before any retry; never false confirmation|
|Calendar failure before creation|Stable failure or bounded safe retry using original identity, durable lead retained|
|Calendar succeeds / Meet pending|Same event preserved; no new event; partial-success status until resolved|
|Lead persistence fails|No downstream confirmation; clear retry/reconciliation depending whether persistence outcome is known|
|Customer or owner mail failure|Independent intent state; retry only known-unsent intent; retain other successful delivery|
|Crash after send before acknowledgement|Notification reconciliation-required; no automatic resend of ambiguous intent|
|Crash/reload during pending|Same request identity, answers and pending status restored; no duplicate side effects|
|Reconciliation failure|Remain pending/uncertain with diagnostic code and manual resolution; no silent retry loop|

Existing booking/notification tests cover mocks; retain their evidence. They do not establish real Calendar/Meet/mail acceptance. Cancellation/rescheduling requests remain requests unless separately authorized authenticated lifecycle contracts exist.

## Cleanup and rollback

Before cleanup, preserve redacted evidence; enumerate exact test lead row, event ID, conference and mail message IDs. Owner cleanup authorization must name those isolated objects. Remove/cancel only the one identified test event; cancellation may notify participants, so approve that notification behavior in advance. Do not blanket-delete by date/title. Delete or tag only the identified test lead/audit records according to the approved retention decision; do not invent a retention policy. Mail deletion is optional and separately authorized; received-message evidence remains redacted. Re-search the run marker and record remaining object count. Restore only changed isolated config/deployment/version if one was authorized, verify expected hashes and previous active pointers, disable test routing and revoke temporary tokens. No changes to the active production Apps Script or production files are part of this plan.

Final evidence: per-stage PASS/FAIL/BLOCKED, observed time, resource fingerprints, IDs, authorization reference, reconciliation state and cleanup results. Keep unverified stages BLOCKED. If uncertainty remains, stop further writes, preserve the original intents and reconcile; do not claim success from HTTP status.
