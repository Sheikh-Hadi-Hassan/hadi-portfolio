import {notFound} from 'next/navigation';
import pages from '../../../../generated/pages.json';
import {PageMarkup,metadataFor} from '../../page-content';
const slugs=['creative-direction','product-development','video-production'];
export const dynamicParams=false;
export function generateStaticParams(){return slugs.map(slug=>({slug}));}
export async function generateMetadata({params}){const {slug}=await params;if(!slugs.includes(slug))notFound();return metadataFor('expertise/'+slug);}
export default async function ExpertisePage({params}){const {slug}=await params;if(!slugs.includes(slug))notFound();return <PageMarkup name={'expertise/'+slug}/>;}
