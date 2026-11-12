"""Remove unused export assets only; preserve repository source originals."""
from pathlib import Path
import json
r=Path(__file__).resolve().parents[1]/'out'
text='\n'.join(p.read_text(errors='ignore') for p in r.rglob('*') if p.is_file() and p.suffix in ['.html','.js','.css','.json','.txt','.xml'])
# Keep stable CV download URLs even when the current page links to a newer revision.
resume=Path(__file__).resolve().parents[1]/'src/data/resume-source.json'
retained=set()
if resume.exists():
 metadata=json.loads(resume.read_text())
 retained={url.lstrip('/') for key in ['url','previousURL'] if (url:=metadata.get(key,'')) and url.startswith('/assets/')}
saved=0;count=0
for p in (r/'assets').rglob('*'):
 if not p.is_file():continue
 key=p.relative_to(r).as_posix()
 if key in retained or key in text or '/fonts/' in key:continue
 saved+=p.stat().st_size;count+=1;p.unlink()
print(f'Export removed {count} unused asset files ({saved/1048576:.1f} MB). Source originals retained.')
