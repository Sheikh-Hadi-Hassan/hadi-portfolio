# Isolated review and rollback

Do not deploy these changes without owner approval. Existing admin records are preserved. No automatic Sheet-to-public synchronization exists.

1. In the authenticated private workspace, edit a draft; review content/visibility/source; approve the intended version using the confirmation dialog. Only owner can approve/export. Later drafts cannot replace approved snapshots.
2. Export approved Sera or CMS artifact. Inspect the public export: no PII, secrets, private records or unapproved claims. These unsigned exports are accepted only from the trusted owner-controlled workflow.
3. Stage locally (first publish has no EXPECTED_RELEASE; later publish must supply the current release UUID):

```sh
node scripts/admin/stage-sera-config.mjs stage sera-approved-export.json /tmp/owner-review/staging/sera EXPECTED_RELEASE
node scripts/admin/stage-cms.mjs stage cms-approved-export.json /tmp/owner-review/staging/cms EXPECTED_RELEASE
```

4. Inspect returned verified/readback SHA and generated JSON. CMS JSON includes escaped previews. No source/hero/public files are changed. Real template/build/production rendering remains blocked by hero approval and deployment permission.
5. To restore the prior local approved version:

```sh
node scripts/admin/stage-sera-config.mjs rollback /tmp/owner-review/staging/sera CURRENT_RELEASE
node scripts/admin/stage-cms.mjs rollback /tmp/owner-review/staging/cms CURRENT_RELEASE
```

6. Verify release ID/readback hash. Missing/corrupt previous artifact or stale release must fail; keep the last available artifacts for inspection. Corrupt current metadata requires owner recovery review rather than guessing its version. These commands do not perform production rollback.
7. Delete the owner-review temporary staging directory after review. No diagnostics, live runtime-config file, bookings or emails were created in production. Preserve existing recovery backups and the STALE manifest.

A future deployment must carry public-config.php together with ask.php/widgets and only owner-reviewed runtime-config.json plus its previous valid version. Verify fixed-file permissions, deny write access from public PHP, check cache behavior and complete actual acceptance. Never deploy fixture exports in docs/admin as business content.
