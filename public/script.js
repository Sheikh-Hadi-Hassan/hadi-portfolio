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

/* One visible-scene scheduler. Native progressive enhancement; no scroll hijacking. */
(()=>{
 const page=document.querySelector('.onlines-page');if(!page)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),hero=page.querySelector('[data-ol-hero]'),stage=hero.querySelector('.ol-hero-stage'),quote=page.querySelector('.ol-intro'),heading=quote.querySelector('h2'),subtitle=quote.querySelector('p');
 const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,v));
 heading.replaceChildren(...heading.textContent.split(' ').flatMap((word,i)=>{const el=document.createElement('span');el.textContent=word;return i?[document.createTextNode(' '),el]:[el]}));
 const words=[...heading.children],enter=[...stage.querySelectorAll('.ol-hero-art,.ol-tool,.ol-comment,.ol-cursor,.ol-ai')];
 enter.forEach((el,i)=>{el.dataset.enter='';el.style.transitionDelay=(Math.min(i,8)*75)+'ms'});
 const cursors=[...stage.querySelectorAll('.ol-cursor')];page.querySelectorAll('.ol-cursor>span').forEach(el=>el.dataset.label=el.textContent);
 const floats=[...stage.querySelectorAll('.ol-hero-art,.ol-tool')],typing=stage.querySelector('[data-ol-typing]'),code='<product>\n  people first.\n  design with purpose.\n</product>';
 let frame=0,heroVisible=true,start=performance.now(),typed=-1;
 const paths=[[[0,0],[90,-95],[-50,60],[130,40],[0,0]],[[0,0],[-120,-80],[-40,60],[60,-80],[0,0]],[[0,0],[90,65],[-80,-90],[-110,30],[0,0]],[[0,0],[-80,-100],[40,70],[80,-50],[0,0]],[[0,0],[50,80],[-140,40],[-80,-60],[0,0]]];
 function schedule(){if(!frame&&!document.hidden)frame=requestAnimationFrame(paint)}
 function paint(now){
  frame=0;const elapsed=now-start,r=quote.getBoundingClientRect(),range=Math.max(1,quote.offsetHeight-innerHeight),progress=clamp(-r.top/range);
  words.forEach((word,i)=>{const amount=reduced.matches?1:clamp(progress/.74*words.length-i);word.style.color=`rgba(33,22,47,${.18+.82*amount})`});subtitle.style.opacity=reduced.matches?'1':String(.15+.85*clamp((progress-.74)/.26));
  if(heroVisible&&!reduced.matches){
   const seconds=elapsed/1000,parallax=clamp(-hero.getBoundingClientRect().top/innerHeight,-1,1),mobile=innerWidth<681;
   floats.forEach((el,i)=>{const amount=mobile?.45:1;el.style.setProperty('--float-y',(Math.sin(seconds*.65+i*1.7)*5*amount-parallax*(12+i*3)).toFixed(2)+'px');el.style.setProperty('--float-x',(Math.cos(seconds*.45+i)*2*amount).toFixed(2)+'px')});
   cursors.forEach((el,i)=>{const path=paths[i],phase=(seconds/(2.5+i*.18)+i*.4)%(path.length-1),index=Math.floor(phase),raw=phase-index,t=clamp(raw/.78),ease=-(Math.cos(Math.PI*t)-1)/2,a=path[index],b=path[index+1],scale=mobile?.32:1;el.style.setProperty('--cursor-x',((a[0]+(b[0]-a[0])*ease)*scale).toFixed(1)+'px');el.style.setProperty('--cursor-y',((a[1]+(b[1]-a[1])*ease)*scale).toFixed(1)+'px');el.classList.toggle('is-clicking',raw>.80&&raw<.88)});
   const count=Math.min(code.length,Math.max(0,Math.floor((elapsed-700)/65)));if(count!==typed){typing.textContent=code.slice(0,count);typed=count}
   schedule();
  }else if(reduced.matches){typing.textContent=code;floats.forEach(el=>{el.style.removeProperty('--float-x');el.style.removeProperty('--float-y')});cursors.forEach(el=>{el.style.removeProperty('--cursor-x');el.style.removeProperty('--cursor-y');el.classList.remove('is-clicking')})}
 }
 const revealTargets=[...page.querySelectorAll('.ol-service,.ol-product,.ol-products,.ol-fan,.ol-contact-photo,.ol-contact-art>.ol-tool,.ol-contact-art>.ol-wire,.ol-fan-note,.ol-fan-tool')];
 revealTargets.forEach((el,i)=>{el.dataset.reveal='';el.style.setProperty('--reveal-delay',(i%3)*95+'ms')});
 const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-revealed');revealObserver.unobserve(e.target)}}),{threshold:.18});revealTargets.forEach(el=>revealObserver.observe(el));
 const heroObserver=new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;if(heroVisible)schedule();else if(frame){cancelAnimationFrame(frame);frame=0}},{threshold:0});heroObserver.observe(hero);
 const feature=page.querySelector('.ol-feature');new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('is-inview',e.isIntersecting)),{threshold:.22}).observe(feature);
 const marquee=page.querySelector('.ol-product-marquee');new IntersectionObserver(es=>marquee.classList.toggle('is-paused',!es[0].isIntersecting),{threshold:0}).observe(marquee);
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else schedule()});reduced.addEventListener('change',schedule);
 // Leave meaningful content visible when scripting is unavailable.
 page.classList.add('ol-enhanced');requestAnimationFrame(()=>{stage.classList.add('is-ready');enter.forEach(el=>el.classList.add('is-entered'));schedule()});
 page.querySelectorAll('.ol-service h3').forEach(el=>{const lines=el.innerHTML.split(/<br\s*\/?\s*>/i);el.innerHTML=lines.map(line=>'<span>'+line+'</span>').join('')});
 const ai=page.querySelector('[data-ol-ai]');ai.addEventListener('click',()=>{const on=ai.getAttribute('aria-pressed')!=='true';ai.setAttribute('aria-pressed',String(on));stage.classList.toggle('ol-ai-on',on)});
 page.querySelectorAll('[data-ol-drag]').forEach(el=>{
  let drag=null,moved=false,x=0,y=0;el.addEventListener('dragstart',e=>e.preventDefault());
  el.addEventListener('pointerdown',e=>{if(e.button!==0||e.pointerType==='touch')return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,ox:x,oy:y};moved=false});
  el.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>5){moved=true;el.setPointerCapture(e.pointerId);x=clamp(drag.ox+dx,-innerWidth*.25,innerWidth*.25);y=clamp(drag.oy+dy,-innerHeight*.3,innerHeight*.3);el.style.setProperty('--drag-x',x+'px');el.style.setProperty('--drag-y',y+'px')}});
  const release=()=>drag=null;el.addEventListener('pointerup',release);el.addEventListener('pointercancel',release);el.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopImmediatePropagation();moved=false}},true);
 });
 // Image-derived halftone. Redraw only at load/resize, never every animation frame.
 page.querySelectorAll('[data-halftone]').forEach((canvas,index)=>{
  const source=new Image();let pending=0,loaded=false;const sample=document.createElement('canvas'),sc=sample.getContext('2d',{willReadFrequently:true}),ctx=canvas.getContext('2d');if(!sc||!ctx)return;
  function draw(){pending=0;if(!loaded)return;const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;const ratio=Math.min(devicePixelRatio,1.5),w=Math.round(rect.width),h=Math.round(rect.height);canvas.width=w*ratio;canvas.height=h*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);ctx.fillStyle=['#6d52a3','#76638e','#465579'][index];ctx.fillRect(0,0,w,h);const cols=Math.min(100,Math.ceil(w/4)),rows=Math.ceil(h/(w/cols));sample.width=cols;sample.height=rows;sc.drawImage(source,0,0,cols,rows);const pixels=sc.getImageData(0,0,cols,rows).data,cell=w/cols;for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const p=(y*cols+x)*4,luma=(pixels[p]*.2126+pixels[p+1]*.7152+pixels[p+2]*.0722)/255;ctx.fillStyle=`rgba(241,225,255,${.14+luma*.5})`;ctx.beginPath();ctx.arc((x+.5)*cell,(y+.5)*cell,cell*(.12+luma*.34),0,Math.PI*2);ctx.fill()}canvas.dataset.halftoneReady='true'}
  const queue=()=>{if(!pending)pending=requestAnimationFrame(draw)};source.onload=()=>{loaded=true;queue()};source.src=canvas.dataset.halftone;new ResizeObserver(queue).observe(canvas);
 });
 const gallery=page.querySelector('#ol-gallery');let opener=null,overflow='';
 page.querySelectorAll('[data-ol-gallery]').forEach(button=>button.addEventListener('click',()=>{opener=button;overflow=document.body.style.overflow;gallery.showModal();document.body.style.overflow='hidden';gallery.scrollTop=0;dispatchEvent(new Event('resize'));gallery.querySelector('[data-ol-gallery-close]').focus()}));
 page.querySelector('[data-ol-gallery-close]').addEventListener('click',()=>gallery.close());gallery.addEventListener('close',()=>{document.body.style.overflow=overflow;opener?.focus()});
 page.querySelector('.lightbox').addEventListener('close',()=>{if(gallery.open)document.body.style.overflow='hidden'});
 page.querySelectorAll('[data-ol-sera]').forEach(el=>el.addEventListener('click',()=>document.querySelector('.app-dock [data-sera-launch]')?.click()));
 page.querySelector('[data-consultation-entry="meeting"]').addEventListener('click',()=>window.dispatchEvent(new CustomEvent('intellignce:open-consultation',{detail:{booking:true}})));
 page.querySelector('[data-ol-menu]').addEventListener('click',()=>document.querySelector('.app-dock .menu-toggle')?.click());
})();
