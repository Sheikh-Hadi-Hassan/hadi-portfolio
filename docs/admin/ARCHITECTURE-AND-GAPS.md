# Actual architecture and module gaps

The existing admin source is LeadsDesk.gs/HTML, a modeless dialog bound to the private Leads Google Sheet. It has no repository-backed standalone login session, database or CMS. Google container sharing is its identity boundary. The public portfolio is static Next export plus PHP gateways; booking/notifications use a separate Apps Script project. Actual Hostinger web runtime/database/cron and deployment identity remain blocked by prior missing authenticated evidence. No failed sign-in investigation was repeated.

This slice reuses the bound Sheet and Google RPC. Active-user email must resolve and match private ADMIN_ROLES. Empty identity fails closed; effective-user/owner identity is never substituted. Google owns login/cookies; this source does not verify or control those cookie/session settings. A separate user-scoped 30-minute cache token protects mutations. Role checks execute on every server read/write. Document locks, expected versions, operation IDs and request hashes protect edits/replays. Immutable revision rows retain actor/time/hash. Thirty accepted mutations per actor/minute and a 2000-revision capacity guard bound this initial workspace.

**Security boundary:** Sheet/script editors can directly inspect or modify their container, bypassing application RBAC. Do not present this as tenant isolation or share it with untrusted customers/editors. Use an owner/trusted-team-only Sheet. A standalone secure portal needs verified hosting authentication/storage/key management; no database or worker has been assumed.

|Module|Working local slice|Missing / external boundary|
|---|---|---|
|Admin foundation|Google identity roles, expiring mutation token, sidebar/search/forms, version conflicts, confirmations, audit revisions|Real account/ACL/session acceptance, standalone login, granular untrusted-user isolation, broader error UX|
|Sera Studio|Knowledge hierarchy, FAQs, personality and voice preference drafts/approved workspace snapshots|Approved public artifact pipeline now fixture-tested; real deployment acceptance, voice preview, question-tree editor, skills registry and retention policy remain|
|Providers|Validated disabled metadata draft revisions|Gemini/Groq protocol and ledger fixtures added; encrypted store/master-key lifecycle, live gateway wiring, verified quotas/privacy/terms, connectivity and activation remain blocked; credential fields rejected|
|CRM|Original lead viewer plus linked stage/notes/tags/follow-up annotations|Integrated lead detail editor, configurable stages, UTM/dedupe pipeline, consent/legal-basis lifecycle, migration acceptance|
|Appointments|Linked cancellation/reschedule request records|Calendar view, real lifecycle authorization/provider mutation/reconciliation; requests do not change bookings|
|CMS|Existing project metadata/contact/social/SEO draft-approval-export, escaped preview, local staging and rollback|New projects/full case authoring/uploads, actual build/render/deployment and hero-aware release bridge|
|Analytics/SEO|Explicitly disconnected; no invented metrics|GA4 and GSC credentials/OAuth/adapters/caches/source-specific reports|
|Marketing/email|Not implemented|Consent/suppression/unsubscribe/template/campaign adapters and authorized transport|
|Admin Sera|Not implemented|Typed tool registry, approval executor, private data retrieval and injection evaluation|
|Reports|Authorized counts/latest-revision metadata export from actual workspace records|Lead/traffic/SEO/campaign/provider operational metrics and performance measurement|

Provider drafts cannot enable inference. Unknown model IDs/terms remain disabled. No raw credentials are accepted or returned. Private read projection drops unknown fields. Arbitrary URLs in provider drafts are never fetched; a real adapter must enforce approved endpoint/egress policy before activation. Editable personality has fixed fields/enums and cannot override security/consent rules.

Workspace 'published' means an owner-approved version inside the private store. It does **not** publish to the public website. Later drafts preserve approved snapshots. Public knowledge approval requires public approved ancestors; archives are owner-only. Visitor conversations are never imported into knowledge automatically. Existing question trees remain unchanged.

Tests validate local contracts, not Google execution/quotas or Hostinger behavior. No production package, live Google mutation or deployment was executed. Original Portfolio acceptance remains 22/243; admin extension is tracked separately.

Phase 2: see PHASE2-ARCHITECTURE.md, PHASE2-STAGING.md, PROVIDER-ACTIVATION-GATES.md and PHASE2-TEST-EVIDENCE.md. No actual deployment or live provider test.
