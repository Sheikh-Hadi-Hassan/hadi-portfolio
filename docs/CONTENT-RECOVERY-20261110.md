> Historical 10 November snapshot. Current consolidation, checks and branch: [11 November release report](RELEASE-CONSOLIDATION-20261111.md). Earlier limitations below are superseded only where that report records a new result.

# Portfolio content recovery — 10 November 2026

## Result

The owner's concern was valid: the latest release preserved newer application work but did not carry forward the older frontend's wider content directory. **Social Media Portfolio was missing.** The local preview now includes it and 29 other recovered records, alongside the existing 15 first-party case studies: **45 archive entries total**.

Open: http://127.0.0.1:3000/archive/#social-media-portfolio

The server remains running. The homepage's Explore & connect menu now includes a direct Social Media Portfolio link. The visual design, existing homepage, full case studies, hero lock and backend contracts were preserved.

## Sources cross-checked

- All **16 remote branches** in `Sheikh-Hadi-Hassan/hadi-portfolio`, refreshed with `git fetch --all`.
- All **7 repositories** returned by the authenticated GitHub connection, including the six owned repositories. Only `hadi-portfolio` was identified as this portfolio application. No newer alternative portfolio repository was found in that accessible inventory.
- GitHub pull requests: the available open PR is the older canonical-domain change against main, not a newer frontend release.
- Prior chats: **Hadi portfolio v2**, **Hadi portfolio instructure**, **Portfolio Analysis**, and the linked development chat's handoffs. Their latest published source points to `79ec06a872e061be4d32278a67f729600118cb95`, which is already the release/next baseline.
- Earlier keyword-map, storytelling, metadata and related-work commits. `ac172ab`, `7f34db2`, `4e969b4`, `69443b4` and `27742af` are ancestors of the current release; those upgrades were not on an undiscovered newer branch.
- Local Documents/Downloads/Desktop source-location search found no second portfolio Git checkout. Older supplied portfolio assets exist on Desktop, but were not substituted for repository source.

No claim is made about inaccessible developer accounts, unpushed work or unavailable conversations.

## The actual gap

`review/navigation-resume-archive-20261102` at **ab2289237cd751e6c261150e8b0fbe2fdd950b30** contains `lib/content.ts`, with the wider project directory and its original images. The latest release's `src/data/projects.json` contains 15 full case studies; its archive displayed only those records. Comparing implementation files alone missed the broader directory. The first local integration report's statement that no older-branch content remained necessary was too broad.

This recovery adapts the missing content into the current application. It does not roll back the frontend or merge the old architecture.

## Recovered work

**Social Media Portfolio** is restored with the original repository artwork and published-case link:
https://www.behance.net/gallery/201857871/Social-Media-Portfolio

The external page could not be retrieved by the web tool during this run. Its title, destination and image attribution are taken from the existing repository record; successful external page loading is not claimed.

Other restored records: ClearMetRx; Care by CallingDr; Virtual Pharmacy; Dejong Rental Management; Grassroots Ventures; Longwood Reef & Coral; MORENT; Travel Management; App Tech; Lahore Culture; Kruzz; Food Delivery Platform; Predestination; Salezpeak; The Creative OAK; Zainjee; Jawa Fragrance; Sukena; S. Printing Solutions; Liberty Land; Glacier Engineer; OmniHTS; AgilityBO; Tecnomics; SureTouch Global; SportsPlus; Spyda Footwear; OmniHelp; Consumer Connect.

Duplicate OmniHelp records were consolidated. Entries already represented by existing case studies were excluded, including aliases for BW Strike, Jules Capital, LinkedIn Personal Brand, the election campaign and AI animation. The newer TMS dashboard URL was retained.

These are **30 recovered project records**, not 30 new full first-party case studies. Published work links to its original case, previews retain their destinations, and supplied-profile entries are labeled as portfolio references. No missing narrative, customer testimonial, metric, live-site availability claim or implementation history was invented. Consumer Connect and historical OmniHelp remain reference entries in this recovery; their old application-specific full-page implementations were not transplanted.

## Implementation

- `src/data/archive-records.json`: recovered records, original source commit/path, image dimensions and SHA-256 provenance.
- `public/assets/archive-recovered/`: original repository artwork. All 30 referenced images were verified byte-for-byte against the source commit.
- `scripts/build.py`: escape and render the supplemental records in the existing archive grid; maintain correct project/reference counts.
- `src/pages/archive.html`: clarify that the directory includes full studies and source references.
- `src/components/navigation.html`: discoverable Social Media Portfolio deep link, searchable through the existing menu.
- `src/styles/bayfi-brand.css`: scoped reference captions, links and keyboard focus styling using existing typography/colors.
- `tests/utility-routes.py`: correctly parse internal URLs and verify fragment targets. The new valid `/archive/#social-media-portfolio` link exposed a parser that previously treated fragments as directories. Route, PDF, unique-ID and hero checks remain enforced.

The 15 existing case-study records, homepage source, hero CSS and shared protected CSS are unchanged. No Calendar, AI provider, enquiry, CRM or notification implementation was changed. Sera's existing knowledge registry was not expanded to make new claims about recovered external references.

## Verification observed in this run

| Check | Result |
| --- | --- |
| Approved hero lock and unchanged protected inputs | PASS |
| Recovery provenance and deduplication | PASS: 30 unique recovered records, 45 total entries; original-image hashes verified |
| Production build / static export | PASS: 22 content routes, 39 Flight text records; current receipt verified |
| Source asset preflight and source SEO | PASS |
| Utility routes, real fragment targets and PDF | PASS after correcting the fragment parser |
| Production asset/link audit | PASS: 24 exported index HTML files including framework output; all local links/assets valid |
| Responsive images and image sitemap | PASS: 486 responsive elements, 462 ImageObject and image-sitemap entries |
| Actual static-export browser checks | PASS at 390, 768 and 1440 px |
| Browser assertions | 45 cards, 30 recovered; all archive card images decode; campaign filter gives the three expected records; all filter restores 45; exact social destination, keyboard focus, menu deep link and canonical verified |
| Browser accessibility/layout | Zero axe violations in all three scans, zero page errors, no horizontal overflow |
| Final development preview | PASS on port 3000: meaningful content, 45 cards, Social Media Portfolio present, no error overlay or horizontal overflow |
| Git whitespace check | PASS |

The complete 198-case matrix and backend suites were not repeated for this content recovery. The earlier local run's incomplete matrix, unavailable PHP runtime and pre-existing source-image/SEO-title/proposed-hero-hash failures remain recorded in `LOCAL-INTEGRATION-20261110.md`. The focused checks above do not supersede those limitations or establish live backend acceptance.

Browser policy blocked automatic navigation of the owner's in-app tab. No workaround was attempted. The local server and the direct review URL are ready for the owner to open; browser verification listed above completed before that navigation attempt.

## Evidence and safety

Evidence directory: `docs/content-recovery-20261110/`.

- `provenance.json`: branch SHAs, ancestry and image verification summary.
- `older-content-inventory.json`: original content directory used for reconciliation.
- `before-recovery.patch`: preserves the prior local integration changes.
- `build.log`, `source-checks.json`, individual logs and `browser-results.json`: current checks.
- `check-archive.cjs`: repeatable guarded-local browser check; external requests and writes blocked.
- `social-desktop.png`, `social-mobile.png`, `export-social-{390,768,1440}.png`, `final-preview.png`: browser captures.

Working branch remains `integration/local-release-next-20261110`; changes are local and uncommitted. No production change, push, deployment, branch deletion, live enquiry, provider request, booking or email was performed.
