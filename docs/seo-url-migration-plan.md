# SEO URL migration plan for hadi.intellignce.net

Updated: 2026-10-26  
Target hosting: Hostinger  
Status: source changes staged in draft PR; no production deployment performed.

## Hosting decision gate

The repository is built with Vite + Vinext, not a conventional `next build` workflow:

- `npm run build` calls `scripts/build-verified.sh`, which runs `vinext build` inside the configured Sites environment.
- `npm start` calls `vinext start`.
- `vercel.json` declares `npx next build`, but this file does not configure a Hostinger deployment.

Before deploying, confirm the actual Hostinger deployment type:
- **Hostinger Node.js app (Business/Cloud plan):** configure the repository's verified build and start commands in hPanel. Validate that the Hostinger runtime satisfies the project's Sites/Cloudflare environment assumptions before using it.
- **Traditional shared hosting / `public_html`:** do not upload this source tree as if it were a static website. First confirm whether the project can be built as a fully static export, and verify every required form, AI, CRM, booking, and server-side feature still works. If not, this hosting mode is unsuitable without architecture changes.

Do not infer the plan or deployment type from the fact that the domain is on Hostinger.

## Legacy URL policy

Prefer preserving full case-study content at a stable first-party URL when enough approved project content and assets are available. Redirecting a detailed case study to a generic archive category is a fallback, not an equivalent replacement.

| Legacy path | Current branch destination | Recommended handling |
|---|---|---|
| `/morganics/` | `/work/morganics` | Keep direct mapping; verify page and trailing-slash behavior |
| `/bits-hr-link/` | `/work/bits-hr-link` | Keep direct mapping; verify page and trailing-slash behavior |
| `/intellignce/` | `/work/intellignce` | Keep direct mapping; verify page and trailing-slash behavior |
| `/mackenzie-cramblit/` | `/work#identity` | High priority: restore a dedicated case study if approved content/assets are available |
| `/accessorize-by-hl/` | `/work#identity` | High priority: restore a dedicated case study if approved content/assets are available |
| `/fakhr-e-qoum/` | `/work#identity` | High priority: restore a dedicated case study if approved content/assets are available |
| `/edlytics/` | `/work#products` | Medium-high: consider a dedicated case study; existing external Behance case is linked in the archive |
| `/linkedin-personal-brand/` | `/work#identity` | Medium-high: consider a dedicated case study; existing external Behance case is linked in the archive |
| `/community-campaign/` | `/work#identity` | Medium: preserve first-party content if approved materials exist |
| `/nicemd/` | `/work#identity` | Medium: archive currently links to the published Behance case |
| `/al-faraj-media/` | `/work#identity` | Medium: archive currently links to the published Behance case |
| `/bw-sports/` | `/work#identity` | Medium: archive currently links to the published photography case |
| `/ai-animation/` | `/work#identity` | Medium: archive currently links to the published Behance case |
| `/jules-capital-partners/`, `/jules-capital/` | `/work#identity` | Confirm canonical legacy spelling and merge duplicate paths only if they represent the same project |
| `/uiux-web-saas/` | `/work#products` | Medium: use the most relevant archive destination or create a dedicated route when evidence supports it |
| `/archive/` | `/work` | Keep as archive migration |

The current redirect set contains 17 entries. This table is a migration plan, not proof that the redirects are live or returning the intended HTTP status.

## Pre-deployment validation checklist

1. Confirm the intended Hostinger site, hosting plan, app type, build command, start command, and connected Git branch in hPanel.
2. Install from the committed lockfile and run the project's intended build/test scripts in a compatible environment.
3. Check that every `/work/<slug>` destination renders a real page and returns a successful response.
4. Check all 17 redirect rules over HTTP, including old URLs with and without trailing slashes; confirm permanent redirect status and final destination.
5. Check `/robots.txt` and `/sitemap.xml` on the live target; verify every sitemap URL is canonical and returns a real page.
6. Confirm the final production build still supports the site's forms, AI, CRM, booking, email/calendar integrations, and any other server-dependent features.
7. Compare the current production homepage and portfolio routes with the release candidate before switching traffic.
8. Deploy only after the checks pass, then re-test the live site and monitor Search Console for 404s, redirects, canonical selection, and indexing.

## Current blockers

- This environment has no connected Hostinger website-management connector, so hPanel plan/app settings and deployed files have not been read.
- The build and automated tests have not been executed here.
- Live HTTP status checks for redirects, robots, and sitemap are unconfirmed.
- No production deployment or merge has been performed.
