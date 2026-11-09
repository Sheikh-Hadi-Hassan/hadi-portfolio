# Private tenant configuration foundation

`TenantConfiguration.php` is a dependency-free, private backend contract. It is not an HTTP endpoint, customer identity provider, storage adapter, public embed or live publishing integration.

- Compose `SeraTenantContext::authenticate()` only with a trusted server-side identity verifier. Its callback must verify the session and derive memberships from authoritative storage; never echo request claims or Google Sheet application roles.
- Implement `SeraTenantRepository` with tenant-namespaced reads and atomic transactions. Verify physical access controls, concurrency, durability, recovery and tenant isolation before setting `storageVerified=true`.
- Keep `writesApproved=false` until that adapter and identity boundary are accepted. Both flags default false and must never be request parameters.
- The strict version-1 schema permits only business identity, an HTTPS website reference, services and offers. The reference is not fetched. No credentials, tool permissions, provider activation or public Sera settings are accepted.
- Save operations require an expected revision and stable operation UUID. Success requires authoritative, namespace-matched readback. Uncertain acknowledgement or readback returns `TENANT_SAVE_UNCONFIRMED`, without retrying automatically. Reconcile the same operation ID and payload; do not invent a new ID after uncertainty.
- At 500 operations, writes stop pending a separately designed archive/migration. No history is silently deleted. Schema migration is intentionally not implemented: unknown versions fail closed.
- Render configuration as untrusted text using the existing approved publishing/escaping contracts. These private drafts never affect public Sera.

Local verification: `php tests/sera-tenant-configuration.php`. The in-memory atomic repository and authentication fixtures verify contracts only. They do not establish hosted identity, durable tenant isolation, encryption custody or production acceptance. No existing records are migrated.
