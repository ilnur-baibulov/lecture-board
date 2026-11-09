"""Build tests/fixtures/equation-previews.md; run with Playwright against the built HTML."""
from pathlib import Path
import os, sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'lecture-board/scripts'))
import mdscript
from playwright.sync_api import sync_playwright
fixture = Path(__file__).resolve().parents[1] / 'tests/fixtures/equation-previews.md'
source = fixture.read_text()
assert mdscript.parse(source)['slides'][0]['steps'][0]['do'][1]['equation'] == '1.1'
for invalid in (source.replace('[[eq:1.1]]', '[[eq:absent]]'), source.replace('- write recall in line 3', '- write recall in line 3 · equation 1.1')):
    try: mdscript.parse(invalid)
    except ValueError: pass
    else: raise AssertionError('invalid reference accepted')
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('MB_BROWSER', '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'))
    page = browser.new_page(viewport={'width':1280, 'height':800})
    errors=[]; page.on('pageerror', lambda e: errors.append(str(e)))
    page.add_init_script('localStorage.clear();localStorage.setItem("mb-auto-nv","off")')
    page.goto(Path(sys.argv[1]).resolve().as_uri()+'#2')
    page.evaluate('document.fonts.ready')
    state=lambda:page.evaluate('MB_ST()')
    def preview(selector, keyboard=False):
        before=state()
        link=page.locator(selector).first
        if keyboard:
            link.focus();page.keyboard.press('Enter')
        else:link.click()
        assert page.locator('.card').is_visible()
        assert 'A sum on two rows' in page.locator('.card b').inner_text()
        assert page.locator('.eq-body .katex-display').count()==2
        after=state()
        assert (after['k'],after['i'])==(before['k'],before['i'])
        assert after['state']==before['state']
        page.keyboard.press('Escape')
    preview('.capt [data-eq]')
    page.locator('.finish').click()
    preview('.board.main [data-eq]', keyboard=True)
    page.locator('.txb').click();preview('.tx [data-eq]')
    page.locator('.sign.why').click()
    page.locator('.card [data-eq]').click()
    assert page.locator('.eq-body .katex-display').count()==2
    page.keyboard.press('Escape')
    page.locator('[data-v=read]').click()
    preview('#slide-2 .rt [data-eq]')
    assert page.locator('.read').is_visible()
    assert page.locator('.katex-error').count()==0
    # Opening a preview while playing pauses; closing restores playback at the same step.
    page.goto(Path(sys.argv[1]).resolve().as_uri()+'#2')
    page.reload()
    page.keyboard.press('Space')
    page.wait_for_function('MB_ST().state === "playing" && !MB_ST().wipe')
    page.locator('.capt [data-eq]').click()
    assert state()['state']=='paused'
    place=(state()['k'],state()['i'])
    page.wait_for_timeout(500)
    page.keyboard.press('Escape')
    assert state()['state']=='playing'
    assert (state()['k'],state()['i'])==place
    page.reload()
    page.locator('.set').click()
    page.locator('[data-k=notes] [data-v=side]').click()
    page.locator('.sx').click()
    preview('.capt [data-eq]')  # notes in sidebar must remain visible when transcript is hidden
    page.locator('.txb').click()
    page.locator('.capt [data-eq]').click()
    assert page.locator('.card').bounding_box()['width'] <= page.locator('.side').bounding_box()['width']
    page.keyboard.press('Escape')
    page.locator('.finish').click()
    page.locator('.fs').click()
    page.wait_for_function('!!document.fullscreenElement')
    preview('.board.main [data-eq]')
    assert not errors,errors
    browser.close()
print('PASS: missing/duplicate labels, multiline preview, captions, board keyboard, transcript, notes, Read and pause/resume')
