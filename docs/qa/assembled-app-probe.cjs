const fs=require('fs'),path=require('path'),http=require('http');
const root='/workspace/scratch/f1b54e9ce3cf/portfolio-v1-clean';
const {createRequire}=require('module'),req=createRequire(root+'/package.json');
const {chromium}=req('playwright');
const output=__dirname;
(async()=>{
 const php=[],external=[],errors=[],consoleErrors=[],httpErrors=[];
 const server=http.createServer((request,response)=>{
  let p;try{p=decodeURIComponent(new URL(request.url,'http://localhost').pathname)}catch{response.writeHead(400).end();return}
  if(p.endsWith('.php')){php.push({method:request.method,path:p});response.writeHead(503,{'Content-Type':'application/json'}).end(JSON.stringify({ok:false,code:'LOCAL_PHP_NOT_EXECUTED'}));return}
  let f=path.resolve(root+'/out','.'+p);if(f!==root+'/out'&&!f.startsWith(root+'/out/')){response.writeHead(403).end();return}
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!fs.existsSync(f)){response.writeHead(404).end();return}
  response.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.ttf':'font/ttf','.mp4':'video/mp4'})[path.extname(f)]||'application/octet-stream');fs.createReadStream(f).pipe(response);
 });await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+server.address().port;let browser;
 try{
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  await context.route('**/*',route=>{if(new URL(route.request().url()).origin===base)return route.continue();external.push({method:route.request().method(),origin:new URL(route.request().url()).origin});return route.abort()});
  const page=await context.newPage();page.on('response',r=>{if(r.status()>=400)httpErrors.push({status:r.status(),path:new URL(r.url()).pathname})});page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
  await page.goto(base+'/',{waitUntil:'load'});
  await page.waitForFunction(()=>!document.documentElement.classList.contains('is-loading')&&!document.getElementById('site-content').inert,{timeout:15000});
  await page.waitForFunction(()=>document.querySelector('#intellignce-support')?.shadowRoot?.querySelector('.panel'),{timeout:15000});
  const initial=await page.evaluate(()=>({loaderReleased:!document.documentElement.classList.contains('is-loading'),contentInteractive:!document.getElementById('site-content').inert,nextScripts:[...document.scripts].filter(s=>s.src.includes('/_next/')).length,reelInitialized:document.querySelector('.bf-reel')?.classList.contains('is-scroll-driven'),seraMounted:!!document.querySelector('#intellignce-support')?.shadowRoot}));
  await page.locator('.hero-project-actions a').first().click();
  await page.locator('#intellignce-support .panel').waitFor({state:'visible',timeout:10000});
  const sera=await page.locator('#intellignce-support').evaluate(e=>{const s=e.shadowRoot;return {dialogOpen:!s.querySelector('.panel').hidden,text:s.querySelector('.panel').innerText.slice(0,2400),consentControls:[...s.querySelectorAll('button')].map(b=>b.textContent.trim()).filter(t=>/AI|consent|permission/i.test(t))}});
  await page.screenshot({path:output+'/assembled-sera.png'});
  await page.locator('#intellignce-support .close').click();
  await page.goto(base+'/about/',{waitUntil:'load'});const about={status:page.url().endsWith('/about/'),title:await page.title()};
  await page.goBack({waitUntil:'load'});const back=new URL(page.url()).pathname==='/';
  const result={scope:'real_guarded_export_local_assembled_browser_probe',origin:base,initial,sera,about,historyRestored:back,pageErrors:errors,consoleErrors,httpErrors,phpNotExecuted:php,blockedExternal:external,productionAcceptance:false};
  fs.writeFileSync(output+'/assembled-probe.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }finally{await browser?.close();await new Promise(r=>server.close(r))}
})().catch(e=>{fs.writeFileSync(outputError=__dirname+'/assembled-probe-error.txt',String(e.stack));console.error(e.message);process.exitCode=1});
