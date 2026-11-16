"""Product-only flying-card hero; original artwork and approved interface captures."""
import json

def render_product_flight(src, entry, esc):
    data = json.loads((src / 'data/product-flight.json').read_text())
    bg = data['background']
    cards = ''.join(
        '<a class="product-flight-card" data-flight-card style="--flight-aspect:'+str(round(card['width']/card['height'],5))+'" href="#xp-mobile-showcase" aria-label="Explore '+esc(card['title'])+'">'
        '<span class="product-flight-flip"><span class="product-flight-front"><img src="'+esc(card['src'])+'" width="'+str(card['width'])+'" height="'+str(card['height'])+'" alt="'+esc(card['title'])+'" decoding="async" loading="lazy"></span>'
        '<span class="product-flight-back" aria-hidden="true"><span>'+esc(card['title'])+'</span><span>Explore the screen gallery ↗</span></span></span></a>'
        for card in data['cards']
    )
    return (
        '<section class="product-flight" data-product-flight aria-labelledby="expertise-heading">'
        '<div class="product-flight-stage">'
        '<picture class="product-flight-background"><source type="image/webp" srcset="/assets/expertise/product-flight-workspace-768.webp 768w, /assets/expertise/product-flight-workspace-1376.webp 1376w" sizes="100vw">'
        '<img src="'+esc(bg['src'])+'" width="'+str(bg['width'])+'" height="'+str(bg['height'])+'" alt="'+esc(bg['alt'])+'" fetchpriority="high" decoding="async"></picture>'
        '<div class="product-flight-shade" aria-hidden="true"></div>'
        '<div class="product-flight-copy"><a class="expertise-back" href="/#expertise">← Hadi Hassan / All expertise</a>'
        '<span class="expertise-kicker">'+esc(entry['eyebrow'])+'</span>'
        '<h1 id="expertise-heading"><span><span>Senior Product</span></span><span><span>Designer.</span></span></h1>'
        '<p>'+esc(entry['statement'])+'</p>'
        '<div class="xp-hero-actions"><a class="xp-button" href="#xp-mobile-showcase">Explore the interfaces ↗</a>'
        '<a class="xp-button xp-button-outline" href="#xp-contact">Discuss an opportunity ↗</a></div></div>'
        '<div class="product-flight-cards" role="group" aria-label="Selected product interfaces">'+cards+'</div>'
        '<div class="product-flight-caption"><span>PRODUCT DESIGN & DEVELOPMENT</span><span>Scroll to connect the work ↓</span></div>'
        '</div></section>'
    )
