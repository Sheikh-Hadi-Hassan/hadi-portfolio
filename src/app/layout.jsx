import './globals.css';
import '../styles/command.css';
import '../styles/intro.css';
import '../styles/footer.css';
import HomeExperience from './home-experience';
import FooterMotion from './footer-motion';
import SocialCarousel from './social-carousel';
import IntroLoader from './intro-loader';
import Script from 'next/script';
import versions from '../../generated/assets.json';
const asset=(path)=>path+'?v='+versions[path];
export default function Layout({children}){return <html lang="en" suppressHydrationWarning><head><link rel="preload" as="image" href="/assets/intellignce-loader-logo.webp"/><script dangerouslySetInnerHTML={{__html:"document.documentElement.classList.add('is-loading');setTimeout(function(){document.documentElement.classList.remove('is-loading','is-opening');var c=document.getElementById('site-content');if(c)c.inert=false},9000);"}}/><link rel="stylesheet" href={asset("/assets/fonts/fonts.css")}/><link rel="stylesheet" href={asset("/style.css")}/><link rel="stylesheet" href={asset("/hero.css")}/><link rel="stylesheet" href={asset("/bayfi-port.css")}/><link rel="stylesheet" href={asset("/bayfi-brand.css")}/><link rel="icon" href="/assets/favicon.svg"/></head><body><IntroLoader/><div id="site-content">{children}</div><Script src={asset("/script.js")} strategy="afterInteractive"/><Script id="intellignce-support-widget" src="/intellignce-support/widget-v9.js?v=9010" strategy="lazyOnload"/><HomeExperience/><FooterMotion/><SocialCarousel/></body></html>}
