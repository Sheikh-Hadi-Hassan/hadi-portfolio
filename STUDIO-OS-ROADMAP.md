# Studio OS roadmap

FUTURE_SCOPE for Portfolio V0.1. Original plan §§8–11 and version roadmap V0.2–V0.6. No platform implementation is claimed from directory names alone.

|Module|Existing implementation/evidence|Missing functionality|Dependencies|Complexity|Phase|
|---|---|---|---|---|---|
|Identity/RBAC/security|No accepted authenticated platform|Owner login, MFA, roles, session/CSRF controls, audit, backups|Verified hosting/runtime and threat model|High|V0.2 foundation|
|CRM|Google Sheet lead persistence source; leads-portal directory, operation unverified|Pipeline, dedupe, assignment, notes/tags/tasks, UTM/consent, export/delete, migration/reconciliation|Keep Sheet until parity; secure identity|High|V0.2|
|Overview/analytics|No accepted collection/reporting|Event taxonomy, freshness, funnels, bot filtering, retention, consent and exports|Measurement plan; hosting budget|Medium|V0.2–V0.4|
|CMS/media|Portfolio structured project data/build templates|Posts/pages/projects, autosave/drafts, preview/review/schedule, media, revisions/rollback, redirects/metadata|Content model, secure publication interface|High|V0.3|
|Booking operations|Apps Script source with locks/outbox/status; production identity blocked|Owner calendar view, cancellation/reschedule, audit and manual recovery|V0.1 booking acceptance|High|V0.2–V0.3|
|SEO/off-page reporting|Existing content keyword/SEO strategy docs|GSC ingestion, measured technical health, citations/link provenance, campaign/report exports|Authorized GSC and metrics sources|Medium|V0.4|
|Private Sera|Public Sera source only; not private admin authorization|Typed tools, scoped data access, citations, drafts, approvals, prompt/version audits, cost limits, manual parity|Identity, CRM/CMS contracts|High|V0.4–V0.5|
|Integrations/automation|Portfolio gateway integration exists|Site-scoped keys/rotation, signed webhooks/replay/retries, schema/versioning, OAuth, optional MCP|Validated API contracts and approval policy|High|V0.5–V0.6|

Start with owner-only workflows. Verify Hostinger PHP/database/cron/resource limits before architecture selection; do not assume persistent workers, Redis, containers, local LLMs or free unlimited AI. No new recurring service without approval. Each phase requires tests, migration/rollback and separate live approval.

## 3 November continuation

Portfolio utility routes and original resume download have been prepared locally. These are portfolio work, not CMS/CRM or commercial-platform completion. No roadmap implementation status changes. Full original-plan source coverage is preserved in `docs/original-plan-source-coverage.json`; atomic requirement deduplication remains open.

Public Sera consent now defaults off in portfolio source. This is not completion of private Sera or future product privacy/permissions requirements. Roadmap scope remains future.

## Atomic traceability update

The source-referenced atomic catalogue is `docs/atomic-requirements.json`. 116 SO obligations are Future scope, excluded from the portfolio denominator. Public consent withdrawal is a portfolio fix, not private-agent or commercial-platform completion. No platform implementation status is promoted.
