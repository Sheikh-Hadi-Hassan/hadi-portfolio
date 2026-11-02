# Hostinger shared hosting release

This project originally targets ChatGPT Sites/Vinext on Cloudflare Workers. A source ZIP is NOT an upload-ready website.

## Release process
1. GitHub Actions workflow `.github/workflows/hostinger-static.yml` attempts a Next.js static export and runs route checks.
2. Only if the workflow passes, download the `hadi-hostinger-static` artifact and extract the ZIP **contents** into the correct Hostinger domain's `public_html`.
3. Back up the existing site before replacing its files. Confirm the domain points at that directory.
4. Configure external providers separately. The contact form currently uses FormSubmit and may require inbox activation.

## Important limitations
- The public site is static. Server-side API endpoints, private admin, CRM, booking, calendar writes, and Sera AI are **not implemented by this export**.
- Do not claim those features are live or reliable merely because the static site renders.
- Do not deploy if GitHub Actions reports a failed build, missing assets, or missing routes.
- A downloadable PDF is not included until the actual resume is added under `public/` and linked.
- A fully integrated system needs a separate secure backend hosting and operational verification.
