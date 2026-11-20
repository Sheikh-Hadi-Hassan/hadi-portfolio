'use client';
import dynamic from 'next/dynamic';
import {usePathname} from 'next/navigation';
// Share the selected-work motion with Product Design; keep other effects home-only.
const Motion=dynamic(()=>import('./motion'),{ssr:false});
const ReelMotion=dynamic(()=>import('./reel-motion'),{ssr:false});
const FolderMotion=dynamic(()=>import('./folder-motion'),{ssr:false});
const HeroDither=dynamic(()=>import('./hero-dither'),{ssr:false});
export default function HomeExperience(){const path=usePathname();if(path==='/expertise/product-development/'||path==='/expertise/product-development')return <Motion/>;if(path!=='/')return null;return <><Motion/><ReelMotion/><FolderMotion/><HeroDither/></>}

