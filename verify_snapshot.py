"""Read-only integrity verification: python3 verify_snapshot.py."""
import hashlib
import json
from pathlib import Path, PurePosixPath

root = Path(__file__).resolve().parent
inventory = json.loads((root / "production-inventory.json").read_text())
expected = set()
failures = []
for item in inventory["files"]:
    relative = PurePosixPath(item["path"])
    if relative.is_absolute() or ".." in relative.parts:
        raise SystemExit("Unsafe inventory path")
    path = root / "production" / relative
    if item["status"] == "EXCLUDED_PRIVATE_CONFIGURATION":
        if path.exists():
            failures.append(f"Private configuration unexpectedly present: {relative}")
        continue
    expected.add(relative.as_posix())
    if not path.is_file():
        failures.append(f"Missing: {relative}")
        continue
    data = path.read_bytes()
    if len(data) != item["bytes"] or hashlib.sha256(data).hexdigest() != item["sha256"]:
        failures.append(f"Checksum/size mismatch: {relative}")
actual = {p.relative_to(root / "production").as_posix()
          for p in (root / "production").rglob("*") if p.is_file()}
failures.extend(f"Unexpected: {p}" for p in sorted(actual - expected))
print(json.dumps({"included_files": len(expected), "failures": failures,
                  "result": "PASS" if not failures else "FAIL"}, indent=2))
raise SystemExit(1 if failures else 0)
