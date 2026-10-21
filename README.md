# Verified Hostinger production recovery — 21 October 2026

This branch preserves a sanitized snapshot of the deployed Hadi Hassan portfolio. It is a recovery snapshot of deployed output and PHP, not a reconstructed application or a claim that the original editable build source has been recovered.

## Layout

- `production/`: exact exported file bytes, excluding the two private configuration files documented in the inventory.
- `production-inventory.json`: paths, source sizes, archive modification times, checksums and explicit exclusions.
- `SHA256SUMS`: SHA-256 checksums for all included production files.
- `PRODUCTION_VERIFICATION.md`: capture evidence, validation limits and integration provenance.
- `FILE_DIFFERENCE_MATRIX.csv`: full comparison with the retained older release ZIP.
- `GITHUB_SOURCE_COMPARISON.csv`: comparison with accessible GitHub source trees.
- `OFFLINE_QA.json`: reproducible static validation results.
- `verify_snapshot.py`: run `python3 verify_snapshot.py` after cloning to verify every included production file and the private-file exclusions without network access.

## Restoration boundaries

Do not deploy this branch automatically. Preserve and inject private configuration securely from the owner's existing backup. `hadi-leads-config.php` and `intellignce-support/private-config.php` are deliberately absent. Existing example configuration files are retained. This snapshot does not include Google Apps Script source, Google credentials, Calendar/CRM records or email provider state.

Restore first into an isolated environment with a compatible PHP runtime and the appropriate server rules. Verify all checksums, routes, assets, configuration resolution, Sera boundaries and booking state transitions. Obtain explicit owner approval before any production restoration. No automated deployment workflow is included.

## Known limitations

The original commits `935cf06` and `0279f05` remain unavailable. Do not replace this production snapshot with the older `ebd3ae1d` bundle. Historical implementation-test claims are not tests of this snapshot. ZIP timestamps have two-second precision and no encoded timezone. Empty exported directories are not represented by Git. The release manifest inside production is retained unchanged as historical deployed evidence and is not the checksum authority for this recovery.
