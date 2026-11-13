"""Data-driven professional expertise pages. Uses the existing public case-study inventory."""
import json
from pathlib import Path

def render_expertise(src, dist, page, esc, projects, archive_records):
    taxonomy=json.loads((src/'data/expertise.json').read_text())['pages']
    by_slug={project['slug']:project for project in projects}
    by_title={record['title']:record for record in archive_records if record.get('publication')!='excluded'}
    def link(slug):return '/expertise/'+slug+'/'
    def card(slug, entry):
        project=by_slug[entry]
        image=project['hero']
        return (f'<a class="expertise-project-card" href="/{esc(entry)}/">'
                f'<img src="{esc(image)}" alt="{esc(project["title"])} project image" loading="lazy" decoding="async">'
                f'<span class="expertise-card-copy"><span class="expertise-kicker">{esc(project["category"])}</span>'
                f'<h3>{esc(project["title"])}</h3><p>{esc(project.get("deck") or project.get("intro",""))}</p>'
                f'<span class="expertise-detail">Creative decision: {esc(project.get("decision",""))}</span>'
                '<span class="expertise-card-action">View documented case study ↗</span></span></a>')
    def navcards(current=None):
        examples={'creative-direction':'morganics','product-development':'uiux-web-saas','video-production':'fakhr-e-qoum'}
        cards=[]
        for slug,item in taxonomy.items():
            if slug==current:continue
            project=by_slug[examples[slug]]
            cards.append(f'<a class="expertise-nav-card" href="{link(slug)}"><img src="{esc(project["hero"])}" alt="" loading="lazy" decoding="async">'
                f'<span class="expertise-card-copy"><span class="expertise-kicker">{esc(item["eyebrow"])}</span>'
                f'<h3>{esc(item["title"])}</h3><p>{esc(item["intro"])}</p>'
                '<span class="expertise-card-action">Explore expertise ↗</span></span></a>')
        return ''.join(cards)
    home='<section class="expertise-section" id="expertise" aria-labelledby="expertise-home-heading"><div class="expertise-inner"><span class="expertise-kicker">THREE DISCIPLINES. ONE CREATIVE PRACTICE.</span><h2 class="expertise-heading" id="expertise-home-heading">Explore my expertise.</h2><p class="expertise-lede">Creative direction, product experiences and visual storytelling, connected by a consistent approach to strategy and execution.</p><div class="expertise-grid">'+navcards()+'</div></div></section>'
    for slug,entry in taxonomy.items():
        featured=[p for p in entry['featured'] if p in by_slug]
        references=[by_title[t] for t in entry['references'] if t in by_title]
        lead=by_slug[featured[0]]
        selected=''.join(card(slug,p) for p in featured)
        previews=''
        for record in references:
            external=next((x for x in record.get('links',[]) if x.get('href')),None)
            href=external['href'] if external else '/archive/#archive-record-'+''.join(c if c.isalnum() else '-' for c in record['title'].lower()).strip('-')
            target=' target="_blank" rel="noopener noreferrer"' if external else ''
            previews+=f'<article><span class="expertise-kicker">{esc(record["evidence"])}</span><h3>{esc(record["title"])}</h3><p>{esc(record["type"])}</p><a href="{esc(href)}"{target}>See existing evidence ↗</a></article>'
        related='<div class="expertise-related">'+''.join(f'<a href="{link(other)}">{esc(details["title"])} ↗</a>' for other,details in taxonomy.items() if other!=slug)+'</div>'
        video_section=''
        if slug=='video-production':
            videos=[by_slug[p] for p in featured if by_slug[p].get('video')]
            video_section='<section class="expertise-block" aria-labelledby="expertise-films"><div class="expertise-block-head"><h2 id="expertise-films">Watch the work.</h2><p>Original project playback links, with production context on each case-study page.</p></div><div class="expertise-related">'+''.join(f'<a href="{esc(p["video"]["url"])}" target="_blank" rel="noopener noreferrer">{esc(p["title"])}: watch film ↗</a>' for p in videos)+'</div></section>'
        body=(f'<main class="expertise-page" id="top"><div class="expertise-inner"><section class="expertise-hero" aria-labelledby="expertise-heading"><div>'
            f'<a class="expertise-back" href="/#expertise">← All expertise</a><span class="expertise-kicker">{esc(entry["eyebrow"])}</span>'
            f'<h1 class="expertise-heading" id="expertise-heading">{esc(entry["title"])}</h1>'
            f'<p class="expertise-lede">{esc(entry["statement"])}</p><p>{esc(entry["intro"])}</p>'
            f'<div class="expertise-related"><a href="#expertise-work">Selected work ↓</a><a href="/contact/">Discuss an opportunity ↗</a></div></div>'
            f'<img class="expertise-hero-image" src="{esc(lead["hero"])}" alt="{esc(lead["title"])} selected work" decoding="async" fetchpriority="high"></section>'
            f'<section class="expertise-block" aria-labelledby="expertise-approach"><div class="expertise-block-head"><h2 id="expertise-approach">My approach.</h2><p>{esc(entry["approach"])}</p></div></section>'
            f'<section class="expertise-block" id="expertise-work" aria-labelledby="expertise-work-heading"><div class="expertise-block-head"><h2 id="expertise-work-heading">Selected work.</h2><p>Existing case studies with project-specific decisions, work samples and documented deliverables.</p></div><div class="expertise-featured">{selected}</div></section>'
            + (f'<section class="expertise-block" aria-labelledby="expertise-more"><div class="expertise-block-head"><h2 id="expertise-more">Additional evidence.</h2><p>Published work and supplied previews are references, not new claims of shipped products or quantified results.</p></div><div class="expertise-reference-list">{previews}</div></section>' if previews else '')
            + video_section
            + f'<section class="expertise-block" aria-labelledby="expertise-capabilities"><div class="expertise-block-head"><h2 id="expertise-capabilities">Capabilities.</h2><p>Areas of practice represented in my portfolio and professional background.</p></div><ul class="expertise-pill-list">'+''.join(f'<li>{esc(c)}</li>' for c in entry['capabilities'])+'</ul></section>'
            + f'<section class="expertise-block" aria-labelledby="expertise-related"><h2 id="expertise-related">Related expertise.</h2>{related}<div class="expertise-cta"><span class="expertise-kicker">LET’S TALK</span><h2>Relevant work. Clear ownership.</h2><p>Hiring for a senior creative role or considering a project? Share the challenge and explore the work behind it.</p><div class="expertise-related"><a href="/resume/">View my CV ↗</a><a href="/contact/">Get in touch ↗</a><a href="mailto:hadi@intellignce.net">Email Hadi ↗</a></div></div></section></div></main>')
        title=entry['title']+' | Hadi Hassan'
        desc=entry['intro']
        out=dist/'expertise'/slug
        out.mkdir(parents=True,exist_ok=True)
        out.joinpath('index.html').write_text(page(title,desc,body,'case-page',path=link(slug),image=lead['hero']))
    return home
