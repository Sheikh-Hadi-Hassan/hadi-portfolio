#!/usr/bin/env python3
"""Build static pages from shared components and project data. No dependencies."""
from pathlib import Path
import os
import json,re,shutil,html
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'src';DIST=ROOT/'dist'
def read(path):return (SRC/path).read_text()
def render(template,values):
 return re.sub(r'\{\{(\w+)\}\}',lambda m:str(values[m.group(1)]),template)
def esc(value):return html.escape(str(value),quote=True)
def icon(name):
 svg=(ROOT/'vendor/pixelarticons'/f'{name}.svg').read_text().strip()
 return svg.replace('<svg ',f'<svg class="px-icon px-{name}" aria-hidden="true" focusable="false" ',1)
def symbols(text):
 for char,name in [('↗','external-link'),('↘','arrow-down'),('←','arrow-left'),('↑','arrow-up'),('↓','arrow-down')]:text=text.replace(char,icon(name))
 text=text.replace('COPY EMAIL</button>',icon('copy')+' COPY EMAIL</button>')
 text=re.sub(r'(Download CV|EXPLORE MY EXPERIENCE)(\s*)(<svg.*?</svg>)',lambda m:m.group(1)+m.group(2)+icon('download'),text,flags=re.S)
 return text
shutil.copytree(ROOT/'public/assets',DIST/'assets',dirs_exist_ok=True)
profile=json.loads(read(Path('data/profile.json')))
profile_values={key:esc(value) for key,value in profile.items() if isinstance(value,str)}
profile_values['social_links']=''.join(f'<a href="{esc(item["url"])}" target="_blank" rel="noopener">{esc(item["label"])} ↗</a>' for item in profile['socials'])
social_marks={'LinkedIn':'in','Instagram':'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg>','Facebook':'f','Behance':'Bē'}
profile_values['footer_socials']=''.join(f'<a href="{esc(item["url"])}" class="v2ft-bottom-social" target="_blank" rel="noopener noreferrer" aria-label="{esc(item["label"])}"><span aria-hidden="true">{social_marks[item["label"]]}</span></a>' for item in profile['socials'])
head=read(Path('components/head.html'));navigation=render(read(Path('components/navigation.html')),profile_values);footer=render(read(Path('components/footer.html')),profile_values)
BASE=os.environ.get('SITE_URL','https://hadi-hassan-editorial.lemony-morel-0696.chatgpt.site').rstrip('/')
urls=[]
def page(title,description,body,body_class='',path='/',image='/assets/hadi-speaking-original.png',creative=None):
 url=BASE+path;urls.append(url)
 person={'@type':'Person','@id':BASE+'/#hadi','name':'Hadi Hassan','alternateName':['Sheikh Hadi Hassan','Hadi Hasssan'],'jobTitle':'Creative Director and Brand Identity Designer','url':BASE+'/','email':profile['email'],'telephone':profile['phone'],'address':{'@type':'PostalAddress','addressLocality':'Lahore','addressCountry':'PK'},'sameAs':[item['url'] for item in profile['socials']],'knowsAbout':['Brand identity','Logo design','Creative direction','Campaign design','Packaging','Visual storytelling','Art direction','Graphic design','Website design','Digital product design'],'image':BASE+'/assets/hadi-speaking-original.png','worksFor':{'@type':'Organization','name':'INTELLIGNCE','url':profile['company']}}
 graph=[person,{'@type':'WebSite','@id':BASE+'/#website','name':'Hadi Hassan — Creative Direction & Brand Identity','url':BASE+'/'},{'@type':'WebPage','@id':url+'#webpage','name':title,'description':description,'url':url,'isPartOf':{'@id':BASE+'/#website'},'about':{'@id':BASE+'/#hadi'}}]
 if path=='/':
  graph.append({'@type':'ItemList','@id':BASE+'/#services','name':'Creative and digital services by Hadi Hassan','itemListElement':[{'@type':'ListItem','position':i+1,'item':{'@type':'Service','name':name,'serviceType':kind,'provider':{'@id':BASE+'/#hadi'},'url':BASE+'/#services'}} for i,(name,kind) in enumerate([('Branding Solutions','Logo design and brand identity'),('Design Solutions','Graphic design and UI/UX design'),('Social Media Creatives','Creative campaigns and social media design'),('E-commerce Solutions','E-commerce design and product photography'),('App Development','Web, SaaS and mobile application development'),('Conversion-Focused Landing Pages','Landing page design and development')])]})
 if path!='/':
  crumbs=[{'@type':'ListItem','position':1,'name':'Hadi Hassan','item':BASE+'/'}]
  if path!='/archive/':crumbs.append({'@type':'ListItem','position':2,'name':'Portfolio','item':BASE+'/archive/'})
  crumbs.append({'@type':'ListItem','position':len(crumbs)+1,'name':creative['title'] if creative else 'Portfolio','item':url})
  graph.append({'@type':'BreadcrumbList','itemListElement':crumbs})
 if creative:graph.append({'@type':'CreativeWork','name':creative['title'],'description':description,'url':url,'image':BASE+image,'creator':{'@id':BASE+'/#hadi'}})
 structured=json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False).replace('</',r'<\/')
 seo=f'<link rel="canonical" href="{esc(url)}"><meta property="og:type" content="website"><meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(description)}"><meta property="og:url" content="{esc(url)}"><meta property="og:image" content="{esc(BASE+image)}"><meta property="og:image:alt" content="{esc(title)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{esc(title)}"><meta name="twitter:description" content="{esc(description)}"><meta name="twitter:image" content="{esc(BASE+image)}"><script type="application/ld+json">{structured}</script>'
 return symbols(render(head,{'title':esc(title),'description':esc(description),'body_class':body_class,'seo':seo})+'<a class="skip-link" href="#top">Skip to content</a>'+navigation+body+footer+'</body></html>')
(DIST/'index.html').write_text(page('Hadi Hassan | Creative Director & Brand Identity Designer','Hadi Hassan is a creative director and brand identity designer in Lahore, Pakistan. Explore logo design, branding, campaigns and digital experiences.',read(Path('pages/home.html'))))
projects=json.loads(read(Path('data/projects.json')));template=read(Path('pages/case-study.html'))
def listing(items):return '<ul>'+''.join('<li>'+esc(item)+'</li>' for item in items)+'</ul>'
# Build archive cards from the same project source as their case studies.
selected=json.loads(read(Path('data/selected-work.json')))
cover_map={item['slug']:item['cover'] for item in selected if item.get('slug')}
archive_cards=[]
for position,project in enumerate(projects):
 category=project.get('archive_filter') or ('digital' if project['slug']=='uiux-web-saas' else 'photography' if project['slug']=='bw-sports' else 'film' if project['slug']=='fakhr-e-qoum' else 'campaign' if project['slug'] in ['linkedin-personal-brand','community-campaign'] else 'identity')
 cover=cover_map.get(project['slug'],project['hero'])
 width,height=(808,632) if project['slug'] in cover_map else (project['hero_width'],project['hero_height'])
 archive_cards.append(f'<a class="archive-tile" data-category="{category}" href="/{esc(project["slug"])}/"><div class="archive-media"><img src="{esc(cover)}" width="{width}" height="{height}" loading="lazy" decoding="async" alt="{esc(project["title"])} — {esc(project["category"])}"><span class="archive-open" aria-hidden="true">{icon("arrow-up-right") if (ROOT/"vendor/pixelarticons/arrow-up-right.svg").exists() else icon("external-link")}</span></div><div class="archive-caption"><div><h2>{esc(project["title"])}</h2><p>{esc(project["category"])}</p></div><span class="archive-number" aria-hidden="true">{position+1:02d}</span></div></a>')
explorer_slides=[];explorer_thumbs=[]
for j,project in enumerate(projects):
 visual=next((x for x in ([{'src':project['hero'],'width':project['hero_width'],'height':project['hero_height']}]+project['images']) if x['width']>=1400),{'src':project['hero'],'width':project['hero_width'],'height':project['hero_height']});cover=visual['src'];w,h=visual['width'],visual['height'];active=j==0
 short=project['title'].split(' — ')[0].split(' | ')[0]
 explorer_slides.append(f'<article class="project-scene{ " is-active" if active else ""}" data-project-scene="{j}" aria-hidden="{str(not active).lower()}"'+('' if active else ' inert')+f'><img class="project-scene-image" src="{esc(cover)}" width="{w}" height="{h}" alt="{esc(project["title"])} — {esc(project["category"])}" '+('fetchpriority="high" loading="eager"' if active else 'loading="lazy"')+f' decoding="async"><div class="project-scene-copy"><span>{esc(project["category"])}</span><h2>{esc(short)}</h2></div><a class="project-scene-link" href="/{esc(project["slug"])}/">Explore case study {icon("external-link")}</a></article>')
 explorer_thumbs.append(f'<button type="button" class="project-thumb{ " is-active" if active else ""}" data-project-select="{j}" aria-label="Preview {esc(project["title"])}" aria-pressed="{str(active).lower()}"><img src="{esc(cover)}" width="{w}" height="{h}" alt="" loading="lazy" decoding="async"><span>{esc(short)}</span></button>')
explorer='<section class="project-explorer" aria-label="Interactive project preview" data-project-explorer><div class="project-explorer-top"><a class="back" href="/">← Back to home</a><a href="#project-index">All '+str(len(projects))+' projects ↓</a></div><div class="project-scenes">'+''.join(explorer_slides)+'</div><div class="project-dock" data-project-dock><button class="project-drag" type="button" aria-label="Move project selector. Use arrow keys to reposition." data-project-drag><span></span></button><div class="project-thumbs" role="group" aria-label="Choose a project">'+''.join(explorer_thumbs)+'</div></div><div class="project-explorer-bottom"><span><span data-project-position>01</span> / '+str(len(projects))+'</span><div><button type="button" data-project-step="-1" aria-label="Previous project">←</button><button type="button" data-project-step="1" aria-label="Next project">→</button></div></div><p class="sr-only" role="status" aria-live="polite" data-project-status></p></section>'
archive_body=render(read(Path('pages/archive.html')),{'archive_count':len(projects),'archive_cards':''.join(archive_cards),'project_explorer':explorer})
(DIST/'archive/index.html').write_text(page('Brand Identity, UI/UX & Creative Portfolio | Hadi Hassan','Explore Hadi Hassan’s portfolio of brand identity, logo design, creative campaigns, UI/UX, SaaS applications, product photography and documentary projects.',archive_body,path='/archive/'))
for i,p in enumerate(projects):
 values={key:esc(value) for key,value in p.items() if isinstance(value,str)}
 values['hero_width']=p['hero_width'];values['hero_height']=p['hero_height']
 values['top_carousel']=''
 posts=p.get('social_posts',[])
 if posts:
  def social_group(clone=False):
   figures=''
   for post in posts:
    label=esc(post['alt']) if not clone else ''
    if post.get('video'):
     media=f'<video data-motion-src="{esc(post["video"])}" poster="{esc(post.get("poster",post["src"]))}" width="{post["video_width"]}" height="{post["video_height"]}" aria-label="{label}" autoplay muted loop playsinline preload="none"></video>'
    else:media=f'<img src="{esc(post["src"])}" width="{post["width"]}" height="{post["height"]}" alt="{label}" loading="lazy" decoding="async">'
    figures+='<figure class="social-post">'+media+'</figure>'
   return '<div class="social-group"'+(' aria-hidden="true" inert' if clone else '')+'>'+figures+'</div>'
  values['top_carousel']='<section class="social-carousel" data-social-carousel aria-labelledby="social-title"><div class="social-heading"><div><span class="eyebrow">SOCIAL CAMPAIGN</span><h2 id="social-title">Morganics in the feed.</h2></div><div class="social-controls"><button type="button" data-social-prev aria-label="Previous social post">←</button><button type="button" data-social-play aria-label="Pause automatic scrolling" aria-pressed="false">Pause</button><button type="button" data-social-next aria-label="Next social post">→</button></div></div><div class="social-rail" tabindex="0" role="region" aria-label="Morganics social posts. Swipe or use the previous and next buttons to explore."><div class="social-track">'+social_group()+social_group(True)+'</div></div></section>'
 if posts:
  values['top_carousel']=values['top_carousel'].replace('Morganics in the feed.',esc(p.get('carousel_title','Morganics in the feed.'))).replace('SOCIAL CAMPAIGN',esc(p.get('carousel_kicker','SOCIAL CAMPAIGN'))).replace('Morganics social posts. Swipe or use the previous and next buttons to explore.',esc(p.get('carousel_label','Morganics social posts. Swipe or use the previous and next buttons to explore.')))
  if p['slug']=='ai-animation':values['top_carousel']=values['top_carousel'].replace('class="social-carousel"','class="social-carousel ai-story-carousel"')
  if p['slug']=='community-campaign':values['top_carousel']=values['top_carousel'].replace('class="social-carousel"','class="social-carousel campaign-carousel"')
 values['availability_note']='<p class="case-availability">Project overview · Extended image gallery to follow.</p>' if p.get('content_status')=='overview' else ''
 values['production_direction']='<section class="editorial-block"><h2>PRODUCTION DIRECTION</h2><p>'+esc(p['decision'])+'</p></section>' if p['slug']=='fakhr-e-qoum' else ''
 values['article']=''.join('<section class="editorial-block"><h2>'+esc(section['title'])+'</h2><div>'+''.join('<p>'+esc(paragraph)+'</p>' for paragraph in section['paragraphs'])+'</div></section>' for section in p.get('article_sections',[]))
 video=p.get('video');values['media']=''
 if video:
  values['media']=f'<section class="case-film" aria-labelledby="film-title"><h2 id="film-title">WATCH THE DOCUMENTARY</h2><p>{esc(video["title"])}</p><div class="case-film-frame"><iframe src="{esc(video["embed"])}" title="{esc(video["title"])}" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><a class="small-link" href="{esc(video["url"])}" target="_blank" rel="noopener noreferrer">WATCH ON YOUTUBE ↗</a></section>'

 if video and video.get('provider')=='adobe':
  values['media']=f'<section class="case-film ai-case-film" aria-labelledby="film-title"><h2 id="film-title">WATCH THE FILM</h2><p>{esc(video["title"])}</p><div class="case-film-frame"><iframe src="{esc(video["embed"])}" title="{esc(video["title"])}" loading="lazy" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><a class="small-link" href="{esc(video["url"])}" target="_blank" rel="noopener noreferrer">OPEN VIDEO PLAYER ↗</a></section>'

 reels=p.get('instagram_reels',[])
 if reels:
  reel_cards=''.join(f'<article class="campaign-reel"><iframe src="{esc(reel["embed"])}" title="{esc(reel["title"])}" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe><a href="{esc(reel["url"])}" target="_blank" rel="noopener noreferrer">REEL {n:02d} · OPEN ON INSTAGRAM ↗</a></article>' for n,reel in enumerate(reels,1))
  values['media']+='<section class="campaign-reels" aria-labelledby="campaign-reels-title"><header><span class="eyebrow">CAMPAIGN IN MOTION</span><h2 id="campaign-reels-title">Stories from the campaign.</h2><p>Explore 12 reels from Taraqqi Ka Tasalsul. If an Instagram player does not load, use the link below it to watch the original.</p></header><div class="campaign-reels-grid">'+reel_cards+'</div></section>'

 values['services']=esc(p['services']).replace(' / ','<br>');values['goals']=listing(p['goals']);values['disciplines']=listing(p['services'].split(' / '));values['deliverables']=listing(p['deliverables']);values['source']=esc(p['link']);values['close_icon']=icon('close')
 values['system_title']='VISUAL STORYTELLING' if p['slug']=='fakhr-e-qoum' else 'IDENTITY SYSTEM'
 values['design_title']='THE FILM & ITS CONTEXT' if p['slug']=='fakhr-e-qoum' else 'CAMPAIGN DESIGN' if p['slug']=='community-campaign' else 'VISUAL DESIGN'
 values['system_title']=esc(p.get('system_title',values['system_title']))
 values['design_title']=esc(p.get('design_title',values['design_title']))
 values['source_link']=f'<a class="small-link" href="{esc(p["link"])}" target="_blank" rel="noopener">ORIGINAL CASE STUDY ↗</a>' if p.get('link') and p.get('source_available') else ''
 values['design_copy']='The idea becomes visible here: in the mark, the visual language and the situations where people encounter the work. Open any image to explore the details.'
 values['design_copy']=esc(p.get('design_copy',values['design_copy']))
 values['gallery']='\n'.join(f'<figure class="case-figure reveal"><button class="zoom" data-full="{esc(image["src"])}" data-caption="{esc(p["title"])} — visual {j+1}" aria-label="Enlarge {esc(p["title"])} visual {j+1}"><img src="{esc(image["src"])}" width="{image["width"]}" height="{image["height"]}" loading="lazy" decoding="async" style="max-width:min(100%,{image["width"]}px);margin-inline:auto" alt="{esc(image.get("alt",p["title"]+" — "+p["category"]+" and project application "+str(j+1)))}"><span>EXPAND {icon("expand")}</span></button></figure>' for j,image in enumerate(p['images']))
 values['chapter_gallery']=''
 values['chapter_index']=''
 if p.get('gallery_chapters'):
  image_map={image['src']:image for image in p['images']}
  chapters=[]
  for chapter in p['gallery_chapters']:
   figures=[]
   for src in chapter['images']:
    image=image_map[src];caption=image.get('alt',p['title'])
    figures.append(f'<figure class="case-figure"><button class="zoom" data-full="{esc(src)}" data-caption="{esc(caption)}" aria-label="Enlarge {esc(caption)}"><img src="{esc(src)}" width="{image["width"]}" height="{image["height"]}" loading="lazy" decoding="async" style="max-width:min(100%,{image["width"]}px);margin-inline:auto" alt="{esc(caption)}"><span>EXPAND {icon("expand")}</span></button></figure>')
   chapters.append(f'<section class="morganics-chapter" id="{esc(chapter["id"])}" aria-labelledby="{esc(chapter["id"])}-title"><header class="morganics-chapter-heading"><div><span class="eyebrow">{esc(chapter["label"])}</span><h2 id="{esc(chapter["id"])}-title">{esc(chapter["title"])}</h2></div><p>{esc(chapter["copy"])}</p></header><div class="morganics-grid morganics-grid-{esc(chapter["layout"])}">'+''.join(figures)+'</div></section>')
  values['chapter_gallery']=''.join(chapters)
  values['chapter_index']='<nav class="morganics-index" aria-label="Case-study chapters">'+''.join(f'<a href="#{esc(c["id"])}">{esc(c["title"].rstrip("."))}</a>' for c in p['gallery_chapters'])+'</nav>'
 page_template=read(Path('pages/morganics-case.html')) if p['slug']=='morganics' else read(Path('pages/editorial-case.html')) if p.get('gallery_chapters') else template
 if p['slug'] in ('ai-animation','community-campaign'):
  page_template=page_template.replace('{{top_carousel}}','').replace('{{media}}','').replace('<header class="case-header">','{{top_carousel}}{{media}}<header class="case-header">')
 nxt=projects[(i+1)%len(projects)];values['next_slug']=nxt['slug'];values['next_title']=esc(nxt['title'])
 consultation_cta='<section class="case-enquiry" aria-label="Discuss a similar project"><span class="eyebrow">YOUR NEXT CHAPTER</span><h2>Have a project in mind?</h2><p>Share what you’re building. Let’s find a clear direction together.</p><a class="case-enquiry-primary" href="/?enquiry=1" data-lead-form>Talk through my project ↗</a><a href="/archive/">Explore more work →</a></section>'
 page_template=page_template.replace('<section class="next-case">',consultation_cta+'<section class="next-case">')
 target=DIST/p['slug'];target.mkdir(exist_ok=True);(target/'index.html').write_text(page(p['seo_title'],p['seo_description'],render(page_template,values),'case-page',path='/'+p['slug']+'/',image=p['hero'],creative=p))
shutil.copyfile(SRC/'styles/hero.css',DIST/'hero.css');shutil.copyfile(SRC/'styles/clarity.css',DIST/'clarity.css');shutil.copyfile(SRC/'styles/studio.css',DIST/'studio.css');shutil.copyfile(SRC/'styles/home.css',DIST/'home.css');shutil.copyfile(SRC/'styles/site.css',DIST/'style.css');shutil.copyfile(SRC/'styles/case-study.css',DIST/'case-study.css');shutil.copyfile(SRC/'site.js',DIST/'script.js')
shutil.copytree(SRC/'fonts',DIST/'assets/fonts',dirs_exist_ok=True)
print(f'Built {len(projects)+2} pages with shared templates and Pixelarticons.')

(DIST/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+esc(url)+'</loc></url>' for url in urls)+'</urlset>')
(DIST/'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: '+BASE+'/sitemap.xml\n')

with (DIST/'style.css').open('a') as f:f.write('\n'+(SRC/'styles/command.css').read_text())
