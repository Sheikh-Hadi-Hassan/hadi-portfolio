'use client';
import dynamic from 'next/dynamic';
import {usePathname} from 'next/navigation';
// Heavy home-only animation code is not needed by case studies or the archive.
const Motion=dynamic(()=>import('./motion'),{ssr:false});
const ReelMotion=dynamic(()=>import('./reel-motion'),{ssr:false});
const FolderMotion=dynamic(()=>import('./folder-motion'),{ssr:false});
const ProcessMotion=dynamic(()=>import('./process-motion'),{ssr:false});
const ProcessWebGL=dynamic(()=>import('./process-webgl'),{ssr:false});
const HeroDither=dynamic(()=>import('./hero-dither'),{ssr:false});
export default function HomeExperience(){const path=usePathname();if(path!=='/')return null;return <><Motion/><ReelMotion/><FolderMotion/><ProcessMotion/><ProcessWebGL/><HeroDither/></>}
