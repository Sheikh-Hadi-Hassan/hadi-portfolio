# Current build and Hostinger architecture

This document supersedes the older divergent branches' Vinext instructions. It is documentation, not deployment authorization. No deployment is part of this local integration.

The release/next baseline uses Next.js App Router with `output: 'export'`, React, GSAP, shared HTML templates and Python image preparation. `npm ci` installs the committed lockfile. Node.js and Python 3 with Pillow are required.

`npm run build:acceptance` verifies the approved hero lock, builds 22 source routes, generates responsive images and metadata, prepares Next route content, produces `out/`, prunes unused exported assets, audits Flight hydration records and records a source/output receipt. `python3 scripts/qa/acceptance-build.py --verify` checks that receipt. Never edit exported HTML or serialized Next Flight records after building.

For local visual review, use `npm run dev`. Next's development server serves the frontend; it does not execute PHP. Keep private provider configuration out of the checkout. Do not point a local test at live write endpoints to compensate for missing credentials.

Production also uses PHP endpoints under `public/api/` and `public/intellignce-support/`, plus Apps Script integration sources under `integrations/`. Preserve those contracts and the existing private Hostinger configuration. Static rendering alone does not verify AI provider calls, enquiry delivery, notifications, Google Calendar or Meet. The current original resume PDF is `public/assets/hadi-hassan-resume-2026.pdf`.

Before any separately authorized release, review current release blockers in `docs/booking-release/RELEASE-READINESS.md` and the QA reports; run automated source, export and guarded browser checks; confirm canonical origin, route inventory and existing backend contracts. `scripts/package-hostinger.py` excludes private configuration from a local package. A source ZIP is not an upload-ready website, and passing local tests is not production approval.

The root `.htaccess` denies access to the source tree intentionally. It must not be copied blindly into the deployed export. Preserve the live hosting configuration and private files during any future authorized deployment. Do not introduce an automatic upload workflow from an older branch.

See `docs/seo-url-migration-plan.md` for the current URL policy and `docs/LOCAL-INTEGRATION-20261110.md` for this Mac's actual validation results.
