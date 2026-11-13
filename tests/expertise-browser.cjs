/**
 * Standalone desktop/tablet/mobile visual and behavioral QA for expertise portfolios.
 * Run after npm run build: node tests/expertise-browser.cjs
 */
const {chromium}=require('playwright');
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
  browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
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
     await page.evaluate(()=>document.fonts.ready);
     await page.waitForTimeout(500);
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
       title:document.title
      };
     });
     assert.equal(state.h1,1,'Expected exactly one page heading');
     assert(state.hasAbout&&state.hasSelected&&state.hasExperience&&state.hasCTA,'Missing portfolio chapter');
     assert(state.heroLoaded,'Broken hero image');
     assert(state.documentWidth<=state.viewportWidth+3,'Horizontal page overflow: '+JSON.stringify(state));
     assert(state.canonical.endsWith('/expertise/'+slug+'/'),'Wrong canonical URL');
     assert(state.title.includes('Hadi Hassan'),'Missing branded SEO title');
     const screen=path.join(artifacts,slug+'-'+device.name+'.png');
     await page.screenshot({path:screen,fullPage:device.name==='desktop',animations:'disabled'});
     // Interactive chapters remain navigable with reduced motion.
     await page.locator('.xp-sticky-rail a[href="#xp-work"]').click();
     assert.equal(await page.evaluate(()=>location.hash),'#xp-work','Chapter navigation is broken');
     if(slug==='product-development'){
      const buttons=page.locator('[data-xp-filter]');
      if(await buttons.count()>1){
       await buttons.nth(1).click();
       assert.equal(await buttons.nth(1).getAttribute('aria-pressed'),'true','Filter state did not update');
      }
     }
     console.log('PASS',slug,device.name,state.documentWidth+'/'+state.viewportWidth);
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
