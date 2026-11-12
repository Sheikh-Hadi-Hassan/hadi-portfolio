# Integration execution checkpoint, 12 November 2026

## Actual GitHub changes

The branch `integration/portfolio-final-20261112` was created from immutable source baseline `e3c7ee2e07f8f1bcaf3c1f66d7dcdb0a75e922ab` (`release/consolidated-20261111`). Existing `main`, `release/next`, recovery branches, provider settings and live Hostinger files were not changed.

1. Added [all 243 portfolio acceptance items](PORTFOLIO-243-TRACEABILITY-20261112.json), retaining original IDs, evidence, criterion, prior status, exact source-file matches and an explicit `NOT_REVALIDATED` state for the new branch. The historical 27 verified, 185 partial and 31 blocked statuses are NOT promoted by this work.
2. Added [full 17-branch reconciliation and migration decisions](BRANCH-RECONCILIATION-20261112.md). Historical production snapshots and old `app/` architecture are not merged into current generated `src/` architecture.
3. Marked two explicitly owner-excluded recovered source records, `Kruzz` and `Food Delivery Platform`, with `publication: excluded`. Their source images, links and provenance remain available in `src/data/archive-records.json`.
4. Updated `scripts/build.py` so the generated public archive omits excluded references. The source contains 30 historical supplemental references, 28 marked publishable, plus 15 first-party case studies. The intended resulting visible archive count is 43 instead of 45; this is a source-derived expectation, not yet a rebuilt-output observation.
5. Added `tests/archive-publication-policy.py`, checking preserved source inventory, explicit exclusion, current generator logic, image existence, and, when the local template output is present, rendered archive count/absence.

## Evidence obtained now

- Read-back through the connected GitHub repository confirms the new branch and all above files are present.
- Exact current source contains 30 historical records, exactly two exclusions, and a generator filter that uses the new publication field.
- Requirement register contains all 243 portfolio entries; 163 entries name at least one exact existing implementation path, and 80 have no exact path match under semicolon/comma splitting. Those 80 are NOT marked missing: many refer to external infrastructure, conceptual components, or descriptive strings rather than a literal file path. Remaining item-level review is still open.

## Not executed or not proven

No local Python tests, actual generated application build, full browser matrix, visual review, production link verification, PHP provider execution, credential access, Google Calendar/Meet/Sheet, real email or Hostinger deployment was executed in this change session. Earlier 198/198 browser evidence belongs to the unchanged November 11 release, not to this new content-filter commit. Do not advertise the current integration branch as fully tested.

The recovery-era `docs/content-recovery-20261110/check-archive.cjs` is a historical fixture that still asserts 45 cards. It must not be treated as a current acceptance result; update or replace the active browser fixture for the new approved 43-card publication policy while preserving dated historical reports.

## Immediate next executable actions on a checkout

```sh
# Run only in a clean, approved local checkout of this integration branch.
git fetch origin
git checkout integration/portfolio-final-20261112
npm ci
python3 tests/archive-publication-policy.py
npm run build:acceptance
python3 scripts/qa/acceptance-build.py --verify
python3 tests/archive-publication-policy.py
# Then run documented focused tests and the pinned 22-route x 9-width browser acceptance matrix.
```

Check exact environment, available disk and approved hero guard first. Inspect the resulting archive and project screenshots, rerun all changed-feature tests, then update the 243-item traceability report with evidence-bound new statuses. Old historical test reports are not silently rewritten. Do not call current integration work production-ready.

## Open owner or external gates

- Resolve historical design/effect equivalence (e.g., old PixelPortrait, SoundDock, FLOW / Systems Lab, current approved hero and reel).
- Validate recovered asset approvals, case-story authority and external portfolio URLs; test TMS as normal browser navigation.
- Inspect unpublished Mac work and verify local clone parity with remote integration branch.
- Read-only Hostinger PHP/private config and Google Apps Script deployed-version, scope and identity checks; no real booking or email until separately approved isolated tests.
- Manual recruiter/client journey, keyboard/screen-reader/mobile/performance assessment; exact output and owner visual signoff.
- Verify source-output build, rollback and approved deployment/merge boundaries before any production action.

Current verdict: **OPEN INTEGRATION; NO PRODUCTION GO.**
