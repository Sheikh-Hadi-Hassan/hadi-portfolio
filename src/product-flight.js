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
 const scatter=[[.84,.18,-15],[.94,.45,13],[.79,.76,-9],[.64,.86,11],[.39,.86,-13],[.17,.84,9],[.96,.80,15],[.69,.12,-8],[.48,.71,5],[.07,.78,-12],[.76,.48,9],[.92,.13,-16]];
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
  entranceDone=elapsed>2.1;
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
