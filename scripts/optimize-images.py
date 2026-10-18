#!/usr/bin/env python3
"""Optimize display images without changing originals; describe discoverable artwork."""
from pathlib import Path
import os
from html.parser import HTMLParser
from PIL import Image, ImageOps
import hashlib,re,html,json,mimetypes
ROOT=Path(__file__).resolve().parents[1];PUBLIC=ROOT/'public';output=PUBLIC/'assets/responsive';output.mkdir(exist_ok=True)
BASE=os.environ.get('SITE_URL','https://hadi-hassan-editorial.lemony-morel-0696.chatgpt.site').rstrip('/')
cache={};saved=0;image_urls=[]
VOID={'img','meta','link','input','br','hr','source','area','base','embed','param','track','wbr'}
class Images(HTMLParser):
 def __init__(self,text):
  super().__init__(convert_charrefs=False);self.stack=[];self.images={};self.lines=[0]
  for m in re.finditer('\n',text):self.lines.append(m.end())
  self.feed(text)
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if t=='img':
   line,col=self.getpos();self.images[self.lines[line-1]+col]=(a,' '.join(x[1] for x in self.stack))
  if t not in VOID:self.stack.append((t,a.get('class','')+(' decorative' if a.get('aria-hidden')=='true' else '')))
 def handle_endtag(self,t):
  for i in range(len(self.stack)-1,-1,-1):
   if self.stack[i][0]==t:del self.stack[i:];break
 def handle_startendtag(self,t,a):self.handle_starttag(t,a)
def variants_for(src):
 global saved
 if src in cache:return cache[src]
 f=PUBLIC/src.lstrip('/');cache[src]=None
 if not f.is_file() or f.suffix.lower()=='.svg':return None
 with Image.open(f) as im:
  if getattr(im,'is_animated',False):return None
  im=ImageOps.exif_transpose(im);w,h=im.size
  if w<400 or f.stat().st_size<40000:return None
  digest=hashlib.sha256(f.read_bytes()).hexdigest()[:12];variants=[]
  for target in sorted(set([x for x in [160,480,800,1280] if x<w]+([w] if w<=1280 or src in ['/assets/hero-subject-enhanced.png','/assets/hero-stage.webp'] else []))):
   dest=output/f'{digest}-q90-{target}.webp'
   if not dest.exists():
    preview=im.resize((target,max(1,round(h*target/w))),Image.Resampling.LANCZOS);preview.save(dest,'WEBP',quality=90,method=6)
   if dest.stat().st_size<f.stat().st_size:variants.append(('/assets/responsive/'+dest.name,target))
  if variants:saved+=max(0,f.stat().st_size-(PUBLIC/variants[-1][0].lstrip('/')).stat().st_size)
  cache[src]=(variants,w,h)
 return cache[src]
def display_size(context):
 if 'folder-art' in context:return '(max-width: 600px) 90vw, (max-width: 900px) 44vw, 400px'
 if 'project-thumb' in context:return '58px'
 if 'morganics-grid-cover' in context:return '(max-width: 450px) 90vw, 404px'
 if 'morganics-grid-campaign' in context:return '(max-width: 650px) 44vw, (max-width: 1000px) 29vw, 22vw'
 if 'morganics-grid-packaging' in context:return '(max-width: 1000px) 44vw, 29vw'
 if any(x in context for x in ['morganics-grid-guidelines','morganics-grid-applications']):return '(max-width: 650px) 90vw, 44vw'
 if 'archive-media' in context:return '(max-width: 650px) 90vw, 44vw'
 if 'digital-collection-image' in context:return '(max-width: 760px) 90vw, 44vw'
 if 'ai-story-carousel' in context:return '(max-width: 600px) 84vw, (max-width: 1250px) 48vw, 600px'
 if 'social-post' in context:return '(max-width: 650px) 78vw, 360px'
 return '100vw'
for page in sorted((ROOT/'dist').rglob('index.html')):
 text=page.read_text();parser=Images(text);records=[]
 def replace(match):
  tag=match.group();a,context=parser.images[match.start()];src=a.get('src','')
  if not src.startswith('/assets/'):return tag
  f=PUBLIC/src.lstrip('/')
  if not f.is_file() or f.suffix.lower()=='.svg':return tag
  with Image.open(f) as im:w,h=im.size;fmt=Image.MIME.get(im.format,mimetypes.guess_type(src)[0])
  if 'decoding' not in a:tag=tag[:-1]+' decoding="async">'
  if 'width' not in a:tag=tag[:-1]+f' width="{w}" height="{h}">'
  data=variants_for(src);thumb=src
  if data and data[0] and 'srcset' not in a:
   variants,native,_=data;fallback=next((v for v in reversed(variants) if v[1]<=1280),variants[0]);thumb=fallback[0]
   candidates=variants+([(src,native)] if variants[-1][1]<native else [])
   tag=tag.replace('src="'+src+'"','src="'+thumb+'"',1)
   tag=tag[:-1]+' srcset="'+html.escape(', '.join(f'{url} {width}w' for url,width in candidates),quote=True)+'" sizes="'+display_size(context)+'">'
  alt=a.get('alt','').strip()
  if alt and 'decorative' not in context and w>=320:
   records.append({'@type':'ImageObject','@id':BASE+src+'#image','contentUrl':BASE+src,'url':BASE+src,'thumbnailUrl':BASE+thumb,'name':alt,'caption':alt,'width':w,'height':h,'encodingFormat':fmt,'creator':{'@id':BASE+'/#hadi'}})
  return tag
 text=re.sub(r'<img\b[^>]*>',replace,text)
 canonical=html.unescape(re.search(r'<link rel="canonical" href="([^"]+)"',text).group(1))
 unique={x['contentUrl']:x for x in records}
 def enrich(m):
  schema=json.loads(m.group(1));graph=schema['@graph'];graph.extend(unique.values())
  for node in graph:
   if node.get('@type')=='CreativeWork':node['image']=[{'@id':x['@id']} for x in unique.values()]
  return '<script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False).replace('</',r'<\/')+'</script>'
 text=re.sub(r'<script type="application/ld\+json">(.*?)</script>',enrich,text,flags=re.S)
 # Social preview metadata describes the original representative image.
 social=html.unescape(re.search(r'<meta property="og:image" content="([^"]+)"',text).group(1))
 local=PUBLIC/social.removeprefix(BASE).lstrip('/')
 with Image.open(local) as im:sw,sh=im.size;mime=Image.MIME[im.format]
 text=text.replace('</head>',f'<meta property="og:image:width" content="{sw}"><meta property="og:image:height" content="{sh}"><meta property="og:image:type" content="{mime}"></head>')
 page.write_text(text);image_urls.append((canonical,list(unique)))
xml='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
for url,images in image_urls:
 if images:xml+='<url><loc>'+html.escape(url)+'</loc>'+''.join('<image:image><image:loc>'+html.escape(src)+'</image:loc></image:image>' for src in images)+'</url>'
(ROOT/'dist/image-sitemap.xml').write_text(xml+'</urlset>')
robots=ROOT/'dist/robots.txt';robots.write_text(robots.read_text()+'Sitemap: '+BASE+'/image-sitemap.xml\n')
print(f'Responsive images: {sum(bool(x and x[0]) for x in cache.values())} originals; {saved/1024/1024:.1f} MB saved at the largest generated display size. Image metadata and sitemap added. Originals preserved.')
