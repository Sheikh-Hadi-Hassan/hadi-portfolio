# Hadi portfolio v104 scrolling release candidate

Original Site: https://hadi-hassan-editorial.lemony-morel-0696.chatgpt.site/
Original saved version: 104
Original source commit: 66e3e1df67331a92b2966dcab9724e70c8f11d90

Source was retrieved from the original Site repository, not recreated or taken from the older GitHub branches. All tracked original assets and portfolio content are retained.

Changes: homepage sections now grow with their content rather than owning nested vertical scrollbars; the process inner container follows document scrolling. The portrait stage retains an explicit viewport height. Horizontal rails, modal scrolling, GSAP animation stages, hero, Sera v9, CRM, email and calendar source are preserved. Two stale test harnesses were aligned with current loader timing and calendar mocks/settings. Hostinger packaging now includes the current PHP gateway and original security headers instead of overwriting them with legacy versions.

Validation: Next production build and automated tests run locally. Mocked integration tests validate behavior, not actual provider delivery. See audit/release-v104/ for results. Browser layout/interaction QA could not run because the supported browser capability is unavailable. PHP runtime is unavailable locally; PHP parser checks do not replace execution.

Read-only Hostinger checks returned 403 at / and 404 at /archive/, /morganics/, /community-campaign/, /api/leads.php and /intellignce-support/ask.php from this environment. These observations do not establish the server configuration or validate the new package. No live files, calendar events, leads, emails, Apps Script deployments, secrets or live Site deployment were changed.

This is NOT certified production-ready. Before release: test responsive layout and scrolling on desktop/mobile, confirm API readiness using existing private server configs, verify one authorized test enquiry/booking through the actual Sheet, Calendar, Meet and inboxes, and confirm the Apps Script deployment matches the preserved source.

Hostinger: extract into a separate staging directory first. The ZIP contains web-root contents. Preserve existing private config files. PHP 8.2+ with cURL is required. Existing private API keys and Google Apps Script properties are intentionally absent. Uploading a ZIP cannot migrate Apps Script or private CRM data. Do not replace the live site until acceptance passes.
