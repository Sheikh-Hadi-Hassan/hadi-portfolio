# Captured-production patch adoption proposal
Status: **PROPOSAL ONLY. Not authorized or applied.**
Purpose: provide an explicit alternative if original patch provenance cannot be recovered. This would be a new, owner-adopted baseline derived from captured production, never “recovered original source.”

## Exact mapping and proposed transformations
ADOPTION_PATHS.json lists all12 production paths with production and preserved-package SHA-256 values.

| Captured production paths | Proposed maintainable input | Transformation after approval |
|---|---|---|
| style.css; appbar.css | src/styles/site.css; new src/styles/appbar.css; public/appbar.css; scripts/prepare-next.py | Keep original site.css bytes. Store captured appbar.css as an explicitly adopted source file. Generate public/style.css as site.css + LF + appbar.css to preserve captured bytes; copy appbar separately for deployed widget compatibility. Do not concatenate twice. |
| index.html | src/components/navigation.html and normal Next regeneration | Remove only the dock-contact-enquiry anchor from the original shared navigation template; preserve other CTAs. Regenerate body/metadata/Flight with Next. Compare resulting homepage to capture. Do not text-replace serialized Flight or copy generated homepage into editable source. |
| intellignce-support/widget-v9.js and widget-v4.1.js/v5/v6/v7/v8/widget.js | public/intellignce-support/widget-v9.js plus deterministic alias-copy step in runtime packaging | Adopt the exact captured v9 as a new owner-approved source input, preserving its provenance/hash. Copy it to the six legacy aliases and assert all seven match hash942a768afe2309a2dd3cf11fe939fdf3ad4622b499e5cd8f429ae5d911058b0f. No refactor or behavior fix during adoption. Keep compatibility appbar injection initially to avoid mixing adoption with remediation. |
| intellignce-support/ask.php | integrations/hostinger-runtime/intellignce-support/ask.php | Adopt captured PHP implementation exactly after review. Preserve configuration loader and existing private-config lookup; no private configuration is copied. Verify it is only placed into Hostinger package, never Sites static publication. |
| intellignce-support/ask(1).php | Non-web audit archive of original gateway, or explicitly retained runtime path | Owner decision required: exact snapshot reproduction retains this old executable endpoint; maintainable/security-oriented release should archive it outside webroot and record an intentional one-path omission. Do not silently delete or publish it. Its hash19c06e18547fce0850d25c9b3534f991b6117739486147fe4bf01c21090dca52 matches the original older gateway. |

The index template is shared across routes. Check every route: this source-level removal can alter generated content beyond the captured homepage even though only index.html was manually patched in production. A product decision is required before accepting those additional differences; never describe them as byte parity. CSS patch files are not proof that no other build inputs changed.

## Packaging and lineage
Start a future adoption branch from an explicitly approved source revision. Do not replace original66 history.
The retained bundleHEAD ebd3ae1 includes both a Hostinger overlay recipe and viewport-frame source changes. If only the packaging recipe is approved, carry it as a separately reviewed change; do not silently import the viewport changes. Keep Sites build output and Hostinger PHP overlay separate.
Record a release manifest with original source commit, approved adoption commit, captured baseline, patch SHA-256 values, toolchain/lock hashes, actual commands and deliberate deviations. Preserve all restoration documentation.

## Verification and acceptance
1. Unchanged recovered66 full build first, using locked exact packages; preserve its output for comparison.
2. Build adopted inputs separately, with no production credentials, no Apps Script execution and no integration writes.
3. Assert the raw adopted CSS/widget/PHP source bytes against capture before compilation. Verify the seven widget aliases, exact CSS concatenation and PHP routing/config requirements.
4. Compare all1,768 captured paths against final Hostinger package: report every exact match, source-regenerated difference, omission and addition. Any Next byte difference requires an explained structural comparison plus hydration checks; a random build ID must not excuse unrelated changes.
5. Verify source-generated homepage and Flight agree about Enquire removal; verify all routes, dock/other CTAs, Sera consent and mobile viewport behavior. No social/favicon changes.
6. Run PHP syntax/execution in an isolated runtime, mock AI/Calendar/mail/CRM endpoints, and verify security boundary/config failure behavior. No real requests or appointments.
7. Keep adoption and booking/gallery fixes in separate commits. Production integration acceptance still requires actual deployment source and safe staging.

Risks: source-level navigation change affects multiple pages; duplicate CSS could drift; old PHP endpoint may expose legacy behavior if retained; regenerated Next output may not match historical bytes; original toolchain remains unverified; adoption does not verify Apps Script or fix booking integrity.
Rollback: abandon/revert the unmerged adoption branch. No live rollback is required because nothing is deployed. Any future deployment requires separate authorization and a fresh verified pre-release capture.

## Specific decision requested
If the original patch records cannot be supplied, owner may explicitly authorize: “Adopt the captured production patches into a new maintainable source baseline using this proposal; do not deploy.” Also choose whether ask(1).php must remain executable or be archived outside webroot with a recorded omission.
This authorization has **not** been granted. V0.1 remediation remains blocked by the remaining build/deployment evidence prerequisites.

