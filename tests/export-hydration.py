"""Verify Next Flight text-record byte lengths. Never replace URLs after Next build."""
from pathlib import Path
import re,json,sys
root=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).resolve().parents[1]/'out'
count=0
for p in root.rglob('*.html'):
 s=p.read_text();parts=[]
 for m in re.finditer(r'self\.__next_f\.push\((\[1,.*?\])\)</script>',s,re.S):parts.append(json.loads(m[1])[1])
 flight=''.join(parts).encode()
 for m in re.finditer(rb'(?:^|\n)([0-9a-f]+):T([0-9a-f]+),',flight):
  end=m.end()+int(m[2],16)
  assert end<=len(flight),(str(p),'truncated Flight text record',m[1])
  assert end==len(flight) or re.match(rb'[0-9a-f]+:',flight[end:]),(str(p),'corrupted Flight byte length',m[1],flight[end:end+40])
  count+=1
print('Hydration export audit passed:',count,'Flight text records across all HTML pages.')
