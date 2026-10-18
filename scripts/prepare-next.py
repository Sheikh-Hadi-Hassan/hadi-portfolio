from pathlib import Path
from html.parser import HTMLParser
import json,re,shutil,hashlib,html
r=Path(__file__).resolve().parents[1];pages={}
class Head(HTMLParser):
 def __init__(self):super().__init__();self.meta={};self.canonical=''
 def handle_starttag(self,t,a):
  a=dict(a)
  if t=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content','')
  if t=='link' and a.get('rel')=='canonical':self.canonical=a['href']
for p in (r/'dist').rglob('index.html'):
 t=p.read_text();h=Head();h.feed(t);name='home' if p.parent==r/'dist' else p.parent.name
 pages[name]={'body':re.search(r'<body[^>]*>(.*?)</body>',t,re.S).group(1),'title':html.unescape(re.search(r'<title>(.*?)</title>',t).group(1)),'description':h.meta['description'],'canonical':h.canonical,'image':h.meta['og:image'],'imageWidth':int(h.meta['og:image:width']),'imageHeight':int(h.meta['og:image:height']),'schema':re.search(r'<script type="application/ld\+json">(.*?)</script>',t,re.S).group(1)}
(r/'generated').mkdir(exist_ok=True);(r/'generated/pages.json').write_text(json.dumps(pages,ensure_ascii=False))
for f in ['style.css','hero.css','script.js','sitemap.xml','image-sitemap.xml','robots.txt']:shutil.copyfile(r/'dist'/f,r/'public'/f)
for f in ['bayfi-port.css','bayfi-brand.css']:shutil.copyfile(r/'src/styles'/f,r/'public'/f)
shutil.copytree(r/'dist/assets/fonts',r/'public/assets/fonts',dirs_exist_ok=True)
print('Prepared',len(pages),'Next.js routes.')

asset_paths=["/assets/fonts/fonts.css","/style.css","/hero.css","/bayfi-port.css","/bayfi-brand.css","/script.js"]
asset_versions={path:hashlib.sha256((r/"public"/path.lstrip("/")).read_bytes()).hexdigest()[:12] for path in asset_paths}
(r/"generated/assets.json").write_text(json.dumps(asset_versions))
