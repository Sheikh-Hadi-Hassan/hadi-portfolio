# Product portfolio aligned with the homepage — 16 November 2026

The Product Design & Development page now follows the homepage's visual system and focuses on the work. It retains the flying-card interaction, replaces its raw screenshots with all 19 owner-supplied presentations, and prioritizes TMS, AppTech, Crent and Flow.

Preview: http://127.0.0.1:3000/expertise/product-development/

## Brand audit and design decisions

| Area | Homepage authority | Product page result |
| --- | --- | --- |
| Typography | Nebulica display, Instrument Sans body, IBM Plex Mono utility labels | Same fonts, heading weight, type roles and label treatment |
| Palette | `--theme-bg`, surface/raised/text/muted/accent/border tokens | Shared dark foundation, lavender accents and quiet surface borders replace the orange interface theme |
| Buttons | Existing `.bf-button`, 10px radius, 48px minimum height | Same component geometry and type; accessible lavender/dark-label primary and raised-surface secondary variants |
| Featured products | Existing `.digital-products`, `.products-grid`, `.product-card` components and product manifest | Four image-led flagship cards, with two desktop columns and one mobile column |
| Portfolio artwork | Artwork-led cards, rounded media and complete image compositions | Nine curated presentation tiles using the existing zoom/lightbox behavior; all 19 supplied images also appear in the hero |
| Process | The homepage's actual `.creative-process` markup and paper-note components | Reused component, with its own section/heading IDs; native disclosures remain functional |
| Navigation and footer | Shared INTELLIGNCE dock, logo, contact/CV links and footer | Preserved; a short chapter rail supports navigation within this page |
| Spacing | Editorial section rhythm, approximately 5% desktop gutters, responsive headings | Same spacing language, responsive card grids and a restrained contact section |

The heading “Product design. Made usable.” connects to the homepage's product positioning. Contact continues to address both design leadership roles and consulting. No new results, client claims or commercial-release assertions were invented.

## Focused page flow

1. Flying-card hero, with the owner's workspace background.
2. Four featured products: TMS, AppTech, Crent and Flow.
3. Selected interface work with full-size artwork viewing and the existing design-collection link.
4. The existing 23-screen interactive phone gallery.
5. The homepage's working-process component.
6. Direct contact and CV actions.

Removed from this overview: repeated About, employment history, capabilities, FAQs, additional-reference lists and optional cinematic/studio sections. Their underlying case studies, archive records, About/CV destinations, images and source data are retained. Other expertise pages remain independent.

## Flagship link verification

Read-only browser checks are recorded in `live-links.json`.

| Product | Result | Presentation |
| --- | --- | --- |
| AppTech | HTTP 200, redirects from `/app` to sign-in | Sign-in required; authenticated workflows were not tested |
| Crent | HTTP 200, dashboard rendered | Product preview; no data-changing actions performed |
| Flow | HTTP 200, product/investment presentation rendered | Product presentation; no backend operation claimed |
| TMS | HTTP 404 at the supplied URL | Exact URL retained after the owner explicitly reconfirmed it; interface artwork is featured |

TMS remains `https://tms-theta-eight.vercel.app/login`. The portfolio cannot repair that external Vercel deployment by changing its local page. No credentials, registrations, transactions or external submissions were used during these checks.

## Implementation and preserved work

- `scripts/product_portfolio.py`: focused page composition, existing product data, selected artwork, native enlargement, reused homepage process and contact.
- `src/styles/product-portfolio.css`: page-scoped homepage palette, component variants, typography, responsive layout and chapter offsets.
- `scripts/product_flight.py`, `src/data/product-flight.json`, `src/product-flight.js`, `src/styles/product-flight.css`: all 19 landscape presentations, proportional card sizes, complete entrance timing for the increased count, existing reversible scroll/ring behavior and reduced motion.
- `scripts/expertise.py`, `scripts/build.py`, `scripts/optimize-images.py`: integration with the documented build and responsive-image pipeline.
- Existing browser/source suites and CI: specialized product coverage now checks the new page flow, flagship URLs, homepage button/type tokens, enlargement, process disclosures and preserved phone behavior. The other two expertise pages retain their separate checks.

The approved homepage HTML, hero CSS/lock, Sera, booking, original phone-gallery JavaScript/CSS and screenshot manifest are unchanged. Earlier remote gallery commits remain in history. The supplied PNG files remain untouched; derivative/source dimensions and hashes are recorded in `../flying-hero-artwork-20261116/asset-provenance.json`.

## Verification and limitations

Final counts and status are recorded in `verification.json`; browser JSON, build/source/audit logs and desktop/mobile captures accompany this report. The final browser tests use the actual Next production export, not a synthetic page. The entrance test records real early transform mutations so slower network-idle completion cannot produce a false failure after an already completed entrance.

The earlier artwork-only browser run had one late-sampling entrance assertion failure. That harness timing issue is addressed in the final suite. The local Next development preview also encountered a build-cache/disk-pressure error; the preview was restored by serving the verified production export at the same URL. Only regenerable Next development/cache files were cleared, without resetting source or history.

The preview server is `python3 -m http.server 3000 --bind 127.0.0.1 --directory out`. It does not execute PHP. Authenticated product workflows, live Sera/provider calls, CRM writes, enquiry delivery, mail and Calendar/Meet operations remain unverified by this visual update. Automated accessibility incomplete results are retained for review; zero reported violations is not a formal compliance certification. Physical-device GPU performance remains unverified. No deployment or main-branch modification.
