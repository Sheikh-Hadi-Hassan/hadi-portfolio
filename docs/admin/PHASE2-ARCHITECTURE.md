# Phase 2 architecture decision

Baseline: 8dd78f79bb493b89aa8824378042044b7fdc1fe0. Extend existing Sheet-bound workspace and static/PHP runtime; no new database, hosting capability or background worker assumed.

## Trust boundary

Google identity + private ADMIN_ROLES authorize workspace operations. Sheet/script editors can bypass app roles: trusted-owner/team container only, never customer isolation. Owner approval means a private approved revision, not live publication. An owner-only export projects allowlisted approved public knowledge/FAQ/personality/voice fields. It excludes private knowledge/ancestors, drafts, providers, CRM, appointments and actor identities. CMS uses a separate approved export.

Owner review/import is the authenticity boundary. Release UUIDs and SHA-256 detect version/integrity mismatch; they are not signatures or proof of approval. Do not accept artifacts from arbitrary browser uploads or expose a public publishing endpoint.

Hostinger receives only reviewed public artifacts in a future explicitly approved release. Browser and PHP read fixed filenames, independently validate, and fall back to the prior valid file or built-ins. Browser fetch is no-store and bounded; updates apply on next widget load/reload, not via background polling. Keep both artifact files in one approved deployment; CDN invalidation/HTTP cache headers still require hosting acceptance. No private Sheet RPC/credentials are exposed to the browser. The browser is untrusted; consent and backend policy remain mandatory.

## Implemented scope

Approved FAQ alternatives answer deterministically without AI. Approved name/welcome and browser-native voice preference settings apply to the widget. Approved knowledge supplements bounded backend fact retrieval. Tone uses fixed enum-to-instruction mapping; editable welcome/name cannot replace security policy. Config never enables AI consent. Invalid candidates leave active staging unchanged; runtime corrupt-current uses previous. An approved voice identifier remains device/browser dependent.

CMS supports existing project metadata (title/deck/intro/category/SEO/existing image), contact and four allowlisted social profiles. Routes, galleries, templates and hero are immutable in this slice. Preview is escaped isolated metadata HTML, not production visual acceptance. Unknown project slugs require the full source model and are rejected. No upload endpoint exists; existing media checks enforce local containment, size and PNG/JPEG/WebP signatures. Signature checks are not a malware scanner.

The local publishers deliberately write only /tmp/.../staging/... . They cannot deploy into public/, out/ or production. They use an exclusive staging lock, optimistic release IDs, atomic active-file replacement and readback verification; versioned previous files support rollback. If a process dies while holding the directory lock, inspect that no publisher remains before removing the stale lock. Do not auto-retry unknown publication/deployment outcomes.

## Open release gates

Actual Google ACL/session identity; web PHP/cURL/private-path/deployment identity; approved hero lock; secure independent key custody; actual build/render acceptance; authorized staged deployment/rollback/cleanup and booking acceptance. NO-GO; manifest STALE. No production modifications.
