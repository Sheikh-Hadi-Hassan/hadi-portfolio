/**
 * Real-page visual and functional QA for Consumer Connect (not the SVG fixture).
 * Evidence must be captured from original images inside the generated Product Design page.
 */
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium, webkit } = require('playwright');

const root = path.resolve('out');
const evidence = path.resolve('artifacts/expertise-qa');
const name = process.env.EXPERTISE_BROWSER_ENGINE === 'webkit' ? 'webkit' : 'chromium';
const browserType = name === 'webkit' ? webkit : chromium;
const devices = [
  { name: 'mobile-small', width: 360, height: 780, touch: true },
  { name: 'mobile', width: 390, height: 844, touch: true },
  { name: 'tablet', width: 768, height: 1024, touch: false },
  { name: 'desktop', width: 1440, height: 900, touch: false },
];
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json',
  '.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2'};
fs.mkdirSync(evidence, {recursive:true});
const server = http.createServer((req,res)=>{
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); return res.end(); }
  let file = path.resolve(root, '.' + pathname);
  if (file !== root && !file.startsWith(root + path.sep)) {res.writeHead(403);return res.end();}
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
  if (!fs.existsSync(file)) {res.writeHead(404);return res.end('Missing local asset');}
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
async function countValue(phone) {
  return (await phone.locator('[data-phone-count-text]').textContent()).trim();
}
async function advanceAndCheck(phone, control) {
  const before=await countValue(phone);
  await phone.locator(control).click();
  await phone.page().waitForFunction(({old})=>{
    const node=document.querySelector('#ol-gallery [data-phone-count-text]');
    return node && node.textContent.trim()!==old;
  },{old:before});
  return countValue(phone);
}
(async()=>{
  assert(fs.existsSync(path.join(root,'expertise/product-development/index.html')),'Generated route missing');
  for(let i=1;i<=9;i++){
    const prefix='consumer-connect-'+String(i).padStart(2,'0')+'-';
    const files=fs.readdirSync(path.join(root,'assets/expertise')).filter(f=>f.startsWith(prefix)&&f.endsWith('.webp'));
    assert.equal(files.length,1,'Original Consumer Connect asset missing for screen '+i);
    assert(fs.statSync(path.join(root,'assets/expertise',files[0])).size>1024,'Asset is suspiciously small: '+files[0]);
  }
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await browserType.launch({headless:true});
  const results=[];
  try{
    for(const device of devices){
      const context=await browser.newContext({viewport:{width:device.width,height:device.height},
        reducedMotion:'reduce',isMobile:device.touch,hasTouch:device.touch});
      const page=await context.newPage();
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      const result={browser:name,viewport:device.name,width:device.width,status:'FAIL'};
      try{
        await page.goto('http://127.0.0.1:'+server.address().port+'/expertise/product-development/',{waitUntil:'domcontentloaded'});
        await page.locator('.ol-work-copy [data-ol-gallery]').click({timeout:15000});
        await page.locator('#ol-gallery[open]').waitFor();
        const phone=page.locator('#ol-gallery [data-phone-stack]');
        assert.equal(await phone.count(),1,'Actual phone carousel missing from gallery');
        await phone.scrollIntoViewIfNeeded();
        await page.waitForFunction(()=>{
          const img=document.querySelector('#ol-gallery [data-phone-stack] .xp-screen-layer.is-current img');
          return img && img.complete && img.naturalWidth>200;
        });
        await phone.getByRole('tab',{name:'Consumer Connect',exact:true}).click();
        await page.waitForTimeout(80);
        assert.equal(await phone.locator('[data-phone-project="consumer-connect"]').count(),9);
        const initial=await phone.locator('.xp-screen-layer.is-current img').getAttribute('src');
        assert(initial.includes('consumer-connect-01-home.webp'),'Center must show original Consumer Connect screen 1');
        assert(!initial.includes('data:image/svg'),'Synthetic fixture leaked into the real page');
        const visuals=await phone.evaluate(root=>{
          const section=root.closest('.xp-phone-section');
          const deck=root.querySelector('.xp-phone-deck');
          const frame=root.querySelector('.xp-gallery-frame');
          const device=root.querySelector('.xp-gallery-device');
          const img=root.querySelector('.xp-screen-layer.is-current img');
          const rect=deck.getBoundingClientRect(),dr=device.getBoundingClientRect();
          return {
            sectionBackground:getComputedStyle(section).backgroundColor,
            carouselBackground:getComputedStyle(root).backgroundColor,
            leftFade:getComputedStyle(deck,'::before').backgroundImage,
            rightFade:getComputedStyle(deck,'::after').backgroundImage,
            island:getComputedStyle(frame,'::before').content,
            deviceBorderRadius:getComputedStyle(device).borderRadius,
            deviceCenterError:Math.abs(dr.left+dr.width/2-(rect.left+rect.width/2)),
            imageWidth:img.naturalWidth,imageHeight:img.naturalHeight,
            imageSrc:img.getAttribute('src'),
            docOverflow:document.documentElement.scrollWidth-innerWidth,
          };
        });
        assert.equal(visuals.sectionBackground,'rgb(0, 0, 0)','Section is not black');
        assert.equal(visuals.carouselBackground,'rgb(0, 0, 0)','Carousel is not black');
        assert(visuals.leftFade.includes('linear-gradient'),'Missing left black fade');
        assert(visuals.rightFade.includes('linear-gradient'),'Missing right black fade');
        assert(visuals.leftFade.includes('0, 0, 0') && visuals.rightFade.includes('0, 0, 0'),'Fade must use black');
        assert(visuals.island!=='none'&&visuals.island!=='normal','Dynamic Island overlay missing');
        assert(visuals.deviceCenterError<=3,'Centered iPhone is misaligned');
        assert(visuals.docOverflow<=2,'Horizontal page overflow');
        await phone.screenshot({path:path.join(evidence,'consumer-connect-real-'+name+'-'+device.name+'.png')});

        // A complete nine-screen cycle crosses to the next real project, then wraps back.
        await phone.locator('[data-phone-prev]').click();
        assert.equal((await phone.getByRole('tab',{name:'AppTech Admin',exact:true}).getAttribute('aria-selected')),'true');
        await phone.locator('[data-phone-next]').click();
        assert.equal((await phone.getByRole('tab',{name:'Consumer Connect',exact:true}).getAttribute('aria-selected')),'true');
        assert.equal(await countValue(phone),'01 / 09');
        await advanceAndCheck(phone,'[data-phone-next]');
        await advanceAndCheck(phone,'[data-phone-prev]');

        // Wheel navigation and native pointer dragging on desktop/tablet.
        if(!device.touch){
          const deck=phone.locator('.xp-phone-deck');
          const rect=await deck.boundingBox();
          await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height/2);
          let old=await countValue(phone);
          await page.mouse.wheel(0,150);
          await page.waitForTimeout(150);
          assert.notEqual(await countValue(phone),old,'Wheel did not navigate');
          old=await countValue(phone);
          await page.mouse.move(rect.x+rect.width*.65,rect.y+rect.height*.5);
          await page.mouse.down();
          await page.mouse.move(rect.x+rect.width*.25,rect.y+rect.height*.5,{steps:8});
          await page.mouse.up();
          await page.waitForTimeout(160);
          assert.notEqual(await countValue(phone),old,'Drag did not navigate');
        } else {
          // Simulated touch PointerEvents exercise the mobile swipe handler.
          const old=await countValue(phone);
          await phone.locator('.xp-phone-deck').evaluate(deck=>{
            const box=deck.getBoundingClientRect(),x=box.left+box.width*.75,y=box.top+box.height*.5;
            const base={bubbles:true,pointerId:11,pointerType:'touch',isPrimary:true};
            deck.dispatchEvent(new PointerEvent('pointerdown',{...base,clientX:x,clientY:y}));
            deck.dispatchEvent(new PointerEvent('pointermove',{...base,clientX:x-100,clientY:y}));
            deck.dispatchEvent(new PointerEvent('pointerup',{...base,clientX:x-100,clientY:y}));
          });
          assert.notEqual(await countValue(phone),old,'Touch swipe handler did not navigate');
        }
        if(device.name==='desktop'){
          await page.locator('.ol-gallery-art').first().scrollIntoViewIfNeeded();
          await page.locator('.ol-gallery-art').first().click();
          assert(await page.locator('.lightbox').evaluate(e=>e.open),'Expandable screenshot lightbox failed');
          await page.locator('.lightbox .close').click();
          assert(await page.locator('#ol-gallery').evaluate(e=>e.open),'Nested lightbox close broke gallery');
        }
        assert.deepEqual(errors,[],'Uncaught browser errors');
        result.status='PASS';
        result.visuals=visuals;
        result.interactions='navigation, wraparound, '+(device.touch?'touch pointer swipe':'mouse wheel and drag')+(device.name==='desktop'?', nested expansion':'');
      }catch(e){
        result.error=e.stack||String(e);
        await page.screenshot({path:path.join(evidence,'consumer-connect-FAIL-'+name+'-'+device.name+'.png')}).catch(()=>{});
        console.error('CONSUMER CONNECT QA FAIL',name,device.name,e.message);
      }finally{
        results.push(result);
        console.log('CONSUMER CONNECT QA',name,device.name,result.status);
        await context.close();
      }
    }
  } finally{
    await browser.close();
    server.close();
    fs.writeFileSync(path.join(evidence,'consumer-connect-real-'+name+'.json'),JSON.stringify(results,null,2));
  }
  if(results.some(r=>r.status!=='PASS'))process.exitCode=1;
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
