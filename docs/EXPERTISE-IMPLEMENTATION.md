# Expertise portfolios: implementation review

## Starting point
- Source branch: `integration/portfolio-final-20261112` (the current Next.js/static-generator integration, not the older `main` application).
- Content inventory: `src/data/projects.json`, `src/data/archive-records.json`, and the existing case-study pages.
- Existing hero markup and `src/styles/hero.css` were not modified. The Sera widget, booking logic and unrelated routes are unchanged.

## Implemented
- Three editorial portfolio destinations under `/expertise/`: creative-direction, product-development and video-production.
- Shared project taxonomy in `src/data/expertise.json` references actual project slugs and published/non-excluded archive records.
- New home section links to all three destinations; main menu and About page supply contextual access.
- Static site generation emits canonical and Open Graph metadata, schema, and sitemap entries via the existing `page()` helper.
- Next.js nested route renders generated content using existing metadata and markup helpers. The regular one-segment dynamic route excludes slash-containing keys.
- Responsive CSS with keyboard focus and reduced-motion considerations.
- Regression tests for taxonomy references and generated destinations.

## Editorial follow-ups (not claims)
- Brand direction: substantiate team size, leadership decisions and client-approved outcomes.
- Product: replace collection-level previews with problem/role/constraints/decisions/solution/outcome case studies; label each concept, prototype, MVP or shipped product from primary records.
- Video: add a dedicated licensed showreel, exact production credits, posters and accessibility-reviewed playable media. Existing verified film links are used in the interim.
- Do not treat the unfinished Sera assistant as a finished product.

## Verification needed before merge
1. Run `python3 -m unittest tests/expertise.py` from repository root for taxonomy integrity.
2. Run `npm run build` with Node.js, Python 3, Pillow and existing asset tree available.
3. Run `python3 -m unittest tests/expertise.py` again for generated routes.
4. Run `npm test`, `python3 tests/seo.py` and `python3 tests/production.py`.
5. Browser-check desktop and mobile, including menu/links, visual contrast, interactions and Sera.
6. Verify generated `/expertise/*` pages and metadata in preview before merge or deployment.

No local production build or visual browser verification was completed by this GitHub-only edit session.

## Design iteration: role-specific portfolio experience
- Editorial hero for each profile, featuring a real portfolio project with overlay credit and project link.
- Design-specific accent palette per role (creative lavender, product cyan, video coral), unified by existing typography and dark visual identity.
- In-page chapter navigation: About, Work, Process, Experience, Capabilities, Films (video only), Contact.
- Role-specific biography and sourced career/project history, not duplicated generic About text.
- Alternating large-format case-study layouts with actual decision statements and services from original project source.
- Distinct preview grid for archive items where richer case-study documentation is still absent; status not overstated.
- Three-step working approach per discipline, video watch links, and targeted email subject/CTA.
- Native disclosure control inside existing site menu: About Hadi / choose a role-specific portfolio.
- Responsive layout and reduced motion CSS. Page hero, Sera runtime, original case studies, and booking code remain unchanged.

### Verification status
GitHub source changes are committed, but the production Next.js build, visual regression inspection and mobile/browser tests have **not** run in this session. The PR must remain draft until those checks pass. The existing single CV still serves all three profiles; do not label it role-specific without generating and approving appropriate variants.

## Reference-inspired refinement (November 2026)

Design reference research:
- Clay: project-led proof, cinematic framing, and creative direction rather than generic feature grids.
- Eleken: SaaS specialization, recognizable product contexts, task-centered capabilities, clear hiring narrative.
- Dreamten: seniority, ownership, constraints and documented outcomes before cosmetic claims.
- Webflow design: reusable visual language, responsive component patterns and purposeful interactions.

None of the four external layouts or assets are copied. The implementation retains existing site typography (Nebulica, Instrument Sans, IBM Plex Mono), colors from `src/styles/case-study.css` (`--ink`, `--paper`, `--identity`, `--product`, `--systems`), navigation, locked homepage hero and Sera.

### Interaction system
- Portfolio reading progress and scroll-aware, keyboard-focusable chapter navigation
- Revealed case studies only when visible (disabled with reduced motion)
- Product/category preview filters based on documented project type
- Click-to-load video previews with close-to-stop behavior, no eager third-party embeds
- Semantic disclosure components for three evidence-grounded questions on each professional identity
- Three role-specific URLs with distinct semantic H1, introductory copy, case-study proof and career experience

### SEO, answer-engine and generative search readiness
- Unique canonical URLs, descriptive titles, Open Graph images, semantic headings and natural-language summary copy
- Existing source-derived ProfilePage graph plus visible answer pairs with corresponding FAQPage structured data
- Explicit differentiation of published case studies from unverified concept/previews and **no fabricated case metrics**
- Direct discoverability from homepage and main navigation
- Static server-rendered HTML, no client-only core copy; appropriate for crawlers that do not execute JS
- AEO/GEO readiness does **not** guarantee indexing, AI citations, featured answers or rich snippets

### Adaptation of supplied Stageshow skill
Use the skill's framing, restraint, leading subject, mobile-first composition and cause-driven motion principles. Do **not** replace the owner's real product images with invented UI, fictional dashboards, simulated results or a stock-faux demo. If a genuine interactive product walkthrough is later requested, build it from independently approved product states and test at full-width and compact widths, including a stable poster and reduced-motion fallback.

### Editorial and operational release conditions
- Owner approval of project ownership, production status, screenshots and exact video credits
- Real assets imported to `public/assets/expertise/` for optional cinematic photo sections, if approved
- Browser screenshot inspection at 360, 390, 768, 1024, 1440 widths; Chromium and WebKit
- Verify all CSS source tokens match the established brand; no generic theme or unauthorized font
- Run full build, SEO test, links test and responsive suite after final asset import
- Merge only after final owner approval; do not claim deployed or Lighthouse scores not measured
