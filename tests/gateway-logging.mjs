import assert from 'node:assert/strict';
import fs from 'node:fs';

const publicGateway=fs.readFileSync('public/api/leads.php','utf8');
const mirroredGateway=fs.readFileSync('integrations/leads/leads.php','utf8');

assert.equal(publicGateway,mirroredGateway,'Public and integration lead gateways must stay byte-identical.');
assert.match(publicGateway,/function auditOutcome\(/);
assert.match(publicGateway,/error_log\(sprintf\('\[hadi-leads\]/);
assert.match(publicGateway,/substr\(hash\('sha256',\$requestId\),0,12\)/);

const auditStart=publicGateway.indexOf('function auditOutcome(');
const auditEnd=publicGateway.indexOf('\nfunction readConfig',auditStart);
assert.ok(auditStart>=0&&auditEnd>auditStart,'auditOutcome helper must be present before readConfig.');
const auditHelper=publicGateway.slice(auditStart,auditEnd);

for(const forbidden of ["$p['name']","$p['email']","$p['phone']","$p['notes']","$p['answers']","$c['key']","$c['url']","REMOTE_ADDR"]){
  assert.ok(!auditHelper.includes(forbidden),`Logging helper must not include sensitive source: ${forbidden}`);
}
assert.match(publicGateway,/auditOutcome\(\$action,'pending',202/);
assert.match(publicGateway,/auditOutcome\(\$action,'rejected',\$http/);
assert.match(publicGateway,/auditOutcome\(\$action,\(string\)\(\$result\['status'\]/);

console.log('Gateway observability: outcome logs are mirrored, hashed-reference only, and exclude PII/secrets.');
