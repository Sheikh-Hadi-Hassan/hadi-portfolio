# Notification reconciliation

MailApp has no application-supplied idempotency key or atomic transaction with Sheet delivery metadata. Exactly-once delivery cannot be proven by a successful function return.

The source now persists a per-recipient, per-purpose delivery intent in column 18 and flushes it before attempting mail. Known completed recipients are skipped. An intent without a recorded acknowledgement stops automatic resend with DELIVERY_UNKNOWN. The outbox marks manual reconciliation and stops the job; the row retains intent evidence. A quota failure before intent remains safely retryable. A failed intent write never calls mail. Corrupt metadata also stops delivery rather than treating it as an empty history.

Consequence: a crash before transmission can also leave an unresolved intent. This conservative choice can delay or omit mail until an owner reconciles it. It prevents automatic duplicate attempts; it does not prove receipt or remove provider/Calendar invitation uncertainty. Calendar sendUpdates notifications remain a separate provider-controlled delivery path.

Owner-only reconciliation, after deployment approval: preserve the row and job/log evidence, compare the reference/recipient/purpose with authorized mail/provider delivery evidence, record the decision and actor. Mark delivered only with evidence. If delivery cannot be established, do not clear the intent to force automatic retry. Any deliberate replacement message needs explicit owner approval acknowledging possible duplication. No automated reset or public replay endpoint is provided.

Local tests: tests/notification-crash.mjs exercises failed intent persistence, lost post-send acknowledgement, quota-before-send retry, and skip-on-completed delivery. tests/booking-recovery.mjs checks uncertain partial delivery does not automatically resend. No live mail is sent by tests. Live storage durability, execution overlap and provider delivery remain acceptance gates.
