#!/usr/bin/env python3
"""Protect explicit owner exclusions without deleting historical archive provenance."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
records = json.loads((ROOT / "src/data/archive-records.json").read_text())
projects = json.loads((ROOT / "src/data/projects.json").read_text())
excluded_names = {"Kruzz", "Food Delivery Platform"}
found_excluded = {r["title"] for r in records if r.get("publication") == "excluded"}
assert found_excluded == excluded_names, (found_excluded, excluded_names)
assert len(records) == 30, "Do not lose historical recovered references"
assert len(projects) == 15, "Do not alter 15 first-party case studies"
public_records = [r for r in records if r.get("publication") != "excluded"]
assert len(public_records) == 28
assert len({r["title"].casefold() for r in records}) == len(records)
assert "Social Media Portfolio" in {r["title"] for r in public_records}
assert "Lahore Culture" in {r["title"] for r in public_records}
for r in records:
    assert (ROOT / "public" / r["image"].lstrip("/")).is_file(), r["image"]
source = (ROOT / "scripts/build.py").read_text()
assert "record.get('publication') != 'excluded'" in source, "Generator must hide excluded records"

# After a local source build, validate the actual visible cards and counts as well.
html_path = ROOT / "dist/archive/index.html"
if html_path.is_file():
    from html.parser import HTMLParser
    class Cards(HTMLParser):
        def __init__(self):
            super().__init__()
            self.cards = []
        def handle_starttag(self, tag, attrs):
            if tag in ("article", "a"):
                data = dict(attrs)
                if "archive-tile" in data.get("class", "").split():
                    self.cards.append(data)
    page = html_path.read_text()
    parser = Cards()
    parser.feed(page)
    assert len(parser.cards) == 43, len(parser.cards)
    assert sum("archive-reference" in x.get("class", "").split() for x in parser.cards) == 28
    assert "archive-record-kruzz" not in page
    assert "archive-record-food-delivery-platform" not in page
    assert "social-media-portfolio" in page
print("PASS: 30 archived records retained, 2 excluded, 28 publishable references and 15 case studies")
