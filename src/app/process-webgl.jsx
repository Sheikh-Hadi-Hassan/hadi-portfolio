'use client';
import {useEffect,useState} from 'react';
import {createPortal} from 'react-dom';
import dynamic from 'next/dynamic';
const Visual=dynamic(()=>import('./reference-process-visual'),{ssr:false});
const variants=['discovery','ideation','design','launch'];
export default function ProcessWebGL(){const[targets,setTargets]=useState([]);useEffect(()=>{const nodes=[...document.querySelectorAll('.bf-process .v2hw-card-visual')];const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setTargets(nodes);observer.disconnect()}},{rootMargin:'300px'});const section=document.querySelector('.bf-process');if(section)observer.observe(section);return()=>observer.disconnect()},[]);return targets.map((target,i)=>createPortal(<Visual variant={variants[i]}/>,target,variants[i]));}
