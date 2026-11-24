'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=process.env.P0H_BASE_URL||'http://127.0.0.1:8779';
const out=process.env.P0H_EVIDENCE_DIR||'artifacts/p0-hero-v5';
fs.mkdirSync(out,{recursive:true});
const cases=[
 ['desktop',1440,900,'no-preference'],
 ['laptop',1280,800,'no-preference'],
 ['small-laptop',1024,768,'no-preference'],
 ['tablet',768,1024,'no-preference'],
 ['mobile',390,844,'no-preference'],
 ['small-mobile',320,700,'no-preference'],
 ['reduced-motion',1440,900,'reduce']
];
const results=[];
async function checkHome(browser,[name,width,height,motion]){
 const context=await browser.newContext({viewport:{width,height},reducedMotion:motion});
 const page=await context.newPage(),errors=[],http=[];
 page.on('pageerror',e=>errors.push(e.message.slice(0,300)));
 page.on('response',r=>{if(r.status()>=400){let u=new URL(r.url());http.push({status:r.status(),path:u.pathname})}});
 const record={name,width,height,motion,status:'FAIL',errors,http};
 try{
  const response=await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:45000});
  assert(response?.ok(),'Home HTTP '+response?.status());
  await page.waitForFunction(()=>document.querySelector('.portfolio-hero.p0h-enhanced')&&document.querySelector('[data-p0h-summary]'),null,{timeout:18000});
  await page.waitForFunction(()=>!document.documentElement.classList.contains('is-loading')&&!document.documentElement.classList.contains('is-opening'),null,{timeout:13000});
  await page.evaluate(()=>document.fonts.ready);
  const data=await page.evaluate(()=>{
   const rect=sel=>{let el=document.querySelector(sel);if(!el)return null;let r=el.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom,right:r.right}};
   const hero=document.querySelector('.portfolio-hero'),summary=document.querySelector('.p0h-summary-content'),slider=document.querySelector('[data-p0h-slider]'),portrait=document.querySelector('.parallax-subject img');
   const secondary=document.querySelector('.hero-work-link'),primary=document.querySelector('.hero-project-actions>a:first-child'),s=slider&&getComputedStyle(slider);
   return {
    hero:rect('.hero-scene'),summary:rect('.p0h-summary-content'),slider:rect('[data-p0h-slider]'),actions:rect('.hero-project-actions'),
    headingCount:document.querySelectorAll('h1').length,semantic:document.querySelector('[data-p0h-semantic]')?.textContent,
    visibleGreeting:document.querySelector('.hero-greeting')?.innerText,
    title:document.querySelector('[data-p0h-current]')?.innerText,cycle:document.querySelector('[data-p0h-role-root]')?.getAttribute('data-p0h-cycle-ms'),
    statement:summary?.innerText,primary:primary?.innerText,primaryHref:primary?.getAttribute('href'),
    secondary:secondary?.innerText,secondaryHref:secondary?.getAttribute('href'),
    logos:[...document.querySelectorAll('.p0h-logo-ink img')].map(e=>({src:e.getAttribute('src'),loaded:e.complete&&e.naturalWidth>0})),
    originalGridCount:document.querySelectorAll('.bf-client-grid img').length,
    portraitReady:portrait?.complete&&portrait.naturalWidth>0,portraitSrc:portrait?.getAttribute('src'),
    documentWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth,
    sliderBorder:s?.borderTopWidth,sliderBackground:s?.backgroundColor,sliderShadow:s?.boxShadow,sliderBlur:s?.backdropFilter,
    originalParallax:!!document.querySelector('[data-parallax-scene]'),
    links:[...document.querySelectorAll('.p0h-expertise-links a')].map(a=>a.getAttribute('href')),
    seo:{title:document.title,description:document.querySelector('meta[name=description]')?.content,canonical:document.querySelector('link[rel=canonical]')?.href},
    schema:[...document.querySelectorAll('script[type="application/ld+json"]')].some(s=>{try{const d=JSON.parse(s.textContent);return d['@graph']?.some(n=>n['@type']==='Person')&&d['@graph']?.some(n=>n['@type']==='WebSite')&&d['@graph']?.some(n=>Array.isArray(n['@type'])?n['@type'].includes('WebPage'):n['@type']==='WebPage')}catch{return false}})
   };
  });
  record.metrics=data;
  assert(data.hero&&data.summary&&data.actions&&data.slider,'Hero structure absent');
  assert(data.hero.height<=height+2,'Hero height exceeds viewport');
  assert(data.documentWidth<=width+3,'Horizontal document overflow');
  assert.equal(data.headingCount,1,'Expected one H1');
  assert(data.semantic?.includes('Hadi Hassan'),'Stable semantic heading missing');
  assert(data.visibleGreeting.includes('HADI HASSAN'),'Owner-approved greeting absent');
  assert.equal(data.cycle,'3000','Role timing is not a three-second cycle');
  assert(data.statement.includes('One vision.')&&data.statement.includes('Every touchpoint.'),'Creative statement missing');
  assert(data.statement.includes('digital products')&&data.statement.includes('visual storytelling'),'Offer unclear');
  assert(data.primary.includes('Discuss a role or project')&&data.primaryHref.startsWith('mailto:'),'Primary enquiry CTA broken');
  assert(data.secondaryHref==='/resume/'&&/résumé/i.test(data.secondary),'Resume CTA broken');
  assert(data.logos.length>=12,'Insufficient authentic logo images');
  assert(data.logos.every(x=>/^\/assets\/client-mark-\d+\.(png|webp)$/.test(x.src)),'Text or substitute logo detected');
  assert.equal(data.originalGridCount,20,'Original brand grid changed');
  assert.equal(data.sliderBorder,'0px','Carousel border remains');
  assert(['rgba(0, 0, 0, 0)','transparent'].includes(data.sliderBackground),'Carousel background remains: '+data.sliderBackground);
  assert.equal(data.sliderShadow,'none','Carousel shadow remains');
  assert(data.sliderBlur==='none','Glass blur remains');
  assert(data.portraitReady&&data.originalParallax,'Original portrait or parallax missing');
  assert(data.actions.bottom<=height+7,'Actions clipped below viewport');
  assert(data.summary.bottom<=height+7,'Summary clipped below viewport');
  assert.deepEqual(data.links,['/expertise/creative-direction/','/expertise/product-development/','/expertise/video-production/']);
  assert(data.seo.title.includes('Creative Director')&&data.seo.description.includes('UX/UI')&&data.seo.canonical.endsWith('/'),'SEO metadata incomplete');
  assert(data.schema,'Verified source structured data missing');
  await page.screenshot({path:path.join(out,name+'-'+width+'x'+height+'.png'),animations:'allow'});
  if(name==='desktop'){
   const role=page.locator('[data-p0h-current]'),seen=[await role.innerText()];
   for(let i=0;i<4;i++){
    const prior=seen[seen.length-1];
    await page.waitForFunction(prior=>document.querySelector('[data-p0h-current]')?.innerText!==prior,prior,{timeout:5200});
    seen.push(await role.innerText());
   }
   assert.equal(new Set(seen.slice(0,4)).size,4,'Not all four professional titles rotate');
   assert.equal(seen[0],seen[4],'Animation fails to loop');
   await page.waitForFunction(()=>!document.querySelector('[data-p0h-current]')?.classList.contains('is-leaving'));
   const motion=page.getByRole('button',{name:'Pause hero motion'});
   await motion.click();assert.equal(await motion.getAttribute('aria-pressed'),'true');
   const frozen=await role.innerText();await page.waitForTimeout(3400);assert.equal(await role.innerText(),frozen,'Paused title advanced');
   const marquee=page.locator('.p0h-project-track-0');
   assert.equal(await marquee.evaluate(e=>getComputedStyle(e).animationPlayState),'paused','Marquee not paused');
   await page.getByRole('button',{name:'Resume hero motion'}).click();
   await page.mouse.move(100,220);await page.waitForTimeout(600);
   const parallax=await page.locator('.parallax-backdrop').evaluate(e=>e.style.getPropertyValue('--bg-x'));
   assert(parallax&&parallax!=='0px','Original pointer parallax missing');
   record.roles=seen;
  }
  if(name==='reduced-motion'){
   assert.equal(await page.locator('.p0h-motion-control').count(),0,'Unnecessary pause button in reduced motion');
   const frozen=await page.locator('[data-p0h-current]').innerText();
   await page.waitForTimeout(3400);
   assert.equal(await page.locator('[data-p0h-current]').innerText(),frozen,'Role advanced under reduced motion');
   assert.equal(await page.locator('.p0h-project-track-0').evaluate(e=>getComputedStyle(e).animationName),'none','Marquee animated under reduced motion');
  }
  assert.equal(errors.length,0,'Page JS errors: '+JSON.stringify(errors));
  const ignored=['/intellignce-support/runtime-config.json','/intellignce-support/runtime-config.previous.json'];
  const unexpected=http.filter(x=>!(x.status===404&&ignored.includes(x.path)));
  assert.equal(unexpected.length,0,'Unexpected HTTP '+JSON.stringify(unexpected));
  record.status='PASS';
 }catch(e){
  record.error=String(e.stack||e).slice(0,1300);
  try{await page.screenshot({path:path.join(out,name+'-FAIL.png')})}catch{}
 }
 console.log('P0-HERO V5 '+name+': '+record.status+(record.error?' '+record.error.slice(0,220):''));
 results.push(record);await context.close();
}
async function checkOther(browser){
 const c=await browser.newContext(),page=await c.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const [name,url] of [['resume','/resume/'],['product-design-isolation','/expertise/product-development/']]){
  let row={name,status:'FAIL'};
  try{
   const r=await page.goto(base+url,{waitUntil:'domcontentloaded',timeout:45000});assert(r?.ok(),url+' HTTP '+r?.status());
   if(name==='resume'){
    const frame=page.locator('.p0v5-resume-document iframe'),download=page.getByRole('link',{name:'Download résumé (PDF)'});
    assert.equal(await frame.count(),1,'Résumé PDF embed missing');
    assert((await frame.getAttribute('src')).startsWith('/assets/hadi-hassan-resume-2026-11.pdf'),'Wrong résumé PDF source');
    assert.equal(await download.getAttribute('href'),'/assets/hadi-hassan-resume-2026-11.pdf');
    assert(await download.getAttribute('download'),'Résumé must be downloadable');
    const pdf=await page.request.get(base+'/assets/hadi-hassan-resume-2026-11.pdf');
    assert(pdf.ok(),'PDF asset HTTP '+pdf.status());
    assert((await pdf.body()).subarray(0,4).toString()==='%PDF','Asset is not a PDF');
   }else{
    await page.waitForTimeout(700);
    assert.equal(await page.locator('.p0h-enhanced').count(),0,'Hero V5 leaked to Product Design route');
   }
   assert.equal(errors.length,0,url+' JS error');
   await page.screenshot({path:path.join(out,name+'.png')});
   row.status='PASS';
  }catch(e){row.error=String(e.stack||e).slice(0,1200);try{await page.screenshot({path:path.join(out,name+'-FAIL.png')})}catch{}}
  results.push(row);console.log('P0-HERO V5 '+name+': '+row.status+(row.error?' '+row.error.slice(0,180):''));
 }
 await c.close();
}
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{for(const c of cases)await checkHome(browser,c);await checkOther(browser)}finally{await browser.close()}
 const pass=results.filter(x=>x.status==='PASS').length,fail=results.length-pass;
 const summary={pass,fail,results};
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(summary,null,2));
 fs.writeFileSync(path.join(out,'acceptance-matrix.md'),['# P0-HERO-01 V5 integrated browser acceptance','','| Scenario | Result |','|---|---|',...results.map(r=>'| '+r.name+' | '+r.status+' |'),'','All results refer to the draft V5 review branch only.'].join('\n'));
 console.log('P0-HERO V5 SUMMARY '+JSON.stringify({pass,fail,cases:results.map(x=>({name:x.name,status:x.status,error:x.error?.slice(0,140)}))}));
 if(fail)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
