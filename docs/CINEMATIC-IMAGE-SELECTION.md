# Curated cinematic imagery: Product Designer profile

## Creative direction

Use only two visual sequences in the Product Designer profile. Keep product UI and case-study evidence as the priority; the studio scenes are editorial illustrations, not documentation of user interviews, testing, or a live product launch.

1. **Overhead workspace**: atmospheric editorial transition after the role-specific About Hadi section, before selected case studies. Source: uploaded `Shot_-_🦅_overhead_45b9810f.png`. Optimized output: `public/assets/expertise/product-process-overhead.webp`, 1600 × 894, approximately 119 KB.
2. **AppTech process studio**: near the AppTech project preview, directly after selected work. Source: uploaded `Redesigning_AppTech_product_work…_5c23a352_2K.jpg`. Optimized output: `public/assets/expertise/apptech-process-studio.webp`, 1600 × 893, approximately 115 KB.

The other eight images are similar angles, alternative crops, or a byte-identical duplicate. Avoid repeating the same studio story across multiple sections.

## Installing the owner-supplied image pack

The images have **not** been pushed into GitHub because the current GitHub connector only accepts text/blob data and cannot directly import the user's local image attachments. Code is committed with optional asset detection. A repository checkout without the two assets builds normally and simply omits these two editorial sections.

Copy the files in the supplied `product-cinematic-assets.zip` into the working repository using:

```bash
cd ~/Documents/Hadi-ntellignce/hadi-portfolio-final
unzip -o ~/Downloads/product-cinematic-assets.zip -d .
npm run dev
```

Or place the two WebP files manually under `public/assets/expertise/`.

When you're satisfied, commit and push the two binary assets on `feature/expertise-portfolios-20261113`:

```bash
git add public/assets/expertise/apptech-process-studio.webp public/assets/expertise/product-process-overhead.webp
git commit -m "Add curated owner-approved cinematic portfolio imagery"
git push origin feature/expertise-portfolios-20261113
```

## Integrity and accessibility

- Both images preserve full source framing with native width and height, `object-fit: contain` and `height: auto`.
- Meaningful alt text and explicit editorial-not-evidence captions.
- Below-the-fold lazy loading; WebP images optimized to 1600px width.
- No extra JavaScript or third-party player dependencies.
- The Product Designer page remains readable and functional if one or both optional images are missing.
- Mobile and tablet layout uses a single column; desktop uses a split AppTech story and wide overhead transition.
- Existing Creative Director and Video pages are untouched.

## Review

Confirm that the screen shown in the studio photo is a stylized product visualization, not a substitute for actual user flows or screenshots. AppTech project status, research process, technical stack, and team ownership should be taken from independently verified project records before writing more detailed case-study claims.
