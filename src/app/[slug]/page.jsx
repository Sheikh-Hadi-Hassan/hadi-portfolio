import {notFound} from 'next/navigation';
import pages from '../../../generated/pages.json';
import {PageMarkup, metadataFor} from '../page-content';
export const dynamicParams=false;
export function generateStaticParams(){return Object.keys(pages).filter(k=>k!=='home').map(slug=>({slug}))}
export async function generateMetadata({params}){const slug=(await params).slug;if(!Object.hasOwn(pages,slug))notFound();return metadataFor(slug)}
export default async function Page({params}){const slug=(await params).slug;if(!Object.hasOwn(pages,slug))notFound();return <PageMarkup name={slug}/>}
