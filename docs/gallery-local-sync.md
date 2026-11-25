# Gallery PR #19 — local sync and QA

Draft: https://github.com/Sheikh-Hadi-Hassan/hadi-portfolio/pull/19

Run only from the existing source directory serving port 3003. No new clone/worktree, checkout, reset, or stash.

1. Inspect process and status: `lsof -nP -iTCP:3003 -sTCP:LISTEN`, `pwd`, `git status --short`.
2. Bootstrap the new sync script using the standalone code in the handoff response.
3. `bash scripts/qa/sync-gallery-local.sh --check`
4. If safe: `bash scripts/qa/sync-gallery-local.sh --apply`
5. `bash scripts/qa/gallery-local-qa.sh --unit`
6. Stop the port-3003 dev server. Run `bash scripts/qa/gallery-local-qa.sh --build`.
7. Restart `PORT=3003 npm run dev`, then in a second terminal run `bash scripts/qa/gallery-local-qa.sh --browser`.

Private Admin approval and staging are not production publishing. Apps Script changes require separate owner-authorized deployment. No live site changes until explicit approval.
