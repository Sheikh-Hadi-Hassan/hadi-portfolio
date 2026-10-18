const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('src/app/social-carousel.jsx','utf8').replace("'use client';",'').replace("import {useEffect} from 'react';",'').split('export default function')[0].replace('export function','function');
function element(){const events=new Map();return {events,attrs:{},addEventListener(n,f){events.set(n,f)},removeEventListener(n){events.delete(n)},setAttribute(n,v){this.attrs[n]=v},fire(n,e={}){events.get(n)?.(e)}}}
function setup(reduced=false){
 const root=element(),rail=element(),play=element(),prev=element(),next=element(),doc=element(),motion=element();
 Object.assign(rail,{scrollLeft:0,scrollTo({left}){this.scrollLeft=left}});doc.hidden=false;motion.matches=reduced;
 const groups=[{children:Array(11),getBoundingClientRect:()=>({left:0})},{getBoundingClientRect:()=>({left:3300})}];
 root.querySelector=s=>({'.social-rail':rail,'[data-social-play]':play,'[data-social-prev]':prev,'[data-social-next]':next}[s]);root.querySelectorAll=s=>s==='.social-group'?groups:[];root.contains=e=>e===play;
 let callback=null,observe,resizeOff=false,observerOff=false;
 const context={window:{matchMedia:()=>motion},document:doc,performance:{now:()=>0},requestAnimationFrame:f=>{callback=f;return 1},cancelAnimationFrame:()=>{callback=null},ResizeObserver:class{observe(){}disconnect(){resizeOff=true}},IntersectionObserver:class{constructor(f){observe=f}observe(){}disconnect(){observerOff=true}}};
 vm.createContext(context);vm.runInContext(source+';this.attach=attachSocialCarousel;',context);
 const cleanup=context.attach(root);observe([{isIntersecting:true}]);
 return {root,rail,play,next,prev,motion,doc,cleanup,tick(t){const f=callback;callback=null;f?.(t)},closed:()=>resizeOff&&observerOff};
}
const c=setup();c.tick(10);c.tick(50);assert(c.rail.scrollLeft>0,'autoplay advances');
c.rail.scrollLeft=3301;c.tick(90);assert(c.rail.scrollLeft<10,'loop wraps without accumulating distance');
c.root.fire('pointerenter',{pointerType:'mouse'});const held=c.rail.scrollLeft;c.tick(130);assert.equal(c.rail.scrollLeft,held,'hover pauses');c.root.fire('pointerleave');c.tick(170);assert(c.rail.scrollLeft>held);
c.play.fire('click');const paused=c.rail.scrollLeft;c.tick(210);assert.equal(c.rail.scrollLeft,paused);assert.equal(c.play.attrs['aria-pressed'],'true');
c.play.fire('click');c.root.fire('focusin');c.tick(250);assert.equal(c.rail.scrollLeft,paused,'focus pauses');c.root.fire('focusout',{relatedTarget:null});
c.rail.scrollLeft=0;c.prev.fire('click');assert.equal(c.rail.scrollLeft,3000,'previous works from first item');c.next.fire('click');assert.equal(c.rail.scrollLeft,3300,'next works across boundary');
c.rail.fire('pointerdown');const dragged=c.rail.scrollLeft;c.tick(400);assert.equal(c.rail.scrollLeft,dragged,'touch interaction pauses autoplay');
c.cleanup();assert(c.closed());assert.equal(c.root.events.size,0);assert.equal(c.rail.events.size,0);
const r=setup(true);r.tick(10);r.tick(50);assert.equal(r.rail.scrollLeft,0,'reduced motion disables initial autoplay');assert.equal(r.play.textContent,'Play');r.cleanup();
console.log('Social carousel checks passed: autoplay, loop, controls, hover/focus/touch pauses, reduced motion and cleanup.');
