# Resume-led SEO, AEO and GEO audit — 11 November 2026

Scope: all 22 canonical portfolio pages in the existing `release/consolidated-20261111` checkout. Changes are for local development; no Hostinger deployment, main change, Search Console submission, paid keyword tool, analytics account or external integration is part of this work. This report supersedes the old positioning in the 2 November strategy/map.

## Positioning and evidence

Primary identity: **Hadi Hassan — Creative & Product Design Leader**.

Supporting commercial areas: creative direction; brand strategy and identity systems; product strategy, UX planning and SaaS/UI design; wireframing and MVP delivery; campaigns and visual storytelling. Founder & Product Lead at INTELLIGNCE. Lahore, Pakistan, working remotely worldwide. The CV supports 10+ years of experience, five professional roles and the current product-stage distinctions.

Source: owner supplied `Resume CV - Hadi Hassan  Creative & Product Design Leader  2026.pdf`; SHA-256 `ea26b6c2598589c9cc3ae6299359d3b0a83c70279773592182c0dd8784d123b1`. New public source: `/assets/hadi-hassan-resume-2026-11.pdf`. The earlier CV URL is retained in the actual export to avoid breaking existing references. The pruning pipeline explicitly preserves both current and previous CV URLs from the resume manifest, with byte-identity regression coverage. `src/data/resume-source.json` records identity/provenance, and the new PDF is linked from the resume page, assistant's profile citation and llms.txt.

Confirmed target: the owner explicitly chose **leadership jobs and consulting together**. Recruiters/hiring teams can review the CV and documented experience, then email a role brief. Consulting decision-makers can review relevant brand/product proof and share their challenge through the existing enquiry. Lahore/Pakistan and remote international teams remain the geographic context. No particular overseas office, service address, geography-specific client result or hiring availability is invented.

## Research method and limits

128 keyword candidates, short-tail and long-tail, are mapped across all 22 canonical pages, with six service clusters using the existing homepage. See `keyword-research.csv` and `keyword-map.json`. These are editorial hypotheses with commercial-intent prioritization, not verified volume or conversion forecasts.

Public search discovery examined actual commercial language on first-party providers:

- [Muzzlab](https://muzzlabs.com/): Lahore brand identity, UI/UX and digital experiences.
- [The Sam Osa](https://thesamosa.co/): Lahore brand strategy, creative direction and identity.
- [Elias Chapuis](https://eliaschapuis.com/services/brand-identity-designer): startup brand systems and application to websites/products.
- [Mool Studio](https://www.moolstudio.com/): SaaS product discovery, MVP design, UX and dashboard services.
- [Pixel2Tech](https://pixel2tech.com/services/branding-and-design): startup identity, guidelines, packaging and digital applications.
- [Jayy Studio](https://jayystudio.com/contact): buyer-brief fields and a commercial enquiry route.
- [Craig Pugsley](https://www.craigpugsley.co.uk/) and [Nick Clark](https://www.nick-clark.com/): first-party leadership portfolios and distinct recruiter/consulting journeys.
- [Jeremy Belcher](https://jeremybelcher.co/consulting/) and [Creativepool](https://creativepool.com/creative-directors): product-design consulting and creative-director hiring intent. These are terminology/intent references; their roles, availability, turnaround, outcomes and metrics are not attributed to Hadi.

Provider pages establish that these service concepts are commercially used. Project-specific query variants derive from the original case-study subject/deliverables; identity and utility variants derive from the CV and actual page purpose, as identified in the CSV. They do not establish monthly demand, relative difficulty, keyword rankings or lead conversion. Wording and conclusions are independently adapted to Hadi's actual CV/work; competitors' metrics, pricing, testimonials, turnaround promises and client claims are not imported.

No Search Console, Keyword Planner, Ahrefs or Semrush account/data source was connected. Every volume, CPC and SEO-difficulty field is explicitly UNVERIFIED. No keyword is described as the most searched or guaranteed to produce leads. [Google Keyword Planner](https://business.google.com/us/ad-tools/keyword-planner/) can supply search estimates; [Search Console](https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console) can establish actual queries, impressions, clicks and country/device/page performance after publication. Qualified enquiries, not raw traffic alone, should decide which targets earn continued investment.

## Priority keyword approach

| Intent | Short-tail themes | Buyer-focused long-tail examples | Destination/evidence |
| --- | --- | --- | --- |
| Leadership/entity | creative direction, product design leader | creative and product design leader in Lahore; design leadership portfolio | Home, About, current CV |
| Consulting | design leadership consultant, product design consultant | product strategy and UX planning consultant; brand strategy and product design consulting | Contact, leadership experience, relevant case studies |
| Brand brief | brand identity design, brand strategy | brand identity design for startups; hire a brand identity designer in Lahore | Home services, Morganics, identity studies |
| Product brief | SaaS UI/UX design, product strategy | MVP UX planning for startup founders; healthcare dashboard UI/UX design | Home services, UI/UX collection, product stages |
| Website brief | website design, landing page design | responsive website design for service businesses; landing page designer for startups | Home services, digital collection |
| Campaign brief | creative direction, social media design | social media campaign design for brands; LinkedIn carousel design system | LinkedIn case, campaign case, recovered Social Media Portfolio |
| Conversion | hire designer, design enquiry | hire Hadi Hassan for brand and product design | Contact, contextual enquiry links |
| Trust/utility | Hadi Hassan CV, privacy | creative leadership CV; project enquiry data and consent | Resume, Privacy |

Broad terms such as graphic design and logo design have ambiguous browsing/job/template intent. The implemented copy emphasizes leadership responsibilities, relevant tasks, deliverables and evidence instead of pursuing traffic through repeated general terms. Broad “creative director jobs” queries primarily attract job seekers rather than hiring teams; the site uses leadership portfolio/CV and consulting language, and does not pretend to be a job board or publish JobPosting markup. The higher priority assigned to a cluster means stronger CV fit and buyer specificity; it is not measured demand. Existing case studies retain project-specific intent rather than repeating the same job-title keywords on every page.

## Findings and implementation

| Priority | Finding | Action/status |
| --- | --- | --- |
| P1 | Brand-designer headline, homepage metadata and schema underrepresented the CV's product/leadership role | Updated visible hero copy, homepage introduction, seven utility/home/archive metadata records, Person/WebSite identity and product collection metadata. Hero layout, portrait and both protected CSS files are unchanged. The owner requested this copy repositioning; exact before/after hero lock provenance is recorded in `hero-copy-authorization.json`. No separate visual approval is implied. |
| P1 | Homepage claimed 18 SaaS apps, 300+ websites, 100+ branding projects, 80+ happy customers and 200+ students without support in the supplied CV | Replaced with evidence-backed facts while preserving the five-card presentation: 10+ years, five documented roles, 15 first-party case studies, four product previews and three named core disciplines. These are scope/experience facts, not client-outcome metrics. |
| P1 | Earlier CV download and assistant citation pointed to a different PDF | Added the supplied current PDF at a versioned URL, updated Resume and knowledge citations, retained the earlier URL. Byte identity tested. |
| P1 | Author/profile context was not explicit on every case-study template | Added visible author links and role on all three case templates, stable Person and Organization IDs, project author/creator/mainEntity references and typed profile pages on About/Resume. |
| P1 external | Live About, Resume, Contact, Privacy and Work returned HTTP 404 during the read-only audit | Local routes exist and are tested. Production remains unchanged because deployment is not authorized. These five live 404s require a later verified publishing decision; local SEO alone cannot fix them. |
| P2 | Services used generic or overly broad implementation labels | Use clearer brand strategy, UI/UX, product strategy/MVP, campaign and e-commerce headings. Product copy emphasizes UX planning, wireframes, systems and delivery rather than unsupported native platform expertise. Backend service IDs/booking contracts remain intact. |
| P2 | Reader/search answers required piecing together different sections | Added a direct factual introduction and a useful business-scope answer linking to brand, product and social proof. Existing pricing, remote-working and starting-a-project answers remain grounded and readable. |
| P2 | Work and Contact offered limited buyer-specific next steps | Expanded evidence links in Work and distinct role-brief/email and consulting-brief/enquiry paths in Contact. The hero CTA invites a direct email discussion of an opportunity, while consulting retains the existing Sera/enquiry entry. Resume/FAQ/assistant copy explicitly recognizes both goals. The rebuilt-app Sera smoke now opens the actual shared Sera launcher rather than treating a recruiter email link as a consulting-intake button. No price, response-time guarantee, availability promise or unverified booking confirmation is added. |
| P2 | Internal footer About linked only to a home anchor | Link directly to the substantive About route; retain all case paths, archive recovery and Social Media deep link. |
| P2 | Technical SEO already had strong foundations | Preserve self-canonicals, one H1, project-specific metadata, related links, responsive assets, image sitemap, breadcrumbs, OG/Twitter cards and static HTML. Audit all 22 outputs rather than adding thin duplicate location/service pages. |
| P2 | Crawling policy allowed internal admin/API surfaces | Add robots exclusions for `/admin/` and `/api/` while retaining public content/assets and sitemaps. This is crawler guidance, not access control. No private security boundary or training-crawler preference is changed. |
| P3 external | TMS destination returned 404 in the prior release audit | Keep the exact owner-supplied `/login` URL and explicit MVP stage. Do not silently replace an application URL or claim live functionality. |
| P3 external | No field performance/indexing/conversion data | Do not claim Core Web Vitals, indexing, traffic, rankings, rich results or AI citations. Existing responsive/image safeguards remain; preloader timing should be evaluated against real-user LCP after deployment before any separate interaction redesign. |

All 15 first-party case narratives, original visuals, 30 recovered reference records, supplied UI images, navigation, Sera consent/policy and booking implementation remain. Original project-specific stories and most already-good case titles/descriptions were deliberately retained. New labels do not turn MVPs or concepts into production-ready products.

## SEO implementation detail

Titles and descriptions are unique and descriptive. The 35–65/120–170 character ranges remain the repository's editorial checks, not Google's fixed limits. [Google's title guidance](https://developers.google.com/search/docs/appearance/title-link) prioritizes clear, concise text and discourages repetition; [snippet guidance](https://developers.google.com/search/docs/appearance/snippet) explains that Google may select different page text and truncate snippets by device/query. No obsolete meta-keywords tag, keyword-density target, hidden keyword block or repeated city pages are added.

The sitemap and canonicals continue to use `https://hadi.intellignce.net`. Public asset URLs and recovered links are preserved. The homepage explains the service proposition; About/Resume establish the person; Work/Archive help visitors evaluate evidence; each project addresses its own subject; Contact routes the enquiry. This distribution avoids forcing every keyword onto every page.

## AEO/GEO implementation detail

The actual HTML supplies identity, location, role, experience, services, project context, disciplines, deliverables, stage and contact routes. Structured data describes this visible material using Person, Organization, WebSite, WebPage specializations, CreativeWork, Service and BreadcrumbList. It contains no fabricated ratings, awards, invented outcomes, prices or availability.

About and Resume use ProfilePage with the Person as mainEntity, following [Google's profile-page guidance](https://developers.google.com/search/docs/appearance/structured-data/profile-page). This is semantic implementation, not confirmation of rich-result eligibility. FAQ rich-result markup is not added to a design portfolio merely to seek visibility: [Google limits those rich results](https://developers.google.com/search/blog/2023/08/howto-faq-changes) to authoritative government/health sites. Useful visible FAQ answers remain without a rich-result promise.

[Google's AI features guidance](https://developers.google.com/search/docs/appearance/ai-features) says normal SEO fundamentals apply and no special AI files/schema are needed. llms.txt is retained as optional descriptive navigation, with the current CV and a warning against invented outcomes; it is not a ranking mechanism. [OpenAI's crawler documentation](https://developers.openai.com/api/docs/bots) distinguishes search crawling from training crawling. Public search access remains allowed under the existing policy; no change to model-training preferences is assumed. Production WAF/IP/crawler behavior remains outside local verification.

## Measurement and remaining evidence

After a separately authorized deployment: verify all canonical routes return 200, check robots/CDN access, submit/inspect sitemaps in Google Search Console and Bing Webmaster Tools, and measure query/page/country impressions, clicks and CTR over a meaningful baseline. Join landing-page performance with qualified enquiries where the existing privacy/consent policy permits; do not add an advertising pixel or collect conversation text as analytics. Compare service briefs and qualification quality, not just keyword counts.

Exact search volumes, lead forecasts, live indexing, backlinks, field Core Web Vitals, AI citations, live provider/calendar/email behavior and conversion attribution remain unverified. Connected keyword/measurement data is needed to replace intent hypotheses with measured priorities. No ranking, lead or AI-inclusion guarantee is made.

## Validation evidence

Current build, source/output, knowledge and browser results are retained in this directory. The full documented acceptance build includes source hero verification, Python content generation, responsive-image metadata/sitemaps, Next preparation, webpack static export, pruning, hydration audit and a source/output receipt. Final per-test status and route matrix summary are recorded after validation completes. Earlier interrupted/pre-correction results are not final acceptance evidence.
