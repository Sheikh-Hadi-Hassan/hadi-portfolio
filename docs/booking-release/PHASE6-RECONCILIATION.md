# Booking Phase6: reuse and reconciliation — 2026-11-04

Inspected HEAD: c097a6124bbde0604eedadacf3d5772e73792d9a, work/v01-booking-contract-20261103. Candidate remains the exact Apps Script-only source from1d4ea2a51a01502feab50bb2ea5a358173aa6f67, SHA-256 b69db08a3819c38a2f240585cf0a7222bf7b9b246c874bb1045726284e621382. Its source hash was reconciled against current Git content; no history search, backup comparison, package rebuild or mock suite was repeated. No application code was changed.

## Existing Library evidence actually read

All three named files were resolved and read completely, not merely search snippets. No document is missing or inaccessible in this pass.

|Source|Reused findings|What it does not establish|
|---|---|---|
|Hadi-V01-Live-Baseline-Verification.md,3Nov2026,71lines|25public samples matched backup; bookingv8/Sera v9READY; reported cURL availability; stale release manifest|Exact web PHP/libcurl/config/private permissions, current PHP source parity or Apps Script identity. The report explicitly marks those unverified|
|Hadi-V01-Backend-Acceptance-Report.md,3Nov2026,57lines|Backup gateway selection logic/deployment fingerprint, HTTPS/timeouts and pending semantics; exact missing web/deployment evidence|It explicitly says runtime/config/Apps Script/booking acceptance BLOCKED. Backup destination fingerprint is not the live selected destination|
|Pasted markdown(20261021-160534).md,21Oct2026,114lines|Completed source-parity investigation, historical V7 mismatch, booking confirmation incident and required authoritative Calendar confirmation contract|It explicitly lacks fresh deployed V7 source/principal/mapping/log proof. The historical incident is not a current deployment identity or a proven root cause|

Library identities/read provenance are in PHASE6-EVIDENCE.json. Original reports remain unchanged. Existing recovery c4097990... and1768-file verification are retained; full-site parity findings are not re-investigated or treated as proof that this narrow booking candidate cannot be released independently.

## Historical identity versus this exact candidate

Recorded historical V7 Code.gs SHA-256: b5c4baf9ac8ec4ed34fa86f4a8d4c33b21f616c43bf3c3c9299e19b6f877f96d.
Historical v104 candidate SHA-256:32a80a8b781992a306435e65597b0993bbe936d5aae3bef879b6fe56e42dad6c.
Current frozen candidate SHA-256:b69db08a3819c38a2f240585cf0a7222bf7b9b246c874bb1045726284e621382.

The three differ. This does not identify the active version or prove a new deployment is necessary. The backup-only deployment-ID fingerprint in the backend report must not be promoted to the effective PHP destination. No current version/source/runtime/cleanup pass can be inferred from these reports or READY responses.

**Additional P0 candidate gap recovered from the historical report:** the current frozen source does not fully enforce Gate6's authoritative Calendar GET and identity contract. Normal successful Calendar insert at Code.gs:36 can feed bookingResult_ directly. That function at30 checks confirmed status, nonempty ID, parsable start and Meet readiness, but not a mandatory post-insert GET, expected deterministic ID/private reference, end/duration and complete time/request contract. status_ at38 performs GET and persisted lead/event/start correlation, but does not satisfy all those historical checks either. The outbox's later GET is not verification before the earlier success response. Client hardening cannot replace backend enforcement, especially because this release excludes the live widget.

This is a source comparison against an existing acceptance criterion, not a rerun of the incident or a claim about its root cause. Existing mock passes did not verify this stronger contract. The pinned package therefore remains NO-GO; identity evidence alone will not make this exact source satisfy all mandatory acceptance criteria. After active-source identity is established, Codex must prepare a minimal candidate correction and *new* focused tests for insert-success/readback-failure, wrong reference/ID/time/end and status reconciliation. Do not silently replace/rebuild the frozen candidate or count old tests as that new coverage.

## Newly obtained, bounded authenticated reads

|Gap|Observation|Classification/limit|
|---|---|---|
|Candidate Sheet access|Drive metadata resolves the repository's candidate/fallback Sheet to a native Google spreadsheet; visible Leads tab,26grid columns|VERIFIED current connector access only. Effective Script Property SHEET_ID mapping is not established;1000grid rows is capacity, not lead count|
|Header schema|Read only Leads!A1:R1. All18columns populated;17labels match candidate HEADERS. A1 is “Leads spreadsheet”, expected “Reference”|PARTIAL. Do not rename/write. Column1's actual reference semantics and old-row/outbox compatibility remain unverified; a label mismatch alone does not prove booking failure|
|Sheet ACL metadata|Returned permission entries contain one user owner; no anyone/domain entry returned|PARTIAL. Complete inherited/domain/bound-script ACL and executing-principal write permission are not proven. No customer isolation claim|
|Candidate Calendar access|Calendar list contains the candidate target as primary, access_role=owner, for the connected Calendar account|PARTIAL. This is not Apps Script execute-as identity, active Calendar mapping or permission evidence for that principal. Timezone/scopes were not returned|
|Hostinger runtime/config|Hosting file/runtime tools remain unavailable; mail tools are insufficient|BLOCKED. No failed login retried, new diagnostic installed or health comparison repeated|
|Numbered Apps Script deployment/source/permissions/triggers|No exposed Apps Script project/deployment/trigger API|BLOCKED. A Drive Sheet or old Google Doc source does not substitute for deployment/version metadata|

No customer rows, Calendar events or raw Script Properties were read. No Sheet edits, trigger/deployment changes, bookings or messages occurred. These reads do not authorize staging writes. Timezone and actual Calendar/mail scope checks remain blocked.

## Staging and next gate

Existing Phase5 offline package/source/testing evidence is retained, not regenerated. No isolated project/Sheet/Calendar/test recipient set was approved in this request or the three reports. The accessible candidate Sheet/primary Calendar must **not** be repurposed for staging. Historical QA/incident resources are not a new test authorization. Connected staging and real rollback verification remain BLOCKED.

Smallest next owner action: supply one sanitized **active-deployment evidence bundle**, without rerunning recovery or mocks: the numbered deployed Code.gs/appsscript.json export and project/deployment/version, execute-as/access and trigger metadata, tied to the deployment-ID fingerprint actually selected by PHP. No API keys or Script Property values. If no effective-loader evidence exists, use the existing separately approved procedure; no diagnostic installation is authorized here.

Exact next gate: match effective gateway destination → immutable deployment/version/source → frozen candidate, establish the minimal diff and close the authoritative Calendar confirmation requirement. Then confirm column1/schema/trigger/backlog compatibility and approve isolated resources/recipients before connected staging; real integration and rollback must pass before deployment approval. Existing runtime/permissions/cleanup evidence must still be returned where missing, but a new full backup investigation is not requested.

Booking scope remains Apps Script-only. Admin/CMS/provider-vault completion and full-site hero approval are not prerequisites for that bounded artifact. Global portfolio22/243=9.05%,188partial/2missing/31blocked;233future excluded; full production-build browser0/198. Manifest STALE. **NO-GO.**
