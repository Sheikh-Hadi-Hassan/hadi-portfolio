# Owner booking lifecycle, local acceptance

Implemented in BookingOperations.gs/HTML, using existing ccActor_/ccGuard_ owner authorization and expiring mutation tokens. Added to the existing Flow Leads menu. Public doPost and its shared API key are unchanged and cannot cancel/reschedule.

Workflow: owner reference/action -> five-minute owner-bound preview -> explicit confirmation -> ScriptLock -> rechecked event identity/ETag/availability -> flushed operation intent -> conditional Calendar PATCH -> authoritative GET -> original Leads synchronization -> completed journal. Unknown network/storage outcomes remain reconciliation_required. Reconciliation/replay never repeats the PATCH. Historical completed records are labelled historical. Calendar notification delivery stays unknown; no MailApp send or event insert is introduced.

Important concurrency requirement: this module refuses a separate admin Script project. The actual booking save_/SETTINGS/HEADERS/meeting_ functions must be present in the same project, the private policy must match them, and configured Leads must be the bound spreadsheet. This makes the existing public booking ScriptLock and owner changes share one lock domain. If-Match protects external event edits; a post-write availability check quarantines detected competing external events. No universal Calendar exclusivity is promised against future manual/external writes.

The known historical A1 header discrepancy is not repaired automatically: exact18-column mismatch blocks operations. Do not rewrite live headers without approval. Journal headers also fail closed. No-op reschedules and unverified Meet conferences cannot request another update.

Actual tests: node tests/booking-lifecycle.mjs; real Chromium tests/booking-lifecycle-browser.cjs. The browser uses the actual UI, ccGuard_/role checks, journal and public status code over a local RPC transport with fake OAuth/Calendar/Sheets. Tests cover owner/editor/viewer/stranger, token/confirmation/preview expiry, conditional412, busy/paginated availability, missing writer, header mismatch, wrong operation marker, interrupted PATCH/readback, initial/final flush failures, one original event, reload history, keyboard,320/768/1440 and axe0 tested states. Not deployed Google authentication, mail delivery or production-build coverage.

Activation prerequisites, no action authorized here:

1. Accept deployed source identity, effective runtime/config, Sheet18-column schema, Calendar permissions, trusted owner-only container ACL and cleanup evidence.
2. Prepare an explicitly approved isolated co-located Script/Sheet/Calendar with approved synthetic recipients. Do not merge existing production admin/booking projects or install into the active deployment automatically. Existing split topology remains untouched and cannot enable this module safely.
3. Review the actual manifest and grants. Calendar/Sheets access, Session active-user identity, UrlFetch script.external_request and container UI access are required. Reconcile existing grants; do not replace the manifest or grant scopes automatically. Blank Session identity is denied.
4. Configure private BOOKING_OPERATIONS_POLICY with calendarId, timezone, duration, noticeMinutes, horizon, startHour, endHour and days matching the actual booking SETTINGS. Keep BOOKING_OPERATIONS_ENABLED absent/false until deployment/topology/security acceptance and explicit activation approval. No credentials or OAuth token enter Sheets/browser configuration.
5. Run isolated create -> reschedule -> authoritative event/Meet/time/lead proof -> cancel -> same ID/status -> notification evidence. Separately test uncertain outcomes and preservation of prior records. A browser JSON result is not email-delivery proof.
6. Disable operations before rollback. Keep the journal, request IDs and existing appointments. Code rollback does not undo Calendar changes or unsend mail. Reconcile each uncertain operation before any further change. Never clear the journal to permit a retry.

Official contracts reviewed read-only on2026-11-09:
https://developers.google.com/workspace/calendar/api/guides/version-resources (If-Match/412);
https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app (fixed HTTPS transport and external request scope);
https://developers.google.com/apps-script/reference/base/session (active identity limitations).

Both PV-474D07E1 and PV-15E525B9 now have working owner-only local implementations/tests. They remain Partially implemented until full required integration/operational acceptance; no verified credit is added. Full V1 remains NO-GO, manifest STALE, production-build browser0/198.
