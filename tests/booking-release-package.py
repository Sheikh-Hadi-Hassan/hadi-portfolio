from pathlib import Path
import copy,importlib.util,json,tempfile,zipfile
s=importlib.util.spec_from_file_location('booking_release',Path('scripts/booking-release/package.py'));m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
spec=json.loads(m.SPEC.read_text())
def reject(fn,code):
    try:fn()
    except ValueError as e: assert str(e)==code;return
    raise AssertionError('Unsafe package accepted')
with tempfile.TemporaryDirectory() as d:
    a=Path(d)/'a.zip';b=Path(d)/'b.zip';one=m.package(m.ROOT,a,spec);two=m.package(m.ROOT,b,spec);assert one['sha256']==two['sha256'];assert one['deployFiles']==['apps-script/Code.gs'] and not one['deploymentAuthorized'];assert (a.stat().st_mode&0o777)==0o600
    try:m.package(m.ROOT,a,spec)
    except FileExistsError:pass
    else:raise AssertionError('Existing artifact overwritten')
    for patch in [{'deploymentAuthorized':True},{'productionConfigurationChanges':True},{'scope':'full_website'}]:reject(lambda:m.inputs(m.ROOT,spec|patch),'BOOKING_SCOPE_INVALID')
    bad=copy.deepcopy(spec);bad['files']['apps-script/Code.gs']['sha256']='0'*64;reject(lambda:m.inputs(m.ROOT,bad),'BOOKING_SOURCE_CHANGED')
    bad=copy.deepcopy(spec);bad['files']['private-config.php']={'source':'private-config.php'};reject(lambda:m.inputs(m.ROOT,bad),'BOOKING_SCOPE_INVALID')
    expected=m.inputs(m.ROOT,spec)
    with zipfile.ZipFile(b,'a') as z:z.writestr('../private-config.php','synthetic')
    reject(lambda:m.verify(b,expected),'BOOKING_ARTIFACT_SCOPE_INVALID')
    with zipfile.ZipFile(b,'w') as z:
        for name,content in expected.items():z.writestr(name,content+b'corrupt' if name=='apps-script/Code.gs' else content)
    reject(lambda:m.verify(b,expected),'BOOKING_ARTIFACT_CHANGED')
print('PASS: deterministic fixed-scope candidate, exact source/mirror hashes, no overwrite, permission0600, no activation/config writes, extra/traversal/tampered ZIP rejection. No deployment.')
