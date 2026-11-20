> Integrated into the [homepage-consistent redesign](../product-brand-redesign-20261116/README.md). Its final build and test reports supersede this intermediate artwork-only run.

# Owner presentation artwork update — 16 November 2026

Replaces the previous raw mobile screenshots in the Product Design flying-card hero with all 19 supplied project presentation images from the owner's `Desktop/UIUX/Hadi.pptx` folder. The workspace background and existing 23-screen phone gallery are preserved.

The desktop scene uses all 19 images; the six mobile cards show CallingDr, Omni Help, Consumer Connect, Care, Vera Health and legal-management work. Full landscape compositions are contained at their original aspect ratio, with responsive WebP derivatives. Original PNG files remain untouched. `asset-provenance.json` records source and derivative hashes and dimensions, including both supplied dashboard presentations 25 and 26.

The card manifest, landscape dimensions, responsive image hints and seven extra scatter positions are updated. Entrance duration now accounts for the visible card count, allowing every card to finish settling. Project cards link to the selected-work section; the separate primary action still opens the original phone gallery.

The guarded build and browser results in this folder supersede the artwork-specific details in the earlier flying-hero report. No homepage hero, phone-gallery implementation, Sera, booking, main branch or production deployment changes.

Validation: complete `npm run build:acceptance`, source/output receipt, SEO and export audits, and actual-export Chromium/WebKit tests across 1440, 1280, 768, 390 and 360 pixels with standard/reduced motion. Browser reports include card loading, heading and CTA visibility, forward/reverse/ring states, card links, hover, release, overflow and preservation of the existing two-layer phone wipe. Live provider integrations and physical-device performance remain outside this artwork update.
