"""Build tests/fixtures/blocks.md; run with Playwright against the built HTML."""
from pathlib import Path
import os, sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'lecture-board/scripts'))
import mdscript
from playwright.sync_api import sync_playwright

fixture = Path(__file__).resolve().parents[1] / 'tests/fixtures/blocks.md'
source = fixture.read_text()
scene = mdscript.parse(source)
assert scene['slides'][0]['steps'][0]['do'][1]['block'] == 'callout'
assert scene['slides'][0]['steps'][0]['do'][1]['head'] == 'Claim 1'
assert scene['slides'][0]['steps'][1]['do'][0]['block'] == 'callout'
assert 'head' not in scene['slides'][0]['steps'][1]['do'][0]
assert scene['slides'][0]['steps'][2]['do'][0]['block'] == 'rail'
assert scene['slides'][0]['steps'][2]['do'][0]['head'] == 'Derivation.'

# Round-trip dump keeps block options
dumped = mdscript.dump(scene)
assert 'callout "Claim 1"' in dumped and 'rail "Derivation."' in dumped

# Invalid usages rejected
for bad in (
    source.replace('· callout "Claim 1"', '· callout "Claim 1" · rail "X"'),
    source.replace('- erase all', '- erase all · callout "X"'),
):
    try:
        mdscript.parse(bad)
    except ValueError:
        pass
    else:
        raise AssertionError('invalid block option accepted')

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('MB_BROWSER', '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'))
    page = browser.new_page(viewport={'width': 1280, 'height': 800})
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.add_init_script('localStorage.clear();localStorage.setItem("mb-auto-nv","off")')
    page.goto(Path(sys.argv[1]).resolve().as_uri())
    page.evaluate('document.fonts.ready')

    # Clean lint across all steps
    lint_out = page.evaluate('MB_LINT()')
    assert not lint_out, f'MB_LINT reported: {lint_out}'

    # Step 1.1: single callout; Step 1.2: same single callout grows taller
    page.evaluate('MB_AT(0, 1)')
    assert page.locator('.board.main .bgrp.callout').count() == 1
    h1 = page.locator('.board.main .bgrp.callout').bounding_box()['height']
    page.evaluate('MB_AT(0, 2)')
    assert page.locator('.board.main .bgrp.callout').count() == 1
    h2 = page.locator('.board.main .bgrp.callout').bounding_box()['height']
    assert h2 > h1 + 20, f'multi-line callout did not grow: {h1} -> {h2}'

    # Full slide 1: 2 callouts (Claim 1 + nested Helper), 1 rail spanning r1..r2, plain remark unindented
    page.evaluate('MB_AT(0, 5)')
    page.evaluate('document.fonts.ready')
    page.wait_for_timeout(100)
    assert page.locator('.board.main .bgrp.callout').count() == 2
    assert page.locator('.board.main .bgrp.rail').count() == 1
    c1_box = page.locator('.board.main .bgrp.callout').first.bounding_box()
    rail_box = page.locator('.board.main .bgrp.rail').bounding_box()
    helper_box = page.locator('.board.main .bgrp.callout').nth(1).bounding_box()
    assert rail_box['y'] < helper_box['y'] and rail_box['y'] + rail_box['height'] > helper_box['y'] + helper_box['height']
    # Indentation and full containment after KaTeX font load
    ts = page.locator('.board.main .ink .t')
    c2_box = ts.nth(1).bounding_box()
    h_txt_box = ts.nth(3).bounding_box()
    assert c1_box['x'] + c1_box['width'] > c2_box['x'] + c2_box['width'] + 8, f'callout clipped c2: {c1_box} vs {c2_box}'
    assert helper_box['x'] + helper_box['width'] > h_txt_box['x'] + h_txt_box['width'] + 8, f'callout clipped helper: {helper_box} vs {h_txt_box}'
    r1_x = ts.nth(2).bounding_box()['x']
    rem_x = ts.nth(5).bounding_box()['x']
    assert r1_x > rem_x + 8, f'rail line not indented: r1={r1_x}, rem={rem_x}'

    # Rescaling Board text updates blocks without lint errors
    page.locator('.set').click()
    page.locator('[data-k=ink]').evaluate('el=>{el.value="120";el.dispatchEvent(new Event("input",{bubbles:true}))}')
    page.locator('.sx').click()
    page.wait_for_timeout(150)
    assert not page.evaluate('MB_LINT()'), 'MB_LINT failed at 120% ink'
    page.locator('.set').click()
    page.locator('[data-k=ink]').evaluate('el=>{el.value="100";el.dispatchEvent(new Event("input",{bubbles:true}))}')
    page.locator('.sx').click()

    # Slide 2: clickable [[eq:1.1]] in rail header opens equation preview with callout title
    page.goto(Path(sys.argv[1]).resolve().as_uri() + '#2')
    page.reload()
    page.locator('.finish').click()
    page.locator('.board.main .bgrp-h [data-eq="1.1"]').click()
    assert page.locator('.card').is_visible()
    head_txt = page.locator('.card b').inner_text()
    assert 'Claim 1' in head_txt and 'Statement and derivation' in head_txt, head_txt
    assert page.locator('.eq-body .katex-display').count() == 2
    page.keyboard.press('Escape')

    # Read view renders callout and rail blocks with real geometry
    page.locator('[data-v=read]').click()
    page.wait_for_timeout(150)
    assert page.locator('#slide-1 .board .bgrp.callout').count() == 2
    assert page.locator('#slide-1 .board .bgrp.rail').count() == 1
    assert page.locator('#slide-1 .board .bgrp.callout').first.bounding_box()['height'] > 30
    assert page.locator('#slide-2 .board .bgrp.rail .bgrp-h [data-eq="1.1"]').count() == 1
    assert not errors, errors
    browser.close()

print('PASS: callout/rail parsing, multi-line growth, nesting, rescaling, header eq-preview, lint, and Read view')
