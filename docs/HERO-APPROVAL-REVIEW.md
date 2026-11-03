# Hero baseline: owner review

Status: PROPOSED, NOT APPROVED. No active lock restored. Guard unchanged.

|Guard input|SHA-256|
|---|---|
|Hero section from src/pages/home.html (portfolio-hero to bayfi-body boundary)|bafe2419c5332ebc59e93519ed7c94c125a684f9c05d2dee3e55b41f06de608e|
|src/styles/hero.css|fc5224e4a0ab4bc2957f8be69ac8f84e6b48b125b771e7123e84c552e77b035f|
|src/styles/site.css|7255e1f9fe90310502abca9c422d82cc135bf0dcba5aa574650513fd807a8b33|

Proposed active lock contents (not installed):

```json
{
  "hero_html": "bafe2419c5332ebc59e93519ed7c94c125a684f9c05d2dee3e55b41f06de608e",
  "hero_css": "fc5224e4a0ab4bc2957f8be69ac8f84e6b48b125b771e7123e84c552e77b035f",
  "shared_css": "7255e1f9fe90310502abca9c422d82cc135bf0dcba5aa574650513fd807a8b33"
}
```

Evidence: source inputs match the last source checkpoint comparison in tests/utility-routes.py. Prior main/integration path-history queries and preserved hosting ZIP did not recover the approved file. Original approved hashes are unknown, so approved-baseline differences cannot be calculated. No new visual/browser comparison was performed. Byte-identical scoped inputs support preservation of those inputs; they do not independently certify unchanged rendered appearance across runtimes.

Owner decision: review these three exact hashes and source files at the development commit, then explicitly say “I approve the three hashes in this proposal as the replacement hero baseline for local build and QA.” Alternatively provide the original approved design/hero-lock.json with its source revision. This authorizes only baseline installation and local QA, not production deployment.

After approval only: install exactly the three-key hash object at design/hero-lock.json, retain this review and owner approval reference, run npm run verify, then the full build. Any mismatch stops acceptance. Do not edit hero inputs to make them match.

Rollback of a future baseline activation: remove only the newly approved lock or restore a previously authenticated lock; revert the activation commit; rerun npm run verify and expect the missing/mismatched lock to block. No website or provider data rollback is involved. Currently there is no active baseline change to roll back.
