const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('integrations/sera-v9-source/api-runtime.txt','utf8');
let messages=[];
const ctx={AbortController,setTimeout,clearTimeout,Error,Date,session:{pending:{id:'retained'}},CHAT_KEY:'test',localStorage:{removeItem(){}},add:(_,text)=>messages.push(text)};
vm.createContext(ctx);vm.runInContext(source,ctx);
const valid={ok:true,reference:'HADI-12345678-1234-1234-1234-123456789abc',status:'booked',booking:true,meetingStatus:'ready',meetUrl:'https://meet.google.com/abc-defg-hij',eventId:'event-1',start:'2026-12-01T12:00:00Z'};
for(const patch of [{status:'pending'},{status:'received',booking:true},{meetingStatus:'pending'},{meetingStatus:'failed'},{eventId:''},{start:'invalid'},{meetUrl:'https://example.com/fake'}]) {
 assert.throws(()=>ctx.acceptResult({...valid,...patch}));
 assert(ctx.session.pending);
 assert.equal(messages.length,0);
}
ctx.acceptResult(valid);assert.equal(ctx.session.pending,null);assert.equal(messages.length,1);
ctx.fetch=async()=>({ok:true,json:async()=>({ok:true,reference:valid.reference,booking:true})});
(async()=>{const result=await ctx.request('booking',{});assert.equal(result.status,'pending');console.log('Client rejects incomplete confirmations, retains pending drafts, accepts full event/Meet contract, and does not promote legacy responses.');})().catch(e=>{console.error(e);process.exitCode=1});
