"""Regression checks for the generated expertise destinations."""
from pathlib import Path
import json
import unittest

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'src'
DIST=ROOT/'dist'

class ExpertiseChecks(unittest.TestCase):
    def test_taxonomy_uses_existing_published_work(self):
        taxonomy=json.loads((SRC/'data/expertise.json').read_text())['pages']
        projects={p['slug'] for p in json.loads((SRC/'data/projects.json').read_text())}
        references={r['title'] for r in json.loads((SRC/'data/archive-records.json').read_text()) if r.get('publication')!='excluded'}
        self.assertEqual(set(taxonomy),{'creative-direction','product-development','video-production'})
        for page in taxonomy.values():
            self.assertTrue(page['featured'])
            self.assertTrue(set(page['featured'])<=projects)
            self.assertTrue(set(page['references'])<=references)

    def test_generated_routes_and_home_navigation(self):
        if not (DIST/'index.html').exists():self.skipTest('run npm run build first')
        home=(DIST/'index.html').read_text()
        self.assertIn('id="expertise"',home)
        for slug in ['creative-direction','product-development','video-production']:
            url='/expertise/'+slug+'/'
            path=DIST/'expertise'/slug/'index.html'
            self.assertTrue(path.exists(),str(path))
            self.assertIn(url,home)
            content=path.read_text()
            self.assertIn('rel="canonical"',content)
            self.assertIn(url,content)
            self.assertIn('Selected work.',content)
            self.assertIn('Related expertise.',content)

if __name__=='__main__':unittest.main()
