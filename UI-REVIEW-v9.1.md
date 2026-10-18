# UI review and implementation, v9.1

Provisional before score: 7/10. Based on the six supplied screenshots and source audit, not a measured usability score. The direction is strong; hierarchy and booking recovery were inconsistent. A new score needs browser and visitor testing after installation.

Implemented:
- Bottom command dock with grouped shortcuts and one prominent menu action.
- Full-screen menu with all available project destinations, live search, empty state, keyboard shortcut and focus/scroll recovery.
- Removed the competing legacy React enquiry form from the active layout. Service CTAs route into Sera.
- Labelled calendar action, removed the floating calendar symbol beside Sera, aligned message input and controls.
- Pending requests have a dedicated recovery card and bounded automatic status checks. Manual check retains the same reference and never creates a second write while status is pending.
- Optional supporting cursor on fine pointers only; native pointer retained, absent on touch and reduced-motion devices.
- Branded escaped HTML emails with verified-format Meet links.
- Private Google Sheets lead workspace with search, filters, details and brief viewer. No public CRM endpoint.
- Corrected mixed old/new AI endpoint files. Export regression checks require readiness support and matching widget/API assets.

Observed live blockers:
- Lead API returned available:false, HTTP 200 during this audit.
- AI API GET returned HTTP 405 before this update, matching an older endpoint.
- Private server configuration is still needed. No live booking, provider call, email delivery or inbox receipt was verified.

Validation:
Production build, 19 exported routes, SEO, image targets, hydration records and existing reel motion contracts passed. Eight JSDOM widget test groups passed, including pending recovery and service CTA routing. Navigation search/dialog tests and private portal/email escaping checks passed.

Limits:
No browser visual QA at physical device sizes or microphone testing. No claim of zero runtime bugs. No Hostinger deployment performed by this session. Email and lead workspace changes require the documented Google Apps Script installation; uploading PHP/static files alone cannot update that external project.
