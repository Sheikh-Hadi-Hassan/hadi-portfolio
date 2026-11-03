const fs=require('fs'),path=require('path'),http=require('http');
const {chromium}=require('playwright');
const AxeBuilder=require('@axe-core/playwright').default;
(async()=>{
 const integrity=require('child_process').spawnSync('python3',['scripts/verify-hero-lock.py'],{encoding:'utf8'});
 if(integrity.status!==0)throw Error('BLOCKED: approved hero integrity verification must pass before export acceptance.');
 const root=path.resolve('out');
 if(!fs.existsSync(path.join(root,'index.html')))throw Error('BLOCKED: build the approved export first');
 const server=http.createServer((req,res)=>{
  let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return}
  let file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return}
  if(/\.php$/.test(file)){res.writeHead(503).end();return}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)){res.writeHead(404).end();return}
  const ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2'})[ext]||'application/octet-stream');fs.createReadStream(file).pipe(res);
 });await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;
 try{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
 const context=await browser.newContext({reducedMotion:'reduce'});const base=`http://127.0.0.1:${server.address().port}`;
 await context.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort());
 const page=await context.newPage();const results=[];let consoleErrors=[];page.on('pageerror',e=>consoleErrors.push(String(e)));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
 const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()&&!e.name.startsWith('_')?walk(path.join(d,e.name)):e.isFile()&&e.name==='index.html'?[path.join(d,e.name)]:[]);
 const routes=walk(root).map(f=>'/'+path.relative(root,path.dirname(f)).split(path.sep).filter(Boolean).join('/')+'/').map(x=>x==='//'?'/':x);
 const expected=['/','/archive/',...JSON.parse(fs.readFileSync('src/data/projects.json','utf8')).map(p=>'/'+p.slug+'/'),...['about','resume','contact','privacy','work'].map(p=>'/'+p+'/')];
 if(routes.length!==22||new Set(routes).size!==22||expected.some(r=>!routes.includes(r)))throw Error('Export route inventory differs from the 22-route acceptance scope');
 for(const route of routes)for(const width of [320,360,375,390,430,768,1024,1280,1440]){
  consoleErrors=[];await page.setViewportSize({width,height:900});const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});if(response.status()!==200)throw Error(route+' HTTP '+response.status());await page.waitForTimeout(500);
  const metrics=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,title:document.title,dockFits:[...document.querySelectorAll('.app-dock a,.app-dock button')].every(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth}),overflow:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>innerWidth+1&&r.right<=document.documentElement.scrollWidth+1}).slice(-15).map(e=>({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right}))}));const axeResult=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();await page.locator('.dock-command').click();metrics.menuOpened=await page.locator('#site-menu').evaluate(e=>e.open);await page.keyboard.press('Tab');metrics.focusInsideMenu=await page.evaluate(()=>document.querySelector('#site-menu').contains(document.activeElement));await page.keyboard.press('Escape');metrics.menuClosed=await page.locator('#site-menu').evaluate(e=>!e.open);metrics.focusRestored=await page.locator('.dock-command').evaluate(e=>document.activeElement===e);metrics.consoleErrors=[...consoleErrors];metrics.route=route;metrics.violations=axeResult.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)}));results.push(metrics);
 }
 await page.locator('.dock-command').click();const menuOpened=await page.locator('#site-menu').evaluate(e=>e.open);await page.keyboard.press('Escape');const menuClosed=await page.locator('#site-menu').evaluate(e=>!e.open);
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
 const report={scope:'All exported content routes at nine widths; external requests blocked; reduced motion; no submissions',menuOpened,menuClosed,viewports:results,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>n.target)}))};
 fs.writeFileSync('docs/v01-all-route-browser-results.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({viewports:results,axe:report.violations.map(v=>({id:v.id,impact:v.impact,count:v.nodes.length}))}));
 if(results.some(r=>r.scrollWidth>r.width||!r.dockFits||r.violations.length||r.h1!==1||r.consoleErrors.length||!r.menuOpened||!r.menuClosed||!r.focusInsideMenu||!r.focusRestored)||!menuOpened||!menuClosed||report.violations.length)process.exitCode=1;
 }finally{await browser?.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
