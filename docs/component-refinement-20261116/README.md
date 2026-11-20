# Product portfolio: component refinement

Continues `feature/expertise-portfolios-20261113` from `80c185e2b52b48337101ac2e75eefbbeefb95603`. No deployment, main change, reset, clone or replacement of recovered content.

## Design decisions

Inspected all four supplied Framer demos in desktop and mobile browsers, including click, hover, drag and scroll states. Reference screenshots and observations are in `reference/`.

- **Showcase Card Preview:** four rounded flagship cards with image captions, launch links and a bottom chevron that expands a secondary information panel. Native details/summary supports keyboard and no-script use; motion adds a reversible height reveal. Existing homepage fonts, lavender theme tokens and button system remain authoritative.
- **Curved gallery:** the supplied selected-project artwork follows a cylindrical arc on desktop, with 16 decorative image strips per card for actual surface curvature. Drag, arrows and keyboard rotate nine projects; clicking opens the original artwork in the existing lightbox. Mobile and reduced-motion use the complete stacked/grid collection. Normal vertical scrolling is never captured. Rendering pauses when settled, offscreen or hidden; background textures initialize near the viewport.
- **Flying Cards Hero:** retained the existing nineteen supplied-artwork cards and reversible scroll sequence, rather than adding another hero or section.
- **Phone Stack Carousel:** retained all 23 screens, collection navigation, stationary phone frame and adopted 680 ms two-layer transition. Added only a soft outer edge fade. The protected phone source and homepage files remain byte-identical; see `protected-source.json`.

The original Framer packages are not installed in this repository. These are independent native implementations of the observed behaviors, not imported proprietary source or a claim of pixel-exact equivalence. Original demo artwork was not added to the website; reference screenshots are review evidence only.

Kept six useful sections: hero, four flagship products, selected work, phone gallery, shared process and contact. Reused supplied artwork already imported with provenance in `docs/flying-hero-artwork-20261116/asset-provenance.json`. AppTech pitch HTML was read as a factual content source for the concise attendance/building/riser/shift-review description; its scripts were not executed or published. Duplicate images and posters with conflicting legacy product names were not forced into the page.

## Verification

Built through the full documented `npm run build:acceptance` pipeline, including static generation, responsive images, Next export, pruning, hydration audit and source/export receipt. Browser checks use the actual exported pages, with external requests blocked and no writes to external services.

See `verification.json`, `components-{chromium,webkit}.json`, `browser-{chromium,webkit}.json`, logs and `screenshots/` for final results. Component tests cover five widths (360–1440 px), normal/reduced motion, expansion/collapse, keyboard, drag, idle pause, static fallbacks, lightbox and overflow. Flight tests additionally check the hero, product links, six-section structure and existing phone transition. CI now runs the new component tests in both engines.

No new backend/integration claim is made. Booking/Sera automated contracts are tested; live email, Calendar, CRM writes and authenticated product workflows are not exercised. Owner-specified TMS URL remains `https://tms-theta-eight.vercel.app/login`; its previously observed 404 is not repaired by this UI change. Flow remains a product presentation link. Existing product URLs are unchanged.

Local preview: http://127.0.0.1:3000/expertise/product-development/ (actual static export; PHP integrations are not executed by the preview server).

Accessibility: full-page Axe scans at 1440/390 px retain `aria-hidden-focus` (6/2 nodes) and `label-content-name-mismatch` (20/7 nodes) findings in existing hero/phone UI. No reported violation targets the new product cards or curved gallery. Incomplete ARIA/contrast checks also require review. These findings are preserved in `accessibility.json`; this release does not claim accessibility certification or a zero-issue full-page scan.
