#!/usr/bin/env python3
"""Security tests for Hostinger packaging exclusions."""
from pathlib import Path
from tempfile import TemporaryDirectory
import importlib.util

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "package_hostinger", ROOT / "scripts" / "package-hostinger.py"
)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

with TemporaryDirectory() as tmp:
    root = Path(tmp)
    (root / "index.html").write_text("ok")
    module.assert_no_private_files(root)

    forbidden = [
        "hadi-leads-config.php",
        ".env",
        ".env.production.local",
        "private-config.php",
        "server.key",
        "certificate.pem",
        "credentials.json",
    ]
    for name in forbidden:
        path = root / name
        path.write_text("secret")
        try:
            module.assert_no_private_files(root)
        except RuntimeError:
            pass
        else:
            raise AssertionError(f"Packaging guard accepted forbidden file: {name}")
        path.unlink()

print("Hostinger packaging security: private config, env and credential files are rejected.")
