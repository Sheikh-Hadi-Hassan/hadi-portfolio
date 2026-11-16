# Product Design flying-cards hero — 16 November 2026

The Product Design & Development hero now uses the owner's first attached workspace image behind an independently implemented center-out entrance and reversible, scroll-driven 3D ring. The existing Next.js/Python generation pipeline remains authoritative. No deployment, main-branch merge, or change to Sera/booking is part of this work.

Preview: http://127.0.0.1:3000/expertise/product-development/

Branch: `feature/expertise-portfolios-20261113`. Existing PR: https://github.com/Sheikh-Hadi-Hassan/hadi-portfolio/pull/3 (base: `integration/portfolio-final-20261112`).

## Reference inspection

Inspected https://flyingcardshero.framer.website/ in an actual Playwright Chromium browser at 1440, 768 and 390 pixels. The agent-browser CLI was unavailable, so Playwright supplied browser interaction and screenshots. The text fetch tool could not open the live reference; the browser could. Supporting description: https://www.framer.com/marketplace/components/flying-cards-hero/ . No proprietary implementation or reference artwork was imported into the site.

Evidence is in `reference/`: initial, intermediate, ring, completed, reverse and returned frames at all three widths; entry samples; hover capture; and runtime observation JSON. Entry sample filenames are observation labels, not exact timing benchmarks. Inspection included down/up scrolling, hover and viewport changes. The reference's single 300vh scene ends at the end of its page; our scene releases into the existing portfolio chapters.

Observed composition and motion:

- Light field, large opposing two-line headlines and a low centered paragraph. Scattered artwork occupies foreground and background planes, including edges outside the visible frame.
- Approximately 36 main card groups, with four image layers per group (144 runtime image elements including trails). Observed nominal formats include 130×173, 150×150, 168×134 and 134×168, with projected size varying by depth.
- Center-out entrance, stagger, temporary directional softness/trails, soft settling, and a line-by-line heading entrance. Hover changes local 3D orientation; runtime before/after transforms were recorded rather than reverse-engineering bundled code.
- Cards converge sequentially during downward scrolling. The headline gives way to a centered cylindrical ring; scroll rotates the ring, and upward scrolling returns toward the scattered scene. Tablet/mobile retain a dense composition with different text wrapping and visible-card distribution.
- At the completed position the reference has a close, upright 3D cylinder. Our independent implementation reproduces the sequence and reversibility, not exact trajectories, easing constants, internal spring behavior or pixel fidelity.

## Art direction and implementation

- `scripts/product_flight.py` renders semantic HTML only for `product-development`. It retains one H1, the existing role, statement, back link, gallery link and contact destination.
- `src/data/product-flight.json` curates twelve original interface captures from Consumer Connect, Omni Help and AppTech. The first six interleave the three projects for the mobile layout. Each card links to the existing screen gallery. Source aspect ratios drive the card dimensions; artwork is contained rather than stretched.
- `src/product-flight.js` is an isolated guarded module. `requestAnimationFrame` renders initial arrival and coalesces scroll/resize work; `IntersectionObserver` and document visibility pause off-screen work. Card gathering, cylindrical position, yaw and spin are deterministic functions of actual document scroll position, so reverse scrolling retraces the same state. There is no timer-driven idle ring rotation or scroll interception.
- `src/styles/product-flight.css` contains the new scene selectors, sticky layout, contained hover/focus flips, heading reveal, tablet layout and a dedicated six-card mobile composition. It uses Nebulica, IBM Plex Mono, the dark foundation and the existing product accent token. No new dependency.
- `scripts/build.py` appends the two isolated modules to the existing fingerprinted assets. `scripts/optimize-images.py` supplies a card-specific responsive `sizes` hint instead of requesting viewport-sized card images.
- The original `36b410d0-cb8c-4d65-887c-137cdfc26a63.jpeg` is preserved byte-for-byte as `public/assets/expertise/product-flight-workspace.jpeg`. Two WebP sizes retain its composition and color. Responsive cover and CSS contrast gradients do not alter the source file. This is editorial workspace imagery, not evidence of a research session. The other attached variations were not used as cards or substituted for project evidence.
- Reduced motion removes the pinned duration, entrance, scroll transforms and flips, exposing a static six-card gallery with the same actions. With JavaScript unavailable there is also a normal-flow static fallback.

Deliberate differences from the Framer reference: twelve desktop/six mobile cards, persistent role/CTA copy, a right-hand desktop ring, project labels on card backs, and no colored motion trail. The existing site identity, meaningful project links, background subject and readable actions take priority over copying the reference's artwork density.

## Preservation and remote work

The existing worktree was used; no clone or reset. `starting-status.txt` records pre-existing generated asset changes and fourteen untracked original gallery images. Those image files are retained and included so the existing 23-screen gallery remains complete in a fresh checkout. Generated public assets are refreshed through the documented build, including previously pending gallery output.

A pre-push comparison found four newer remote commits ending at `c1229360c26fc1c798c584393d9195142f66eaa1`. They were incorporated by fast-forward, preserving the owner's newer AppTech Admin phone framing and 680ms two-layer screen wipe. The hero does not edit that gallery implementation. `gallery-adoption.json` records the adopted source hashes; `baseline-hashes.json` records the earlier local checkpoint. Homepage HTML, approved hero CSS and hero-lock file remain unchanged. Sera, consent, booking and backend sources are unchanged.

## Verification and limits

Final results are recorded in `verification.json`, the browser JSON reports and accompanying logs. Browser screenshots in `screenshots/` show desktop/mobile initial, intermediate, ring, reverse, released and reduced-motion states. Additional viewport captures stay in ignored `artifacts/product-flight/` and `artifacts/expertise-qa/`.

The build runs hero verification, Python generation, responsive image/metadata preparation, Next webpack export, asset pruning, Flight hydration audit and source/output receipt capture. The preview continues to use the existing local Next development server; browser acceptance uses the actual production export served independently.

Earlier attempts and environmental issues are retained in logs: the default macOS temporary path triggered the existing staging symlink guard; the same 23-script suite passes with `TMPDIR=/private/tmp` without weakening the guard. Older tests assumed nine total gallery screens, a single collection wrap and obsolete pixel cells. They now check all installed manifest collections, original or content-hashed responsive sources, the current global wrap and the adopted two-layer wipe. One screenshot write hit transient `ENOSPC`; the final browser rerun is recorded separately. Intermediate test passes are not acceptance of the final export.

Live AI provider calls, consented external processing, CRM writes, enquiry delivery, Calendar/Meet creation, mail notifications and production hosting are not exercised by these local visual tests. No production release is claimed. Automated contrast results cannot fully judge every pixel of a moving photographic background; incomplete axe checks are retained in the browser report for manual review. Physical-device GPU performance is unverified.

### Final local results

- PASS: complete guarded production build and matching source/export receipt; 25 canonical-page SEO checks and 27 exported-route asset/link checks.
- PASS: all 23 npm test scripts, four expertise tests and seven phone-stack source tests.
- PASS: 20 new exported-hero scenarios (five widths × standard/reduced motion × Chromium/WebKit), 30 existing expertise export scenarios and 10 isolated synthetic phone-gallery fixture scenarios.
- PASS: zero axe violations in the hero scenarios. Remaining automated contrast checks are incomplete over the photograph and are reported per browser.
- PASS: adopted gallery sources, homepage hero and lock are unchanged. CI now runs the new hero tests in both engines and uploads their artifacts.
