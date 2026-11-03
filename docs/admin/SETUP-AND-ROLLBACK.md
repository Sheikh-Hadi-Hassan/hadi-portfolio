# Installation proposal and rollback — not executed

1. Owner exports/backups existing bound Apps Script source and private Sheet. Verify only trusted owner/team has Sheet and script-editor access. Record the real executing identity without publishing credentials.
2. In that bound project, prepare ControlCenter.gs and ControlCenter.html plus the modified LeadsDesk.gs. Preserve LeadsDesk.html and merge onOpen once. This is not the public booking script. Do not install into the active booking deployment.
3. Set private script property ADMIN_ROLES to a JSON email-to-role map, e.g. {"actual_owner_email":"owner"}. Use actual verified identity privately; no passwords/API keys in this property. Roles are owner/editor/viewer; container ACL limitations still apply.
4. Owner explicitly approves source installation. Only then save/reload the Sheet and open Flow Leads → Business control center. If active-user email is unavailable, access must fail; do not replace it with effective-user identity. Confirm identity/role/token expiry behavior with real Google sessions before enabling teammate access.
5. Authorized first save creates only ControlCenterRecords with nine columns. All revisions and actor/hash evidence append; no existing lead/booking fields are overwritten. Provider keys and enabled=true are rejected. Google/API/website publication remains disconnected.
6. Run controlled private draft/read/approve/archive tests, with no Calendar/email/provider calls. Validate real quota/capacity, user isolation and undo through a new revision before operational use. Workspace record reports are not visitor analytics.

Rollback: preserve/export ControlCenterRecords privately; revert only the new ControlCenter files and LeadsDesk.gs menu/role-gate change to the recorded prior source. Restore prior ADMIN_ROLES property state as appropriate. Do not delete/rewrite Leads, Calendar events, delivery metadata or recovery baseline. Removing the auxiliary tab is an owner-approved cleanup after its private audit archive is verified. Do not delete it as an automatic migration rollback. No rollback/deletion was executed during local testing.

Keys: API-key entry cannot be enabled until an encrypted server-side store and an externally managed encryption key with rotation/recovery are implemented and tested. Do not store keys in Sheets, browser storage, source, plaintext Script Properties or exported reports. Provider credentials should never be pasted into chat.

Public CMS/settings publication requires a separate verified adapter, staging preview, hero-integrity check and explicit deployment approval. Workspace approval alone is insufficient.
