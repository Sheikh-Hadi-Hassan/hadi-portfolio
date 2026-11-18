/** Shared homepage carousel: discipline-specific content, desktop pin, native swipe and reduced motion. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch();
 try {
  for(const [width,reduced] of [[1440,false],[390,false],[1440,true]]){
   const context=await browser.newContext({viewport:{width,height:900},reducedMotion:reduced?'reduce':'no-preference'});
   const page=await context.newPage();
   await page.goto('http://127.0.0.1:3000/expertise/product-development/#top');
   await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(3000);
   const work=page.locator('#xp-approach.bf-work'),track=work.locator('.v2sw-track');
   assert.equal(await work.locator('.v2sw-card-slide').count(),9);
   const titles=await work.locator('.v2sw-card-title').allTextContents();
   assert.deepEqual(titles,['TMS','AppTech','Crent','Flow by INTELLIGNCE','CallingDr','Omni Help','Consumer Connect','Vera Health','Legal management']);
   assert.equal(await work.locator('a[target="_blank"]').count(),4);
   const home=await context.newPage();await home.goto('http://127.0.0.1:3000/');
   const selectors=['.v2sw-heading','.v2sw-card-title','.v2sw-card-media'];
   const style=async p=>p.evaluate(ss=>ss.map(s=>{const e=document.querySelector('.bf-work '+s),c=getComputedStyle(e);return [c.fontFamily,c.fontSize,c.lineHeight,c.borderRadius,c.color,c.margin,c.letterSpacing]}),selectors);
   assert.deepEqual(await style(page),await style(home),'Shared visual rules match homepage');
   if(width>=900&&!reduced){
    await page.waitForFunction(()=>document.querySelector('#xp-approach')?.parentElement.classList.contains('pin-spacer'));
    const start=await work.evaluate(e=>e.parentElement.getBoundingClientRect().top+scrollY);
    await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),start+800);await page.waitForTimeout(1500);
    assert(Math.abs(await work.evaluate(e=>e.getBoundingClientRect().top))<3,'Carousel pins to viewport');
    assert(await track.evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).m41)<-600,'Scroll advances horizontal track');
   }else{
    assert.equal(await track.evaluate(e=>getComputedStyle(e).overflowX),'auto');
    await track.evaluate(e=>e.scrollTo({left:window.innerWidth,behavior:'instant'}));await page.waitForTimeout(500);
    assert(await track.evaluate(e=>e.scrollLeft)>100,'Native horizontal exploration works');
   }
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No page overflow');
   await work.screenshot({path:`/private/tmp/product-home-carousel-${width}-${reduced}.png`});
   console.log(`PASS ${width}px reducedMotion=${reduced}: product-only content, shared styles and scrolling`);
   await context.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
