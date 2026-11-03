import fs from 'node:fs';import vm from 'node:vm';import {fileURLToPath} from 'node:url';
const validate=vm.runInNewContext(fs.readFileSync(fileURLToPath(new URL('../../integrations/leads-portal/CmsContract.gs',import.meta.url)),'utf8')+';ccValidateCase_');
export function validateCase(data){try{return validate(data)}catch{throw Error('CMS_CASE_INVALID')}}
export function casePatch(data,target=null){
 validateCase(data);const {replacements=[],...doc}=data;
 if(!target&&replacements.length)throw Error('CMS_REPLACEMENT_INVALID');
 const next={...target,...structuredClone(doc),source_available:target?.source_available??false};
 if(target){const oldSources=new Set(target.images.map(i=>i.src));for(const r of replacements)if(!oldSources.has(r.from))throw Error('CMS_REPLACEMENT_INVALID');
 const mapping=new Map(replacements.map(r=>[r.from,r.to]));
 const chapters=doc.gallery_chapters?.length?doc.gallery_chapters:target.gallery_chapters;
 if(target.gallery_chapters?.some(old=>!chapters?.some(c=>c.id===old.id)))throw Error('CMS_CHAPTER_ANCHOR_REMOVAL');
 if(chapters)next.gallery_chapters=chapters.map(c=>({...c,images:c.images.map(src=>mapping.get(src)||src)}));
 const active=new Set(next.images.map(i=>i.src));if(next.gallery_chapters?.some(c=>c.images.some(src=>!active.has(src))))throw Error('CMS_CHAPTER_IMAGE_MISSING');}
 return next;
}
const previewStyles=['site.css','case-study.css','bayfi-brand.css'].map(name=>fs.readFileSync(fileURLToPath(new URL('../../src/styles/'+name,import.meta.url)),'utf8')).join('\n');
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderCasePreview(p,template,nextProject=p){
 if(p.gallery_chapters?.length)template=fs.readFileSync(fileURLToPath(new URL('../../src/pages/'+(p.slug==='morganics'?'morganics-case.html':'editorial-case.html'),import.meta.url)),'utf8');
 const images=new Map(p.images.map(i=>[i.src,i]));
 const image=src=>{const i=images.get(src);if(!i)throw Error('CMS_CHAPTER_IMAGE_MISSING');return '<figure class="case-figure"><img src="'+esc(i.src)+'" width="'+i.width+'" height="'+i.height+'" loading="lazy" alt="'+esc(i.alt)+'"></figure>'};
 const chapters=(p.gallery_chapters||[]).map(c=>'<section class="morganics-chapter" id="'+esc(c.id)+'" aria-labelledby="'+esc(c.id)+'-title"><header class="morganics-chapter-heading"><div><span class="eyebrow">'+esc(c.label)+'</span><h2 id="'+esc(c.id)+'-title">'+esc(c.title)+'</h2></div><p>'+esc(c.copy)+'</p></header><div class="morganics-grid morganics-grid-'+esc(c.layout)+'">'+c.images.map(image).join('')+'</div></section>').join('');
 const articles=(p.article_sections||[]).map(a=>'<section class="editorial-block"><h2>'+esc(a.title)+'</h2><div>'+a.paragraphs.map(text=>'<p>'+esc(text)+'</p>').join('')+'</div></section>').join('');
 const values=Object.fromEntries(Object.entries(p).filter(([,v])=>typeof v==='string').map(([k,v])=>[k,esc(v)]));Object.assign(values,{design_copy:esc(p.design_copy||''),hero_width:p.hero_width,hero_height:p.hero_height,availability_note:'',top_carousel:'',article:articles,media:'',production_direction:p.slug==='fakhr-e-qoum'?'<section class="editorial-block"><h2>PRODUCTION DIRECTION</h2><p>'+esc(p.decision)+'</p></section>':'',chapter_gallery:chapters,chapter_index:'<nav class="morganics-index" aria-label="Case-study chapters">'+(p.gallery_chapters||[]).map(c=>'<a href="#'+esc(c.id)+'">'+esc(c.title)+'</a>').join('')+'</nav>',source_link:p.link?'<a href="'+esc(p.link)+'" rel="noopener noreferrer">View project</a>':'',system_title:esc(p.system_title||'THE SYSTEM'),design_title:esc(p.design_title||'DESIGN DEVELOPMENT'),next_slug:nextProject.slug,next_title:esc(nextProject.title),close_icon:'×',goals:'<ul>'+p.goals.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>',disciplines:'<p>'+esc(p.services)+'</p>',deliverables:'<ul>'+p.deliverables.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>',gallery:p.images.map(i=>'<figure class="case-figure"><img src="'+esc(i.src)+'" width="'+i.width+'" height="'+i.height+'" loading="lazy" alt="'+esc(i.alt)+'"></figure>').join('')});const body=template.replace(/\{\{(\w+)\}\}/g,(_,k)=>{if(!(k in values))throw Error('CMS_TEMPLATE_FIELD_MISSING:'+k+':'+p.slug);return values[k]});return '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(p.seo_title)+'</title><meta name="description" content="'+esc(p.seo_description)+'"><link rel="canonical" href="https://hadi.intellignce.net/'+p.slug+'/"><style>'+previewStyles+'</style><body class="case-page"><p role="status">Isolated CMS preview. Not published.</p>'+body+'</body></html>';}
