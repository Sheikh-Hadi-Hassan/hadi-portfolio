/**
 * Browser regression fixture for the original-screen phone stack.
 * Uses synthetic labeled SVG screens for CI only; production always uses owner screenshots.
 */
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium,webkit}=require('playwright');
const js=fs.readFileSync(path.join(__dirname,'../src/site.js'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../src/styles/expertise.css'),'utf8');
const from=js.indexOf('// Continuously looping, perspective phone-stack gallery.');
const until=js.indexOf('// Show missing original asset instructions',from);
assert(from>=0&&until>from,'Gallery JS not found');
const carouselJS=js.slice(from,until);
const modes=[{name:'mobile-small',width:360,height:780},{name:'mobile',width:390,height:844},
 {name:'tablet-portrait',width:768,height:1024},{name:'tablet-landscape',width:1024,height:768},
 {name:'desktop',width:1440,height:900}];
const dataURI=(index)=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(
 '<svg xmlns="http://www.w3.org/2000/svg" width="476" height="1097" viewBox="0 0 476 1097">'
 +'<rect width="476" height="1097" fill="#f8f8f8"/><rect x="0" y="0" width="476" height="90" fill="#0066af"/>'
 +'<text x="238" y="320" font-size="90" text-anchor="middle" fill="#111">Screen '+index+'</text>'
 +'<rect x="32" y="420" width="412" height="400" rx="22" fill="#d5ebff"/></svg>');
const cards=Array.from({length:9},(_,index)=>
 '<li class="xp-phone-card" data-phone-slide data-phone-index="'+index+'" aria-label="Screen '+(index+1)+' screen '+(index+1)+' of 9">'
 +'<div class="xp-phone-shell"><div class="xp-phone-screen"><img src="'+dataURI(index+1)+'" width="476" height="1097" alt="Test screen '+(index+1)+'"></div></div></li>').join('');
const dots=Array.from({length:9},(_,index)=>'<button type="button" data-phone-dot="'+index+'" aria-label="Go to '+(index+1)+'" aria-current="'+(index===0)+'"></button>').join('');
const html='<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">'
 +'<style>body{margin:0;background:#050506}.expertise-page{width:100%}.xp-phone-carousel{width:100%;box-sizing:border-box}</style><style>'+css+'</style></head><body>'
 +'<main class="expertise-page" data-discipline="product-development"><div class="xp-phone-carousel" tabindex="0" data-phone-stack role="region" aria-roledescription="carousel">'
 +'<div class="xp-phone-carousel-top"><div class="xp-phone-heading"><span class="xp-phone-eyebrow">SCREEN GALLERY</span><span class="xp-phone-collection">Consumer Connect</span></div>'
 +'<div class="xp-phone-controls"><button data-phone-prev aria-label="Previous">←</button><span data-phone-count-text>01 / 09</span><button data-phone-next aria-label="Next">→</button></div></div>'
 +'<ol class="xp-phone-deck">'+cards+'</ol><div class="xp-phone-footer"><div class="xp-phone-caption">'
 +'<strong data-phone-title class="xp-phone-current">Screen 1</strong></div><div class="xp-phone-pagination">'+dots+'</div></div></div></main>'
 +'<script>'+carouselJS.replace(/<\/script/gi,'<\\/script')+'</script></body></html>';

(async()=>{
 const browserType=process.env.EXPERTISE_BROWSER_ENGINE==='webkit'?webkit:chromium;
 const browser=await browserType.launch({headless:true});
 const artifact=path.resolve('artifacts/expertise-qa');
 fs.mkdirSync(artifact,{recursive:true});
 try{
  for(const device of modes){
   const context=await browser.newContext({viewport:{width:device.width,height:device.height},
    reducedMotion:'reduce',isMobile:device.name.startsWith('mobile'),hasTouch:device.name.startsWith('mobile')});
   const page=await context.newPage();
   const errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await page.setContent(html,{waitUntil:'load'});
   assert.equal(await page.locator('[data-phone-slide]').count(),9);
   const buttonState=await page.locator('[data-phone-next]').evaluate(el=>{
    const rect=el.getBoundingClientRect(),style=getComputedStyle(el);
    const parent=el.parentElement,ps=getComputedStyle(parent);
    return {rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},visibility:style.visibility,
     display:style.display,opacity:style.opacity,parentDisplay:ps.display,parentVisibility:ps.visibility,
     carouselRect:document.querySelector('[data-phone-stack]').getBoundingClientRect().toJSON()};
   });
   console.log('PHONE CONTROL STATE',device.name,JSON.stringify(buttonState));
   await page.locator('[data-phone-next]').click({timeout:5000});
   await page.waitForFunction(()=>document.querySelector('[data-phone-count-text]')?.textContent==='02 / 09');
   await page.locator('[data-phone-prev]').click();
   await page.waitForFunction(()=>document.querySelector('[data-phone-count-text]')?.textContent==='01 / 09');
   await page.locator('[data-phone-prev]').click();
   await page.waitForFunction(()=>document.querySelector('[data-phone-count-text]')?.textContent==='09 / 09');
   await page.locator('[data-phone-dot="4"]').click();
   await page.waitForFunction(()=>document.querySelector('[data-phone-count-text]')?.textContent==='05 / 09');
   await page.locator('[data-phone-stack]').focus();
   await page.keyboard.press('ArrowRight');
   await page.waitForFunction(()=>document.querySelector('[data-phone-count-text]')?.textContent==='06 / 09');
   const dims=await page.evaluate(()=>{
    const deck=document.querySelector('.xp-phone-deck').getBoundingClientRect();
    const active=document.querySelector('.xp-phone-card.is-center').getBoundingClientRect();
    const image=document.querySelector('.xp-phone-card.is-center img');
    return {fit:getComputedStyle(image).objectFit,activeWidth:active.width,activeHeight:active.height,
     deckHeight:deck.height,overflow:document.documentElement.scrollWidth-innerWidth,
     current:document.querySelector('[data-phone-count-text]').textContent};
   });
   assert.equal(dims.fit,'contain','Original screenshot is being cropped');
   assert(dims.activeWidth>100&&dims.activeHeight>300,'Active screen lacks readable size');
   assert(dims.activeHeight<dims.deckHeight+20,'Active phone clipped on '+device.name);
   assert(dims.overflow<=3,'Horizontal document overflow on '+device.name);
   assert.deepEqual(errors,[],'Browser errors on '+device.name);
   await page.screenshot({path:path.join(artifact,'phone-stack-'+device.name+(browserType===webkit?'-webkit':'')+'.png')});
   console.log(device.name,JSON.stringify(dims));
   await context.close();
  }
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
