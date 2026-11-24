'use client';
import {useEffect,useState,useRef} from 'react';
import {createPortal} from 'react-dom';
import '../styles/hero-refinement.css';

// P0-HERO-01 V5: protected hero markup and original motion sources remain untouched.
// Professional identity and direct links remain stable while display titles rotate.
const ROLES=[['CREATIVE','DIRECTOR'],['BRAND','STRATEGIST'],['PRODUCT','DESIGNER'],['VIDEO','DIRECTOR']];
const LOGO_ROWS=[[{"name":"Abyan Capital","src":"/assets/client-mark-01.png","width":2048,"height":2048,"style":{"--logo-width":"98.85px","--logo-ratio":"1368/350","--source-width":"149.7076%","--source-left":"-24.8538%","--source-top":"-242.5714%"}},{"name":"Jules Capital Partners","src":"/assets/client-mark-02.png","width":2048,"height":2048,"style":{"--logo-width":"106.94px","--logo-ratio":"1482/324","--source-width":"138.1916%","--source-left":"-19.0958%","--source-top":"-266.0494%"}},{"name":"Morganics","src":"/assets/client-mark-04.png","width":2048,"height":2048,"style":{"--logo-width":"115.06px","--logo-ratio":"1504/284","--source-width":"136.1702%","--source-left":"-18.0851%","--source-top":"-305.9859%"}},{"name":"OmniHelp","src":"/assets/client-mark-05.png","width":2048,"height":2048,"style":{"--logo-width":"92.91px","--logo-ratio":"1402/406","--source-width":"146.0770%","--source-left":"-23.0385%","--source-top":"-202.2167%"}},{"name":"The Creative OAK","src":"/assets/client-mark-14.webp","width":600,"height":600,"style":{"--logo-width":"80.06px","--logo-ratio":"482/188","--source-width":"124.4813%","--source-left":"-12.2407%","--source-top":"-109.5745%"}},{"name":"Glitch","src":"/assets/client-mark-19.webp","width":600,"height":600,"style":{"--logo-width":"89.38px","--logo-ratio":"441/138","--source-width":"136.0544%","--source-left":"-17.9138%","--source-top":"-167.3913%"}}],[{"name":"BW Strike","src":"/assets/client-mark-13.webp","width":600,"height":600,"style":{"--logo-width":"74.38px","--logo-ratio":"416/188","--source-width":"144.2308%","--source-left":"-22.1154%","--source-top":"-109.5745%"}},{"name":"The Creative Skills","src":"/assets/client-mark-09.webp","width":600,"height":600,"style":{"--logo-width":"72.33px","--logo-ratio":"406/194","--source-width":"147.7833%","--source-left":"-23.8916%","--source-top":"-104.6392%"}},{"name":"Glacier Engineering","src":"/assets/client-mark-16.webp","width":600,"height":600,"style":{"--logo-width":"48.00px","--logo-ratio":"306/306","--source-width":"196.0784%","--source-left":"-48.0392%","--source-top":"-48.0392%"}},{"name":"Salezpeak","src":"/assets/client-mark-17.webp","width":600,"height":600,"style":{"--logo-width":"54.21px","--logo-ratio":"362/308","--source-width":"165.7459%","--source-left":"-32.8729%","--source-top":"-47.4026%"}},{"name":"Raz4","src":"/assets/client-mark-18.webp","width":600,"height":600,"style":{"--logo-width":"73.24px","--logo-ratio":"412/192","--source-width":"145.6311%","--source-left":"-25.9709%","--source-top":"-110.4167%"}},{"name":"Liberty Land","src":"/assets/client-mark-15.webp","width":600,"height":600,"style":{"--logo-width":"61.94px","--logo-ratio":"356/232","--source-width":"168.5393%","--source-left":"-34.2697%","--source-top":"-79.3103%"}}]];
const HOLD=2500,TRANSITION=500;

function useReducedMotion(){
 const [reduced,setReduced]=useState(false);
 useEffect(()=>{
  const query=window.matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>setReduced(query.matches);
  update();
  query.addEventListener('change',update);
  return()=>query.removeEventListener('change',update);
 },[]);
 return reduced;
}
function RoleLines({lines}){return <>{lines.map((line,i)=><span className="p0h-role-line" key={i+'-'+line}>{line}{i===lines.length-1&&<span className="p0h-role-period" aria-hidden="true" data-p0h-period>.</span>}</span>)}</>}
function Roles({paused,reduced}){
 const [index,setIndex]=useState(0),[transition,setTransition]=useState(false),[visible,setVisible]=useState(true),[hovered,setHovered]=useState(false);
 const timer=useRef(0);
 useEffect(()=>{
  const update=()=>setVisible(!document.hidden);
  update();document.addEventListener('visibilitychange',update);
  return()=>document.removeEventListener('visibilitychange',update);
 },[]);
 useEffect(()=>{
  // Hover stops the next title cycle. An in-flight 500 ms transition completes cleanly.
  if(reduced||paused||hovered||!visible||transition)return;
  timer.current=window.setTimeout(()=>setTransition(true),HOLD);
  return()=>{window.clearTimeout(timer.current);timer.current=0};
 },[index,reduced,paused,hovered,visible,transition]);
 useEffect(()=>{
  if(!transition)return;
  const timeout=window.setTimeout(()=>{setIndex(i=>(i+1)%ROLES.length);setTransition(false)},TRANSITION);
  return()=>window.clearTimeout(timeout);
 },[transition]);
 return <div className="p0h-role-group" data-p0h-role-root data-p0h-cycle-ms={HOLD+TRANSITION} data-p0h-hovered={hovered?'true':'false'} data-p0h-paused={paused||hovered||!visible?'true':'false'}
  onPointerEnter={event=>{if(event.pointerType==='mouse'||event.pointerType==='pen')setHovered(true)}}
  onPointerLeave={event=>{if(event.pointerType==='mouse'||event.pointerType==='pen')setHovered(false)}}>
  <div className="p0h-role-viewport" aria-hidden="true">
   <div className={'p0h-role-current'+(transition?' is-leaving':'')+(index===1?' is-long':'')} data-p0h-current><RoleLines lines={ROLES[index]}/></div>
   <div className={'p0h-role-incoming'+(transition?' is-arriving':'')+((index+1)%ROLES.length===1?' is-long':'')}><RoleLines lines={ROLES[(index+1)%ROLES.length]}/></div>
  </div>
 </div>;
}
function Logo({item}){
 return <span className="p0h-logo-tile" aria-hidden="true"><span className="bf-client-ink p0h-logo-ink" style={item.style}>
  <img src={item.src} width={item.width} height={item.height} alt="" loading="eager" decoding="async"/>
 </span></span>;
}
function Projects({paused,reduced}){
 return <div className={'p0h-project-slider'+(paused?' is-paused':'')} data-p0h-slider>
  <span className="p0h-project-heading">SELECTED IDENTITIES &amp; PROJECTS</span>
  <div className="p0h-project-window" role="group" aria-label="Selected identity and project artwork">
   {LOGO_ROWS.map((items,row)=><div className={'p0h-project-track p0h-project-track-'+row} key={row} aria-hidden="true">
    {[0,1].map(repeat=><div className="p0h-project-set" key={repeat}>{items.map(item=><Logo item={item} key={item.src}/>)}</div>)}
   </div>)}
  </div>
  <span className="p0h-sr-only">{LOGO_ROWS.flat().map(x=>x.name).join(', ')}. A selection of identity and project references; not a list of verified client commissions.</span>
 </div>;
}
function Summary({paused,setPaused,reduced}){
 return <div className="p0h-summary-content" data-p0h-summary>
  <div className="p0h-summary-eyebrow"><span className="p0h-kicker">WHAT I CONNECT</span>
   {!reduced&&<button type="button" className="p0h-motion-control" aria-pressed={paused} aria-label={paused?'Resume hero motion':'Pause hero motion'} onClick={()=>setPaused(v=>!v)}>{paused?'Resume motion':'Pause motion'}</button>}
  </div>
  <p className="p0h-value-title">One vision.<span>Every touchpoint.</span></p>
  <p className="p0h-value-copy">From a brand's first impression to the way its digital products work, I connect identity, UX, campaigns and visual storytelling under one creative direction.</p>
  <nav className="p0h-expertise-links" aria-label="Explore my expertise">
   <a href="/expertise/creative-direction/">Brand &amp; creative direction</a>
   <a href="/expertise/product-development/">Product design</a>
   <a href="/expertise/video-production/">Video production</a>
  </nav>
  <Projects paused={paused} reduced={reduced}/>
 </div>;
}
export default function HeroRefinement(){
 const [targets,setTargets]=useState(null),[paused,setPaused]=useState(false);
 const reduced=useReducedMotion();
 useEffect(()=>{
  const root=document.querySelector('.portfolio-root .portfolio-hero');
  const heading=root?.querySelector('#hero-heading'),message=root?.querySelector('.hero-message'),summary=root?.querySelector('.hero-summary');
  const greeting=root?.querySelector('.hero-greeting'),actions=root?.querySelector('.hero-project-actions');
  const primary=actions?.querySelector('a:first-child span:first-child'),resume=actions?.querySelector('.hero-work-link');
  const lead=greeting?.querySelector('span'),descriptor=greeting?.querySelector('p');
  if(!root||!heading||!message||!summary||!primary||!resume||!lead||!descriptor)return;
  const originals=[...heading.children],previous=originals.map(el=>el.getAttribute('aria-hidden'));
  const prior={primary:primary.textContent,resumeHTML:resume.innerHTML,resumeHref:resume.getAttribute('href'),lead:lead.textContent,descriptorHTML:descriptor.innerHTML};
  originals.forEach(el=>el.setAttribute('aria-hidden','true'));
  lead.textContent="HELLO, I'M HADI HASSAN.";
  descriptor.innerHTML='CREATIVE DIRECTOR &amp;<br>MULTIDISCIPLINARY DESIGN LEADER';
  primary.textContent='Discuss a role or project';
  resume.setAttribute('href','/resume/');
  const label=[...resume.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);
  if(label)label.textContent='VIEW RÉSUMÉ ';
  else resume.insertBefore(document.createTextNode('VIEW RÉSUMÉ '),resume.firstChild);
  root.classList.add('p0h-enhanced');
  setTargets({heading,message,summary});
  return()=>{
   root.classList.remove('p0h-enhanced');
   originals.forEach((el,i)=>previous[i]===null?el.removeAttribute('aria-hidden'):el.setAttribute('aria-hidden',previous[i]));
   primary.textContent=prior.primary;resume.innerHTML=prior.resumeHTML;resume.setAttribute('href',prior.resumeHref);
   lead.textContent=prior.lead;descriptor.innerHTML=prior.descriptorHTML;
  };
 },[]);
 if(!targets)return null;
 return <>
  {createPortal(<span className="p0h-sr-only" data-p0h-semantic>Hadi Hassan, Creative Director and multidisciplinary design leader specializing in brand strategy, product design and video direction.</span>,targets.heading)}
  {createPortal(<Roles paused={paused} reduced={reduced}/>,targets.message)}
  {createPortal(<Summary paused={paused} setPaused={setPaused} reduced={reduced}/>,targets.summary)}
 </>;
}
