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


// Multi-project carousel: manual scroll, 3-second autoplay, hover pause.
// Only published collections with all original screenshots installed are rendered.
(()=>{
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('[data-phone-stack]').forEach(root=>{
  const deck=root.querySelector('.xp-phone-deck');
  const cards=Array.from(root.querySelectorAll('[data-phone-slide]'));
  const tabs=Array.from(root.querySelectorAll('[data-phone-project-tab]'));
  if(!deck||!cards.length||!tabs.length)return;
  const projects=tabs.map(tab=>tab.dataset.phoneProjectTab);
  const sequences=projects.map(id=>cards.map((card,i)=>card.dataset.phoneProject===id?i:-1).filter(i=>i>=0));
  const count=root.querySelector('[data-phone-count-text]');
  const caption=root.querySelector('[data-phone-title]');
  const collectionLabel=root.querySelector('[data-phone-collection]');
  const dots=Array.from(root.querySelectorAll('[data-phone-dot]'));
  const previous=root.querySelector('[data-phone-prev]');
  const next=root.querySelector('[data-phone-next]');
  const device=document.createElement('div');
  device.className='xp-gallery-device';
  device.setAttribute('aria-hidden','true');
  device.innerHTML='<div class="xp-gallery-viewport"><div class="xp-screen-layer is-current"><img alt=""></div><div class="xp-screen-layer"><img alt=""></div></div><div class="xp-gallery-frame" aria-hidden="true"></div>';
  deck.appendChild(device);
  const viewport=device.querySelector('.xp-gallery-viewport');
  const screenLayers=Array.from(device.querySelectorAll('.xp-screen-layer'));
  const screenImages=screenLayers.map(layer=>layer.querySelector('img'));
  const WIPE_DURATION=680;
  let activeAsset='',activeLayer=0,screenBusy=false,pendingScreen=null,wipeTimer=null;
  function measureScreenOverflow(){
   const img=screenImages[activeLayer];
   if(!img.naturalWidth||!img.naturalHeight||!viewport.clientWidth)return;
   const renderedHeight=img.naturalHeight*viewport.clientWidth/img.naturalWidth;
   const overflow=device.dataset.mode==='web'?0:Math.max(0,renderedHeight-viewport.clientHeight);
   device.style.setProperty('--screen-overflow',overflow+'px');
   device.style.setProperty('--screen-scroll-duration',Math.min(14,Math.max(2.5,overflow/75))+'s');
  }
  screenImages.forEach(img=>img.addEventListener('load',()=>{
   if(img===screenImages[activeLayer])measureScreenOverflow();
  }));
  device.addEventListener('pointerenter',measureScreenOverflow);
  // Keep two real screenshots during the transition, rather than changing one
  // image source beneath a single black pixel overlay.
  function showScreen(src,mode){
   if(!src)return;
   if(screenBusy){pendingScreen={src,mode};return}
   if(src===activeAsset)return;
   const outgoing=screenLayers[activeLayer];
   const incomingLayer=screenLayers[1-activeLayer];
   const incomingImage=screenImages[1-activeLayer];
   if(!activeAsset||reduced.matches){
    clearTimeout(wipeTimer);
    outgoing.className='xp-screen-layer';
    incomingLayer.className='xp-screen-layer is-current';
    incomingImage.src=src;
    activeLayer=1-activeLayer;activeAsset=src;
    device.dataset.mode=mode;
    device.classList.remove('is-wiping');
    device.style.setProperty('--screen-overflow','0px');
    if(incomingImage.complete)measureScreenOverflow();
    return;
   }
   screenBusy=true;
   incomingLayer.className='xp-screen-layer';
   incomingImage.src=src;
   function finish(){
    if(!screenBusy)return;
    clearTimeout(wipeTimer);wipeTimer=null;
    outgoing.className='xp-screen-layer';
    incomingLayer.className='xp-screen-layer is-current';
    activeLayer=1-activeLayer;activeAsset=src;screenBusy=false;
    device.classList.remove('is-wiping');
    measureScreenOverflow();
    if(pendingScreen){
     const next=pendingScreen;pendingScreen=null;
     if(next.src!==activeAsset)showScreen(next.src,next.mode);
    }
   }
   function begin(){
    if(!screenBusy)return;
    if(!incomingImage.naturalWidth){
     screenBusy=false;incomingLayer.className='xp-screen-layer';
     if(pendingScreen){const next=pendingScreen;pendingScreen=null;showScreen(next.src,next.mode)}
     return;
    }
    device.dataset.mode=mode;
    device.classList.add('is-wiping');
    // Force a new animation even when the user switches slides in quick succession.
    void incomingLayer.offsetWidth;
    outgoing.classList.add('is-leaving');
    incomingLayer.classList.add('is-entering');
    wipeTimer=setTimeout(finish,WIPE_DURATION+45);
   }
   if(typeof incomingImage.decode==='function')incomingImage.decode().then(begin,begin);
   else if(incomingImage.complete)begin();
   else{
    incomingImage.addEventListener('load',begin,{once:true});
    incomingImage.addEventListener('error',begin,{once:true});
   }
  }
  let projectIndex=0,screenIndex=0,hover=false,visible=true,timer=null;
  let gesture=null,suppressClick=false,wheelAccum=0,wheelTime=0,lastWheelAdvance=0;
  const wrap=(index,total)=>((index%total)+total)%total;
  const stop=()=>{if(timer!==null){clearInterval(timer);timer=null}};
  function start(){
   stop();
   if(!hover&&visible&&!document.hidden&&!reduced.matches){
    timer=setInterval(()=>advance(1,false),3000);
   }
  }
  function signedDistance(index,active,total){
   let d=index-active;
   if(d>total/2)d-=total;
   if(d< -total/2)d+=total;
   return d;
  }
  function render(){
   const sequence=sequences[projectIndex];
   const total=sequence.length;
   if(!total)return;
   const selected=sequence[screenIndex];
   const width=deck.clientWidth;
   const compact=width<680;
   const step=compact?Math.max(66,width*.215):Math.min(200,Math.max(96,width*.145));
   const depthLimit=compact?1:3;
   const selectedMode=cards[selected].dataset.phoneMode||'phone';
   root.dataset.phoneMode=selectedMode;
   device.dataset.mode=selectedMode;
   const activeImage=cards[selected].querySelector('img');
   const incoming=activeImage?.getAttribute('src')||'';
   showScreen(incoming,selectedMode);

   cards.forEach((card,index)=>{
    const local=sequence.indexOf(index);
    const diff=local>=0?signedDistance(local,screenIndex,total):999;
    const depth=Math.abs(diff);
    const active=index===selected;
    const show=local>=0&&depth<=depthLimit&&!active;
    card.style.transform='translate3d(calc(-50% + '+diff*step+'px),calc(-50% + '+(depth*3)+'px),0) scale('+Math.max(.78,1-depth*.065)+')';
    card.style.zIndex=String(100-depth*10);
    card.style.opacity=show?'1':'0';
    card.style.visibility=show?'visible':'hidden';
    card.style.pointerEvents=show?'auto':'none';
    card.classList.toggle('is-center',false);
    card.classList.toggle('is-side-panel',!active);
    card.setAttribute('aria-hidden',String(!active));
    card.tabIndex=show?0:-1;
    card.dataset.stackDepth=String(depth);
    card.dataset.stackSide=active?'center':diff<0?'left':'right';
   });
   if(count)count.textContent=String(screenIndex+1).padStart(2,'0')+' / '+String(total).padStart(2,'0');
   if(caption)caption.textContent=(cards[selected].getAttribute('aria-label')||'Screen').replace(/ screen \d+ of \d+$/,'');
   if(collectionLabel)collectionLabel.textContent=tabs[projectIndex].textContent.trim();
   tabs.forEach((tab,index)=>{const active=index===projectIndex;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1});
   dots.forEach((dot,index)=>{dot.hidden=index>=total;dot.setAttribute('aria-current',String(index===screenIndex))});
  }
  function advance(direction,manual=true){
   const nextIndex=screenIndex+direction;
   if(nextIndex>=sequences[projectIndex].length){
    projectIndex=wrap(projectIndex+1,projects.length);screenIndex=0;
   }else if(nextIndex<0){
    projectIndex=wrap(projectIndex-1,projects.length);
    screenIndex=sequences[projectIndex].length-1;
   }else screenIndex=nextIndex;
   render();
   if(manual)start();
  }
  tabs.forEach((tab,index)=>tab.addEventListener('click',()=>{
   projectIndex=index;screenIndex=0;render();start();
  }));
  previous?.addEventListener('click',()=>advance(-1));
  next?.addEventListener('click',()=>advance(1));
  dots.forEach(dot=>dot.addEventListener('click',()=>{
   const index=Number(dot.dataset.phoneDot);
   if(index<sequences[projectIndex].length){screenIndex=index;render();start()}
  }));
  deck.addEventListener('click',event=>{
   if(suppressClick){suppressClick=false;return}
   const card=event.target.closest('[data-phone-slide]');
   if(!card)return;
   const index=sequences[projectIndex].indexOf(cards.indexOf(card));
   if(index>=0){screenIndex=index;render();start()}
  });
  deck.addEventListener('pointerdown',event=>{
   if(event.pointerType==='mouse'&&event.button!==0)return;
   gesture={id:event.pointerId,x:event.clientX,y:event.clientY,horizontal:false};
  });
  deck.addEventListener('pointermove',event=>{
   if(!gesture||event.pointerId!==gesture.id)return;
   const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
   if(Math.abs(dy)>Math.abs(dx)*1.3&&Math.abs(dy)>12){gesture=null;return}
   if(Math.abs(dx)>12){gesture.horizontal=true;deck.classList.add('is-dragging')}
  });
  deck.addEventListener('pointerup',event=>{
   if(!gesture||event.pointerId!==gesture.id)return;
   const dx=event.clientX-gesture.x;
   if(gesture.horizontal&&Math.abs(dx)>35){advance(dx<0?1:-1);suppressClick=true}
   gesture=null;deck.classList.remove('is-dragging');
  });
  deck.addEventListener('pointercancel',()=>{gesture=null;deck.classList.remove('is-dragging')});
  root.addEventListener('keydown',event=>{
   if(event.key==='ArrowRight'){event.preventDefault();advance(1)}
   else if(event.key==='ArrowLeft'){event.preventDefault();advance(-1)}
   else if(event.key==='Home'){event.preventDefault();screenIndex=0;render();start()}
   else if(event.key==='End'){event.preventDefault();screenIndex=sequences[projectIndex].length-1;render();start()}
  });
  deck.addEventListener('wheel',event=>{
   if(event.ctrlKey||event.metaKey)return;
   const horizontal=Math.abs(event.deltaX)>Math.abs(event.deltaY);
   const delta=horizontal?event.deltaX:event.deltaY;
   if(!delta)return;
   const now=performance.now();
   if(now-wheelTime>260)wheelAccum=0;
   wheelTime=now;wheelAccum+=delta;
   event.preventDefault();
   if(Math.abs(wheelAccum)>=65&&now-lastWheelAdvance>600){
    advance(Math.sign(wheelAccum));wheelAccum=0;lastWheelAdvance=now;
   }
  },{passive:false});
  root.addEventListener('pointerenter',()=>{hover=true;stop()});
  root.addEventListener('pointerleave',()=>{hover=false;start()});
  root.addEventListener('focusin',stop);
  root.addEventListener('focusout',()=>{if(!root.contains(document.activeElement))start()});
  document.addEventListener('visibilitychange',start);
  if('IntersectionObserver'in window){
   new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;start()},{threshold:.2}).observe(root);
  }
  if('ResizeObserver'in window)new ResizeObserver(()=>{render();measureScreenOverflow()}).observe(deck);
  else window.addEventListener('resize',render,{passive:true});
  reduced.addEventListener?.('change',start);
  render();start();
 });
})();

// Show missing original asset instructions only while previewing on localhost.
// Public portfolio pages remain clean even if the owner has not uploaded screenshots.
(()=>{
 const notices=document.querySelectorAll('[data-local-asset-notice]');
 if(!notices.length)return;
 const local=['localhost','127.0.0.1','::1'].includes(location.hostname);
 notices.forEach(el=>{if(local)el.hidden=false;});
})();

/* Independently implemented scroll scene. Shared shell and phone gallery are untouched. */
(()=>{
 const root=document.querySelector('[data-product-flight]');if(!root||root.dataset.flightMounted)return;
 root.dataset.flightMounted='true';
 const stage=root.querySelector('.product-flight-stage'),cards=[...root.querySelectorAll('[data-flight-card]')];
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let raf=0,visible=true,started=performance.now(),entranceDone=false;
 const clamp=(v)=>Math.max(0,Math.min(1,v));
 const ease=t=>1-Math.pow(1-t,3),mix=(a,b,t)=>a+(b-a)*t;
 // Deliberate edge composition leaves the headline and primary actions unobstructed.
 const scatter=[[.84,.18,-15],[.94,.45,13],[.79,.76,-9],[.64,.86,11],[.39,.86,-13],[.17,.84,9],[.96,.80,15],[.69,.12,-8],[.48,.71,5],[.07,.78,-12],[.76,.48,9],[.92,.13,-16],[.86,.61,-7],[.57,.78,8],[.27,.73,-9],[.94,.64,10],[.61,.90,-5],[.83,.90,8],[.10,.91,-8]];
 const mobileScatter=[[.12,.62,-10],[.84,.60,12],[.18,.80,8],[.79,.81,-10],[.47,.71,-7],[.49,.88,9]];
 function schedule(){if(!raf&&visible&&!reduce.matches&&!document.hidden)raf=requestAnimationFrame(paint)}
 function paint(now){
  raf=0;if(reduce.matches||!visible||document.hidden)return;
  const rect=root.getBoundingClientRect(),w=stage.clientWidth,h=stage.clientHeight;
  const progress=clamp(-rect.top/Math.max(1,root.offsetHeight-h));
  const mobile=w<=680,n=mobile?6:cards.length;
  const elapsed=(now-started)/1000;
  const radius=mobile?Math.min(120,w*.29):Math.min(w*.235,300);
  root.dataset.flightProgress=progress.toFixed(4);
  cards.forEach((card,i)=>{
   if(i>=n){card.style.removeProperty('transform');return}
   const pos=mobile?mobileScatter[i]:scatter[i];
   const entry=ease(clamp((elapsed-i*.065)/1.15));
   // Stagger is in scroll distance: every state has an exact inverse on reverse scroll.
   const gather=ease(clamp((progress-.10-i/(n-1)*.19)/.42));
   const spin=progress*260;
   const angle=(i/n*360+spin)*Math.PI/180;
   const ringX=Math.sin(angle)*radius,ringZ=Math.cos(angle)*radius;
   const centerY=mobile?h*.74:w<=1000?h*.74:h*.66;
   const x=mix((pos[0]-.5)*w,ringX+(mobile||w<=1000?0:w*.22),gather);
   const y=mix((pos[1]-.5)*h,centerY-h*.5+Math.sin(angle*2)*12,gather);
   const z=mix(-70+i%3*45,ringZ,gather);
   const ry=mix((i%2?1:-1)*18,i/n*360+spin,gather);
   card.style.transform=`translate(-50%,-50%) translate3d(${(x*entry).toFixed(2)}px,${(y*entry).toFixed(2)}px,${mix(-420,z,entry).toFixed(2)}px) rotateY(${(ry*entry).toFixed(2)}deg) rotateZ(${(pos[2]*(1-gather)*entry).toFixed(2)}deg) scale(${mix(.35,1,entry).toFixed(3)})`;
   card.style.filter=entry<1?`blur(${((1-entry)*7).toFixed(2)}px)`:'none';
  });
  entranceDone=elapsed>1.15+(n-1)*.065;
  if(!entranceDone)schedule();
 }
 function mode(){
  cancelAnimationFrame(raf);raf=0;
  if(reduce.matches){root.classList.remove('is-ready');cards.forEach(c=>{c.style.removeProperty('transform');c.style.removeProperty('filter')});root.dataset.flightProgress='0';return}
  root.classList.add('is-ready');started=performance.now();entranceDone=false;schedule();
 }
 const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)schedule();else{cancelAnimationFrame(raf);raf=0}},{rootMargin:'100px'});io.observe(root);
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else schedule()});
 reduce.addEventListener('change',mode);mode();
})();

/* Native progressive enhancements; no Framer runtime or proprietary source. */
(()=>{
 const page=document.querySelector('.product-portfolio');if(!page)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 page.querySelectorAll('.pp-showcase-details').forEach(details=>{
  const summary=details.querySelector('summary'),panel=details.querySelector('.pp-showcase-reveal');let animation=null,desired=details.open;
  summary.addEventListener('click',event=>{
   if(reduce.matches)return;event.preventDefault();if(!animation)desired=details.open;desired=!desired;
   const from=panel.getBoundingClientRect().height;animation?.cancel();details.open=true;panel.style.height='auto';const to=desired?panel.scrollHeight:0;
   animation=panel.animate([{height:from+'px',opacity:desired?.35:1},{height:to+'px',opacity:desired?1:.35}],{duration:480,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
   animation.onfinish=()=>{details.open=desired;animation.cancel();animation=null;panel.style.removeProperty('height')};
  });
  reduce.addEventListener('change',()=>{if(animation){animation.cancel();animation=null;details.open=desired;panel.style.removeProperty('height')}else desired=details.open});
 });
 const root=page.querySelector('[data-work-orbit]');if(!root)return;
 const cards=[...root.querySelectorAll('.pp-work-card')],controls=root.nextElementSibling,prev=controls.querySelector('[data-orbit-prev]'),next=controls.querySelector('[data-orbit-next]'),count=controls.querySelector('[data-orbit-count]');
 const desktop=matchMedia('(min-width: 901px)');let current=0,target=0,frame=0,visible=false,needsCurve=true,drag=null,dragged=false,enabled=false,lastPaint=0;
 const step=360/cards.length,wrap=i=>(i%cards.length+cards.length)%cards.length;
 function schedule(){if(!frame&&enabled&&visible&&!document.hidden)frame=requestAnimationFrame(paint)}
 function announce(){const i=wrap(Math.round(target/step));count.textContent=String(i+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');root.dataset.orbitIndex=String(i)}
 function paint(now){
  frame=0;if(!enabled||!visible)return;if(needsCurve){curve();needsCurve=false}const elapsed=lastPaint?Math.min(now-lastPaint,100):16.67;lastPaint=now;current+=drag?target-current:(target-current)*(1-Math.pow(.86,elapsed/16.67));if(Math.abs(target-current)<.015)current=target;
  const width=cards[0].offsetWidth,radius=width*.95/(2*Math.sin(Math.PI/cards.length));
  cards.forEach((card,i)=>{let angle=((i*step-current+540)%360+360)%360-180;const r=angle*Math.PI/180;const showing=Math.abs(angle)<100;
   card.style.transform=`translate(-50%,-50%) translate3d(${Math.sin(r)*radius}px,0,${(Math.cos(r)-1)*radius}px) rotateY(${angle}deg)`;
   card.querySelector('.pp-orbit-caption').style.visibility=Math.abs(angle)<65?'visible':'hidden';card.style.zIndex=String(Math.round((Math.cos(r)+1)*100));card.style.visibility=showing?'visible':'hidden';card.querySelector('button').tabIndex=showing?0:-1;
  });if(current!==target)schedule();
 }
 function curve(){
  const width=cards[0].offsetWidth,height=cards[0].querySelector('.zoom').offsetHeight,radius=width*.95/(2*Math.sin(Math.PI/cards.length)),pieces=16;
  cards.forEach(card=>{const button=card.querySelector('.zoom'),img=button.querySelector('img');let ribbon=button.querySelector('.pp-orbit-ribbon');if(!ribbon){ribbon=document.createElement('span');ribbon.className='pp-orbit-ribbon';ribbon.setAttribute('aria-hidden','true');button.append(ribbon)}ribbon.replaceChildren();
   for(let k=0;k<pieces;k++){const left=k*width/pieces,mid=(left+width/pieces/2)-width/2,a=mid/radius,strip=document.createElement('span');strip.className='pp-orbit-slice';strip.style.width=(width/pieces+1)+'px';strip.style.marginLeft=(-width/pieces/2)+'px';strip.style.backgroundImage=`linear-gradient(transparent 55%,rgba(9,7,15,.85)),url("${img.currentSrc||img.src}")`;strip.style.backgroundSize=width+'px '+height+'px';strip.style.backgroundPosition=-left+'px 0';strip.style.transform=`translate3d(${Math.sin(a)*radius}px,0,${(Math.cos(a)-1)*radius}px) rotateY(${a*180/Math.PI}deg)`;ribbon.append(strip)}
  });
 }
 function mode(){enabled=desktop.matches&&!reduce.matches;cancelAnimationFrame(frame);frame=0;root.classList.toggle('is-orbit',enabled);cards.forEach(card=>{card.querySelector('.pp-orbit-caption').style.removeProperty('visibility');card.style.removeProperty('transform');card.style.removeProperty('visibility');card.style.removeProperty('z-index');card.querySelector('button').tabIndex=0});if(enabled){needsCurve=true;schedule()}announce()}
 function select(i){lastPaint=performance.now();target=i*step;announce();schedule()}
 prev.addEventListener('click',()=>select(Math.round(target/step)-1));next.addEventListener('click',()=>select(Math.round(target/step)+1));
 root.addEventListener('keydown',e=>{if(!enabled)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(Math.round(target/step)+(e.key==='ArrowRight'?1:-1))}});
 root.addEventListener('focusin',e=>{if(!enabled||drag)return;const index=cards.findIndex(c=>c.contains(e.target));if(index>=0){const active=Math.round(target/step),delta=wrap(index)-wrap(active);target=(active+(delta>cards.length/2?delta-cards.length:delta< -cards.length/2?delta+cards.length:delta))*step;announce();schedule()}});
 root.addEventListener('dragstart',e=>{if(enabled)e.preventDefault()});
 root.addEventListener('pointerdown',e=>{if(!enabled||e.button!==0)return;drag={id:e.pointerId,x:e.clientX,rotation:current};dragged=false});
 root.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>7){dragged=true;root.setPointerCapture(e.pointerId);root.classList.add('is-dragging');target=drag.rotation-dx*.085;schedule()}});
 function release(){if(!drag)return;drag=null;root.classList.remove('is-dragging');target=Math.round(target/step)*step;announce();schedule()}
 root.addEventListener('pointerup',release);root.addEventListener('pointercancel',release);root.addEventListener('click',e=>{if(dragged){e.preventDefault();e.stopImmediatePropagation();dragged=false}},true);
 root.addEventListener('wheel',e=>{if(!enabled||Math.abs(e.deltaX)<=Math.abs(e.deltaY)&&!e.shiftKey)return;e.preventDefault();target+=(e.deltaX||e.deltaY)*.07;announce();schedule()},{passive:false});
 let resizeFrame=0;addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{if(enabled){needsCurve=true;schedule()}})},{passive:true});
 new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible){needsCurve=true;schedule()}else{cancelAnimationFrame(frame);frame=0}},{rootMargin:'150px'}).observe(root);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else schedule()});desktop.addEventListener('change',mode);reduce.addEventListener('change',mode);
 root.querySelectorAll('img').forEach(img=>{img.addEventListener('load',()=>{if(enabled){needsCurve=true;schedule()}})});mode();
})();

/* Reference-matched interactions; scoped to this portfolio and the existing integrations. */
(()=>{
 const page=document.querySelector('.onlines-page');if(!page)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),hero=page.querySelector('[data-ol-hero]'),stage=hero.querySelector('.ol-hero-stage');
 page.classList.add('ol-enhanced');page.querySelectorAll('.ol-cursor>span').forEach(e=>e.dataset.label=e.textContent);
 const quote=page.querySelector('.ol-intro h2');quote.innerHTML=quote.textContent.split(' ').map(word=>'<span>'+word+'</span>').join(' ');const words=[...quote.children];
 let frame=0,intro=0;const start=performance.now();
 function paint(now){frame=0;const r=hero.getBoundingClientRect(),progress=Math.max(0,Math.min(1,-r.top/Math.max(1,r.height-innerHeight))),time=Math.min(1,(now-start)/2200);intro=Math.max(time,progress*2);stage.style.setProperty('--reveal',reduce.matches?1:Math.max(0,Math.min(1,(intro-.15)/.7)));const q=quote.getBoundingClientRect(),reveal=Math.max(0,Math.min(1,(innerHeight*.9-q.top)/(innerHeight*.65)));words.forEach((w,i)=>w.style.opacity=reduce.matches?1:String(Math.max(.2,Math.min(1,reveal*words.length-i))));if(time<1&&!reduce.matches)frame=requestAnimationFrame(paint)}
 function request(){if(!frame)frame=requestAnimationFrame(paint)}addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});reduce.addEventListener('change',request);request();
 new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('is-inview',e.isIntersecting)),{threshold:.3}).observe(page.querySelector('.ol-feature'));
 const ai=page.querySelector('[data-ol-ai]');ai.addEventListener('click',()=>{const on=ai.getAttribute('aria-pressed')!=='true';ai.setAttribute('aria-pressed',String(on));page.classList.toggle('ol-ai-on',on);stage.style.backgroundColor=on?'var(--theme-surface)':''});
 page.querySelectorAll('[data-ol-drag]').forEach(el=>{
  let drag=null,moved=false,x=0,y=0;el.addEventListener('dragstart',e=>e.preventDefault());
  el.addEventListener('pointerdown',e=>{if(e.button!==0||e.pointerType==='touch')return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,ox:x,oy:y};moved=false});
  el.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>5){moved=true;el.setPointerCapture(e.pointerId);x=Math.max(-innerWidth*.25,Math.min(innerWidth*.25,drag.ox+dx));y=Math.max(-innerHeight*.3,Math.min(innerHeight*.3,drag.oy+dy));el.style.setProperty('--drag-x',x+'px');el.style.setProperty('--drag-y',y+'px')}});
  const release=()=>drag=null;el.addEventListener('pointerup',release);el.addEventListener('pointercancel',release);el.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopImmediatePropagation();moved=false}},true);
 });
 page.querySelectorAll('.ol-service-panel').forEach(el=>el.addEventListener('pointermove',e=>{if(reduce.matches)return;const r=el.getBoundingClientRect();el.style.setProperty('--mx',100*(e.clientX-r.left)/r.width+'%');el.style.setProperty('--my',100*(e.clientY-r.top)/r.height+'%')},{passive:true}));
 const gallery=page.querySelector('#ol-gallery');let opener=null,overflow='';
 page.querySelectorAll('[data-ol-gallery]').forEach(button=>button.addEventListener('click',()=>{opener=button;overflow=document.body.style.overflow;gallery.showModal();document.body.style.overflow='hidden';gallery.scrollTop=0;dispatchEvent(new Event('resize'));gallery.querySelector('[data-ol-gallery-close]').focus()}));
 page.querySelector('[data-ol-gallery-close]').addEventListener('click',()=>gallery.close());gallery.addEventListener('close',()=>{document.body.style.overflow=overflow;opener?.focus()});gallery.addEventListener('click',e=>{if(e.target===gallery){const r=gallery.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)gallery.close()}});
 page.querySelector('.lightbox').addEventListener('close',()=>{if(gallery.open)document.body.style.overflow='hidden'});
 page.querySelectorAll('[data-ol-sera]').forEach(el=>el.addEventListener('click',()=>document.querySelector('.app-dock [data-sera-launch]')?.click()));
 page.querySelector('[data-consultation-entry="meeting"]').addEventListener('click',()=>window.dispatchEvent(new CustomEvent('intellignce:open-consultation',{detail:{booking:true}})));
 page.querySelector('[data-ol-menu]').addEventListener('click',()=>document.querySelector('.app-dock .menu-toggle')?.click());
})();
