'use client';
import {useEffect,useState,useRef} from 'react';
import {createPortal} from 'react-dom';
import '../styles/hero-refinement.css';

// P0-HERO-01: home-only enhancement. Do not edit hero-lock protected markup.
// Existing site.js parallax and HeroDither remain the only pointer effects.
const ROLES=[['CREATIVE','DIRECTOR'],['PRODUCT & UX','DESIGNER'],['BRAND','STRATEGIST'],['VIDEO','DIRECTOR']];
const PROJECTS=['ABYAN CAPITAL','morganics','INTELLIGNCE','THE CREATIVE OAK','AppTech'];
const HOLD=3600,TRANSITION=570;
function useReducedMotion(){
 const [value,setValue]=useState(false);
 useEffect(()=>{const m=matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setValue(m.matches);change();m.addEventListener('change',change);return()=>m.removeEventListener('change',change)},[]);
 return value;
}
function RoleLines({lines}){return <>{lines.map((line,i)=><span className="p0h-role-line" key={i+'-'+line}>{line}</span>)}</>}
function Roles(){
 const [index,setIndex]=useState(0),[transition,setTransition]=useState(false),[paused,setPaused]=useState(false),[visible,setVisible]=useState(true);
 const reduced=useReducedMotion();
 const timerRef=useRef(0),pausedRef=useRef(false);
 useEffect(()=>{const fn=()=>setVisible(!document.hidden);fn();document.addEventListener('visibilitychange',fn);return()=>document.removeEventListener('visibilitychange',fn)},[]);
 useEffect(()=>{if(reduced||paused||!visible||transition)return;
  timerRef.current=setTimeout(()=>{timerRef.current=0;if(!pausedRef.current)setTransition(true)},HOLD);
  return()=>{clearTimeout(timerRef.current);timerRef.current=0};
 },[index,reduced,paused,visible,transition]);
 useEffect(()=>{if(!transition)return;const t=setTimeout(()=>{setIndex(i=>(i+1)%ROLES.length);setTransition(false)},TRANSITION);return()=>clearTimeout(t)},[transition]);
 return <div className="p0h-role-group" data-p0h-role-root>
  <div className="p0h-role-viewport" aria-hidden="true">
   <div className={'p0h-role-current'+(transition?' is-leaving':'')+(index===1?' is-long':'')} data-p0h-current><RoleLines lines={ROLES[index]}/></div>
   <div className={'p0h-role-incoming'+(transition?' is-arriving':'')+((index+1)%ROLES.length===1?' is-long':'')}><RoleLines lines={ROLES[(index+1)%ROLES.length]}/></div>
  </div>
  {!reduced&&<button className="p0h-motion-control" type="button" aria-pressed={paused} aria-label={paused?'Resume rotating professional titles':'Pause rotating professional titles'} onClick={()=>{pausedRef.current=!pausedRef.current;if(pausedRef.current){clearTimeout(timerRef.current);timerRef.current=0}setPaused(pausedRef.current)}}><span aria-hidden="true">{paused?'▶':'Ⅱ'}</span></button>}
 </div>;
}
function ProjectMark({name}){return <span className={'p0h-project-mark p0h-mark-'+name.toLowerCase().replace(/[^a-z]+/g,'-')}>{name}</span>}
function Projects(){
 const [paused,setPaused]=useState(false),reduced=useReducedMotion();
 return <div className={'p0h-project-slider'+(paused?' is-paused':'')} data-p0h-slider>
  <button className="p0h-project-heading" type="button" aria-pressed={paused} aria-label={paused?'Resume the selected project slider':'Pause the selected project slider'} onClick={()=>setPaused(v=>!v)}>SELECTED PROJECTS</button>
  <div className="p0h-project-window" role="group" aria-label={'Selected project and venture references: '+PROJECTS.join(', ')+'. Not a list of verified commissions.'}>
   {[0,1].map(row=><div className={'p0h-project-track p0h-project-track-'+row} key={row} aria-hidden="true">
    {[0,1].map(repeat=><div className="p0h-project-set" key={repeat}>{(row?[...PROJECTS].reverse():PROJECTS).map(name=><ProjectMark name={name} key={name}/>)}</div>)}
   </div>)}
  </div>
  {reduced&&<span className="p0h-sr-only">Motion is disabled; project references remain available.</span>}
 </div>;
}
function Summary(){return <div className="p0h-summary-content" data-p0h-summary>
 <span className="p0h-kicker">WHAT I CONNECT</span>
 <p className="p0h-value-title">One point of view.<span>Across every medium.</span></p>
 <p className="p0h-value-copy">I connect brand strategy, digital products, creative campaigns and moving images to build experiences that work.</p>
 <Projects/>
 </div>}
export default function HeroRefinement(){
 const [targets,setTargets]=useState(null);
 useEffect(()=>{
  const root=document.querySelector('.portfolio-root .portfolio-hero'),heading=root?.querySelector('#hero-heading'),message=root?.querySelector('.hero-message'),summary=root?.querySelector('.hero-summary');
  if(!root||!heading||!message||!summary)return;
  const originals=[...heading.children],previous=originals.map(el=>el.getAttribute('aria-hidden'));
  originals.forEach(el=>el.setAttribute('aria-hidden','true'));
  root.classList.add('p0h-enhanced');setTargets({heading,message,summary});
  return()=>{root.classList.remove('p0h-enhanced');originals.forEach((el,i)=>previous[i]===null?el.removeAttribute('aria-hidden'):el.setAttribute('aria-hidden',previous[i]))};
 },[]);
 if(!targets)return null;
 return <>
  {createPortal(<span className="p0h-sr-only" data-p0h-semantic>Hadi Hassan, Creative Director and Product Design Leader</span>,targets.heading)}
  {createPortal(<Roles/>,targets.message)}
  {createPortal(<Summary/>,targets.summary)}
 </>;
}
