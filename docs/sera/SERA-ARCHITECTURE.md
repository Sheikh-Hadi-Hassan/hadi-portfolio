# Architecture

Existing widget engine owns lead schema, service catalogue, branching and booking contract. discovery.mjs normalizes question metadata, validates supported answer shapes and creates a non-binding draft. guided.js renders controls and commits answers through the existing engine. Session.discovery (version 1) stores active cursor, skips, errors, transcript review, summary and proposal; enclosing version-1 session migration remains compatible. Session ID survives reload; AI permission does not. No LLM is invoked for guided progression.

Review-and-send uses the existing consented enquiry path. Proposal handoff is added to _consultation; backend size validation remains authoritative. Direct booking deactivates the guided view without deleting answers. Public Sera still has only public capabilities. No authenticated support portal or private customer API was added.

PHP provider-router.php is a policy core with injectable adapters. It is intentionally not wired into ask.php yet. Existing Gemini integration and its unbilled-project gate remain unchanged. Mock failover is not live provider failover. New error registry is a foundation; not every legacy voice/UI/backend path has been migrated.
