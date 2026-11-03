"""Exercise the real variant function against isolated corrupt cache entries."""
import ast, hashlib, tempfile
from pathlib import Path
from PIL import Image, ImageOps
source=ast.parse(Path('scripts/optimize-images.py').read_text())
function=next(n for n in source.body if isinstance(n,ast.FunctionDef) and n.name=='variants_for')
with tempfile.TemporaryDirectory() as directory:
 root=Path(directory);output=root/'assets/responsive';output.mkdir(parents=True)
 original=root/'assets/source.png'
 Image.effect_noise((640,480),100).convert('RGB').save(original)
 ns=dict(Image=Image,ImageOps=ImageOps,hashlib=hashlib,PUBLIC=root,output=output,cache={},saved=0)
 exec(compile(ast.Module(body=[function],type_ignores=[]),'<variants_for>','exec'),ns)
 digest=hashlib.sha256(original.read_bytes()).hexdigest()[:12]
 damaged=output/f'{digest}-q90-480.webp';damaged.write_bytes(b'')
 variants=ns['variants_for']('/assets/source.png')[0]
 with Image.open(damaged) as image: assert image.size==(480,360);image.verify()
 damaged.write_bytes(b'not a webp');ns['cache'].clear();ns['variants_for']('/assets/source.png')
 with Image.open(damaged) as image:image.verify()
 assert variants and not list(output.glob('*.tmp'))
 print('Empty and corrupt cached variants regenerate as valid WebP; no temporary file remains.')
