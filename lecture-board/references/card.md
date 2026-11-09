# The card page: an illustration for students

Rules for `profile: card`. A card page goes with one lesson: it is shown on a projector in class and opened at home. A card illustrates one concept or one proof; the student moves through it step by step, starts the motion, chooses examples and drags points. The rules were worked out over five lessons of a first-year algebra course (matrices, groups of matrices, homomorphisms, quotient groups, cyclic groups); each answers a defect actually seen. Writing rules: `writing.md`. Shared figure rules: `figures.md`. Syntax: `script-format.md`, section "Cards".

## 1. The page is self-contained
- One page, one lesson; the cards follow the order of the lesson.
- A student understands a card without the problem sheet, the lecture or the lesson notes. The page is published, so it has no references to sheets, lessons, sections of notes, problem numbers or other pages.
- Every object is introduced on the page itself, briefly. A notation, a sign or a colour on the picture is explained where it appears.
- A card that repeats another is not needed.

## 2. The structure of a card
- **Title** names the subject and carries the number of the card, part and place in it ("1.2 Порядок матрицы").
- **Intro**: one or two sentences in the textbook register. "Let…" introduces the objects, then comes the statement the card proves or the problem it solves. No "Let us find out…", no rubrics like "Given", no description of the picture and no retelling of the solution. Notation on the picture is explained in the sentence of the story where it appears.
- **Story**: numbered stages that open one at a time. If the card studies an object along a standard list of questions, the questions are listed in the intro and the stages answer them in order, phrased as actions. A stage begins with an action that makes its purpose clear: "We compute…", "We compare…", "We check on an example…", "We show in general…".
- **Summary**: a stage of its own. The result is stated explicitly. If it is a map, write $f\colon X\to Y$ and say why it is a bijection and why it preserves the operation, with references to the stages.

## 3. The logic of the story
- A card illustrates a concept or a proof and shows why it is true. The story is the proof of the general case that a teacher could give at the board. The picture follows the proof on one typical example chosen in advance. Special cases and computations come at the end, as a check of the statement or as an example of what it becomes in practice. The buttons that choose an example appear only at that step.
- First what does not depend on a choice, then the general conclusion, and only then the choice of a parameter. A choice appears at the moment it is clear what is being chosen.
- An example does not replace a proof. A check on concrete numbers is a separate step after the general conclusion.
- The proof treats as many cases as it takes to show the mechanism, usually one typical and one exceptional. Other cases can move to the examples at the end.
- Each new observation is made explicitly, in a step of its own ("Note that…"), not pulled out of nowhere in a conclusion.
- Computation comes before the picture. Geometry illustrates an algebraic result already obtained; it does not replace it.
- A check that explains nothing is not needed. An example is chosen to be typical and to reveal the point, not special.
- Every property the story relies on is justified. If a set is called a subgroup, say why. A short justification opens by a click on the statement itself (`<<statement|reason>>`).

## 4. Language
- The register of a good classical textbook: "Let…", "Denote…", "We call … if …", "Then…", "Therefore…". No colloquialisms, no anglicisms in Russian, no announcements of what comes next.
- What a formula can say is said by a formula.
- A term is introduced once, when first needed, by a one-sentence definition. Only standard terms already introduced in the course. No extra names for objects.
- A colon only before a list or a formula, never as glue.
- A letter does not denote two objects in a card. If a letter is taken ($e$ for the identity), take another rather than add a disclaimer such as "denote the identity by $1$".
- Words for parts of the picture do not coincide with mathematical terms: a circle mark, not a "ring". Verbs are ordinary and modern.
- The self-evident is not written. Do not tell the student that the figure can be rotated or that the square stayed beside it.
- Concepts and methods the course has not reached (trace and determinant before that topic) are not used in a proof either. If they cannot be avoided, look for another proof.
- The text of a step never talks about the buttons ("choose a matrix with the button", "other numbers are above the picture"); the buttons are visible anyway. If a hint is needed, it hides in a note: in "Take $M=\dots$" the word "Take" is underlined with dots and opens "Another example can be chosen above the picture".
- Units and notation agree with the mathematics: angles in radians when the map is from $\mathbb R$; rational numbers as irreducible fractions, not decimals; integers in examples where possible.

## 5. Picture and motion
- The picture unfolds with the story. What has not been said is not shown.
- The story and the animation are one timeline. A step back returns the picture at once. The timeline can be dragged to any point, and the picture and the highlighted sentence follow it.
- A step is one mark on the timeline. It carries one thought (one statement, one case or one computation) and one change of the picture. A second sentence is allowed only if it explains the first, for instance by saying where it is seen on the picture. If a step treats two cases or draws two conclusions joined by "therefore", it is split into two. A stage heading names what the stage actually checks.
- Motion never starts by itself: not on opening the page, not on moving to a sentence, not on choosing an example. The ▶ at the end of the sentence or the next → starts it; after it has played, ▶ becomes ↻. While the motion runs, the sentence is highlighted. There is no separate play button under the picture.
- ▶ appears only where there is motion worth watching. A label, a circle, a frame or a colour appears at once with the sentence, without a button.
- An animation must show something. If it only plays a transformation forward and back, its point is reconsidered. Usually the point is a comparison: two actions on one picture, the trace of the previous state beside the current one.
- What is compared is visible at the same time: in a table cell the object together with its image, on the picture both results.
- A colour is tied to a meaning within a card and explained in the sentence where it appears.
- A fixed point of a map is drawn as a loop with an arrow.
- The example and the scale suit the screen. The figure is neither narrow nor small, labels do not run into each other or into the axes, everything reads from the projector.
- The text of the steps stands beside the picture in a window of constant height, and the picture stays in place. The current step is in the middle of the window; past steps move up and fade but can be scrolled back and reread, and a click on a past step returns its picture. Future steps are not shown.

### Recommendations
Devices that worked well; models, not requirements.
- The picture matches the nature of the object. A discrete group is drawn as points, and its quotient is obtained by contracting each class to a point, not by a continuous winding.
- A homomorphism is shown by arrows from a point to its image. The argument can be dragged, and its shift shows how the image moves. The homomorphism property is checked on the picture: arrows from $a$, $b$, $a+b$ and the operation in the image that takes the images of $a$ and $b$ to the image of $a+b$. The kernel: arrows from all its points to the identity.
- The codomain is drawn apart from the domain, not touching it, so that no false connection appears.
- With a new step the picture drops the earlier marks; only what the current sentence needs remains.
- A visual motion such as winding a line onto a circle is allowed at the end, as an illustration of a map already built, with a lead-in saying what exactly it depicts.
- When a new object is built from an old one (a torus glued from a square), the old one stays beside it, and a point can be dragged in it while its image moves in the new one.

### Questions
- Include questions where prediction or practice helps the lesson; a demonstration card may have none.
- A question asks for what the next step is about to show, or checks a step just made on a new case: the student predicts, then the card confirms. Exercises at the end of a card check the result on chosen examples.
- A question has one right answer that does not depend on reading the author's mind. No questions about a vague notion or a choice made by intuition (which parameter is natural, what is "the same"), and none that the previous sentence already answers word for word.
- A wrong answer that is a known trap (a fraction of a turn given as the order) gets its own remark that names the mistake; the hint is for a student who is stuck, not a restatement of the answer.
- Every object a question names has been introduced in the card before it.

## 6. Look
- The look serves the content. The page looks like a carefully set textbook page, not a web application, and nothing distracts from the mathematics.
- A restrained palette: neutral background, dark text, a few accent colours, each with a fixed meaning. Hierarchy comes from size, weight and spacing, not colour.
- No decoration: no gradients, shadows, glow, translucent panels, coloured frames, nested rounded cards, "chips", emoji or decorative icons.
- Controls of the usual kind and as few as possible. Everything that can be clicked or dragged shows a hand under the pointer and a quiet mark (a darker border, a solid underline, a circle around a point of the picture); no other hover effects, and no transitions except the animation of the picture itself.
- No recognizable template look of generated interfaces. An element added "for beauty" is removed.

## 7. Controls
- Only the controls of the current step and mode are on screen. Inapplicable ones are hidden, not disabled.
- A choice button shows the object itself (the matrix, the number), not its name.
- The short label of a card in the row of cards starts with a capital letter and is clear without the card's title. A formula will do if it names the subject ($k\mapsto a^k$, $\lvert\mathbb Z_{pq}^\times\rvert$); a fragment like "without factoring" will not.
- If the row of choice buttons appears after the first step, the picture is relaid out when it appears so that the card fits the window. The current step is always fully visible in the text window.
- A button that works only for some variants is shown only where it works.
- One card on screen. The parts of the page are tabs in its header, and the cards of the current part are a row of their short labels under the tabs; the contents (key G) is kept for the keyboard. The picture takes the window height and the page does not scroll.
- ⏮ goes to the start of the card, and from its start to the previous card; ⏭ goes to the next card, and on the last one to its end.
- A card opens on its title and intro with an empty picture; the first → shows step 1. The text window scrolls only as far as the current step needs, so the intro stays in view while it fits.
- The counter under the picture shows the stage and the sentence in it. There is no separate animation player.
- There is no Read view: the text of the card already stands beside the picture.
- A term in a sentence is underlined; a click opens its definition next to the word. The justification of a statement opens by a click on the statement itself (dotted underline), not on a separate "why?".
- Settings in a drawer on the right (key S, button `⚙︎` in the bottom bar): animation speed, text size, labels on the picture, picture size, page and board colours, questions, and where definitions and notes open. The choice is kept in the browser. Default text size 18 px. There is no Text toggle button in the bottom bar, since the text column is the card itself.
- If the picture has a coordinate grid, a line or a plane, it zooms both ways: "+", "−" and "original view" buttons in its corner and the mouse wheel over it, smoothly. When zooming out, the grid, axes and points are drawn over the whole visible area; when zoomed in, the picture can be dragged. The zoom is kept when switching steps.
- If zoom gives nothing (the picture is not redrawn and does not become clearer, as with a scheme, a lattice of points or a picture of several panels), there are no zoom buttons and no wheel zoom.

## 8. Technique
- All mathematics is KaTeX, including labels on the picture; no formulas in Unicode. When values are substituted, a command is separated by a space (`\cdot ` before a letter).
- The page is one offline file, with a light and a dark theme and a phone width.
- All KaTeX fonts are embedded, including Caligraphic, Fraktur, Script, SansSerif and Typewriter. Before publishing, check that no KaTeX `@font-face` has `src:local("none")`, or `\mathcal`, `\mathfrak` and the like silently come out upright.
- Solid figures (surfaces, gluings, bodies) use three.js embedded in the file; such a figure rotates with the mouse and zooms with the wheel and the same buttons.
- Before showing: every step in every mode and with every choice passes without console errors and without raw TeX (`scripts/lint.py` does this), the screenshots are looked at, and intermediate states of moving figures are checked (`figures.md`). Numbers in the text are recomputed separately.

## 9. Order of work
- A new format is first made on one card and shown. The rest are redone after agreement, one tab at a time, showing the result.
- Only what was asked is changed. Notes, rules and neighbouring files are not touched without a request. Back up before editing.
- A lesson note refers to a card by its anchor, `[N Title](<file.html#id>)`; the anchor is the card's `Id:`.
