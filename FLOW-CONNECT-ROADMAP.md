# Flow Connect roadmap

FUTURE_SCOPE: original plan §15, dual-mode blueprint and V0.7–V1.2 roadmap. No commercial platform launch is part of Portfolio V0.1.

|Module|Existing implementation|Missing functionality|Dependencies|Complexity|Recommended phase|
|---|---|---|---|---|---|
|Discovery/pilot|Plan only|15–20 interviews, 5–10 pilots, explicit success/support metrics|Owner research/outreach approval|Medium|Before V0.7|
|Tenant/site isolation|No accepted tenant layer|Organizations, roles, site registry, isolation tests and lifecycle|Studio OS secure foundation|High|V0.6–V0.7|
|Connect-first onboarding|Portfolio-specific gateway exists|SDK/embed/API, scoped rotating keys, signed webhooks, consent/UTM mapping and recipes|Versioned contracts; tenant isolation|High|V0.6–V0.7|
|CRM and bookings|Single-owner integration source|Tenant CRM pipeline/timeline, migration, reliable booking adapters and recovery|Accepted V0.1 and Studio OS CRM|High|V0.7|
|Analytics/funnels|No accepted product implementation|Cross-site events, consent, provenance, dashboards and exports|Measurement and retention models|High|V0.7–V1.0|
|Public/private Sera|Public portfolio assistant source|Separate authenticated private tools, human approvals, provider adapters/quota/circuit breakers, manual parity|Security model and audited tool contracts|High|V0.7–V1.0|
|Voice|Portfolio browser voice source, device QA incomplete|Accessible text parity, push-to-talk, microphone consent, transcript review and interruptions|Supported browser/provider QA|Medium|Optional pilot|
|Commercial operation|Plan only|Metering, billing, support, observability, data export/delete and incident recovery|Product validation and legal/owner approval|High|V1.0|
|White label|Plan only|Brand, domain/email configuration and isolated customer setup|Tenant lifecycle, delivery identity|High|V1.1|
|Advanced automation|Plan only|Governed external actions and optional MCP ecosystem|Validated core and approval audits|High|V1.2|

Prefer a modular monolith after runtime verification. No generic site builder, ecommerce platform, marketplace or enterprise suite in this scope. No mandatory paid service or unlimited-free-AI promise. Outreach, deployments and customer notifications require explicit authorization.

## 3 November continuation

Portfolio utility routes and original resume download have been prepared locally. These are portfolio work, not CMS/CRM or commercial-platform completion. No roadmap implementation status changes. Full original-plan source coverage is preserved in `docs/original-plan-source-coverage.json`; atomic requirement deduplication remains open.

Public Sera consent now defaults off in portfolio source. This is not completion of private Sera or future product privacy/permissions requirements. Roadmap scope remains future.
