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
|`node tests/browser-v01.cjs`|BLOCKED, exit1|Hero guard stopped before browser initialization; docs/v01-all-route-browser-results.json records0 executed/0passed/0failed/198blocked|

No test assertions failed in the targeted suites. The two nonzero gate commands are intentional BLOCKED results, never counted as passed builds/browser acceptance. No live AI inference, booking, email, hosted publication, new diagnostic or production writes occurred. No unrelated unchanged CMS/booking/consent suite was re-executed. Manual screen-reader/keyboard/visual production acceptance remains unperformed; future automated checks do not substitute for it.

New harness behavior is implemented, syntax/plan/provenance-tested and **not yet executed on an approved export**: fresh context per case, bounded image/font loading, local assets/link/fragment checks, menu focus/Escape, history round trip, reduced motion, axe, screenshots and incremental results. PHP submissions/external origins are blocked. It does not validate external destinations, live forms/providers, normal-motion behavior, every Sera dialog state or manual WCAG; retained dedicated fixtures and later authorized acceptance cover those separately.
