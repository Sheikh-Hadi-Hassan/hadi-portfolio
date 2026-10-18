"""Image delivery and metadata contracts against the production export."""
from pathlib import Path
from html.parser import HTMLParser
import json,xml.etree.ElementTree as ET
from urllib.parse import urlsplit
from PIL import Image
r=Path(__file__).resolve().parents[1]
class Doc(HTMLParser):
 def __init__(self):super().__init__();self.images=[];self.json=False;self.buf='';self.schemas=[]
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if t=='img':self.images.append(a)
  if t=='script' and a.get('type')=='application/ld+json':self.json=True;self.buf=''
 def handle_data(self,s):
  if self.json:self.buf+=s
 def handle_endtag(self,t):
  if t=='script' and self.json:self.schemas.append(json.loads(self.buf));self.json=False
count=0;objects=0
for name in json.loads((r/'generated/pages.json').read_text()):
 p=r/'out'/('index.html' if name=='home' else name+'/index.html');d=Doc();d.feed(p.read_text())
 for a in d.images:
  assert 'alt' in a,(name,'missing alt')
  if 'srcset' not in a:continue
  count+=1;assert a.get('sizes'),(name,'missing sizes')
  for candidate in a['srcset'].split(','):
   src,width=candidate.strip().split();w=int(width[:-1]);f=r/'out'/src.lstrip('/')
   assert f.is_file(),src
   with Image.open(f) as im:assert im.width==w,(src,w,im.width)
 for schema in d.schemas:
  for node in schema['@graph']:
   if node['@type']!='ImageObject':continue
   objects+=1;assert node['caption'] and node['width'] and node['height'] and node['encodingFormat']
   src=urlsplit(node['contentUrl']).path;assert (r/'out'/src.lstrip('/')).is_file(),src
assert count>109 and objects>300,(count,objects)
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9','i':'http://www.google.com/schemas/sitemap-image/1.1'}
entries=ET.parse(r/'out/image-sitemap.xml').findall('.//i:loc',ns);assert len(entries)>300
print(f'Image checks passed: {count} responsive image elements, {objects} ImageObject records and {len(entries)} sitemap image entries.')
