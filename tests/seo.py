"""Validate published HTML, metadata consistency and discoverable route coverage."""
from pathlib import Path
from html.parser import HTMLParser
import json,xml.etree.ElementTree as ET
from urllib.parse import urlsplit
root=Path(__file__).resolve().parents[1]
class Document(HTMLParser):
 def __init__(self):
  super().__init__();self.meta={};self.canonicals=[];self.h1=0;self.title='';self.in_title=False;self.in_schema=False;self.schema=[];self.buf='';self.images=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='meta':self.meta[a.get('name',a.get('property'))]=a.get('content')
  if tag=='link' and a.get('rel')=='canonical':self.canonicals.append(a['href'])
  if tag=='h1':self.h1+=1
  if tag=='title':self.in_title=True
  if tag=='script' and a.get('type')=='application/ld+json':self.in_schema=True;self.buf=''
  if tag=='img':self.images.append(a)
 def handle_data(self,d):
  if self.in_title:self.title+=d
  if self.in_schema:self.buf+=d
 def handle_endtag(self,tag):
  if tag=='title':self.in_title=False
  if tag=='script' and self.in_schema:self.schema.append(json.loads(self.buf));self.in_schema=False
pages=json.loads((root/'generated/pages.json').read_text());titles=set();descriptions=set();urls=set()
for slug,page in pages.items():
 path=root/'out'/('index.html' if slug=='home' else slug+'/index.html')
 doc=Document();doc.feed(path.read_text())
 assert doc.h1==1,(slug,'expected one h1',doc.h1)
 assert doc.title==page['title'] and 'Hadi Hassan' in doc.title,(slug,doc.title)
 assert doc.title not in titles,(slug,'duplicate title');titles.add(doc.title)
 assert doc.meta['description']==page['description'] and doc.meta['description'] not in descriptions,slug
 descriptions.add(doc.meta['description'])
 assert doc.canonicals==[page['canonical']],(slug,doc.canonicals)
 assert doc.meta['og:url']==page['canonical'] and doc.meta['og:title']==doc.title,slug
 assert doc.meta.get('robots','').lower().find('noindex')<0,slug
 urls.add(page['canonical'])
 graph=doc.schema[0]['@graph'];assert any(x['@type']=='Person' and x['name']=='Hadi Hassan' for x in graph),slug
 assert any(x['@type']=='WebPage' and x['url']==page['canonical'] for x in graph),slug
 if slug!='home':assert any(x['@type']=='BreadcrumbList' for x in graph),slug
 for img in doc.images:
  assert 'alt' in img,(slug,'missing alt')
 image=urlsplit(page['image']).path;assert (root/'public'/image.lstrip('/')).exists(),(slug,'social image missing')
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
sitemap={x.text for x in ET.parse(root/'out/sitemap.xml').findall('.//s:loc',ns)}
assert sitemap==urls,(sitemap,urls)
assert 'sitemap.xml' in (root/'out/robots.txt').read_text()
print(f'SEO checks passed: {len(pages)} routes, unique metadata, canonical URLs, headings, JSON-LD, image alt attributes and sitemap coverage.')
