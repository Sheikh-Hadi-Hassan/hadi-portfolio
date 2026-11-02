import assert from 'node:assert/strict';
import fs from 'node:fs';

const html=fs.readFileSync('integrations/leads-portal/LeadsDesk.html','utf8');
const gs=fs.readFileSync('integrations/leads-portal/LeadsDesk.gs','utf8');

for(const required of [
  "mailto:",
  "tel:",
  "https://wa.me/",
  "Copy contact",
  "Open meeting",
  "View project brief",
  "Source:r.source",
  "contact-grid"
]) assert.ok(html.includes(required),`Lead workspace missing ${required}`);

for(const required of [
  "email:deskPlain_(r[4])",
  "phone:deskPlain_(r[5])",
  "source:r[13]||''",
  "notification:r[14]||''",
  "meet:r[16]||''"
]) assert.ok(gs.includes(required),`Lead data mapping missing ${required}`);

assert.ok(!html.includes('innerHTML=r.'),'Lead values must not be injected with innerHTML.');
console.log('Lead CRM contract: contact details, email/call/WhatsApp, source, meeting and brief actions are present.');
