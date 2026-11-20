/** Actual exported page acceptance; no synthetic artwork or mocked animation. */
const {chromium,webkit}=require('playwright');
const AxeBuilder=require('@axe-core/playwright').default;
const fs=require('fs'),http=require('http'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve('out'),evidence=path.resolve(process.env.FLIGHT_EVIDENCE_DIR||'docs/flying-hero-20261116'),shots=path.resolve('artifacts/product-flight');
fs.mkdirSync(shots,{recursive:true});fs.mkdirSync(evidence+'/screenshots',{recursive:true});
const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);return res.end()};if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file)){res.writeHead(404);return res.end()};res.setHeader('content-type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.webp':'image/webp','.jpeg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)});
const devices=[{width:1440,height:900},{width:1280,height:800},{width:768,height:1024},{width:390,height:844},{width:360,height:780}];
const results=[];
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const engine=process.env.FLIGHT_ENGINE==='webkit'?'webkit':'chromium';const browser=await({chromium,webkit}[engine]).launch();
try{for(const device of devices){for(const reduced of[false,true]){const context=await browser.newContext({viewport:device,reducedMotion:reduced?'reduce':'no-preference',hasTouch:device.width<681,isMobile:device.width<681});const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 const result={engine,...device,reduced,status:'PASS'};
 try{await page.addInitScript(()=>{window.__flightEntrySamples=[];const observer=new MutationObserver(()=>{const t=document.querySelector('[data-flight-card]')?.style.transform;if(t&&!window.__flightEntrySamples.includes(t))window.__flightEntrySamples.push(t);if(window.__flightEntrySamples.length>=30)observer.disconnect()});observer.observe(document,{subtree:true,attributes:true,attributeFilter:['style']});});const response=await page.goto(`http://127.0.0.1:${server.address().port}/expertise/product-development/`,{waitUntil:'networkidle'});assert.equal(response.status(),200);await page.waitForFunction(()=>document.querySelector('[data-product-flight]')?.dataset.flightMounted==='true');
 const scene=page.locator('[data-product-flight]');
 if(!reduced){const entrance=await page.locator('[data-flight-card]').first().getAttribute('style');await page.waitForTimeout(2500);const settled=await page.locator('[data-flight-card]').first().getAttribute('style');result.entranceSampleCount=await page.evaluate(()=>window.__flightEntrySamples.length);result.entranceChanged=result.entranceSampleCount>1;assert(result.entranceChanged,'Entrance never changes card transform');}
 await page.evaluate(()=>document.fonts.ready);
 assert.equal(await page.locator('main h1').count(),1);
 const initial=await page.evaluate(()=>{const root=document.querySelector('[data-product-flight]');const cards=[...root.querySelectorAll('[data-flight-card]')].filter(e=>getComputedStyle(e).display!=='none');return{overflow:document.documentElement.scrollWidth-innerWidth,cards:cards.length,loaded:cards.every(e=>e.querySelector('img').naturalWidth>0),background:root.querySelector('picture img').naturalWidth,transforms:cards.map(e=>e.style.transform),headingWidth:root.querySelector('h1').getBoundingClientRect().width,stageHeight:root.querySelector('.product-flight-stage').offsetHeight,static:!root.classList.contains('is-ready')}});
 assert.equal(initial.overflow,0);assert(initial.loaded&&initial.background>0,'Broken owner artwork');assert.equal(initial.cards,device.width<681||reduced?6:19);assert.equal(initial.static,reduced);
 assert(await page.locator('.product-flight h1>span').evaluateAll(es=>es.every(e=>e.scrollWidth<=e.clientWidth+1)),'Headline text clipped');
 const a11y=await new AxeBuilder({page}).include('.product-flight').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();result.accessibility={violations:a11y.violations.map(v=>v.id),incomplete:a11y.incomplete.map(v=>v.id)};assert.deepEqual(result.accessibility.violations,[],'Hero accessibility violation');
 const ctas=page.locator('.product-flight-copy .bf-button');for(let i=0;i<2;i++){const clickable=await ctas.nth(i).evaluate(e=>{let r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))});assert(clickable,'Primary action obscured');}
 const screenshot=async label=>{const file=`${engine}-${device.width}-${reduced?'reduced-':''}${label}.png`;await page.screenshot({path:path.join(shots,file)});if([1440,390].includes(device.width)&&engine==='chromium')fs.copyFileSync(path.join(shots,file),path.join(evidence,'screenshots',file));};await screenshot('initial');
 if(!reduced){
 const distance=await scene.evaluate(e=>e.offsetHeight-e.querySelector('.product-flight-stage').offsetHeight);const state=async fraction=>{await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),distance*fraction);await page.waitForTimeout(100);return await scene.evaluate(e=>({progress:Number(e.dataset.flightProgress),top:e.querySelector('.product-flight-stage').getBoundingClientRect().top,transforms:[...e.querySelectorAll('[data-flight-card]')].map(c=>c.style.transform)}))};
 const middle=await state(.35);await screenshot('intermediate');assert(Math.abs(middle.top)<2,'Stage does not pin');
 const ring=await state(.8);await screenshot('ring');assert(ring.progress>.79&&ring.progress<.81,'Progress is not derived from scrolling');assert.notDeepEqual(ring.transforms,initial.transforms);
 await page.waitForTimeout(200);assert.deepEqual(await scene.locator('[data-flight-card]').evaluateAll(cs=>cs.map(c=>c.style.transform)),ring.transforms,'Ring rotates while idle');
 const reverse=await state(.35);assert.deepEqual(reverse.transforms,middle.transforms,'Reverse does not exactly retrace the path');await screenshot('reverse');
 await state(0);assert.deepEqual(await scene.locator('[data-flight-card]').evaluateAll(cs=>cs.filter(c=>getComputedStyle(c).display!=='none').map(c=>c.style.transform)),initial.transforms,'Return to scatter snapped');
 if(device.width>=1280){const card=page.locator('[data-flight-card]').first();await card.hover();await page.waitForTimeout(800);const flip=await card.locator('.product-flight-flip').evaluate(e=>getComputedStyle(e).transform);assert.notEqual(flip,'none','Desktop flip missing');result.hoverTransform=flip;await page.mouse.move(1,1);await card.click();assert.equal(await page.evaluate(()=>location.hash),'#xp-work','Card link blocked by hover');await state(0);}
 await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),distance+device.height*.7);await page.waitForTimeout(150);assert(await page.locator('.product-flight-stage').evaluate(e=>e.getBoundingClientRect().top<0),'Sticky scene never releases');await screenshot('released');
 result.scroll={distance,mid:middle.progress,ring:ring.progress,reverseExact:true,idleStationary:true,released:true};
 }
 // Brand consistency, flagship products and the focused page flow.
 const products=JSON.parse(fs.readFileSync(path.resolve('src/data/digital-products.json'),'utf8')).products;
 assert.equal(await page.locator('#xp-products [data-product]').count(),4);
 for(const product of products){const card=page.locator('#xp-products [data-product="'+product.id+'"]');assert(await card.getByRole('heading').innerText());assert.equal(await card.locator('a').last().getAttribute('href'),product.url);}
 const brand=await page.locator('.product-flight-copy .bf-button').first().evaluate(e=>{const s=getComputedStyle(e),probe=document.createElement('span');probe.style.color='var(--theme-accent)';document.body.append(probe);const accent=getComputedStyle(probe).color;probe.remove();return{background:s.backgroundColor,accent,radius:s.borderRadius,font:s.fontFamily}});
 assert.equal(brand.background,brand.accent,'Primary action is outside the homepage palette');assert.equal(brand.radius,'10px');assert(brand.font.includes('Instrument Sans'));
 for(const id of['xp-about','xp-experience','xp-capabilities','xp-questions'])assert.equal(await page.locator('#'+id).count(),0,'Redundant section retained: '+id);
 assert.equal(await page.locator('#xp-work [data-full]').count(),9);
 await page.locator('#xp-work [data-full]').first().click();assert(await page.locator('.lightbox').evaluate(e=>e.open));await page.waitForFunction(()=>document.querySelector('.lightbox img').naturalWidth>0);await page.locator('.lightbox .close').click();await page.waitForFunction(()=>document.body.style.overflow==='');
 const detail=page.locator('#xp-approach details').first();await detail.locator('summary').click();assert(await detail.evaluate(e=>e.open));await detail.locator('summary').click();
 assert((await page.locator('#xp-contact a.bf-button').first().getAttribute('href')).startsWith('mailto:hadi@intellignce.net'));
 result.brand='PASS: homepage palette/type/button geometry; 4 flagships; 9 enlargements; process details; direct contact; redundant sections removed';
 // Real existing gallery: links, source artwork, collection tabs, stationary frame and pixel transition.
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(150);
 await ctas.first().click();await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>location.hash),'#xp-products');
 await page.locator('.xp-sticky-rail a[href="#xp-mobile-showcase"]').click();await page.waitForTimeout(500);
 const gallery=page.locator('[data-phone-stack]');assert.equal(await gallery.count(),1);const counter=gallery.locator('[data-phone-count-text]');const before=await counter.textContent();
 const frame=gallery.locator('.xp-gallery-device');const beforeFrame=await frame.boundingBox();await gallery.locator('[data-phone-next]').click();
 if(!reduced){await page.waitForFunction(()=>document.querySelector('.xp-gallery-device').classList.contains('is-wiping'));assert.equal(await gallery.locator('.xp-screen-layer.is-entering').count(),1);assert.equal(await gallery.locator('.xp-screen-layer.is-leaving').count(),1);assert(await gallery.locator('.xp-screen-layer img').evaluateAll(es=>es.every(e=>e.naturalWidth>0)),'Wipe lacks two real images');}
 await page.waitForTimeout(900);assert.notEqual(await counter.textContent(),before);assert(await gallery.locator('.xp-screen-layer.is-current img').evaluate(e=>e.complete&&e.naturalWidth>0));assert.equal(await gallery.locator('.xp-screen-layer').count(),2);
 const afterFrame=await frame.boundingBox();assert(Math.abs(beforeFrame.x-afterFrame.x)<2&&Math.abs(beforeFrame.width-afterFrame.width)<2,'Phone frame moved with the screen');
 await gallery.locator('[data-phone-prev]').click();await page.waitForTimeout(900);assert.equal(await counter.textContent(),before);
 for(const title of['Omni Help','AppTech Client','AppTech Admin']){await gallery.getByRole('tab',{name:title,exact:true}).click();await page.waitForTimeout(750);assert(await gallery.locator('.xp-screen-layer.is-current img').evaluate(e=>e.complete&&e.naturalWidth>0));}
 result.gallery='PASS: next/previous, 4 collections, stationary frame, preserved two-layer 680ms wipe';
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Gallery overflow');assert.deepEqual(errors,[]);result.pageErrors=errors;
 }catch(e){result.status='FAIL';result.error=e.stack;console.error('FAIL',engine,device.width,reduced,e.message);await page.screenshot({path:path.join(shots,`${engine}-${device.width}-${reduced}-failure.png`)}).catch(()=>{});}finally{results.push(result);await context.close()};console.log(result.status,engine,device.width,reduced?'reduced':'motion');
 }}}finally{await browser.close();server.close();fs.writeFileSync(path.join(evidence,`browser-${engine}.json`),JSON.stringify(results,null,2));}if(results.some(r=>r.status==='FAIL'))process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
