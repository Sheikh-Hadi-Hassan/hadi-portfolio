'use strict';
// Browser acceptance of V5.1 role animation and hover-to-pause. No production writes.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const BASE=process.env.P0H_BASE_URL||'http://127.0.0.1:8781';
const OUT=process.env.P0H_EVIDENCE_DIR||'artifacts/p0-hero-role-hover';
fs.mkdirSync(OUT,{recursive:true});
const cases=[['wide',1920,1080,'no-preference'],['desktop',1440,900,'no-preference'],
 ['laptop',1280,800,'no-preference'],['small-laptop',1024,768,'no-preference'],
 ['tablet',768,1024,'no-preference'],['mobile',390,844,'no-preference'],
 ['small-mobile',320,700,'no-preference'],['reduced-motion',390,844,'reduce']];
const results=[];
const SEL='.portfolio-hero.p0h-enhanced .p0h-role-group';
async function ready(page){
 const response=await page.goto(BASE+'/',{waitUntil:'domcontentloaded',timeout:45000});
 assert(response?.ok(),'Homepage HTTP '+response?.status());
 await page.waitForFunction(()=>document.querySelector('.portfolio-hero.p0h-enhanced .p0h-role-group')&&document.querySelector('[data-p0h-summary]'),null,{timeout:20000});
 await page.waitForFunction(()=>!document.documentElement.classList.contains('is-loading')&&!document.documentElement.classList.contains('is-opening'),null,{timeout:15000});
 await page.evaluate(()=>document.fonts.ready);
}
async function settled(page){
 await page.waitForFunction(()=>!document.querySelector('.p0h-role-current')?.classList.contains('is-leaving'),null,{timeout:4500});
}
async function roleInfo(page){
 return await page.evaluate(()=>{
  const root=document.querySelector('.portfolio-hero.p0h-enhanced .p0h-role-group');
  const viewport=root.querySelector('.p0h-role-viewport');
  const el=root.querySelector('.p0h-role-current');
  const box=viewport.getBoundingClientRect();
  const textRects=[...el.querySelectorAll('.p0h-role-line')].map(line=>{
    const range=document.createRange();range.selectNodeContents(line);
    const rect=range.getBoundingClientRect();
    const lineBox=line.getBoundingClientRect();
    // Range measures font-glyph overhangs; vertical clipping uses the actual line box.
    return {text:line.textContent,x:rect.x,right:rect.right,y:lineBox.y,bottom:lineBox.bottom,width:rect.width};
  });
  const css=getComputedStyle(el),period=el.querySelector('[data-p0h-period]'),pcss=period&&getComputedStyle(period);
  return {title:el.innerText,hovered:root.getAttribute('data-p0h-hovered'),
   pauseState:root.getAttribute('data-p0h-paused'),periodCount:el.querySelectorAll('[data-p0h-period]').length,
   periodText:period?.textContent,periodAnimation:pcss?.animationName,
   periodPlayState:pcss?.animationPlayState,periodSize:pcss?.fontSize,
   viewport:{x:box.x,right:box.right,y:box.y,bottom:box.bottom,width:box.width},
   textRects,fontSize:css.fontSize,transition:css.transitionDuration,
   currentOpacity:css.opacity,incomingOpacity:getComputedStyle(root.querySelector('.p0h-role-incoming')).opacity,
   currentAnimation:css.animationName,
   long:el.classList.contains('is-long'),cycle:root.dataset.p0hCycleMs,
   documentWidth:document.documentElement.scrollWidth,windowWidth:innerWidth};
 });
}
async function stableRoleInfo(page){
 // Browsers may begin the next scheduled transition between two awaited calls.
 // Sample only settled frames; do not classify an intentionally exiting title as clipped.
 for(let attempt=0;attempt<15;attempt++){
  const sample=await roleInfo(page);
  if(sample.currentAnimation==='none'&&sample.currentOpacity==='1'&&sample.incomingOpacity==='0')return sample;
  await page.waitForTimeout(75);
 }
 throw new Error('Title did not return to a stable frame');
}
function fits(info){
 for(const rect of info.textRects){
  assert(rect.width>0,'Empty measured role line '+rect.text);
  assert(rect.right<=info.viewport.right+2,'Role line '+rect.text+' overflows right by '+(rect.right-info.viewport.right).toFixed(1)+'px ('+info.fontSize+')');
  assert(rect.x>=info.viewport.x-2,'Role line '+rect.text+' overflows left by '+(info.viewport.x-rect.x).toFixed(1)+'px');
  assert(rect.y>=info.viewport.y-2,'Role line '+rect.text+' overflows above visible title');
  assert(rect.bottom<=info.viewport.bottom+2,'Role line '+rect.text+' overflows beneath title');
 }
 assert(info.documentWidth<=info.windowWidth+3,'Document horizontal overflow');
 assert.equal(info.currentOpacity,'1','Current title not fully visible at rest');
 assert.equal(info.incomingOpacity,'0','Incoming title visible at rest (double-transition regression)');
 assert.equal(info.currentAnimation,'none','Unexpected role animation at rest');
 assert.equal(info.periodCount,1,'Exactly one period must be attached to current role');
 assert.equal(info.periodText,'.','Missing animated period character');
 assert(parseFloat(info.periodSize)<parseFloat(info.fontSize)*.7,'Period should be a small typographic accent');
}
async function testCase(browser,[name,w,h,motion]){
 const context=await browser.newContext({viewport:{width:w,height:h},reducedMotion:motion});
 const page=await context.newPage(),errors=[];page.on('pageerror',x=>errors.push(String(x)));
 const result={name,w,h,motion,status:'FAIL',roles:[]};
 try{
  await ready(page);
  assert.equal(await page.locator('[data-p0h-semantic]').count(),1,'Missing stable SEO identity');
  assert.equal(await page.locator(SEL).count(),1,'Hero role viewport missing');
  await settled(page);
  const first=await stableRoleInfo(page);
  assert.equal(first.cycle,'3000','Three-second role cycle not retained');
  assert.equal(await page.locator('.p0h-role-viewport').evaluate(e=>getComputedStyle(e).pointerEvents),'auto','Pointer-hit area disabled');
  assert.equal(first.transition.split(',')[0],'0s','Resting title must never animate backward on state reset');
  fits(first);result.roles.push({name:first.title,size:first.fontSize,hovered:first.hovered});
  if(motion==='reduce'){
   assert.equal(first.periodAnimation,'none','Period must be motionless with reduced-motion preference');
   const before=first.title;
   await page.waitForTimeout(3550);
   assert.equal((await stableRoleInfo(page)).title,before,'Title rotates with reduced motion');
   assert.equal(await page.locator('.p0h-motion-control').count(),0,'Unexpected motion button');
  }else{
   assert.equal(first.periodAnimation,'p0h-period-spring','Springy period keyframe missing');
   assert.equal(first.periodPlayState,'running','Period should animate while title runs');
   let previous=first.title;
   for(let i=0;i<3;i++){
    await page.waitForFunction(previous=>{
     const el=document.querySelector('.p0h-role-current');
     return el?.innerText!==previous&&!el.classList.contains('is-leaving');
    },previous,{timeout:6000});
    await settled(page);
    const info=await stableRoleInfo(page);fits(info);
    result.roles.push({name:info.title,size:info.fontSize,long:info.long});
    if(info.title.includes('STRATEGIST'))assert(info.long,'Long title class not restored');
    previous=info.title;
   }
   assert.equal(new Set(result.roles.map(r=>r.name)).size,4,'Four unique roles not observed');
   await page.waitForFunction(previous=>{const el=document.querySelector('.p0h-role-current');return el&&el.innerText!==previous&&!el.classList.contains('is-leaving')},previous,{timeout:6000});
   assert.equal((await stableRoleInfo(page)).title,first.title,'Rotation did not loop back to initial role');
  }
  if(name==='desktop'){
   const root=page.locator(SEL);
   await settled(page);
   await root.hover({position:{x:Math.min(45,Math.max(10,first.viewport.width/4)),y:Math.min(20,h/20)}});
   assert.equal(await root.getAttribute('data-p0h-hovered'),'true','Hover did not activate pause');
   assert.equal((await stableRoleInfo(page)).periodPlayState,'paused','Springy period must pause on hover');
   await page.waitForTimeout(650);await settled(page);
   const frozen=await stableRoleInfo(page);
   await page.waitForTimeout(3650);
   assert.equal((await stableRoleInfo(page)).title,frozen.title,'Title changed during sustained hover');
   const pausedBtn=page.getByRole('button',{name:'Pause hero motion'});
   await pausedBtn.click();assert.equal(await root.getAttribute('data-p0h-hovered'),'false','Hover failed to clear on pointer exit');
   assert.equal((await stableRoleInfo(page)).periodPlayState,'paused','Period must honor manual pause after pointer exit');
   const buttonStopped=await stableRoleInfo(page);
   await page.waitForTimeout(3550);
   assert.equal((await stableRoleInfo(page)).title,buttonStopped.title,'Manual pause not preserved after hover exit');
   await page.getByRole('button',{name:'Resume hero motion'}).click();
   const resuming=await stableRoleInfo(page);
   assert.equal(resuming.periodPlayState,'running','Period must resume bouncing after manual resume');
   await page.waitForFunction(previous=>{const el=document.querySelector('.p0h-role-current');return el?.innerText!==previous&&!el.classList.contains('is-leaving')},resuming.title,{timeout:5500});
   const next=await stableRoleInfo(page);fits(next);
   result.hoverPause='PASS';result.manualPause='PASS';result.resume='PASS';
  }
  assert.equal(errors.length,0,'JavaScript errors: '+errors.join(' / '));
  result.status='PASS';
  await page.screenshot({path:path.join(OUT,name+'-'+w+'x'+h+'.png'),animations:'allow'});
 }catch(e){
  result.reason=String(e.stack||e).slice(0,1250);
  try{await page.screenshot({path:path.join(OUT,name+'-FAIL.png')})}catch{}
 }
 results.push(result);
 console.log('P0-HERO ROLE HOVER '+name+': '+result.status+(result.reason?' '+result.reason.slice(0,320):''));
 await context.close();
}
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const c of cases)await testCase(browser,c);
  const ctx=await browser.newContext(),page=await ctx.newPage();
  const row={name:'product-route-isolation',status:'FAIL'};
  try{
   const res=await page.goto(BASE+'/expertise/product-development/',{waitUntil:'domcontentloaded',timeout:45000});
   assert(res?.ok(),'Product Design HTTP '+res?.status());
   assert.equal(await page.locator('.p0h-enhanced').count(),0,'Hero role changes leaked to another page');
   row.status='PASS';
  }catch(e){row.reason=String(e).slice(0,500)}
  results.push(row);console.log('P0-HERO ROLE HOVER product-route-isolation: '+row.status);
  await ctx.close();
 }finally{await browser.close()}
 const pass=results.filter(x=>x.status==='PASS').length,fail=results.length-pass;
 fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify({pass,fail,results},null,2));
 fs.writeFileSync(path.join(OUT,'acceptance-matrix.md'),['# P0-HERO-01 V5.1 browser acceptance','','| Scenario | Result |','|---|---|',...results.map(x=>'| '+x.name+' | '+x.status+' |')].join('\n'));
 console.log('P0-HERO ROLE HOVER SUMMARY '+JSON.stringify({pass,fail,cases:results.map(x=>({name:x.name,status:x.status,reason:x.reason?.slice(0,160)}))}));
 if(fail)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
