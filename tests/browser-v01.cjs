const fs=require('fs'),path=require('path'),http=require('http');
const {chromium}=require('playwright');
const AxeBuilder=require('@axe-core/playwright').default;
(async()=>{
 const root=path.resolve('out');
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
 const page=await context.newPage();const results=[];
 for(const width of [320,360,375,390,430,768,1024,1280,1440]){
  await page.setViewportSize({width,height:900});await page.goto(base,{waitUntil:'domcontentloaded'});await page.waitForTimeout(500);
  const metrics=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,title:document.title,dockFits:[...document.querySelectorAll('.app-dock a,.app-dock button')].every(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth}),overflow:[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.right>innerWidth+1&&r.right<=document.documentElement.scrollWidth+1}).slice(-15).map(e=>({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right}))}));results.push(metrics);
 }
 await page.locator('.dock-command').click();const menuOpened=await page.locator('#site-menu').evaluate(e=>e.open);await page.keyboard.press('Escape');const menuClosed=await page.locator('#site-menu').evaluate(e=>!e.open);
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
 const report={scope:'Local exported homepage; external requests blocked; reduced motion; no submissions',menuOpened,menuClosed,viewports:results,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>n.target)}))};
 fs.writeFileSync('docs/v01-browser-results.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({viewports:results,axe:report.violations.map(v=>({id:v.id,impact:v.impact,count:v.nodes.length}))}));
 if(results.some(r=>r.scrollWidth>r.width||!r.dockFits)||!menuOpened||!menuClosed||report.violations.length)process.exitCode=1;
 }finally{await browser?.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
