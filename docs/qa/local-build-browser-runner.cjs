const fs=require('fs'),path=require('path'),http=require('http');
const {spawnSync}=require('child_process');
const {plan,verifyRoutes,report}=require(path.resolve('scripts/qa/browser-plan.cjs'));
const cases=plan(JSON.parse(fs.readFileSync('src/data/projects.json','utf8'))),results=[];
const evidence='docs/v01-production-build-browser-results.json';
let blockedReason=null;
const save=reason=>{blockedReason=reason;fs.writeFileSync(evidence,JSON.stringify(report(cases,results,reason),null,2)+'\n')};
(async()=>{
 const integrity=spawnSync('python3',['scripts/verify-hero-lock.py'],{encoding:'utf8'});
 if(integrity.status!==0){save('APPROVED_HERO_REQUIRED');throw Error('BLOCKED: approved hero integrity verification required');}
 const receipt=spawnSync('python3',['scripts/qa/acceptance-build.py','--verify'],{encoding:'utf8'});
 if(receipt.status!==0){save('CURRENT_APPROVED_BUILD_RECEIPT_REQUIRED');throw Error('BLOCKED: run python3 scripts/qa/acceptance-build.py after approval');}
 const root=path.resolve('out');// The approved Next export also contains its generated /404/ fallback.
 const routeFiles=[];const visit=(dir)=>{for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(e.isDirectory()&&!e.name.startsWith('_'))visit(path.join(dir,e.name));else if(e.isFile()&&e.name==='index.html')routeFiles.push(path.join(dir,e.name));}};visit(root);
 const actualRoutes=routeFiles.map(f=>'/'+path.relative(root,path.dirname(f)).split(path.sep).filter(Boolean).join('/')+'/').map(r=>r==='//'?'/' : r).filter(r=>r!=='/404/').sort();
 const plannedRoutes=[...new Set(cases.map(c=>c.route))].sort();
 if(JSON.stringify(actualRoutes)!==JSON.stringify(plannedRoutes))throw Error('ACCEPTANCE_EXPORT_ROUTE_MISMATCH');
 const {chromium}=require('playwright'),AxeBuilder=require('@axe-core/playwright').default;
 const server=http.createServer((req,res)=>{
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return}
  let file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return}
  if(/\.php$/.test(file)||pathname.includes('.v01-acceptance-build')){res.writeHead(503).end();return}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return}
  res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.pdf':'application/pdf','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
 });await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;
 try{
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
  const base=`http://127.0.0.1:${server.address().port}`;
  for(const item of cases){
   let context;const result={...item,status:'FAIL',errors:[]};
   try{
    context=await browser.newContext({reducedMotion:'reduce',viewport:{width:item.width,height:900}});
    await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
    const page=await context.newPage();page.setDefaultTimeout(10000);
    page.on('pageerror',e=>result.errors.push({code:'PAGE_ERROR',message:String(e).slice(0,500)}));page.on('console',m=>{if(m.type()==='error')result.errors.push({code:'CONSOLE_ERROR',message:m.text().slice(0,500)})});
    const response=await page.goto(base+item.route,{waitUntil:'domcontentloaded',timeout:30000});
    if(response?.status()!==200)throw Error('ROUTE_HTTP_ERROR');
    await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('FONT_LOAD_TIMEOUT')),10000))]));await page.waitForTimeout(500);
    // Force lazy images through view without interacting with submission controls.
    await page.locator('img').evaluateAll(images=>Promise.race([Promise.all(images.map(async image=>{image.loading='eager';try{await image.decode()}catch{}})),new Promise((_,reject)=>setTimeout(()=>reject(Error('IMAGE_LOAD_TIMEOUT')),10000))]));
    result.metrics=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,title:document.title,dockFits:[...document.querySelectorAll('.app-dock a,.app-dock button')].every(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth}),brokenImages:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.getAttribute('src'))}));
    for(const href of await page.locator('a[href]').evaluateAll(a=>a.map(e=>e.getAttribute('href')))){
     if(!href||/^(mailto:|tel:|https?:\/\/|\/\/)/i.test(href)&&new URL(href,base).origin!==base)continue;
     if(/^(javascript:|data:)/i.test(href)){result.errors.push({code:'UNSAFE_LINK'});continue;}
     const target=new URL(href,base+item.route);if(target.origin!==base)continue;
     if(target.pathname.endsWith('.php'))continue;
     let file=path.resolve(root,'.'+decodeURIComponent(target.pathname));if(!file.startsWith(root+path.sep)&&file!==root)throw Error('LINK_PATH_INVALID');
     if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
     if(!fs.existsSync(file))result.errors.push({code:'INTERNAL_LINK_MISSING',path:target.pathname});
     if(target.hash&&target.pathname===item.route){const exists=await page.evaluate(id=>!!document.getElementById(id),decodeURIComponent(target.hash.slice(1)));if(!exists)result.errors.push({code:'FRAGMENT_MISSING',hash:target.hash});}
    }
    await page.locator('.dock-command').click();result.menuOpened=await page.locator('#site-menu').evaluate(e=>e.open);await page.keyboard.press('Tab');result.focusInside=await page.evaluate(()=>document.querySelector('#site-menu').contains(document.activeElement));await page.keyboard.press('Escape');result.menuClosed=await page.locator('#site-menu').evaluate(e=>!e.open);result.focusRestored=await page.locator('.dock-command').evaluate(e=>document.activeElement===e);
    // An actual internal navigation and history round trip, with no form submission.
    await page.goto(base+(item.route==='/'?'/work/':'/'),{waitUntil:'domcontentloaded'});await page.goBack({waitUntil:'domcontentloaded'});result.historyRestored=new URL(page.url()).pathname===item.route;
    const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();result.violations=axe.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)}));
    const screenshot=`docs/browser-evidence/${item.route==='/'?'home':item.route.replaceAll('/','')}-${item.width}.png`;fs.mkdirSync(path.dirname(screenshot),{recursive:true});await page.screenshot({path:screenshot,fullPage:true});result.screenshot=screenshot;
    const m=result.metrics;if(m.scrollWidth<=item.width&&m.h1===1&&m.title&&m.dockFits&&!m.brokenImages.length&&!result.errors.length&&!result.violations.length&&result.menuOpened&&result.focusInside&&result.menuClosed&&result.focusRestored&&result.historyRestored)result.status='PASS';
   }catch(e){result.errors.push({code:'CASE_FAILED',message:String(e).slice(0,500)});}finally{await context?.close();results.push(result);save(null);}
  }
  const summary=report(cases,results);console.log(JSON.stringify({executed:summary.executed,passed:summary.passed,failed:summary.failed,blocked:summary.blocked}));if(summary.failed)process.exitCode=1;
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{save(blockedReason||(results.length<cases.length?'RUN_BLOCKED_OR_INTERRUPTED':null));console.error(e.message);process.exitCode=1});
