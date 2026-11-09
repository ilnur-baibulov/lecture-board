# Script format

A talk is a readable Markdown script, `NAME.md`, compiled by `scripts/mdscript.py` and built into one offline HTML page by `scripts/build.py`. The docstring at the top of `scripts/mdscript.py` is the authoritative grammar; this file explains it with examples.

## Front matter and glossary
```
---
title: Prime, factor and primitive ideals
subtitle: one line under the title (may contain $TeX$)
lang: en              # or ru: the language of the text and of the voice
voice: on             # off: no voice; each step lasts its reading time
figures: NAME.fig.js  # optional, one or more files next to the script, space-separated
---
# Glossary
- **prime** — A C*-algebra is prime if any two nonzero ideals have nonzero intersection.
- **cyclic | cyclic vector** — the key, then the term as shown, then the definition
```
A glossary key is linked from Say as `[[prime]]` or `[[prime|primeness]]`; a click opens the definition without pausing.

## Parts, slides, steps
```
# Part: Definitions and examples
# Slide 1: Prime and primitive
### 1.1
Say: A C*-algebra $\mathcal A$ is [[prime]] if any two nonzero ideals meet.
Voice: A C star algebra {\mathcal A} | is prime | if any two nonzero ideals | meet.
Board:
- write pr in line 1
  $\mathcal A\text{ is prime }:\Longleftrightarrow\ I,J\neq0\Rightarrow I\cap J\neq0$
### 1.2 ¶
…
### Why? after 1.2
**Why is every primitive algebra prime?** Because … (the answer first, then details)
### Caution after 1.3
**The order of the factors is reversed** Then what really happens.
```
- `# Slide N: Title`: the N is only for the reader; slides are numbered by their order. `[[slide:Title]]` anywhere becomes "slide N".
- `### N.M ¶` starts a new paragraph in the transcript and in Read.
- `Say:` is the shown sentence, with `$TeX$` and glossary links. `Voice:` is what is spoken.

## Voice markup
- Math is written `{TeX}`: `{P_a}`, `{V_{a,b}}`, `{\ell^2(X_a)}`. The compiler reads it aloud by `assets/lexicon.json` (letters by their names, "pee sub ay", because a synthesizer reads a bare "a" as an article and glues "P sub a" into one word). Whole phrases ("two to the aleph null") can be lexicon entries too.
- `|` is a short pause, `||` a long one. Chunks are spoken one by one with these pauses; letting the synthesizer place pauses from punctuation sounded too fast.
- `^` marks where the next board action starting with `^` begins. A `^` in Voice and a `^` item on the Board are a pair. To run an action after the last spoken phrase, end Voice with `| ^` and put the cued action after any board actions it must follow.
- The lexicon is English. With `lang: ru` the voice is Russian, and formulas in Voice are spelled out in words ("цэ-звёздочка-алгебра Тэ готическое", "эф плюс, умноженная на хи плюс"); check the reading by ear.

## Board actions
The board is 1600×1000, y down. Rows: `line N` (y = 90 + 95(N−1)), `t1`, `t2` (= lines 1 and 2), `b0`, `b1`, `b2` (y = 760, 850, 940); `right` after a row starts at the right half.
```
- write ID in line 3 · blue · 85%          text in a row; the next line, indented, is $TeX$
  $…$
- write ID at X,Y · dim · fade · centered
- write ID next to OTHER                   continues a line after OTHER
- node ID "LABEL" at X,Y · label 90%
- edge ID FROM → TO       (dashed edge …; FROM/TO are ids or X,Y)
- arc ID FROM → TO · depth 40 · label $…$
- box ID at X,Y size W×H
- mark ID ID … · yellow                    recolour
- erase ID ID …     |     erase all       (only at a slide boundary)
- point ID ID …                            a dot glides under each in turn and a ring flashes around it;
                                            ID:name is the part \piece{name}{…} of the formula ID (mark takes it too)
- wait 600
- together:                                nested items below run at the same time
- ^ ACTION                                 waits for the next ^ in Voice
```
Options: colours `blue violet yellow dim ink red`; size `85%`; `fade`; duration `700ms`; `term KEY` (the written text opens a glossary card); `centered`.

**Rulers**: `ruler R in ROW · from X0 to X1`, then `tick ID on R at F "TeX"`, `ticks ID on R at F F …`, `span ID on R from F to G "TeX"` (F, G between 0 and 1).

**Trees** are laid out by the engine from an indented outline:
```
- tree T · levels n
    X
      0
        0
        1
        …
      1
        …
- grow T to level 1
- mark path (0,1) · blue
- box B around level 2 of T
```
Nodes are named by their path: `(0)`, `(0,1)`, `(sqrt2)`.

## Figures drawn by a script
For a picture with structure of its own (a trace bar, a grid of pairs, a curve in the plane) write a figure kind in `NAME.fig.js` next to the script and name the file in `figures:`.
```js
(function(){
const R=String.raw;
Board.figure('tracebar',{init:{r:0,half:false},
  controls:[{key:'n',type:'range',min:1,max:9,label:'n',show:s=>s.live}],   // optional
  draw(g,s){
    const x0=40,x1=g.W-40,y=g.H/2;
    g.line([[x0,y],[x1,y]],'dim',2);
    if(s.r>0) g.line([[x0,y],[x0+(x1-x0)*s.r,y]],'c1',6);
    g.label(x0,y+10,'0','dim','s',.8);
    if(s.half) g.label((x0+x1)/2,y-10,R`\tfrac12`,'warn','n',.8);
  },
  canDrag:s=>s.live, drag(s,x,y,W,H){return {r:Math.max(0,Math.min(1,x/W))}}   // optional
});
})();
```
- `g` draws in the figure's own units (`g.W × g.H` = the kind's `size: [w, h]` if it gives one, else the size given in the script; the drawing is scaled to the place): `line(pts,col,w,dash)`, `dot(x,y,r,col)`, `ring(x,y,r,col,w)`, `arrow(p,q,col,w)`, `label(x,y,TeX,col,pos,size)` with `pos` one of `c n s e w ne nw se sw` (the side of the point the label sits on); `g.ctx` is the canvas context and `g.col(name)` a colour, for fills.
- Colours are the board tokens `ink dim c1 … c5 acc warn grid axis` (c1 blue, c2 violet, c3 green, c4 orange, c5 teal, acc yellow, warn red), so both themes work. `g.fill(pts, colour, alpha)` fills a polygon.
- In the script: `figure ID KIND at X,Y size W×H k=v …` places it; `set ID k=v …` changes its state at once; `play ID k=v … · 1500ms` moves its numbers over a duration (pausable, follows the speed).
- A range can set `readoutWidth` in em. Reserve enough space for its widest readout so the slider and its neighbours stay fixed as signs, digits and fractions change.
- By default, control keys are shared by all figures of a talk: a viewer’s choice applies to figures with the same key and survives silent jumps. A `set` or `play` reached in playback takes over the keys it names. Use distinct keys for distinct parameters and a shared key for views of the same state. A control’s `show(s)` predicate only governs visibility.
- For range and choice controls that inspect a narrated example, set `inspect: true` on the figure kind (or on the individual control when the figure also has persistent example-selector buttons that update `{{name}}` and `Say if`). Inspection controls pause Watch, stay hidden while a step's own motion is armed or actively running, and temporarily override the figure drawing. Continuing, choosing another example or navigating restores the scripted state. The changes are local to that figure and do not alter values used in the script's text or the state of a different board. For a range, `name` labels it for assistive technology and `replay: 2800` adds a local replay from minimum to maximum over 2800 ms (scaled by the animation speed) at the current values of the other controls. This replay keeps the current step and is silent. Use [the figure guidelines](figures.md) to decide whether a replay is worth adding.
- Wrap each file in its own function, as above.

## Commands
```
python3 scripts/mdscript.py check talk/NAME.md       # mechanical problems: unknown ids, unpaired ^, …
python3 scripts/mdscript.py voice talk/NAME.md       # the spoken text, step by step; check also flags TeX the voice cannot read
python3 scripts/build.py talk/NAME.md out/NAME.html  # one self-contained page
python3 scripts/lint.py out/NAME.html --shot out/NAME.png
```
`scripts/` is relative to this skill's folder; the script and output paths are relative to where the command runs. The generated HTML is never edited by hand. In the browser console, `MB_LINT()` runs the same checks, `MB_LINT({slides: [3, 5]})` only on those slides (1-based), and `MB_AT(k, i)` shows the board of slide k (0-based) after i steps.

## Cards (`profile: card`)
A card page is a talk with `profile: card` in the front matter: a slide is a card, the student steps, a `play` waits for ▶, and the text of the card stands beside the board in place of captions. There is no Voice unless `voice: on`, and the interface follows `lang`. Stages (`## Heading`), `Say if` and `{{name}}` work in talks too.
```
---
title: Циклические группы
profile: card
lang: ru
figures: l9.fig.js
---
# Part: Порядок элемента
# Slide 1: Порядок элемента
Id: p-pow                      the anchor: file.html#p-pow
Short: Порядок элемента        the label in the row of cards
Intro: Пусть $a$ — элемент группы $G$ …     (several Intro: lines make several paragraphs)
## Совпадающие степени
### 1.1
Say: Проследим рассуждение на примере … Пунктиром проведена окружность $\lvert w\rvert=1$.
Board:
- figure F powers at 75,0 size 1450×1000  placed on the board like any figure; the kind may draw in its own units, size: [725, 500]
- play F pk=1 · 3600ms                    motion: the step gets ▶ and moves pk from its value to 1 when pressed
### 1.2
Say: Пусть $a^k=a^l$ …
Board:
- set F view=kl                           at once, with the sentence
## Примеры
### 1.14
Say: <<Возьмём|Другой пример можно выбрать над рисунком.>> $z={{zt}}$ и отметим его степени.
Board:
- set F view=ex ex=true
### 1.15
Say if kind=fin: Аргумент числа ${{zt}}$ составляет ${{fr}}$ оборота …
Say if kind=big: …
Say: … (used when no Say if matches)
```
- The state of the figure at a step is computed from the start: `init`, then every `set` and the end values of every `play` up to that step. So a step back, a click on a past sentence and dragging the timeline all show the right picture at once.
- `<<label|reason>>` underlines `label` with dots; a click opens the reason next to it.
- `{{name}}` in Say is filled from the figure's state and from its `text(s)`, which returns values for the text (the chosen example in TeX, its order). `Say if key=value …:` gives the sentence for a state; the first that matches wins.
- The figure's `controls` (buttons with `values` and `tex`, or a `range`) stand above the picture, shown only where `show(s)` is true; the student's choice holds for every step of the card. `drag(s, x, y, W, H)` works as in a talk.
- A kind with `zoom: true` gets the zoom of `card.md` §7: buttons + − ⌂ in the corner, the wheel, dragging a zoomed-in picture; the zoom holds across steps. `g.view` is the visible rectangle in figure units (draw the grid and the axes over it), and `g.fixed(x, y, …)` is a label that stays in place when the picture is zoomed (a formula in a corner).
- Not built yet: html figures (tables), three.js figures. Add them when a card first needs them.

## Questions
A step with `Ask:` in place of `Say:` is a question: ordinary playback waits for an answer, a reveal or a skip. Questions work in cards and in talks. Settings offers asking, showing the answers, or omitting the question steps. In the last mode, board actions still run in order and the question text and feedback are omitted.
```
### 1.7
Ask: Какой из точек $1,a,\dots,a^5$ равна $a^{15}$?
Answer: click F a3 = $a^3$        a click on figure F; the kind's hit(s, x, y, W, H) names what is under the pointer
Hint: Разделите $15$ на $6$ с остатком.
### 1.21
Ask: Каков порядок числа $z=e^{4\pi i/5}$?
Answer: 5                          typed; several accepted forms: 5 | пять; a list "2, 8, 14, 20" is accepted in any order
If 5/2: $\frac52$ не натуральное число, а …     the remark for this wrong answer (a typed value, or a name for a click)
Then: …                            optional, shown once the question is answered
Board:
- set F view=ex ex=true z=3 lock=true
```
- A wrong answer shows its own remark if one is given, otherwise "not quite" and the hint; a second wrong answer opens the answer. `=` after a click target gives the answer as shown ($a^3$).
- The figure of a click question marks the chosen point: the engine sets `qpick` (the name) and `qok` in its state, and the kind draws them (a green or red circle mark).
- Comparison of typed answers ignores spaces, `$` and case; ∞ may be typed as `inf`.
- A question has no motion; its Board may set the figure (a fixed example, controls locked by a state key).


## Optional section hierarchy
`# Section: Title` groups subsequent parts under a parent section and clears the current part. `# Part: Title` remains optional. Use only the levels the material has; neither is required. A talk shows the available section and part on one line and the slide title with its counters on the second. The contents and Read view include the parent section. Existing scripts with only parts keep working.

## References to equations
Give a board formula a stable label with the option `equation LABEL`, for example:
```
- write comm in line 3 · equation 19.2
  $[E_i,E_j]=\sum_k\epsilon_{ijk}E_k\qquad(19.2)$
```
In Say, Why?, Caution or other prose, write `[[eq:19.2]]`. Inside a TeX formula use `\eqref{19.2}`. Both display a clickable `(19.2)` and open the source formula without leaving the current slide. Use the source equation number where one exists. Labelling a row leaves its printed number plain. A reference in text or TeX opens the preview. Keep Voice as ordinary spoken words.

For a formula written over several board rows, give each row the same equation label on that slide; the preview shows them in script order. Labels reused on another slide and references to missing labels are rejected by the compiler. The popup is a reminder, not a substitute for the short equality needed to follow the present slide.
