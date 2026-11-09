#!/usr/bin/env python3
"""Build one offline HTML page: KaTeX (all fonts inlined) + board engine + a scene.
The scene is a readable script (.md, see mdscript.py) or a JS file calling Board.mount.
Usage: python3 scripts/build.py talk/NAME.md out/NAME.html   (paths relative to where it is run; Python 3 stdlib only)"""
import base64, json, re, sys, pathlib
here = pathlib.Path(__file__).resolve().parent
assets = here.parent / 'assets'
kd = assets / 'katex'
def font(m):
    f = kd / m.group(1)
    if f.suffix != '.woff2':
        return ''
    return 'url(data:font/woff2;base64,%s) format("woff2")' % base64.b64encode(f.read_bytes()).decode()
css = (kd / 'katex.min.css').read_text()
css = re.sub(r'url\((fonts/[^)]+)\) format\("[a-z0-9]+"\)', font, css)
css = re.sub(r',\s*(?=[;}])', '', css)          # drop the emptied woff/ttf alternatives
scene, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
if scene.suffix == '.md':
    sys.path.insert(0, str(here))
    import mdscript
    S = mdscript.parse(scene.read_text())
    title = re.sub(r'\$([^$]*)\$', lambda m: re.sub(r'\\[a-zA-Z]+|[{}]', '', m[1]), S['title'])
    lang = S.get('lang', 'en')
    figs = '\n'.join((scene.parent / f).read_text() for f in S.get('figures', '').split())  # one or more files, space-separated
    scene_js = figs + '\n' + 'Board.mount(' + json.dumps(S, ensure_ascii=False).replace('</', '<\\/') + ');'
else:
    scene_js = scene.read_text()
    title = re.search(r"title:'([^']+)'", scene_js).group(1)
    lang = 'en'
engine = 'board'
html = f'''<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<style>{css}</style>
<style>{(assets/(engine+'.css')).read_text()}</style>
</head>
<body>
<div id="app"></div>
<script>{(kd/'katex.min.js').read_text()}</script>
<script>{(assets/(engine+'.js')).read_text()}</script>
<script>{scene_js}</script>
</body>
</html>
'''
out.parent.mkdir(exist_ok=True)
out.write_text(html)
print(out, len(html)//1024, 'KB')
