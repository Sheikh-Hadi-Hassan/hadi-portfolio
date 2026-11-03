"""Local stale-export guard. A receipt is provenance evidence, not an approval signature."""
from pathlib import Path
import hashlib,json,subprocess,sys
ROOT=Path(__file__).resolve().parents[2]
RECEIPT='.v01-acceptance-build.json'
def digest(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def inventory(root, folders, files=(), exclude=()):
    paths=[]
    for folder in folders:
        base=root/folder
        if base.exists():
            paths += [p for p in base.rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.name not in exclude]
    paths += [root/f for f in files if (root/f).is_file()]
    if any(p.is_symlink() for p in paths): raise ValueError('ACCEPTANCE_SOURCE_LINK_UNSUPPORTED')
    return {str(p.relative_to(root)):digest(p) for p in sorted(set(paths))}
def source(root):
    return inventory(root,['src','public','scripts','design'],['package.json','package-lock.json','next.config.js','next.config.mjs','next.config.ts','tsconfig.json'])
def outputs(root): return inventory(root,['out'],exclude=[RECEIPT])
def capture(root):
    if not (root/'out/index.html').is_file(): raise ValueError('ACCEPTANCE_EXPORT_MISSING')
    return {'schemaVersion':1,'scope':'local_npm_production_build','source':source(root),'output':outputs(root)}
def verify(root):
    try: saved=json.loads((root/'out'/RECEIPT).read_text())
    except (OSError,ValueError): raise ValueError('ACCEPTANCE_BUILD_RECEIPT_MISSING') from None
    if saved!=capture(root): raise ValueError('ACCEPTANCE_BUILD_STALE_OR_MODIFIED')
if __name__=='__main__':
    try:
        # Never run build or accept an old export if the approved lock is unavailable.
        gate=subprocess.run([sys.executable,'scripts/verify-hero-lock.py'],cwd=ROOT,capture_output=True)
        if gate.returncode: raise ValueError('APPROVED_HERO_REQUIRED')
        if sys.argv[1:]==['--verify']:
            verify(ROOT);print('PASS: approved source/export receipt matches')
        elif not sys.argv[1:]:
            receipt=ROOT/'out'/RECEIPT
            receipt.unlink(missing_ok=True)
            result=subprocess.run(['npm','run','build'],cwd=ROOT)
            if result.returncode: raise ValueError('ACCEPTANCE_BUILD_FAILED')
            receipt.write_text(json.dumps(capture(ROOT),sort_keys=True,indent=2)+'\n')
            verify(ROOT);print('PASS: approved build receipt recorded')
        else: raise ValueError('ACCEPTANCE_BUILD_ARGUMENT_INVALID')
    except ValueError as exc:
        print('BLOCKED: '+str(exc),file=sys.stderr);sys.exit(1)
