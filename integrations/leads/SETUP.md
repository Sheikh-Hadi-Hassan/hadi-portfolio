# One-time connection for website enquiries

The form interface is built. Google delivery and booking DO NOT work until this setup is completed. The ChatGPT Calendar connection is not a website credential.

Use sheikh.hadi.hassan@gmail.com for the following steps.

1. Open https://script.google.com/home/start and create a project called Hadi Website Leads.
2. Paste Code.gs into its editor. Open Project Settings, enable “Show appsscript.json manifest file”, and replace that manifest with the supplied appsscript.json. This enables the advanced Google Calendar service.
3. In Project Settings → Script properties, set SHEET_ID to `1RznrcfnhvwECggvvMBNMpvlPTdqqgFUQjWk7EcSkITc` (the existing private Website Leads sheet). Add API_KEY with a new random value of at least 32 characters. Keep it private. The same value will go in the PHP config.
4. Run setup in the script editor and allow the requested Google permissions. The execution log prints the private Google Sheet URL. Only this Google account owns it; the script never makes it public.
5. Deploy → New deployment → Web app. Execute as: Me. Who has access: Anyone. The API key, checked server-side, protects the endpoint. Copy the /exec URL, not /dev.
6. On Hostinger, place api/leads.php in the same website root as index.html. Enable PHP 8.1 or newer and cURL if not already enabled.
7. Create hadi-leads-config.php ONE directory above this site's public_html, using hadi-leads-config.example.php. Enter the /exec URL and API_KEY. Never put this config in the public website root or GitHub.
8. In Apps Script → Triggers, add retryNotifications as a time-driven trigger every hour. This retries notification emails if Google mail temporarily fails. Sheet data remains saved independently of mail delivery.
9. Submit one real test enquiry. Confirm a new row in the Sheet and notifications at BOTH hadi@intellignce.net and sheikh.hadi.hassan@gmail.com.
10. Test one booking, verify the Google Calendar event, Meet link and invitation. Try an occupied slot and confirm it is unavailable. Delete the test event after checking.

Appointments: 30 minutes, all weekdays and hours, within the next 60 days. A 30-minute minimum notice prevents booking past/current slots. Existing busy events on the primary Google Calendar block slots. Visitor-local times account for time zones and daylight saving. Availability is checked again under a lock before booking. Other scheduling systems can still modify Google Calendar independently; Google does not provide an atomic free/busy-and-insert operation.

Emails include the full brief, contact details and Sheet link. No file uploads. Existing hero design stays unchanged.

After editing Apps Script later, update the deployed version via Manage deployments so the public /exec endpoint gets the latest code.

## Conversational consultation update

The website now uses `src/app/consultation.mjs` to preserve the six service questionnaires, ask shared questions once, and prepare a reviewable brief. A seven-day browser draft includes unfinished input and the exact pending request. Successful delivery clears that draft. The backend still must confirm the save; a failed request never displays success.

Deploy `leads.php` to `/api/leads.php` and use the updated `Code.gs`. Phone is optional for email enquiries and required when the visitor chooses WhatsApp. The `answers._consultation` envelope includes the structured brief, complete question/answer transcript and consent timestamp. It travels through the existing private Sheet column and both email notifications. No new public Sheet permissions are required.

Optional AI: deploy `consultation.php` to `/api/consultation.php`. Set `OPENAI_API_KEY` and `OPENAI_MODEL` in the server's private environment. Do not put them in browser JavaScript, a `NEXT_PUBLIC_` variable or the public web root. The visitor explicitly chooses AI assistance; only the project description is sent, not name/email/phone. Responses use a strict schema and require visitor confirmation. If configuration, rate limit, network or provider fails, the normal service questionnaire stays usable. Do not label the guided flow as live AI until the endpoint is configured and tested.

Activation checks: verify POST is handled as PHP rather than returned as text; submit a uniquely labelled test enquiry; confirm the reference in the private Google Sheet, the full transcript in Brief JSON, and notifications at both approved addresses. Retry the exact same request ID and confirm one row. Test Calendar separately. No end-to-end delivery has been verified by the frontend tests.
