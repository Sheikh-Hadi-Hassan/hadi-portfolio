"""Rendered factual positioning and discoverability contracts, not a ranking guarantee."""
from pathlib import Path
import json,hashlib,re,xml.etree.ElementTree as ET
from html.parser import HTMLParser
r=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self,s):super().__init__();self.text=[];self.graph=[];self.ld=False;self.buf='';self.links=[];self.feed(s)
 def handle_starttag(self,t,a):
  a=dict(a)
  if t=='script' and a.get('type')=='application/ld+json':self.ld=True;self.buf=''
  if t=='a':self.links.append(a.get('href'))
 def handle_data(self,s):
  if self.ld:self.buf+=s
  elif s.strip():self.text.append(s.strip())
 def handle_endtag(self,t):
  if t=='script' and self.ld:self.ld=False;self.graph+=json.loads(self.buf)['@graph']
resume=json.loads((r/'src/data/resume-source.json').read_text());assert hashlib.sha256((r/'public'/resume['url'].lstrip('/')).read_bytes()).hexdigest()==resume['sha256']
pages=json.loads((r/'generated/pages.json').read_text());assert len(pages)==22
for key,metadata in pages.items():
 file=r/'out'/('index.html' if key=='home' else key+'/index.html');s=file.read_text();p=Page(s)
 people=[x for x in p.graph if x['@type']=='Person'];assert len(people)==1;person=people[0]
 assert person['jobTitle']=='Creative & Product Design Leader';assert person['@id']=='https://hadi.intellignce.net/#hadi';assert person['address']['addressLocality']=='Lahore'
 assert person['worksFor']=={'@id':'https://hadi.intellignce.net/#intellignce'}
 assert 'Hadi Hasssan' not in person['alternateName']
 assert not any(x['@type'] in ['AggregateRating','Review','FAQPage'] for x in p.graph)
 if key in ['about','resume']:
  node=next(x for x in p.graph if 'ProfilePage' in x['@type']);assert node['mainEntity']=={'@id':person['@id']}
 if key in ['home','about','resume','work','contact']:assert 'design' in ' '.join(p.text).lower()
 if key in [x['slug'] for x in json.loads((r/'src/data/projects.json').read_text())]:
  work=next(x for x in p.graph if x['@type']=='CreativeWork');assert work['creator']=={'@id':person['@id']};assert '/about/' in p.links;assert 'Creative & Product Design Leader' in ' '.join(p.text)
 if key=='resume':assert resume['url'] in p.links
home=Page((r/'out/index.html').read_text());text=' '.join(home.text);assert 'DESIGN LEADER' in text and 'Can I contact Hadi about leadership roles or consulting?' in text
service_list=next(x for x in home.graph if x['@type']=='ItemList' and x.get('name')=='Creative and digital services by Hadi Hassan')
assert len(service_list['itemListElement'])==6
for entry in service_list['itemListElement']:
 assert entry['item']['name'] in text and entry['item']['provider']=={'@id':'https://hadi.intellignce.net/#hadi'}
for unsupported in ['300+','100+','80+','200+','Happy customers']:assert unsupported not in text
for proof in ['10+','Professional roles','Product previews','Case studies']:assert proof in text
assert 'Discuss an opportunity' in text
assert any(h and h.startswith('mailto:hadi@intellignce.net?subject=Leadership') for h in home.links)
contact=Page((r/'out/contact/index.html').read_text());assert any(h and h.startswith('mailto:hadi@intellignce.net?subject=Design%20leadership') for h in contact.links)
robots=(r/'out/robots.txt').read_text();assert 'Disallow: /admin/' in robots and 'Disallow: /api/' in robots and 'Allow: /' in robots
llms=(r/'out/llms.txt').read_text();assert resume['url'] in llms and 'Creative & Product Design Leader' in llms and 'leadership roles and design consulting' in llms
assert (r/'out'/resume['previousURL'].lstrip('/')).read_bytes()==(r/'public'/resume['previousURL'].lstrip('/')).read_bytes(),'Keep previous CV URL valid in the actual export'
knowledge=json.loads((r/'public/intellignce-support/knowledge.json').read_text());assert knowledge==json.loads((r/'integrations/sera-v9-source/intellignce-support/knowledge.json').read_text())
assert any(x['id']=='leadership-consulting' and 'leadership roles and consulting' in x['answer'] for x in knowledge['faqs'])
print('PASS: 22 rendered routes, CV identity and PDF hash, typed profile pages, project authorship, direct answers, truthful counts and crawl/discovery policy. Rankings, rich results and live crawling unverified.')
