#!/usr/bin/env python3
"""Fail fast when editable source references an asset absent from public/assets."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOTS = [ROOT / "src"]
TEXT_SUFFIXES = {".html", ".json", ".css", ".js", ".jsx", ".mjs", ".cjs"}
ASSET_RE = re.compile(r"/assets/[A-Za-z0-9._\-/]+\.(?:webp|png|jpe?g|svg|mp4|webm|woff2?|ttf|otf|css)", re.I)

refs = {}
for source_root in SOURCE_ROOTS:
    for path in source_root.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        for match in ASSET_RE.findall(text):
            refs.setdefault(match, set()).add(path.relative_to(ROOT).as_posix())

missing = []
for ref, sources in sorted(refs.items()):
    target = ROOT / "public" / ref.lstrip("/")
    if not target.is_file():
        missing.append((ref, sorted(sources)))

if missing:
    lines = ["Editable source references missing public assets:"]
    for ref, sources in missing:
        lines.append(f"- {ref} <- {', '.join(sources)}")
    raise SystemExit("\n".join(lines))

print(f"Source asset preflight passed: {len(refs)} referenced assets exist in public/assets.")
