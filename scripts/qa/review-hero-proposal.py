"""Read-only proposal comparison. Does not create a lock or grant approval."""
from pathlib import Path
import hashlib,json,sys
r=Path(__file__).resolve().parents[2]
p=json.loads((r/'docs/hero-baseline-PROPOSED-NOT-APPROVED.json').read_text())
home=(r/'src/pages/home.html').read_text();hero=home[home.index('<section class="portfolio-hero"'):home.index('<div class="bayfi-body"')]
a={'hero_html':hashlib.sha256(hero.encode()).hexdigest(),'hero_css':hashlib.sha256((r/'src/styles/hero.css').read_bytes()).hexdigest(),'shared_css':hashlib.sha256((r/'src/styles/site.css').read_bytes()).hexdigest()}
match=a==p['proposal']
print(json.dumps({'schemaVersion':1,'status':'PROPOSAL_MATCH_NOT_APPROVAL' if match else 'PROPOSAL_SOURCE_MISMATCH','hashes':a,'proposal_active':p['active'],'approval_observed':False,'lock_present':(r/'design/hero-lock.json').exists()},indent=2))
sys.exit(0 if match and p['active'] is False else 1)
