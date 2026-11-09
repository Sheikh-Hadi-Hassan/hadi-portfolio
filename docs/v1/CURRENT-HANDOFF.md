# Current implementation handoff

Branch: work/v01-booking-contract-20261103. This slice starts from actual HEAD e70f2f8c70fb4de3fea08c0b92bee0288f43ca16, preserving the requested 429d5d8 checkpoint and newer TMS-link correction.

Current slice: owner-authorized hero CSS refinement only. Restored edge-to-edge viewport-height composition, prominent responsive portrait, compact mobile spacing, dark backdrop and home-only 320px dock fit. Existing hero copy/markup, image inputs, shared CSS, delayed reel timing and reduced-motion behavior remain unchanged. Other homepage sections, booking, Sera, CRM and backend logic were not changed.

Verified: node tests/hero-responsive.cjs, using exact pinned assets and official GSAP, passes six real isolated Chromium cases at 320x800, 768x1024 and 1440x900, in normal/reduced motion. Checks include no horizontal overflow, viewport-height composition, copy/CTA bounds, portrait sizing, focus/Tab progression, zero axe findings in the hero, real 20% hold/82% expansion and dynamic reduced-motion pause. Reel and hero-dither unit suites and test syntax pass. Exact commands/geometry are in docs/HERO-REFINEMENT-EVIDENCE.json. These are source-preview checks, not full Next hydration or production-build acceptance.

Prior work preserved: approved working-board process, homepage product/About/reel/folder improvements, TMS dashboard link, CRM follow-up validation/filtering and default-disabled private tenant configuration contracts.

No hero lock installed; guard still blocks. Previous proposed hashes are historical/STALE after the authorized CSS refinement, not an activation candidate. No new hashes proposed. Owner visual approval is the next hero gate, followed by a separate exact-hash review. Other unchanged blockers: hosting/backend identity, deployment/ACL/cleanup/custody and authorized live integration/rollback acceptance.

Portfolio acceptance remains 27/243 (11.11%), 185 partial and 31 externally blocked; production-build browser coverage 0/198. Manifest STALE; release NO-GO. No production/main/recovery or live integration changes.
