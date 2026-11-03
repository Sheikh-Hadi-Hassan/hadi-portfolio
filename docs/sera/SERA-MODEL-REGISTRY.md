# Model registry / zero-paid policy

New enabled remote configurations: 0. No model IDs, quotas or free eligibility invented. Target 10–12 is a future verification target, not an implemented count. Existing ask.php has a Gemini model pool and requires enabled + unbilled_project_confirmed; current model availability/terms and production account configuration are not verified here.

The new PHP policy excludes disabled, unknown-free, billed/paid, exhausted, unsupported-capability and open-circuit entries. Max attempts is clamped to three; context is limited to 12 KB and adapter output to 400 requested tokens/2,000 response characters. No project dependencies added. Mock failover and all-unavailable fallback pass. Durable quota resets, health/circuit updates, usage/cost accounting, provider request deduplication/caching and live HTTP adapters remain work. No claim of identical output quality, unlimited free inference or active multi-provider routing.

Existing Gemini backend now uses bounded relevant retrieval; the new multi-provider policy core still has no active adapters. Token budget reductions are configured limits, not measured provider usage or cost savings.
