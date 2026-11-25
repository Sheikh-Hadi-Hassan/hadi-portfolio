'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const BASE=process.env.P0_GALLERY_URL||'http://127.0.0.1:3003';
const OUT=process.env.P0_GALLERY_EVIDENCE||'artifacts/p0-gallery';
fs.mkdirSync(OUT,{recursive:true});
const specs=[['desktop',1440,900],['laptop',1024,768],['tablet',768,1024],['mobile',390,844],['small-mobile',320,700]];
(async()=>{const browser=await chromium.launch({headless:true,args:['--no-sandbox']}),results=[];
try{
 for(const [name,width,height] of specs){
 const context=await browser.newContext({viewport:{width,height},reducedMotion:'no-preference',hasTouch:width<700,isMobile:width<700});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 const result={name,width,height,status:'FAIL'};
 try{
  const response=await page.goto(BASE+'/',{waitUntil:'domcontentloaded',timeout:45000});assert(response?.ok());
  await page.waitForFunction(()=>document.querySelector('[data-portfolio-gallery][data-gallery-enhanced="true"]'),null,{timeout:25000});
  const cards=page.locator('[data-gallery-card]');
  assert.equal(await cards.count(),15,'All approved cases should be present in crawlable HTML');
  const filters=page.locator('[data-gallery-filter]');
  assert.equal(await filters.count(),7,'All + six occupied categories');
  assert.match(await page.locator('[data-gallery-status]').innerText(),/Showing 15 of 15 projects/);
  await page.locator('[data-portfolio-gallery]').scrollIntoViewIfNeeded();
  for(let i=1;i<7;i++){
   const b=filters.nth(i),id=await b.getAttribute('data-gallery-filter');
   await b.click();assert.equal(await b.getAttribute('aria-pressed'),'true');
   const visible=await cards.evaluateAll(nodes=>nodes.filter(n=>!n.hidden).map(n=>({slug:n.dataset.gallerySlug,ids:n.dataset.galleryCategoryIds.split(' ')})));
   assert(visible.length>0,'No visible projects for '+id);
   assert(visible.every(x=>x.ids.includes(id)),'Incorrect filter '+id);
   const text=await page.locator('[data-gallery-status]').innerText();assert.match(text,new RegExp('Showing '+visible.length+' of 15 projects'));
   const numbers=await page.locator('[data-gallery-card]:not([hidden]) [data-gallery-number]').allTextContents();
   assert.equal(numbers.length,visible.length);assert.equal(numbers[numbers.length-1].trim().split(' / ')[1],String(visible.length).padStart(2,'0'));
  }
  await filters.first().click();
  assert.equal(await page.locator('[data-gallery-card]:not([hidden])').count(),15);
  await page.locator('.v2sw-track').focus();
  await page.keyboard.press('End');
  assert.equal(await page.locator('[data-gallery-step="1"]').isDisabled(),true);
  await page.keyboard.press('Home');
  assert.equal(await page.locator('[data-gallery-step="-1"]').isDisabled(),true);
  await page.screenshot({path:path.join(OUT,name+'-'+width+'.png')});
  assert.deepEqual(errors,[],'Browser errors');
  result.status='PASS';
 }catch(e){result.error=String(e.stack||e).slice(0,1600);await page.screenshot({path:path.join(OUT,name+'-FAIL.png')}).catch(()=>{})}
 results.push(result);
 console.log('GALLERY '+name+' '+result.status+(result.error?' '+result.error.slice(0,190):''));
 await context.close();
 }
}finally{await browser.close();fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify(results,null,2))}
if(results.some(r=>r.status!=='PASS'))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
