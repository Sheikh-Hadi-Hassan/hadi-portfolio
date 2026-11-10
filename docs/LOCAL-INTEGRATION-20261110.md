> Historical 10 November snapshot. Current consolidation, checks and branch: [11 November release report](RELEASE-CONSOLIDATION-20261111.md). Earlier limitations below are superseded only where that report records a new result.

# Local portfolio integration and visual review

Follow-up correction: the initial branch review did not reconcile the older frontend's full project directory. Social Media Portfolio and 29 other records have since been recovered into the local archive. See `CONTENT-RECOVERY-20261110.md` for the current content, preview and focused validation; the results below are the earlier setup pass.

10 November 2026. Local review is ready; comprehensive QA is incomplete. Nothing was deployed or pushed.

## Open the website

http://127.0.0.1:3000/

The Next.js development server is running and has been left running. Desktop and 390px mobile homepage screenshots were inspected; both render meaningful content with no horizontal overflow or Next error overlay. Resume navigation, Sera opening, explicit “Continue without AI” and the booking calendar were checked. No enquiry, AI message, booking or production email was submitted.

If the process is stopped later, run `npm run dev -- --port 3000` from the repository. Startup regenerates local presentation assets from existing source and verifies the approved hero lock. Node.js, Python 3 and Pillow are installed. The initial cold image preparation was slow; subsequent cached preparation completed successfully.

## Repository and setup

- Repository: https://github.com/Sheikh-Hadi-Hassan/hadi-portfolio.git
- Local directory: `/Users/sheikhhadihassan/Documents/Hadi-ntellignce/hadi-portfolio`
- Starting branch: `release/next`.
- Starting/latest committed SHA: `79ec06a872e061be4d32278a67f729600118cb95` — Record verified 198-case guarded browser acceptance and retained release blockers.
- Integration branch: `integration/local-release-next-20261110`.
- `release/next` and `work/v01-booking-contract-20261103` were confirmed at the same SHA.
- The workspace was empty. The first full clone failed with ENOSPC; a blob-filtered clone succeeded. All remote branches were fetched. `npm ci --no-audit --no-fund` succeeded with the committed npm lockfile, installing 43 packages.
- Changes are local and uncommitted for review. No existing work was overwritten. Main and remote branches were not changed or deleted.

## Selective consolidation

Both requested branches were compared from their common ancestors with the current release, including metadata, structured data, sitemap, robots, navigation, resume, archive, project routes, form claims and deployment documentation.

| Older branch | Decision |
| --- | --- |
| `fix/seo-canonical-domain-2026-10-26` | The current release already generates the production canonical origin, branded metadata, project structured data, sitemap and robots. Do not import obsolete redirects that replace existing first-party case studies with `/work/<slug>` or generic archive anchors. Adapted its useful URL-policy documentation to the current architecture. |
| `review/navigation-resume-archive-20261102` | Keep the newer command navigation, dedicated archive, resume page and original PDF. Manually adapted its missing `llms.txt` discoverability improvement to the current project inventory. Updated deployment documentation instead of importing its obsolete architecture claims or automatic upload workflow. |

Implemented:

- Build-generated `/llms.txt`, linking exactly the 22 current canonical pages, using the same production origin and project records as the HTML. No old Systems Lab/FLOW routes or invented resume claims.
- `HOSTINGER-DEPLOYMENT.md`, describing the actual Next static export, Python build, PHP/Apps Script contracts, private configuration boundaries and local preview limitations.
- `docs/seo-url-migration-plan.md`, preserving existing project URLs and documenting possible future alias review.
- A repeatable `npm run dev` command, including the existing hero verification and asset preparation.
- Ignore rules for disposable local build/image-cache outputs. Tracked public CSS, script and sitemap artifacts were regenerated from the newer existing source. No hero, design-system, project-data, navigation or integration source was redesigned or replaced.

No old branch was merged wholesale or cherry-picked. Both remain preserved. There is no remaining older-branch change required for this local preview. Possible aliases such as `/work/<slug>/`, `/nicemd/` and `/jules-capital/` need traffic/link evidence and a future hosting-specific decision; they were not introduced here.

## Current validation results

These are results observed on this Mac, not the older release's retained QA claims.

| Check | Result |
| --- | --- |
| Locked dependency installation | PASS |
| Approved hero lock | PASS; protected home/hero/shared-style inputs remain identical to the starting commit |
| Main `npm test` suite | PASS, all 23 scripts, using `TMPDIR=/private/tmp` |
| Additional Node/Python contract tests | PASS except the pre-existing source checks described below; logs and individual results retained |
| Browser plan and acceptance-receipt unit tests | PASS |
| Source asset preflight, source SEO and utility-route checks | PASS |
| Production build / static export | PASS: Next 16.4.4, 22 content routes, 390 responsive-image originals processed, 39 Flight text records validated |
| Source/export receipt | PASS after the build and again after local preview startup |
| Exported production asset/link audit and image audit | PASS |
| `llms.txt` | PASS: its 22 links exactly match the canonical sitemap and exported routes |
| Isolated browser suites | PASS: hero responsive, Sera consent, guided Sera, admin control, approved config, CMS, admin workflows, runtime trees, config fault injection, CRM, booking lifecycle and home sections (12 scripts) |
| Actual exported-app smoke | PASS: Sera and deterministic entry, React reel initialization, links and Back/Forward, two real lightbox galleries |
| Full 198-case route/width matrix | INCOMPLETE: 8 executed, 8 PASS, 0 assertion failures recorded, 190 unexecuted after disk exhaustion interrupted the process. Not a full browser acceptance pass. |
| TypeScript / ESLint | Not configured in this JavaScript baseline: no TS project, ESLint configuration, dependencies or check scripts. No substitute toolchain was added. |
| PHP tests and PHP process-concurrency test | BLOCKED: PHP is absent; Docker is installed but its daemon is not running. No production credentials were requested. |
| Git whitespace check | PASS |

The first main-suite invocation failed because macOS's default temporary directory passes through a symlink, which the staging security checks correctly reject. Running against physical `/private/tmp` passed without weakening any guard. The initially missing pinned Chromium headless shell (revision 1248) was installed; the hero browser test then passed.

### Pre-existing failures

1. `tests/home-content.py`: compares current approved shared CSS against `docs/hero-baseline-PROPOSED-NOT-APPROVED.json`; that older proposed hash differs. The approved `design/hero-lock.json` verification passes. No protected source or approval hashes were changed.
2. `tests/project-images.py`: reports duplicate image references and weak/missing source alt text. Its input `src/data/projects.json` is unchanged from the starting commit. This source-data test remains failed even though rendered export image/asset checks pass.
3. `tests/seo.py`: stops at the existing contact-page title, “Contact Hadi Hassan” (19 characters), below its 35-character minimum. The title generation was not changed by this integration. Other title/description length issues beyond that first assertion may remain; the passing source SEO check establishes canonical/uniqueness/sitemap coverage, not these length thresholds.

No new test assertion failure was identified from the integration changes. The incomplete matrix and unrun PHP tests leave gaps in verification.

## Local limitations and disk interruption

The Mac ran out of disk space during cloning and again during browser QA. macOS subsequently reclaimed space, but available capacity fluctuated significantly. ENOSPC interrupted the matrix and caused transient development-cache errors. Only this run's disposable `dist/` output and `.next/` cache were removed; the preview was restarted and rechecked successfully. Existing files and unrelated caches were not deleted. Keep several GB free before another complete 198-case run. Do not rely on the older historical 198/198 report as evidence for this integration.

The local Next server does not execute Hostinger PHP. Optional Sera public-config files are absent, so the built-in questionnaire is used; optional config 404s are expected. AI provider calls, live availability, enquiry delivery, notifications, Calendar and Meet cannot be proven here. Existing PHP and Apps Script production contracts were preserved. Isolated tests used fake providers only. The visible booking calendar is not evidence of live slot availability or a confirmed booking.

## Evidence

- `docs/local-review-20261110/build.log`: successful production build and receipt.
- `docs/local-review-20261110/additional-tests.json`, `source-tests.json`, `template-tests.json`, `export-tests.json`, `isolated-browser-tests.json`: per-test results. The initial missing-browser failure in additional-tests is superseded by the successful hero test in isolated-browser-tests.
- `docs/local-review-20261110/route-browser-partial.json`: the interrupted matrix's current 8/198 evidence.
- `docs/local-review-20261110/generated-test-results/`: current generated test JSON, archived separately so historical tracked fixtures/evidence could be restored.
- `docs/local-review-20261110/*.log`: individual outputs, including all three pre-existing failures and the exported-app smoke.
- `docs/local-review-20261110/home-desktop.png`, `home-mobile.png`, `resume-desktop.png`, `booking-mobile.png`: local preview captures.
- `docs/browser-evidence/` and `docs/qa/smoke-screenshots/`: current automated browser captures.

Next.js also generated a root `AGENTS.md` on development startup. No GitHub push, Hostinger upload, live configuration change, Google write or real customer mutation occurred.
