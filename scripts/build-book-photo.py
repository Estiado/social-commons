"""Photo-first book plate: background mask, local ink retouch, painted page edges, shadow.

Pillow implements the same pixel operations as layered photo-editing software. The entire
visible paper surface and silhouette come from the supplied photograph, not drawn planes.
"""
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageOps

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'design/book/open-book-reference.jpg'
PAINT=ROOT/'public/book/materials/source-dunhuang-canopy.webp'
OUTPUT=ROOT/'public/book/materials'
source=Image.open(SOURCE).convert('RGB')
gray=ImageOps.grayscale(source)

# Select the connected book, then fill internal letter holes. Detached background lettering
# is not part of the connected book; the original supplied image is retained unchanged.
mask=gray.point(lambda v:255 if v>28 else 0)
ImageDraw.floodfill(mask,(720,500),128,thresh=0)
mask=mask.point(lambda v:255 if v==128 else 0)
ImageDraw.floodfill(mask,(0,0),128,thresh=0)
mask=mask.point(lambda v:0 if v==128 else 255).filter(ImageFilter.GaussianBlur(.5))

# Lighten only original ink in the two reading areas. Local paper illumination, irregular
# silhouette, real gutter and the complete photographed page blocks remain intact.
healed=source.filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.GaussianBlur(5))
reading=Image.new('L',source.size)
d=ImageDraw.Draw(reading)
d.polygon([(198,163),(694,156),(687,897),(173,908)],fill=248)
d.polygon([(762,159),(1248,172),(1280,905),(756,898)],fill=248)
reading=reading.filter(ImageFilter.GaussianBlur(22))
plate=Image.composite(healed,source,reading)
plate=ImageEnhance.Brightness(plate).enhance(1.05)

paint=Image.open(PAINT).convert('RGB')
paint=ImageEnhance.Color(ImageEnhance.Brightness(paint).enhance(1.23)).enhance(1.08)
texture=Image.new('RGB',source.size,'#ddd4b9')
texture.paste(paint.resize((1440,170),Image.Resampling.LANCZOS),(0,900))
vertical=paint.rotate(90,expand=True).resize((120,900),Image.Resampling.LANCZOS)
texture.paste(vertical,(120,100));texture.paste(vertical,(1240,100))
edge=Image.new('L',source.size)
d=ImageDraw.Draw(edge)
d.polygon([(175,168),(199,156),(166,942),(146,983),(134,983)],fill=170)
d.polygon([(1252,145),(1283,152),(1320,983),(1290,994)],fill=170)
d.polygon([(148,969),(310,934),(448,931),(554,951),(670,990),(712,1007),(675,1016),(540,982),(340,969),(146,999)],fill=180)
d.polygon([(749,1008),(797,967),(920,936),(1083,955),(1289,986),(1299,1008),(1080,977),(921,961),(815,988),(760,1022)],fill=180)
edge=ImageChops.multiply(edge.filter(ImageFilter.GaussianBlur(1)),mask)
edge=ImageChops.multiply(edge,gray.point(lambda v:max(0,min(255,(v-50)*3))))
relief=ImageOps.colorize(gray,'#68614c','#fffdf2')
painted=ImageChops.multiply(texture,relief)
plate=Image.composite(painted,plate,edge).convert('RGBA')
plate.putalpha(mask)

# A detached contact shadow keeps the photographic edge legible on the site's paper ground.
shadow=Image.new('RGBA',source.size,'#00000000')
shadow.putalpha(mask.filter(ImageFilter.GaussianBlur(13)).point(lambda v:int(v*.27)))
canvas=Image.new('RGBA',(1440,1120))
canvas.alpha_composite(shadow,(0,25));canvas.alpha_composite(plate,(0,0))
bbox=mask.getbbox()
canvas=canvas.crop((max(0,bbox[0]-35),max(0,bbox[1]-30),min(1440,bbox[2]+35),min(1120,bbox[3]+52)))
canvas=canvas.resize((2560,1700),Image.Resampling.LANCZOS)
canvas.save(OUTPUT/'book-photo.webp',quality=93,method=6)
canvas.crop((0,0,1280,1700)).save(OUTPUT/'book-photo-left.webp',quality=92,method=6)
print('Photographic full book and single-page plate written; original surface retained.')
