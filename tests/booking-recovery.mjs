import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
function harness(mode='ready'){
 const rows=[],events=new Map(),props=new Map(),sent=[],cache=new Map();let inserts=0,failMail=true;
 const range=(r,c,n=1)=>({setValues(v){rows[r-2]=v[0]},setValue(v){rows[r-2][c-1]=v},getValue(){return rows[r-2]?.[c-1]},getValues(){return [rows[r-2]]}});
 const sheet={getLastRow:()=>rows.length+1,getRange:range};
 const ctx={console,Date,JSON,Error,Math,Number,String,Array,PropertiesService:{getScriptProperties:()=>({getProperty:k=>props.get(k)||'',setProperty:(k,v)=>props.set(k,v),getProperties:()=>Object.fromEntries(props),deleteProperty:k=>props.delete(k)})},CacheService:{getScriptCache:()=>({get:k=>cache.get(k),put:(k,v)=>cache.set(k,v)})},SpreadsheetApp:{flush(){}},Utilities:{DigestAlgorithm:{SHA_256:1},computeDigest:(_,v)=>[...crypto.createHash('sha256').update(v).digest()],sleep(){},formatDate:()=> 'test date'},MailApp:{getRemainingDailyQuota:()=>100,sendEmail(p){if(failMail&&sent.length===1)throw Error('temporary mail failure');sent.push(p.to)}},Calendar:{Events:{get(_,id){if(!events.has(id))throw Error('404 not found');return events.get(id)},insert(e){inserts++;if(mode==='failure')throw Error('permission denied');if(mode==='timeout')throw Error('503 timeout');e.status='confirmed';e.hangoutLink=mode==='pending'?'':'https://meet.google.com/abc-defg-hij';events.set(e.id,e);if(mode==='lost-response')throw Error('503 timeout');return e}},Freebusy:{query:()=>({calendars:{'sheikh.hadi.hassan@gmail.com':{busy:mode==='busy'?[{start:'2026-12-01T00:00:00Z',end:'2026-12-02T00:00:00Z'}]:[]}}})}}};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync('integrations/calendar-v8/Code.gs','utf8'),ctx);ctx.sheet_=()=>sheet;ctx.row_=(_,ref)=>{const i=rows.findIndex(r=>r[0]===ref);return i<0?0:i+2};
 return {ctx,rows,events,sent,sheet,inserts:()=>inserts,allowMail:()=>failMail=false};
}
const p={action:'booking',requestId:'12345678-1234-1234-1234-123456789abc',name:'Isolated test',email:'test@example.invalid',services:[],answers:{},slot:'2026-12-01T12:00:00Z',timezone:'Asia/Karachi'};
for(const mode of ['ready','lost-response','pending']){const h=harness(mode);const first=h.ctx.save_(p);h.ctx.save_(p);assert.equal(h.rows.length,1);assert.equal(h.inserts(),1);assert.equal(first.status,mode==='pending'?'pending':'booked');assert.throws(()=>h.ctx.save_({...p,name:'Changed'}),e=>e.code==='REFERENCE_MISMATCH')}
for(const mode of ['timeout','failure','busy']){const h=harness(mode);if(mode==='timeout'){assert.equal(h.ctx.save_(p).status,'pending');assert.equal(h.rows[0][2],'Pending')}else assert.throws(()=>h.ctx.save_(p),e=>e.code===(mode==='busy'?'SLOT_UNAVAILABLE':'CALENDAR_WRITE'));assert.equal(h.events.size,0)}
const h=harness();h.ctx.save_(p);const metadata={};assert.throws(()=>h.ctx.notify_(h.sheet,2,[...h.events.values()][0],metadata));assert.equal(h.sent.length,1);h.allowMail();assert.throws(()=>h.ctx.notify_(h.sheet,2,[...h.events.values()][0],metadata),e=>e.code==='DELIVERY_UNKNOWN');assert.equal(h.sent.length,1);
console.log('PASS: isolated duplicate/mismatched keys, lost Calendar response reconciliation, pending Meet, timeout, Calendar denial, busy slot and uncertain partial notification replay suppression. No external calls. Provider delivery ambiguity requires manual reconciliation.');
const persisted=harness();const saved=persisted.ctx.save_(p),row=persisted.rows[0];
assert.equal(row[0],'HADI-'+p.requestId);assert.equal(row[3],p.name);assert.equal(row[4],p.email);assert.equal(row[10],p.timezone);assert.equal(row[2],'Booked');assert.equal(row[12],[...persisted.events.keys()][0]);assert.equal(saved.reference,row[0]);assert.equal(saved.eventId,row[12]);
console.log('Saved lead retains stable reference, supplied contact and visitor zone, state and matching external event ID. Mock persistence only.');
