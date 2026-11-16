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
