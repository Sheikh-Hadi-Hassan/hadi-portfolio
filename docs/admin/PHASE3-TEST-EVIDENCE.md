# Phase 3 actual evidence

Continuation of 1f62f3d096ea2a96710c9e4b937ff0e9f6e17752; first tested slice d3924cc347376d7adca12726486e388967762b7a. No production/main/recovery changes, bookings, emails, live provider quota or paid inference.

|Executed command|Result and scope|
|---|---|
|`npm test`|PASS, 16 JavaScript suites; preserved booking/notification recovery and added CMS content/runtime-control contracts. Affected admin/CMS tests also rerun after final fault-injection/export refinements.|
|`../php-local/usr/bin/php8.3 tests/admin-credential-vault.php`|PASS default-off, authorization/private-path checks, AEAD encryption, mask, rotation/revocation, audit, optimistic revision, lost-ack replay and tamper/wrong-key rejection.|
|`../php-local/usr/bin/php8.3 tests/admin-provider-runtime.php`|PASS vault → approved policy → adapters/router → ledger → response using fake transport; timeout failover, quota exhaustion, key rotation does not reset quota, consent/default-off and diagnostic permission.|
|`../php-local/usr/bin/php8.3 tests/sera-provider-transport.php`|PASS default transport gate and privacy redaction without mutating stored answers. Real cURL/TLS is NOT accepted; local PHP lacks cURL.|
|`../php-local/usr/bin/php8.3 tests/admin-public-config.php`|PASS public schema, tone and prior-config fallback, including approved runtime-control records.|
|`../php-local/usr/bin/php8.3 tests/sera-provider-adapters.php`|PASS envelopes, bounded mocked failover, error/eligibility/privacy gates; reflected credentials rejected.|
|`../php-local/usr/bin/php8.3 tests/sera-provider-ledger.php`|PASS durable debit, circuit, reset scope and uncertain-result preservation.|
|`../php-local/usr/bin/php8.3 tests/sera-router.php`|PASS existing routing plus approved order and context/output caps.|
|`../php-local/usr/bin/php8.3 tests/sera-retrieval.php`|PASS relevant bounded source facts.|
|`PHP_BINARY=../php-local/usr/bin/php8.3 python3 tests/sera-provider-ledger-concurrency.py`|PASS, 20 independent PHP processes accept exactly 3 reservations; empty-corrupt ledger fails closed.|
|`node scripts/admin/run-browser-tests.cjs` with documented test environment|PASS seven isolated suites; see browser-suite-results.json. Playwright 1.64.1, axe wrapper 4.14.0, Chromium 153.0.8010.0.|
|`python3 tests/package-security.py`, `python3 tests/requirements-matrix.py`|PASS package exclusions and 476-ID/243-portfolio count consistency; not semantic re-certification.|
|`python3 tests/admin-cms-cli.py`|PASS documented CLI stage/publish/update/rollback; temporary artifacts removed.|
|Affected `php8.3 -l` and `node --check public/intellignce-support/widget-v9.js`|PASS syntax; no production site build or hero bypass.|

Browser suite commands: tests/admin-control-browser.cjs, admin-workflows-browser.cjs, admin-cms-browser.cjs, sera-config-browser.cjs, sera-runtime-browser.cjs, sera-browser.cjs and sera-guided-browser.cjs. Source-backed fake Google RPC verifies draft/import/preview/approval, invalid route recovery, actual persisted save plus lost acknowledgement/replay, viewer/anonymous denial despite forged frontend role, disabled provider metadata, rejected activation, local media import/SVG rejection and approved FAQ reaching the actual widget in a separate context without admin RPC or AI POST. CMS fixture verifies sanitized media, original template/CSS, mobile/tablet/desktop overflow, decoded image content aspect, automated axe, edit/promotion and rollback. Runtime fixture verifies approved conditional questions, stored answers and pinned release after reload/new config; consent/eleven guided journeys regressions pass.

Widths: initial admin 320/768/1280; new workflows/CMS 375/768/1440. Zero automated axe findings in those tested states. Keyboard dialog Escape/cancel/confirmation tested automatically; no manual screen-reader/WCAG certification or actual Google login claimed. Production acceptance remains 0/198.

Additional deterministic faults: failed Sheet append (no write), lost flush acknowledgement (one persisted revision), failed pointer promotion (old content retained), stale revisions, corrupt/absent rollback, invalid trees/skills/budgets, bad/corrupt media and credential response reflection. Private/draft records do not enter public snapshots. No infinite or uncertain-operation automatic retry was added.

Defects found and fixed during this phase: cross-tab token invalidation; widget startup baseline initialization order; mixed CMS/Sera export kinds; structured-array punctuation loss; known provider validation rejection leaving an editor frozen. Harness issues fixed: explicit browser context for axe, output-directory creation, package-version reading through supported module entry, and image border-box/content-box measurement. Final affected tests pass; failures were not relabeled as passes without reruns.

External blockers remain: Hostinger actual web runtime/key custody/auth bridge, Google deployment/source/ACL/permissions, free-tier account/region/privacy decisions, approved hero/build, actual hosted CMS publication and controlled booking/email acceptance. No new dependency audit result is claimed; application dependency declarations unchanged except test script commands. No production manifest regeneration. NO-GO / STALE.

## Continuation from 7882f82 (4 November 2026)

`npm test` PASS: 17 JS suites after rich-content changes. Focused admin backend, CMS metadata/content/rich-release tests and documented CLI all PASS. Admin-workflows and CMS-browser fixtures rerun PASS at 375/768/1440, with zero axe findings in tested states; editor preview and same-record reimport preserve IDs/revisions/punctuation, and rich editorial chapter anchors work by keyboard. Other five browser suites and prior PHP/booking/notification evidence are unchanged, not claimed as new executions.

New `node tests/admin-cms-rich.mjs` covers escaped article/chapter markup, known layout variants, bounded records, required image membership, anchor preservation, explicit image replacements, and unapproved release file/directory/symlink/hardlink/duplicate-manifest rejection. Invalid rollback retains the active pointer. Additional PHP transport/private-runtime tests PASS, including valid UTF-8 clipping for Urdu without mutating stored answers.

The new import test exposed a real UI bug: the global version-approval helper shadowed native window.confirm and blocked unsaved-editor imports. It was renamed, then the browser workflow passed. No unresolved failure is hidden. No actual Hostinger/Google identity, external provider, production build or live booking/email acceptance was performed. Source template/CSS and hero-lock inputs remain untouched.
