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
