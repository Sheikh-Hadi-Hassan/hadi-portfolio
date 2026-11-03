# Booking lifecycle contracts: missing acceptance and safe boundary

|Stable ID|V0.1 requirement|Current status|Exact gap|
|---|---|---|---|
|PV-474D07E1|Rescheduled booking lifecycle|Missing|No verified authenticated command, atomic availability recheck/update or notification/recovery contract|
|PV-15E525B9|Cancellation authorization and lifecycle|Missing|Provider-cancelled recognition exists; authorized cancellation command and audit workflow do not|

Both remain V0.1. They are not moved to future scope. No public mutation endpoint or live provider change is introduced.

Proposed command contracts for review: `cancel(reference, operationId, expectedRevision, reason)` and `reschedule(reference, operationId, expectedRevision, newStartUTC, visitorTimezone)`. Identity must come from a verified server-side owner session or an approved expiring booking-scoped customer credential, never from body fields. Reject unknown reference, unauthorized identity, stale revision, malformed time and mismatched reuse of operationId. Duplicate identical commands return the saved result. Serialize changes for the appointment; reschedule rechecks free/busy while excluding only the original event, updates the original event, preserves the lead reference and records old/new times. No replacement event may be created after an ambiguous update response.

Cancellation becomes cancelled only after the persisted command and provider state reconcile. Rescheduling remains pending while update identity/time is unverified. Notification intents follow the durable no-auto-replay policy. Preserve prior state, actor, operation ID, timestamps, provider evidence and outcome. A timeout is unknown, not a failed/cancelled/successful action. Retries must read the original event/operation before writing again.

Required decisions/evidence: permitted actors (owner only versus customer), credential expiry/revocation policy, cancellation notice rules, reschedule limits, verified active Calendar/deployment identity and approved integration compatibility. Backend identity evidence is already an external gate. Those are prerequisites to exposing real lifecycle commands, not reasons to remove the requirements.

Required isolated acceptance: unauthorized and expired credentials rejected; same operation replay creates no extra mutation; changed replay payload rejected; stale version and conflicting slot rejected; cancel/update response loss reconciles original event; provider refusal preserves prior state; partial notification delivery does not auto-replay uncertain recipients; audit history contains no secrets. These scenarios are specified, not claimed executed.
