import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import vm from 'node:vm';

const props=new Map([['SHEET_ID','test-sheet']]);
const cache=new Map();
let currentEvent=null,savedRow=null;
const sheet={
  getLastRow:()=>savedRow?2:1,
  getRange:()=>({getValues:()=>[savedRow]}),
  getSheetName:()=> 'Leads',
};
const ctx={
  console,Date,JSON,Error,Number,String,Array,
  PropertiesService:{getScriptProperties:()=>({
    getProperty:key=>props.get(key)||'',
    setProperty:(key,value)=>props.set(key,String(value)),
    getProperties:()=>Object.fromEntries(props),
    deleteProperty:key=>props.delete(key),
  })},
  CacheService:{getScriptCache:()=>({
    get:key=>cache.get(key)||null,
    put:(key,value)=>cache.set(key,String(value)),
  })},
  SpreadsheetApp:{openById:()=>({getSheetByName:()=>sheet})},
  Calendar:{
    Events:{
      get:()=>{if(currentEvent===null)throw new Error('404 not found');return currentEvent;},
    },
    Freebusy:{query:()=>({calendars:{'sheikh.hadi.hassan@gmail.com':{busy:[]}}})}
  },
  Utilities:{
    DigestAlgorithm:{SHA_256:'SHA_256'},
    computeDigest:(_,value)=>[...crypto.createHash('sha256').update(String(value)).digest()],
    sleep:()=>{},
    formatDate:()=> '2026-11-02',
  }
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('integrations/calendar-v8/Code.gs','utf8'),ctx);

ctx.row_=()=>savedRow?2:0;
const ref='HADI-12345678-1234-1234-1234-123456789abc';
const baseEvent={
  id:'hadi12345678123412341234123456789abc',
  status:'confirmed',
  end:{dateTime:'2026-11-03T07:30:00.000Z',timeZone:'Asia/Karachi'},
  extendedProperties:{private:{hadiReference:ref}},
  start:{dateTime:'2026-11-03T07:00:00.000Z'},
  htmlLink:'https://calendar.google.com/event?eid=test',
};

function resultFor(event,reference){currentEvent=event;return ctx.bookingResult_(event,reference,event.start?.dateTime)}

assert.deepEqual(
  JSON.parse(JSON.stringify(ctx.meeting_({...baseEvent,conferenceData:{createRequest:{status:{statusCode:'pending'}}}}))),
  {meetingStatus:'pending',meetUrl:''}
);
assert.deepEqual(
  JSON.parse(JSON.stringify(ctx.meeting_({...baseEvent,conferenceData:{createRequest:{status:{statusCode:'failure'}}}}))),
  {meetingStatus:'failed',meetUrl:''}
);
assert.deepEqual(
  JSON.parse(JSON.stringify(ctx.meeting_({...baseEvent,hangoutLink:'https://meet.google.com/abc-defg-hij'}))),
  {meetingStatus:'ready',meetUrl:'https://meet.google.com/abc-defg-hij'}
);

let result=resultFor({...baseEvent,conferenceData:{createRequest:{status:{statusCode:'pending'}}}},ref);
assert.equal(result.ok,true);
assert.equal(result.status,'pending');
assert.equal(result.booking,false);
assert.equal(result.meetingStatus,'pending');
assert.equal(result.meetUrl,'');

result=resultFor({...baseEvent,hangoutLink:'https://meet.google.com/abc-defg-hij'},ref);
assert.equal(result.status,'booked');
assert.equal(result.booking,true);
assert.equal(result.meetingStatus,'ready');
assert.equal(result.meetUrl,'https://meet.google.com/abc-defg-hij');

result=resultFor({...baseEvent,status:'cancelled'},ref);
assert.equal(result.ok,false);
assert.equal(result.code,'CANCELLED');
assert.equal(result.delivery,'not_sent');

savedRow=Array(18).fill('');savedRow[0]=ref;savedRow[11]=baseEvent.start.dateTime;savedRow[12]=baseEvent.id;
currentEvent={...baseEvent,conferenceData:{createRequest:{status:{statusCode:'pending'}}}};
result=ctx.status_({requestId:'12345678-1234-1234-1234-123456789abc'});
assert.equal(result.status,'pending');
assert.equal(result.booking,false);
assert.equal(result.meetingStatus,'pending');

currentEvent={...baseEvent,hangoutLink:'https://meet.google.com/abc-defg-hij'};
result=ctx.status_({requestId:'12345678-1234-1234-1234-123456789abc'});
assert.equal(result.status,'booked');
assert.equal(result.meetingStatus,'ready');

savedRow=null;currentEvent=null;
result=ctx.status_({requestId:'12345678-1234-1234-1234-123456789abc'});
assert.equal(result.status,'not_found');
assert.equal(result.booking,false);

console.log('Booking status contract: event reservation, Meet pending/ready/failed, cancellation and not-found recovery states pass.');

for (const overrides of [
  {status:'tentative'}, {id:''}, {start:{dateTime:'invalid'}},
  {hangoutLink:'https://example.com/fake'},
  {hangoutLink:'',conferenceData:{createRequest:{status:{statusCode:'failure'}}}},
]) {
  const response=resultFor({...baseEvent,hangoutLink:'https://meet.google.com/abc-defg-hij',...overrides},ref);
  assert.equal(response.status,'pending');
  assert.equal(response.booking,false);
}
assert.equal(fs.readFileSync('integrations/calendar-v8/Code.gs','utf8'),fs.readFileSync('integrations/leads/Code.gs','utf8'));
console.log('Pending/failed Meet, invalid event identity/time and tentative events never confirm; integration copies match.');

currentEvent={...baseEvent,hangoutLink:'https://meet.google.com/abc-defg-hij'};savedRow=null;
assert.equal(ctx.status_({requestId:ref.slice(5)}).status,'pending');
savedRow=Array(18).fill('');savedRow[0]=ref;savedRow[11]=baseEvent.start.dateTime;savedRow[12]='wrong-event';
assert.equal(ctx.status_({requestId:ref.slice(5)}).booking,false);
savedRow[12]=baseEvent.id;savedRow[11]='2026-12-31T07:00:00Z';
assert.equal(ctx.status_({requestId:ref.slice(5)}).booking,false);
savedRow[11]=baseEvent.start.dateTime;
assert.equal(ctx.status_({requestId:ref.slice(5)}).status,'booked');
console.log('Persisted lead/event/time correlation required: orphan event and mismatched record stay pending.');
