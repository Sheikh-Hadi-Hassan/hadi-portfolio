# Owner-adopted captured-production baseline

No deployment or merge is authorized. Original source66e3e1df67331a92b2966dcab9724e70c8f11d90 is the exact Git parent. No retained-bundle viewport change is imported.

## Source checks (offline)

```
python3 scripts/generate-adopted-runtime.py
python3 scripts/verify-adoption.py
python3 tests/adoption-static.py
python3 tests/php-adoption.py
```

The two-run idempotence test proves CSS is never appended twice. Navigation test proves the editable template differs only by the identified anchor. Source tests do not execute Next, PHP or integrations.

## Full build in an isolated environment

Supply exact package-lock dependencies with verified integrity, including Linux native optional packages. Observed Node24.19.0/npm11.9.0/Python3.12.14/Pillow12.3.0 are not historically verified toolchain versions. PHP8.2+ and cURL are needed for later runtime validation. Do not upgrade dependencies or bypass npm integrity checks.

1. Preserve an unchanged detached66 checkout; run `npm ci --ignore-scripts --no-audit --no-fund`, then `SITE_URL=https://hadi.intellignce.net NEXT_TELEMETRY_DISABLED=1 npm run build`. Store its output/evidence separately. Review any dependency lifecycle requirements before enabling them.
2. In a separate adopted checkout, run the same install/build commands and offline source checks. Keep all production credentials absent and outbound provider connections blocked by the test environment. Do not execute Apps Script functions.
3. Build script uses Sites-safe output and removes PHP. Hostinger packaging is a separate local command: `python3 scripts/package-hostinger.py /absolute/path/website.zip`. The carried overlay recipe restores current PHP and hosting headers, validates adopted fingerprints and rejects archived/private files. It never deploys.
4. Run PHP lint and mocked no-config/disabled/malformed-origin/body/provider-timeout cases with network blocked. These are BLOCKED here because PHP is absent; do not infer runtime success from static inspection.
5. Compare all1,768 captured paths against the produced ZIP using the immutable production inventory. Expect intentional omission of intellignce-support/ask(1).php, source-regenerated navigation changes on shared routes, and adoption/release-manifest additions. Every other mismatch needs an explicit explanation. Run export-hydration.py against actual out/ and verify all HTML/Flight navigation agrees; no generated Flight string patching.

Registry DNS remains unavailable here. Full Next build, hydration, package comparison and PHP execution remain BLOCKED. No fresh deployable package is supplied.

## Importing this implementation

GitHub does not currently contain original66 and this session has no usable Git push authentication. An incremental Git bundle preserves the implementation with66 as its prerequisite. In an authenticated clone already containing66:

```
git bundle verify /absolute/path/adoption.bundle
git fetch /absolute/path/adoption.bundle adoption/captured-production-20261021:adoption/captured-production-20261021
git switch adoption/captured-production-20261021
git push origin adoption/captured-production-20261021
```

If66 is absent, import the original recovered repository/history first. Do not recreate66 with another author/date/tree or put this implementation on main/audit as a substitute. No token/password is requested in chat.

## Integration boundary and rollback

Booking logic, Apps Script and viewport source are unchanged. Version7 source/deployment checklist remains separate. Existing incident event is cancelled; actor/time and status at confirmation are unknown. Candidate outbox diagnostics do not prove live causation.

Keep recovery/non-web/ask(1).php outside all publication roots. Original captured bytes/hash are in ADOPTION-MANIFEST.json. Preserve private runtime configuration separately; none is bundled. Rollback is reverting or abandoning this unmerged adoption branch. Production remains unchanged.
