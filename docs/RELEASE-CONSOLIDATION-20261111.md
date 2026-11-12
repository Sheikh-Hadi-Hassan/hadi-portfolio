> This report records consolidation commit e3c7ee2. Subsequent owner-requested CV positioning and SEO/AEO/GEO work is recorded in [the resume-led audit](seo-20261111/AUDIT.md). Earlier hero/content observations describe that commit, not later copy revisions.

# Authoritative local development release — 11 November 2026

Branch: `release/consolidated-20261111` in `Sheikh-Hadi-Hassan/hadi-portfolio`.
Preview: http://127.0.0.1:3000/ (the final static export).

This release continues the existing checkout and descends from `79ec06a872e061be4d32278a67f729600118cb95`. No reset, fresh application clone, main change, deployment, branch deletion or force push is part of this consolidation. This is a development release; live service acceptance remains open.

## Source reconciliation

All local commits and dirty changes were reviewed alongside the content recovery report and all 16 origin branches (17 refs including origin/HEAD), refreshed again on 11 November. `release/next` and `work/v01-booking-contract-20261103` still point to the starting SHA. `remote-inventory.json` records the exact refs and ancestry counts. Earlier keyword, storytelling, related-work, SEO and booking improvements remain in the parent history. Older branches were selectively adapted rather than merged over newer application code.

Preserved recovery references:

- `recovery/pre-consolidation-20261111`: local pre-release HEAD.
- `integration/local-release-next-20261110` and local `release/next`: retained.
- `origin/review/navigation-resume-archive-20261102`, `ab2289237cd751e6c261150e8b0fbe2fdd950b30`: wider portfolio directory and original artwork.
- `origin/handoff/captured-production-adoption-20261021`, `8f15736`: captured frontend/adoption evidence; original Sites version 104 source identity `66e3e1df67331a92b2966dcab9724e70c8f11d90` and adoption implementation `9fc62ae286f4e3d9946dc507d6b6c83efb7bdd52`.
- `origin/feat/social-preview-image-20261021`, `e87540a`: owner-approved favicons and three social-preview formats.
- Before-recovery and before-reconciliation patches remain in their dated evidence folders.

The earlier attempt to fetch the original Sites source did not finish. Its scratch checkout was not used as an application replacement. Navigation markup/script and scoped CSS were recovered from the retained production capture. `command.css` contains only relevant navigation/cursor/fallback rules extracted with PostCSS; it does not import old hero or global theme rules. The captured appbar overrides are maintained separately in `src/styles/appbar.css`. No Sites publication was performed.

## Consolidated behavior

- Preserve all 15 first-party case studies, their narratives, original artwork, galleries, campaign media and related work.
- Preserve Social Media Portfolio and 29 other recovered reference entries: 45 archive entries total. These are 30 recovered records, not 30 invented full case studies. Original source paths, dimensions and SHA-256 provenance remain in `archive-records.json`.
- Restore the INTELLIGNCE logo, desktop Email/WhatsApp, Sera face/button and labelled mobile Home/Work/Sera/Menu app bar. Restore the single-screen editorial menu, keyboard/hover artwork previews, native focus handling and full archive access. Retain newer About, Contact, Resume and Social Media Portfolio destinations.
- Adapt the shared Sera button to the existing v9 widget, including lazy-loading fallback, queued opening, aria-expanded state, focus return and removal of the duplicate floating launcher. Current consent, AI policy, discovery, booking, CRM and notification implementations remain intact.
- Use the owner's four unaltered PNGs in the homepage UI project showcase: AppTech, Crent, TMS and Flow. The image pipeline generates responsive derivatives while retaining originals. Product stages remain unchanged; screenshots do not imply production readiness.
- TMS points to the exact owner-supplied `https://tms-theta-eight.vercel.app/login` on both the homepage and recovered archive record. An HTTP HEAD check returned **404** during consolidation; successful external application availability is not claimed.
- Keep production canonicals, structured data, image sitemap, robots, SEO narratives and related-work links. Restore approved favicon/social assets, generate llms.txt from current canonical pages, and provide descriptive unique utility-page metadata.
- Fill missing case-gallery alt metadata using the existing title/category and presentation number, without inventing visual details or outcomes. More specific human-authored image descriptions can still improve these captions.
- Approved hero HTML, hero CSS and shared protected CSS pass the original lock. The owner-authorized images change only the homepage product section.

## Requirements matrix reconciliation

`PORTFOLIO-REQUIREMENTS-MATRIX.md` and `docs/atomic-requirements.json` remain the full obligation catalogue: 476 IDs, including 243 portfolio and 233 historical future obligations. Their existing 27/243 bounded criteria and 31 external blockers are not promoted to complete by this release.

Relevant scope checked: PV-54155775 metadata identity, PV-689C3518 Twitter cards, PV-C8C2BED3 archive, PV-2E981ABA mobile navigation, PV-C03FFAB5 browser history, PV-D49343A5 keyboard navigation, PV-E60522DC responsive media, and the booking contract/lifecycle criteria. Current local results supplement those records. Historical production browser counts and NO-GO statements in older V1 documents describe their own snapshots. This release's 198-case result verifies a local export, not live production, the entire admin roadmap, Calendar/Meet, provider authorization or delivery.

## Build and checks

The full documented pipeline ran via `npm run build:acceptance`: hero verification → Python template build → responsive image/metadata generation → Next source preparation → Next webpack production build/static export → export pruning → hydration audit → source/output receipt. There are 22 content routes and 39 validated Flight text records. `python3 scripts/qa/acceptance-build.py --verify` checks the current output against source.

Observed passing results are retained under `docs/release-20261111/`:

- Main `npm test`: all 23 scripts, with physical `TMPDIR=/private/tmp` for the staging-security symlink guard.
- 35 additional Node/Python contracts, including source assets/SEO, utility URLs/fragments/PDF, project image metadata, metadata length/uniqueness, production links, responsive images, package security and requirements/evidence consistency.
- 15 PHP suites and the independent-process quota contention test, using locally installed PHP 8.5.12. These use local fixtures; Hostinger's installed PHP/runtime environment was not tested.
- 12 isolated browser suites, actual rebuilt-app smoke and recovered-archive checks: all 14 scripts pass. Mocked provider/calendar/GSAP fixtures are identified in their logs and do not establish live integration acceptance.
- The extra browser triage harness also passes navigation/history and two gallery interactions after the asynchronous close-event wait correction.
- Actual production export matrix: **198 executed, 198 PASS, 0 FAIL, 0 blocked** across all planned routes and widths. Covers route/asset loading, image decoding, dock bounds, menu/focus, Back/Forward, headings, configuration diagnostics, overflow, page errors and axe. The four shards were merged with the repository's merger.
- Actual restored navigation/Sera/booking test at 320×568, 390×667, 768×900 and 1440×900: four PASS, zero axe violations; menu fits without scrolling at these sizes. Menu artwork focus previews, supplied image decoding, exact TMS URL, consent-off Sera flow and booking entry pass.

Test corrections preserve the contracts: home-content uses the actual approved hero lock and latest owner TMS URL; utility/SEO checks parse fragments and real downloadable files; gallery uniqueness permits its cover to reappear once while retaining duplicate checks within the gallery. The triage harness waits for native asynchronous dialog close cleanup instead of asserting before the close event. No hero hash or backend guard was weakened.

## Unverified integrations and limits

No live enquiry, booking, reschedule, cancellation, Calendar/Meet creation, provider request, email, WhatsApp message, notification or CRM production write was made. PHP and Apps Script tests use controlled local fakes. A visible booking calendar is not proof of slot availability or a confirmed booking. Local preview is static and does not execute Hostinger PHP. Optional public configuration is absent, so Sera uses its built-in deterministic flow; provider and owner-specific configuration remain external gates. External embedded media availability is not established by local browser tests.

Browser policy prevented automatic navigation of the owner's in-app tab earlier. It was not bypassed. Automated QA used the separate local test harness; the owner can open the preview URL directly.

## Continue development

Run `npm ci` if dependencies are missing, then `npm run dev` to prepare generated assets and start Next on 127.0.0.1:3000. Stop the retained static preview first if that port is occupied. For a release, use `npm run build:acceptance` and verify its receipt. Full build/deployment boundaries are documented in `HOSTINGER-DEPLOYMENT.md`; no deployment is authorized by this release.

## Release safety review

Gitleaks 8.30.1 found zero issues in the staged changes. A separate full text snapshot scan covered 611 release files (11.27 MB) and produced 27 generic-key matches; every match was reviewed: the public localStorage draft label `hadi-consultation-v1` or a SHA-256 file-integrity digest in existing evidence manifests. There are zero unresolved secret findings. No private configuration, environment file, runtime credential, lead database, browser profile or temporary source credential is included. Binary artwork is excluded from text scanning. The existing parent history was already on origin; it is preserved, not rewritten. See `release-20261111/secret-review.json`.

The new branch name was checked absent from origin before pushing. The push uses a new ref and no force option; existing remote branch SHAs, including main and release/next, are checked again afterward. This report and its evidence are development handoff material, not permission to deploy.
