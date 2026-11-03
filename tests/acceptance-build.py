from pathlib import Path
import importlib.util,tempfile,json
spec=importlib.util.spec_from_file_location('acceptance_build',Path('scripts/qa/acceptance-build.py'));m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
def rejected(root,code):
    try: m.verify(root)
    except ValueError as exc: assert str(exc)==code;return
    raise AssertionError('Stale export accepted')
with tempfile.TemporaryDirectory() as d:
    r=Path(d)
    for f in ['src/page.html','public/widget.js','design/hero-lock.json','out/index.html','scripts/build.py']:
        p=r/f;p.parent.mkdir(parents=True,exist_ok=True);p.write_text('synthetic fixture')
    rejected(r,'ACCEPTANCE_BUILD_RECEIPT_MISSING')
    p=r/'out'/m.RECEIPT;p.write_text(json.dumps(m.capture(r)));m.verify(r)
    (r/'out/index.html').write_text('modified');rejected(r,'ACCEPTANCE_BUILD_STALE_OR_MODIFIED')
    p.write_text(json.dumps(m.capture(r)));(r/'src/page.html').write_text('new source');rejected(r,'ACCEPTANCE_BUILD_STALE_OR_MODIFIED')
    p.write_text(json.dumps(m.capture(r)));(r/'public/new.js').write_text('new file');rejected(r,'ACCEPTANCE_BUILD_STALE_OR_MODIFIED')
print('PASS: missing receipt, stale source, modified export and newly added source rejected. Synthetic provenance tests only; no build or hero activation.')
