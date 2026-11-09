---
name: lecture-board
description: Turn a technical or mathematical text into one offline interactive HTML page with KaTeX and figures, in two profiles of one engine. A talk is a voiced walkthrough at a board of a paper, preprint, section, book chapter or long explanation, with slides, captions, a transcript, a Read view, definitions and Why? notes. A card page is a set of illustrations for a lesson, where students step through a proof or construction beside a picture, start motions, choose examples and drag points. Use when the user asks for a lecture-board or math-board talk, an explainer, an animated or voiced walkthrough of a proof or construction, slides that explain a paper or chapter, or interactive illustrations for a lesson or course.
compatibility: Needs Python 3 (stdlib only) to build. The layout check needs Playwright (pip install playwright, or uv run --with playwright) or any browser with a console. The page itself runs offline in any modern browser; the voice uses the browser's speech synthesis.
metadata:
  author: Ilnur Baibulov
  version: "1.0"
---

# lecture-board

One engine, one script format, one figure API and one set of writing rules, in two profiles; each page is one self-contained HTML file:
- **talk** (default): a colleague explaining a piece of mathematics at a board. Each step is one spoken sentence with its caption and the board action it talks about; the story plays by itself, with voice. For colleagues, or for one reader working through a paper.
- **card** (`profile: card`): the same player cut down to a page of illustrations for a lesson. No voice (unless `voice: on`), the text of the card stands beside the picture in place of captions, and light by default. Each card proves one statement step by step beside a picture; the student moves on, starts each motion with ▶, chooses examples and drags points. For students, in class on a projector and at home.

Choose by the audience and by who drives: a lecture-like walk through a paper or chapter is a talk; illustrations to a lesson, a problem sheet or a course are cards. If the request does not say, ask.

`scripts/` and `references/` below are relative to this file's folder. The talk or lesson itself lives with the material it explains, not in the skill folder.

## Files
| File | What it holds | Read it |
|---|---|---|
| `references/talk.md` | what a script must do: purpose, thread, board, steps, Why?/Caution, the editor pass | before the plan, and before every editor pass |
| `references/card.md` | what a card page must do: structure, logic of the proof, picture and motion, look, controls | before writing cards, and before every pass over them |
| `references/figures.md` | how to choose, label and verify a picture or motion in either profile | before designing or reviewing a figure |
| `references/script-format.md` | the script syntax, board rows, figures drawn by a script, the commands | before writing the script |
| `references/writing.md` | the prose rules for Say and notes | before writing any text |
| `references/engine.md` | how the built page behaves | only when changing the engine or answering how the page works |
| `scripts/mdscript.py`, `scripts/build.py`, `scripts/lint.py` | check, build, layout lint | |
| `assets/` | the engine (`board.js`, `board.css`), the voice lexicon, KaTeX | |

## Workflow
1. **Agree on the task.** Ask for what is missing: the material (path, BibTeX entry, link), the goal (the question the talk must close), the language (`en` or `ru`) and voice on or off. For a talk, ask also for the style and how close to keep to the source (`references/talk.md`, Style): brief, seminar, learning, explanatory or problem-led; the author's voice or a neutral one; the source's structure or a rebuilt one; and, if the user wants other than the style's default, how many questions to the viewer. Put first the option that fits the source: a well-written book usually keeps the author's voice and order, a terse paper is usually rebuilt. Always ask where the talk lives, as two questions, since the sources and the page often belong in different places.
   - The sources (`NAME.md`, `NAME.fig.js` for figures, `NAME.plan.md`): a new project folder in the user's convention for projects, with its own git repository; a `talk/` folder next to the material; or a temporary folder for a one-off try.
   - The page (`NAME.html`): an `out/` folder beside the sources, or next to the notes the user reads it with.

   Put first the option that fits where the material lives.
2. **Read the sources.** Read the material and every reference it leans on from the originals. A claim taken from a secondary text is checked against the original, and disagreements are reported to the user. Known and new are kept apart. Notice unexplained premises, unmotivated computations and cross-references needed to follow the argument, and supply the missing explanation where it is used.
3. **Plan.** Write `NAME.plan.md`: the goal and the parts, each with its slide titles. It stays short; nobody reads a detailed storyboard. Show it in a few lines and go on.
4. **The first part as a sample.** Script the first part only (or the first few slides). Check, build and lint it, then show the user the page and wait for remarks. The remarks often change the whole plan, so the rest waits.
5. **The rest, part by part.** For each part: script it, run `mdscript.py check`; if the talk has voice, read the output of `mdscript.py voice` for the new part as a listener and fix what sounds wrong (in the script, or in the lexicon when it would recur); build, run `lint.py` until it reports nothing, then the editor pass of `references/talk.md`. If the agent can start independent reviewers, two reviews pay off: one reads the narrative (does each step follow, is each symbol defined before use, does each Why? open with its answer), the other the mathematics and the sources. Update the plan when the parts change.
6. **Remarks.** A remark about this talk is applied to the whole script, not only where the user pointed, keeping Say, Voice and Board consistent. A remark about the format (it would apply to any talk) is proposed to the user as an addition to `references/talk.md` or `references/figures.md`.

## Cards
The workflow is the same, with these changes. The material is the lesson (its notes and problems) and the course so far, since a card uses only what the course has reached. For the plan, list the cards with the statement each proves and the picture it follows, and the questions and exercises they ask (`card.md`, Questions), and show the list. The sample is one card, built and shown before the others. Each card is one figure kind in the page's `*.fig.js`; its state is driven by the steps (`script-format.md`, "Cards"). The rules are `references/card.md`; `references/talk.md` does not apply.

## Commands
```
python3 scripts/mdscript.py check talk/NAME.md
python3 scripts/mdscript.py voice talk/NAME.md     # with voice only: what will be said
python3 scripts/build.py talk/NAME.md out/NAME.html
python3 scripts/lint.py out/NAME.html --shot out/NAME.png
```
`lint.py` opens the page headless, plays every step and reports text past the board edge, overlaps, text on a figure, the reserved corners, captions longer than the strip, KaTeX and console errors. Without Playwright, open the page in a browser and call `MB_LINT()` in the console. Lint does not read: it cannot tell whether a glossary link agrees in case with the sentence, whether a symbol was defined before use, or whether a moving label crosses a curve between steps. Inspect screenshots and operate interactive figures in a browser (`references/figures.md`).

## The rules that matter most
Each is explained in `references/talk.md`.
- One step, one sentence, one thought, reached by splitting and never by gluing with "and".
- Every formula the voice names is on the board at that moment, or highlighted there. The board carries notation, not prose, and never a sentence the voice says in other words.
- Every symbol is defined in a Say before it is used. Only standard terms, each defined when first needed.
- General statement first, then the instance on the figure.
- A Why? opens with the answer to its own question. A Caution names a real trap. At most one or two per slide.
- Erase only at a slide boundary. Keep the board's top right and bottom right corners free.
- Self-contained: nothing refers to texts outside the talk. Every claim is proved on the board or in a Why?, or attributed to its source.
- Slides are referred to by title (`[[slide:Title]]`), never by number; earlier equations by their label (`[[eq:LABEL]]` or `\eqref{LABEL}`).
- The generated HTML is never edited by hand; change the script and rebuild.
