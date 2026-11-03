"""Exercise the documented isolated owner workflow; no deployment or external service."""
import json,pathlib,subprocess,tempfile,uuid
with tempfile.TemporaryDirectory(prefix='cms-cli-') as tmp:
    root=pathlib.Path(tmp);target=root/'staging'/'cms';source=root/'approved.json'
    doc=json.loads(pathlib.Path('docs/admin/cms-export-fixture.json').read_text());source.write_text(json.dumps(doc))
    def run(*args):
        r=subprocess.run(['node','scripts/admin/cms-workflow.mjs',*map(str,args)],capture_output=True,text=True,check=True)
        result=json.loads(r.stdout);assert result['production'] is False;return result
    one=run('stage',source,target,'none');assert one['verified']
    run('publish',target,'none');first=json.loads((target/'cms-live.json').read_text())['releaseId']
    doc['releaseId']=str(uuid.uuid4());source.write_text(json.dumps(doc))
    two=run('stage',source,target,one['releaseId']);run('publish',target,first)
    result=run('rollback',target,two['releaseId']);assert result['releaseId']==first
print('PASS: documented CMS CLI stage/publish/update/rollback with verified readback; temporary artifacts removed.')
