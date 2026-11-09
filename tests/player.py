"""Browser regression for real transitions and a question with both text views hidden.
Build tests/fixtures/player-regression.md, then uv run --with playwright python3 tests/player.py out/player-regression.html.
"""
from pathlib import Path
import sys, os
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('MB_BROWSER','/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'))
 for played,cap_mode in ((False,'off'),(True,'below'),(False,'above')):
  pg=b.new_page(viewport={'width':1440,'height':900})
  errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.add_init_script('localStorage.clear();localStorage.setItem("mb-auto-nv","off");localStorage.setItem("mb-settings",JSON.stringify({cap:"' + cap_mode + '",transcript:false}));')
  pg.goto(Path(sys.argv[1]).resolve().as_uri());pg.evaluate('document.fonts.ready')
  if played:pg.keyboard.press('Space');pg.wait_for_timeout(50)
  pg.locator('.finish').click();assert pg.locator('.board.main input[type=range]').count()==1
  pg.locator('.finish').click();assert pg.evaluate('MB_ST().k')==1
  pg.locator('.nb').click();assert pg.evaluate('MB_ST().k')==2
  assert pg.locator('.board.main input[type=range]').count()==0
  assert pg.locator('.capt').inner_text()=='This slide begins with an introduction.'
  assert pg.locator('.section-title').inner_text()=='Another section / Its subsection'
  bounds=lambda:[pg.locator(sel).bounding_box() for sel in ('.board.main','.ctl')]
  before=bounds()
  pg.keyboard.press('ArrowRight');pg.wait_for_timeout(700);pg.keyboard.press('ArrowRight')
  pg.locator('.qpanel .qin').wait_for(state='visible')
  assert bounds()==before, (before,bounds())
  assert not pg.locator('.capt').is_visible()
  assert pg.locator('.cap .qprompt').is_visible()
  pg.keyboard.press('ArrowRight');pg.wait_for_timeout(1000);pg.keyboard.press('ArrowRight');assert 'Answer, show the answer, or skip' in pg.locator('.qpanel').inner_text()
  pg.keyboard.press('Space');assert pg.evaluate('MB_ST().i')==2
  pg.locator('.qpanel .qhint').click();assert 'Add one' in pg.locator('.qpanel').inner_text()
  assert bounds()==before
  if played:
   pg.locator('.qpanel .qin').fill('2');pg.locator('.qpanel .qok').click();assert 'Right.' in pg.locator('.qpanel').inner_text()
  else:
   pg.locator('.qpanel .qskip').click();assert 'Skipped.' in pg.locator('.qpanel').inner_text()
  pg.locator('.qcontinue').click();assert pg.evaluate('MB_ST().i')==3
  if not played:
   pg.keyboard.press('ArrowLeft')
   pg.locator('.qpanel .qretry').wait_for(state='visible')
   pg.locator('.qpanel .qretry').click()
   assert pg.locator('.qpanel .qin').input_value()==''
   assert 'Skipped.' not in pg.locator('.qpanel').inner_text()
   assert bounds()==before
   pg.locator('.qpanel .qin').fill('2');pg.locator('.qpanel .qin').press('Enter')
   assert 'Right.' in pg.locator('.qpanel').inner_text()
  assert not errors,errors
  pg.close()
 b.close()
print('PASS: fresh/played transitions, idempotent full slide, hidden-caption questions, hint, skip, revisit, retry, answer, continue')
# An early answer during autoplay must still wait for Continue.
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('MB_BROWSER','/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'))
 pg=b.new_page(viewport={'width':1280,'height':800})
 pg.add_init_script('localStorage.clear();localStorage.setItem("mb-auto-nv","on");')
 pg.goto(Path(sys.argv[1]).resolve().as_uri()+'#2')
 pg.keyboard.press('Space');pg.locator('.qpanel .qin').wait_for(state='visible')
 pg.locator('.qpanel .qrev').click();pg.wait_for_timeout(2500)
 assert pg.evaluate('MB_ST().i')==2
 pg.locator('.qcontinue').click();assert pg.evaluate('MB_ST().i')==3
 b.close()
print('PASS: early answer during autoplay waits for Continue')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('MB_BROWSER','/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'))
 pg=b.new_page();pg.add_init_script('localStorage.clear()');pg.goto(Path(sys.argv[1]).resolve().as_uri()+'#3')
 assert pg.locator('.dots i:visible').count()==1
 pg.locator('.finish').click();pg.keyboard.press('Space');assert pg.evaluate('MB_ST().k')==4
 assert pg.locator('.section-title').inner_text()=='Section on its own'
 assert pg.locator('.dots i:visible').count()==1
 b.close()
print('PASS: final unanswered question can be skipped explicitly; identical subsection titles stay in their sections')

# Hide question steps across the player and Read, while preserving their board actions.
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('MB_BROWSER','/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'))
 pg=b.new_page(viewport={'width':1280,'height':800})
 errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
 pg.add_init_script('localStorage.setItem("mb-auto-nv","off");')
 pg.goto(Path(sys.argv[1]).resolve().as_uri()+'#2')
 pg.keyboard.press('ArrowRight');pg.wait_for_timeout(700);pg.keyboard.press('ArrowRight')
 pg.locator('.qpanel .qin').wait_for(state='visible')
 def questions(mode):
  pg.keyboard.press('s')
  pg.locator(f'[data-k=ask] [data-v={mode}]').click()
  pg.locator('.sx').click()
 questions('hide')
 assert pg.locator('.qpanel').is_hidden()
 assert pg.locator('.capt').inner_text()=='The question is finished.'
 assert '2/2' in pg.locator('.sst').inner_text()
 pg.keyboard.press('ArrowRight')
 pg.wait_for_function('MB_ST().state === "done"')
 assert pg.locator('.board.main .ink .t').count()==2
 assert 'What is one plus one?' not in pg.locator('.txi').text_content()
 for _ in range(2):pg.keyboard.press('ArrowLeft')
 assert pg.locator('.capt').inner_text()=='This slide begins with an introduction.'
 pg.locator('[data-v=read]').click()
 assert 'What is one plus one?' not in pg.locator('.article').inner_text()
 questions('off')
 assert 'What is one plus one?' in pg.locator('.article').inner_text()
 questions('hide')
 assert 'What is one plus one?' not in pg.locator('.article').inner_text()
 pg.reload()
 assert pg.evaluate('JSON.parse(localStorage.getItem("mb-settings")).ask')=='hide'
 pg.locator('.finish').click()
 assert pg.locator('.qpanel').is_hidden()
 pg.locator('.nb').click() # a slide with only a question
 pg.keyboard.press('Space')
 pg.wait_for_function('MB_ST().state==="done"')
 assert pg.locator('.qpanel').is_hidden()
 pg.keyboard.press('Space')
 pg.wait_for_function('MB_ST().k===4 && MB_ST().state==="done"')
 pg.keyboard.press('Shift+ArrowLeft')
 assert pg.evaluate('MB_ST().k===4 && MB_ST().state==="ready"')
 pg.keyboard.press('s')
 assert pg.locator('.set-quick').is_hidden()
 h_before=pg.locator('.board.main').bounding_box()['height']
 pg.locator('#control-mode').select_option('hidden')
 assert pg.locator('.set-quick').is_visible()
 assert not pg.locator('.ctl').is_visible()
 assert pg.locator('.board.main').bounding_box()['height']>h_before
 pg.locator('.set-play').click()
 assert pg.locator('.setp').is_hidden()
 pg.wait_for_function('MB_ST().state==="done"')
 assert not errors,errors
 b.close()
print('PASS: disabling an open question, reverse stepping, board actions, Read, reload, question-only slide and hidden controls')
