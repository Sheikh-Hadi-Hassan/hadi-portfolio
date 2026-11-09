const fs=require('node:fs'),path=require('node:path');
const widths=Object.freeze([320,360,375,390,430,768,1024,1280,1440]);
function plan(projects){
 if(!Array.isArray(projects)||projects.length!==15||projects.some(p=>!p||typeof p.slug!=='string'||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)))throw Error('ACCEPTANCE_PROJECT_INVENTORY_INVALID');
 const routes=['/','/archive/',...projects.map(p=>'/'+p.slug+'/'),...['about','resume','contact','privacy','work'].map(p=>'/'+p+'/')];
 if(new Set(routes).size!==22)throw Error('ACCEPTANCE_ROUTE_COLLISION');
 return routes.flatMap(route=>widths.map(width=>({route,width,id:`${route}@${width}`})));
}
function verifyRoutes(root,cases){
 const visit=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()&&!e.name.startsWith('_')?visit(path.join(d,e.name)):e.isFile()&&e.name==='index.html'?[path.join(d,e.name)]:[]);
 const actual=visit(root).map(f=>'/'+path.relative(root,path.dirname(f)).split(path.sep).filter(Boolean).join('/')+'/').map(r=>r==='//'?'/':r).filter(r=>r!=='/404/').sort();
 const expected=[...new Set(cases.map(c=>c.route))].sort();
 if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error('ACCEPTANCE_EXPORT_ROUTE_MISMATCH');
}
function report(cases,results,blockedReason=null){
 if(results.length>cases.length||new Set(results.map(r=>r.id)).size!==results.length||results.some(r=>!cases.some(c=>c.id===r.id&&c.route===r.route&&c.width===r.width)||!['PASS','FAIL'].includes(r.status)))throw Error('ACCEPTANCE_EVIDENCE_INVALID');
 return {scope:'approved_production_export_local_browser_no_external_operations',total:cases.length,executed:results.length,passed:results.filter(r=>r.status==='PASS').length,failed:results.filter(r=>r.status==='FAIL').length,blocked:cases.length-results.length,blockedReason,cases:results};
}
module.exports={widths,plan,verifyRoutes,report};
