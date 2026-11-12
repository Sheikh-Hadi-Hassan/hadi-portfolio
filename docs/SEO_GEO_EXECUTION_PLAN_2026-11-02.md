> Historical strategy. Current resume-led positioning and measured scope: [11 November audit](seo-20261111/AUDIT.md).

# SEO / AEO / GEO execution plan — 2026-11-02

Status: active on protected branch only. No production deploy, main merge, Search Console submission, Bing submission, credential rotation, or live booking test is authorized by this document.

## Positioning source of truth

Primary positioning:
- Creative Director
- Design Lead
- Brand Identity Designer

Supporting capabilities:
- Brand strategy and identity systems
- Art and campaign direction
- UI/UX and digital product design
- Packaging and visual storytelling
- AI-assisted creative workflows

Evidence must come from the portfolio source, approved Behance projects, and the current CV. Unsupported outcomes, client claims, testimonials, statistics, awards, or rankings must not be invented.

## Page-purpose matrix

| Surface | Primary job | Search intent | GEO/AEO question | Evidence | Primary action |
| --- | --- | --- | --- | --- | --- |
| Home | Establish Hadi's role and route visitors | Creative Director / Design Lead / Brand Identity Designer | Who is Hadi Hassan and what kind of work does he lead? | CV, selected work, role history | Explore work / enquire |
| Archive | Make the full body of work discoverable | Brand identity portfolio / creative direction case studies | What kinds of branding, campaign and digital projects has Hadi delivered? | Project catalogue | Open case study |
| Brand case studies | Prove strategic and visual craft | Project-specific brand identity terms | What was the project, Hadi's role, approach and delivered system? | Case-study copy + original visuals | Enquire / related work |
| UI/UX / SaaS collection | Prove digital-product capability | UI/UX, SaaS, website and product design | What digital products and interfaces has Hadi designed? | Current project chapters + CV | Enquire |
| Campaign / film work | Prove creative-direction range | Campaign creative direction / documentary storytelling | How does Hadi approach campaign and narrative work? | Existing case studies | Enquire |
| Contact / lead surfaces | Convert qualified demand | Creative direction / brand identity enquiry | How can a client or recruiter contact Hadi? | Verified contact methods | Submit / email / WhatsApp |
| Future articles | Build topical authority | Buyer and recruiter questions | What practical answer can Hadi give from real experience? | Original expertise + linked case studies | Read related work / enquire |

## Launch quality gates

### SEO
- Unique descriptive title per indexable route.
- Specific meta description per important route.
- Exactly one meaningful H1 per page.
- Self-referencing production canonical.
- Correct Open Graph and social preview metadata.
- Production-domain sitemap and robots reference.
- No accidental noindex on public work.
- No broken internal links.
- No thin case-study pages.
- Descriptive image alt text.
- Project-specific internal links and CTAs.
- Structured data must describe visible, truthful content only.

### AEO / GEO
- Important pages expose direct factual answers in normal HTML.
- Case studies clearly state client/context, problem, actual role, approach, deliverables, proof and next step when evidence exists.
- Entity facts remain consistent across site, CV, Behance and professional profiles.
- AI-search copy must be concise enough to extract without turning pages into FAQ spam.
- FAQ or comparison sections are added only where they help users and match visible content.
- llms.txt is optional and experimental, not a ranking or AI-inclusion requirement.
- No keyword repetition, directory volume, FAQ schema or special file may be presented as a guarantee of AI visibility.

### Bing / multi-engine readiness
- Production sitemap is valid and ready for Bing Webmaster Tools submission.
- IndexNow may be added only when the production publishing workflow can send correct canonical URLs reliably.
- Search-engine crawler access must be tested without weakening WAF/security globally.
- Google, Bing and AI-search inclusion are measured, not assumed.

### Story-preservation rule for articles and case studies
- Preserve the original narrative arc, chronology, factual sequence, project context and authorial point of view before any SEO edit.
- Do not flatten a story into keyword-led paragraphs or replace specific moments with generic marketing language.
- Keywords must support the story, not drive it. Use head terms, long-tail phrases and related semantic terms only where they read naturally.
- Keep project-specific nouns, client/context details, process moments and concrete decisions that make each story distinctive.
- Prefer one clear primary intent per page plus a small supporting cluster; avoid repeating variants simply to increase keyword density.
- When an SEO phrase weakens rhythm, clarity or authenticity, keep the stronger human sentence.
- No invented outcomes, metrics, quotes, awards, testimonials or project facts.

### Content quality
- Senior creative-director / recruiter-level English.
- Human, specific and evidence-led.
- No generic AI phrases, inflated claims or keyword stuffing.
- Every public URL must have a reason to exist.
- Missing proof is omitted or recorded as a TODO, not invented.

### Performance and accessibility
- Build succeeds from repository source.
- Responsive layout reviewed across phone, tablet and desktop widths.
- Semantic headings and landmarks.
- Keyboard navigation and visible focus.
- Form labels and useful error states.
- Reduced-motion behavior respected.
- Oversized media and blocking scripts investigated before launch.

## Content backlog

Approved additions waiting for original images:
- Lahore Culture Branding
- Social Media Portfolio

Explicitly excluded by owner:
- Kruzz Branding
- Logo Design for a Food Delivery Platform

Existing content work:
- Continue page-by-page senior-level copy review.
- Align public claims with the current CV.
- Preserve all approved Behance projects already represented on the website.
- Rewrite future supplied articles around real search intent, original expertise and internal links.

## Measurement after deployment

Do not call SEO/GEO complete from source tests alone. After an approved release:
- Verify Google Search Console property and sitemap receipt.
- Verify Bing Webmaster Tools property and sitemap receipt.
- Check representative URLs with live crawler/indexing tools.
- Capture Core Web Vitals / PageSpeed baselines.
- Record organic impressions, clicks, CTR, sessions, qualified leads and booked calls as separate metrics.
- Run a dated buyer/recruiter prompt set across available AI search products and record citations/accuracy.
- Review high-impression / low-CTR pages and improve from evidence.
- Do not auto-publish SEO changes.

## Current evidence

- Source-side SEO tests cover unique metadata, title/description bounds, one H1, canonical URLs, JSON-LD, image alts, sitemap coverage, thin-content floor and broken internal links.
- CI run #57 passed on commit 856379e9e6f808e28c408bebe99a478b4245f5c2.
- Live Search Console/Bing submission, crawler/WAF behavior, Core Web Vitals and real ranking/indexing outcomes remain release-stage verification items.
