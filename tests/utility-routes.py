from pathlib import Path
from html.parser import HTMLParser
import hashlib,json,subprocess
r=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self,text):super().__init__();self.links=[];self.canonical=[];self.ids=[];self.h1=0;self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='a':self.links.append(a.get('href',''))
  if tag=='h1':self.h1+=1
  if 'id' in a:self.ids.append(a['id'])
  if tag=='link' and a.get('rel')=='canonical':self.canonical.append(a['href'])
projects=json.loads((r/'src/data/projects.json').read_text())
for slug in ['about','resume','contact','privacy','work']:
 p=Page((r/'dist'/slug/'index.html').read_text());assert p.h1==1,(slug,p.h1)
 assert p.canonical==['https://hadi.intellignce.net/'+slug+'/'];assert len(p.ids)==len(set(p.ids)),slug
 assert all((r/'dist'/link.lstrip('/').split('?')[0]/'index.html').exists() for link in p.links if link.startswith('/') and not link.startswith('/#') and '.' not in link and '?' not in link)
nav=(r/'src/components/navigation.html').read_text()
assert all('/'+p+'/' in nav for p in ['resume','contact','about','archive'])
pdf=r/'public/assets/hadi-hassan-resume-2026.pdf';assert pdf.read_bytes().startswith(b'%PDF-')
assert hashlib.sha256(pdf.read_bytes()).hexdigest()=='3764361cf236d7cb9424ca8fe40ddfc182f9a64a429d4db8be08f6ea031b7304'
assert all((r/'dist'/p['slug']/'index.html').exists() for p in projects)
# Preserve the existing hero inputs; no substitute approved lock is generated.
for f in ['src/pages/home.html','src/styles/hero.css','src/styles/site.css']:
 assert (r/f).read_bytes()==subprocess.check_output(['git','show','HEAD:'+f],cwd=r),f
print('PASS: five utility routes, unique headings/IDs, self canonicals, menu links, all project routes, original PDF identity, unchanged hero inputs. Source-template checks only; production export remains gated.')
