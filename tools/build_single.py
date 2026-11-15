"""Собирает сайт в один файл: python tools/build_single.py -> dist/russkiy-na-70.html

Встраивает css/style.css и все локальные <script src> внутрь index.html.
Файл открывается двойным кликом, без сервера (интернет нужен только для шрифтов).
"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
html = (ROOT / "index.html").read_text(encoding="utf-8")

def css(m):
    return "<style>\n" + (ROOT / m.group(1)).read_text(encoding="utf-8") + "\n</style>"

def js(m):
    code = (ROOT / m.group(1)).read_text(encoding="utf-8").replace("</script", "<\\/script")
    return "<script>\n" + code + "\n</script>"

html = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">', css, html)
html = re.sub(r'<script src="((?:js|data)/[^"]+)"></script>', js, html)
assert 'src="js/' not in html and 'src="data/' not in html and 'href="css/' not in html

out = ROOT / "dist" / "russkiy-na-70.html"
out.parent.mkdir(exist_ok=True)
out.write_text(html, encoding="utf-8")
print(f"{out} — {out.stat().st_size // 1024} КБ")
