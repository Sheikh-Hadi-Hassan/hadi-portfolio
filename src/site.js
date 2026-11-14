const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduced) {
 document.documentElement.classList.add('js-motion');
 document.querySelectorAll('.split').forEach(el => {
  if (el.children.length) return;
  const text=el.textContent; el.setAttribute('aria-label',text); el.textContent='';
  [...text].forEach((char,i)=>{const span=document.createElement('span');span.className='char';span.style.setProperty('--i',i);span.setAttribute('aria-hidden','true');span.textContent=char===' '?'\u00a0':char;el.append(span)});
 });
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.06});
 document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}
let toastTimer;
function notify(text){const el=document.querySelector('.toast');el.textContent=text;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600)}
document.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(btn.dataset.copy);notify('Email copied')}catch{notify('Email: '+btn.dataset.copy)}}));
(() => {
 const archive=document.querySelector('.archive');if(!archive)return;
 const buttons=[...archive.querySelectorAll('[data-filter]')];
 const tiles=[...archive.querySelectorAll('.archive-tile')];
 const count=archive.querySelector('[data-archive-count]');
 buttons.forEach(btn=>btn.addEventListener('click',()=>{
  buttons.forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn))});
  let visible=0;tiles.forEach(tile=>{tile.hidden=btn.dataset.filter!=='all'&&tile.dataset.category!==btn.dataset.filter;if(!tile.hidden)visible++});
  if(count)count.textContent=String(visible);
 }));
})();
const dialog=document.querySelector('.lightbox');
if(dialog){document.querySelectorAll('[data-full]').forEach(btn=>btn.addEventListener('click',()=>{const img=dialog.querySelector('img');img.src=btn.dataset.full;img.alt=btn.dataset.caption;dialog.querySelector('p').textContent=btn.dataset.caption;dialog.showModal();document.body.style.overflow='hidden'}));dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});dialog.addEventListener('close',()=>document.body.style.overflow='')}

// Foreground subject remains above type. Motion never resizes the photographs.
(() => {
 const scene=document.querySelector('[data-parallax-scene]');if(!scene)return;
 const media=matchMedia('(min-width: 1100px) and (prefers-reduced-motion: no-preference)');
 let pointerX=0,pointerY=0,frame=0,visible=true,current=[0,0,0,0,0,0];
 const layers=[scene.querySelector('[data-depth="background"]'),scene.querySelector('[data-depth="type"]'),scene.querySelector('[data-depth="subject"]')];
 function paint(){frame=0;if(!media.matches||navigator.connection?.saveData||!visible)return;
  const rect=scene.getBoundingClientRect();const scroll=Math.max(0,Math.min(1,-rect.top/rect.height));
  const target=[pointerX*7,scroll*70+pointerY*6,pointerX*-10,scroll*34+pointerY*-5,pointerX*13,scroll*12+pointerY*8];let moving=false;
  target.forEach((v,i)=>{current[i]+=(v-current[i])*.13;if(Math.abs(v-current[i])>.08)moving=true});
  [['bg',layers[0]],['type',layers[1]],['subject',layers[2]]].forEach(([name,layer],i)=>{layer.style.setProperty('--'+name+'-x',current[i*2].toFixed(2)+'px');layer.style.setProperty('--'+name+'-y',current[i*2+1].toFixed(2)+'px')});
  if(moving)frame=requestAnimationFrame(paint);
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(paint)}
 scene.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=scene.getBoundingClientRect();pointerX=((e.clientX-r.left)/r.width-.5)*2;pointerY=((e.clientY-r.top)/r.height-.5)*2;schedule()},{passive:true});
 scene.addEventListener('pointerleave',()=>{pointerX=pointerY=0;schedule()});
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});
 media.addEventListener('change',()=>{if(!media.matches){cancelAnimationFrame(frame);frame=0;layers.forEach(l=>l.removeAttribute('style'));current=[0,0,0,0,0,0]}else schedule()});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)schedule();else{cancelAnimationFrame(frame);frame=0}}).observe(scene);schedule();
})();
// Project previews stay separate from navigation: each has an explicit case-study link.
(()=>{const root=document.querySelector('[data-project-explorer]');if(!root)return;
 const scenes=[...root.querySelectorAll('[data-project-scene]')],thumbs=[...root.querySelectorAll('[data-project-select]')],dock=root.querySelector('[data-project-dock]'),handle=root.querySelector('[data-project-drag]');let current=0,request=0;
 function select(n,announce=false){n=(n+scenes.length)%scenes.length;if(n===current){request++;return}const token=++request;const image=scenes[n].querySelector('img');image.loading='eager';
 const commit=()=>{if(token!==request)return;current=n;scenes.forEach((s,i)=>{const active=i===n;s.classList.toggle('is-active',active);s.setAttribute('aria-hidden',String(!active));s.inert=!active});thumbs.forEach((b,i)=>{b.classList.toggle('is-active',i===n);b.setAttribute('aria-pressed',String(i===n))});root.querySelector('[data-project-position]').textContent=String(n+1).padStart(2,'0');if(announce)root.querySelector('[data-project-status]').textContent=scenes[n].querySelector('h2').textContent;};
 if(image.complete&&image.naturalWidth)commit();else image.decode().then(commit,commit);
 }
 thumbs.forEach((b,i)=>{b.addEventListener('click',()=>select(i,true));b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')select(i)});b.addEventListener('focus',()=>select(i));b.addEventListener('keydown',e=>{const delta={ArrowDown:1,ArrowRight:1,ArrowUp:-1,ArrowLeft:-1}[e.key];if(delta){e.preventDefault();thumbs[(i+delta+thumbs.length)%thumbs.length].focus()}if(e.key==='Home'){e.preventDefault();thumbs[0].focus()}if(e.key==='End'){e.preventDefault();thumbs.at(-1).focus()}})});
 root.querySelectorAll('[data-project-step]').forEach(b=>b.addEventListener('click',()=>{const target=(current+Number(b.dataset.projectStep)+thumbs.length)%thumbs.length;select(target,true);thumbs[target].scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'})}));
 let drag=null;function position(x,y){const r=root.getBoundingClientRect();dock.style.left=Math.max(8,Math.min(r.width-dock.offsetWidth-8,x))+'px';dock.style.top=Math.max(70,Math.min(r.height-dock.offsetHeight-90,y))+'px';dock.style.transform='none'}
 handle.addEventListener('pointerdown',e=>{if(e.button!==0)return;const d=dock.getBoundingClientRect();drag={x:e.clientX-d.left,y:e.clientY-d.top};handle.setPointerCapture(e.pointerId)});
 handle.addEventListener('pointermove',e=>{if(!drag)return;const r=root.getBoundingClientRect();position(e.clientX-r.left-drag.x,e.clientY-r.top-drag.y)});handle.addEventListener('pointerup',()=>drag=null);handle.addEventListener('pointercancel',()=>drag=null);
 handle.addEventListener('keydown',e=>{const delta={ArrowLeft:[-20,0],ArrowRight:[20,0],ArrowUp:[0,-20],ArrowDown:[0,20]}[e.key];if(!delta)return;e.preventDefault();const d=dock.getBoundingClientRect(),r=root.getBoundingClientRect();position(d.left-r.left+delta[0],d.top-r.top+delta[1])});
 addEventListener('resize',()=>{dock.style.left='';dock.style.top='';dock.style.transform=''});
})();

// Single-frame editorial menu: native dialog, direct links, hover previews.
(()=>{const menu=document.querySelector('#site-menu'),toggle=document.querySelector('.menu-toggle');if(!menu||!toggle)return;
let returnTo=null,priorOverflow='',previewRequest=0;const close=()=>menu.close();
let fitFrame=0;function fitMenu(){menu.classList.remove('is-reflow');const content=menu.querySelector('.command-content'),hero=menu.querySelector('.menu-editorial-hero');if(content&&hero&&(content.scrollHeight>content.clientHeight+2||hero.scrollHeight>hero.clientHeight+2))menu.classList.add('is-reflow');}function scheduleFit(){cancelAnimationFrame(fitFrame);fitFrame=requestAnimationFrame(fitMenu);}window.addEventListener('resize',()=>{if(menu.open)scheduleFit()});document.fonts?.ready?.then(()=>{if(menu.open)scheduleFit()});
function openMenu(){if(menu.open)return;returnTo=document.activeElement;priorOverflow=document.body.style.overflow;menu.showModal();toggle.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';menu.querySelector('.menu-major')?.focus({preventScroll:true});scheduleFit();}
toggle.addEventListener('click',openMenu);menu.querySelector('.menu-close').addEventListener('click',close);
menu.addEventListener('close',()=>{toggle.setAttribute('aria-expanded','false');document.body.style.overflow=priorOverflow;returnTo?.focus({preventScroll:true})});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));menu.querySelectorAll('[data-consultation-entry]').forEach(b=>b.addEventListener('click',()=>{close();window.dispatchEvent(new CustomEvent('intellignce:open-consultation',{detail:{booking:b.dataset.consultationEntry==='meeting'}}))}));
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'&&!document.querySelector('#intellignce-support')?.shadowRoot?.querySelector('.panel:not([hidden])')){e.preventDefault();openMenu()}});
const preview=menu.querySelector('.menu-preview'),image=menu.querySelector('[data-menu-preview-image]');
function update(item){if(!image||!item.dataset.menuPreview)return;const id=++previewRequest,img=new Image();preview.classList.add('is-changing');img.onload=()=>{if(id!==previewRequest)return;image.removeAttribute('srcset');image.removeAttribute('sizes');image.src=img.src;menu.querySelector('[data-menu-preview-title]').textContent=item.dataset.menuTitle;menu.querySelector('[data-menu-preview-category]').textContent=item.dataset.menuCategory;preview.classList.remove('is-changing')};img.onerror=()=>{if(id===previewRequest)preview.classList.remove('is-changing')};img.src=item.dataset.menuPreview;}
menu.querySelectorAll('[data-menu-preview]').forEach(a=>{a.addEventListener('pointerenter',()=>update(a));a.addEventListener('focus',()=>update(a))});
})();
// Preserve a native pointer fallback; the supporting ring never intercepts a click.
(()=>{const media=matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');let cursor=null,frame=0,lastX=0,lastY=0;
 function move(e){if(!media.matches||e.pointerType==='touch')return;if(!cursor){cursor=document.createElement('div');cursor.className='hadi-cursor';cursor.setAttribute('aria-hidden','true');cursor.append(document.createElement('span'));document.body.append(cursor)}lastX=e.clientX;lastY=e.clientY;cursor.classList.add('is-visible');const target=e.target.closest?.('a,button,[data-full]');cursor.classList.toggle('is-active',!!target);cursor.querySelector('span').textContent=target?.hasAttribute('data-full')?'View':'';cursor.classList.toggle('has-label',!!target?.hasAttribute('data-full'));if(!frame)frame=requestAnimationFrame(()=>{cursor.style.transform=`translate3d(${lastX}px,${lastY}px,0)`;frame=0})}
 document.addEventListener('pointermove',move,{passive:true});document.documentElement.addEventListener('pointerleave',()=>cursor?.classList.remove('is-visible'));addEventListener('blur',()=>cursor?.classList.remove('is-visible'));media.addEventListener('change',()=>{cursor?.classList.remove('is-visible');cancelAnimationFrame(frame);frame=0});
})();

// Shared dock adapts to the current lazy-loaded assistant without changing its booking contracts.
(()=>{const launch=document.querySelector('[data-sera-launch]');if(!launch)return;let queued=null,fallback=null,ready=false;
function request(detail={}){window.dispatchEvent(new CustomEvent('intellignce:open-consultation',{detail}))}
launch.setAttribute('aria-expanded','false');launch.addEventListener('click',()=>request());
window.addEventListener('intellignce:open-consultation',event=>{if(ready)return;queued=event.detail||{};if(!fallback){fallback=document.createElement('dialog');fallback.className='consultation-start';fallback.setAttribute('aria-labelledby','consultation-loading-title');fallback.innerHTML='<button type="button" aria-label="Close">×</button><h2 id="consultation-loading-title">Opening Sera…</h2><p>You can also continue directly with Hadi.</p><a href="mailto:hadi@intellignce.net">Email Hadi</a><a href="https://wa.me/923084542868" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>';document.body.append(fallback);fallback.querySelector('button').onclick=()=>fallback.close();fallback.addEventListener('close',()=>{if(!ready)queued=null})}if(!fallback.open)fallback.showModal()});
function connect(){const host=document.querySelector('#intellignce-support'),panel=host?.shadowRoot?.querySelector('.panel'),bubble=host?.shadowRoot?.querySelector('.launcher');if(!panel||!bubble)return false;ready=true;bubble.style.display='none';const sync=()=>launch.setAttribute('aria-expanded',String(!panel.hidden));new MutationObserver(sync).observe(panel,{attributes:true,attributeFilter:['hidden']});sync();if(queued){const detail=queued;queued=null;fallback?.close();launch.focus({preventScroll:true});request(detail)}return true}
const observer=new MutationObserver(()=>{if(connect())observer.disconnect()});observer.observe(document.body,{childList:true,subtree:true});connect();
})();


// Progressive enhancement for role-specific portfolio chapters.
// No extra packages, animation libraries, or dependency on the unfinished Sera assistant.
(()=> {
 const root=document.querySelector('.expertise-page');
 if(!root)return;
 const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const progress=root.querySelector('.xp-scroll-progress span');
 const rail=root.querySelector('.xp-sticky-rail');
 const links=rail?[...rail.querySelectorAll('a[href^="#"]')]:[];
 const chapters=links.map(link=>({link,element:root.querySelector(link.getAttribute('href'))})).filter(item=>item.element);
 let frame=0;
 function updateScroll(){
  frame=0;
  const rect=root.getBoundingClientRect();
  const travel=Math.max(1,root.scrollHeight-innerHeight);
  const completed=Math.min(1,Math.max(0,-rect.top/travel));
  if(progress)progress.style.transform='scaleX('+completed.toFixed(4)+')';
  const offset=innerHeight*.26;
  let active=chapters[0];
  for(const item of chapters){if(item.element.getBoundingClientRect().top<=offset)active=item}
  for(const item of chapters){
   const selected=item===active;
   item.link.classList.toggle('is-current',selected);
   if(selected)item.link.setAttribute('aria-current','location');
   else item.link.removeAttribute('aria-current');
  }
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(updateScroll)}
 document.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 updateScroll();
 // Native links remain usable even without JS.
 if(rail){
  rail.addEventListener('click',event=>{
   const anchor=event.target.closest('a[href^="#"]');
   if(!anchor)return;
   const target=root.querySelector(anchor.getAttribute('href'));
   if(!target)return;
   if(!prefersReduced.matches){
    event.preventDefault();
    target.scrollIntoView({behavior:'smooth',block:'start'});
    history.replaceState(null,'',anchor.getAttribute('href'));
   }
  });
 }
 const filterButtons=[...root.querySelectorAll('[data-xp-filter]')];
 const cards=[...root.querySelectorAll('.xp-preview-card[data-xp-category]')];
 filterButtons.forEach(button=>button.addEventListener('click',()=>{
  const selected=button.getAttribute('data-xp-filter');
  for(const item of filterButtons){
   const current=item===button;
   item.classList.toggle('is-active',current);
   item.setAttribute('aria-pressed',String(current));
  }
  cards.forEach(card=>{card.hidden=selected!=='all'&&card.getAttribute('data-xp-category')!==selected});
 }));
 // Only enhance when an IntersectionObserver is available, avoiding invisible content on unsupported browsers.
 if(!prefersReduced.matches&&'IntersectionObserver' in window){
  const items=[...root.querySelectorAll('[data-xp-reveal]')];
  const io=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(!entry.isIntersecting)return;
    entry.target.classList.add('xp-visible');
    io.unobserve(entry.target);
   }
  },{rootMargin:'0px 0px -35px 0px',threshold:.04});
  items.forEach(item=>{
   item.classList.add('xp-enhance');
   io.observe(item);
  });
 }
})();


// Click-to-load film previews. No third-party player is downloaded until the visitor opts in.
(()=>{
 const dialog=document.querySelector('#xp-video-dialog');
 if(!dialog)return;
 const slot=dialog.querySelector('[data-xp-video-slot]');
 const title=dialog.querySelector('#xp-video-dialog-title');
 const close=dialog.querySelector('[data-xp-close-video]');
 let opener=null;
 const allowedHosts=new Set(['www.youtube.com','youtube.com','www.youtube-nocookie.com','player.vimeo.com','www-ccv.adobe.io']);
 function stop(){slot.replaceChildren();opener?.focus({preventScroll:true})}
 function closeDialog(){slot.replaceChildren();if(dialog.open)dialog.close();else stop()}
 dialog.addEventListener('close',stop);
 dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog()});
 close.addEventListener('click',closeDialog);
 document.querySelectorAll('[data-xp-play-video]').forEach(button=>button.addEventListener('click',()=>{
  opener=button;
  const value=button.getAttribute('data-xp-play-video')||'';
  const external=button.getAttribute('data-xp-video-external')||'';
  let url;
  try{url=new URL(value)}catch{url=null}
  if(!url||url.protocol!=='https:'||!allowedHosts.has(url.hostname)){
   if(/^https:\/\//.test(external))window.open(external,'_blank','noopener,noreferrer');
   return;
  }
  const frame=document.createElement('iframe');
  frame.src=url.href;
  frame.title=(button.getAttribute('data-xp-video-title')||'Project film')+' player';
  frame.loading='lazy';
  frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  frame.allowFullscreen=true;
  frame.referrerPolicy='strict-origin-when-cross-origin';
  title.textContent=button.getAttribute('data-xp-video-title')||'Film preview';
  slot.replaceChildren(frame);
  if(typeof dialog.showModal==='function'){dialog.showModal();close.focus()}
  else window.open(external,'_blank','noopener,noreferrer');
 }));
})();
