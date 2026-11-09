# Owner acceptance: seven remaining external gates

No production change, integration activation, diagnostic installation or live booking is authorized by this document. Work on the development branch only. Use the existing Hadi-V01-Manual-Verification-Kit-Reviewed.zip; do not regenerate it or use the older kit. Never return credentials, tokens, master keys, key hashes, property dumps or complete private configuration.

|Gate|Exact owner action|Return sanitized evidence|
|---|---|---|
|1. Hostinger web runtime and effective configuration|From authenticated hPanel, review the existing kit README and REVIEW. After separately approving its temporary installation, run its PREPARE flow and upload only the prepared diagnostic as directed; never overwrite an existing file. Confirm the same web handler/per-file rules as api/leads.php. Remove it immediately through the reviewed cleanup procedure.|EVIDENCE.md, evidence.json, cleanup.json; actual PHP/SAPI, libcurl/TLS, required extensions including sodium for the new vault, relevant restrictions and observed time. CLI PHP is not web evidence.|
|Effective loader corroboration|The kit's static selection is not proof of the live gateway's actual loaded configuration. Use existing request-level evidence. If absent, provide a privately reviewed, secret-free current gateway copy and hash so a source-matched temporary probe can be reviewed and explicitly approved. Do not deploy a backup-derived patch or modify config precedence.|Actual selected path (username prefix may be masked), deployment-ID SHA-256 only, observation/build correlation, relevant override/OPcache evidence. Keep BLOCKED if execution cannot be established. Do not call Apps Script /exec blindly as an HTTPS test.|
|2. Apps Script identity|Deploy > Manage deployments: inspect, do not edit, the deployment matching the gateway fingerprint. Record immutable version and execution/access settings. Obtain that version's source through Project History or an already authorized read-only projects.getContent request with versionNumber=N; omitting it reads HEAD. Do not authorize new scopes automatically.|Project/deployment fingerprints, deployed version, approved-source comparison/hash, masked actual deploying/executing principal, access setting and observed time. Keep returned source private.|
|Calendar/Meet/email|Privately follow the deployed version's config loader and current Script Properties overrides. Resolve primary to the executing principal's actual Calendar. Check deployed manifest timezone/scopes/services, Calendar settings/timezone and executing principal's write access. Verify Calendar conference creation capability, advanced Calendar service/API and relevant mail permissions without creating an event or sending mail.|Calendar fingerprint, script/Calendar timezones, observed scope/service/permission results. Calendar conferenceDataVersion=1 supports Meet generation; do not assume a separate Meet API grant proves this Calendar workflow. Downstream event/Meet/mail success still needs the authorized test.|
|3. Sheet/container ACLs|Review Share/Manage access for both Sheet and bound script, owners/editors/link/domain sharing and ADMIN_ROLES privately. Use an owner/trusted-team-only test container. Do not install admin code in the separate booking project. A future approved test installation needs CmsContract.gs, RuntimeContract.gs, ControlCenter.gs/HTML and existing menu wiring.|Masked owner/editor identities, sharing restrictions, active-user identity resolution and role-denial evidence. Sheet/script editors can bypass app RBAC; this is not customer/tenant isolation.|
|4. Independent key custody and backend identity|Choose a verified private service principal and authorization bridge for Hostinger. Prove key custody outside public_html, uploaded artifacts, Sheets and the encrypted-record directory; minimum-access readers, backup/rotation/recovery/revocation process. Confirm web PHP sodium, private directory 0700/file 0600 compatibility, locking/fsync and filesystem behavior. Do not enable writes yet.|Custody architecture/permission attestations and sanitized web-runtime evidence, never key material or its hash. Local vault tests are not production custody verification. Master-key migration and actual Google-to-PHP authorization require review before installation.|
|5. Provider eligibility/privacy|For each intended Gemini/Groq model, inspect current official model/pricing/terms and the actual account's entitlement, billing, region, privacy/data-use policy, quotas and reset scope. Record quota IDs stable across model/key rotation and shared account limits. Keep unknown configurations disabled and paid inference zero.|Model/account eligibility decision, dated official references, account-level unbilled confirmation, quota/reset and privacy approval. No credentials in chat. Live connectivity requires separate explicit authorization.|
|6. Hero approval|Review existing HERO-APPROVAL-REVIEW.md and hero-baseline-PROPOSED-NOT-APPROVED.json. Supply the authenticated original lock or explicitly approve the exact proposed hashes/revision.|Approved artifact/revision and explicit decision. No activation is performed here. Current build remains blocked.|
|7. Controlled live acceptance|After identity, security, hero/build and local gates pass, identify an isolated Sheet/Calendar/test deployment and approved test recipients, cleanup owner, date/time/timezone and expected source revision. Explicitly authorize the controlled test. Do not modify the active deployment or use real customers.|Test-resource aliases and authorization; then independently verify saved lead, correlated Calendar event, correct timezone, Meet conference and both email deliveries. HTTP success alone never confirms the chain.|

## Minimal return template

```json
{
  "observed_at": null,
  "runtime": {"status":"BLOCKED","php":null,"sapi":null,"libcurl":null,"tls":null,"sodium":null,"same_handler_evidence":null},
  "effective_config": {"status":"BLOCKED","selected_path":null,"deployment_id_sha256":null,"request_level_evidence":null},
  "apps_script": {"status":"BLOCKED","project_fingerprint":null,"deployment_fingerprint":null,"version":null,"source_revision_evidence":null,"execution_identity_alias":null,"access":null,"calendar_fingerprint":null,"script_timezone":null,"calendar_timezone":null,"permissions_evidence":null},
  "container_acl": {"status":"BLOCKED","trusted_team_only":null,"role_denial_evidence":null},
  "key_custody": {"status":"BLOCKED","independent_store":null,"backend_identity":null,"permission_evidence":null},
  "providers": {"status":"BLOCKED","free_unbilled_eligibility":null,"privacy_decision":null,"quota_scope_and_reset":null},
  "hero": {"status":"BLOCKED","approved_artifact_or_decision":null},
  "cleanup": {"status":"BLOCKED","restored_gateway_hash":null,"diagnostics_removed":null,"no_probe_marker":null},
  "controlled_test_authorized": false
}
```

Keep the existing kit cleanup.json unchanged as the primary cleanup evidence. Absence of an HTTP route alone is insufficient: correlate file identity/permissions, restored gateway hash and absence of the probe marker. No diagnostic was installed by this phase.

References: https://developers.google.com/apps-script/concepts/deployments ; https://developers.google.com/apps-script/api/reference/rest/v1/projects/getContent ; https://developers.google.com/workspace/calendar/api/guides/create-events . Review is read-only; no Deploy/Edit/Archive, permission broadening, API enabling, cache reset or provider call is part of these instructions.

## Phase 4 handoff

Use PHASE4-ACCEPTANCE.md for the exact three-hash local hero approval wording and custody/hosted-CMS sequence; PROVIDER-READINESS.md for current official terms and disabled candidates; CONTROLLED-INTEGRATION-ACCEPTANCE.md for isolated test resources, evidence and cleanup. These documents do not authorize installation, credential writes, activation, publication or live calls. First return existing reviewed-kit evidence.json/cleanup.json plus request-level loader and deployed-version evidence. No new production evidence has been accepted.

## 2026-11-04 read-only reconciliation

See PHASE4-GATE-RECONCILIATION.md for implementation/local/fixture/production separation, exact read-only hPanel/Google checks and six P0 gates with owner/action/pass criteria. Prefer existing request evidence; no diagnostic installation is authorized. PHP8.4 is the target: verify a patched actual web handler and candidate compatibility before any separately authorized switch/deployment. Existing PHP8.3 CLI tests cannot establish this. Mutable staging hardlinks/permissions are locally fixed, not hosted acceptance.

## Phase5 independent booking release

Use docs/booking-release/RELEASE-READINESS.md for the smallest Apps Script-only candidate and booking-specific gates. Unfinished admin/provider vault/CMS are excluded; no frontend or hero files/build are included. Supply the actual deployed numbered source/project file inventory, unchanged gateway/client parity, runtime/config identity, Sheet18-column/old-record and JOB_/trigger compatibility, Google Calendar/mail permissions, fresh backup/rollback and isolated test resources/recipient authorization. Do not run legacy setup/activateSetup or change keys/config. Production deployment and the one QA booking need explicit approval after gates pass. Current decision NO-GO; full-site hero/build gates remain separately blocked.


## V1 current evidence reconciliation

New booking source32a6e44 and private/provider/CRM source94c53a89 must be distinguished from historical report revisions. Existing25-file comparison and healthREADY do not prove this candidate is deployed. Current local27/243 does not change any external gate. OpenRouter is now an additional disabled adapter, requiring exact :free catalogue entry, zero price caps, account privacy/ZDR/SafetyRetention decision, quotas and explicit bounded connectivity approval. No API keys in chat. Current full artifact is unavailable until exact hero approval/build and unresolved implementation gates pass. Return only existing sanitized evidence files and the exact-hash hero decision when ready; diagnostics/deployment/live tests remain separately authorized.

## Owner lifecycle topology gate

New owner cancellation/rescheduling is disabled and requires the actual booking writer and bound Leads in one ScriptLock domain with matching policy and exact18-column headers. It intentionally rejects the existing split-project assumption. Prepare only a separately approved isolated co-located test project for acceptance; do not merge admin code into the active booking deployment. Review Calendar/Sheets, active-user and UrlFetch scopes before any install/activation. See docs/v1/BOOKING-LIFECYCLE-ACCEPTANCE.md. Existing public API key never authorizes lifecycle writes. No approval is implied by local test success.
