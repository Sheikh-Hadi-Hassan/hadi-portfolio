import assert from 'node:assert/strict';
import fs from 'node:fs';
import {SERVICES} from '../src/app/lead-questions.mjs';
import {newSession,getSteps,getValue,setValue,commitAnswer,prepareLead,restoreSession,suggestServices,VISUALS} from '../src/app/consultation.mjs';
import {consultationAI} from '../src/app/lead-api.mjs';
assert.ok(suggestServices('A SaaS app with a brand identity').includes('app'));
for(const v of VISUALS)assert.ok(fs.existsSync('public'+v.src),v.src);
const answer=(s,key,value)=>commitAnswer(s,getSteps(s.data).find(q=>q.key===key),value);
let s=newSession();s=answer(s,'journey','discuss');assert.throws(()=>answer(s,'overview',''),/add an answer/);s=answer(s,'overview','Brand identity for a new business');s=answer(s,'services',['branding','design']);
let steps=getSteps(s.data);assert.equal(steps.filter(q=>q.key==='shared:audience').length,1);assert.equal(steps.filter(q=>q.key==='shared:budget').length,1);assert.equal(steps.filter(q=>q.key==='shared:timeline').length,1);
s=answer(s,'design:category',['Social media','Digital']);assert.ok(getSteps(s.data).some(q=>q.key==='design:social'));assert.ok(getSteps(s.data).some(q=>q.key==='design:digital'));s=answer(s,'design:category',['Print']);assert.ok(!getSteps(s.data).some(q=>q.key==='design:digital'));assert.ok(getSteps(s.data).some(q=>q.key==='design:print'));
s=answer(s,'shared:audience','Business founders');s=answer(s,'shared:budget','$500–$1,500');s=answer(s,'shared:timeline','Within a month');s=answer(s,'preference','Email');assert.throws(()=>answer(s,'email','bad@'),/valid email/);s=answer(s,'email','  owner@example.com  ');assert.equal(s.data.email,'owner@example.com');s=answer(s,'name','Test Visitor');s.data.consent=true;
const id='12345678-1234-1234-1234-123456789abc',p=prepareLead(s,id,'/community-campaign/');assert.equal(p.requestId,id);assert.equal(p.answers.branding.audience,'Business founders');assert.equal(p.answers.design.audience,'Business founders');assert.equal(p.answers.branding.budget,p.answers.design.budget);assert.ok(p.answers._consultation.transcript.length);assert.equal(p.answers._consultation.brief.contact.email,'owner@example.com');assert.ok(!('digital' in p.answers.design));
s.data.preference='WhatsApp';assert.throws(()=>prepareLead(s,id,'/'),/answer/);s.data.phone='+92 300 1234567';assert.doesNotThrow(()=>prepareLead(s,id,'/'));s.data.consent=false;assert.throws(()=>prepareLead(s,id,'/'),/allow Hadi/);
const snapshot={...s,editing:{key:'notes',value:'Unfinished answer'},pending:p,savedAt:Date.now()};const restored=restoreSession(JSON.stringify(snapshot));assert.equal(restored.editing.value,'Unfinished answer');assert.equal(restored.pending.requestId,id);assert.equal(restoreSession('{bad'),null);assert.equal(restoreSession(JSON.stringify({...snapshot,savedAt:Date.now()-8*86400000})),null);
for(const service of SERVICES){let data=setValue(newSession().data,'services',[service.id]);const qs=getSteps(data);for(const q of service.questions.filter(q=>!q.when)){assert.ok(qs.some(x=>x.key===service.id+':'+q.id||q.id==='audience'&&x.key==='shared:audience'||q.id==='users'&&x.key==='shared:audience'||q.id==='references'&&x.key==='shared:references'),service.id+q.id)}}
const json=(x,ok=true)=>({ok,headers:new Headers({'Content-Type':'application/json'}),json:async()=>x});await assert.rejects(consultationAI('project',{fetcher:async()=>json({ok:false},false)}),/unavailable/);await assert.rejects(consultationAI('project',{fetcher:async()=>json({ok:true,services:'bad'})}),/unavailable/);assert.equal((await consultationAI('project',{fetcher:async()=>json({ok:true,services:['branding'],acknowledgment:'A brand identity project.',business:'',audience:''})})).services[0],'branding');
console.log('Consultation: all six service branches, shared-question deduplication, changed-answer cleanup, contact validation, full transcript, consent, pending retry persistence, unfinished drafts, expiry and AI failure fallback passed.');

// Reviewing an earlier answer must not ask every completed question again.
let review=newSession();review.data={...s.data,consent:true};review.history=getSteps(review.data).filter(q=>q.type!=='review').map(q=>q.key);review.cursor='company';review=answer(review,'company','Updated company');assert.equal(review.cursor,'review');
review.data.phone='';review.data.preference='Email';review=answer(review,'preference','WhatsApp');assert.equal(review.cursor,'phone');
console.log('Review edits skip completed questions; changing contact preference requests newly required phone.');

let meeting=answer(newSession(),'journey','meeting');assert.equal(meeting.data.preference,'Discovery call');const meetingSteps=getSteps(meeting.data);assert.ok(meetingSteps.length<=7);assert.ok(!meetingSteps.some(q=>q.key==='shared:budget'||q.key==='shared:timeline'));assert.ok(!meetingSteps.some(q=>q.service));assert.ok(meetingSteps.some(q=>q.key==='email'&&q.required));
console.log('Separate entry paths: meeting bypasses the detailed questionnaire and collects essential booking details.');
