import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import vm from 'node:vm';

const props=new Map();
const cache=new Map();
let currentEvent=null;
const sheet={
  getLastRow:()=>1,
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

const ref='HADI-12345678-1234-1234-1234-123456789abc';
const baseEvent={
  id:'hadi12345678123412341234123456789abc',
  status:'confirmed',
  start:{dateTime:'2026-11-03T07:00:00.000Z'},
  htmlLink:'https://calendar.google.com/event?eid=test',
};

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

let result=ctx.bookingResult_({...baseEvent,conferenceData:{createRequest:{status:{statusCode:'pending'}}}},ref);
assert.equal(result.ok,true);
assert.equal(result.status,'booked');
assert.equal(result.booking,true);
assert.equal(result.meetingStatus,'pending');
assert.equal(result.meetUrl,'');

result=ctx.bookingResult_({...baseEvent,hangoutLink:'https://meet.google.com/abc-defg-hij'},ref);
assert.equal(result.status,'booked');
assert.equal(result.booking,true);
assert.equal(result.meetingStatus,'ready');
assert.equal(result.meetUrl,'https://meet.google.com/abc-defg-hij');

result=ctx.bookingResult_({...baseEvent,status:'cancelled'},ref);
assert.equal(result.ok,false);
assert.equal(result.code,'CANCELLED');
assert.equal(result.delivery,'not_sent');

currentEvent={...baseEvent,conferenceData:{createRequest:{status:{statusCode:'pending'}}}};
result=ctx.status_({requestId:'12345678-1234-1234-1234-123456789abc'});
assert.equal(result.status,'booked');
assert.equal(result.meetingStatus,'pending');

currentEvent={...baseEvent,hangoutLink:'https://meet.google.com/abc-defg-hij'};
result=ctx.status_({requestId:'12345678-1234-1234-1234-123456789abc'});
assert.equal(result.status,'booked');
assert.equal(result.meetingStatus,'ready');

currentEvent=null;
result=ctx.status_({requestId:'12345678-1234-1234-1234-123456789abc'});
assert.equal(result.status,'not_found');
assert.equal(result.booking,false);

console.log('Booking status contract: event reservation, Meet pending/ready/failed, cancellation and not-found recovery states pass.');
