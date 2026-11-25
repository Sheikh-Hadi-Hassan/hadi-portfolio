const ID=/^[a-z][a-z0-9-]{1,62}$/;
const SLUG=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MEDIA=/^\/assets\/[a-zA-Z0-9_/-]+\.(?:webp|png|jpe?g)$/;
const VALID=new Set(['draft','published','hidden']);
const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const assert=(ok,message)=>{if(!ok)throw Error(message)};
export function validateCategories(categories){
 assert(Array.isArray(categories)&&categories.length<=100,'CATEGORY_REGISTRY_INVALID');
 const ids=new Set();
 for(const c of categories){
  assert(c&&typeof c==='object'&&!Array.isArray(c),'CATEGORY_INVALID');
  assert(typeof c.id==='string'&&ID.test(c.id)&&c.id!=='all'&&!ids.has(c.id),'CATEGORY_ID_INVALID');
  assert(typeof c.label==='string'&&c.label.trim()&&c.label.length<=64,'CATEGORY_LABEL_INVALID');
  assert(Number.isSafeInteger(c.order)&&c.order>=0&&c.order<=9999,'CATEGORY_ORDER_INVALID');
  assert(['active','archived'].includes(c.status),'CATEGORY_STATUS_INVALID');
  ids.add(c.id);
 }
 return categories.slice().sort((a,b)=>a.order-b.order||a.id.localeCompare(b.id));
}
export function validateProjects(projects,categories){
 const ids=new Set(validateCategories(categories).map(c=>c.id)),seen=new Set();
 assert(Array.isArray(projects)&&projects.length<=2000,'PROJECT_REGISTRY_INVALID');
 for(const p of projects){
  assert(p&&typeof p.slug==='string'&&SLUG.test(p.slug)&&!seen.has(p.slug),'PROJECT_SLUG_INVALID');
  seen.add(p.slug);
  assert(typeof p.title==='string'&&p.title.trim()&&p.title.length<=250,'PROJECT_TITLE_INVALID');
  const m=p.portfolio;
  assert(m&&typeof m==='object'&&!Array.isArray(m),'PROJECT_METADATA_REQUIRED:'+p.slug);
  assert(VALID.has(m.visibility),'PROJECT_VISIBILITY_INVALID:'+p.slug);
  assert(Number.isSafeInteger(m.displayOrder)&&m.displayOrder>=0&&m.displayOrder<=999999,'PROJECT_ORDER_INVALID:'+p.slug);
  assert(Array.isArray(m.categoryIds)&&m.categoryIds.length<=20&&new Set(m.categoryIds).size===m.categoryIds.length,'PROJECT_CATEGORY_INVALID:'+p.slug);
  assert(m.categoryIds.every(id=>ids.has(id)),'PROJECT_UNKNOWN_CATEGORY:'+p.slug);
  const cover=m.cover||p.hero;
  assert(typeof cover==='string'&&MEDIA.test(cover)&&!cover.includes('..'),'PROJECT_COVER_INVALID:'+p.slug);
  for(const key of ['cardTitle','cardCategory'])if(m[key]!==undefined)assert(typeof m[key]==='string'&&m[key].trim()&&m[key].length<=250,'PROJECT_CARD_TEXT_INVALID');
 }
 return projects;
}
export function publishedCatalog(projects,categories){
 validateProjects(projects,categories);
 return projects.filter(p=>p.portfolio.visibility==='published').sort((a,b)=>a.portfolio.displayOrder-b.portfolio.displayOrder||a.slug.localeCompare(b.slug));
}
export function categoryOptions(projects,categories){
 const published=publishedCatalog(projects,categories);
 return [{id:'all',label:'All',count:published.length},...validateCategories(categories).filter(c=>c.status==='active').map(c=>({...c,count:published.filter(p=>p.portfolio.categoryIds.includes(c.id)).length})).filter(c=>c.count>0)];
}
export function filterProjects(projects,categories,id='all'){
 const opts=categoryOptions(projects,categories),published=publishedCatalog(projects,categories);
 assert(opts.some(c=>c.id===id),'CATEGORY_FILTER_UNKNOWN');
 return id==='all'?published:published.filter(p=>p.portfolio.categoryIds.includes(id));
}
export function renderSelectedWork(projects,categories){
 const all=publishedCatalog(projects,categories),filters=categoryOptions(projects,categories),total=all.length;
 const num=(value,t=total)=>String(value).padStart(Math.max(2,String(t).length),'0');
 const toolbar='<div class="v2sw-gallery-toolbar" data-gallery-toolbar><div class="v2sw-gallery-filters" role="group" aria-label="Filter portfolio projects">'+filters.map(c=>'<button type="button" class="v2sw-gallery-filter liquid-glass'+(c.id==='all'?' is-active':'')+'" data-gallery-filter="'+esc(c.id)+'" aria-pressed="'+String(c.id==='all')+'">'+esc(c.label)+' <span aria-hidden="true">'+c.count+'</span></button>').join('')+'</div><div class="v2sw-gallery-meta"><span data-gallery-status role="status" aria-live="polite" aria-atomic="true">Showing '+total+' of '+total+' projects</span><div class="v2sw-gallery-controls" aria-label="Portfolio navigation"><button type="button" class="liquid-glass" data-gallery-step="-1" aria-label="Previous project">←</button><button type="button" class="liquid-glass" data-gallery-step="1" aria-label="Next project">→</button></div></div></div>';
 const heading='<div class="v2sw-slide v2sw-slide-heading"><span class="bf-kicker" data-gallery-heading-count>SELECTED PROJECTS / '+num(total?1:0)+'–'+num(total)+'</span><h2 class="v2sw-heading">Selected work<br>&amp; explorations.</h2><p>'+total+' projects. Different challenges. A look at how strategy becomes something you can see, use and recognise.</p><span class="bf-scroll-hint">SCROLL TO EXPLORE →</span><span class="bf-swipe-hint">SWIPE TO EXPLORE →</span></div>';
 const cards=all.map((p,i)=>{const m=p.portfolio,title=m.cardTitle||p.title,category=m.cardCategory||p.category||'',cover=m.cover||p.hero;return '<div class="v2sw-slide v2sw-card-slide" data-gallery-card data-gallery-slug="'+esc(p.slug)+'" data-gallery-category-ids="'+esc(m.categoryIds.join(' '))+'"><div class="v2sw-card-reveal"><a class="v2sw-card" href="/'+esc(p.slug)+'/"><div class="v2sw-card-media"><img src="'+esc(cover)+'"'+(Number.isInteger(m.coverWidth)&&Number.isInteger(m.coverHeight)?' width="'+m.coverWidth+'" height="'+m.coverHeight+'"':'')+' loading="lazy" decoding="async" alt="'+esc(title)+' — '+esc(category)+'"><span class="v2sw-card-tag">'+esc(category)+'</span></div><div class="v2sw-card-footer"><h3 class="v2sw-card-title">'+esc(title)+'</h3><span class="bf-case-status" aria-hidden="true">↗</span></div><span class="bf-project-count" data-gallery-number>'+num(i+1)+' / '+num(total)+'</span></a></div></div>'}).join('');
 const cta='<div class="v2sw-slide v2sw-slide-cta"><h2>Explore the thinking<br>behind the work.</h2><a class="bf-button" href="/archive/">Read the case studies ↗</a></div>';
 return '<section class="bf-work" id="work" aria-label="Selected work and explorations" data-portfolio-gallery>'+toolbar+'<div class="v2sw-track" tabindex="0" aria-label="Project gallery. Swipe or scroll horizontally to explore.">'+heading+cards+cta+'</div><p class="bf-sr-only" data-gallery-empty'+(total?' hidden':'')+'>No projects match this category.</p></section>';
}
