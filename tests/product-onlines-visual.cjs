/** Measured visual and motion regressions for the exported product portfolio. */
const {chromium}=require('playwright');
const http=require('http');
const root=require('path').resolve('out');
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const out=path.resolve('docs/onlines-fidelity-20261117');
const server=http.createServer((req,res)=>{let f=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!f.startsWith(root+path.sep)&&f!==root){res.writeHead(403);return res.end()}if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)){res.writeHead(404);return res.end()}res.setHeader('content-type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(res)});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch(),results=[];
 try{
  for(const width of[1440,390])for(const reduced of[false,true]){
   const height=width===1440?900:844;
   const context=await browser.newContext({viewport:{width,height},reducedMotion:reduced?'reduce':'no-preference'}),page=await context.newPage();
   await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
   await page.goto(`http://127.0.0.1:${server.address().port}/expertise/product-development/#top`);
   await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(2800);
   assert.equal(await page.locator('.ol-header').count(),0,'The requested composition has no header');
   const geometry=await page.evaluate(()=>({hero:document.querySelector('.ol-hero').offsetHeight,quote:document.querySelector('.ol-intro').offsetHeight,font:getComputedStyle(document.querySelector('h1')).fontFamily,cursors:document.querySelectorAll('.ol-hero-stage [data-cursor]').length,panels:document.querySelectorAll('.ol-hero-art').length,orbit:document.querySelectorAll('.ol-product').length}));
   assert.equal(geometry.hero,Math.max(550,height-100),'Reference hero height, with header removed');assert(geometry.font.includes('Nebulica'));assert.equal(geometry.cursors,7);assert.equal(geometry.panels,6);assert.equal(geometry.orbit,6);
   if(!reduced)assert(Math.abs(geometry.quote-height*(width===1440?3.35:2.5))<=1,'Measured reference pinned-quote travel');
   const cursor=page.locator('.ol-cursor-0'),before=await cursor.getAttribute('style');await page.waitForTimeout(350);assert.equal(before!==await cursor.getAttribute('style'),!reduced,'Independent cursor path is motion-aware');
   await page.screenshot({path:out+`/screenshots/hero-${width}-${reduced}.png`});
   await page.waitForSelector('#xp-approach.bf-work .v2sw-track');
   for(const selector of['.ol-feature-card','.ol-products-copy','.ol-work-inner','.ol-contact-copy']){
    await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(1200);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal overflow');
    if(selector==='.ol-feature-card')assert(await page.locator('#ol-feature-heading').evaluate(e=>e.scrollWidth<=e.clientWidth+2),'Brand typography fits reference content column');
    if(selector==='.ol-work-inner'){
     const heading=await page.locator('#ol-work-heading').evaluate(e=>({height:e.getBoundingClientRect().height,line:parseFloat(getComputedStyle(e).lineHeight)}));assert(Math.abs(heading.height-heading.line*2-(width===390?5:0))<3,'Work headline retains two reference lines');
     const fan=await page.locator('.ol-fan-card').evaluateAll(es=>es.map(e=>({width:e.offsetWidth,height:e.offsetHeight,fit:getComputedStyle(e.querySelector('img')).objectFit,loaded:e.querySelector('img').complete})));
     assert.deepEqual(fan.map(e=>[e.width,e.height]),width===1440?[[188,356],[290,500],[188,356]]:[[130,246],[188,346],[130,246]],'Measured fan dimensions, not equal-size substitutes');assert(fan.every(e=>e.loaded));
     await page.screenshot({path:out+`/screenshots/work-${width}-${reduced}.png`});
     await page.locator('.ol-fan-card').nth(1).click();assert(await page.locator('.lightbox').evaluate(e=>e.open),'Fan opens complete owner presentation');await page.locator('.lightbox .close').click();
    }
   }
   await page.locator('.ol-product-marquee').scrollIntoViewIfNeeded();await page.waitForTimeout(200);const track=page.locator('.ol-marquee-track'),t1=await track.evaluate(e=>getComputedStyle(e).transform);await page.waitForTimeout(300);assert.equal(t1!==await track.evaluate(e=>getComputedStyle(e).transform),!reduced,'Logo strip honors reduced motion');
   await page.locator('.ol-product-marquee').hover();await page.waitForTimeout(100);const t2=await track.evaluate(e=>getComputedStyle(e).transform);await page.waitForTimeout(200);assert.equal(await track.evaluate(e=>getComputedStyle(e).transform),t2,'Logo strip pauses on hover');
   for(const href of await page.locator('.ol-case').evaluateAll(es=>es.map(e=>e.getAttribute('href')))){const[route,anchor]=href.split('#');assert(fs.readFileSync(path.join('out',route,'index.html'),'utf8').includes(`id="${anchor}"`),'Case archive anchors resolve in actual export')}
   results.push({width,height,reduced,status:'PASS',geometry,referenceFanDimensions:true,fullPresentation:true,marqueePause:true});await context.close();
  }
  const c=await browser.newContext({viewport:{width:1440,height:900}}),p=await c.newPage();await p.goto(`http://127.0.0.1:${server.address().port}/expertise/product-development/`);await p.mouse.wheel(0,120);await p.waitForTimeout(100);assert(await p.evaluate(()=>scrollY===0),'Reference intro holds first scroll');await p.waitForTimeout(1700);await p.mouse.wheel(0,200);await p.waitForTimeout(400);assert(await p.evaluate(()=>scrollY>0),'Intro releases after 1.5 second entrance');results.push({introHold:'PASS',release:'PASS'});await c.close();
 }finally{await browser.close();server.close();fs.writeFileSync(out+'/visual-regressions.json',JSON.stringify(results,null,2))}
 console.log('PASS: reference geometry, motion, full presentations and entrance release');
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
