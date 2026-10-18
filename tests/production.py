"""Audit exported routes, assets and image-viewer originals before publication."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
from collections import Counter
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'out'
class Audit(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.assets=[];self.links=[];self.originals=[];self.responsive=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.append(a['id'])
  if tag in ['img','script'] and a.get('src'):self.assets.append(a['src'])
  if tag=='link' and a.get('href') and a.get('rel') in ['stylesheet','icon','preload']:self.assets.append(a['href'])
  if tag=='a' and a.get('href'):self.links.append(a['href'])
  if a.get('data-full'):self.originals.append(a['data-full'])
  if a.get('srcset'):
   self.responsive+=1;self.assets.extend(part.strip().split(' ')[0] for part in a['srcset'].split(','))
previews=0;routes=list(OUT.rglob('index.html'));assert routes
for page in routes:
 a=Audit();a.feed(page.read_text());assert not [k for k,n in Counter(a.ids).items() if n>1],page
 for asset in a.assets+a.originals:
  parsed=urlsplit(asset)
  if parsed.scheme or parsed.netloc:continue
  path=unquote(parsed.path)
  if path.startswith('/'):assert (OUT/path.lstrip('/')).is_file(),(page,asset)
 for href in a.links:
  if href.startswith('/') and not href.startswith('//'):
   path=unquote(urlsplit(href).path);target=OUT/path.lstrip('/')
   assert target.is_file() or (target/'index.html').is_file(),(page,href)
 previews+=a.responsive
assert (OUT/'404.html').is_file(),'Missing exported 404'
assert previews>0,'No responsive previews exported'
print(f'Production audit passed: {len(routes)} routes, all local assets/links, unique IDs, original zoom images, {previews} responsive image elements and exported 404.')
