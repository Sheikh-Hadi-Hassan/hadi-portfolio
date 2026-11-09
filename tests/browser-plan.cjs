const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {plan,verifyRoutes,report,widths}=require('../scripts/qa/browser-plan.cjs');
const projects=JSON.parse(fs.readFileSync('src/data/projects.json'));const cases=plan(projects);
assert.equal(cases.length,198);assert.equal(new Set(cases.map(c=>c.id)).size,198);assert.equal(new Set(cases.map(c=>c.route)).size,22);assert.equal(widths.length,9);
assert.throws(()=>plan([...projects,{slug:'extra'}]));assert.throws(()=>plan(projects.map((p,i)=>i? p:{...p,slug:projects[1].slug})));
assert.equal(report(cases,[],'APPROVED_HERO_REQUIRED').executed,0);assert.equal(report(cases,[]).blocked,198);
let r=report(cases,[{...cases[0],status:'PASS'},{...cases[1],status:'FAIL'}]);assert.equal(r.executed,2);assert.equal(r.failed,1);assert.equal(r.blocked,196);assert.throws(()=>report(cases,[{...cases[0],status:'PASS'},{...cases[0],status:'PASS'}]));assert.throws(()=>report(cases,[{id:'unknown',status:'PASS'}]));
assert.throws(()=>report(cases,[{...cases[0],route:'/wrong/',status:'PASS'}]));
const root=fs.mkdtempSync(path.join(os.tmpdir(),'acceptance-plan-'));try{for(const route of new Set(cases.map(c=>c.route))){const dir=path.join(root,route);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),'fixture')}verifyRoutes(root,cases);fs.mkdirSync(path.join(root,'404'));fs.writeFileSync(path.join(root,'404/index.html'),'framework fallback');verifyRoutes(root,cases);fs.mkdirSync(path.join(root,'extra'));fs.writeFileSync(path.join(root,'extra/index.html'),'fixture');assert.throws(()=>verifyRoutes(root,cases));}finally{fs.rmSync(root,{recursive:true,force:true})}
console.log('PASS: 22-route × 9-width plan, exact export inventory, duplicate evidence rejection and interrupted-run accounting. Zero browser acceptance cases executed.');
