# Hostinger v104 backup audit — 2 November 2026

## Evidence received

A Hostinger web-root backup supplied by the owner was inspected as the current deployed-package evidence.

- Backup SHA-256: `57436dc435d1ba7e84f8384583476460f217f0eedc91e5339c0024c83fd60787`
- ZIP entries: 1,810
- Manifested files: 1,764
- Release label: **Hadi portfolio v104 scrolling release candidate**
- Base Site version: **104**
- Original Site source commit recorded by the package: `66e3e1df67331a92b2966dcab9724e70c8f11d90`
- Package status recorded by its own release metadata: **release candidate; browser and live integration acceptance pending**

The original Site source commit is not present in the current GitHub repository. The existing GitHub recovery source is therefore older than this Hostinger package and must not be treated as a complete current-production source baseline.

## Important source/parity finding

The v104 homepage differs materially from the older recovered GitHub source. The deployed package contains the newer cinematic About/Story treatment and current scrolling behavior, while the GitHub recovery source still contains the older `bf-about` portrait section.

This changes the recovery priority:

1. Preserve v104 deployed output as current production evidence.
2. Recover the editable v104 source before declaring V0.0 source parity complete.
3. Do not overwrite `main` or the live Hostinger site from the older recovery branch.
4. Continue backend/security tests on the protected integration branch only where contracts are source-independent.

## Asset recovery evidence

The Hostinger package confirms that the two previously missing service preview originals are duplicate-content assets:

- `service-preview-3.webp` corresponds to the same source content as `work-cover-03.webp`.
- `service-preview-4.webp` corresponds to the same source content as `work-cover-08.webp`.

Those source aliases were restored on the protected integration branch using the existing production asset blobs.

The old `hadi-portrait-original.jpg` reference belongs to the older recovered homepage. Current v104 output instead uses `hadi-founder-intro.jpg`, so the old portrait should not be recreated merely to make the obsolete homepage pass.

## Secret handling

The supplied Hostinger package includes a live private PHP configuration file. Its credential values were intentionally **not copied into GitHub, documentation, logs, or commits**. Any future deployment process must preserve private server configuration outside version control.

## v104 package validation notes carried by the backup

The package itself records that local Next production build and mocked integration tests passed, but browser layout/interaction QA, PHP runtime validation, active API readiness, real Sheet/Calendar/Meet/inbox delivery, and Apps Script deployment matching were still pending at release time.

Those remain acceptance gates unless independently verified later.

## Next recovery gate

The fastest exact path is to obtain the editable v104 source corresponding to Site commit `66e3e1df67331a92b2966dcab9724e70c8f11d90`.

If that source cannot be recovered, the fallback is to reconstruct the current homepage/source from the v104 static package and the existing GitHub recovery source, then prove it by fresh-build parity against this Hostinger manifest.
