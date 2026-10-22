"""Regenerate the committed PDF font from Google's upstream variable TrueType.

Only needed when updating the font. Install fonttools into a D-drive tool folder,
download ofl/notosanssc/NotoSansSC[wght].ttf from google/fonts, then pass its path.
Keep the accompanying OFL license with the generated font.
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

font = TTFont(sys.argv[1])
font = instantiateVariableFont(font, {"wght": 400}, inplace=True, updateFontNames=True)
assert "fvar" not in font
font.save("public/fonts/NotoSansSC-Regular.ttf")
