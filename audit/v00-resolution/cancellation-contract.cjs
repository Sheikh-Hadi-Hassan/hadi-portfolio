// Candidate-only, no-network diagnostic. Not a test of deployed Version 7.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source='/workspace/scratch/9870f80c5674/remediation/source/integrations/calendar-v8/Code.gs';
const id='00000000-0000-4000-8000-000000000001',ref='HADI-'+id;
function fixture(status,queued=true){
 const values=Array(18).fill('');values[0]=ref;values[2]='Booked';values[11]='2026-10-25T08:00:00.000Z';values[14]='Sent';values[17]='{}';
 const properties=new Map(queued?[[`JOB_${id}`,JSON.stringify({row:2,created:Date.now(),attempts:0})]]:[]);
 const props={getProperties:()=>Object.fromEntries(properties),getProperty:k=>properties.get(k),setProperty:(k,v)=>properties.set(k,v),deleteProperty:k=>properties.delete(k)};
 const sheet={getRange:(row,col)=>({getValue:()=>values[col-1],setValue:v=>{values[col-1]=v},getValues:()=>[values]})};
 let event={id:'hadi'+id.replaceAll('-',''),status,start:{dateTime:values[11]},extendedProperties:{private:{hadiMeetNotified:'1'}}};
 const ctx=vm.createContext({PropertiesService:{getScriptProperties:()=>props},LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock:()=>{}})}});
 vm.runInContext(fs.readFileSync(source,'utf8'),ctx);
 ctx.sheet_=()=>sheet;ctx.event_=()=>event;ctx.meeting_=()=>({meetingStatus:'ready',meetUrl:'https://meet.google.com/aaa-bbbb-ccc'});ctx.notify_=()=>true;
 return {ctx,values,properties,setEvent:s=>{event={...event,status:s}}};
}
const completed=fixture('confirmed');completed.ctx.processOutbox();assert.equal(completed.properties.size,0);completed.setEvent('cancelled');completed.ctx.processOutbox();assert.equal(completed.values[2],'Booked');
const queued=fixture('cancelled');queued.ctx.processOutbox();assert.equal(queued.values[2],'Cancelled');
const statusOnly=fixture('cancelled',false);const reply=statusOnly.ctx.status_({requestId:id});assert.equal(reply.code,'CANCELLED');assert.equal(statusOnly.values[2],'Booked');
console.log(JSON.stringify({scope:'Recovered candidate only; VM mocks; no network, mail, Calendar or CRM action',tests:[{case:'Cancellation after completed job deletion',result:'PASS diagnostic: CRM stays Booked because no job remains'},{case:'Cancellation while job still queued',result:'PASS diagnostic: CRM becomes Cancelled'},{case:'Status read sees cancellation',result:'PASS diagnostic: returns CANCELLED without reconciling CRM row'}],productionConclusion:'Unknown until actual deployed Version 7 is verified'},null,2));
