import json
from pathlib import Path
r=Path(__file__).resolve().parents[1]
j=json.loads((r/'docs/atomic-requirements.json').read_text());rows=j['requirements']
assert len(rows)==len({x['id'] for x in rows})
assert len(rows)==len({(x['scope'],x['requirement'].casefold()) for x in rows})
states={'Implemented and verified','Implemented but unverified','Partially implemented','Missing','Blocked by external dependency','Future scope'}
for x in rows:
 assert x['status'] in states and all(x[k] for k in ['reference','component','evidence','action','acceptance','priority'])
 if x['scope']!='PV':assert x['status']=='Future scope'
 if x['status']=='Implemented and verified':
  for name in ['booking-status.mjs','booking-client-contract.cjs','booking-recovery.mjs']:
   if name in x['evidence']:assert (r/'tests'/name).is_file()
a=[x for x in rows if x['scope']=='PV'];v=[x for x in a if x['status']=='Implemented and verified']
assert len(a)==j['portfolio_total'] and len(v)==j['portfolio_verified']
assert round(len(v)/len(a)*100,2)==j['verified_percentage']
assert len(rows)==j['all_scope_total']
assert f"{len(v)}/{len(a)}" in (r/'PORTFOLIO-REQUIREMENTS-MATRIX.md').read_text()
print(f'PASS: {len(rows)} unique IDs/obligations; {len(a)} portfolio, {len(rows)-len(a)} future; {len(v)}/{len(a)}={j["verified_percentage"]}% locally verified. Structural/count validation, not independent semantic certification.')
