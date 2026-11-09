# V1 test evidence

Source checkpoint94c53a89c995926bd4055a59b94b64e98a90eb33. Exact commands/output: REGRESSION-EVIDENCE.json. No live APIs, customer appointments, emails or inference.

- npm test:21 JavaScript suites PASS.
- npm run test:booking-release:eight JavaScript suites plus deterministic ZIP validation PASS. Source-client/mock Apps Script integration is not a real PHP HTTP-handler test.
- All14 tests/*.php suites PASS with local PHP8.3.6 CLI and sodium. PHP8.4 target, web SAPI/cURL/TLS and Hostinger acceptance remain unverified.
- PHP_BINARY=<local PHP8.3> python3 tests/sera-provider-ledger-concurrency.py:20 processes, exactly3 reservations PASS.
- node tests/crm-browser.cjs:real Chromium153, Playwright1.64.1, axe4.14.0, fake Google RPC;320/768/1440 overflow and zero tested-state axe violations PASS. Initial select-label and fixture-context failures corrected; rerun PASS. Manual screen-reader and visual conformance not claimed.
- node tests/sera-runtime-browser.cjs:actual widget/approved mock config, conditional branches, edited/reloaded answers, pinned tree and zero AI calls PASS.
- Python package-security, image-cache, requirements-matrix, browser-plan/acceptance-build-contract and proposal comparison PASS.
- npm audit --json:zero reported vulnerabilities after restoring exact remote lockfile. Initial ENOLOCK was missing local snapshot input, not a dependency change.
- source-seo.py and utility-routes.py initial executions FAIL because dist is absent. Classified BLOCKED by required build output. Historical source-template passes retained; no current pass claimed. No guard bypass to manufacture output.
- Production build/type/export package and198 browser cases BLOCKED by missing approved hero-lock. Prepared tests are not executed cases.

Initial missing lead-api.mjs/optimizer/lockfile were restored byte-for-byte from the current branch, not rewritten. Failures and reruns remain in JSON. No production evidence promoted from mocks.
