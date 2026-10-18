'use client';
import {useEffect} from 'react';

export function attachSocialCarousel(root){
  const rail=root.querySelector('.social-rail');
  const groups=root.querySelectorAll('.social-group');
  const play=root.querySelector('[data-social-play]');
  if(!rail || groups.length<2 || !play)return ()=>{};
  const videos=[...root.querySelectorAll('video[data-motion-src]')],near=new Set();
  const syncVideos=()=>videos.forEach(video=>{if(near.has(video)&&!paused&&!document.hidden){if(!video.getAttribute('src')){video.muted=true;video.setAttribute('src',video.dataset.motionSrc);video.load();}video.play()?.catch(()=>{});}else video.pause();});
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused=motion.matches, hovered=false, focused=false, visible=false;
  let frame=0, last=0, loop=0, holdUntil=0, disposed=false;
  const listeners=[];
  const on=(el,event,fn,opts)=>{el.addEventListener(event,fn,opts);listeners.push(()=>el.removeEventListener(event,fn,opts));};
  const measure=()=>{loop=groups[1].getBoundingClientRect().left-groups[0].getBoundingClientRect().left;};
  const updateButton=()=>{play.textContent=paused?'Play':'Pause';play.setAttribute('aria-pressed',String(paused));play.setAttribute('aria-label',paused?'Start automatic scrolling':'Pause automatic scrolling');};
  const wrap=()=>{if(loop>0 && rail.scrollLeft>=loop)rail.scrollLeft%=loop;};
  const tick=(time)=>{
    frame=0;if(disposed)return;
    const delta=last?Math.min(time-last,40):0;last=time;
    if(!paused && !hovered && !focused && time>=holdUntil){wrap();rail.scrollLeft+=delta*.035;}
    if(visible && !document.hidden)frame=requestAnimationFrame(tick);
  };
  const sync=()=>{syncVideos();if(frame)cancelAnimationFrame(frame);frame=0;last=0;if(visible && !document.hidden && !disposed)frame=requestAnimationFrame(tick);};
  const hold=()=>{holdUntil=performance.now()+5000;};
  const move=(direction)=>{
    hold();measure();if(!loop)return;
    wrap();const step=loop/groups[0].children.length;
    if(direction<0 && rail.scrollLeft<step)rail.scrollLeft+=loop;
    rail.scrollTo({left:rail.scrollLeft+direction*step,behavior:motion.matches?'auto':'smooth'});
  };
  on(root,'pointerenter',e=>{if(e.pointerType==='mouse')hovered=true;});
  on(root,'pointerleave',()=>{hovered=false;});
  on(root,'focusin',()=>{focused=true;});
  on(root,'focusout',e=>{focused=root.contains(e.relatedTarget);});
  on(rail,'pointerdown',hold,{passive:true});
  on(rail,'pointerup',hold,{passive:true});
  on(rail,'wheel',hold,{passive:true});
  on(rail,'keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
  on(play,'click',()=>{paused=!paused;updateButton();syncVideos();});
  on(root.querySelector('[data-social-prev]'),'click',()=>move(-1));
  on(root.querySelector('[data-social-next]'),'click',()=>move(1));
  on(document,'visibilitychange',sync);
  on(motion,'change',e=>{if(e.matches){paused=true;updateButton();syncVideos();}});
  const resize=new ResizeObserver(measure);resize.observe(rail);
  const observer=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);sync();},{rootMargin:'100px'});observer.observe(root);
  const clips=videos.length?new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)near.add(e.target);else near.delete(e.target)});syncVideos();},{rootMargin:'100px'}):null;videos.forEach(v=>clips.observe(v));
  measure();updateButton();
  return ()=>{disposed=true;if(frame)cancelAnimationFrame(frame);listeners.forEach(off=>off());resize.disconnect();observer.disconnect();clips?.disconnect();videos.forEach(v=>v.pause());};
}
export default function SocialCarousel(){
  useEffect(()=>{const cleanups=[...document.querySelectorAll('[data-social-carousel]')].map(attachSocialCarousel);return ()=>cleanups.forEach(cleanup=>cleanup());},[]);
  return null;
}
