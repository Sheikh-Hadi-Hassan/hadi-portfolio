# V0.0 — Source parity and Apps Script evidence
Date: 21 October 2026 (Asia/Karachi)
Decision: **NO-GO for beginning isolated V0.1 remediation.**
Scope: investigation, disposable local build and documentation only.

## Gate results
| Gate | Result | Evidence |
|---|---|---|
| Classify all 21 differences and 143 absent paths | PASS | PATH_CLASSIFICATION.csv / .json: 164 unique rows, both hashes where available, source counterparts, semantic explanation, origin, confidence and unresolved input |
| Explain artifact/package relationship | PASS, bounded | Preserved Hostinger ZIP matches 1,756/1,768 production paths; 10 differ and two are absent |
| Reproduce complete production export | BLOCKED | Exact lockfile install unavailable; build stops at missing Next executable |
| Exact editable-source-to-production parity | BLOCKED | Post-package patches and original toolchain provenance remain missing; package similarity is not source parity |
| Verify actual Apps Script deployment/Version 7 | BLOCKED | No supported authenticated script-source/deployment/log capability found |
| Locate incident Calendar record | PASS | Exact event-ID read returns matching event, currently cancelled |
| Identify incident cancellation actor/time and provider sequence | BLOCKED | Not exposed by Calendar connector; execution/audit logs absent |
| Preserve release boundary | PASS | Documentation-only derivative of latest remediation; original source tracked files, retained dist, production, main and recovery unchanged |

Parent: remediation/gate6-source-booking-20261021 at 9168c0b656b57fb5af448a16d4e943dae36bd12d.
New branch: docs/v00-source-parity-evidence-20261021. Its containing commit is this evidence revision.
Production baseline remains c4097990bccabea53af798eaf80012c239d6a418.
No prior audit/history sampling was repeated. The prior report and all four supporting JSON files were read; local report was matched to its GitHub blob.

## 1. What the 164 paths mean
The earlier comparison used pre-Next dist/ at original Sites source 66e3e1df67331a92b2966dcab9724e70c8f11d90. It was not a comparison against a completed Hostinger package.

All 143 absent paths are individually classified:
| Purpose | Paths |
|---|---:|
| Generated output: Next routes, Flight/navigation streams, chunks, CSS/build manifests | 114 |
| Application code/public support files/styles | 18 |
| Hosting configuration/example configurations | 4 |
| Assets/licenses/synchronization residue | 4 |
| Deployment-only release documents and renamed old gateway copy | 3 |
| Private configuration or customer runtime records | 0 |

Seventeen absent paths have exact source counterparts at public/ or integrations/hostinger-runtime/. In particular api/leads.php and consultation.php already match production; public/.htaccess, Bayfi styles, Sera knowledge/engine/support files also have exact counterparts. Absence from dist alone did not imply missing editable bytes. Two private production configurations remain excluded from all comparisons and publication: hadi-leads-config.php and intellignce-support/private-config.php. Example files were classified separately; runtime secrets were neither requested nor read.

All 21 differing paths were inspected individually:
- Seventeen public HTML pages differ between template dist and Next export. HTML_SEMANTICS.json records each title, canonical and framework payload count; PATH_CLASSIFICATION records both SHA-256 values and page-specific provenance. Sixteen match the preserved Hostinger ZIP exactly.
- robots.txt, sitemap.xml and image-sitemap.xml differ only by replacing the original Sites origin with https://hadi.intellignce.net. The fresh partial build reproduces all three byte-for-byte.
- style.css is exactly src/styles/site.css + one newline + the complete production appbar.css. This is a proved byte relationship, not recovered authorship.

The preserved Hadi-Portfolio-v104-Hostinger-Release-Candidate.zip has SHA-256 1b80993344c81cfaab5066b16b39b653d06e5c4f58c9a976482bd12b6cee5566. Every included production path was hashed against this existing artifact: 1,756 exact,10 different,2 absent. No new production capture was taken. Full per-path evidence is release-zip-full-comparison.json.

The remaining 12 package-versus-production paths are:
| Paths | Meaning |
|---|---|
| style.css | Appended responsive dock/navigation patch |
| appbar.css | Added standalone copy of the same navigation rules |
| index.html | Enquire anchor removed in HTML and serialized Flight, with adjusted Flight text length |
| intellignce-support/widget-v9.js and aliases widget-v4.1.js, widget-v5.js, widget-v6.js, widget-v7.js, widget-v8.js, widget.js | Seven exact copies of one patched 197,513-byte widget; mobile visualViewport/header styles, AI consent handling and appbar/Home/WhatsApp compatibility injection |
| intellignce-support/ask.php | Substantially updated AI gateway: READY GET, configuration loader, schema/context/history, redaction, per-attempt budget and bounded model fallback |
| intellignce-support/ask(1).php | Added retained copy, exactly matching the old source gateway; not secret data |

The seven widget SHA-256 values are identical: 942a768afe2309a2dd3cf11fe939fdf3ad4622b499e5cd8f429ae5d911058b0f. Active ask.php differs from ask(1).php. Renamed-file intent remains unknown; no endpoint was executed.

These are strong signs of post-package edits. Original patch author, revision, timestamps and exact application procedure are unavailable. Diagnostic comparisons do not convert generated output into recovered original source.

## 2. Packaging provenance recovered
The retained source bundle HEAD ebd3ae1d11a814179bc09db5a391b308d3429db9 differs from original Sites104 in33 tracked paths, including src/styles/viewport-frames.css, generated output/tests and packaging.

Its package-hostinger.py explains the Hostinger overlay: copy current integrations/hostinger-runtime, preserve public/.htaccess, restore support files removed from the Sites export, reject private filenames and emit release manifest/status. Original66 packaging instead overlays a legacy leads gateway and simplified .htaccess. Therefore the original66 packaging command by itself is not demonstrated to produce the deployed gateway/headers.

packaging-provenance.json records this distinction. The bundle was inspected, not substituted into the controlled66 checkout. The package's manifest still labels base source66; that label is not proof that later packaging or application changes were absent.
Nine distinct blobs at the relevant source locations (public widget, integration gateway, source/public styles) were checked specifically for the four unresolved production fingerprints. None matched. This targeted check differs from the completed dist history sample and is recorded in targeted-source-provenance.json.

## 3. Controlled build: commands and actual result
A separate clone at /workspace/scratch/9870f80c5674/v00-build was checked out detached at66. The recovered source and retained dist were not modified.

Observed toolchain: Node24.19.0, npm11.9.0, Python3.12.14, Pillow12.3.0, Linux. Lockfile v3 has96 package entries; Next requires Node>=20.9.0. The original exact Node/npm/Pillow versions are unrecorded. No root engines or packageManager pin exists. Main package versions remain Next16.4.0, React/ReactDOM19.3.0, GSAP3.15.0, Three0.185.0. BUILD_RESULT.json includes lockfile/package hashes and all locked versions, resolved tarballs and integrity values.

package.json/build scripts, export config, dependency lifecycle flags and both packaging variants were reviewed before execution. No hasInstallScript flags were found in the lockfile; dependency lifecycle execution was disabled. Build preparation uses local file transforms and a VM-rendered fictional email/CRM design preview, not real integration actions. PHP and live Apps Script handlers were never executed. No production credentials were loaded.

Commands attempted (logs retain the exact npm workflow):
```bash
git clone --no-hardlinks --no-checkout <recovered-local-repository> <disposable-checkout>
git checkout --detach 66e3e1df67331a92b2966dcab9724e70c8f11d90
npm ci --ignore-scripts --offline --no-audit --no-fund
npm ci --ignore-scripts --no-audit --no-fund --fetch-retries=0 --fetch-timeout=15000
SITE_URL=https://hadi.intellignce.net NEXT_TELEMETRY_DISABLED=1 npm run build
```
npm was launched with an explicit minimal environment/PATH and disposable npm cache, excluding inherited credentials. Offline install failed ENOTCACHED for tslib2.8.1. Network install failed EAI_AGAIN resolving registry.npmjs.org for locked packages, followed by npm's “Exit handler never called” exit1. This does not prove that the specified package versions are nonexistent.
Network namespace/ptrace hard-isolation attempts were denied by the runtime and launched no application build. The subsequent reviewed local preparation chain ran without credentials; it contains no live booking/mail/CRM network operations. No full Next execution occurred because its executable was missing.

Actual build:
- PASS: prepare local example previews, hero lock,17 template pages, responsive image preparation,17 Next route inputs.
- BLOCKED: next build --webpack, exit127, next: not found.
- NOT EXECUTED: downstream pruning, full export hydration check, runtime export synchronization, compaction/staging and Hostinger ZIP packaging.

The authored build script explicitly uses DEPLOY_TARGET=sites during runtime sync and strips PHP before Sites staging. Hostinger requires the recovered candidate packaging overlay afterward. Do not remove that distinction or silently alter the build script.
Documented packaging command, not executed:
```bash
python3 scripts/package-hostinger.py /absolute/path/website.zip
```
Its behavior must be tied to the selected revision; original66 and bundleHEAD implementations differ.

Fresh partial dist comparison: 1,607 exact,18 different,143 absent (partial-build-comparison.json). There is no fresh full out/ or accepted export, and no reproducibility PASS. Next build IDs, serialization and image-library output may vary, but no unresolved mismatch was dismissed as “nondeterminism.” Such differences require a controlled successful build and explicit per-path explanation.

## 4. Actual Apps Script Version 7
Historical Code.gs reference hash remains b5c4baf9ac8ec4ed34fa86f4a8d4c33b21f616c43bf3c3c9299e19b6f877f96d; it is not a fresh active-deployment attestation. Prior script-history evidence is reused. Candidate code does not match that hash.

A new capability discovery found no Apps Script source/deployment/execution-log connector. Existing Drive's previously empty Apps Script discovery is reused. Targeted reads of the project's pending notes/handoff yielded no actual script-project URL. Available browser context showed only the public portfolio and blank tab; the earlier unsuccessful editor/authentication investigation was not repeated.

| Evidence item | Status |
|---|---|
| Actual script project ID | BLOCKED |
| Web-app deployment ID mapped to active immutable version | BLOCKED; historical identification only |
| Immutable Version7 Code.gs and appsscript.json | BLOCKED |
| Active execute-as principal/access mode | BLOCKED; candidate identity is not deployment proof |
| Intended calendar configuration in active script | BLOCKED |
| Connected target calendar permission | PASS, bounded: connected account has owner role; not proof of executing script's OAuth/ACL |
| Active script timezone/scopes/triggers/redacted properties | BLOCKED; candidate manifest cannot establish active settings |
| Execution/Cloud logs at20Oct16:11UTC | BLOCKED; unavailable here, not proven expired or nonexistent |

Do not redeploy, reauthorize, run setup or modify triggers to collect this evidence.

## 5. Incident: new authoritative fact
A narrowly targeted read-only CRM search found the exact reference in Leads row7. Follow-up reads retrieved only relevant status/timing/event-ID/delivery cells, not customer contact or brief columns. Raw rows and recipient details are excluded from this branch.

Recorded state: received20Oct16:11:32.442UTC, Booked, call start21Oct08:00UTC, notification Sent and two owner delivery flags. Event ID: hadif603e5523429476fa94336ec896a1944.

An authenticated Calendar read of that exact ID in the intended candidate calendar returns:
- status: **cancelled**
- start:21Oct2026 13:00+05:00
- end:13:30+05:00
- matching incident reference and Meet link
- organizer matching the expected owner

This supersedes the interpretation that the event might never have existed. A matching Calendar record exists and is currently cancelled. Prior bounded event searches returned no active match; they did not establish noncreation.
The current row remains Booked/Sent while the Calendar record is cancelled. Whether the application promises cancellation synchronization or when that discrepancy arose remains unverified.

Not established: cancellation actor/time, event creation timestamp, event status at confirmation, immutable deployment code that executed, request/response bytes, provider latency, outbox ordering or notification delivery. Calendar's exposed schema omits audit timestamps/actor. Spreadsheet timezone is America/Los_Angeles, while the recorded ISO instant and Calendar time agree at13:00PKT; this alone does not establish a timezone bug.
No new booking, Calendar mutation, email, CRM write or availability request was made. The old frontend fixture was not rerun and is not used to infer the live cause.

## 6. One consolidated owner-input list
All independent investigation feasible here is completed. Minimum remaining inputs:
1. **Post-package patch provenance:** original revision/export or patch files and application record for appbar/style, homepage Enquire removal, the patched widget and updated ask.php. One widget file suffices if its seven-alias copy operation is documented. Exact deployed bytes already exist in the backup; do not resend the whole production ZIP. Supply the original Work export/Git commit or change ledger privately. Needed to establish original editable ownership and repeatable packaging.
2. **Exact build inputs/toolchain:** original Node/npm/Python/Pillow versions or build log/container lock, plus a lockfile-compatible dependency cache/offline tarballs including Linux native optional packages, or working access to the lockfile registry URLs. The package-lock itself is recovered. Needed to finish unchanged dependency installation and full export; newer packages must not be substituted.
3. **Apps Script read-only evidence pack/access:** actual project ID/URL; Manage Deployments mapping showing deployment ID, immutable version, execute-as and access mode; Version7 source/manifest export with hashes; redacted intended calendar/timezone/scopes/trigger metadata. Exclude API keys/tokens and customer rows. Shortest route is a private source/metadata export from the actual project or supported authenticated read-only project access.
4. **Narrow incident audit trail:** execution/Cloud logs around20Oct16:10–16:15UTC and event cancellation audit/history for the exact event; redacted provider response and outbox state if retained. Needed to order insertion, confirmation and cancellation and attribute the action. If logs cannot be recovered, provide the retention/availability finding explicitly rather than claiming no operation occurred.

Items3–4 are separate from connected Calendar owner access. No paid infrastructure is required to provide existing exports/logs.

## Release boundary and next step
Only this report and audit/v00 evidence are added on a new documentation branch derived from9168c0b. No application fix, social/favicon integration, Studio OS work, merge, deployment, paid activation or live integration mutation occurred. Main/recovery/existing audit branches remain untouched. Prior restoration instructions are inherited unchanged; web-file rollback cannot restore Calendar state or Apps Script history.

**NO-GO for isolated V0.1 implementation.** First obtain the missing provenance/build inputs and actual deployment evidence, complete an unchanged full build and per-path verification, then propose a narrowly scoped remediation step for owner review. No deployment authorization is implied.
