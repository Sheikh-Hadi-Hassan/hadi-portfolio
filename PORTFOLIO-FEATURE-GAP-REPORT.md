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
