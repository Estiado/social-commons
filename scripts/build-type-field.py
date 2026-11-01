"""Build the homepage forme from real font outlines and photographic wood."""
from pathlib import Path
import json,sys
from PIL import Image,ImageDraw,ImageFont,ImageOps,ImageFilter,ImageEnhance
from fontTools.ttLib import TTFont
root=Path(sys.argv[1]); out=root/'public/type-study/materials'
text=(root/'design/type-study/source/qianziwen-text.txt').read_text(encoding='utf-8').strip().replace('𡓜','牆')
assert len(text)==1000
fontpath=root/'.artifacts/material-originals/NotoSerifCJKsc-SemiBold.otf'
cmap=TTFont(fontpath).getBestCmap()
missing=[c for c in text if ord(c) not in cmap]
assert not missing,repr(missing)
font=ImageFont.truetype(str(fontpath),106)
# A narrow physical bevel from the approved real type photograph. The inner
# letter is never pasted into the new face; all glyphs below still come from Noto.
old=Image.open(root/'design/type-study/source/old-type-photo-reference.jpg')
quad=(1020,761,1100,875,1220,810,1140,700)
old_sort=old.transform((512,512),Image.Transform.QUAD,quad,Image.Resampling.BICUBIC)
edge_strip=ImageOps.grayscale(old_sort.crop((18,443,438,455)))
edge_strip=ImageOps.autocontrast(edge_strip,cutoff=2)
edge_source={'source':'https://unsplash.com/photos/close-up-of-antique-wooden-letterpress-type-blocks-JzcEdsEy1hg','author':'Declan Sun','license':'Unsplash License','quad':quad,'strip':[18,443,438,455],'use':'Only physical edge pixels and ink wear; no source glyph shape','userDecision':'Accepted as material candidate, 2026-11-01'}
(root/'design/type-study/source/old-type-edge-source.json').write_text(json.dumps(edge_source,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

wood=Image.open(out/'wood-matte.webp').convert('RGB')
atlas=Image.new('RGB',(4096,4096),'#35251b'); height=Image.new('L',(4096,4096),20)
for i,c in enumerate(text):
 x=(i%32)*128;y=(i//32)*128
 patch=wood.crop(((i*47)%800,(i*83)%800,(i*47)%800+128,(i*83)%800+128))
 grey=ImageOps.grayscale(patch)
 dark=ImageOps.colorize(grey,'#211911','#73583b')
 face=ImageOps.colorize(grey,'#a9916c','#eadab5')
 start=(i*37)%180; row=(i%3)*2
 strip=edge_strip.crop((start,row,start+240,row+8))
 strip=strip.transpose(Image.Transpose.FLIP_LEFT_RIGHT) if i%2 else strip
 strip=strip.resize((128,5),Image.Resampling.LANCZOS)
 edge=ImageOps.colorize(strip,'#1e160f','#ad9670')
 edge_height=strip.point(lambda v:int(v*.25))
 dark.paste(edge,(0,123));dark.paste(edge.transpose(Image.Transpose.ROTATE_180),(0,0))
 dark.paste(edge.transpose(Image.Transpose.ROTATE_90),(0,0));dark.paste(edge.transpose(Image.Transpose.ROTATE_270),(123,0))
 glyph=Image.new('L',(128,128));d=ImageDraw.Draw(glyph);d.text((64,60),c,font=font,anchor='mm',fill=255)
 glyph=ImageOps.mirror(glyph)
 dark.paste(face,(0,0),glyph)
 atlas.paste(dark,(x,y))
 relief=grey.point(lambda v: 12+int(v*.12))
 relief.paste(edge_height,(0,123));relief.paste(edge_height.transpose(Image.Transpose.ROTATE_180),(0,0))
 relief.paste(edge_height.transpose(Image.Transpose.ROTATE_90),(0,0));relief.paste(edge_height.transpose(Image.Transpose.ROTATE_270),(123,0))
 relief.paste(210,(0,0,128,128),glyph)
 height.paste(relief,(x,y))
atlas.save(out/'qianziwen-type-atlas.webp',quality=88)
height.save(out/'qianziwen-type-height.webp',quality=85)
profile=json.loads((root/'design/type-study/source/great-wall-trace.json').read_text(encoding='utf-8'))['profile']
points=[((x-1605)/1180*1600,80+(y-1040)*.9+((x-1605)/1180*1600)*.14) for x,y in profile]
mask=Image.new('L',(1600,1000));ImageDraw.Draw(mask).polygon(points+[(1600,1000),(0,1000)],fill=255)
mask=mask.filter(ImageFilter.GaussianBlur(12))
rgba=Image.new('RGBA',mask.size,(255,255,255,255));rgba.putalpha(mask);rgba.save(out/'type-field-wall-mask.png')
(root/'design/type-study/source/type-field-atlas.json').write_text(json.dumps({'source':'https://zh.wikisource.org/wiki/千字文','characters':text,'count':1000,'layout':'source vertical columns, reflected as one forme; column 0 at left after reflection','atlasSize':4096,'cell':128,'grid':[40,25],'glyphsMirrored':True,'wood':'Poly Haven Wood Table 001, CC0','boundary':'actual Jinshanling photo trace, Gaussian feather 5px'},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Built 1000 real mirrored glyphs, relief atlas and feathered real-wall boundary.')

# The homepage uses the clear foreground battlements from the same selected
# photograph, with a measured affine correction and a narrow soft edge.
home_trace=root/'design/type-study/source/home-wall-trace.json'
if home_trace.exists():
 profile=json.loads(home_trace.read_text(encoding='utf-8'))['profile']
 points=[]
 for x,y in profile:
  t=(x-3350)/298
  points.append((1600*t,155+(y-(800-28*t))*2.8+250*t))
 mask=Image.new('L',(1600,1000));ImageDraw.Draw(mask).polygon(points+[(1600,1000),(0,1000)],fill=255)
 mask=mask.filter(ImageFilter.GaussianBlur(5));rgba=Image.new('RGBA',mask.size,'white');rgba.putalpha(mask)
 rgba.save(out/'type-field-wall-mask.png')
