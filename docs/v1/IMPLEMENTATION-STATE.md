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
