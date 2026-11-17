# Onlines reference rebuild — Product Design

Owner request: replace the rejected page with the structure and interactions of https://onlines.com.ar/, using Hadi Hassan / INTELLIGNCE branding, portfolio content and theme. Continues the existing checkout and feature branch from `b894896a583eb86a4376c66507b7de13b60574a3`.

## Inspection and implementation

Inspected the live desktop (1440 px) and mobile (390 px) page, its successive scroll states, heading geometry and public first-party CSS. `reference-layout.json` and reference screenshots record the inspection. Temporary source inspection files were kept outside the repository. The implementation uses native HTML/CSS/JS; reference tracking scripts, company branding, client logos, staff identities, project artwork and copy were not incorporated into the website.

| Reference sequence | INTELLIGNCE implementation |
| --- | --- |
| Minimal wordmark/header with fixed contact pill | Existing brand mark, home link, menu and fixed contact |
| Oversized “internet.” canvas, grid, selection handles, floating UI/tool cards, cursors and notes | “product.” canvas with supplied TMS/CallingDr/AppTech art, draggable desktop elements, visual AI-mode switch and original theme/type |
| Oversized scroll-revealed statement | Product design and leadership positioning, word reveal |
| Three halftone service panels | UX research, interface/design systems, design leadership/consulting |
| Rounded feature with right-side laptop crop | Zero-to-one process, supplied Consumer Connect artwork and existing booking entry |
| Floating team-card canvas and selected text | Four genuine flagship products with their unchanged URLs and accurate stages |
| Left copy + three-card fan, names strip | Supplied design presentations, portfolio viewer and genuine project/product names |
| Three editorial cards | Existing case-study collection destinations |
| Collage contact, oversized heading, footer | Supplied workspace/portrait, email, CV, Sera, archive and privacy access |

The layout replaces the earlier Framer-inspired overview rather than layering more sections onto it. Nebulica, Instrument Sans, IBM Plex Mono and existing dark/lavender tokens intentionally replace the reference's Inter/white/blue brand treatment. Text lengths and supplied image aspect ratios differ from the source; this is a content-and-brand replacement, not a claim of identical pixels or original source-code ownership. The visual AI-mode switch changes the canvas treatment; it does not itself make an AI request.

All nineteen supplied presentations and the original 23-screen phone collection remain in the portfolio dialog. The nested artwork lightbox, phone tabs and two-layer screen change are retained. Existing case routes, other expertise pages, homepage, approved hero and protected phone implementation are preserved. No clone, reset, branch deletion, main modification or deployment.

## Build and validation

Use the complete repository pipeline: `npm run build:acceptance`, then `python3 scripts/qa/acceptance-build.py --verify`. Review `verification.json`, actual-export browser reports, accessibility report and logs for final results.

The installed Next 16.4.4 stopped the guarded build with a known-security advisory. `npm audit` identified GHSA-mfr8-8qww-v76h (affected through 16.4.4, patched release available). Updated only Next and corresponding locked packages to 16.4.6, an existing stable patch on the same release line. The clean guarded build does not retain Next's temporary retry cache, so repeatedly retrying the old vulnerable version did not resolve the stop. No security checks were disabled. Upstream release notes: https://github.com/vercel/next.js/releases/tag/v16.4.6 ; advisory: https://github.com/advisories/GHSA-mfr8-8qww-v76h .

The former `product-flight-browser.cjs` and `product-components-browser.cjs` suites describe the superseded page. They remain in history/source for recovery, and are replaced in active CI by `product-onlines-browser.cjs`. New checks cover the actual final export at five widths in normal/reduced motion on Chromium and WebKit, including canvas mode/drag, menu, unchanged product links, 19 presentations, nested lightbox, phone controls, booking entry, overflow and heading clipping. Source/SEO/export tests and the full npm suite also run.

Local preview is the actual static export at http://127.0.0.1:3000/expertise/product-development/ . Static serving does not execute PHP. Booking/Sera interfaces and automated contracts are checked; live Calendar, CRM, mail, Meet and authenticated product writes remain unverified. The owner-reconfirmed TMS URL is retained despite its previously observed 404; Flow remains a product presentation. No live integration success is inferred from an open dialog or HTTP 200.

Final results: 40 actual-export browser scenarios passed (20 redesigned page, 20 other expertise pages), 23-script npm suite, 4 expertise tests, 7 protected phone-source tests, SEO across 25 pages and export audit across 27 routes. Four WCAG-tagged Axe scans reported zero violations; incomplete ARIA/contrast checks remain for manual review. The final dependency audit reports zero known vulnerabilities. See verification.json and individual logs for scope.
