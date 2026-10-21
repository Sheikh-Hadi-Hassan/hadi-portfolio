# Production source verification

Capture date: 21 October 2026, Asia/Karachi.
Project: https://hadi.intellignce.net
Account: u375466527; plan: Business Web Hosting.
Production document root previously verified in hPanel: /home/u375466527/domains/intellignce.net/public_html/hadi.

## Capture evidence and scope

The current authenticated File Manager is scoped to the portfolio root, with the hPanel dashboard selected as hadi.intellignce.net. It displays the current appbar.css, style.css, index.html, API and Sera files. File Manager information reports 19 root files and 24 root directories. The available authenticated-source ZIP has exactly those root counts, 40 directory entries and 1770 files, 238024724 uncompressed bytes. Every ZIP member passes CRC integrity; duplicate and unsafe paths were rejected. The raw archive SHA-256 is e4491899e8fae91745fb2a055005911efdeeb84c342c383233d74294fdc9d1bc. It is deliberately not published because it contains private configuration.

The archive is retained as capture evidence independently of missing historical commits. A UI directory-download request was also made; the browser download event timed out, although a complete hadi.zip was available in the shared download directory. Archive provenance is corroborated by matching root counts, current homepage bytes and current backend/frontend source fingerprints. There is no independent server-generated recursive checksum list or atomic filesystem freeze. The inventory certifies captured bytes, not freedom from concurrent server changes after capture.

The GitHub snapshot contains 1768 exact-byte production files. Two private configuration files are excluded: hadi-leads-config.php and intellignce-support/private-config.php. Their paths and sizes are retained, their contents and hashes are not published. Secret-pattern scanning passed. The actual configured shared key and Gemini key were checked for reuse in included text files and were not found. Public model names and public integration URLs are not treated as credentials. No customer records or operational logs were present in this exported tree.

ZIP modification times are preserved in the inventory with no asserted timezone and two-second precision. Hidden .htaccess files and a pre-existing hidden asset temporary file are retained; the latter is unreferenced deployment residue, not newly created content. Git does not preserve empty directories.

## Selected SHA-256 fingerprints

| File | Bytes | SHA-256 |
|---|---:|---|
| index.html | 288923 | 98f83367a0bdfbe0db57e14a9771981eeacb69cb66f4be995de6bfa2ea164bdc |
| style.css | 13236 | 6ba35bb48d121375de474741163edf88d2ab8b71d615b46654f08002defbe3dc |
| appbar.css | 3079 | 86b03fb5d9e47e6466503c9b178da3371ee66fd8d182db950d0955e443fa9b01 |
| api/leads.php | 6024 | 890dacdae0a76c57e1707352f411ac634cfe7c954d68386bb3138e1d554684b1 |
| intellignce-support/ask.php | 8720 | 8f35180ba7267d6f8413a3add5b7c6626099f5b296c80f70762b989ab772e270 |
| intellignce-support/widget-v9.js | 197513 | 942a768afe2309a2dd3cf11fe939fdf3ad4622b499e5cd8f429ae5d911058b0f |

## Integration provenance

The captured api/leads.php reads a configuration URL and shared key, searches the parent of the project before the project directory, and forwards to Apps Script through cURL. The captured project configuration references deployment AKfycbxPb91mCHleNeC5MD4yBpbBhquZuHHdQJa9lOQAiWJ-zTj99f3JpNJlWSWtRPfHLJvg4A. No shared key is included in GitHub.

Earlier authenticated inspection in this conversation identified this deployment as immutable Version 7, executing as sheikh.hadi.hassan@gmail.com with public web-app access. Version 7 Code.gs SHA-256 was b5c4baf9ac8ec4ed34fa86f4a8d4c33b21f616c43bf3c3c9299e19b6f877f96d; appsscript.json SHA-256 was b5c0572eedacd613acb1f84bff2a70fcc7e7ca2cf6efe94b52a3df2585c58deb. Asia/Karachi, advanced Calendar v3, mail sending and outbox triggers were verified then. A fresh editor visit during this task redirected to public Apps Script documentation, so immutable source/deployment settings were not re-exported. These are historical authenticated findings, not freshly reverified settings.

Captured Sera ask.php is v9 and requires ai-config.php. Both exact files are preserved. The actual private Gemini configuration is excluded. The frontend widget and consultation.php/leads.php are preserved byte-for-byte. Calendar, Google Meet and email behavior depends on the external Apps Script deployment and its credentials; these provider-side resources are outside this Hostinger snapshot. No external transaction or AI message was submitted.

## Validation

- All 1768 included production file checksums match the inventory.
- 22 HTML files parse and have no unresolved local src/href/poster references under the offline reference checker.
- All captured .js files pass node --check.
- The live homepage was observed with portfolio content, Ask Sera and navigation present; its app bar has no Enquire control.
- Captured homepage markup and its serialized copy contain no dock-contact-enquiry element. Other pages retain their existing markup; do not infer site-wide markup removal from the homepage-only change. Existing CSS hide rules are preserved.
- PHP execution/syntax checks were NOT RUN because PHP is unavailable in this runtime.
- Booking, Calendar insertion, Meet creation, CRM writes, email delivery, mobile viewport behavior and animation timing were NOT transaction-tested in this backup task.
- No production file, provider setting or live integration was modified.

See OFFLINE_QA.json for results. Validation establishes preservation and static consistency, not production readiness.

## CSS and release metadata

Captured origin style.css is 6ba35b…. Fresh HTTP checks during this task found BOTH /style.css and /style.css?v=7255e1f9fe90 serving that hash with HTTP 200 and CDN MISS; the homepage HTTP hash also matches the capture. LIVE_HTTP_EVIDENCE.json records the results. Earlier, the plain URL served 7255e1… while the query URL and origin served 6ba35b…. Independently cached revisions are the leading explanation; exact cache policy remains unverified. No cache purge, development mode or production query string change was made.

The deployed RELEASE-MANIFEST.json is preserved unchanged. It still describes older CSS/widget content and is not an authoritative current inventory. SHA256SUMS and production-inventory.json describe this recovery snapshot instead.

## Historical source reconciliation

935cf06 and 0279f05 remain unavailable as exact Git objects/source snapshots in accessible GitHub history and the retained ebd3ae1d bundle. No old snapshot was substituted. Previous booking/security implementation evidence is documentary only and is not merged into production here. The retained older release ZIP is compared file-by-file in FILE_DIFFERENCE_MATRIX.csv: 1756 identical files, 10 modified files, two additional non-secret files and two excluded private configurations. The modified files are index.html, style.css, ask.php and seven Sera widget aliases. All captured portfolio assets and existing animation code are retained.

At corresponding root/public paths, GitHub main and its SEO branch have no matching deployed files. The recovery branch has 13 identical files, 17 differing files and 1738 absent paths. This comparison does not claim that source-code paths and generated output must have identical layouts. GITHUB_SOURCE_COMPARISON.csv records each mapping and Git blob fingerprint. All production-only files remain in this snapshot.

## Decisions and next work

The sanitized captured Hostinger tree is the proposed production-derived recovery baseline. It is not a recovered editable Next.js build source, an atomic provider-wide backup, or proof that historical booking/security fixes are deployed. Keep those distinctions when approving subsequent work.

Next development task: recover the editable build inputs, reconcile them against this snapshot, and reproduce the booking confirmation defect with isolated fixtures before implementing any changes. Preserve real scheduling rules, secrets and provider state separately.

Version tagging must follow remote tree verification. The connector lacks a tag-creation capability; browser sign-in for that interface was interrupted by a transport disconnect. Do not claim a tag exists unless subsequently verified.
