import pathlib,json,hashlib,csv,zipfile,re,collections
R=pathlib.Path('/workspace/scratch/9870f80c5674'); S=R/'remediation/source'; B=R/'v00-baseline/production'; E=R/'v00-evidence'
Z=zipfile.ZipFile('/workspace/scratch/aca0a1feb4f2/Hadi-Portfolio-v104-Hostinger-Release-Candidate.zip')
def sha(b):return hashlib.sha256(b).hexdigest()
old=json.loads((R/'remediation/source-parity.json').read_text())['files']; rows=[]
for x in old:
 if x['status']=='MATCH':continue
 p=x['path']; prod=(B/p).read_bytes(); candidates=[]
 for prefix in ['public','integrations/hostinger-runtime','src/styles','dist','']:
  q=S/prefix/p
  if q.is_file():candidates.append({'path':q.relative_to(S).as_posix(),'sha256':sha(q.read_bytes()),'exact':q.read_bytes()==prod})
 try:zb=Z.read(p);zh=sha(zb)
 except KeyError:zb=None;zh=None
 generated=('__next.' in p or p.endswith('/index.txt') or p=='index.txt' or p.startswith('_next/') or p in ['404.html','404/index.html','_not-found/index.html','studio-preview/index.html'])
 category='generated output' if generated or p.endswith('.html') or p in ['sitemap.xml','image-sitemap.xml','robots.txt'] else 'assets' if p.startswith(('assets/','licenses/')) or p.endswith(('LICENSE.txt','NOTICES.txt')) else 'hosting configuration' if p.endswith('.htaccess') or '.example.php' in p else 'deployment-only additions' if p in ['RELEASE-STATUS.md','RELEASE-MANIFEST.json','intellignce-support/ask(1).php'] else 'application code'
 semantic='';origin='';confidence='high';need=''
 if x['status']=='DIFFERENT':
  if p.endswith('.html'):
   a=(S/'dist'/p).read_text();t=prod.decode();get=lambda k,v:re.search(k,v,re.S).group(1) if re.search(k,v,re.S) else ''
   semantic='Retained template HTML becomes Next export: framework wrapper/chunks, metadata, hydration payload and main-content anchor; canonical '+get(r'rel="canonical" href="([^"]+)"',a)+' -> '+get(r'rel="canonical" href="([^"]+)"',t)+'.'
   if p=='index.html':semantic+=' Compared with release ZIP, only Enquire anchor removals in HTML/Flight and adjusted Flight byte length remain.'
   origin='Next static export with production SITE_URL; '+('release ZIP exact' if zh==sha(prod) else 'post-package homepage patch; authoring record unavailable')
   need='Exact dependency cache and build toolchain to reproduce Next output.'+(' Homepage patch command/revision and authorization record.' if p=='index.html' else '')
  elif p=='style.css':
   assert prod==(S/'src/styles/site.css').read_bytes()+b'\n'+(B/'appbar.css').read_bytes()
   semantic='Exactly original src/styles/site.css + newline + complete production appbar.css; labelled responsive dock and hidden Enquire control.';origin='Post-build additive navigation CSS patch';need='Original patch file/revision and application command; derived comparison is not recovered authoring provenance.'
  else:
   a=(S/'dist'/p).read_text();t=prod.decode();assert a.replace('https://hadi-hassan-editorial.lemony-morel-0696.chatgpt.site','https://hadi.intellignce.net')==t
   semantic='Only origin substituted from original Sites URL to production; fresh pre-export build exactly matches.';origin='SITE_URL input to scripts/build.py / optimize-images.py';need='None for this difference; full export still blocked.'
 else:
  if generated:semantic='Next export route, React/Flight navigation payload, framework chunk, stylesheet or build manifest; intentionally absent from pre-Next dist.';origin='next build --webpack / static export; '+('preserved release ZIP exact' if zh==sha(prod) else 'release provenance unresolved');need='Exact locked dependencies/toolchain and successful full export.'
  elif p=='appbar.css':semantic='Standalone responsive navigation stylesheet; exact appended suffix of production style.css, dynamically injected by patched widget.';origin='Deployment navigation patch, not found at matching source path';confidence='medium';need='Original post-build patch/revision and date.'
  elif p=='intellignce-support/ask(1).php':
   assert prod==(S/'integrations/hostinger-runtime/intellignce-support/ask.php').read_bytes()
   semantic='Renamed duplicate of original older ask.php, exact hash; differs from active production ask.php.';origin='Likely manual retained server copy; authoring intent unknown';confidence='medium';need='File Manager change/rename record; confirm whether referenced, without executing it.'
  elif 'widget' in p and p.endswith('.js'):
   semantic='All seven production widget aliases have identical SHA-256 942a768afe2309a2dd3cf11fe939fdf3ad4622b499e5cd8f429ae5d911058b0f; viewport/header sizing, AI opt-in, appbar/Home/WhatsApp compatibility changes.';origin='Post-package support-widget patch; aliases retained';confidence='medium';need='Original patch/revision for each changed widget; aliases must not be assumed identical.'
  elif p=='intellignce-support/ask.php':semantic='Production adds READY GET, ai-config loader, schema/context/history handling, redaction, shared per-attempt budgets and bounded model fallback; recovered source is older gateway.';origin='Post-package AI gateway patch';confidence='medium';need='Original updated gateway source/revision and patch history.'
  elif p.startswith('RELEASE-'):semantic='Release candidate documentation/manifest, not editable application or runtime data; manifest is stale for later patches.';origin='Preserved release ZIP exact';need='Packaging provenance tying modified candidate bundle to deployed ZIP.'
  elif p.startswith('assets/.'):semantic='Opaque hidden asset synchronization temporary; exact preserved ZIP bytes, no inference of authoring necessity.';origin='Likely synchronization residue';confidence='medium';need='Optional transfer ledger for temp-file origin; not a source-parity blocker by itself.'
  else:
   exact=[c['path'] for c in candidates if c['exact']]
   semantic='Absent only from pre-export dist; '+('exact source bytes located at '+', '.join(exact) if exact else 'preserved package bytes located')+'.'
   origin='Runtime copy/packaging step' if p.startswith(('api/','intellignce-support/')) else 'Static source asset/hosting copy step'
   need='Hostinger packaging recipe; no missing editable bytes at this path.'
 rows.append({'path':p,'prior_status':x['status'],'category':category,'production_sha256':sha(prod),'retained_dist_sha256':x['candidate'],'release_zip_sha256':zh,'release_zip_status':'EXACT' if zh==sha(prod) else 'DIFFERENT' if zh else 'ABSENT','source_candidates':candidates,'semantic_difference':semantic,'likely_origin':origin,'confidence':confidence,'evidence_needed':need})
assert len(rows)==164 and sum(x['prior_status']=='DIFFERENT' for x in rows)==21
(E/'PATH_CLASSIFICATION.json').write_text(json.dumps(rows,indent=2))
fields=[k for k in rows[0] if k!='source_candidates']+['source_candidates']
with (E/'PATH_CLASSIFICATION.csv').open('w') as f:
 w=csv.DictWriter(f,fieldnames=fields);w.writeheader()
 for x in rows:w.writerow({**x,'source_candidates':json.dumps(x['source_candidates'])})
print('absent categories',collections.Counter(x['category'] for x in rows if x['prior_status']=='MISSING'))
print('different categories',collections.Counter(x['category'] for x in rows if x['prior_status']=='DIFFERENT'))
