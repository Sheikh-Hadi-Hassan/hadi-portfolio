"""Build three independent, evidence-led portfolio presentations from verified project data."""
import json
import re

def render_expertise(src, dist, page, esc, projects, archive_records):
    profiles = json.loads((src / 'data/expertise.json').read_text())['pages']
    by_slug = {project['slug']: project for project in projects}
    by_title = {record['title']: record for record in archive_records if record.get('publication') != 'excluded'}
    routes = {slug: '/expertise/' + slug + '/' for slug in profiles}
    hero_projects = {'creative-direction': 'morganics', 'product-development': 'uiux-web-saas', 'video-production': 'fakhr-e-qoum'}

    def size_attrs(record):
        width, height = record.get('hero_width',record.get('width')),record.get('hero_height',record.get('height'))
        return ' width="' + str(width) + '" height="' + str(height) + '"' if isinstance(width,int) and isinstance(height,int) and width>0 and height>0 else ''

    def nav_card(slug, entry):
        project = by_slug[hero_projects[slug]]
        return (
            '<a class="expertise-nav-card" href="' + routes[slug] + '">'
            '<img src="' + esc(project['hero']) + '"' + size_attrs(project) + ' alt="" loading="lazy" decoding="async">'
            '<span class="expertise-card-copy"><span class="expertise-kicker">' + esc(entry['eyebrow']) + '</span>'
            '<h3>' + esc(entry['role']) + '</h3><p>' + esc(entry['intro']) + '</p>'
            '<span class="expertise-card-action">Explore the portfolio ↗</span></span></a>'
        )

    home = (
        '<section class="expertise-section" id="expertise" aria-labelledby="expertise-home-heading">'
        '<div class="expertise-inner"><div class="xp-section-intro"><div>'
        '<span class="expertise-kicker">ONE CREATIVE LEADER / THREE SPECIALIZATIONS</span>'
        '<h2 class="expertise-heading" id="expertise-home-heading">Explore my expertise.</h2>'
        '<p class="expertise-lede">Different roles. The same commitment to thoughtful design and strong execution.</p>'
        '</div><span class="xp-meta">Three focused portfolios for hiring teams, collaborators and clients.</span></div>'
        '<div class="expertise-grid">' + ''.join(nav_card(slug,entry) for slug,entry in profiles.items()) + '</div>'
        '</div></section>'
    )

    def featured_case(project, index):
        # The existing project already holds its original decisions, services and individual case-study.
        href = '/' + esc(project['slug']) + '/'
        decision = project.get('decision', '')
        services = project.get('services', project.get('category',''))
        return (
            '<article class="xp-showcase" data-xp-reveal>'
            '<a class="xp-showcase-visual" href="' + href + '"><img src="' + esc(project['hero']) + '" '
            'alt="' + esc(project['title']) + ' project visual"' + size_attrs(project) + ' loading="lazy" decoding="async"></a>'
            '<div class="xp-showcase-body"><span class="xp-showcase-number">FEATURED WORK / ' + str(index).zfill(2) + '</span>'
            '<h3>' + esc(project['title']) + '</h3>'
            '<p>' + esc(project.get('intro') or project.get('deck') or project['category']) + '</p>'
            '<div class="xp-showcase-evidence"><span>Focus and deliverables</span><p>' + esc(services) + '</p></div>'
            + ('<div class="xp-showcase-evidence"><span>Creative decision</span><p>' + esc(decision) + '</p></div>' if decision else '')
            + '<a class="xp-text-link" href="' + href + '">View the full case study ↗</a></div>'
            '</article>'
        )

    def preview_card(record, category):
        links = [x for x in record.get('links', []) if x.get('href', '').startswith('https://')]
        slug = re.sub('[^a-z0-9]+','-',record['title'].lower()).strip('-')
        href = links[0]['href'] if links else '/archive/#' + ('social-media-portfolio' if record['title'] == 'Social Media Portfolio' else 'archive-record-' + slug)
        external = ' target="_blank" rel="noopener noreferrer"' if links else ''
        return (
            '<article class="xp-preview-card" data-xp-reveal data-xp-category="' + esc(category) + '"><img loading="lazy" decoding="async"' + size_attrs(record) + ' src="' + esc(record['image'])
            + '" alt="' + esc(record['title']) + ' portfolio preview">'
            '<div class="xp-preview-card-inner"><span class="expertise-kicker">' + esc(record['evidence']) + '</span>'
            '<h3>' + esc(record['title']) + '</h3><p>' + esc(record['type']) + '</p>'
            '<span class="xp-preview-status">Project reference / status and contribution vary</span>'
            '<a href="' + esc(href) + '"' + external + '>Explore available evidence ↗</a></div></article>'
        )

    def section_header(kicker, title, description, heading_id):
        return (
            '<div class="expertise-block-head"><div><span class="expertise-kicker">' + esc(kicker) + '</span>'
            '<h2 id="' + esc(heading_id) + '">' + esc(title) + '</h2></div><p class="xp-description">' + esc(description) + '</p></div>'
        )

    def optional_studio_asset(name):
        # Optional curated assets. A repo checkout without the owner's image pack
        # must continue to build without broken images or hidden placeholders.
        filename = src.parent / 'public' / 'assets' / 'expertise' / name
        return '/assets/expertise/' + name if filename.is_file() else None

    for slug,entry in profiles.items():
        featured = [by_slug[name] for name in entry['featured'] if name in by_slug]
        refs = [by_title[name] for name in entry['references'] if name in by_title]
        hero = by_slug[hero_projects[slug]]
        other_profiles = [(other,details) for other,details in profiles.items() if other != slug]

        progress = '<div class="xp-scroll-progress" aria-hidden="true"><span></span></div>'
        rail = (
            '<nav class="xp-sticky-rail" aria-label="On this portfolio">'
            '<a href="#xp-about">About Hadi</a><a href="#xp-work">Selected work</a>'
            '<a href="#xp-approach">Approach</a><a href="#xp-experience">Experience</a><a href="#xp-capabilities">Capabilities</a><a href="#xp-questions">Questions</a>'
            + ('<a href="#xp-films">Watch films</a>' if slug == 'video-production' else '')
            + '<a href="#xp-contact">Contact</a></nav>'
        )
        hero_section = (
            '<section class="expertise-hero" aria-labelledby="expertise-heading"><div>'
            '<a class="expertise-back" href="/#expertise">← Hadi Hassan / All expertise</a>'
            '<span class="expertise-kicker">' + esc(entry['eyebrow']) + '</span>'
            '<h1 class="expertise-heading" id="expertise-heading">' + esc(entry['role']) + '</h1>'
            '<p class="expertise-lede">' + esc(entry['statement']) + '</p>'
            '<p class="xp-hero-support">' + esc(entry['intro']) + '</p>'
            '<div class="xp-hero-actions"><a class="xp-button" href="#xp-work">Explore selected work ↗</a>'
            '<a class="xp-button xp-button-outline" href="#xp-about">About Hadi ↓</a></div>'
            '<div class="xp-hero-index"><b></b><span>Hadi Hassan · Lahore / Worldwide</span></div>'
            '</div><figure class="xp-hero-media"><img class="expertise-hero-image"' + size_attrs(hero) + ' src="' + esc(hero['hero'])
            + '" alt="' + esc(hero['title']) + ', selected portfolio project" fetchpriority="high" decoding="async">'
            '<figcaption><span>Selected work / ' + esc(hero['title']) + '</span>'
            '<a href="/' + esc(hero['slug']) + '/">View project ↗</a></figcaption></figure></section>'
        )
        strengths = ''.join('<li>' + esc(s) + '</li>' for s in entry.get('strengths',[]))
        about = (
            '<section class="expertise-block expertise-profile" id="xp-about" aria-labelledby="xp-about-heading">'
            '<div class="expertise-block-head"><div><span class="expertise-kicker">THE PERSON BEHIND THE WORK</span>'
            '<h2 id="xp-about-heading">' + esc(entry.get('aboutHeading','About Hadi')) + '.</h2></div>'
            '<div><p class="xp-about-quote"><strong>10+ years</strong> of creative and digital experience, viewed through this discipline.</p>'
            '<p class="xp-description">' + esc(entry.get('about', entry['intro'])) + '</p></div></div>'
            '<div class="expertise-reference-list"><article><span class="expertise-kicker">WHERE I FOCUS</span>'
            '<h3>Relevant strengths</h3><ul>' + strengths + '</ul></article>'
            '<article><span class="expertise-kicker">REAL WORK / NOT CLAIMS</span><h3>Evidence to explore</h3>'
            '<p>' + esc(entry.get('proof','')) + '</p></article></div></section>'
        )
        work = (
            '<section class="expertise-block" id="xp-work" aria-labelledby="xp-work-heading">'
            '<div class="expertise-block-head"><div><span class="expertise-kicker">CURATED PORTFOLIO</span>'
            '<h2 id="xp-work-heading">Selected work.</h2></div>'
            '<p class="xp-description">The projects below show my decisions and deliverables. Open each case study for its existing documentation and image collection.</p></div>'
            + ''.join(featured_case(item,i+1) for i,item in enumerate(featured)) + '</section>'
        )
        references = ''
        filters = ''
        if len({entry.get('previewTags',{}).get(record['title'],record.get('category','other')) for record in refs}) > 1:
            categories = sorted({entry.get('previewTags',{}).get(record['title'],record.get('category','other')) for record in refs})
            labels = {'digital':'Digital products','campaign':'Campaigns','identity':'Brand identity','healthcare':'Healthcare UX','operations':'Operations UX','other':'Other interfaces'}
            filters = (
                '<div class="xp-filter-group" role="group" aria-label="Filter additional projects">'
                '<button type="button" class="xp-filter is-active" data-xp-filter="all" aria-pressed="true">All projects</button>'
                + ''.join('<button type="button" class="xp-filter" data-xp-filter="'+esc(category)+'" aria-pressed="false">'+esc(labels.get(category,category.title()))+'</button>' for category in categories)
                + '</div>'
            )
        if refs:
            references = (
                '<section class="expertise-block" id="xp-more" aria-labelledby="xp-more-heading">'
                '<div class="expertise-block-head"><div><span class="expertise-kicker">MORE WORK TO EXPLORE</span>'
                '<h2 id="xp-more-heading">Additional projects.</h2></div><p class="xp-description">'
                'These are sourced from existing portfolio previews. A preview is not evidence of a production launch or a verified business result.'
                '</p></div>' + filters + '<div class="xp-preview-grid">' + ''.join(preview_card(record,entry.get('previewTags',{}).get(record['title'],record.get('category','other'))) for record in refs)
                + '</div></section>'
            )
        stages = {
            'creative-direction': [('Find the focus','Audience, context and the brand challenge.'),('Define the direction','Create the concept, identity language and campaign system.'),('Lead the execution','Keep applications aligned across teams and touchpoints.')],
            'product-development': [('Understand the task','Clarify the user journey and information structure.'),('Design the system','Translate needs into interface patterns and prototypes.'),('Refine the delivery','Evaluate clarity, responsiveness and implementation constraints.')],
            'video-production': [('Shape the story','Translate intent into a script, sequence or storyboard.'),('Direct the visuals','Plan scenes, visual consistency and production treatment.'),('Build the final cut','Connect edit, motion and sound to the narrative.')],
        }
        process = (
            '<section class="expertise-block" id="xp-approach" aria-labelledby="xp-approach-heading">'
            '<div class="expertise-block-head"><div><span class="expertise-kicker">HOW I WORK</span>'
            '<h2 id="xp-approach-heading">Thinking before making.</h2></div>'
            '<p class="xp-description">' + esc(entry['approach']) + '</p></div>'
            '<div class="xp-approach-steps" data-xp-reveal>'
            + ''.join('<article><span>0'+str(i+1)+'</span><h3>'+esc(title)+'</h3><p>'+esc(description)+'</p></article>' for i,(title,description) in enumerate(stages[slug]))
            + '</div></section>'
        )
        capabilities = (
            '<section class="expertise-block" id="xp-capabilities" aria-labelledby="xp-capabilities-heading">'
            + section_header('TOOLS OF THE PRACTICE','What I bring.','Capabilities supported by the work and professional experience shown across this portfolio.','xp-capabilities-heading')
            + '<ul class="expertise-pill-list">' + ''.join('<li>'+esc(item)+'</li>' for item in entry['capabilities']) + '</ul></section>'
        )
        film = ''
        if slug == 'video-production':
            videos = [item for item in featured if item.get('video',{}).get('url')]
            film = (
                '<section class="expertise-block" id="xp-films" aria-labelledby="xp-films-heading">'
                + section_header('WATCH THE WORK','Films and production.','Select a film to play it on this page. Playback loads only when requested. External viewing links remain available.','xp-films-heading')
                + '<div class="xp-video-grid">' + ''.join(
                    '<article class="xp-video-card"><button type="button" class="xp-video-trigger"'
                    ' data-xp-play-video="'+esc(item['video'].get('embed') or item['video']['url'])+'"'
                    ' data-xp-video-title="'+esc(item['title'])+'"'
                    ' data-xp-video-external="'+esc(item['video']['url'])+'"'
                    ' aria-label="Play '+esc(item['title'])+' film">'
                    '<img src="'+esc(item['hero'])+'" loading="lazy" decoding="async" alt="">'
                    '<span class="xp-play-icon" aria-hidden="true">▶</span></button>'
                    '<div class="xp-video-card-footer"><div><span class="expertise-kicker">FILM / CREATIVE PRODUCTION</span>'
                    '<h3>'+esc(item['title'])+'</h3></div>'
                    '<a href="'+esc(item['video']['url'])+'" target="_blank" rel="noopener noreferrer">Open film ↗</a></div></article>'
                    for item in videos
                ) + '</div>'
                '<dialog id="xp-video-dialog" class="xp-video-dialog" aria-labelledby="xp-video-dialog-title">'
                '<div class="xp-video-dialog-head"><h2 id="xp-video-dialog-title">Film preview</h2>'
                '<button type="button" class="xp-video-close" data-xp-close-video aria-label="Close video">Close ×</button></div>'
                '<div class="xp-video-slot" data-xp-video-slot></div>'
                '<p class="xp-video-credit">Hosted project player. Playback and captions depend on the original host.</p>'
                '</dialog></section>'
            )
        cinematic_intro = ''
        cinematic_apptech = ''
        if slug == 'product-development':
            overhead = optional_studio_asset('product-process-overhead.webp')
            studio = optional_studio_asset('apptech-process-studio.webp')
            if overhead:
                cinematic_intro = (
                    '<section class="xp-cinematic-section xp-cinematic-overhead" aria-labelledby="xp-cinematic-heading">'
                    '<div class="xp-cinematic-heading"><span class="expertise-kicker">THE HUMAN SIDE OF PRODUCT DESIGN</span>'
                    '<h2 id="xp-cinematic-heading">Clarity begins before the pixels.</h2>'
                    '<p>Behind each interface is a process of making complex requirements understandable. The workspace image is an editorial illustration, not a record of a usability study.</p></div>'
                    '<figure class="xp-cinematic-figure"><img src="' + esc(overhead) + '" alt="Overhead editorial studio view showing interface sketches, devices and product design workspace" loading="lazy" decoding="async">'
                    '<figcaption>Design practice / conceptual studio photography</figcaption></figure>'
                    '</section>'
                )
            if studio:
                cinematic_apptech = (
                    '<section class="xp-cinematic-section xp-cinematic-apptech" aria-labelledby="xp-cinematic-apptech-heading">'
                    '<div class="xp-cinematic-story"><span class="expertise-kicker">PRODUCT THINKING / APPTECH</span>'
                    '<h2 id="xp-cinematic-apptech-heading">From field problems to interface decisions.</h2>'
                    '<p>AppTech explores the field technician journey through attendance, location-aware site guidance and records that administrators can review. The product pitch separates technician tasks from admin oversight; the next step is to present the actual task flows and design artifacts alongside the concept screens.</p>'
                    '<a class="xp-text-link" href="#xp-more">Explore the AppTech project reference ↗</a>'
                    '<span class="xp-cinematic-note">Illustrative studio composition, not evidence of a live research session</span></div>'
                    '<figure class="xp-cinematic-figure"><img src="' + esc(studio) + '" alt="Editorial AppTech product design workspace with wide display showing interface screens, flow diagrams and design-system studies" loading="lazy" decoding="async">'
                    '<figcaption>AppTech / conceptual product design workspace</figcaption></figure>'
                    '</section>'
                )

        experience = (
            '<section class="expertise-block" id="xp-experience" aria-labelledby="xp-experience-heading">'
            '<div class="expertise-block-head"><div><span class="expertise-kicker">RELEVANT PROFESSIONAL HISTORY</span>'
            '<h2 id="xp-experience-heading">Experience, in context.</h2></div>'
            '<p class="xp-description">Selected responsibilities from my documented career and projects, chosen for this discipline. Complete employment history is available on my CV.</p></div>'
            '<div class="xp-experience-list">'
            + ''.join(
                '<article class="xp-experience-row"><span class="xp-experience-org">' + esc(job['title']) + '</span>'
                '<div><h3>' + esc(job['role']) + '</h3><p>' + esc(job['detail']) + '</p></div></article>'
                for job in entry.get('experience',[])
            ) + '</div></section>'
        )
        questions = (
            '<section class="expertise-block xp-questions" id="xp-questions" aria-labelledby="xp-questions-heading">'
            '<div class="expertise-block-head"><div><span class="expertise-kicker">CLEAR ANSWERS / NO OVERCLAIMS</span>'
            '<h2 id="xp-questions-heading">Questions, answered.</h2></div>'
            '<p class="xp-description">A quick reference for hiring teams looking for a specific kind of work and verifiable examples.</p></div>'
            '<div class="xp-questions-list">'
            + ''.join('<details class="xp-question"><summary><span>' + esc(item['question']) + '</span><span class="xp-question-plus" aria-hidden="true">+</span></summary>'
                      '<div class="xp-question-answer"><p>' + esc(item['answer']) + '</p></div></details>'
                      for item in entry.get('faq',[]))
            + '</div></section>'
        )
        faq_schema = {
            '@context':'https://schema.org',
            '@type':'FAQPage',
            'mainEntity':[{'@type':'Question','name':item['question'],'acceptedAnswer':{'@type':'Answer','text':item['answer']}} for item in entry.get('faq',[])]
        }
        faq_json = '<script type="application/ld+json">' + json.dumps(faq_schema,ensure_ascii=False).replace('<','\\u003c') + '</script>'
        related = '<div class="expertise-related">'+''.join('<a href="'+routes[other]+'">'+esc(details['role'])+' ↗</a>' for other,details in other_profiles)+'</div>'
        cta = (
            '<section class="expertise-block" id="xp-contact" aria-labelledby="xp-contact-heading">'
            '<span class="expertise-kicker">THE NEXT CONVERSATION</span>'
            '<div class="expertise-cta"><h2 id="xp-contact-heading">'+esc(entry.get('ctaHeading','Discuss an opportunity.'))+'</h2>'
            '<p>'+esc(entry.get('ctaText',''))+'</p><div class="xp-cta-actions">'
            '<a class="xp-button" href="mailto:hadi@intellignce.net?subject='+{'creative-direction':'Creative%20leadership%20opportunity','product-development':'Product%20design%20opportunity','video-production':'Video%20creative%20opportunity'}[slug]+'">'
            + esc(entry.get('ctaLabel','Get in touch')) + ' ↗</a>'
            '<a class="xp-button xp-button-outline" href="/resume/">Review my CV ↗</a></div></div>'
            '<div style="margin-top:55px"><span class="expertise-kicker">EXPLORE OTHER DISCIPLINES</span>'+related+'</div>'
            '</section>'
        )
        body = (
            '<main class="expertise-page" data-discipline="'+esc(slug)+'" id="top"><div class="expertise-inner">'
            + progress + hero_section + rail + about + cinematic_intro + work + cinematic_apptech + references + process + experience + capabilities + questions + film + cta + faq_json + '</div></main>'
        )
        title = 'Hadi Hassan | '+entry['role']+' Portfolio'
        description = entry['intro']
        path = dist / 'expertise' / slug
        path.mkdir(parents=True, exist_ok=True)
        (path / 'index.html').write_text(
            page(title, description, body, 'case-page', path=routes[slug], image=hero['hero'])
        )
    return home
