"""A focused product portfolio using the homepage's existing brand components."""
import json
import re

def render_product_portfolio(src, esc, hero, mobile_stack, progress):
    products=json.loads((src/'data/digital-products.json').read_text())['products']
    by_id={p['id']:p for p in products}
    product_cards=[]
    for key in ['tms','apptech','crent','flow']:
        p=by_id[key];im=p['image']
        label='Explore the concept' if key=='flow' else 'Open product preview'
        note='Sign-in required' if key=='apptech' else 'Product presentation' if key=='flow' else p['stage']
        focus={
            'tms':('Travel operations','Booking, agency workflows, commissions and reporting in a single interface.'),
            'apptech':('Field technician workflow','Attendance, building and riser guidance, with shift records an administrator can review.'),
            'crent':('Rental operations','Booking overview, fleet availability and rental management, connected in one dashboard.'),
            'flow':('Business operating system','A product direction connecting revenue, project delivery, resources and team visibility.'),
        }[key]
        product_cards.append(
            '<article class="product-card pp-showcase-card" data-product="'+key+'">'
            '<a class="pp-product-image" href="'+esc(p['url'])+'" target="_blank" rel="noopener noreferrer">'
            '<img class="product-showcase" src="'+esc(im['src'])+'" width="'+str(im['width'])+'" height="'+str(im['height'])+'" loading="lazy" decoding="async" alt="'+esc(im['alt'])+'">'
            '<div class="pp-showcase-caption"><h3>'+esc('Flow' if key=='flow' else p['title'])+'</h3><span>'+esc(focus[0])+'</span></div><span class="pp-showcase-launch" aria-hidden="true">↗</span></a>'
            '<details class="pp-showcase-details"><summary><span class="pp-showcase-summary">Product overview</span><span class="pp-showcase-chevron" aria-hidden="true">⌄</span></summary>'
            '<div class="pp-showcase-reveal"><div><span class="bf-kicker">'+esc(note)+'</span><p>'+esc(focus[1])+'</p>'
            '<a class="bf-text-link" href="'+esc(p['url'])+'" target="_blank" rel="noopener noreferrer">'+label+' ↗</a></div></div></details></article>'
        )
    featured=(
        '<section class="digital-products" id="xp-products" aria-labelledby="products-heading"><div class="products-header"><span class="bf-kicker">FEATURED PRODUCTS / 01—04</span>'
        '<h2 id="products-heading">Ideas made usable.</h2><p>Four products I’m shaping across travel, field operations, rental management and business systems.</p></div>'
        '<div class="products-grid">'+''.join(product_cards)+'</div></section>'
    )
    cards=json.loads((src/'data/product-flight.json').read_text())['cards']
    selected=[cards[i] for i in [0,1,2,3,4,5,6,7,9]]
    presentations=''.join(
        '<article class="pp-work-card"><button class="zoom" type="button" data-full="'+esc(c['src'])+'" data-caption="'+esc(c['title'])+'">'
        '<img src="'+esc(c['src'])+'" width="'+str(c['width'])+'" height="'+str(c['height'])+'" loading="lazy" decoding="async" alt="'+esc(c['title'])+' presentation">'
        '<span class="pp-orbit-caption"><span><strong>'+esc(c['title'].split(' / ')[0])+'</strong><span>'+esc(c['title'].split(' / ')[-1])+'</span></span><span class="pp-orbit-open" aria-hidden="true">↗</span></span></button>'
        '</article>'
        for c in selected
    )
    work=(
        '<section class="pp-section" id="xp-work" aria-labelledby="xp-work-heading"><header class="pp-section-head"><div><span class="bf-kicker">SELECTED INTERFACE WORK</span><h2 id="xp-work-heading">Selected work.</h2></div>'
        '<div><p>Healthcare, research and the systems people use every day. A closer look at the interfaces behind the experience.</p><a class="bf-text-link" href="/uiux-web-saas/">Explore the design collection ↗</a></div></header>'
        '<div class="pp-work-grid" data-work-orbit tabindex="0" role="region" aria-roledescription="carousel" aria-label="Selected design projects">'+presentations+'</div>'
        '<div class="pp-orbit-controls"><span class="bf-kicker">DRAG TO EXPLORE · OPEN TO LOOK CLOSER</span><div><button type="button" data-orbit-prev aria-label="Previous project">←</button><span data-orbit-count aria-live="polite">01 / 09</span><button type="button" data-orbit-next aria-label="Next project">→</button></div></div>'
        '<dialog class="lightbox" aria-label="Project presentation"><button type="button" class="close" aria-label="Close project presentation">Close ×</button><img alt=""><p></p></dialog></section>'
    )
    # Reuse the homepage's real process component, rather than another visual system.
    home=(src/'pages/home.html').read_text()
    process=re.search(r'<section class="creative-process".*?</section>',home,re.S).group()
    process=process.replace('id="process"','id="xp-approach"').replace('process-title','product-process-title')
    contact=(
        '<section class="pp-section pp-contact" id="xp-contact" aria-labelledby="xp-contact-heading"><div><span class="bf-kicker">THE NEXT CONVERSATION</span>'
        '<h2 id="xp-contact-heading">Let’s make it work.</h2></div><div><p>Product design leadership or a focused consulting brief. Tell me about your team, your product and what needs to change.</p>'
        '<div class="pp-actions"><a class="bf-button" href="mailto:hadi@intellignce.net?subject=Product%20design%20opportunity">Discuss an opportunity ↗</a>'
        '<a class="bf-button pp-secondary" href="/resume/">Review my CV ↗</a></div></div></section>'
    )
    nav='<nav class="xp-sticky-rail" aria-label="On this portfolio"><a href="#xp-products">Featured products</a><a href="#xp-work">Selected work</a><a href="#xp-mobile-showcase">Screen gallery</a><a href="#xp-approach">Process</a><a href="#xp-contact">Contact</a></nav>'
    return '<main class="expertise-page product-portfolio" data-discipline="product-development" id="top"><div class="bayfi-body product-portfolio-body">'+progress+hero+nav+featured+work+mobile_stack+process+contact+'</div></main>'
