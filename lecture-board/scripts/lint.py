#!/usr/bin/env python3
"""Layout lint of a built page without a visible browser.

Opens the page headless in a real viewport, waits for the fonts, runs the engine's MB_LINT() (every step's end state:
text past the board edge, overlapping text, text on a node or on a figure's drawing or labels, the reserved corners,
captions longer than the strip, KaTeX errors) and reports page errors from the console.

Usage:  python3 scripts/lint.py out/NAME.html [--shot out/NAME.png] [--size 1440x900] [--dark]
Needs Playwright:  pip install playwright && playwright install chromium
        (or without installing: uv run --with playwright python3 scripts/lint.py …)
MB_BROWSER=/path/to/chrome uses that browser instead of Playwright's Chromium.
Without Playwright: open the page in any browser, wait until it has loaded, and call MB_LINT() in the console.
Exit code 1 if anything is reported."""
import os, pathlib, sys

args = sys.argv[1:]
if not args or args[0].startswith('-'):
    sys.exit(__doc__)
page_path = pathlib.Path(args[0]).resolve()
if not page_path.exists():
    sys.exit(f'no such page: {page_path}')
shot = args[args.index('--shot') + 1] if '--shot' in args else None
w, h = map(int, (args[args.index('--size') + 1] if '--size' in args else '1440x900').split('x'))
try:
    from playwright.sync_api import sync_playwright
except ImportError:
    sys.exit('Playwright is not installed: pip install playwright && playwright install chromium\n'
             'or run: uv run --with playwright python3 ' + ' '.join(sys.argv))

errors = []
with sync_playwright() as p:
    # Playwright's own Chromium first, then browsers commonly installed (a Chromium of another version will do)
    tries = [os.environ['MB_BROWSER']] if os.environ.get('MB_BROWSER') else [None] + [x for x in (
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
        '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
        '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser') if os.path.exists(x)]
    browser, why = None, ''
    for exe in tries:
        try:
            browser = p.chromium.launch(executable_path=exe) if exe else p.chromium.launch()
            break
        except Exception as e:
            why = str(e).splitlines()[0]
    if not browser:
        sys.exit(f'could not start a browser: {why}; run "playwright install chromium" or set MB_BROWSER')
    pg = browser.new_page(viewport={'width': w, 'height': h}, color_scheme='dark' if '--dark' in args else 'light')
    pg.on('pageerror', lambda e: errors.append(f'page error: {e}'))
    pg.on('console', lambda m: errors.append(f'console: {m.text}') if m.type == 'error' else None)
    pg.goto(page_path.as_uri())
    pg.wait_for_function('typeof window.MB_LINT === "function"', timeout=20000)
    pg.evaluate('document.fonts.ready')
    pg.wait_for_timeout(500)
    found = pg.evaluate('MB_LINT()')
    if shot:
        pg.wait_for_timeout(400)
        pg.screenshot(path=shot)
    browser.close()

for m in errors + found:
    print(m)
print(f'{len(errors) + len(found)} problem(s) in {page_path.name} at {w}x{h}')
sys.exit(1 if errors or found else 0)
