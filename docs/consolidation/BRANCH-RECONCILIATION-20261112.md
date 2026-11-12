# Branch and feature reconciliation checkpoint

Date: 2026-11-12  
Working branch: `integration/portfolio-final-20261112`  
Protected source baseline: `e3c7ee2e07f8f1bcaf3c1f66d7dcdb0a75e922ab` (`release/consolidated-20261111`)  
Decision: **development audit only; NO PRODUCTION GO**

## Authority and boundaries

Use the owner’s 48-page master brief, `docs/atomic-requirements.json`, and source-specific verified evidence. Preserve all approved hero/design content, all historical branches, source assets, original booking and CRM state. No bulk merge, reset, force push, main overwrite, live integration activity, payment, DNS or Hostinger deployment is authorized.

## All 17 remote branches (snapshot)

| Branch | SHA prefix | Ancestry vs baseline | Relevant work | Integration decision |
|---|---|---|---|---|
| `main` | `84f80d8` | Ancestor | Old Next/Vinext app, WebGL, sound, Spline FLOW, original content | Do not merge; evaluate approved features only |
| `recovery/portfolio-v81-sera-v9` | `7043d28` | Ancestor | Sera V9, navigation, booking recovery, branded emails | Verify inherited Sera/booking behavior |
| `integration/v00-authoritative-baseline-20261102` | `d5df14b` | Ancestor | Generated source baseline, SEO plans and original hosting support | Provenance only |
| `work/portfolio-v01-requirements-20261103` | `22c9579` | Ancestor | Requirements and evidence tracking | Keep canonical requirement IDs |
| `work/v01-booking-contract-20261103` | `79ec06a` | Ancestor | Booking, Sera, CRM, admin, tests; same tip as release/next | No merge; external gate stays open |
| `release/next` | `79ec06a` | Ancestor | Pre-consolidation verified local build and browser QA | Superseded checkpoint |
| `release/consolidated-20261111` | `e3c7ee2` | Baseline | Current source, recovery, 15 cases, 30 references, current UI/navigation | Source of truth |
| `seo-aeo-canonical-audit-2026-10-20` | `c84d958` | Diverged | Old app canonical domain corrections | Compare policy only; obsolete app files |
| `fix/seo-canonical-domain-2026-10-26` | `0e008f7` | Diverged | Canonical and legacy URL migration instructions | Do not import redirects that collapse full cases |
| `review/navigation-resume-archive-20261102` | `ab22892` | Diverged | Archive, resume, llms.txt, original assets, outdated static CI | Content recovered; reconcile current workflow and routes |
| `feat/social-preview-image-20261021` | `e87540a` | Diverged | Owner artwork, social previews, favicons | Compare output metadata and exact supplied media |
| `recovery/verified-production-20261021` | `c409799` | Diverged | Captured 1768-file historical production baseline | Immutable evidence; not editable app |
| `audit/gate6-production-20261021` | `016196b` | Diverged | Gate 6 QA and NO-GO snapshot | Retain for historical evidence |
| `remediation/gate6-source-booking-20261021` | `9168c0b` | Diverged | Calendar/booking issue analysis and source fingerprints | Compare contracts and failure tests |
| `docs/v00-source-parity-evidence-20261021` | `a7bae09` | Diverged | Path provenance and production/package comparisons | Historical audit only |
| `docs/v00-blocker-resolution-20261021` | `a9d9e37` | Diverged | Booking cancellation test and baseline recovery plan | Recheck lifecycle behavior not old output |
| `handoff/captured-production-adoption-20261021` | `8f15736` | Diverged | Captured appbar, widget, PHP gateway, Git bundle handoff | Compare behavior, do not import generated site |

Ancestry classification uses GitHub comparison. An ancestor has no unique commits to replay. Divergence is not proof that a feature is missing. Branch classification here is not a per-line equivalence proof.

## Machine-readable 243-obligation checkpoint

See [PORTFOLIO-243-TRACEABILITY-20261112.json](PORTFOLIO-243-TRACEABILITY-20261112.json). All 243 portfolio requirements from the original register are retained without promoting prior recorded statuses. Each entry exposes the criterion, current evidence, exact file path matches, remaining action and an explicitly pending post-consolidation acceptance review. The source register remains authoritative until each requirement is re-evaluated and the matrix formally updated. The 233 future obligations stay separate.

## Confirmed content-policy conflict

Original November 2 SEO/content instructions exclude **Kruzz Branding** and **Logo Design for a Food Delivery Platform** unless the owner subsequently approves reintroduction. Both are present in `src/data/archive-records.json` in the 11 November consolidated source. Preserve asset provenance, but prevent the two from being published pending a documented new approval. Current reference inventory: 30 recovered references plus 15 cases = 45 archival records; excluding two produces 43 publicly listed records if nothing else changes. Treat that count as expected only until the generated export is rebuilt and checked.

**Lahore Culture Branding:** a historical image and archive reference have been recovered; verify owner approval and exact asset before calling it an approved new full case study. **TMS:** owner-provided login URL has an earlier 404 HEAD report, requiring normal-browser verification; never assert an operational demo based on a screenshot.

## Feature migrations that need equivalence review

| Former source | Current source / test to inspect | Decision needed |
|---|---|---|
| `components/pixel-portrait.tsx` | `src/app/hero-dither.jsx`, `src/styles/hero.css` and approved hero lock | Is original interactive portrait superseded? |
| `components/sound-dock.tsx` | Current reel/motion and audio entry points | Explicitly excluded or missing? |
| `components/flow-avatar.tsx` | `src/data/digital-products.json`, current Sera integration | Were FLOW 3D visuals approved in final scope? |
| `components/tool-stack.tsx` | Current project/showcase content | Was former AI tab system ever approved? |
| `app/flow/page.tsx` and `app/systems-lab/page.tsx` | Current sitemap and case/project inventory | Are distinct old routes intentionally discontinued? |
| `components/contact-brief.tsx` | `public/api/leads.php`, `src/app/lead-form.jsx` and current booking system | Verify replacement and delivery behavior |
| Captured production appbar and widget-v9 | `src/styles/appbar.css`, `src/styles/command.css`, Sera v9 source | Verify behavior and visuals in exact exported application |

Do not mark a feature missing solely because its old filename no longer exists.

## Work order and gates

1. Freeze source baseline; preserve `main`, `release/next`, production and all 17 branches. Inspect any unpublished Mac work before calling remote inventory complete.
2. Reconcile content exclusion, all 15 case studies, 30 recovered reference records, project provenance, links and approved assets. Record source-to-output changes.
3. Review 243 portfolio obligations one by one. Link requirement ID to actual implementation, latest committed tests, source comparison, evidence boundary and unresolved acceptance. Do not promote a status without a new passing criterion.
4. Check all divergence branches for genuinely unique approved functionality; selectively port only confirmed missing behavior. No architecture-wide cherry-pick.
5. Rebuild exact app: `npm ci`, `npm run build:acceptance`, `python3 scripts/qa/acceptance-build.py --verify`, then all targeted tests and the 22×9 browser matrix; manually check 320–1440 px, screen-reader, keyboard, motion and links. A source-only change without a fresh build remains unverified.
6. Obtain read-only Hostinger/PHP, current deployed Apps Script version, Sheet/Calendar ownership, credentials custody and rollback evidence. Production requests or writes require separately approved isolated resources and scoped authorization.
7. Review exact preview and output with owner. Prepare a new commit-specific Hostinger ZIP only after it passes all gates. Separate main merge and deployment approvals.

## Known release blockers

- Exact contemporary export has not been rebuilt after this integration branch's changes.
- Current live Hostinger source/build and hosted PHP configuration parity are unverified.
- Booking to persisted lead to Calendar/Meet to customer/owner notification E2E is unverified.
- Sera provider/free eligibility, account quotas, privacy, token custody and real fallback behavior remain unverified.
- Admin access, CMS publication, source/live rollback, actual data and authenticated analytics remain unverified.
- Professional case-study outcomes, role claims and recruiter journey need final creative/editorial approval.

## Evidence handling

The November 11 source report records 198/198 local browser cases, 15 full first-party cases and 30 recovered references. This checkpoint does **not** repeat those tests, execute the PHP/Google integration, prove live deployment, or declare WCAG certification. Existing 27 verified / 185 partial / 31 blocked portfolio acceptance categories remain unchanged pending item-level review.
