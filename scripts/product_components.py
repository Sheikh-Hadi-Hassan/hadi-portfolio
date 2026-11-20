"""Measured reference components, adapted to the owner's content and palette."""


def reference_components(products, esc, image):
    entries = [products[key] for key in ['apptech', 'tms', 'crent', 'flow']]
    ipod_items = ''.join('<button type="button" data-ipod-item="' + str(i) + '" data-url="' + esc(p['url']) + '" data-image="' + esc(p['image']['src']) + '" data-title="' + esc(p['title']) + '" aria-pressed="' + ('true' if i == 0 else 'false') + '">' + esc(p['title']) + '<span aria-hidden="true">›</span></button>' for i, p in enumerate(entries))
    ipod = ('<div class="ol-ipod" aria-label="Interactive project player"><div class="ol-ipod-display"><div class="ol-ipod-status">Hadi’s iPod <span aria-hidden="true">▰</span></div><div class="ol-ipod-menu">' + ipod_items + '</div><div class="ol-ipod-now" hidden><img src="' + esc(entries[0]['image']['src']) + '" alt="" width="1000" height="800"><strong data-ipod-title>AppTech</strong><span>Selected product design</span></div></div><div class="ol-ipod-wheel"><button type="button" class="ol-ipod-menu-button" data-ipod-menu aria-label="Show project menu">MENU</button><button type="button" class="ol-ipod-prev" data-ipod-step="-1" aria-label="Previous project">⏮</button><button type="button" class="ol-ipod-next" data-ipod-step="1" aria-label="Next project">⏭</button><button type="button" class="ol-ipod-open" data-ipod-open aria-label="Open selected product">↗</button><button type="button" class="ol-ipod-select" data-ipod-select aria-label="Preview selected project"></button></div></div>')
    lines = [
        '<span class="ol-syntax-key">const</span> product = {',
        '  name: <span class="ol-syntax-string">"AppTech"</span>,',
        '  platform: <span class="ol-syntax-string">"Web &amp; mobile"</span>,',
        '  focus: [',
        '    <span class="ol-syntax-string">"Research"</span>,',
        '    <span class="ol-syntax-string">"Interface design"</span>,',
        '    <span class="ol-syntax-string">"Design systems"</span>',
        '  ]',
        '}',
        '<span class="ol-syntax-comment">// Designed around real workflows.</span>',
    ]
    code = '<div class="ol-reference-code"><div class="ol-code-chrome"><span class="ol-code-lights" aria-hidden="true"><i></i><i></i><i></i></span><span>product.js</span><button type="button" data-code-copy aria-label="Copy product design code">Copy</button></div><pre aria-label="Product design code example"><code>' + ''.join('<span class="ol-code-line"><span aria-hidden="true">' + str(i) + '</span><span>' + line + '</span></span>' for i, line in enumerate(lines, 1)) + '</code></pre><span class="ol-copy-status" role="status" aria-live="polite"></span></div>'
    service = '<a class="ol-pin-card" href="#xp-contact" aria-label="Discuss UI/UX design"><span class="ol-pin" aria-hidden="true"></span><span class="ol-pin-number">UI/UX</span><span class="ol-pin-content"><strong>Digital product design</strong><span>Research, clear interfaces and connected design systems. From the first workflow to the final handoff.</span></span></a>'
    paths = [('Research', '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>'), ('Interface design', '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 9v12"/>'), ('Design systems', '<path d="m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5"/>'), ('Prototyping', '<path d="m5 3 14 9-7 1-3 7Z"/>'), ('Mobile apps', '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>'), ('Developer handoff', '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18"/>')]
    toolkit = '<div class="ol-icon-grid" aria-label="Product design disciplines">' + ''.join('<span class="ol-discipline-icon" title="' + title + '"><svg role="img" aria-label="' + title + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + path + '</svg></span>' for title, path in paths) + '</div>'
    return ipod, code, service, toolkit


def showcase_card(index, title, description, url, artwork, esc, image):
    return ('<article class="ol-preview"><a class="ol-case ol-preview-media" href="' + esc(url) + '">' + image(artwork, title + ' interface presentation', extra='loading="lazy"') + '<div class="ol-preview-caption"><div><h3>' + esc(title) + '</h3><span>Product &amp; UI/UX design</span></div><span class="ol-preview-visit">View project ↗</span></div></a><button class="ol-preview-toggle" type="button" data-preview-toggle aria-expanded="false" aria-controls="ol-preview-' + str(index) + '" aria-label="Show ' + esc(title) + ' project details"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 9 7 7 7-7"/></svg></button><div class="ol-preview-details" id="ol-preview-' + str(index) + '" hidden><p>' + esc(description) + '</p><div><span>UX research</span><span>Interface design</span></div><a href="' + esc(url) + '">Explore the project ↗</a></div></article>')
