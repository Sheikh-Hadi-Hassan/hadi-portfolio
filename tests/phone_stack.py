"""Regression checks for the Consumer Connect phone stack and original artwork."""

from pathlib import Path
import json
import unittest

ROOT = Path(__file__).resolve().parents[1]

class PhoneStackTests(unittest.TestCase):
    def test_gallery_has_nine_named_originals(self):
        data = json.loads((ROOT / "src/data/mobile-screen-stacks.json").read_text())
        collection = next(item for item in data["collections"] if item["id"] == "consumer-connect")
        self.assertEqual(len(collection["slides"]), 9)
        self.assertEqual(len({item["src"] for item in collection["slides"]}), 9)
        self.assertTrue(all(item["src"].endswith(".webp") and item.get("alt") for item in collection["slides"]))

    def test_generator_exposes_navigation_and_screen_titles(self):
        generator = (ROOT / "scripts/expertise.py").read_text()
        for name in ("data-phone-prev", "data-phone-next", "data-phone-dot", "data-phone-title",
                     "data-phone-count-text", "data-phone-slide"):
            self.assertIn(name, generator)

    def test_swipe_loop_and_accessibility(self):
        js = (ROOT / "src/site.js").read_text()
        for item in ("const wrap=(index,total)=>", "pointerdown", "pointermove", "pointerup", "ArrowRight",
                     "ArrowLeft", "prefers-reduced-motion", "IntersectionObserver", "data-phone-dot"):
            self.assertIn(item, js)
        self.assertIn("Math.abs(event.deltaX)>Math.abs(event.deltaY)", js)

    def test_apptech_admin_mobile_viewport_is_not_web_framed(self):
        data = json.loads((ROOT / "src/data/mobile-screen-stacks.json").read_text())
        admin = next(item for item in data["collections"] if item["id"] == "apptech-admin")
        self.assertEqual(admin["mode"], "phone")
        self.assertEqual(len(admin["slides"]), 4)

    def test_two_layer_wipe_and_local_frame(self):
        js = (ROOT / "src/site.js").read_text()
        css = (ROOT / "src/styles/expertise.css").read_text()
        self.assertIn("xp-screen-layer is-current", js)
        self.assertIn("const WIPE_DURATION=680", js)
        self.assertIn("device.dataset.mode=selectedMode", js)
        self.assertIn("@keyframes xp-screen-wipe-in", css)
        self.assertIn("@keyframes xp-screen-wipe-out", css)
        self.assertIn(".xp-gallery-frame::before", css)
        self.assertNotIn("webmobilefirst.com", css)

    def test_original_screens_are_not_cropped(self):
        css = (ROOT / "src/styles/expertise.css").read_text()
        self.assertIn(".xp-phone-screen img", css)
        self.assertIn("object-fit:contain", css)
        self.assertIn("@media(max-width:650px)", css)

    def test_screen_files_when_asset_pack_installed(self):
        folder = ROOT / "public/assets/expertise"
        images = list(folder.glob("consumer-connect-*.webp")) if folder.exists() else []
        if not images:
            self.skipTest("Original screenshots are owner assets; install the image pack to run this test")
        self.assertEqual(len(images), 9)
        self.assertTrue(all(image.stat().st_size > 1024 for image in images))

if __name__ == "__main__":
    unittest.main()
