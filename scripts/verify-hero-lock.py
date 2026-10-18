from pathlib import Path
import json,hashlib
r=Path(__file__).resolve().parents[1];lock=json.loads((r/'design/hero-lock.json').read_text());home=(r/'src/pages/home.html').read_text();hero=home[home.index('<section class="portfolio-hero"'):home.index('<div class="bayfi-body"')]
actual={'hero_html':hashlib.sha256(hero.encode()).hexdigest(),'hero_css':hashlib.sha256((r/'src/styles/hero.css').read_bytes()).hexdigest(),'shared_css':hashlib.sha256((r/'src/styles/site.css').read_bytes()).hexdigest()}
assert actual==lock,(actual,lock)
print('Approved hero HTML and CSS are unchanged.')
