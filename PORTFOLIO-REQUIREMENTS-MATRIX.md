# Portfolio requirements matrix

Evidence basis: Library backend acceptance report (2026-11-03), pending fixes notes, November 2 execution instructions, and README on integration/v00-authoritative-baseline-20261102. This is a preliminary register, not exhaustive until the full original plan is extracted.

|ID|Workstream|Feature|Plan reference|Source/component|Status|Evidence|Missing / uncertainty|Priority|Action|Acceptance|
|---|---|---|---|---|---|---|---|---|---|
|PV-01|Portfolio|Homepage and case studies|Master prompt Phase B|src/app, src/pages, src/data|IMPLEMENTED_NOT_TESTED|README describes routes and templates|Browser route QA|P1|Run route and visual checks|Routes render and links work|
|PV-02|Portfolio|Responsive layouts and accessibility|Master prompt Phase B|src/styles|IMPLEMENTED_NOT_TESTED|README describes responsive CSS|Nine viewport and WCAG audit|P1|Run browser matrix|No overflow; keyboard accessible|
|PV-03|Portfolio|SEO metadata, canonical, sitemap|Master prompt SEO|src/app and tests/seo.py|PARTIALLY_IMPLEMENTED|README describes metadata and image sitemap|Current build and live indexability|P1|Run SEO tests and inspect export|Canonical and metadata valid|
|PV-04|Portfolio|Durable enquiry/CRM delivery|Master prompt integrations|Contact dialog / api/leads.php|PARTIALLY_IMPLEMENTED|README says dialog offers email/WhatsApp, not working submission form|Current backend source parity and persistence|P0|Inspect integration and test isolated|Durable lead ID, delivery and error reconciliation|
|PV-05|Portfolio|Calendar-backed booking|Pending fixes booking section|api/leads.php, Apps Script|BLOCKED_BY_EXTERNAL_DEPENDENCY|Backend acceptance report NO-GO; prior unmatched calendar event|Live identity and end-to-end acceptance|P0|Obtain gated evidence and authorization|Confirmed only after authoritative calendar success|
|PV-06|Portfolio|Sera public assistant|Master prompt Sera|Sera widget/backend|IMPLEMENTED_NOT_TESTED|Prior health check only|Knowledge, safety, rate limits, provider fallback|P1|Execute isolated tests|Accurate safe responses|
|PV-07|Portfolio|Production package and rollback|Master prompt deployment|build/export and release manifest|PARTIALLY_IMPLEMENTED|README documents export; manifest STALE|Hostinger-compatible validated package|P0|Build and stage artifact|Reproducible deploy and rollback|
|SO-01|Studio OS|Private CMS CRM analytics administration|Master prompt scope distinction|Unverified|FUTURE_SCOPE|Explicit separate roadmap|Implementation inspection pending|P2|Plan separately|Owner-approved future milestones|
|FC-01|Flow Connect|Multi-site white-label platform|Master prompt scope distinction|Unverified|FUTURE_SCOPE|Explicit future product|Implementation inspection pending|P2|Plan separately|Owner-approved future milestones|

Verified implemented / applicable total: **not calculated** because original-plan extraction and full code/test verification are incomplete. No requirement is currently promoted to IMPLEMENTED_AND_TESTED.
