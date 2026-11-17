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
