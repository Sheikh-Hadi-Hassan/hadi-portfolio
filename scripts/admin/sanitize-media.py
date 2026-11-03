"""Decode and re-encode one owner-selected image; never retain metadata or filenames."""
import io,sys,warnings,json
from PIL import Image,ImageOps
Image.MAX_IMAGE_PIXELS=16_000_000
warnings.simplefilter('error',Image.DecompressionBombWarning)
try:
    data=sys.stdin.buffer.read(10*1024*1024+1)
    if not data or len(data)>10*1024*1024:raise ValueError()
    image=Image.open(io.BytesIO(data))
    if image.format not in {'PNG','JPEG','WEBP'} or getattr(image,'n_frames',1)!=1:raise ValueError()
    if min(image.size)<1 or max(image.size)>8192 or image.width*image.height>16_000_000:raise ValueError()
    image.load()
    if '--inspect' in sys.argv:
        print(json.dumps({'width':image.width,'height':image.height}));sys.exit(0)
    lossless=image.format=='PNG'
    image=ImageOps.exif_transpose(image).convert('RGBA' if 'A' in image.getbands() or 'transparency' in image.info else 'RGB')
    clean=Image.new(image.mode,image.size);clean.paste(image)
    out=io.BytesIO();clean.save(out,format='WEBP',quality=90,lossless=lossless,method=4)
    sys.stdout.buffer.write((json.dumps({'width':clean.width,'height':clean.height})+'\n').encode());sys.stdout.buffer.write(out.getvalue())
except Exception:
    print('CMS_MEDIA_REJECTED',file=sys.stderr);sys.exit(1)
