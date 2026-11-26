import sys
from PIL import Image
src, out, strip_h, cols = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
im = Image.open(src); W, H = im.size
strips = [im.crop((0, y, W, min(y+strip_h, H))) for y in range(0, H, strip_h)]
pages = [strips[i:i+cols] for i in range(0, len(strips), cols)]
for pi, pg in enumerate(pages):
    sheet = Image.new('RGB', (cols*(W+12), strip_h), (60,60,60))
    for i, s in enumerate(pg): sheet.paste(s, (i*(W+12), 0))
    sheet.save(out.replace('.jpg', f'-{pi+1}.jpg'), quality=70)
    print(out.replace('.jpg', f'-{pi+1}.jpg'))
