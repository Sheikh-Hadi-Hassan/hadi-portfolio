"""Package a production-origin build for Hostinger without bundling private configuration.

Do not modify generated HTML, Flight streams or JS: serialized text is length-prefixed.

Usage:
    SITE_URL=https://hadi.intellignce.net npm run build
    python3 scripts/package-hostinger.py /absolute/path/website.zip
"""
from pathlib import Path
import sys
import zipfile
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "out"

FORBIDDEN_BASENAMES = {
    ".env",
    ".env.local",
    ".env.production",
    "hadi-leads-config.php",
    "private-config.php",
    "secrets.php",
    "credentials.json",
}
FORBIDDEN_SUFFIXES = {".pem", ".key", ".p12", ".pfx"}


def private_files(root: Path):
    """Return files that must never be published in a static Hostinger package."""
    found = []
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        name = path.name.lower()
        if name in FORBIDDEN_BASENAMES or path.suffix.lower() in FORBIDDEN_SUFFIXES:
            found.append(path)
            continue
        if name.startswith(".env."):
            found.append(path)
    return sorted(found)


def assert_no_private_files(root: Path):
    found = private_files(root)
    if found:
        rel = ", ".join(path.relative_to(root).as_posix() for path in found)
        raise RuntimeError(
            "Refusing to package private configuration or credentials: " + rel
        )


def package(target: Path):
    if not target.is_absolute():
        raise ValueError("Hostinger ZIP target must be an absolute path.")
    sitemap = OUT / "sitemap.xml"
    if not sitemap.is_file() or "https://hadi.intellignce.net/" not in sitemap.read_text():
        raise RuntimeError("Build with SITE_URL=https://hadi.intellignce.net first.")

    assert_no_private_files(OUT)
    subprocess.run(
        [sys.executable, str(ROOT / "tests/export-hydration.py"), str(OUT)],
        check=True,
    )

    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
        for path in sorted(OUT.rglob("*")):
            if path.is_file():
                archive.write(path, path.relative_to(OUT))

    with zipfile.ZipFile(target) as archive:
        if archive.testzip() is not None:
            raise RuntimeError("Generated Hostinger ZIP failed integrity validation.")
        names = archive.namelist()
        if "index.html" not in names or not any(name.startswith("_next/static/") for name in names):
            raise RuntimeError("Generated Hostinger ZIP is missing required site output.")
        forbidden = [
            name for name in names
            if Path(name).name.lower() in FORBIDDEN_BASENAMES
            or Path(name).suffix.lower() in FORBIDDEN_SUFFIXES
            or Path(name).name.lower().startswith(".env.")
        ]
        if forbidden:
            raise RuntimeError(
                "Generated Hostinger ZIP unexpectedly contains private files: "
                + ", ".join(forbidden)
            )

    print("Verified Hostinger ZIP:", target, target.stat().st_size, "bytes")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python3 scripts/package-hostinger.py /absolute/path/website.zip")
    package(Path(sys.argv[1]))
