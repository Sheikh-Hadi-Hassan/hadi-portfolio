# Provider activation remains blocked

Gemini/Groq backend protocol adapters have fixed HTTPS URLs, bounded context/output/timeouts, JSON validation and redacted error codes. They reuse the existing router in fake-transport tests. There is no default transport, public connectivity endpoint, credential-write API or live gateway wiring. Missing storage attestation rejects construction before credential resolution. Disabled, paid, unverified or privacy-ineligible configurations cannot call an adapter.

Credential fields and enabled=true remain rejected by the workspace. No keys are stored in Sheets, repository, browser storage or logs. Encryption, rotation, revocation and credential connectivity workflows are NOT implemented or accepted: independent key custody on actual hosting is unavailable. A boolean integration gate is not evidence of secure storage.

The private usage-ledger foundation uses flock, fsync, bounded metadata, pre-call debit, no refund on uncertain outcomes, and a two-failure/60-second circuit. Callers must supply verified quota period IDs; no daily/monthly reset is guessed. Twenty independent PHP processes under a quota of three accept exactly three reservations. Empty/corrupt ledgers fail closed. Prompts, replies, secrets and invented token/cost metrics are not stored. Actual hosting filesystem durability, permissions, private path and operational reconciliation still require acceptance.

Official protocol/plan references reviewed earlier in this phase on 2026-11-03:

- https://ai.google.dev/api/generate-content
- https://ai.google.dev/gemini-api/docs/pricing
- https://console.groq.com/docs/openai
- https://console.groq.com/docs/rate-limits

Public documentation establishes API/plan existence, not the owner's account entitlement. Gemini free-tier data-use conditions require privacy review; Groq exact organization limits require account evidence. Zero model configurations are newly enabled or certified. Tests use fixture-model-only and synthetic keys with fake transport. No live quota consumed.

Owner evidence needed: actual web PHP/cURL/TLS, independently protected authenticated-encryption master key outside document root, access/backup/rotation/revocation policy, free unbilled model/account eligibility, privacy/region/terms, verified quota/reset rules and hard paid-inference budget zero. Then implement the reviewed encrypted store and bounded HTTPS transport, wire ledger/adapters behind consent, authorize connectivity and run evaluations. Do not paste keys into chat or exports.
