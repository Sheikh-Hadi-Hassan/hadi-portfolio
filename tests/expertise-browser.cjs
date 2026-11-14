/**
 * Standalone desktop/tablet/mobile visual and behavioral QA for expertise portfolios.
 * Run after npm run build: node tests/expertise-browser.cjs
 */
const {chromium,webkit}=require('playwright');
const fs=require('fs');
const http=require('http');
const path=require('path');
const assert=require('node:assert/strict');
const root=path.resolve('out');
const artifacts=path.resolve('artifacts/expertise-qa');
const slugs=['creative-direction','product-development','video-production'];
const devices=[
 {name:'mobile-small',width:360,height:780},
 {name:'mobile',width:390,height:844},
 {name:'ipad-portrait',width:768,height:1024},
 {name:'ipad-landscape',width:1024,height:768},
 {name:'desktop',width:1440,height:900}
];

function createStaticServer(){
 return http.createServer((req,res)=>{
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}
  catch{res.writeHead(400);res.end();return}
  let full=path.resolve(root,'.'+pathname);
  if(full!==root&&!full.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
  if(fs.existsSync(full)&&fs.statSync(full).isDirectory())full=path.join(full,'index.html');
  if(!fs.existsSync(full)||!fs.statSync(full).isFile()){res.writeHead(404);res.end();return}
  const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.woff2':'font/woff2'};
  res.setHeader('Content-Type',mime[path.extname(full)]||'application/octet-stream');
  fs.createReadStream(full).pipe(res);
 });
}
async function run(){
 assert(fs.existsSync(path.join(root,'index.html')),'Build the site first: npm run build');
 fs.mkdirSync(artifacts,{recursive:true});
 const server=createStaticServer();
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
  const useWebKit=process.env.EXPERTISE_BROWSER_ENGINE==='webkit';
  const browserType=useWebKit?webkit:chromium;
  const engine=useWebKit?'webkit':'chromium';
  browser=await browserType.launch(useWebKit?{headless:true}:{headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const base='http://127.0.0.1:'+server.address().port;
  const failures=[];
  for(const slug of slugs){
   for(const device of devices){
    const context=await browser.newContext({viewport:{width:device.width,height:device.height},deviceScaleFactor:1,reducedMotion:'reduce',isMobile:device.name.startsWith('mobile'),hasTouch:device.name.startsWith('mobile')});
    const page=await context.newPage();
    const url=base+'/expertise/'+slug+'/';
    try{
     const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
     assert.equal(response.status(),200,'Unexpected HTTP status');
     await page.locator('.expertise-page').waitFor();
     // A direct recruiter link must not be hidden behind the homepage intro screen.
     await page.waitForFunction(()=>!document.documentElement.classList.contains('is-loading'),null,{timeout:12000});
     await page.waitForFunction(()=>document.querySelector('.expertise-hero-image')?.naturalWidth>0,null,{timeout:20000});
     await page.evaluate(async()=>{
      // Force below-the-fold imagery to load before full-page screenshots.
      const images=[...document.querySelectorAll('.expertise-page img')];
      images.forEach(img=>img.loading='eager');
      await Promise.all([document.fonts.ready,...images.map(img=>img.decode?.().catch(()=>{})||Promise.resolve())]);
     });
     const state=await page.evaluate(()=>{
      const main=document.querySelector('.expertise-page');
      const hero=main.querySelector('.expertise-hero-image');
      return {
       h1:main.querySelectorAll('h1').length,
       hasAbout:!!main.querySelector('#xp-about'),
       hasSelected:!!main.querySelector('#xp-work'),
       hasExperience:!!main.querySelector('#xp-experience'),
       hasCTA:!!main.querySelector('#xp-contact'),
       heroLoaded:hero?.complete&&hero.naturalWidth>0,
       documentWidth:document.documentElement.scrollWidth,
       viewportWidth:innerWidth,
       canonical:document.querySelector('link[rel="canonical"]')?.href,
       title:document.title,
       introVisible:getComputedStyle(document.querySelector('#intro-loader')).display!=='none'
      };
     });
     assert.equal(state.h1,1,'Expected exactly one page heading');
     assert(state.hasAbout&&state.hasSelected&&state.hasExperience&&state.hasCTA,'Missing portfolio chapter');
     assert(state.heroLoaded,'Broken hero image');
     // Original project visuals must never be cropped by CSS, including on mobile.
     const imageFits=await page.evaluate(()=>[...document.querySelectorAll(
      '.expertise-page .expertise-hero-image, .expertise-page .xp-showcase-visual img, .expertise-page .xp-preview-card img, .expertise-page .xp-video-trigger img'
     )].map(img=>({source:img.currentSrc||img.src,fit:getComputedStyle(img).objectFit,naturalWidth:img.naturalWidth})));
     assert(imageFits.length>1,'Portfolio project imagery missing');
     assert(imageFits.every(img=>img.fit==='contain'),'Project image would be cropped: '+JSON.stringify(imageFits.filter(img=>img.fit!=='contain')));
     assert(imageFits.every(img=>img.naturalWidth>0),'At least one project image did not load');
     assert(!state.introVisible,'Intro overlay still covers direct portfolio entry');
     assert(state.documentWidth<=state.viewportWidth+3,'Horizontal page overflow: '+JSON.stringify(state));
     assert(state.canonical.endsWith('/expertise/'+slug+'/'),'Wrong canonical URL');
     assert(state.title.includes('Hadi Hassan'),'Missing branded SEO title');
     const question=page.locator('.xp-question').first();
     assert.equal(await page.locator('.xp-question').count(),3,'Missing answer-ready content');
     await question.locator('summary').click();
     assert(await question.evaluate(el=>el.open),'FAQ disclosure failed');
     assert(await question.locator('.xp-question-answer').isVisible(),'FAQ answer is not visible');
     await question.locator('summary').click();
     assert(!(await question.evaluate(el=>el.open)),'FAQ disclosure did not close');
     const heroLabels=await page.evaluate(()=>{
      const back=document.querySelector('.expertise-back')?.getBoundingClientRect();
      const label=document.querySelector('.expertise-hero > div > .expertise-kicker')?.getBoundingClientRect();
      return {backBottom:back?.bottom,labelTop:label?.top};
     });
     assert(heroLabels.backBottom<=heroLabels.labelTop+2,'Hero breadcrumb overlaps the role label: '+JSON.stringify(heroLabels));
     // Interaction assertions scroll to the FAQ; reset to the hero before screenshots.
     await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,0)});
     await page.waitForFunction(()=>scrollY<2,null,{timeout:4000});
     const screen=path.join(artifacts,slug+'-'+device.name+'-'+engine+'.png');
     await page.screenshot({path:screen,fullPage:device.name==='desktop',animations:'disabled'});
     // Interactive chapters remain navigable with reduced motion.
     await page.locator('.xp-sticky-rail a[href="#xp-work"]').click();
     assert.equal(await page.evaluate(()=>location.hash),'#xp-work','Chapter navigation is broken');
     const railPosition=await page.locator('.xp-sticky-rail').evaluate(el=>Math.round(el.getBoundingClientRect().top));
     assert(railPosition>=-3&&railPosition<=6,'Chapter navigation did not stick: top '+railPosition);
     if(slug==='product-development'){
      const buttons=page.locator('[data-xp-filter]');
      assert(await buttons.count()>1,'Product work filters were not rendered');
      await buttons.nth(1).click();
      assert.equal(await buttons.nth(1).getAttribute('aria-pressed'),'true','Filter state did not update');
      assert(await page.locator('.xp-preview-card:not([hidden])').count()>0,'Filtering hid every project');
     }
     if(slug==='video-production'){
      const play=page.locator('[data-xp-play-video]').first();
      assert(await play.count()>0,'No playable production preview');
      await play.click();
      assert(await page.locator('#xp-video-dialog').evaluate(el=>el.open),'Film dialog did not open');
      assert(await page.locator('#xp-video-dialog iframe').count()>0,'Player is missing');
      await page.locator('[data-xp-close-video]').click();
      assert.equal(await page.locator('#xp-video-dialog iframe').count(),0,'Video continued after close');
     }
     console.log('PASS',engine,slug,device.name,state.documentWidth+'/'+state.viewportWidth);
    }catch(error){failures.push(slug+' / '+device.name+': '+error.stack);console.error('FAIL',slug,device.name,error.message)}
    finally{await context.close()}
   }
  }
  fs.writeFileSync(path.join(artifacts,'report.json'),JSON.stringify({routes:slugs,viewports:devices.map(x=>x.name),failures},null,2));
  if(failures.length)throw Error(failures.length+' expertise browser checks failed');
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
}
run().catch(error=>{console.error(error);process.exitCode=1});
