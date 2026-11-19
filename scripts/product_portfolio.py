"""Owner portfolio content arranged to the measured Onlines composition contract."""
import json
from product_components import reference_components, showcase_card


def render_product_portfolio(src, esc, hero, mobile_stack, progress):
    products = {p['id']: p for p in json.loads((src / 'data/digital-products.json').read_text())['products']}
    cards = json.loads((src / 'data/product-flight.json').read_text())['cards']

    def image(path, alt, w=1280, h=720, extra=''):
        return f'<img src="{esc(path)}" alt="{esc(alt)}" width="{w}" height="{h}" decoding="async" {extra}>'

    def comment(text, cls='', label='Design notes', delay=0):
        return (f'<div class="ol-comment {cls}" data-entry-delay="{delay}" aria-hidden="true">'
                '<img class="ol-avatar" src="/assets/intellignce-loader-logo.webp" width="30" height="30" alt="">'
                f'<span><b>Hadi Hassan <small>{label}</small></b><span>{text}</span></span></div>')

    def cursor(label, index, cls=''):
        return (f'<span class="ol-cursor ol-cursor-{index} {cls}" data-cursor="{index}" aria-hidden="true">'
                '<svg viewBox="0 0 20 24"><path d="M2 1 17 15 9 15 5 22Z"/></svg>'
                f'<span>{label}</span></span>')

    def tool(name, cls):
        ext = 'svg'
        return f'<span class="ol-tool {cls}" aria-hidden="true"><img src="/assets/tools/{name}.{ext}" width="30" height="30" alt=""></span>'

    ipod, reference_code, pin_service, toolkit = reference_components(products, esc, image)
    wire = '<div class="ol-wire" aria-hidden="true"><div class="ol-window-bar"><i></i><i></i><i></i></div><div class="ol-wire-body"><span class="ol-wire-profile"></span><i></i><i></i><span class="ol-wire-line"></span><i></i><i></i><span class="ol-wire-line"></span></div></div>'
    chat = '<div class="ol-chat" aria-hidden="true"><div class="ol-window-bar"><i></i><i></i><i></i></div><div class="ol-chat-row"><b></b><i></i></div><div class="ol-chat-row"><b></b><i></i></div><div class="ol-chat-row"><b></b><i></i></div><span class="ol-chat-input"></span></div>'
    laptop = '<div class="ol-device-laptop"><div class="ol-device-screen">' + image('/assets/hadi-hassan-social-preview-20261021.png', 'Hadi Hassan — creative direction, visual storytelling and brand design', 1200, 630) + '</div><span class="ol-device-base"></span></div>'
    hero_section = (
        '<section class="ol-hero" data-ol-hero aria-labelledby="expertise-heading"><div class="ol-hero-stage ol-grid">'
        '<div class="ol-title-wrap" data-ol-drag><h1 id="expertise-heading">Digital<br>product design</h1><span class="ol-selection" aria-hidden="true">' + '<i></i>' * 6 + '</span></div>'
        '<div class="ol-hero-art ol-art-wire" data-ol-drag data-entry-delay="200" data-depth=".10">' + ipod + '</div>'
        '<div class="ol-hero-art ol-art-code" data-ol-drag data-entry-delay="900" data-depth=".04">' + reference_code + '</div>'
        '<div class="ol-hero-art ol-art-chat" data-ol-drag data-entry-delay="650" data-depth=".03">' + pin_service + '</div>'
        '<a class="ol-hero-art ol-art-screen" data-ol-drag data-entry-delay="400" data-depth=".16" href="#xp-products" aria-label="Explore TMS travel management">' + image(products['tms']['image']['src'], 'TMS travel management interface', 1000, 800, 'fetchpriority="high"') + '</a>'
        '<a class="ol-hero-art ol-art-laptop" data-ol-drag data-entry-delay="800" data-depth=".18" href="#xp-work" aria-label="Explore selected interface work">' + laptop + '</a>'
        '<button type="button" class="ol-hero-art ol-art-phone" data-ol-drag data-entry-delay="1100" data-depth=".11" data-ol-gallery aria-label="Open the mobile interface gallery">' + image('/assets/expertise/apptech-handheld-owner-20261118.png', 'AppTech attendance interface shown on a handheld phone', 1000, 800) + '</button>'
        '<button class="ol-ai" type="button" data-ol-ai data-entry-delay="400" aria-pressed="false" aria-label="Toggle dark canvas appearance">Dark canvas <span><i></i></span></button>'
        '<div class="ol-hero-tools">' + toolkit + '</div>' +
        ''.join(cursor(label, i) for i, label in enumerate(['Designer', 'Developer', 'Client'])) +
        '<a class="ol-scroll" href="#ol-intro" aria-label="Scroll to introduction"><span aria-hidden="true">↓</span></a></div></section>'
    )
    intro = '<section class="ol-intro ol-dots" id="ol-intro"><div class="ol-intro-inner"><h2>I lead product and brand design for SaaS, healthcare and business platforms.</h2><p>Based in Lahore. Working with international teams.<br>Available for design leadership and consulting.</p></div></section>'
    # Reuse the authoritative homepage markup and its shared carousel styles.
    home = (src / 'pages/home.html').read_text()
    carousel_start = home.index('<section class="bf-work"')
    carousel_end = home.index('</section>', carousel_start) + len('</section>')
    carousel = home[carousel_start:carousel_end].replace('id="work"', 'id="xp-approach"', 1)
    # Keep the homepage component, with a discipline-specific project collection.
    selected = []
    for key, category in [('tms', 'Travel management'), ('apptech', 'Mobile attendance'), ('crent', 'Rental management'), ('flow', 'Business operations')]:
        product = products[key]
        selected.append((product['title'], category, product['image'], product['url'], True))
    for index, title, category in [(0, 'CallingDr', 'Telehealth website'), (1, 'Omni Help', 'Mobile healthcare'), (2, 'Consumer Connect', 'Research dashboard'), (4, 'Vera Health', 'Patient experience'), (5, 'Legal management', 'Case management dashboard')]:
        selected.append((title, category, cards[index], '#ol-gallery', False))
    total = len(selected)
    heading_end = carousel.index('<div class="v2sw-slide v2sw-card-slide">')
    carousel = carousel[:heading_end].replace('Selected work and explorations', 'Product and UI/UX design').replace('SELECTED PROJECTS / 01–12', f'PRODUCT &amp; UI/UX / 01–{total:02d}').replace('Selected work<br>& explorations.', 'Product design.<br>UI/UX in practice.').replace('Twelve projects. Different challenges. A look at how strategy becomes something you can see, use and recognise.', 'SaaS platforms, mobile apps and healthcare experiences. Selected interfaces designed around real workflows.')
    for index, (title, category, artwork, href, external) in enumerate(selected, 1):
        attrs = 'target="_blank" rel="noopener noreferrer"' if external else 'data-ol-gallery'
        carousel += '<div class="v2sw-slide v2sw-card-slide"><div class="v2sw-card-reveal"><a class="v2sw-card" href="' + esc(href) + '" ' + attrs + '><div class="v2sw-card-media">' + image(artwork['src'], artwork.get('alt', title + ' interface presentation'), artwork['width'], artwork['height'], 'loading="lazy"') + '<span class="v2sw-card-tag">' + esc(category) + '</span></div><div class="v2sw-card-footer"><h3 class="v2sw-card-title">' + esc(title) + '</h3><span class="bf-case-status">↗</span></div><span class="bf-project-count">' + f'{index:02d} / {total:02d}' + '</span></a></div></div>'
    carousel += '<div class="v2sw-slide v2sw-slide-cta"><h2>Explore the interfaces.<br>See the complete work.</h2><a class="bf-button" href="#ol-gallery" data-ol-gallery>View UI/UX portfolio ↗</a></div></div></section>'
    services = '<div class="bayfi-body ol-home-carousel">' + carousel + '</div>'
    feature = '<section class="ol-feature" aria-labelledby="ol-feature-heading"><div class="ol-feature-container"><div class="ol-feature-card"><div class="ol-feature-copy"><div class="ol-feature-title" data-ol-drag><h2 id="ol-feature-heading">From zero to one.</h2><span class="ol-selection" aria-hidden="true">' + '<i></i>' * 6 + '</span></div><div><h3>I work across research, product architecture, interface design and developer handoff.</h3><p>The selected work includes travel operations, field attendance, car rental and business management products.</p></div><button type="button" class="ol-button" data-consultation-entry="meeting">Book a conversation</button></div><div class="ol-laptop">' + laptop + '</div></div><p class="ol-feature-note">Hadi Hassan · Creative &amp; Product Design Leader · Lahore, Pakistan / Remote</p></div></section>'
    orbit = ''
    for index, key in enumerate(['tms', 'apptech', 'crent', 'flow']):
        p = products[key]
        im = p['image']
        orbit += f'<a class="ol-product ol-product-{key} ol-orbit-{index}" data-product="{key}" data-entry-delay="{[100,50,150,75][index]}" href="{esc(p["url"])}" target="_blank" rel="noopener noreferrer" aria-label="{esc(p["title"]+": "+p["stage"])}">' + image(im['src'], im['alt'], im['width'], im['height'], 'loading="lazy"') + f'<strong>{esc(p["title"])}</strong><span class="ol-product-stage">{esc(p["stage"])}</span></a>'
    for index, name, img in [(4, 'CallingDr', cards[0]['src']), (5, 'Omni Help', cards[1]['src'])]:
        orbit += f'<button type="button" class="ol-product ol-orbit-{index}" data-ol-gallery data-entry-delay="200" aria-label="View {name} design work">' + image(img, name + ' interface presentation', extra='loading="lazy"') + f'<strong>{name}</strong></button>'
    product_section = '<section class="ol-products" id="xp-products" aria-labelledby="ol-products-heading"><div class="ol-products-stage ol-grid">' + orbit + '<div class="ol-orbit-note ol-orbit-note-0">' + comment('Bookings, agencies and commissions.', label='TMS') + '</div><div class="ol-orbit-note ol-orbit-note-1">' + comment('Attendance and field operations.', label='AppTech') + '</div><div class="ol-orbit-note ol-orbit-note-2">' + comment('Fleet availability and rental bookings.', label='Crent') + '</div><div class="ol-orbit-note ol-orbit-note-3">' + comment('Revenue, projects and delivery.', label='Flow') + '</div><div class="ol-products-copy"><h2 id="ol-products-heading">Products I’ve <span class="ol-highlight">designed.</span></h2><a class="ol-button" href="#xp-work">Explore the work</a></div></div></section>'
    fan_assets = [('/assets/expertise/flagship-crent.png', 'Crent'), ('/assets/expertise/flagship-apptech.png', 'AppTech'), ('/assets/expertise/flagship-tms.png', 'TMS')]
    fan = ''.join(f'<button type="button" class="ol-fan-card zoom ol-cover-{i}" data-full="{img}" data-caption="{title} product design" data-product-title="{title}" aria-label="View {title} full presentation">' + image(img, title + ' product presentation', 1254, 1254, 'loading="lazy"') + '</button>' for i, (img, title) in enumerate(fan_assets))
    marquee_items = ''.join(f'<span class="swiper-slide ol-wordmark">{t}</span>' for t in ['TMS', 'AppTech', 'Crent', 'Flow', 'CallingDr', 'Omni Help', 'Consumer Connect'])
    work = '<section class="ol-work" id="xp-work" aria-labelledby="ol-work-heading"><div class="ol-work-inner"><div class="ol-work-copy"><h2 id="ol-work-heading"><span>UI/UX design.</span><span>Selected work.</span></h2><p>A selection of web, SaaS and mobile interfaces. Open the collection for the full presentations and mobile screen galleries.</p><div class="ol-work-actions"><button type="button" class="ol-button" data-ol-gallery>View portfolio</button><a class="ol-small-link" href="/uiux-web-saas/" aria-label="All UI/UX work">↗</a></div></div><div class="ol-fan">' + fan + comment('Mobile attendance and employee operations.', 'ol-fan-note', label='AppTech') + comment('Travel bookings, agencies and reporting.', 'ol-fan-note-two', label='TMS') + tool('vscode', 'ol-fan-tool') + tool('figma', 'ol-fan-tool-two') + '</div></div><div class="ol-product-marquee swiper" tabindex="0" role="region" aria-label="Featured products"><div class="ol-marquee-track swiper-wrapper">' + marquee_items + marquee_items.replace('class="swiper-slide', 'aria-hidden="true" class="swiper-slide') + '</div></div></section>'
    cases = [('CallingDr', 'Telehealth website and care interfaces.', '/archive/#archive-record-care-by-callingdr', cards[0]['src']), ('Consumer Connect', 'Consumer research dashboard and participant workflows.', '/archive/#archive-record-consumer-connect', cards[2]['src']), ('Omni Help', 'Mobile healthcare and self-care experience.', '/archive/#archive-record-omnihelp', cards[1]['src'])]
    case_section = '<section class="ol-cases ol-preview-grid" aria-label="Selected interface case studies">' + ''.join(showcase_card(i, title, desc, url, img, esc, image) for i, (title, desc, url, img) in enumerate(cases)) + '</section>'
    contact = '<section class="ol-contact" id="xp-contact" aria-labelledby="ol-contact-heading"><div class="ol-contact-inner"><div class="ol-contact-art ol-dots"><span class="ol-aa" aria-hidden="true">Aa</span><div class="ol-contact-metric">' + image(products['flow']['image']['src'], 'Flow business management dashboard', 1000, 800, 'loading="lazy"') + '</div><div class="ol-contact-photo ol-photo-one">' + image('/assets/expertise/product-flight-workspace.jpeg', 'Product design workspace', 1376, 768, 'loading="lazy"') + '</div><div class="ol-contact-photo ol-photo-two">' + image('/assets/hadi-founder-intro.jpg', 'Hadi Hassan', 1200, 800, 'loading="lazy"') + '</div><div class="ol-contact-chat">' + chat + '</div>' + tool('vscode', 'ol-contact-code') + tool('figma', 'ol-contact-figma') + tool('notion', 'ol-contact-notion') + tool('nextjs', 'ol-contact-next') + cursor('Client', 1, 'ol-contact-cursor') + '</div><div class="ol-contact-copy"><h2 id="ol-contact-heading"><span>Have a product</span><span>to discuss?</span></h2><p>Share a product brief, a design leadership opportunity or a consulting enquiry. Let’s discuss the scope and the next step.</p><div class="ol-contact-actions"><a class="ol-button" href="mailto:hadi@intellignce.net">Let’s talk</a><div><a class="ol-small-link" href="/resume/">View CV ↗</a><button type="button" class="ol-small-link" data-ol-sera>Ask Sera</button></div></div></div></div></section>'

    # On-page mobile gallery. The screenshots are original owner-supplied assets.
    screen_collections = json.loads((src / 'data/mobile-screen-stacks.json').read_text())['collections']
    # Present AppTech client/admin together in one tab, without mixing projects.
    project_order = [
        ('apptech', 'AppTech', ['apptech-client', 'apptech-admin']),
        ('consumer-connect', 'Consumer Connect', ['consumer-connect']),
        ('omni-help', 'Omni Help', ['omni-help']),
        ('morganics', 'Morganics', ['morganics']),
    ]
    by_screen_id = {collection['id']: collection for collection in screen_collections}
    mobile_tabs, mobile_panels = [], []
    for project_index, (project_id, project_title, source_ids) in enumerate(project_order):
        screen_items = [(slide, source_id) for source_id in source_ids
                        if source_id in by_screen_id
                        for slide in by_screen_id[source_id]['slides']]
        selected_state = 'true' if project_index == 0 else 'false'
        mobile_tabs.append(
            '<button type="button" class="mg-tab" role="tab" aria-selected="' + selected_state
            + '" aria-controls="mg-panel-' + project_id + '" id="mg-tab-' + project_id
            + '" data-mg-tab="' + project_id + '">' + esc(project_title) + '</button>'
        )
        phones = []
        for screen_index, (slide, source_id) in enumerate(screen_items):
            source = '/assets/expertise/' + slide['src']
            phones.append(
                '<li class="mg-phone" aria-label="' + esc(project_title + ': ' + slide['title']) + '">'
                '<div class="mg-device"><div class="mg-viewport"><img src="' + esc(source) + '" '
                'alt="' + esc(slide['alt']) + '" loading="lazy" decoding="async"></div>'
                '<span class="mg-island" aria-hidden="true"></span></div>'
                '<span class="mg-phone-caption">' + esc(slide['title']) + '</span></li>'
            )
        mobile_panels.append(
            '<div class="mg-panel" role="tabpanel" id="mg-panel-' + project_id
            + '" aria-labelledby="mg-tab-' + project_id + '" data-mg-panel="' + project_id
            + '"' + ('' if project_index == 0 else ' hidden') + '>'
            '<div class="mg-marquee" data-mg-marquee><div class="mg-track" data-mg-track>'
            '<ol class="mg-phones" data-mg-original>' + ''.join(phones) + '</ol>'
            '</div></div></div>'
        )
    mobile_gallery = (
        '<section class="mg-section" id="xp-mobile-gallery" aria-labelledby="mg-heading">'
        '<div class="mg-content"><h2 id="mg-heading">UI/UX design Selected work</h2>'
        '<p>Explore UI/UX case studies for SaaS platforms, MVPs and mobile apps. '
        'Select a project to explore its original interface screens.</p>'
        '<div class="mg-tabs" role="tablist" aria-label="Select a UI/UX project">'
        + ''.join(mobile_tabs) + '</div>'
        '<div class="mg-card">' + ''.join(mobile_panels) + '</div>'
        '<p class="mg-note">Original project screenshots. Hover or focus to pause motion.</p>'
        '</div></section>'
    )

    gallery_cards = ''.join('<button type="button" class="zoom ol-gallery-art" data-full="' + esc(c['src']) + '" data-caption="' + esc(c['title']) + '">' + image(c['src'], c['title'], c['width'], c['height'], 'loading="lazy"') + '<span>' + esc(c['title']) + '</span></button>' for c in cards)
    gallery = '<dialog class="ol-gallery" id="ol-gallery" aria-labelledby="ol-gallery-heading"><div class="ol-gallery-head"><h2 id="ol-gallery-heading">Selected work.</h2><button type="button" data-ol-gallery-close>Close ×</button></div><p class="ol-gallery-intro">Nineteen supplied presentations and the complete mobile interface collection.</p><div class="ol-gallery-grid">' + gallery_cards + '</div>' + mobile_stack + '</dialog><dialog class="lightbox" aria-label="Project presentation"><button type="button" class="close" aria-label="Close project presentation">Close ×</button><img alt=""><p></p></dialog>'
    return '<main class="onlines-page product-portfolio" data-discipline="product-development" id="top">' + hero_section + intro + services + feature + product_section + work + mobile_gallery + contact + gallery + '</main>'
