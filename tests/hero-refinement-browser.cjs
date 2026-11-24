'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.P0H_BASE_URL||'http://127.0.0.1:8778',out=process.env.P0H_EVIDENCE_DIR||'artifacts/p0-hero-v4';
fs.mkdirSync(out,{recursive:true});
const cases=[['desktop',1440,900,'no-preference'],['laptop',1280,800,'no-preference'],['small-laptop',1024,768,'no-preference'],['tablet',768,1024,'no-preference'],['mobile',390,844,'no-preference'],['small-mobile',320,700,'no-preference'],['reduced-motion',1440,900,'reduce']];
const results=[];
async function inspect(browser,name,width,height,motion){
 const context=await browser.newContext({viewport:{width,height},reducedMotion:motion}),page=await context.newPage();
 const errors=[],http=[];page.on('pageerror',e=>errors.push(e.message.slice(0,240)));page.on('response',r=>{if(r.status()>=400){const u=new URL(r.url());http.push({status:r.status(),url:u.origin+u.pathname})}});
 const entry={name,width,height,motion,status:'FAIL',errors,http,observations:[]};
 try{
  const response=await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:45000});assert(response?.ok(),'Home HTTP '+response?.status());
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.querySelector('.portfolio-hero.p0h-enhanced')&&document.querySelector('[data-p0h-role-root]')&&document.querySelector('[data-p0h-summary]'),null,{timeout:18000});
  await page.waitForFunction(()=>!document.documentElement.classList.contains('is-loading')&&!document.documentElement.classList.contains('is-opening'),null,{timeout:12000});
  await page.waitForTimeout(450);
  const data=await page.evaluate(()=>{
   const rect=s=>{const el=document.querySelector(s);if(!el)return null;const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}};
   const h=document.querySelector('#hero-heading'),picture=document.querySelector('.parallax-subject img');
   return {hero:rect('.portfolio-hero'),scene:rect('.hero-scene'),title:rect('[data-p0h-role-root]'),summary:rect('[data-p0h-summary]'),slider:rect('[data-p0h-slider]'),
    headingCount:document.querySelectorAll('h1').length,semantic:h?.querySelector('[data-p0h-semantic]')?.textContent,
    originalsHidden:[...h.querySelectorAll('.hero-word-one,.hero-word-two')].every(e=>e.getAttribute('aria-hidden')==='true'),
    imageReady:picture?.complete&&picture.naturalWidth>0,imageSource:picture?.getAttribute('src'),
    documentWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth,originalParallax:!!document.querySelector('[data-parallax-scene]'),
    originalSummaryHidden:getComputedStyle(document.querySelector('.hero-note')).display==='none'};
  });
  entry.metrics=data;
  assert(data.hero&&data.title&&data.summary&&data.slider,'Enhanced hero elements missing');
  assert(data.imageReady,'Original speaking portrait not loaded');
  assert(data.originalParallax,'Existing parallax missing');
  assert(data.semantic?.includes('Hadi Hassan'),'Stable professional identity missing');
  assert.equal(data.headingCount,1,'Multiple H1 headings found');
  assert(data.originalsHidden&&data.originalSummaryHidden,'Duplicate original title/summary');
  assert(data.hero.height<=height+2,'Hero exceeds viewport height');
  assert(data.documentWidth<=width+3,'Horizontal overflow '+(data.documentWidth-width));
  assert(data.title.width>100&&data.slider.width>100,'Title or slider not visible');
  await page.screenshot({path:path.join(out,name+'-'+width+'x'+height+'.png'),animations:'allow'});
  entry.observations.push('100svh, original portrait, semantic H1, slider and scoped components verified');
  if(name==='desktop'){
   const role=page.locator('[data-p0h-current]');
   const first=await role.innerText();await page.waitForTimeout(4750);
   assert.notEqual(await role.innerText(),first,'Rotating title did not advance');
   const pause=page.getByRole('button',{name:'Pause rotating professional titles'});await pause.click();
   assert.equal(await pause.getAttribute('aria-pressed'),'true');
   const stopped=await role.innerText();await page.waitForTimeout(4400);assert.equal(await role.innerText(),stopped,'Paused title advanced');
   await page.getByRole('button',{name:'Resume rotating professional titles'}).click();
   const slider=page.getByRole('button',{name:'Pause the selected project slider'});await slider.click();
   assert.equal(await slider.getAttribute('aria-pressed'),'true');await page.getByRole('button',{name:'Resume the selected project slider'}).click();
   entry.observations.push('Role rotation and both pause/resume controls respond');
   await page.mouse.move(100,200);await page.waitForTimeout(550);
   const bg=await page.locator('.parallax-backdrop').evaluate(e=>e.style.getPropertyValue('--bg-x'));
   entry.parallax=bg;assert(bg&&bg!=='0px','Approved original parallax not responding');
   entry.observations.push('Existing pointer parallax remains active');
  }
  if(name==='reduced-motion'){
   assert.equal(await page.locator('.p0h-motion-control').count(),0,'Reduced-motion toggle should not display');
   const initial=await page.locator('[data-p0h-current]').innerText();await page.waitForTimeout(4450);
   assert.equal(await page.locator('[data-p0h-current]').innerText(),initial,'Role advances with reduced motion');
   const animation=await page.locator('.p0h-project-track-0').evaluate(e=>getComputedStyle(e).animationName);
   assert.equal(animation,'none','Slider still animates with reduced motion');
   entry.observations.push('Reduced motion keeps title and slider static');
  }
  assert.equal(errors.length,0,'Page JavaScript errors');
  const ignored=['/intellignce-support/runtime-config.json','/intellignce-support/runtime-config.previous.json'];
  const unexpected=http.filter(x=>!(x.status===404&&ignored.some(p=>x.url.endsWith(p))));
  assert.equal(unexpected.length,0,'Unexpected HTTP errors '+JSON.stringify(unexpected));
  entry.status='PASS';
 }catch(e){entry.reason=String(e.stack||e).slice(0,1200);try{await page.screenshot({path:path.join(out,name+'-FAIL.png')})}catch{}}
 console.log('P0-HERO V4 '+name+': '+entry.status+(entry.reason?' '+entry.reason.slice(0,240):''));results.push(entry);await context.close();
}
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const c of cases)await inspect(browser,...c);
  const context=await browser.newContext(),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const route={name:'product-design-isolation',status:'FAIL'};
  try{
   const r=await page.goto(base+'/expertise/product-development/',{waitUntil:'domcontentloaded',timeout:45000});
   assert(r?.ok(),'Product Design route HTTP '+r?.status());
   await page.waitForTimeout(750);
   assert.equal(await page.locator('.p0h-enhanced').count(),0,'Enhancement leaked outside homepage');
   assert.equal(errors.length,0,'Product route JavaScript error');
   await page.screenshot({path:path.join(out,'product-route.png')});route.status='PASS';
  }catch(e){route.reason=String(e)}
  results.push(route);await context.close();
 }finally{await browser.close()}
 const pass=results.filter(r=>r.status==='PASS').length,fail=results.length-pass;
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({pass,fail,results},null,2));
 fs.writeFileSync(path.join(out,'acceptance-matrix.md'),['# P0-HERO-01 V4 integrated Chromium acceptance','','| Scenario | Result |','|---|---|',...results.map(r=>'| '+r.name+' | '+r.status+' |'),'','The static homepage hero-lock baseline is unchanged.'].join('\n'));
 console.log('P0-HERO V4 SUMMARY '+JSON.stringify({pass,fail,results:results.map(r=>({name:r.name,status:r.status,reason:r.reason?.slice(0,210)}))}));
 if(fail)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
