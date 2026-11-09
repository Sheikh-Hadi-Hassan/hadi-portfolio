"""Offline, fixed-allowlist Apps Script candidate. Never deploys or calls Google."""
from pathlib import Path
import hashlib,json,os,sys,zipfile
ROOT=Path(__file__).resolve().parents[2]
SPEC=ROOT/'docs/v1/BOOKING-CANDIDATE.json'
SOURCES={'apps-script/Code.gs':'integrations/calendar-v8/Code.gs','review/appsscript.expected.json':'integrations/calendar-v8/appsscript.json'}
NOTICE='NOT AUTHORIZED FOR DEPLOYMENT. Apps Script-only candidate. Read docs/booking-release/RELEASE-READINESS.md. Do not run setup/activateSetup, change private configuration, grant scopes, or execute bookings from this package. review/appsscript.expected.json is comparison-only. Existing source resource settings are NOT isolated staging resources.\n'
def digest(b): return hashlib.sha256(b).hexdigest()
def inputs(root,spec):
    if spec.get('schemaVersion')!=1 or spec.get('scope')!='apps_script_booking_only' or spec.get('releaseDecision')!='NO-GO' or spec.get('deploymentAuthorized') is not False or spec.get('productionConfigurationChanges') is not False: raise ValueError('BOOKING_SCOPE_INVALID')
    if len(spec.get('sourceCommit',''))!=40 or any(c not in '0123456789abcdef' for c in spec['sourceCommit']): raise ValueError('BOOKING_COMMIT_INVALID')
    if set(spec.get('files',{}))!=set(SOURCES) or spec.get('mirrors')!=['integrations/leads/Code.gs']: raise ValueError('BOOKING_SCOPE_INVALID')
    payload={}
    for name,source in SOURCES.items():
        row=spec['files'][name];file=root/source
        if row.get('source')!=source or row.get('deploy') is not (name=='apps-script/Code.gs') or file.is_symlink() or not file.is_file(): raise ValueError('BOOKING_SOURCE_INVALID')
        content=file.read_bytes()
        if digest(content)!=row.get('sha256'): raise ValueError('BOOKING_SOURCE_CHANGED')
        payload[name]=content
    mirror=root/'integrations/leads/Code.gs'
    if mirror.is_symlink() or mirror.read_bytes()!=payload['apps-script/Code.gs']: raise ValueError('BOOKING_MIRROR_CHANGED')
    payload['release.json']=(json.dumps(spec,sort_keys=True,indent=2)+'\n').encode()
    payload['READ-ME-FIRST.txt']=NOTICE.encode()
    return payload

def verify(target,expected):
    with zipfile.ZipFile(target) as archive:
        names=archive.namelist()
        if len(names)!=len(expected) or set(names)!=set(expected): raise ValueError('BOOKING_ARTIFACT_SCOPE_INVALID')
        for name,content in expected.items():
            if archive.read(name)!=content: raise ValueError('BOOKING_ARTIFACT_CHANGED')
    return digest(target.read_bytes())

def package(root,target,spec):
    payload=inputs(root,spec)
    target=Path(target)
    if not target.is_absolute() or target.suffix!='.zip': raise ValueError('BOOKING_OUTPUT_INVALID')
    for folder in [target.parent,*target.parents]:
        if folder.is_symlink(): raise ValueError('BOOKING_OUTPUT_INVALID')
    # No overwrite; failed packaging removes only the file created by this invocation.
    fd=os.open(target,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
    try:
        with os.fdopen(fd,'wb') as handle:
            with zipfile.ZipFile(handle,'w',zipfile.ZIP_DEFLATED) as archive:
                for name in sorted(payload):
                    info=zipfile.ZipInfo(name,(2026,11,4,0,0,0));info.external_attr=0o100600<<16;info.compress_type=zipfile.ZIP_DEFLATED;archive.writestr(info,payload[name])
            handle.flush();os.fsync(handle.fileno())
        sha=verify(target,payload)
    except BaseException:
        target.unlink(missing_ok=True);raise
    return {'status':'PREPARED_NOT_DEPLOYABLE','sourceCommit':spec['sourceCommit'],'scope':spec['scope'],'sha256':sha,'deploymentAuthorized':False,'files':sorted(payload),'deployFiles':['apps-script/Code.gs']}
if __name__=='__main__':
    try:
        if len(sys.argv)!=2: raise ValueError('BOOKING_OUTPUT_REQUIRED')
        print(json.dumps(package(ROOT,Path(sys.argv[1]),json.loads(SPEC.read_text())),indent=2))
    except (ValueError,OSError,zipfile.BadZipFile):
        print('BOOKING_PACKAGE_FAILED: check fixed source hashes, candidate scope and unused absolute output path',file=sys.stderr);sys.exit(1)

