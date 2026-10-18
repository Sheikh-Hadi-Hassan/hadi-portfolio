# Hadi Hassan portfolio

Next.js App Router static portfolio using Tailwind CSS and GSAP/ScrollTrigger.

## Build

`npm install`
`npm run build`

The build first verifies the approved hero hashes, renders the seven shared-template pages, prepares server-rendered route content, and exports Next.js to `out/`. Sites serves that directory.

## Source

- `src/pages` and `src/data`: project content and shared case-study templates
- `src/app`: Next.js routing, metadata and scoped GSAP interactions
- `src/styles/hero.css`: approved hero (locked)
- `src/styles/bayfi-port.css`: scoped reference component CSS
- `src/styles/bayfi-brand.css`: Hadi brand adaptation and responsive layouts
- `design/reference-audit.md`: inspected stack, implementation and verification limits

Do not edit the hero snapshot or lock to bypass a failed check without an explicit hero revision request.

## Production checks

Build requires Node.js, Python 3 and Pillow (`PIL`) for responsive image derivatives. Original portfolio images remain in `public/assets`; generated display previews are in `public/assets/responsive`. The image preparation step caches variants by source-content hash and is safe to rerun.

Run `npm run build`, `python3 tests/seo.py` and `python3 tests/production.py` before publishing. Interaction checks are the Node scripts under `tests/`. These checks do not replace visual testing on real browsers and phones.

Current launch dependencies: enquiry delivery provider and end-to-end submission test, final-domain DNS and canonical migration, and visual browser QA. The existing contact dialog offers email/WhatsApp; it must not be described as a working submission form.

Image delivery: builds generate WebP candidates at 160, 480, 800 and 1280 pixels, with native candidates for smaller images and hero layers when smaller than the original. Layout-specific sizes guide selection; native originals remain available in the lightbox. Nondecorative portfolio images receive ImageObject metadata and an image sitemap. Run `python3 tests/images.py` after exporting to validate candidates and metadata.

Deployment pruning removes unreferenced asset cache files from out only. Source originals remain in the repository; gallery originals remain in the deployed export. Larger displays can choose original sources above 1280px.
