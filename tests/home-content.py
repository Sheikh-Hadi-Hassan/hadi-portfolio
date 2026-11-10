from pathlib import Path
from html.parser import HTMLParser
import hashlib,json,re
r=Path(__file__).resolve().parents[1];s=(r/'src/pages/home.html').read_text()
class Sections(HTMLParser):
 def __init__(self,text):super().__init__();self.sections=[];self.headings=[];self.links=[];self.ids=[];self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='section':self.sections.append(a.get('id',a.get('class')))
  if tag=='a':self.links.append(a.get('href'))
  if 'id' in a:self.ids.append(a['id'])
p=Sections(s);assert p.sections[:3]==['portfolio-hero','bf-reel','services'];assert p.sections.index('services')<p.sections.index('work');assert p.sections[p.sections.index('work')+1]=='products';assert len(p.ids)==len(set(p.ids));assert 'How I work.' in s and 'How we work.' not in s
products=json.loads((r/'src/data/digital-products.json').read_text());assert len(products['products'])==4
for item in products['products']:assert item['url'] in p.links and item['title'] in s and item['stage'] in s
tms=next(item for item in products['products'] if item['id']=='tms');assert tms['url']=='https://tms-theta-eight.vercel.app/login';assert tms['stage']=='MVP stage. Dashboard preview.';assert 'Owner-provided' in tms['source'];assert 'https://tms-theta-eight.vercel.app/dashboard' not in s
assert products['linkVerification'].startswith('BLOCKED');assert 'production ready' not in s.lower()
proposal=json.loads((r/'design/hero-lock.json').read_text());hero=s[s.index('<section class="portfolio-hero"'):s.index('<div class="bayfi-body"')];assert hashlib.sha256(hero.encode()).hexdigest()==proposal['hero_html']
for key,path in [('hero_css','src/styles/hero.css'),('shared_css','src/styles/site.css')]:assert hashlib.sha256((r/path).read_bytes()).hexdigest()==proposal[key]
about=(r/'src/pages/about.html').read_text();assert about.count('<h1>')==1
for id in ['about-story','about-capabilities','about-experience','about-products','about-education']:assert 'id="'+id+'"' in about
assert all(x in about for x in ['INTELLIGNCE','The Creative OAK','Tecnomics','The Landing Page Guy','/resume/','/contact/','/#products'])
board=s[s.index('<section class="creative-process"'):];board=board[:board.index('</section>')];assert board.count('class="process-note ')==4;assert all(x in board for x in ['>Discover<','>Define<','>Create<','>Deliver<','I understand the real business problem, audience, and opportunity.','I translate insights into strategy and creative direction.','I explore, design, prototype, and refine.','I validate quality, prepare implementation, and support launch.']);assert 'We ' not in board;experience=(r/'src/app/home-experience.jsx').read_text();assert 'ProcessWebGL' not in experience and 'ProcessMotion' not in experience
if (r/'design/hero-lock.json').exists():assert json.loads((r/'design/hero-lock.json').read_text())==proposal
# Matching hashes do not grant owner approval.
print('PASS: actual source section order, four CV-backed product links/stages (availability unverified), owner-approved four-stage first-person baseline and existing detailed copy adapted, About structure and protected hero hashes. Source contracts only.')
