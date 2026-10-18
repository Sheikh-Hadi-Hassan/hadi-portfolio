// Add this helper to the EXISTING Apps Script project. No setup or deployment is run by this file.
function intellignceEmailHtml_(title, fields) {
  const escape = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function rows(values) {
    return '<table role="presentation" style="width:100%;border-collapse:collapse">'+Object.keys(values).map(label => {
      const value=values[label];if(value===null||value===''||value===undefined)return '';
      if(typeof value==='object'&&!Array.isArray(value))return '<tr><td colspan="2" style="padding-top:20px;color:#d8baf2">'+escape(label)+rows(value)+'</td></tr>';
      return '<tr><td style="padding:12px 16px 12px 0;border-bottom:1px solid #392e41;color:#b8adbf;vertical-align:top">'+escape(label)+'</td><td style="padding:12px 0;border-bottom:1px solid #392e41;color:#f3eef7">'+escape(Array.isArray(value)?value.join(', '):value).replace(/\n/g,'<br>')+'</td></tr>';
    }).join('')+'</table>';
  }
  return '<!doctype html><html><body style="margin:0;background:#100d14;color:#f3eef7;font:14px/1.7 Arial"><table role="presentation" width="100%"><tr><td style="padding:24px 16px"><table role="presentation" style="width:100%;max-width:640px;margin:auto;background:#1b1422;border-radius:16px"><tr><td style="padding:32px"><p style="color:#d8baf2;letter-spacing:3px;font-size:12px">INTELLIGNCE</p><h1 style="font-size:30px;font-weight:400;line-height:1.2">'+escape(title)+'</h1>'+rows(fields)+'<p style="padding-top:24px;color:#b8adbf">Hadi Hassan · INTELLIGNCE<br><a style="color:#d8baf2" href="mailto:hadi@intellignce.net">hadi@intellignce.net</a></p></td></tr></table></td></tr></table></body></html>';
}
// At your existing MailApp.sendEmail call, retain to/replyTo/subject/body and ADD:
// htmlBody: intellignceEmailHtml_('A new project to explore.', {
//   Reference: ref, Name: p.name, Email: p.email, Phone: p.phone,
//   Business: p.company, Services: p.services,
//   'Project brief': p.answers?._consultation?.brief || p.answers, Notes: p.notes
// })
// Keep existing delivery status, retry and idempotency logic unchanged.
