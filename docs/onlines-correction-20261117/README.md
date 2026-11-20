# Product portfolio composition and motion correction

The previous implementation resembled the reference superficially. This correction addresses the measured visual problems documented in the external comparison audit, while retaining Hadi's content, palette, artwork and integrations.

## Changes

- One-screen hero, independent cursor paths, floating art, code typing, staged entrances and selection growth. Motion pauses offscreen and respects reduced-motion preferences.
- Scroll-held introduction with progressive word reveal; full readable static content for reduced motion.
- Three image-sampled Canvas 2D halftone service panels; redraw only on load/resize.
- Consistent paper/lavender typography, header contrast, dark feature scene, two-line portfolio/contact headlines, actual tool icons and one footer.
- Three authored portrait covers preserve the full landscape artwork. The fan enters from a stack with staggered spring transitions.
- Continuous product-name strip pauses on hover/focus and when offscreen. Reduced motion stays static.
- Three distinct case-study archive anchors; all four original product destinations, 19 full presentations and the 23-screen phone collection retained.
- Removed superseded product CSS/JS from the active shared bundle; originals remain in development history.

## Verification

See build.log, browser-*.json, visual-regressions.json, accessibility.json, unit.log and verification.json. The complete documented acceptance build ran, including static generator, image optimization, Next export, pruning, hydration audit and receipt validation. Automated checks cover both Chromium and WebKit, five widths and reduced motion. A separate visual suite measures the audited layout and motion failures. Desktop composition was also reviewed in the in-app browser; mobile screenshots were inspected from the exported browser test.

Protected homepage, hero stylesheet/lock, shared site JavaScript, expertise stylesheet and phone-stack data remain byte-identical. Existing Sera/booking interface entry was exercised without submitting external transactions. Live provider booking/calendar/email delivery and PHP integrations are unverified on the static local server. The owner-confirmed TMS URL is retained; no claim is made that its external service is healthy. No Hostinger deployment or main-branch change.

This is a custom implementation of the reference composition with owner content, not a claim of pixel-for-pixel identity or copied proprietary source.

## Tool icon provenance

Figma, Notion, Next.js and WordPress SVGs: Simple Icons, fetched from https://github.com/simple-icons/simple-icons/tree/develop/icons (CC0 project; brand marks remain subject to their owners' trademark policies). VS Code PNG: https://github.com/microsoft/vscode/blob/main/resources/linux/code.png, Microsoft VS Code repository artwork; no ownership or endorsement claim. These icons identify familiar design/development tools, not client relationships. No reference company artwork or staff imagery was imported.
