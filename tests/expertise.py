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
            self.assertEqual(len(page.get('faq',[])),3)
            self.assertTrue(all(item['question'] and item['answer'] for item in page['faq']))

    def test_mobile_screen_stack_source_manifest(self):
        payload=json.loads((SRC/'data/mobile-screen-stacks.json').read_text())
        self.assertEqual(payload['version'],1)
        stacks=payload['collections']
        self.assertTrue(stacks)
        for stack in stacks:
            self.assertTrue(stack['id'])
            self.assertTrue(stack['title'])
            self.assertGreaterEqual(len(stack['slides']),2)
            self.assertEqual(len({screen['src'] for screen in stack['slides']}),len(stack['slides']))
            for slide in stack['slides']:
                self.assertTrue(slide['src'].endswith('.webp'))
                self.assertTrue(slide['alt'])

    def test_owner_image_curation_is_accessible_and_source_grounded(self):
        data=json.loads((SRC/'data/expertise-images.json').read_text())
        self.assertEqual(data['version'],1)
        images=data['hero']+data['more']
        self.assertGreaterEqual(len(data['hero']),3)
        self.assertGreaterEqual(len(data['more']),5)
        self.assertEqual(len({item['asset'] for item in images}),len(images))
        for item in images:
            self.assertTrue(item['asset'].endswith('.webp'))
            self.assertTrue(item['alt'])
            self.assertTrue(item['title'])
            self.assertNotIn('http',item['asset'])

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
            if slug=='product-development':
                self.assertIn('Selected work.',content)
                self.assertIn('product-portfolio',content)
                self.assertEqual(content.count('data-product='),4)
                self.assertEqual(content.count('data-flight-card'),19)
                self.assertEqual(content.count('data-full='),9)
                for product in json.loads((SRC/'data/digital-products.json').read_text())['products']:
                    self.assertIn(product['url'],content)
                    self.assertIn(product['image']['src'],content)
                self.assertIn('id="xp-approach"',content)
                self.assertIn('id="xp-contact"',content)
                self.assertIn('data-phone-stack',content)
                self.assertNotIn('id="xp-about"',content)
                self.assertNotIn('id="xp-experience"',content)
                self.assertNotIn('id="xp-questions"',content)
                self.assertNotIn('xp-cinematic-apptech-heading',content)
                continue
            self.assertIn('Selected work.',content)
            self.assertIn('EXPLORE OTHER DISCIPLINES',content)
            self.assertIn('id="xp-about"',content)
            self.assertIn('id="xp-work"',content)
            self.assertIn('id="xp-experience"',content)
            self.assertIn('id="xp-contact"',content)
            self.assertIn('id="xp-questions"',content)
            self.assertEqual(content.count('class="xp-question"'),3)
            self.assertIn('"@type": "FAQPage"',content)
            self.assertIn('"acceptedAnswer"',content)
            if slug=='product-development':
                studio=ROOT/'public/assets/expertise/apptech-process-studio.webp'
                overhead=ROOT/'public/assets/expertise/product-process-overhead.webp'
                self.assertEqual('id="xp-cinematic-apptech-heading"' in content,studio.is_file())
                self.assertEqual('id="xp-cinematic-heading"' in content,overhead.is_file())
                for image in [studio,overhead]:
                    if image.is_file():
                        self.assertIn(image.name,content)
                self.assertNotIn('xp-cinematic-apptech-heading', (DIST/'expertise/creative-direction/index.html').read_text())
                mobile_manifest=json.loads((SRC/'data/mobile-screen-stacks.json').read_text())['collections'][0]
                mobile_exist=all((ROOT/'public/assets/expertise'/item['src']).is_file() for item in mobile_manifest['slides'])
                self.assertEqual('data-phone-stack' in content,mobile_exist)
                if mobile_exist:
                    ready_collections=[collection for collection in json.loads((SRC/'data/mobile-screen-stacks.json').read_text())['collections'] if all((ROOT/'public/assets/expertise'/slide['src']).is_file() for slide in collection['slides'])]
                    self.assertEqual(content.count('data-phone-slide'),sum(len(collection['slides']) for collection in ready_collections))
                    for item in mobile_manifest['slides']:self.assertIn(item['src'],content)
                image_inventory=json.loads((SRC/'data/expertise-images.json').read_text())
                existing=[item for item in image_inventory['hero']+image_inventory['more'] if (ROOT/'public/assets/expertise'/item['asset']).is_file()]
                self.assertEqual('id="xp-product-images"' in content,bool(any((ROOT/'public/assets/expertise'/item['asset']).is_file() for item in image_inventory['hero'])))
                for item in existing:self.assertIn(item['asset'],content)



if __name__=='__main__':unittest.main()
