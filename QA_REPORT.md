# Gate 6 — Portfolio production-readiness audit

**Decision: NO-GO. Gate 6 does not pass.**

Audit date: 21 October 2026, Asia/Karachi. Project: https://hadi.intellignce.net. Repository: Sheikh-Hadi-Hassan/hadi-portfolio. This report audits the existing deployed artifacts; it does not certify an editable application, authorize deployment, or advance to Prompt 7.

## 1. Baseline, provenance and evidence limits

- Baseline branch: `recovery/verified-production-20261021`.
- Baseline commit: `c4097990bccabea53af798eaf80012c239d6a418`.
- Baseline tree: `1d2647f9dafacd084283fb430dbf21932ae8971a`.
- Expected production files: **1,768**. The local verification script passed all 1,768 SHA-256/size checks. Every production path and Git blob fingerprint then matched the complete, non-truncated remote tree. That tree has 1,779 files including 11 recovery/documentation files.
- Two private configuration files are intentionally excluded. The sanitized backup alone cannot restore provider credentials or external service state. See the baseline README and PRODUCTION_VERIFICATION.md.
- The audit's initial HTTP check found all 17 public page HTML responses identical to captured bytes, plus matching selected CSS/JS, robots and sitemap. This is selected live parity, not a fresh authenticated recursive production inventory.
- **Interruption disclosure:** the execution environment reset after the first audit pass. Initial raw JSON files, screenshots and the local snapshot checkout were lost from scratch. Their tool execution results remain in the conversation. Initial results below are explicitly identified as recorded results, not claimed to be retained raw files. The remote baseline ref was rechecked after resumption; selected files and fresh HTTP/screenshot evidence were restored. No older source was substituted.
- Restored widget and site-script SHA-256 values match the baseline: widget `942a768afe2309a2dd3cf11fe939fdf3ad4622b499e5cd8f429ae5d911058b0f`; script `8e7eba8b384bccd283b8df11031ea8ca8793abcc61cfae742ef76fc269efc0ff`.

Evidence labels: **PASS** applies only to the executed check stated; **FAIL** means an observed defect or unmet release criterion; **BLOCKED** means insufficient safe access, infrastructure, approval or evidence. A subsystem with a passing health check can still have blocked end-to-end behavior.

## 2. Governing documents and prior gates

Read the current Library exports “CODEX STEP-BY-STEP COPY/PASTE GUIDE” (`Pasted markdown (2).md`) and the relevant observation/acceptance sections of “PORTFOLIO WEBSITE — PENDING FIXES & DEVELOPMENT NOTES” (`Pasted markdown(20261021-102759).md`). Also reviewed the earlier source-parity/gate report (`Pasted text(20261020-225340).txt`) and recovery documentation. Later SaaS planning sections do not expand this audit's scope.

| Gate | Evidence reviewed | Current disposition |
|---|---|---|
| 1: exact source and scope | Earlier report identified 935cf06/0279f05, differing repository structures and missing provider source | Deployed-file baseline now verified; matching editable build inputs still BLOCKED |
| 2: safe workspace and rollback | Recovery commit, inventory, restoration README | Artifact recovery PASS; full application/provider staging BLOCKED |
| 3: booking integrity | Documented false-confirmation incident; historical mocked test reports; current calendar search and captured gateway/widget | FAIL release criterion; no verified event for incident; root cause BLOCKED |
| 4: lead/security hardening | Captured PHP and widget, historical test assertions, public health/headers | Selected controls present; CRM persistence and adversarial regression BLOCKED |
| 5: SEO/scrolling/UX | Correct current page origins and crawl files, desktop inspection, pending feature branch | Selected SEO/desktop checks PASS; requested share/icon changes not live; responsive/performance acceptance BLOCKED |

Historical source bundle HEAD is `ebd3ae1d11a814179bc09db5a391b308d3429db9`. It contains application sources, tests and old JSON test reports. It does not contain exact objects 935cf06 or 0279f05 in the inspected bundle. Historical reports describe mocked Calendar/outbox/client success cases; they are **not rerun here and do not establish deployed Apps Script behavior**. The bundle was inspected separately, never installed or used as this audit's application source.

## 3. Environment and test safety

The recovery branch contains static HTML, navigation payloads, browser bundles, assets and PHP implementations. It lacks the corresponding verified editable build environment. No complete release-candidate staging stack could be established: local PHP is unavailable; provider test credentials, CRM test storage, versioned deployed Apps Script source, execution logs and isolated Calendar/mail sandboxes are missing.

A local Node fixture used the exact restored `acceptResult` function with in-memory mocks. It makes no network request. This is a narrow contract probe, not full staging or end-to-end QA. Browser interaction was read-only except ordinary local UI state, one availability lookup, and site-generated telemetry/cache activity inherent to viewing pages. No lead/booking submission, customer email, CRM write, calendar creation or configuration change was performed. No production files, GitHub main, integrations or deployments were changed.

## 4. Subsystem results

| Subsystem/check | Result | Actual evidence and boundary |
|---|---|---|
| Recovery snapshot integrity | PASS | 1,768 files; no missing paths, SHA-256/size failures or remote blob mismatches in initial pass |
| Corresponding editable source | BLOCKED | Retained bundle and main are not a verified build-to-production mapping |
| Full staging and regression suite | BLOCKED | No matched build inputs, PHP runtime, provider sandboxes or verified provider source |
| Public page HTTP routing | PASS | 17/17 page GETs returned 200 and matched captured HTML in initial pass |
| Case-study content preservation | PASS, static scope | All public HTML preserved; Morganics rendered with expected content during keyboard navigation |
| Gallery pointer navigation | FAIL, automated reproduction | Morganics pointer activation twice ended at Al Faraj Media; keyboard activation reached Morganics; see QA-03 |
| Other links/buttons/CTAs | BLOCKED for exhaustive claim | Local targets checked; menu opening/Escape/return focus and Sera launch observed; every interactive control was not exercised |
| Lead form rendering | PASS, entry-state scope | Sera conversation and booking entry UI opened; no contact form submission |
| Lead validation and CRM persistence | BLOCKED | No isolated CRM or approved live write; response health is not persistence proof |
| Sera configuration health | PASS | Fresh GET: version 9.0.0, available=true, READY; no secret values returned |
| Sera generated responses | BLOCKED | No model generation/grounding evaluation executed |
| Sera fallback, injection and private-data boundaries | BLOCKED | Static budget/redaction/schema controls reviewed; outage/adversarial behavior not transaction-tested |
| Booking availability | FAIL sampled request | 22 October lookup ended with timeout/retry state; no slot reserved; see QA-09 |
| Calendar/Meet booking integrity | FAIL release acceptance | Historical confirmed booking has no corresponding event in fresh bounded searches; provider root cause remains unverified |
| Customer and owner notification delivery | BLOCKED | No mail sent; Gmail evidence search failed with RATE_LIMIT_EXCEEDED/PERMISSION_DENIED |
| WhatsApp/mail/external links | PASS syntax; destination behavior BLOCKED | Href schemes and intended public contact destinations inspected; no messages or external account operations |
| Error/loading behavior | PASS selected; full matrix BLOCKED | Missing route returned 404; availability loading visible; no broad outage simulation |
| Desktop homepage overflow | PASS at observed viewport only | At 1363×936, document scrollWidth/clientWidth both 1348; no nested light-DOM vertical scroller detected |
| Modal/picker scrolling | BLOCKED for full acceptance | Picker has internal scroll; shadow DOM, scroll chaining, keyboard and small-screen coverage not fully measured |
| Mobile/tablet layout | BLOCKED | Supported browser interface did not expose viewport emulation; no mobile/tablet screenshots or breakpoint certification |
| Typography, spacing, crop and colour | PASS visual sample only; full audit BLOCKED | Desktop screenshot shows readable hero/title/CTA composition; no exhaustive pixel/contrast audit |
| Accessibility/keyboard | FAIL selected; broader conformance BLOCKED | Four missing skip-link targets detected; keyboard Morganics activation works; full focus trap, screen reader and contrast tests absent |
| Animations/reduced motion | BLOCKED | Animation observed and static CSS reviewed; no controlled reduced-motion/device matrix run |
| Image optimization | BLOCKED overall | No complete rendered-byte budget/network waterfall; one served portrait fingerprint differed from capture and needs CDN/content reconciliation |
| Canonical and domain references | PASS selected live scope | 17 public routes checked; production-origin canonical tags and deployed robots/sitemap observed |
| Open Graph/Twitter declarations | PASS existing declaration; FAIL requested artwork | Live image still points to hadi-speaking-original.png; supplied preview asset returns 404 |
| Favicon | PASS existing SVG; FAIL requested replacement | Existing /assets/favicon.svg returns 200; requested root /favicon.ico returns 404 |
| Robots/sitemap | PASS initial basic check | Both HTTP 200, exact captured bytes, production-domain sitemap directives; sitemap lists the 17 public routes |
| Structured data | PASS syntax only | 17 JSON-LD blocks parsed; not a rich-result eligibility certification |
| Core Web Vitals | BLOCKED | No CrUX/RUM/Lighthouse results; browser sandbox did not expose Performance API for measurement |
| API rate limits/validation | BLOCKED runtime | Controls reviewed in PHP, but no abuse/load/invalid-input test campaign against production |
| Authentication/authorization | BLOCKED full assurance | Provider identities/scopes/admin access not verified; Origin and UUID checks are not proof of authorization |
| Secrets handling | PASS snapshot exclusions; broader assurance BLOCKED | Exclusions and original sanitization evidence retained; private runtime stores and provider settings not inspected |
| Security response headers | PASS selected controls; FAIL hardening target | CSP, nosniff, frame denial, referrer and permissions policies present; no HSTS, no script-src/default-src in observed policy |
| Restore drill/operations | BLOCKED | Restoration documented; no isolated full restore, monitoring or provider recovery drill performed |

## 5. Issues, reproduction and priority

### QA-01 — P0: booking confirmation integrity remains unproven (FAIL)

The notes document booking `HADI-f603e552-3429-476f-a943-36ec896a1944`, “Hadi Booking QA Test”, 21 October 2026 at 13:00 Asia/Karachi for 30 minutes, with a Meet URL and confirmation notices. The notes report no matching event. During this audit, all 11 returned calendars were searched read-only for 12:30–14:00 Asia/Karachi on 21 October. **Every search returned zero events and no continuation token.** This confirms absence from the currently connected calendars/window; it does not prove whether an event was created elsewhere, later deleted, or written with an incorrect timestamp/identity.

Reproduce safely: inspect the existing reference and provider executions around 20 October 2026 16:11 UTC, without submitting another booking. Obtain the actual event ID, configured calendar ID, deployment/version, executing principal, insertion response and error logs. Read the event by ID and compare owner, start/end, timezone and conference status. No execution/Cloud logs or immutable deployed Code.gs were available here, so the exact root cause is **BLOCKED**, not asserted.

Release requirement: a confirmation must correspond to a verified Calendar event in the intended calendar. A Meet URL or email is insufficient. If provider verification is unknown, retain PENDING/FAILED and the same idempotency reference; reconcile before retrying or notifying.

### QA-02 — P0 release blocker: matched source and isolated provider test environment missing (BLOCKED)

Clone/inspect the recovery commit: it is deployed output, not the original build workspace. The available historical bundle is not byte-mapped to this capture. PHP is not installed locally. No isolated CRM/mail/calendar setup is available. Consequently Gates 3–5 implementation tests cannot be reproduced against an exact release candidate. Do not install or deploy the historical bundle as a substitute.

Fix priority: recover the original editable inputs and immutable Apps Script deployment source, establish a build/artifact mapping, then provision isolated test doubles/sandboxes and run the required integration scenarios.

### QA-03 — P1: unstable pointer activation in animated project gallery (FAIL automated path)

Steps executed at desktop viewport: open homepage; activate locator `a[href="/morganics/"]` with pointer click; inspect settled URL/H1. Twice the destination was `/al-faraj-media/` with H1 “Al Faraj Media”. Returning and activating the same href with Enter reached `/morganics/` with H1 “Morganics”. Screenshot: `evidence/gallery-navigation-result.jpg`.

This is evidence of an automated pointer/animation interaction defect, not proof that the href itself is wrong. Root cause and manual pointer/device reproduction are still required. Suspected areas: moving gallery transforms while scrolling into view, overlapping hit areas, animation stabilization and click target geometry. Preserve the animation; stabilize hit testing and test click, tap and keyboard parity.

### QA-04 — P1: requested social preview and favicon are not deployed (FAIL)

Fresh homepage metadata still advertises `/assets/hadi-speaking-original.png`. GET `/assets/hadi-hassan-social-preview-20261021.png` and `/favicon.ico` returned 404. The existing SVG favicon remains valid. Earlier LinkedIn screenshot showed an image-less “Get Appointment” card, but a live LinkedIn cache refresh was not executed during this audit.

Prepared feature branch `feat/social-preview-image-20261021` last recorded commit `e87540a329a2218404994a6d2fc53174d2f7ff78` is separate from the baseline and is **not deployed**. Its QA does not count as live QA. After separate authorization and live parity checks, publish image files before metadata, verify public MIME/dimensions, then inspect platform caches. This report authorizes none of those changes.

### QA-05 — P1: end-to-end lead, AI, mail and failure-path evidence missing (BLOCKED)

GET READY responses establish configuration only. They do not prove CRM persistence, deduplication, successful model generation, prompt-injection resistance, notification delivery or reconciliation. Reproduce these in isolated staging with deterministic fixtures, duplicate requests, provider failures, timeouts and retry cases. Do not test by sending real customer messages.

### QA-06 — P2: broken skip targets on auxiliary pages (FAIL static)

The initial 22-file HTML scan found links to `#main-content` without a matching ID in `404.html`, `404/index.html`, `_not-found/index.html` and `studio-preview/index.html`. Public portfolio pages did not have this reported finding. Reproduce by opening each file and resolving the fragment target. Add a real main target and verify keyboard focus behavior.

### QA-07 — P2: limited browser hardening (FAIL hardening target, no exploit proven)

Observed policy: `upgrade-insecure-requests; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'`. No HSTS header was observed and script execution sources are not restricted by script-src/default-src. Existing headers provide useful protections; this is not evidence of an exploitable XSS vulnerability. Plan a report-only CSP rollout compatible with inline Next.js data, embeds and Sera, and assess HTTPS/subdomain compatibility before HSTS. Do not change live policy during this gate.

### QA-08 — P2: release manifest and asset provenance require reconciliation

Baseline documentation records an outdated deployed RELEASE-MANIFEST.json. The inventory is the checksum authority for this capture, not that older manifest. The initial HTTP check also reported a differing response hash for the old preview portrait. The attempted follow-up image-format/CDN check did not survive the reset; its cause is unresolved. Verify CDN negotiation/transformation versus actual file drift before replacing assets or declaring a new deployment baseline.

### QA-09 — P1: availability lookup timed out (FAIL sampled request)

Open Ask Sera → Book a call → select Thursday, 22 October 2026. Loading was displayed, then the interface showed “Availability is taking longer than expected. Please retry; no time has been reserved.” and a Retry times control. No slot was selected and no booking/contact submission occurred. Screenshot: `evidence/availability-timeout.jpg`. This is one observed failure, not an uptime statistic; the provider/network/runtime cause is unverified. Investigate request timings and Apps Script execution/quotas, then test successful, timed-out and retried availability in staging.

## 6. Booking implementation trace and safe fixture

Captured frontend: `production/intellignce-support/widget-v9.js`, request/acceptResult/submit/refreshMeeting functions (approximately lines 155–160). Gateway: `production/api/leads.php`.

1. Widget creates a UUID, retains pending payload and sends protocol 8 actions to `/api/leads.php`.
2. Gateway locates private URL/key configuration, checks same-origin requests, caps body size, applies file-lock-backed per-IP rate limiting and forwards through HTTPS cURL to Apps Script. Availability has a short cache; unknown write outcomes can return HTTP 202/pending.
3. Gateway does not independently look up a Google Calendar event; it propagates the upstream result. Calendar identity, insert/readback and email/outbox enforcement therefore depend on the deployed Apps Script.
4. Widget accepts `booked` plus `booking=true` and a shaped reference. Its compatibility path can map a legacy response to booked. It does not require a Calendar event ID.
5. Executed local fixture supplied a successful-looking booked response with **no Calendar event ID**. The exact captured acceptResult function accepted it and emitted “Your call is reserved. The Google Meet link is ready below.” See `evidence/client_fixture.json`.

The fixture proves the browser trusts the upstream contract; it does **not** prove a real backend emitted that fabricated response, and client-side event verification would not replace authoritative backend verification. Investigate the provider contract first. Historical Code.gs and mocked outbox tests cannot establish what the active deployment executed.

## 7. Tests actually executed

| Test | Actual result | Evidence retention |
|---|---|---|
| Baseline verify_snapshot.py | PASS: 1,768 included files, failures=[] | Initial tool output recorded; local raw checkout lost at interruption |
| Remote tree path/blob comparison | PASS: 1,768 production entries matched; non-truncated tree | Initial tool output; remote ref rechecked after resume |
| Public page GET sweep | PASS: 17 HTTP 200, exact captured HTML | Initial recorded output; per-request raw JSON lost |
| Static references | 22 HTML files, 1,566 checked local reference occurrences; no missing local file targets reported; four missing fragment targets | Initial recorded output; not a CSS URL/runtime request audit |
| JSON-LD parse | 17 valid, zero invalid | Initial recorded output; semantic schema validation not run |
| JavaScript syntax | 39 files checked, zero failures | Initial recorded output; restored widget/script rechecked with Node, both exit 0 |
| HTTP sweep | 31 GETs; expected nonexistent-route 404; requested new image and favicon 404 | Initial output; five key GETs repeated with retained raw headers/results |
| Readiness GETs | Leads v8 READY; Sera v9 READY | Retained `evidence/resumed_http.json` |
| Calendar read-only search | 11 calendars, zero overlapping events in documented window; no paging needed | Tool output recorded, summarized here; customer records not exported |
| Gmail incident search | Failed: RATE_LIMIT_EXCEEDED / PERMISSION_DENIED | Recorded tool error; no mail read/send success claimed |
| Local booking contract fixture | Accepted fabricated booked response without event ID | Retained executable fixture and JSON output |
| Desktop browser | Home/menu/Sera/picker observed; Escape returned focus; gallery pointer mismatch and keyboard success | Two pointer navigation attempts plus keyboard control; retained screenshots |
| Availability loading/failure | Date 22 October selected; loading changed to timeout/retry; no reservation | Retained loading and timeout screenshots |
| Browser performance API | Unavailable in browser evaluation sandbox | No timing/CWV score produced |
| Mobile/tablet, PHP execution, load/abuse, AI adversarial, CRM/mail/Calendar E2E, full restore | NOT EXECUTED / BLOCKED | No PASS implied |

Reproduction commands for an independently cloned baseline:

```bash
git clone --branch recovery/verified-production-20261021 https://github.com/Sheikh-Hadi-Hassan/hadi-portfolio.git
cd hadi-portfolio
git rev-parse HEAD
python3 verify_snapshot.py
find production -name '*.js' -exec node --check {} \;
```

Expected HEAD is exactly the baseline commit above. The contained read-only fixture can be run with `node client_booking_fixture.cjs`. `resume_checks.py` performs only selected GETs and syntax/fixture checks; its relative baseline file layout is provided in the evidence bundle. None of these commands is a full application or Calendar end-to-end test.

## 8. Visual, performance and accessibility limitations

Desktop evidence was captured at 1363×936. The homepage has a coherent purple/black visual theme with a large portrait, clear title and contrasting CTA in the sampled view. This is a visual observation, not an Awwwards assessment or WCAG certificate. Entire-page typography, labels, pixel contrast, image crop behavior and device-specific touch targets remain unaudited.

The initial light-DOM scroller scan did not traverse Sera's shadow root. Do not interpret it as proving all dialogs are free from nested scrolling. The booking picker screenshot shows its internal scroll area; background locking, scroll chaining and mobile overscroll require dedicated tests. No responsive CSS changes were made.

For future acceptance use real mobile/tablet/desktop device or emulation coverage, keyboard/screen reader checks and measured WCAG 2.2 AA contrast/focus results. For performance use lab traces plus field/RUM evidence; do not substitute HTTP elapsed time, compressed file sizes or a single desktop screenshot for LCP/INP/CLS.

Primary verification references consulted: [Google image SEO](https://developers.google.com/search/docs/appearance/google-images), [Open Graph protocol](https://ogp.me/), [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [OWASP CSP guidance](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html), [OWASP HTTP headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html), [Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds). These are references, not tests passed by this site.

## 9. Recommended order and gate exit criteria

1. Recover exact build inputs and deployed Apps Script source/version, execution identity, target calendar and incident logs. Preserve the captured baseline.
2. Resolve QA-01 in isolated staging: require provider event readback with matching identity/time before confirmation. Cover timeout-after-insert, duplicate UUID, cancellation, parallel bookings, timezone boundaries, missing permissions and provider outage. Correlate event ID, booking reference, CRM row and each notification.
3. Verify CRM persistence/deduplication and Sera/public boundaries with deterministic failure and adversarial fixtures; test notification outbox and recovery without real customers.
4. Reproduce and fix animated-gallery pointer/tap hit testing; verify keyboard and reduced-motion parity. Complete mobile/tablet/desktop accessibility and visual regression.
5. Independently review the prepared social/favicon feature branch against current production; only after a separate release approval, deploy and test crawler image access and caches.
6. Correct skip targets, reconcile release manifests, evaluate CSP/HSTS safely, measure performance and complete a full restore drill.

Gate exit requires no unresolved critical booking/security/data-loss defects; a matched release candidate; successful isolated lead-to-CRM-to-Calendar/Meet-to-notification evidence; the responsive/accessibility/performance acceptance matrix; and owner review. **Do not advance to Prompt 7 automatically.**

## 10. Recovery, rollback and exact change scope

Recovery reference: [verified baseline branch](https://github.com/Sheikh-Hadi-Hassan/hadi-portfolio/tree/recovery/verified-production-20261021) at `c4097990bccabea53af798eaf80012c239d6a418`. Restore first to an isolated compatible PHP environment, verify inventory, securely supply excluded configuration, and validate integration/provider state. Git does not back up Google Calendar/CRM/email state or restore secrets. Do not blindly overwrite changed production files.

This phase creates QA_REPORT.md, audit evidence, screenshots and a local read-only fixture only. Documentation working branch: `audit/gate6-production-20261021` (delivery verifies its final commit separately). No application fixes, production changes, merges, deployments, live data writes or messages were made. The recovery and social/favicon branches remain separate. Any separately saved audit branch is documentation-only and does not imply a deployment candidate.

**Final recommendation: NO-GO. Submit this Gate 6 report for owner review and stop.**
