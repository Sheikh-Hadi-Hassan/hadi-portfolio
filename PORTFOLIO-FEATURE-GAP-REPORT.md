# Portfolio feature gap report

This is a bounded preliminary gap report. A source declaration is not test evidence.

|Priority|Gap|Existing evidence|Files/components to investigate|Implementation and verification|
|---|---|---|---|---|
|P0|Booking confirmation may not correspond to a calendar event|20 October notes report unmatched event; 3 November acceptance NO-GO|api/leads.php, Apps Script deployment, booking UI|Inspect effective runtime/deployment identity; run approved staging failure tests; correlate durable record, calendar event, Meet and notifications before confirming|
|P0|Lead delivery and persistence not accepted|README describes contact dialog rather than submission form|contact components, api/leads.php|Verify current implementation, durable persistence, validation, idempotency, and delivery with authorized evidence|
|P0|Release manifest stale|Backend acceptance report documents hash mismatch|release manifest, deployment scripts|Regenerate only after validated candidate; compare to authenticated production inventory|
|P1|Responsive and accessibility acceptance missing|README acknowledges browser QA gap|src/styles, src/app|Test 320/360/375/390/430/768/1024/1280/1440; audit WCAG 2.2 AA|
|P1|SEO/live preview not fully accepted|README references SEO scripts but no execution evidence here|src/app, sitemap, robots, OG assets|Run tests; validate production canonical, previews and indexability|
|P1|Sera safety/reliability not accepted|Previous health checks do not establish user-flow correctness|Sera widget and gateway|Test knowledge, injection resistance, errors, fallback and rate limits|

No claims of a repaired defect or executed test are made here.
