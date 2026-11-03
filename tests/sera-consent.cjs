const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('integrations/sera-v9-source/runtime.js','utf8');
assert(source.includes('aiOptIn=false'));
assert(source.includes("if(aiOptIn&&!(aiConnection==='offline'"));
const handlers=source.slice(source.indexOf("$('.privacy-info').onclick="),source.indexOf("$('.privacy-info').onclick=")+1000).split('\n')[0];
const buttons={};let focus=0,renders=0;
const ctx={$:s=>buttons[s]??=( {}),render:()=>renders++,input:{focus:()=>focus++},aiOptIn:false,aiRequestController:new AbortController(),consentOpen:true};vm.createContext(ctx);vm.runInContext(handlers,ctx);
buttons['.accept-ai'].onclick();assert.equal(ctx.aiOptIn,true);assert.equal(ctx.consentOpen,false);
buttons['.decline-ai'].onclick();assert.equal(ctx.aiOptIn,false);assert.equal(ctx.consentOpen,false);assert.equal(ctx.aiRequestController.signal.aborted,true);
buttons['.privacy-info'].onclick();assert.equal(ctx.aiOptIn,false);assert.equal(ctx.consentOpen,true);
assert.equal(focus,2);assert.equal(renders,3);
assert(source.includes('Enable optional AI'));assert(source.includes('Continue without AI'));
console.log('PASS: AI defaults off, explicit enable/disable actions differ, privacy viewing does not consent, focus returns. Static request gate checked; browser/provider behavior remains unverified.');

assert(source.includes('if(!aiOptIn||ctl.signal.aborted){render();return}'));assert(!source.includes("localStorage.setItem('aiOptIn'"));console.log('PASS: withdrawal aborts active request, late-result guard present, consent is not restored from draft storage.');
