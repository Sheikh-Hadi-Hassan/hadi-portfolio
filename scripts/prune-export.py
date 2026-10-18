"""Remove unused export assets only; preserve repository source originals."""
from pathlib import Path
r=Path(__file__).resolve().parents[1]/'out'
text='\n'.join(p.read_text(errors='ignore') for p in r.rglob('*') if p.is_file() and p.suffix in ['.html','.js','.css','.json','.txt','.xml'])
saved=0;count=0
for p in (r/'assets').rglob('*'):
 if not p.is_file():continue
 key=p.relative_to(r).as_posix()
 if key in text or '/fonts/' in key:continue
 saved+=p.stat().st_size;count+=1;p.unlink()
print(f'Export removed {count} unused asset files ({saved/1048576:.1f} MB). Source originals retained.')
