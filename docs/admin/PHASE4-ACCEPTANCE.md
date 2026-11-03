# Phase 4 acceptance gates — 2026-11-03

Source parent: b17c4d5b88b960bbd6d4ad80eee45e922179ebc4. Existing Phase 3 results are retained; this file adds targeted evidence, not production acceptance. Production, main, recovery and the release manifest are unchanged. NO-GO / STALE.

|Gate|Status|Evidence / missing proof|
|---|---|---|
|Router/adapters|VERIFIED locally|Namespaced Groq IDs; corrupt context/registry/policy rejection, strict facts, stable safe errors; focused mock tests. No network.|
|Credential vault|VERIFIED locally|AEAD/custody guards retained; corrupt provider/audit/replay metadata rejected without mutation. Hosting custody remains unverified.|
|CMS creation/edit/rich content/media/approval/stage/pointer promotion/rollback/protected assets|VERIFIED in previous isolated tests|PHASE3-TEST-EVIDENCE.md, PHASE3-WORKFLOWS.md; no relevant CMS code change, passing tests not repeated. Hosted upload/publication BLOCKED.|
|Hero proposal/current source|VERIFIED comparison only|phase4-hero-comparison.json: three hashes match proposal; original approved artifact unavailable. No approval/lock activation.|
|22 × 9 browser plan|VERIFIED preparation only|browser-plan.cjs and acceptance-build.py synthetic tests; interruption accounting, source/export receipt and exact inventory. Actual run blocked before opening browser.|
|Hostinger web PHP/SAPI, cURL/TLS, sodium/restrictions|BLOCKED|No authenticated hosting connection/evidence; local PHP CLI is not web runtime proof. Hosting tools unavailable; mail connector is insufficient.|
|Effective private config + deployment fingerprint|BLOCKED|No request-level live loader evidence. Static disk/source selection is insufficient.|
|Apps Script deployed source/version, execution/access, Calendar/mail|BLOCKED|No authenticated deployment evidence supplied. Editor HEAD/health responses cannot pass.|
|Sheet/bound-script ACLs|BLOCKED|No owner/container sharing evidence. Trusted editors bypass application RBAC; never customer isolation.|
|Diagnostic cleanup|BLOCKED|No new owner evidence.json/cleanup.json. No diagnostic installed here; that does not establish previous owner cleanup.|
|Independent key custody + Google/PHP authorization|BLOCKED|Master-key store/reader privileges, private filesystem and identity bridge unverified. Writes/activation remain disabled.|
|Provider account/privacy/live connectivity|BLOCKED|Official documents reviewed; disabled candidates only. No live quota consumed. See PROVIDER-READINESS.md.|
|Approved build / production browser acceptance|BLOCKED|Missing approved design/hero-lock.json; 0/198 executed.|
|Booking integration acceptance|BLOCKED|Identity gates, isolated resources, recipients and explicit test authorization absent.|

Available Library searches (exact evidence/cleanup names and simplified Hadi verification query) returned no matches; this does not prove files do not exist. Existing local kit evidence is mock/local evidence. No production verification was inferred or repeated.

## Security boundaries and activation sequence

1. Owner returns sanitized evidence using OWNER-ACCEPTANCE.md and the **existing reviewed ZIP**. Any temporary diagnostic or source-matched instrumentation requires separate installation approval. Do not run static kit output as proof of effective gateway loading. Never send tokens, keys, configuration dumps or master-key fingerprints.
2. Privately verify the deployed gateway/source and Google principal/ACLs. Browser → Apps Script remains an authenticated owner/team boundary. Google Sheets permissions do not create per-customer authorization. Public runtime accepts only the strict public-approved artifact; drafts, actors, provider credentials and CRM records stay private.
3. Before credential storage installation, establish the web service principal and independently protected key provider. Record only custody/access attestations. Verify sodium, 0700 directory outside **every served document root**, 0600 files, locking/fsync/atomic rename and backup reader permissions under the actual web handler. An arbitrary string documentRoot argument is not proof of all served roots.
4. Review/install an authenticated Google-to-PHP bridge separately: signed short-lived audience-bound requests, server-derived actor/role, replay prevention, bounded body, TLS and secret-safe errors/audit. No such HTTP endpoint is currently installed. Public browser fields must never set custodyVerified/activationApproved or permissions.
5. Back up encrypted data and audit trail separately from the master key. Demonstrate restoration into a disconnected private directory with the same key, masked read and synthetic rotate/revoke/replay/conflict checks. Never copy the master key into a Sheet, public artifact, repo or vault directory. Loss of the key requires provider-key revocation/re-entry; ciphertext alone cannot recover it.
6. Provider-key rotation/revocation is locally implemented. Master-key migration is **not** implemented: require a reviewed atomic re-encryption/key-version and HMAC replay migration procedure, interrupted-write recovery test, and retained previous encrypted backup before rotating it. Do not simply replace the key callback: old ciphertext/replay HMACs would fail.
7. Only after evidence acceptance, approve the exact private installation and limited credential-write test. Enter keys through an approved private mechanism, never chat. Verify masked read, replay, revision conflict and provider-side revocation. Activation is still false. Backend revocation alone cannot invalidate leaked upstream keys; revoke in the provider console too.
8. Approve each model/account/privacy/quota/evaluation entry, maintain paid budget $0, then separately authorize a bounded live connectivity test. Diagnose the account's unbilled tier before inference. Keep unknown outcomes charged; no retry that evades quota or changes account/key to reset limits. Enable routing only after the live test is evidenced. Questionnaire stays available throughout.

No commands in this document activate anything. Missing bridge, master-key migration or hosting prerequisites are blockers, not assurances supplied by local encryption tests.

## Hosted CMS handoff

The working isolated pipeline already supports new/edit cases, article/chapter content, image replacement/sanitization, contact/social/SEO records, owner approval, immutable staged releases and verified pointer rollback. These operations target temporary staging only.

Before hosting: (1) accept runtime/ACL/auth evidence; (2) select private staging root and restricted deployment identity; (3) approve deployment of a bounded upload/import bridge that invokes existing decoder/limits and accepts only content packages, never paths or code; (4) prove Pillow or an equivalent reviewed decoder/re-encoder is available—do not substitute MIME sniffing; (5) transfer the **owner-approved** export and sanitized content-addressed media to isolated staging; (6) rebuild the actual candidate with existing templates, SEO/sitemap/routes and hero guard; (7) verify exact manifest/media hashes plus browser rendering and preserved URLs; (8) approve atomic publication separately and retain old complete release; (9) read back actual served content/cache versions and rollback under expected-release conflict protection. Unknown publication outcomes require reconciliation, never blind replay. Hash manifests provide integrity, not an approval signature; exports cannot be accepted automatically from untrusted clients. No arbitrary file manager/write endpoint is added.

## Exact local hero decision

Current protected hashes (source parent above; also phase4-hero-comparison.json):

- hero_html: `bafe2419c5332ebc59e93519ed7c94c125a684f9c05d2dee3e55b41f06de608e`
- hero_css: `fc5224e4a0ab4bc2957f8be69ac8f84e6b48b125b771e7123e84c552e77b035f`
- shared_css: `7255e1f9fe90310502abca9c422d82cc135bf0dcba5aa574650513fd807a8b33`

Owner may supply the authenticated original lock, or explicitly state: **“I approve local activation of exactly these three hashes from the existing proposed baseline for build and local QA only.”** Approval must be recorded against these hashes. This task is not approval. No visual change was made; hash identity proves preserved inputs, not owner visual acceptance or equivalence to the unavailable original approval.

After that decision only: recheck proposal, create design/hero-lock.json containing exactly the three approved key/hash entries, run unchanged verify-hero-lock.py, then `npm run build:acceptance`, then `npm run test:browser-v01` with the existing restored Chromium/Playwright environment. The wrapper records source/export hashes and the harness rejects stale artifacts. Source/fixture QA and automated axe remain distinct from manual WCAG and production acceptance. Browser external requests/PHP submission routes stay blocked. Screenshots and per-case results are saved incrementally; failures do not erase completed cases. Rollback local activation by removing only that newly approved lock/reverting its isolated commit and discarding out; the original guard remains unchanged. Production needs separate deployment approval.

Portfolio remains **22/243 = 9.05%** verified, 188 partial, 2 missing, 31 externally blocked; 233 future excluded. Phase 4 safety tests do not automatically satisfy additional original-plan obligations.
