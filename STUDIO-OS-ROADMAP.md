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

Evidence update: portfolio local acceptance is 20/243 (8.23%). The 233 future obligations remain excluded and no platform capability is promoted. Current source/test boundary remains in the atomic catalogue.

Latest portfolio acceptance: 22/243 (9.05%). Future 233 remain excluded. Durable no-auto-replay intents are a portfolio reliability change, not delivery proof or platform lifecycle completion. See NOTIFICATION-RECONCILIATION and BOOKING-LIFECYCLE-CONTRACT.

## Sera guided-discovery milestone

See docs/sera/SERA-IMPLEMENTATION-STATE.md and SERA-TEST-EVIDENCE.md. Deterministic guided UI and non-binding brief implemented; six service-tree units and one isolated browser journey pass. Router/knowledge/error foundations are explicitly distinguished from live integration. Original catalogue stays 22/243; no automatic count increase. Platform/support scope remains future. Hero approval/198-case export acceptance remain blocked. NO-GO; manifest STALE.

Sera follow-up: all eleven isolated intent journeys now pass. Relevant backend retrieval is wired with bounded context. Multi-provider routing remains a mock policy foundation; no new provider enabled. Portfolio counts remain 22/243. No change to hero or release gates.

## Business control center development slice

See docs/admin/ADMIN-IMPLEMENTATION-STATE.md. Bound-Sheet admin foundation and private versioned knowledge/FAQ/personality/voice, disabled provider drafts, CRM annotations, appointment requests and metadata reports have local tests. No standalone portal, encrypted key management, CMS publishing, live analytics/marketing or admin AI agent acceptance is claimed. No production installation. Portfolio catalogue unchanged at 22/243; admin expansion tracked separately. NO-GO; manifest STALE.

## Business Control Center Phase 2: local evidence

Approved-artifact/CMS slice published as 06e89289e8ae6f2f793d2c7a1e69f8eab4725698. Owner-only public export excludes drafts/private/admin records. Browser/PHP schema gates, approved FAQ/identity/voice, bounded knowledge/tone, previous-config fallback and temporary staging/rollback are fixture-tested. Existing-project metadata/contact/social/SEO approvals and escaped previews preserve routes/source/hero. Full case authoring, new projects, uploads and actual public-template/build publishing remain incomplete.

Disabled Gemini/Groq protocol adapters reuse the router in mocks. Private ledger fixtures reserve quota before calls, preserve unknown outcomes and bound circuits; 20-process contention accepts exactly three under quota three. Credential writes/activation, encryption/rotation, live gateway wiring, account eligibility/privacy and actual hosting storage remain blocked. No live APIs, bookings, emails or deployment.

Evidence: docs/admin/PHASE2-TEST-EVIDENCE.md. Current recovered snapshot passes 14 JS suites, five PHP suites, concurrency, packaging and catalogue checks. Earlier isolated browser reports are preserved; a final rerun is blocked by missing Chromium/axe after reset. Portfolio acceptance remains **22/243 = 9.05%**, with 188 partial, 2 missing, 31 blocked; 233 future excluded. No atomic statuses promoted. Production-build browser coverage **0/198**. Hero approval, runtime/private-config/Apps Script identity, cleanup and authorized booking acceptance remain mandatory. Manifest **STALE**; **NO-GO**.

## Business Control Center Phase 3: current checkpoint

Standard case creation/editing, structured source import, safe previews, owner approval, sanitized media import and isolated versioned publication/readback/rollback are locally verified. Existing URLs, source, specialized chapter/video/social data and hero inputs are preserved; specialized rich authoring remains source-managed. Actual hosted upload/deployment remains disconnected.

A default-disabled private AEAD vault and provider composition are fixture-tested for masking, audit, key rotation/revocation, authorization, conflict/replay, failover and durable quotas. Actual independent key custody, backend identity and encrypted-store deployment are unverified; workspace credential writes/provider activation remain rejected. Approved public skills, pinned conditional question trees, context/output budgets and provider ordering are tested; public policy cannot grant admin tools, consent or paid inference.

Evidence: docs/admin/PHASE3-TEST-EVIDENCE.md. 16 JS suites, eight PHP suites, 20-process quota contention and seven isolated browser suites pass. Browser/axe tooling is restored. Source-backed fake-Google workflows and original-template CMS previews pass representative mobile/tablet/desktop checks with zero automated axe findings in tested states. No real Google login, live provider, manual WCAG or production-build acceptance is claimed.

Original Portfolio acceptance stays **22/243 = 9.05%**: 188 partial, 2 missing, 31 blocked; 233 future excluded. No atomic obligations were promoted solely for admin fixtures. Production-build routes remain **0/198**. Required owner inputs are in docs/admin/OWNER-ACCEPTANCE.md. Approved hero, live runtime/config/deployment identities, key custody/auth, cleanup and explicitly authorized booking acceptance remain gates. Manifest **STALE**; **NO-GO**.
