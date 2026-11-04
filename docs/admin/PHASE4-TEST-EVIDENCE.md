# Phase 4 targeted test evidence — 2026-11-03

Parent b17c4d5b88b960bbd6d4ad80eee45e922179ebc4, development branch only. Scope: PHP 8.3.6 **local CLI**, deterministic/mock/synthetic contracts; not Hostinger/web-runtime/provider or production acceptance. Existing 17 JS and Phase 3 browser suites are retained historical evidence, not newly executed results.

|Actual command|Result|Evidence boundary|
|---|---|---|
|`../php-local/usr/bin/php8.3 tests/sera-router.php`|PASS|Consent, no-paid/free eligibility, bounded failover, state continuity, context/output/order, corrupt registry/policy, invalid UTF-8/nonfinite/cyclic state, strict facts/extra-field rejection|
|`../php-local/usr/bin/php8.3 tests/sera-provider-adapters.php`|PASS|Gemini/Groq mocked protocols, 429 failover, namespace ID compatibility, traversal/URL rejection, invalid context, secret reflection rejection, stable diagnostic code|
|`../php-local/usr/bin/php8.3 tests/admin-credential-vault.php`|PASS|Default-off, authorization, permissions, AEAD, key rotation/revocation, replay/conflict, wrong-key/tamper rejection; added corrupt metadata/capacity/no-write checks and isolated encrypted backup restore without original-store mutation|
|`../php-local/usr/bin/php8.3 tests/admin-provider-runtime.php`|PASS|Private vault/router/ledger composition after changes, interrupted call failover, unchanged answers and disabled activation/diagnostic authorization|
|`../php-local/usr/bin/php8.3 tests/sera-provider-ledger.php`|PASS|Affected router composition regression: pre-call debit, uncertain outcome no refund, circuit and explicit quota-period gates|
|`../php-local/usr/bin/php8.3 tests/provider-candidates.php`|PASS|Two disabled candidates, no guessed account quota, budget zero and zero network/credential resolution|
|`../php-local/usr/bin/php8.3 -l public/intellignce-support/provider-router.php`|PASS|Syntax|
|`../php-local/usr/bin/php8.3 -l public/intellignce-support/provider-adapters.php`|PASS|Syntax|
|`../php-local/usr/bin/php8.3 -l integrations/admin-runtime/CredentialVault.php`|PASS|Syntax; subsequently executed after final invariant change|
|`npm run test:browser-plan`|PASS|Node plan tests and Python provenance tests: exact 22 routes/9 widths, no duplicated/misattributed cases, accurate interrupted accounting, stale/new/modified source/export rejection. Synthetic files only|
|`node --check tests/browser-v01.cjs`|PASS|Harness syntax only; not browser execution|
|`python3 scripts/qa/review-hero-proposal.py`|PASS comparison|Current three protected hashes match inactive proposal; no owner approval. phase4-hero-comparison.json|
|`python3 tests/package-security.py`|PASS|Packaging rejects known private/env/key/credential fixture files; not proof of live web access restrictions|
|`python3 tests/requirements-matrix.py`|PASS|476 IDs, 243 Portfolio /233 future,22 verified and denominator consistency; not semantic recertification|
|`npm run build:acceptance`|BLOCKED, exit1|APPROVED_HERO_REQUIRED; no lock created and no production build executed|
|`node tests/browser-v01.cjs`|BLOCKED, exit1|Hero guard stopped before browser initialization; docs/v01-production-build-browser-results.json records0 executed/0passed/0failed/198blocked|

No test assertions failed in the targeted suites. The two nonzero gate commands are intentional BLOCKED results, never counted as passed builds/browser acceptance. No live AI inference, booking, email, hosted publication, new diagnostic or production writes occurred. No unrelated unchanged CMS/booking/consent suite was re-executed. Manual screen-reader/keyboard/visual production acceptance remains unperformed; future automated checks do not substitute for it.

New harness behavior is implemented, syntax/plan/provenance-tested and **not yet executed on an approved export**: fresh context per case, bounded image/font loading, local assets/link/fragment checks, menu focus/Escape, history round trip, reduced motion, axe, screenshots and incremental results. PHP submissions/external origins are blocked. It does not validate external destinations, live forms/providers, normal-motion behavior, every Sera dialog state or manual WCAG; retained dedicated fixtures and later authorized acceptance cover those separately.

Historical docs/v01-all-route-browser-results.json is preserved unchanged. The hardened production-build harness writes a separate v01-production-build-browser-results.json so blocked/current runs cannot replace the historical evidence artifact.

## 2026-11-04 continuation from ebebab75

New defect reproduced before the fix: `node tests/admin-staging-security.mjs` failed because cms-current.json.tmp accepted a hardlink. The test uses an independent temporary sentinel, never a production/source file. Fixed all fixed-name mutable CMS/Sera/pointer paths, retained symlink rejection, restricted staging root/lock to0700, and replaced mutable writes through exclusive0600 temporary files flushed before rename. Failed writes preserve active data and remove temporary files/locks. This remains owner-operated isolated staging; it is not a cross-tenant or hostile same-UID security boundary or proof of hosting/power-loss durability.

Executed after the patch was restored following a workspace reload:

|Command|Result|
|---|---|
|node tests/admin-staging-security.mjs|PASS: all11mutable-path hardlinks, directory target, sentinel preservation, permission bits, injected failed rename, temp/lock cleanup and rollback|
|node tests/admin-public-config.mjs|PASS: affected Sera config staging, allowlist/rejection, conflict, last-good fallback and rollback|
|node tests/admin-cms.mjs|PASS: affected metadata staging/preview/conflict/rollback|
|node tests/admin-cms-rich.mjs|PASS: rich content and strict immutable release verification|
|node tests/admin-cms-content.mjs|PASS: media/full case/publish/readback/interruption/rollback|
|python3 tests/admin-cms-cli.py|PASS: stage/publish/update/rollback CLI and cleanup|
|CHROMIUM_PATH=/workspace/scratch/f1b54e9ce3cf/browser-cache/manual/chromium NODE_PATH=/workspace/scratch/f1b54e9ce3cf/test-deps/node_modules:$CODEX_PRIMARY_RUNTIME_NODE_MODULES LD_LIBRARY_PATH=/workspace/scratch/f1b54e9ce3cf/browser-cache/manual/al2023/lib:/workspace/scratch/f1b54e9ce3cf/browser-cache/manual node tests/admin-cms-browser.cjs|PASS; cms-browser-results.json: isolated original-template CMS at375/768/1440, automated axe, edit/promotion and rollback; production cases0|

Unchanged PHP/booking/notification/consent/security suites retain prior results; no need to rerun them for a filesystem-only patch. No live provider call, email, booking, diagnostic or deployment was executed. Actual Google login, live host access and patched PHP8.4 tests remain blocked. Production-build matrix remains0/198; prior blocked reports are preserved.

`npm run test:browser-v01` executed after the staging changes and returned exit1/BLOCKED at the unchanged hero guard, before Chromium initialization. Latest report remains0executed/198blocked; no fixture case is counted toward198. No PHP8.4 binary was found locally; no compatibility claim or hosting version switch was made.
