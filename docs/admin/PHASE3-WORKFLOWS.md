# Phase 3 working local workflows and boundaries

## CMS

The existing private admin adds standard full case documents, source-JSON import and safe text preview. Structured arrays preserve punctuation. Server validation, explicit owner approval, stable route enforcement, versions, mutation tokens and append-only audit apply. CmsContract.gs is shared with the publisher. Later drafts do not replace approved content. Existing specialized chapter/video/social data is preserved; explicit image replacements update existing chapter references. Article sections and chapter title/copy/layout/image references are now editable. Known existing layout variants only; duplicate/colliding anchors and invalid image references are rejected. Existing chapter anchors cannot be removed. Video/social authoring remains source-managed.

Image selection downloads a LOCAL import package. It does not upload to Hostinger or save binary data in Sheets. The staging backend decodes PNG/JPEG/WebP, rejects animated/unsupported/oversized images, strips metadata and re-encodes. PNG imports use lossless WebP and retain transparency. Output names are content hashes; original filenames cannot choose paths. Limits: 10 MB input/output, 8192 px edge, 16 million pixels; subprocess time/memory-output bounds apply. Existing images are decoded/dimension-checked; source and protected hero assets are never replaced.

From an owner-reviewed export, use the existing temporary-only publisher:

```sh
node scripts/admin/cms-workflow.mjs media cms-media-upload.json /tmp/owner-review/staging/media
# Use the returned path/actual dimensions in the case draft, then review/approve/export.
node scripts/admin/cms-workflow.mjs stage cms-approved-export.json /tmp/owner-review/staging/cms none /tmp/owner-review/staging/media
node scripts/admin/cms-workflow.mjs publish /tmp/owner-review/staging/cms none /tmp/owner-review/staging/media
node scripts/admin/cms-workflow.mjs rollback /tmp/owner-review/staging/cms CURRENT_RELEASE_UUID
```

Replace none with the current stage/published release for subsequent writes. These are isolated releases only. Immutable release directories contain source JSON, previews from existing case template/CSS, sanitized media and a hash manifest. Promotion/rollback verifies files and atomically updates one pointer carrying the previous release. Failed promotion preserves the active pointer; uncertain post-write outcomes require readback/reconciliation. No arbitrary target path, template/script editing or real deployment endpoint is provided. Remove only your temporary owner-review directory after review. Preserve recovery backups and STALE manifest.

Actual production publishing needs an approved hero/build, authenticated staging/deployment path, current production/source comparison, complete assets and rollback acceptance. Preview fixtures are not the full Next export or all specialized layouts.

## Sera

Approved public skills, per-service question trees and runtime policy join knowledge/FAQ/personality/voice exports. Unknown/private/admin capabilities are rejected. Discovery, deterministic brief and direct booking cannot be disabled. Question conditions refer only to earlier questions; cycles, unknown dependencies, duplicate IDs and reserved shared fields are rejected. Required answers are validated and included in the persisted lead/brief contract. Active drafts pin the approved tree snapshot/release across reloads and later approvals. Corrupt snapshots retain answers and request review; consent is not restored.

Context/output budgets and provider order are independently clamped server-side. The existing gateway applies public context/output budgets. The private composition root connects the vault, adapters, ledger and router in mocks. Its production wiring remains disconnected. Public policy cannot enable providers, change endpoints/credentials, remove consent, grant admin tools or enable paid inference. Runtime config schema failures retain previous/built-in fallback.

## Credentials and provider boundary

CredentialVault.php uses XChaCha20-Poly1305 with random nonces and provider/version associated data. It requires an injected independent key provider and server authorization; neither is supplied by a browser. Private storage permissions/outside-document-root checks, encrypted writes, masked projection, audit, revision conflicts, provider-key rotation/revocation and operation replay are tested synthetically. Data fsync/atomic replacement are implemented; actual hosting durability/key custody is not proven. Capacity fails closed. Master-key migration/operations and an actual Google-to-PHP auth bridge are not production accepted.

The workspace still rejects key fields and provider enabled=true. No key-input endpoint exists. The HTTPS adapter transport is fixed-host, TLS-verifying, no-redirect, timeout/response-bounded and default-disabled; local PHP lacks cURL, so its real network behavior remains unverified. Provider context is redacted separately from preserved questionnaire state. Interrupted calls retain quota debit; key rotation does not reset quota. Eligibility and billing/privacy decisions cannot be inferred from mock flags.

## Browser runner

Test-only dependencies were restored outside the application: Playwright 1.64.1, axe wrapper 4.14.0 and Chromium package 153.0.0 (actual Chromium 153.0.8010.0). Official Playwright CDN archives were truncated in this executor. The npm binary was decompressed without archive ownership changes; no browser was installed on production. No paid inference/dependency was enabled.

With CHROMIUM_PATH set to an installed compatible browser, NODE_PATH resolving declared test modules and any required native-library path:

```sh
node scripts/admin/run-browser-tests.cjs
```

Seven isolated browser suites cover source-backed fake-Google admin operations, public widget isolation/FAQ publishing, CMS media/render/edit/promotion/rollback, questionnaires, consent and recovery. Automated overflow/axe checks use mobile/tablet/desktop fixtures. They do not prove real Google authentication, manual WCAG conformance, live provider behavior or any of the 198 production-build route cases.

Rich case records are capped at 32,000 serialized characters. Import into an existing selected case retains its ID/revision and refuses a different slug; choose Create draft before importing a new case. Article/chapter fields omitted from a source import preserve existing data. Empty chapters do not remove existing anchors. Morganics uses its existing chapter template and does not accept article sections unsupported by that template. Preview and release verification use the existing editorial templates/CSS without modifying them. Release validation rejects unlisted or linked files and validates again after pointer promotion; uncertain post-write verification returns reconciliation-required.
