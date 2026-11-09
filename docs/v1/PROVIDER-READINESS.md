# Disabled provider readiness, 2026-11-09

No live calls, keys, quotas or paid inference were activated. PROVIDER-CANDIDATES.json is review metadata, not a loadable production registry. Account eligibility, privacy and secure custody remain unverified.

|Adapter|Officially documented candidate|Still required|
|---|---|---|
|Gemini|gemini-3.5-flash-lite is listed with free input/output tier|Actual unbilled account/model/region/quota eligibility; owner decision on free-tier product-improvement data use; isolated evaluation|
|Groq|openai/gpt-oss-20b is listed in Free Plan rate limits; JSON object mode supported with separate schema validation|Organization limits and billing state; data-controls/ZDR decision; model evaluation|
|OpenRouter|Only a separately listed :free catalogue variant is accepted by adapter; no model selected|Exact currently eligible catalogue entry and compatible endpoint; account privacy/ZDR/SafetyRetention settings, quotas and evaluation|

Official references reviewed read-only:

- https://ai.google.dev/gemini-api/docs/pricing (free-tier data-use distinction and model listing).
- https://console.groq.com/docs/rate-limits (organization-level, account-specific limits;429 handling).
- https://console.groq.com/docs/structured-outputs (JSON object mode does not guarantee schema; local validator remains mandatory).
- https://console.groq.com/docs/your-data (metadata retained; reliability/abuse retention controls and optional ZDR require account review).
- https://openrouter.ai/docs/guides/routing/model-variants/free (:free must exist as catalogue entry; paid fallback arrays can charge).
- https://openrouter.ai/docs/guides/routing/provider-selection (zero price bounds, data collection and ZDR filters; account SafetyRetention settings can affect eligibility).
- https://openrouter.ai/docs/api/reference/limits (actual account/reset requirements remain unverified).

Routing sends no tools/plugins/grounding/batch requests. OpenRouter additionally forbids upstream fallback, sets max_price prompt/completion/request0, requests data_collection=deny and zdr=true, and rejects missing/nonzero numeric cost. A returned zero is response validation, not independent billing evidence. No unlimited free or universal privacy guarantee is made.

Gemini/Groq/OpenRouter use fixed HTTPS destinations, strict JSON response contracts, bounded context/output and at most3 attempts. Unknown requests consume durable quota; corrupt quota metadata fails closed. A separate daily public application/HMAC-IP cap applies at ask.php. Failover preserves model-independent questionnaire answers; deterministic discovery/brief/direct booking survive all-provider exhaustion.

Activation order: accept actual Hostinger runtime/private custody/authorization; approve exact model/account/privacy/quota/reset/evaluation record; install private configuration only with approval; enter keys through an approved private channel; independently authorize a bounded connectivity test; reconcile usage and billing evidence; enable only accepted configuration. Never change key/account to evade quota. No credentials in chat or public artifacts.
