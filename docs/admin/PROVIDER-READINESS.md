# Provider readiness — documentation checked 2026-11-03

Two independently hosted adapters are mock-tested; **zero live providers enabled**. provider-candidates.json is a review artifact, not automatically imported runtime configuration. All eligibility/privacy/account/evaluation/activation flags remain false, remaining=0, account quota=null and paid budget=$0.

|Candidate|Official evidence|Decision|
|---|---|---|
|Gemini gemini-2.5-flash-lite|Pricing lists standard free input/output. Account/project quotas must be obtained from AI Studio, not guessed. Unpaid terms allow product improvement/human review, prohibit sensitive/confidential/personal submissions, and require paid service for EEA/Swiss/UK users.|Disabled. Owner must resolve intended audience/region and data-use eligibility without enabling paid inference; a global free rollout is not approved. Consent alone is insufficient.|
|Groq openai/gpt-oss-20b|Listed production model; Free Plan reference table lists 30 RPM, 1000 RPD, 8000 TPM, 200000 TPD. Limits are organization-wide; account console is authoritative. Current data policy permits abuse/reliability retention up to30 days; ZDR is a configurable control requiring verification.|Disabled. Verify actual free account entitlement, shared organization budgets/reset, data controls and model evaluation before any live authorization.|

Groq's current model page labels the older llama candidates Enterprise; no legacy free-tier assumption was retained. The chosen GPT-OSS candidate supports structured outputs; current adapter uses JSON object mode with strict local response validation, not a promise of provider schema adherence. Namespaced Groq IDs are now accepted in the JSON body; slash/traversal identifiers remain invalid for Gemini URL paths. Output cap400 and context cap12000 characters remain application limits, not verified provider token counts. No fabricated token/cost measurements.

Runtime still gates custody/activation/consent/privacy/free/unbilled eligibility, bounds attempts, reserves quota durably before requests and retains uncertain outcomes. Exact account RPM/TPM/RPD/TPD windows/shared-project usage and reset handling must be configured and independently reconciled before rollout; the existing explicit quota-period ledger is not automatic account-wide quota discovery. It is unsafe to distribute full per-account allowance independently to each model. Missing live networking, quotas, privacy enforcement and provider evaluation remain P0 activation blockers. Questionnaire and deterministic briefs remain usable without inference.

Primary references, reviewed read-only (no API calls):

- https://ai.google.dev/gemini-api/docs/pricing#gemini-2.5-flash-lite
- https://ai.google.dev/gemini-api/docs/rate-limits
- https://ai.google.dev/gemini-api/terms
- https://console.groq.com/docs/models
- https://console.groq.com/docs/rate-limits
- https://console.groq.com/docs/structured-outputs
- https://console.groq.com/docs/your-data

Revalidate at activation; published availability is not account entitlement or guaranteed capacity. Do not enable more models just to fill a registry.
