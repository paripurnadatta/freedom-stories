"""Resize every portrait in public/portraits to 640px WebP and update the paths in content files.
Run after fetch-portraits.mjs. Needs Pillow (pip install pillow)."""
import glob
import os

from PIL import Image, ImageOps

renamed = {}
for f in glob.glob("public/portraits/*"):
    base, ext = os.path.splitext(f)
    if ext == ".webp":
        continue
    im = ImageOps.exif_transpose(Image.open(f))
    if im.mode not in ("RGB", "L"):
        bg = Image.new("RGB", im.size, (8, 11, 19))
        im = im.convert("RGBA")
        bg.paste(im, mask=im.split()[-1])
        im = bg
    im.thumbnail((640, 900))
    out = base + ".webp"
    im.convert("RGB").save(out, "WEBP", quality=80)
    os.remove(f)
    renamed["/" + f[len("public/"):]] = "/" + out[len("public/"):]

for md in glob.glob("src/content/*/*.md"):
    s = open(md, encoding="utf-8").read()
    t = s
    for a, b in renamed.items():
        t = t.replace(f'src: "{a}"', f'src: "{b}"')
    if t != s:
        open(md, "w", encoding="utf-8").write(t)
print(f"Shrunk {len(renamed)} portraits.")
