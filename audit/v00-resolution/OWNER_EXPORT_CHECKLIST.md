# Owner evidence export checklist
Read-only exports only. Do not deploy, reauthorize, run setup, alter triggers, enable paid services or paste credentials in chat. A current editor copy is not immutable Version7 evidence.

| Required item | Where/how to obtain through existing authenticated access | Why |
|---|---|---|
| Actual script project URL/ID | Open the actual booking script; read its URL/Project Settings Script ID. Supply project title and ID, not OAuth credentials. | A web-app deployment ID is not a script project ID. |
| Active deployment mapping | Read Deploy → Manage deployments without editing/saving. Export deployment ID, version number, web-app URL, execute-as setting and access mode. Where already authorized, read GET /v1/projects/{scriptId}/deployments or deployments/{deploymentId}. | Tie the currently referenced endpoint to an immutable version; do not assume it is still7. |
| Immutable Version7 source and manifest | Using existing authorized Apps Script API access, GET https://script.googleapis.com/v1/projects/{scriptId}/content?versionNumber=7. Supply all source files and appsscript.json plus SHA-256 of original bytes. If current active version differs, export that version separately. | Distinguish Version7 from editor HEAD. Historical Code.gs reference: b5c4baf9ac8ec4ed34fa86f4a8d4c33b21f616c43bf3c3c9299e19b6f877f96d. A mismatch needs encoding/newline/provenance explanation, not silent normalization. |
| Runtime metadata | Read Project Settings, current trigger list, and relevant immutable manifest. Supply calendar ID, timeZone, enabled advanced services and oauthScopes; trigger handler/type/schedule and owner identity if visible; configuration NAMES and only nonsecret calendar/timezone IDs needed for comparison. For secret properties report PRESENT/ABSENT only, never values. | Trigger executions can use editor HEAD rather than web-app Version7; identify each separately. Source execute-as setting alone may not prove the actual executing account. |
| Processing/execution audit | In Apps Script Executions and associated existing Cloud project's Logs Explorer, filter20Oct2026 16:10–16:15UTC (21:10–21:15PKT). Export time, function, deployment/version if recorded, result/error, event ID, request correlation and structured provider/notification timing if retained. Broaden only for this incident's linked outbox jobs. | Establish insert/readback/confirmation ordering. Do not create fresh log entries to simulate missing history. |
| Cancellation history | If the account has eligible Workspace administrator reporting, use Reporting → Audit and investigation → Calendar log events; filter exact calendar/event ID and creation-to-current window. Export actor, action and timestamp. For a personal Gmail calendar, do not assume an admin audit service exists. Existing authenticated Calendar API event read may expose created/updated/status/sequence; updated alone is not cancellation attribution. Supply retained cancellation notice/audit export only for this incident if available. | Determine cancellation actor/time. If unavailable, explicitly record the account capability/retention limit; absence of accessible logs is not evidence of noncreation. |

Incident: HADI-f603e552-3429-476f-a943-36ec896a1944.
Event ID: hadif603e5523429476fa94336ec896a1944.
Scheduled:21Oct2026 13:00–13:30Asia/Karachi.
Do not include unrelated bookings, customer contacts/briefs, API keys, tokens, passwords, full script-property stores or full CRM exports. Preserve unredacted original artifacts privately; provide sanitized inspection copies plus original/sanitized hashes and a redaction note. If source contains hardcoded secrets, do not upload it publicly.

Shortest handoff: one private ZIP containing deployment-mapping.json or screenshots, version7 source/manifest with checksum file, runtime-metadata.json, incident-only sanitized logs and an unavailable-items note. Missing actor/time may be irrecoverable; mark that expressly rather than inventing a chain of events.

Official references checked:
- https://developers.google.com/apps-script/api/reference/rest/v1/projects/getContent
- https://developers.google.com/apps-script/api/reference/rest/v1/projects.deployments
- https://developers.google.com/apps-script/guides/logging
- https://support.google.com/a/answer/6110475?hl=en-GB

This session has no exposed supported Apps Script source/deployment/log or Workspace audit connector and no actual script project ID. Connected Calendar/Drive access does not fill those gaps. This checklist requests evidence from existing authorized access, not tokens or new authorization changes.

