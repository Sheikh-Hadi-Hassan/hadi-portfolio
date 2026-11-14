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
            self.assertTrue(page.get('role'))
            self.assertTrue(page.get('about'))
            self.assertTrue(page.get('ctaLabel'))
            self.assertGreaterEqual(len(page.get('experience',[])),2)

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
            self.assertIn('EXPLORE OTHER DISCIPLINES',content)
            self.assertIn('id="xp-about"',content)
            self.assertIn('id="xp-work"',content)
            self.assertIn('id="xp-experience"',content)
            self.assertIn('id="xp-contact"',content)
            if slug=='product-development':
                studio=ROOT/'public/assets/expertise/apptech-process-studio.webp'
                overhead=ROOT/'public/assets/expertise/product-process-overhead.webp'
                self.assertEqual('id="xp-cinematic-apptech-heading"' in content,studio.is_file())
                self.assertEqual('id="xp-cinematic-heading"' in content,overhead.is_file())
                for image in [studio,overhead]:
                    if image.is_file():
                        self.assertIn(image.name,content)
                self.assertNotIn('xp-cinematic-apptech-heading', (DIST/'expertise/creative-direction/index.html').read_text())


if __name__=='__main__':unittest.main()
