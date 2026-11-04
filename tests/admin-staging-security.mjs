import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';
import {withStagingLock} from '../scripts/admin/staging-lock.mjs';import {stageCMS} from '../scripts/admin/stage-cms.mjs';import {stageSeraConfig} from '../scripts/admin/stage-sera-config.mjs';import {publishIsolatedCMS} from '../scripts/admin/cms-release.mjs';
const base=fs.mkdtempSync(path.join(os.tmpdir(),'staging-security-')),root=path.join(base,'staging/site');fs.mkdirSync(root,{recursive:true});const victim=path.join(base,'protected-fixture.txt');fs.writeFileSync(victim,'Preserve this independent file');
const one={schemaVersion:1,releaseId:crypto.randomUUID(),projects:[],profile:{},previews:[]};one.integrity=crypto.createHash('sha256').update(JSON.stringify(one)).digest('hex');const config=JSON.parse(fs.readFileSync('docs/admin/public-config-fixture.json'));
try{
 for(const [filename,operation] of [
  ['cms-current.json.tmp',()=>stageCMS(one,root)],['runtime-config.json.tmp',()=>stageSeraConfig(config,root)],['cms-live.json.tmp',()=>publishIsolatedCMS(root)],
  ...['cms-current.json','cms-previous.json','cms-live.json','cms-live.previous.json','cms-live.previous.json.tmp','runtime-config.json','runtime-config.previous.json','runtime-config.previous.json.tmp'].map(name=>[name,()=>withStagingLock(root,()=>{throw Error('Unsafe operation reached')})])
 ]){const target=path.join(root,filename);fs.linkSync(victim,target);assert.throws(operation,/STAGING_FILE_UNSAFE/,filename);assert.equal(fs.readFileSync(victim,'utf8'),'Preserve this independent file');assert(!fs.existsSync(path.join(root,'.publication-lock')));fs.unlinkSync(target);}
 const bad=path.join(root,'cms-current.json.tmp');fs.mkdirSync(bad);assert.throws(()=>stageCMS(one,root),/STAGING_FILE_UNSAFE/);fs.rmdirSync(bad);
 stageCMS(one,root);const next={...one,releaseId:crypto.randomUUID()};delete next.integrity;next.integrity=crypto.createHash('sha256').update(JSON.stringify(next)).digest('hex');stageCMS(next,root,{expectedRelease:one.releaseId});stageCMS(null,root,{expectedRelease:next.releaseId,rollback:true});stageSeraConfig(config,root);
 const beforeFailure=fs.readFileSync(path.join(root,'cms-current.json'),'utf8'),rename=fs.renameSync;
 try{fs.renameSync=(from,to)=>{if(to===path.join(root,'cms-current.json.tmp'))throw Error('INJECTED_RENAME_FAILURE');return rename(from,to)};assert.throws(()=>stageCMS(next,root,{expectedRelease:one.releaseId}),/INJECTED_RENAME_FAILURE/);}finally{fs.renameSync=rename}
 assert.equal(fs.readFileSync(path.join(root,'cms-current.json'),'utf8'),beforeFailure);assert(!fs.readdirSync(root).some(n=>n.startsWith('.write-')));assert(!fs.existsSync(path.join(root,'.publication-lock')));
 assert.equal(fs.statSync(root).mode&0o777,0o700);for(const name of ['cms-current.json','cms-previous.json','runtime-config.json'])assert.equal(fs.statSync(path.join(root,name)).mode&0o777,0o600,name);assert.equal(fs.readFileSync(victim,'utf8'),'Preserve this independent file');
 console.log('PASS: mutable CMS/Sera/pointer hardlink and directory rejection, preserved victim, failed-write recovery, lock/temp cleanup, 0700/0600 modes and rollback. Isolated staging only.');
}finally{fs.rmSync(base,{recursive:true,force:true})}
