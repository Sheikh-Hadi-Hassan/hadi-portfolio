# URL policy for the current release

Reviewed 10 November 2026 against release/next, commit 79ec06a872e061be4d32278a67f729600118cb95. No live redirects or hosting settings were changed.

Canonical production origin: https://hadi.intellignce.net. `scripts/build.py` generates self canonicals, Open Graph URLs, structured data, sitemap and robots using `SITE_URL` (production origin by default). Image preparation adds image sitemap discovery. Build with the intended origin; do not replace URLs inside an already compiled Next export.

The current application preserves dedicated first-party case studies at `/<slug>/`, including Morganics, Bits HR Link, Intellignce, Mackenzie Cramblit, Accessorize by HL, Fakhr-e-Qoum and the other projects in `src/data/projects.json`. `/archive/` is a real project directory; `/resume/` links the original PDF. Shared navigation already exposes both.

The older SEO branch's redirects from those case studies to `/work/<slug>` or generic `/work#identity` must not be merged: they would replace working, detailed pages with obsolete destinations. Next export does not implement server redirects. Any future Apache redirect needs separate approval and HTTP verification against the actual Hostinger configuration.

Possible compatibility aliases `/work/<slug>/`, `/nicemd/` and `/jules-capital/` need live traffic/link evidence before a future redirect policy is chosen. The current first-party names are `/nicemd-ai/` and `/jules-capital-partners/`. No claim is made that aliases currently redirect.

`/llms.txt` carries the useful discovery improvement from the navigation review branch. It is generated from current project records and production origin, links only current pages, and avoids obsolete Systems Lab/FLOW routes or unsupported business claims.

Local checks should confirm all 22 canonical routes, sitemap equality, robots and image sitemap references, metadata uniqueness, real PDF and image assets, and browser navigation. Production indexing, redirect responses and Search Console remain outside this local task.
