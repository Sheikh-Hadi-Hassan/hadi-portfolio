// P0-03F: real Chromium acceptance against a newly built patched Next.js export.
// No GSAP stubs, synthetic click dispatch or application source modifications.
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=process.env.P0_03F_BASE_URL||'http://127.0.0.1:8776';
const dir=path.resolve(process.env.P0_03F_EVIDENCE_DIR||'artifacts/p0-03f');
fs.mkdirSync(dir,{recursive:true});
const results=[];
const knownOptionalPaths=new Set([
 '/intellignce-support/runtime-config.json',
 '/intellignce-support/runtime-config.previous.json'
]);
function safeURL(url){try{const u=new URL(url);return u.origin+u.pathname}catch{return '[invalid url]'}}
function record(page){
 const network=[],exceptions=[],consoleErrors=[];
 page.on('response',r=>{if(r.status()>=400)network.push({status:r.status(),url:safeURL(r.url()),type:r.request().resourceType()})});
 page.on('requestfailed',r=>network.push({status:'request-failed',url:safeURL(r.url()),reason:r.failure()?.errorText?.slice(0,100)}));
 page.on('pageerror',e=>exceptions.push(String(e.message).slice(0,260)));
 page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text().slice(0,260).replace(/https?:\/\/\S+/g,'[URL]'))});
 return {network,exceptions,consoleErrors};
}
async function load(page,route='/'){
 const response=await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:45000});
 assert(response&&response.status()===200,'Expected HTTP 200 for '+route+'; received '+response?.status());
 await page.evaluate(()=>document.fonts.ready);
 await page.locator('body').waitFor({state:'visible'});
 await page.waitForTimeout(4300);
}
async function snap(page,name){
 const filename=name+'.png';
 await page.screenshot({path:path.join(dir,filename),animations:'allow'});
 return filename;
}
async function state(page,index){
 return page.locator('.bf-service-item').nth(index).evaluate(item=>{
  const b=item.querySelector('[data-service-toggle]');
  const panel=document.getElementById(b.getAttribute('aria-controls'));
  const preview=item.querySelector('.bf-service-preview');
  const r=panel.getBoundingClientRect(),p=preview?.getBoundingClientRect();
  return {expanded:b.getAttribute('aria-expanded'),hidden:panel.getAttribute('aria-hidden'),inert:panel.inert,
   active:item.classList.contains('is-active'),openClass:panel.classList.contains('is-open'),
   height:r.height,computedRows:getComputedStyle(panel).gridTemplateRows,
   preview:preview?{visibility:getComputedStyle(preview).visibility,opacity:getComputedStyle(preview).opacity,width:p.width,height:p.height}:null,
   focused:document.activeElement===b};
 });
}
async function verify(page,index,isOpen,tag){
 await page.waitForTimeout(700);
 const s=await state(page,index);
 assert.equal(s.expanded,String(isOpen),tag+': aria-expanded '+JSON.stringify(s));
 assert.equal(s.hidden,String(!isOpen),tag+': aria-hidden '+JSON.stringify(s));
 assert.equal(s.inert,!isOpen,tag+': inert '+JSON.stringify(s));
 assert.equal(s.active,isOpen,tag+': active '+JSON.stringify(s));
 assert.equal(s.openClass,isOpen,tag+': panel class '+JSON.stringify(s));
 if(isOpen)assert(s.height>2,tag+': open panel has zero rendered height '+JSON.stringify(s));
 else assert(s.height<3,tag+': closed panel remains rendered '+JSON.stringify(s));
 const n=await page.locator('.bf-service-item [data-service-toggle][aria-expanded="true"]').count();
 assert(n<2,tag+': more than one service expanded');
 return s;
}
async function evaluateCase(browser,name,settings,fn){
 const context=await browser.newContext(settings);
 const page=await context.newPage(),diagnostic=record(page);
 const detail={name,status:'FAIL',steps:[],screenshots:[]};
 try{
  await fn(page,detail);
  detail.status='PASS';
 }catch(e){
  detail.error=String(e?.stack||e).slice(0,1200);
  try{detail.screenshots.push(await snap(page,name+'-failure'))}catch{}
 }
 detail.diagnostics=diagnostic;
 if(diagnostic.exceptions.length){detail.status='FAIL';detail.error=(detail.error||'')+' Browser exceptions: '+JSON.stringify(diagnostic.exceptions)}
 const unexpected=diagnostic.network.filter(n=>{
  try{return !(n.status===404&&knownOptionalPaths.has(new URL(n.url).pathname))}catch{return true}
 });
 if(unexpected.length){detail.status='FAIL';detail.error=(detail.error||'')+' Unexpected failed HTTP requests: '+JSON.stringify(unexpected.slice(0,8))}
 const known404s=diagnostic.network.filter(n=>n.status===404&&knownOptionalPaths.has(new URL(n.url).pathname)).length;
 const unexpectedConsole=diagnostic.consoleErrors.filter(s=>!/Failed to load resource:.*404/.test(s));
 if(unexpectedConsole.length||diagnostic.consoleErrors.length>known404s){detail.status='FAIL';detail.error=(detail.error||'')+' Unexpected browser console errors: '+JSON.stringify(diagnostic.consoleErrors)}
 results.push(detail);
 await context.close();
 console.log(name+': '+detail.status+(detail.error?' '+detail.error.slice(0,250):''));
}
async function main(){
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const config of [{name:'desktop',width:1440,height:900},{name:'mobile-viewport',width:390,height:844}]){
   await evaluateCase(browser,'keyboard-'+config.name,{viewport:{width:config.width,height:config.height},reducedMotion:'no-preference'},async(page,r)=>{
    await load(page);
    const first=page.locator('[data-service-toggle]').first();
    assert(await first.count(),'Services buttons missing');
    // Position the starting focus deterministically, then exercise native keyboard
    // presses and real Tab navigation between service controls.
    await first.scrollIntoViewIfNeeded();
    await page.keyboard.press('Tab');
    let focused=false;
    for(let i=0;i<3;i++){
      await first.focus();
      await page.waitForTimeout(150);
      if(await first.evaluate(el=>document.activeElement===el)){focused=true;break}
    }
    assert(focused,'First service button could not retain keyboard focus');
    r.steps.push({action:'focus first service',state:await verify(page,0,true,'keyboard focus')});
    await page.evaluate(()=>{window.__serviceClicks=0;document.querySelector('[data-service-toggle]').addEventListener('click',()=>window.__serviceClicks++);});
    for(const [key,shouldOpen] of [['Enter',false],['Enter',true],['Space',false],['Space',true]]){
      const beforeY=await page.evaluate(()=>scrollY);
      const before=await page.evaluate(()=>window.__serviceClicks);
      await page.keyboard.press(key);
      const after=await page.evaluate(()=>window.__serviceClicks);
      assert.equal(after-before,1,key+': expected one native click');
      const verified=await verify(page,0,shouldOpen,key);
      const scrollDelta=await page.evaluate(()=>scrollY)-beforeY;
      assert(Math.abs(scrollDelta)<150,key+': unexpected scrolling '+scrollDelta+' px');
      r.steps.push({action:key,scrollDelta,state:verified});
    }
    r.screenshots.push(await snap(page,'keyboard-'+config.name+'-expanded'));
    await page.keyboard.press('Escape');
    const closed=await verify(page,0,false,'Escape');
    assert(closed.focused,'Escape: focus lost');
    r.steps.push({action:'Escape',state:closed});
    r.screenshots.push(await snap(page,'keyboard-'+config.name+'-closed'));
    await page.keyboard.press('Tab');
    const onSecond=await page.locator('[data-service-toggle]').nth(1).evaluate(e=>document.activeElement===e);
    assert(onSecond,'Tab after Escape did not reach the next service button');
    await verify(page,1,true,'next button focus');
    await verify(page,0,false,'exclusive expansion after Tab');
   });
  }
  await evaluateCase(browser,'mouse-hover',{viewport:{width:1440,height:900},reducedMotion:'no-preference'},async(page,r)=>{
    await load(page);
    const first=page.locator('[data-service-toggle]').first(),second=page.locator('[data-service-toggle]').nth(1);
    await page.mouse.move(1,1);
    await first.hover();
    const opened=await verify(page,0,true,'pointer hover');
    assert.equal(opened.preview?.visibility,'visible','Hover preview not visible');
    assert(Number(opened.preview?.opacity)>0.1,'Hover preview opacity remains zero');
    r.steps.push({action:'hover first',state:opened});
    r.screenshots.push(await snap(page,'pointer-hover-open'));
    await page.mouse.move(1,1);
    r.steps.push({action:'pointer leave',state:await verify(page,0,false,'pointer leave')});
    await second.hover();
    await verify(page,1,true,'hover second');
    await verify(page,0,false,'hover exclusive');
    r.screenshots.push(await snap(page,'pointer-second-service'));
   });
  await evaluateCase(browser,'touch-mobile',{viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'no-preference'},async(page,r)=>{
    await load(page);
    const first=page.locator('[data-service-toggle]').first(),second=page.locator('[data-service-toggle]').nth(1);
    assert.equal(await page.evaluate(()=>matchMedia('(hover: hover) and (pointer: fine)').matches),false,'Touch emulation still matches fine hover');
    await first.scrollIntoViewIfNeeded();
    const tapStartY=await page.evaluate(()=>scrollY);
    await first.tap();
    const firstState=await verify(page,0,true,'first touch');
    const firstScrollDelta=await page.evaluate(()=>scrollY)-tapStartY;
    assert(Math.abs(firstScrollDelta)<150,'First tap unexpectedly scrolled '+firstScrollDelta+' px');
    r.steps.push({action:'first tap opens',scrollDelta:firstScrollDelta,state:firstState});
    r.screenshots.push(await snap(page,'touch-open'));
    const tapCloseY=await page.evaluate(()=>scrollY);
    await first.tap();
    const closedState=await verify(page,0,false,'second touch');
    const closedScrollDelta=await page.evaluate(()=>scrollY)-tapCloseY;
    assert(Math.abs(closedScrollDelta)<150,'Second tap unexpectedly scrolled '+closedScrollDelta+' px');
    r.steps.push({action:'second tap closes',scrollDelta:closedScrollDelta,state:closedState});
    r.screenshots.push(await snap(page,'touch-closed'));
    await second.tap();
    await verify(page,1,true,'touch second service');
    await first.tap();
    await verify(page,0,true,'touch first again');
    await verify(page,1,false,'touch exclusive');
    r.screenshots.push(await snap(page,'touch-exclusive'));
   });
  await evaluateCase(browser,'product-route',{viewport:{width:1440,height:900},reducedMotion:'no-preference'},async(page,r)=>{
    await load(page,'/expertise/product-development/');
    const title=await page.title(),bodyText=(await page.locator('body').innerText()).slice(0,1000);
    assert(title&&/product/i.test(title),'Product Design route title absent '+title);
    assert(/product|design/i.test(bodyText),'Product route content absent');
    r.steps.push({action:'Product Design route loaded, shared motion mounted without exceptions',title});
    r.screenshots.push(await snap(page,'product-design-no-regression'));
   });
 }finally{await browser.close()}
 const summary={candidate:'patched P0-03F; baseline 97544b9151eb9a19d51c5b0c757d7c065f232a7b',base,results,
  passed:results.filter(r=>r.status==='PASS').length,failed:results.filter(r=>r.status==='FAIL').length,
  knownStaticSera404s:[...knownOptionalPaths],note:'Browser tested built patched Next.js export. No dispatchEvent mocks. Network URLs have no query strings.'};
 fs.writeFileSync(path.join(dir,'services-regression-report.json'),JSON.stringify(summary,null,2));
 fs.writeFileSync(path.join(dir,'summary.md'),['# P0-03F real-browser regression','','| Scenario | Result |','|---|---|',...results.map(x=>'| '+x.name+' | '+x.status+' |'),'','See JSON for individual native keyboard, pointer and touch transitions. Known missing static SERA configs are separately tracked.'].join('\n')+'\n');
 console.log('P0-03F summary',JSON.stringify({passed:summary.passed,failed:summary.failed,results:results.map(x=>({name:x.name,status:x.status,error:x.error}))}));
 if(summary.failed)process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1});
