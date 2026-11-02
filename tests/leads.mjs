import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import vm from 'node:vm';
import {SERVICES,visibleQuestions} from '../src/app/lead-questions.mjs';

assert.equal(SERVICES.length,6);
for(const s of SERVICES){
  assert.ok(visibleQuestions(s).length>=7);
  assert.equal(new Set(s.questions.map(q=>q.id)).size,s.questions.length);
}
const design=SERVICES.find(s=>s.id==='design');
assert.ok(!visibleQuestions(design).some(q=>q.id==='social'));
assert.ok(visibleQuestions(design,{category:['Social media']}).some(q=>q.id==='social'));
assert.ok(!visibleQuestions(design,{category:['Social media']}).some(q=>q.id==='print'));

const props=new Map([['AVAILABILITY_GENERATION','0']]);
const scriptProperties={
  getProperty:key=>props.get(key)||'',
  setProperty:(key,value)=>props.set(key,String(value)),
  getProperties:()=>Object.fromEntries(props),
  deleteProperty:key=>props.delete(key),
};
const cache={get:()=>null,put:()=>{}};
const formatParts=(date,zone)=>Object.fromEntries(
  new Intl.DateTimeFormat('en-CA',{
    timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',
    weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'
  }).formatToParts(date).map(x=>[x.type,x.value])
);
const ctx={
  console,Date,JSON,Error,Number,String,Array,
  SETTINGS:undefined,
  PropertiesService:{getScriptProperties:()=>scriptProperties},
  CacheService:{getScriptCache:()=>cache},
  Calendar:{Freebusy:{query:()=>({calendars:{'sheikh.hadi.hassan@gmail.com':{busy:[]}}})}},
  Utilities:{
    DigestAlgorithm:{SHA_256:'SHA_256'},
    computeDigest:(_,value)=>[...crypto.createHash('sha256').update(String(value)).digest()],
    sleep:()=>{},
    formatDate:(date,zone,pattern)=>{
      const d=formatParts(date,zone);
      if(pattern==='yyyy-MM-dd')return `${d.year}-${d.month}-${d.day}`;
      if(pattern==='HH:mm')return `${d.hour}:${d.minute}`;
      if(pattern==='mm')return d.minute;
      if(pattern==='u,HH,mm'){
        const weekday={Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6,Sun:7}[d.weekday];
        return `${weekday},${d.hour},${d.minute}`;
      }
      throw new Error('Unsupported test date pattern: '+pattern);
    }
  }
};

vm.createContext(ctx);
vm.runInContext(fs.readFileSync('integrations/leads/Code.gs','utf8'),ctx);

const nextDay=new Date(Date.now()+3*86400000);
const date=nextDay.toISOString().slice(0,10);
const result=ctx.available_({date,timezone:'Asia/Karachi'});
assert.equal(result.slots.length,18);

const first=result.slots[0].start;
ctx.Calendar.Freebusy.query=()=>({calendars:{'sheikh.hadi.hassan@gmail.com':{busy:[{start:first,end:new Date(Date.parse(first)+1800000).toISOString()}]}}});
assert.equal(ctx.available_({date,timezone:'Asia/Karachi'}).slots.length,17);

ctx.Calendar.Freebusy.query=()=>({calendars:{'sheikh.hadi.hassan@gmail.com':{errors:[{reason:'notFound'}]}}});
assert.throws(()=>ctx.available_({date,timezone:'Asia/Karachi'}),/availability is unavailable/i);
assert.throws(()=>ctx.available_({date:'bad'}),/valid date/i);
assert.throws(()=>ctx.validate_({}),/valid booking reference|valid name/i);

const valid={
  action:'enquiry',
  name:'Test',
  email:'test@example.com',
  phone:'+123456789',
  services:['branding'],
  requestId:'12345678-1234-1234-1234-123456789abc',
  answers:{},
  notes:'',
  company:'',
  timezone:'Asia/Karachi'
};
ctx.validate_(valid);
assert.throws(()=>ctx.validate_({...valid,services:['wrong']}),/valid service/i);
assert.throws(()=>ctx.validate_({...valid,website:'spam'}),/Unable/i);
assert.equal(ctx.safe_('=IMPORTXML("bad")'),'\'=IMPORTXML("bad")');
assert.equal(ctx.safe_('+92300'),"'+92300");

assert.equal(ctx.inHours_(new Date('2026-10-19T06:30:00Z')),false);
assert.equal(ctx.inHours_(new Date('2026-10-19T07:00:00Z')),true);
assert.equal(ctx.inHours_(new Date('2026-10-19T15:30:00Z')),true);
assert.equal(ctx.inHours_(new Date('2026-10-19T16:00:00Z')),false);
assert.equal(ctx.inHours_(new Date('2026-10-18T07:00:00Z')),true);

console.log('Lead tests passed: conditional services, v8 input validation, 18 daily slots, 12–9 PM Pakistan hours, busy overlap, fail-closed Calendar, cache/property dependencies and spreadsheet injection.');
