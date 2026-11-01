"""Build a paper landscape from actual scan pixels, never redraw or synthesize glyphs.

User requested Photoshop-style warping. NumPy performs inverse curved-surface projection;
Pillow handles tonal adjustment, resampling, depth of field and WebP compression.
The source PDF remains unchanged and outside the shipped site.
"""
import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SOURCE_PAGE = "https://commons.wikimedia.org/wiki/File:NLC892-312002092935-327932_千字文_清道光二十六年刻本.pdf"
SOURCE_PDF = "https://upload.wikimedia.org/wikipedia/commons/f/f2/NLC892-312002092935-327932_%E5%8D%83%E5%AD%97%E6%96%87_%E6%B8%85%E9%81%93%E5%85%89%E4%BA%8C%E5%8D%81%E5%85%AD%E5%B9%B4%E5%88%BB%E6%9C%AC.pdf"


def smoothstep(a, b, value):
    t = np.clip((value - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def sample(array, u, v):
    height, width = array.shape
    px = np.clip(u, 0, 1) * (width - 1)
    py = np.clip(v, 0, 1) * (height - 1)
    x0, y0 = px.astype(np.int32), py.astype(np.int32)
    x1, y1 = np.minimum(x0 + 1, width - 1), np.minimum(y0 + 1, height - 1)
    fx, fy = px - x0, py - y0
    return ((array[y0, x0] * (1 - fx) + array[y0, x1] * fx) * (1 - fy)
            + (array[y1, x0] * (1 - fx) + array[y1, x1] * fx) * fy)


def build(pdf, output, width=2400, height=1400):
    import pypdfium2 as pdfium

    document = pdfium.PdfDocument(str(pdf))
    crops = [
        (2, (.067, .365, .398, .887)),
        (3, (.529, .365, .920, .884)),
    ]
    textures = []
    origin_records = []
    for page_number, box in crops:
        page = document[page_number]
        raster = page.render(scale=2.2).to_pil().convert("L")
        bounds = tuple(round(value * size) for value, size in zip(box, (raster.width, raster.height) * 2))
        crop = raster.crop(bounds)
        gray = np.asarray(crop, dtype=np.float32)
        # Preserve every stroke. This is a local contrast normalization of the original scan.
        paper = np.asarray(crop.filter(ImageFilter.GaussianBlur(24)), dtype=np.float32)
        ink = np.clip((paper - gray - 3) / 78, 0, 1)
        texture = np.clip((paper - np.mean(paper)) / 30, -1, 1)
        textures.append((ink, texture))
        origin_records.append({"pdfPage": page_number + 1, "cropNormalized": box})
        page.close()
    document.close()

    yy, xx = np.mgrid[0:height, 0:width].astype(np.float32)
    focal = width * .80
    dx = (xx - width / 2) / focal
    dy = (yy - height * .39) / focal
    camera = .50
    lo, hi = np.full_like(xx, .01), np.full_like(xx, 30)

    def surface(x):
        # A smooth even surface has zero slope at the gutter; abs(x) created a false hard ridge.
        return .26 * (1 - np.exp(-np.square(x / .72)))

    for _ in range(18):
        depth = (lo + hi) / 2
        above = camera - dy * depth - surface(dx * depth) > 0
        lo = np.where(above, depth, lo)
        hi = np.where(above, hi, depth)

    depth = (lo + hi) / 2
    world_x = dx * depth
    far = (1 - smoothstep(4.3, 6.6, depth)) * smoothstep(.38, .65, depth)
    far *= (dy > 0)
    left = world_x < 0
    u = np.where(left, (world_x + 1.7) / 1.7, world_x / 1.7)
    v = 1 - (depth - .45) / 5.5
    ink_left, grain_left = (sample(a, u, v) for a in textures[0])
    ink_right, grain_right = (sample(a, u, v) for a in textures[1])
    ink = np.where(left, ink_left, ink_right)
    grain = np.where(left, grain_left, grain_right)
    # Beyond a photographed leaf the paper continues, while its text quietly fades out.
    ink *= smoothstep(-.05, .05, u) * (1 - smoothstep(.94, 1.04, u))
    # Printed columns stop before the binding, as on a real leaf. Do not splice glyphs across it.
    ink *= far * .46 * smoothstep(.015, .085, np.abs(world_x))
    crease = np.exp(-np.square(world_x / .09)) * far * .65
    slope = .52 * np.abs(world_x) / (.72 ** 2) * np.exp(-np.square(world_x / .72))
    lambert = 1 / np.sqrt(1 + slope * slope)
    light = far * (-4 - (1 - lambert) * 72 + grain * 1.2) - crease
    ground = np.array([243, 240, 232], dtype=np.float32)
    rgb = np.broadcast_to(ground, (height, width, 3)).copy()
    rgb += light[..., None]
    rgb -= ink[..., None] * np.array([89, 84, 73], dtype=np.float32)
    image = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB")

    # Optical softness varies by depth; the glyph raster itself is untouched.
    softened = image.filter(ImageFilter.GaussianBlur(3.5))
    lens = smoothstep(.70, .98, yy / height) * .60
    lens += smoothstep(.65, 1, np.abs(xx - width / 2) / (width / 2)) * .25
    mask = Image.fromarray((np.clip(lens, 0, 1) * 255).astype(np.uint8))
    image = Image.composite(softened, image, mask)
    output.parent.mkdir(parents=True, exist_ok=True)
    provenance = {
        "asset": output.name,
        "title": "《千字文》清道光二十六年刻本：纸面曲面视觉",
        "author": "周兴嗣",
        "edition": "1846年刻本",
        "sourceInstitution": "中国国家图书馆（据Commons文件说明）",
        "sourcePage": SOURCE_PAGE,
        "sourceFile": SOURCE_PDF,
        "license": "Public domain; PD-scan; PD-old-100-expired",
        "sourceSha256": hashlib.sha256(pdf.read_bytes()).hexdigest(),
        "sourcePages": origin_records,
        "processing": "Source pixel crops, local contrast normalization, inverse symmetric curved-surface projection, tonal treatment, shallow depth-of-field; no generated or retyped characters.",
        "generator": "scripts/build-book-paper.py",
        "dimensions": [width, height],
    }
    exif = Image.Exif()
    exif[270] = json.dumps(provenance, ensure_ascii=True)
    image.save(output, quality=93, exif=exif)
    output.with_suffix(".source.json").write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"output": str(output), "bytes": output.stat().st_size, "sourceSha256": provenance["sourceSha256"]}))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf", type=Path, required=True)
    parser.add_argument("--out", type=Path, default=Path("public/book/qianziwen-paper.webp"))
    args = parser.parse_args()
    build(args.pdf, args.out)
