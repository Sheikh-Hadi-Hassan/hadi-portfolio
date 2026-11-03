// Shared trusted-source schema used by Apps Script and the isolated publisher; no I/O.
function ccValidateCase_(d){
 const fail=()=>{throw Error('ADMIN_CASE_INVALID')};const plain=o=>o&&typeof o==='object'&&!Array.isArray(o);const txt=(v,max,required=true)=>{if(typeof v!=='string'||v.length>max||required&&!v.trim())fail()};
 const fields=['slug','title','deck','category','accent','client','services','intro','decision','system','design_copy','goals','deliverables','sections','link','hero','hero_width','hero_height','images','seo_title','seo_description','replacements'];
 if(!plain(d)||Object.keys(d).some(k=>!fields.includes(k)))fail();if(typeof d.slug!=='string'||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug)||d.slug.length>80||['about','work','archive','contact','privacy','resume','flow','systems-lab','404','index','api','admin','assets'].includes(d.slug))fail();
 for(const k of ['title','deck','category','client','services','seo_title','seo_description'])txt(d[k],500);for(const k of ['intro','decision','system','design_copy'])txt(d[k],5000);if(!/^#[a-fA-F0-9]{6}$/.test(d.accent))fail();
 for(const k of ['goals','deliverables','sections']){if(!Array.isArray(d[k])||!d[k].length||d[k].length>30)fail();d[k].forEach(v=>txt(v,500));}
 if(typeof d.link!=='string'||d.link.length>500||d.link&&!/^https:\/\/[^\s/@]+(?:\/[^\s]*)?$/.test(d.link))fail();
 const imagePath=p=>typeof p==='string'&&/^\/assets\/[a-zA-Z0-9_/-]+\.(webp|png|jpe?g)$/.test(p);const dimension=n=>Number.isInteger(n)&&n>0&&n<=8192;
 if(!Array.isArray(d.images)||!d.images.length||d.images.length>40)fail();const paths=new Set();for(const i of d.images){if(!plain(i)||Object.keys(i).some(k=>!['src','width','height','alt'].includes(k))||!imagePath(i.src)||paths.has(i.src)||!dimension(i.width)||!dimension(i.height))fail();txt(i.alt,500);paths.add(i.src);}
 if(!imagePath(d.hero)||!dimension(d.hero_width)||!dimension(d.hero_height)||!d.images.some(i=>i.src===d.hero&&i.width===d.hero_width&&i.height===d.hero_height))fail();
 if(d.replacements!==undefined){if(!Array.isArray(d.replacements)||d.replacements.length>40)fail();const from=new Set();for(const r of d.replacements){if(!plain(r)||Object.keys(r).some(k=>!['from','to'].includes(k))||!imagePath(r.from)||!paths.has(r.to)||from.has(r.from))fail();from.add(r.from);}}
 if(JSON.stringify(d).length>64000)fail();return d;
}
