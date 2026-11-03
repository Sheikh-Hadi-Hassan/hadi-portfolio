import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
function test(failAt=0,failFlush=false){let writes=0,sends=0,quota=100;const row=Array(18).fill('');row[0]='HADI-test';row[3]='Test';row[4]='test@example.invalid';row[17]='{}';const sheet={getRange:(_,c)=>({getValues:()=>[row],getValue:()=>row[c-1],setValue:v=>{writes++;if(writes===failAt)throw Error('simulated storage crash');row[c-1]=v}})};const ctx={console,Date,JSON,Error,Number,String,Array,SpreadsheetApp:{flush(){if(failFlush){failFlush=false;throw Error("simulated intent-flush crash")}}},Utilities:{formatDate:()=> 'test date'},CacheService:{getScriptCache:()=>({get(){},put(){}})},MailApp:{getRemainingDailyQuota:()=>quota,sendEmail:()=>{sends++;if(quota<100)quota--}}};vm.createContext(ctx);vm.runInContext(fs.readFileSync('integrations/calendar-v8/Code.gs','utf8'),ctx);return {ctx,sheet,row,sends:()=>sends,setQuota:v=>quota=v,send:()=>ctx.notify_(sheet,2,null,JSON.parse(row[17]))}}
let h=test(1);assert.throws(h.send);assert.equal(h.sends(),0);h.send();assert.equal(h.sends(),2); // Failed intent write cannot send; safe retry.
h=test(2);assert.throws(h.send);assert.equal(h.sends(),1);assert.throws(h.send,e=>e.code==='DELIVERY_UNKNOWN');assert.equal(h.sends(),1); // Real send, lost ack: never replay.
h=test();h.setQuota(0);assert.throws(h.send,e=>e.code==='MAIL_QUOTA');assert.equal(h.sends(),0);assert.equal(h.row[17],'{}');h.setQuota(100);h.send();assert.equal(h.sends(),2);h.send();assert.equal(h.sends(),2);
console.log('PASS: intent write failure sends nothing; lost post-send acknowledgement blocks replay; pre-send quota failure remains retryable; completed deliveries are skipped. Isolated fake mail/store only.');

h=test(0,true);assert.throws(h.send);assert.equal(h.sends(),0);assert.throws(h.send,e=>e.code==='DELIVERY_UNKNOWN');assert.equal(h.sends(),0);
h=test();h.setQuota(1);assert.throws(h.send,e=>e.code==='MAIL_QUOTA');assert.equal(h.sends(),1);h.setQuota(100);h.send();assert.equal(h.sends(),2);
console.log('PASS: crash after intent but before transmission is quarantined; safe partial quota retry sends only the unattempted recipient.');

h=test(2);assert.throws(()=>h.ctx.notifyReview_(h.sheet,2,JSON.parse(h.row[17]),'isolated review'));assert.equal(h.sends(),1);assert.throws(()=>h.ctx.notifyReview_(h.sheet,2,JSON.parse(h.row[17]),'isolated review'),e=>e.code==='DELIVERY_UNKNOWN');assert.equal(h.sends(),1);console.log('PASS: manual-review alerts also quarantine uncertain delivery without automatic duplicate alerts.');
for(const corrupt of [false,true]){
 h=test(corrupt?0:2);if(corrupt)h.row[17]='invalid-json';else assert.throws(h.send);
 let removed=false;h.ctx.PropertiesService={getScriptProperties:()=>({getProperties:()=>({'JOB_test':JSON.stringify({row:2,next:0,lease:0})}),getProperty:()=>JSON.stringify({row:2,next:0,lease:0})})};h.ctx.leaseJob_=()=>({row:2,created:Date.now(),attempts:0});h.ctx.sheet_=()=>h.sheet;h.ctx.finishJob_=(_,job,complete)=>removed=complete;
 h.ctx.processOutbox();assert.equal(h.row[14],'Delivery unknown — manual reconciliation required');assert(removed);assert.equal(h.sends(),corrupt?0:1);
}
console.log('PASS: outbox quarantines lost-ack and corrupt-metadata jobs for manual reconciliation without another send.');
