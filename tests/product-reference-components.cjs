/** Owner reference components: responsive geometry and real control behavior. */
const{chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('fs');
(async()=>{const b=await chromium.launch();try{
 for(const [width,height,reduced] of [[1440,900,false],[1280,900,false],[768,1024,false],[390,844,false],[360,800,true]]){
  const c=await b.newContext({viewport:{width,height},reducedMotion:reduced?'reduce':'no-preference',permissions:['clipboard-read','clipboard-write']});const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:3000/expertise/product-development/#top');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(2600);
  assert.equal((await p.locator('h1').innerText()).replace(/\s+/g,' '),'Digital product design');
  assert.equal(await p.locator('.ol-hero-art').count(),6);assert.equal(await p.locator('.ol-icon-grid svg').count(),6);
  assert.equal(await p.locator('#xp-approach .v2sw-card-slide').count(),9);
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No page overflow');
  const geometry=await p.evaluate(()=>{const rect=e=>{let r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}};return {title:rect(document.querySelector('h1')),objects:[...document.querySelectorAll('.ol-hero-art')].map(rect)}});
  assert(geometry.title.x>=0&&geometry.title.x+geometry.title.w<=width+1,'Title fits viewport');
  for(const r of geometry.objects){assert(r.x>=-15&&r.x+r.w<=width+15,'Complete hero objects fit viewport');const t=geometry.title;assert(!(Math.min(t.x+t.w,r.x+r.w)-Math.max(t.x,r.x)>8&&Math.min(t.y+t.h,r.y+r.h)-Math.max(t.y,r.y)>8),'Hero objects leave title clear')}
  await p.locator('.ol-hero').screenshot({path:`/private/tmp/product-components-hero-${width}.png`});
  await p.locator('[data-ipod-select]').click();assert(await p.locator('.ol-ipod-now').isVisible());
  await p.locator('[data-ipod-step="1"]').click();assert.equal(await p.locator('[data-ipod-title]').innerText(),'TMS');
  await p.locator('[data-ipod-menu]').click();assert(await p.locator('.ol-ipod-menu').isVisible());
  await p.locator('[data-ipod-item="2"]').click();assert.equal(await p.locator('[data-ipod-title]').innerText(),'Crent');
  await p.locator('[data-ipod-select]').focus();await p.keyboard.press('ArrowRight');assert.equal(await p.locator('[data-ipod-title]').innerText(),'Flow by INTELLIGNCE');
  await p.locator('[data-code-copy]').click();await p.waitForFunction(()=>document.querySelector('[data-code-copy]').textContent==='Copied');assert((await p.evaluate(()=>navigator.clipboard.readText())).includes('AppTech'));
  const toggle=p.locator('[data-preview-toggle]').first();await toggle.scrollIntoViewIfNeeded();await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'true');assert(await p.locator('#ol-preview-0').isVisible());assert.equal(await p.locator('#ol-preview-0 p').evaluate(e=>getComputedStyle(e).color),'rgb(108, 98, 118)','Readable detail text on the light panel');await p.waitForTimeout(450);await p.locator('.ol-preview-grid').screenshot({path:`/private/tmp/product-components-showcase-${width}.png`});
  await toggle.focus();await p.keyboard.press('Enter');assert.equal(await toggle.getAttribute('aria-expanded'),'false');
  assert.deepEqual(errors,[]);console.log(`PASS ${width}px reduced=${reduced}: geometry, player, clipboard, preview, keyboard, no runtime errors`);await c.close();
 }
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
