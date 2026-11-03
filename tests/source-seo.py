"""Source-template metadata contract; does not build/accept the gated Next export."""
from pathlib import Path
from html.parser import HTMLParser
import json,xml.etree.ElementTree as ET
r=Path(__file__).resolve().parents[1];origin='https://hadi.intellignce.net'
class Page(HTMLParser):
 def __init__(self,t):super().__init__();self.meta={};self.canon=[];self.title='';self.in_title=False;self.schema=[];self.in_schema=False;self.buf='';self.feed(t)
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if t=='meta':self.meta[a.get('name',a.get('property'))]=a.get('content')
  if t=='link' and a.get('rel')=='canonical':self.canon.append(a['href'])
  if t=='title':self.in_title=True
  if t=='script' and a.get('type')=='application/ld+json':self.in_schema=True;self.buf=''
 def handle_data(self,d):
  if self.in_title:self.title+=d
  if self.in_schema:self.buf+=d
 def handle_endtag(self,t):
  if t=='title':self.in_title=False
  if t=='script' and self.in_schema:self.schema.append(json.loads(self.buf));self.in_schema=False
pages=list((r/'dist').rglob('index.html'));assert len(pages)==22
urls=set();titles=set();descriptions=set()
for f in pages:
 path='/' if f.parent==r/'dist' else '/'+f.parent.name+'/'
 p=Page(f.read_text());url=origin+path;assert p.canon==[url];assert p.meta['og:url']==url
 assert p.title not in titles;assert p.meta['description'] not in descriptions;titles.add(p.title);descriptions.add(p.meta['description']);urls.add(url)
 assert p.schema and all('chatgpt.site' not in json.dumps(x) for x in p.schema)
 for graph in p.schema:
  for node in graph['@graph']:
   if '@id' in node:assert node['@id'].startswith(origin+'/')
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'};actual={x.text for x in ET.parse(r/'dist/sitemap.xml').findall('.//s:loc',ns)};assert actual==urls
assert 'Sitemap: '+origin+'/sitemap.xml' in (r/'dist/robots.txt').read_text()
print('PASS: 22 source-template self canonicals, unique titles/descriptions, production OG URLs, structured entity IDs, sitemap coverage and robots directive. Current Next export/live crawler behavior unverified.')
