"""Evidence consistency, not semantic certification of requirements or production."""
from pathlib import Path
from collections import Counter
import hashlib,json,re
r=Path(__file__).resolve().parents[1];j=json.loads((r/'docs/atomic-requirements.json').read_text());rows=j['requirements'];pv=[x for x in rows if x['scope']=='PV'];assert len(pv)==243 and len(rows)==476
counts=dict(Counter(x['status'] for x in pv));counts.setdefault('Missing',0);assert counts==j['counts'];assert sum(counts.values())==243
assert counts=={'Implemented and verified':27,'Partially implemented':185,'Missing':0,'Blocked by external dependency':31}
assert all(x['production_acceptance']=='UNVERIFIED' for x in pv)
assert not [x for x in pv if x['status']=='Missing'];assert all(x['status']=='Partially implemented' for x in pv if x['id'] in {'PV-474D07E1','PV-15E525B9'})
assert len({x['id'] for x in rows})==476 and all(x['status']=='Future scope' for x in rows if x['scope']!='PV')
for x in pv:
 assert all(x.get(k) for k in ['component','acceptance','evidence','action','reference','priority'])
 assert x['id'] in (r/'PORTFOLIO-REQUIREMENTS-MATRIX.md').read_text()
assert j['verified_percentage']==round(27/243*100,2)==11.11
assert j['reconciliation']['implementation_completion_percentage'] is None
for name in ['docs/admin/ADMIN-IMPLEMENTATION-STATE.md','docs/sera/SERA-IMPLEMENTATION-STATE.md']:
 data=json.loads(re.search(r'```json\n(.*?)\n```',(r/name).read_text(),re.S)[1]);assert data['v1_acceptance']['verified']==27 and data['v1_acceptance']['release']=='NO-GO'
spec=json.loads((r/'docs/v1/BOOKING-CANDIDATE.json').read_text());old=json.loads((r/'docs/booking-release/CANDIDATE.json').read_text());assert spec['sourceCommit']=='32a6e44adb71e5750a799e708717ca3c5268ec81' and old['sourceCommit']=='1d4ea2a51a01502feab50bb2ea5a358173aa6f67'
assert spec['deploymentAuthorized'] is False and spec['releaseDecision']=='NO-GO'
for row in spec['files'].values():assert hashlib.sha256((r/row['source']).read_bytes()).hexdigest()==row['sha256']
assert json.loads((r/'docs/hero-baseline-PROPOSED-NOT-APPROVED.json').read_text())['active'] is False
print('PASS:243 evidence/status rows, preserved476 IDs/233 future,27 local criteria, separate unverified production, preserved partially accepted lifecycle IDs, state counts and current/historical booking manifest integrity. Structural consistency only.')

candidates=json.loads((r/'docs/v1/PROVIDER-CANDIDATES.json').read_text());assert candidates['scope']=='REVIEW_ONLY_NOT_RUNTIME_REGISTRY' and candidates['paidInferenceBudgetUSD']==0 and candidates['credentialWrites'] is False and candidates['liveTestsAuthorized'] is False
assert {c['provider'] for c in candidates['candidates']}=={'gemini','groq','openrouter'}
for c in candidates['candidates']:
 assert c['enabled'] is False and c['free_verified'] is False and c['unbilled_confirmed'] is False and c['privacy_approved'] is False and c['paid'] is False and c['remaining']==0 and c['accountEligibility']=='UNVERIFIED'
print('PASS: three review-only provider candidates remain disabled, account/privacy unverified and zero-dollar policy unchanged.')
