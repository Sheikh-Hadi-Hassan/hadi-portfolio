# Portfolio feature gap report

2026-11-03 checkpoint. See requirements matrix for per-feature acceptance and files.

|Priority|Plan requirement|Observed implementation/gap|Action and verification|
|---|---|---|---|
|P0|Pending remains unconfirmed|Source formerly returned booked with pending Meet; old tests asserted that behavior|Corrected both Apps Script copies, Sera legacy response handling and acceptance guard. Local contract tests pass; deployed-version evidence and full persistence correlation still required.|
|P0|Production identity before booking acceptance|Web-handler PHP/cURL, actual selected config and Apps Script deployed revision unknown|Reuse reviewed kit and sanitized owner evidence; no live tests until gates and explicit authorization.|
|P0|Durable exactly-once intent|Deterministic event IDs/locks/outbox exist, but mail send then metadata write has a crash window|Use isolated failure harness; document reconciliation/at-least-once limits before promising no duplicate notification.|
|P0|Clean release build|npm verify stops on absent historical hero-lock; CI documents a separate build path|Do not invent an approval baseline. Restore authenticated approved lock or have owner approve documented replacement policy.|
|P0|Accurate manifest/reversible release|Manifest remains STALE|Generate only from validated candidate; compare full production, preserve recovery and private/live data; approval required.|
|P1|Accurate privacy disclosure|Footer named OpenAI while active gateway targets Google Gemini|Corrected source footer; source/generated copy and browser checks needed. Consent UX still requires audit.|
|P1|Complete journeys/routes/resume|Template generator supplies home/archive/case studies; standalone utility coverage is not accepted|Trace advertised links, verify original resume and utility route requirements before implementation.|
|P1|Responsive/accessibility/SEO/performance|Source and unit coverage exist; full browser acceptance incomplete|Nine-width actual browser checks, keyboard/reduced-motion/axe, export SEO and measured performance.|
|P1|Booking management|Cancelled state recognized; full cancel/reschedule workflow not accepted|Implement safe owner flow after integration identity, isolated fixtures and scope confirmation.|

No live integration success, email delivery or WCAG conformance is claimed. Studio OS/Flow Connect remain separate roadmap work.

## Additional fixes in this checkpoint

- P0 dependency advisory: Next.js 16.4.0 upgraded to 16.4.4, lockfile updated; registry audit now reports zero known findings.
- P1 image cache corruption: `scripts/optimize-images.py` now verifies cached WebP dimensions/format and writes atomically; `tests/image-cache.py` exercises empty and corrupt entries. Export image audit passes after regeneration.
- P1 homepage overflow: inherited dock label font size, footer width plus margins, and tablet service gutters corrected in command/footer/brand CSS. Browser harness covers all nine requested widths and menu open/Escape.
- P1 five invalid ARIA labels: statistic wrappers now carry an appropriate accessible role. Automated homepage axe scan is separate from full WCAG/manual acceptance.

Browser tests require `npm ci`, `npx playwright install chromium`, then `node tests/browser-v01.cjs` (or set CHROMIUM_PATH to a trusted existing browser). They block external requests and never submit forms. Run only after export completes. Generated build files are not a release artifact until all acceptance gates pass.

## 3 November continuation evidence

Added About, Work, Contact, Privacy and Resume routes using existing shared layout. Menu includes About/Resume/Contact; original 2026 CV PDF included with pinned SHA-256 identity. Fixed utility breadcrumb labels and removed spurious Portfolio ancestor for utility pages. Existing Archive/project data retained.

Commands and current results:

- `python3 scripts/build.py && python3 tests/utility-routes.py`: PASS, 22 source-template routes, 5 new utility pages, original PDF and unchanged home/hero/shared CSS. This is not the gated production export.
- All 20 non-browser JavaScript suites: PASS, individual results in `docs/v01-local-test-results.json`.
- `python3 tests/source-assets.py`: PASS (461 existing source asset references).
- `python3 tests/package-security.py`: PASS.
- `python3 tests/image-cache.py`: PASS.
- `npm audit --json`: zero known vulnerabilities in current lockfile.
- `npm run build`: FAIL at unchanged integrity guard because approved `design/hero-lock.json` is missing. No bypass performed.
- `node --check tests/browser-v01.cjs`: PASS syntax. Runtime suite BLOCKED at integrity prerequisite. All 198 route/width cases are explicitly blocked in `docs/v01-all-route-browser-results.json`.
- Current production-export SEO/image/hydration/type/build checks and manual keyboard/screen-reader/contrast acceptance remain BLOCKED after the new route changes. Earlier passing evidence is historical and is not promoted to a current pass.

Hero investigation: no file in current snapshot, no PDF/hero lock in preserved hosting ZIP, no exact-name Library lock result; GitHub default-branch and integration-branch path-history queries returned no commits. This is bounded evidence, not proof that no artifact exists anywhere. Required owner artifact: original approved `design/hero-lock.json` with provenance, or explicit approval of a replacement baseline. Current hero inputs remain byte-identical to checkpoint. No automatic baseline generation.

P0: hero integrity/build gate, authenticated runtime/config/Apps Script identity, cleanup and authorized E2E booking gates; notification send-before-record crash ambiguity remains. P1: full original-plan atomic mapping, all-route visual/accessibility/SEO acceptance after build, consent/privacy completeness and cancellation/rescheduling acceptance. Manual browser checks were not performed in this continuation.

Manifest STALE. NO-GO. Production, main and recovery remain untouched. No real booking, email or diagnostic deployment. Existing five-report checkpoint remains in the development branch; this continuation does not claim every local task is finished.
