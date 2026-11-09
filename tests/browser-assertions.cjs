async function waitForApplication(page,url){
 await page.waitForURL(url,{waitUntil:'load',timeout:30000});
 await page.locator('#site-content').waitFor();
 await page.waitForFunction(()=>{const c=document.getElementById('site-content');return c&&!c.inert&&!document.documentElement.classList.contains('is-loading')});
}
function brokenImages(){return [...document.images].filter(i=>{
 // Only a source-less image inside a CLOSED dialog is an intentional slot.
 const idle=!i.getAttribute('src')&&!i.getAttribute('srcset')&&i.closest('dialog')&&!i.closest('dialog').open&&!i.checkVisibility();
 return !idle&&(!i.complete||i.naturalWidth===0);
}).map(i=>i.getAttribute('src'));}
function optionalConfigConsole(error,diagnostic,{allowUnconfigured=false}={}){
 if(diagnostic?.status==='builtin'&&!allowUnconfigured)return false;
 if(error.code!=='CONSOLE_ERROR'||!error.source||!diagnostic||!['builtin','approved','fallback'].includes(diagnostic.status))return false;
 const url=new URL(error.source,'http://local');
 const attempt=diagnostic.attempts.find(a=>url.pathname==='/intellignce-support/'+a.file);
 return !!attempt&&attempt.code==='PUBLIC_CONFIG_NOT_FOUND'&&/\b404\b/.test(error.message);
}
async function historyRoundTrip(page,base,route){
 const started=Date.now();await waitForApplication(page,base+route);const title=await page.title(),other=route==='/'?'/about/':'/';
 if(route==='/'){await page.locator('.dock-command').click();await page.locator('#site-menu a[href="/about/"]').click();}else await page.locator('.dock-home').click();
 await waitForApplication(page,base+other);
 await page.goBack({waitUntil:'load',timeout:30000});await waitForApplication(page,base+route);
 const back=page.url()===base+route&&(await page.title())===title;
 await page.goForward({waitUntil:'load',timeout:30000});await waitForApplication(page,base+other);const forward=page.url()===base+other;
 await page.goBack({waitUntil:'load',timeout:30000});await waitForApplication(page,base+route);
 return {historyRestored:back&&page.url()===base+route&&(await page.title())===title,forwardRestored:forward,historyRoundTripMs:Date.now()-started};
}
module.exports={waitForApplication,brokenImages,optionalConfigConsole,historyRoundTrip};
