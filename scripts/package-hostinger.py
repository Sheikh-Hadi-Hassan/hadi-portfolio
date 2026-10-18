"""Package a build already generated with SITE_URL=https://hadi.intellignce.net.
Do not modify generated HTML, Flight streams or JS: serialized text is length-prefixed.
Usage: SITE_URL=https://hadi.intellignce.net npm run build
       python3 scripts/package-hostinger.py /absolute/path/website.zip
"""
from pathlib import Path
import json,sys,zipfile,subprocess
root=Path(__file__).resolve().parents[1];out=root/'out';target=Path(sys.argv[1])
assert target.is_absolute()
assert 'https://hadi.intellignce.net/' in (out/'sitemap.xml').read_text(),'Build with SITE_URL=https://hadi.intellignce.net first.'
subprocess.run([sys.executable,str(root/'tests/export-hydration.py'),str(out)],check=True)
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(out.rglob('*')):
  if p.is_file():z.write(p,p.relative_to(out))
with zipfile.ZipFile(target) as z:
 assert z.testzip() is None
 assert 'index.html' in z.namelist() and any(n.startswith('_next/static/') for n in z.namelist())
print('Verified Hostinger ZIP:',target,target.stat().st_size,'bytes')
