/**
 * Progressive enhancement only. All published case-study cards and links
 * already exist in server-rendered HTML when JavaScript is unavailable.
 */
export function mountPortfolioGallery(root=document.querySelector('[data-portfolio-gallery]')){
 if(!root||root.dataset.galleryEnhanced==='true')return ()=>{};
 const track=root.querySelector('.v2sw-track'),cards=[...root.querySelectorAll('[data-gallery-card]')],buttons=[...root.querySelectorAll('[data-gallery-filter]')],controls=[...root.querySelectorAll('[data-gallery-step]')],status=root.querySelector('[data-gallery-status]'),empty=root.querySelector('[data-gallery-empty]'),heading=root.querySelector('[data-gallery-heading-count]');
 if(!track||!buttons.length||!status)throw Error('GALLERY_MARKUP_INVALID');
 const controller=new AbortController(),opts={signal:controller.signal};
 let active='all',currentIndex=0,frame=0,frame2=0,scrollFrame=0;
 const visible=()=>cards.filter(card=>!card.hidden);
 const count=n=>String(n).padStart(Math.max(2,String(visible().length).length),'0');
 const emit=(name,detail={})=>root.dispatchEvent(new CustomEvent('portfolio:gallery:'+name,{bubbles:true,detail}));
 function reflect(){
  const current=visible(),total=current.length;
  controls.forEach(b=>{const dir=Number(b.dataset.galleryStep);b.disabled=total===0||(dir<0&&currentIndex===0)||(dir>0&&currentIndex>=total-1)});
  if(empty)empty.hidden=total!==0;
  status.textContent='Showing '+total+' of '+cards.length+' projects';
  if(heading)heading.textContent='SELECTED PROJECTS / '+count(total?1:0)+'–'+count(total);
 }
 function setFilter(id){
  if(id===active||!buttons.some(b=>b.dataset.galleryFilter===id))return;
  emit('beforeChange',{categoryId:id});
  active=id;
  buttons.forEach(b=>{const selected=b.dataset.galleryFilter===id;b.classList.toggle('is-active',selected);b.setAttribute('aria-pressed',String(selected))});
  cards.forEach(card=>{const show=id==='all'||(card.dataset.galleryCategoryIds||'').split(' ').includes(id);card.hidden=!show;card.inert=!show});
  const current=visible();current.forEach((card,i)=>{const n=card.querySelector('[data-gallery-number]');if(n)n.textContent=count(i+1)+' / '+count(current.length)});
  currentIndex=0;track.scrollLeft=0;reflect();
  cancelAnimationFrame(frame);cancelAnimationFrame(frame2);
  frame=requestAnimationFrame(()=>{frame2=requestAnimationFrame(()=>emit('changed',{categoryId:id,count:current.length}))});
 }
 function go(index){
  const current=visible();if(!current.length)return;
  const next=Math.max(0,Math.min(current.length-1,index));if(next===currentIndex&&index!==0)return;
  currentIndex=next;reflect();emit('navigate',{index:next,count:current.length,slug:current[next].dataset.gallerySlug});
  if(matchMedia('(max-width:899px), (max-height:699px), (prefers-reduced-motion:reduce)').matches){
   const left=current[next].offsetLeft;
   track.scrollTo({left,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
  }
 }
 for(const b of buttons)b.addEventListener('click',()=>setFilter(b.dataset.galleryFilter),opts);
 for(const b of controls)b.addEventListener('click',()=>go(currentIndex+Number(b.dataset.galleryStep)),opts);
 track.addEventListener('keydown',e=>{if(e.altKey||e.metaKey||e.ctrlKey||['A','BUTTON','INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;
  if(['ArrowRight','ArrowLeft'].includes(e.key)){e.preventDefault();go(currentIndex+(e.key==='ArrowRight'?1:-1))}
  else if(e.key==='Home'){e.preventDefault();go(0)}
  else if(e.key==='End'){e.preventDefault();go(visible().length-1)}
 },opts);
 track.addEventListener('scroll',()=>{if(scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;if(!matchMedia('(max-width:899px), (max-height:699px), (prefers-reduced-motion:reduce)').matches)return;const items=visible();if(!items.length)return;const left=track.scrollLeft;let best=0,dist=Infinity;items.forEach((card,i)=>{const d=Math.abs(card.offsetLeft-left);if(d<dist){dist=d;best=i}});currentIndex=best;reflect()})},{passive:true,signal:controller.signal});
 root.dataset.galleryEnhanced='true';reflect();
 return ()=>{controller.abort();cancelAnimationFrame(frame);cancelAnimationFrame(frame2);cancelAnimationFrame(scrollFrame);delete root.dataset.galleryEnhanced};
}
