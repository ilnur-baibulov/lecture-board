# The talk: what a script must do

Rules for the content of a lecture-board talk. They were agreed with a working mathematician over several talks (a preprint in operator algebras, a chapter on Lie groups and spinors, the examples of a section of a paper) and each one answers a defect actually seen.

## Purpose
- A talk turns a long linear text (a 20-page explanation, a preprint, a book chapter, the examples of a section) into something to watch, listen to, read and click: a colleague explains the work at a board, with the key places written out on it.
- Speech is the metronome that carries the viewer through a long text. Voice is on by default and the viewer can turn it off; a script may also go without voice (`voice: off`). This is the only difference between a talk for colleagues and a study aid for one reader; everything else is the same.
- The audience is a mathematician from a nearby field. Definitions are recalled when they are needed.
- Rigorous, not popular. Full proofs are available, in the text or behind a Why?. No characters, no metaphors in place of definitions.
- Self-contained: no references to the user's notes or files.
- Language: English by default; `lang: ru` in the front matter sets the language of the text. The interface is always English.

## Style
- The style of exposition is agreed before the plan and written in its first line; it holds for the whole talk, with individual passages adjusted to the difficulty of the material. The styles:
  - **brief**: the main line only, statements and the key step of each proof;
  - **seminar**: a colleague's talk, statements with full proofs at the pace of a research seminar, motivation in one line;
  - **learning**: every step spelled out, the computations done in full, with checks along the way;
  - **explanatory**: motivation, pictures and examples beyond the source, to show why the objects are natural while keeping routine steps concise;
  - **problem-led**: each slide starts from a question the viewer tries first, and the exposition answers it.
- Independently of the style, the plan records how close the talk keeps to the source:
  - **voice**: the author's own (examples, historical remarks, phrasing where it works in speech, attributed: "the author calls this…") or neutral;
  - **structure**: the source's order, or rebuilt in the order that best leads to understanding.
- Keeping the author's voice preserves their examples, historical remarks and phrasing while supplying missing explanations and repairing local order where a premise is used before it is established. Attribute a substantive addition where it could otherwise be mistaken for the source ("left to the reader in §3"); ordinary transitions need no announcement.
- How many questions to the viewer (`Ask:`) follows the style unless the user asks otherwise: none in a brief or seminar talk; varied practice in a learning talk, from a sign to a short computation; a few in an explanatory talk where prediction clarifies a step; in a problem-led talk the questions carry the slides. These are defaults, never a quota. A question checks what was just shown or invites a prediction from premises already supplied; it never asks for an answer already visible word for word on the board, and two never come in a row.

## Material and thread
- The source and every reference it leans on are read from the originals before scripting. If an earlier example or cross-reference fails to supply the needed argument, explain the missing step at its point of use. A claim taken from a secondary note is checked against the paper, and disagreements are reported to the user.
- Known and new are kept apart: each statement on the board says where it comes from (paper, section), and nothing known is presented as new. Use a standard name when there is one; if the source uses an elementary fact, state and explain it without inventing a named principle.
- The thread lives in a short plan next to the script (`NAME.plan.md`): the goal of the talk and the parts with their slide titles. A new session starts by reading the plan and the script.
- Every slide opens with a step of its own saying which question of the goal it answers and why it comes now; a slide that answers none is cut. Where the source opens a section without saying what it is for, the talk supplies the reason and does not attribute it to the source. Distinguish definitions, assumptions, announced previews and proved deductions; a preview must never silently become an established premise.
- One thought per step is met by splitting, never by gluing: two thoughts become two steps. A clause is not attached with "and" or a semicolon to pass the one-sentence check; a consequence takes "so" or a participle, a property becomes a relative clause.
- A part that applies results already set out (the examples of a section) opens with a step of its own: one declarative sentence saying what the part will show or compute, naming the conclusion where possible. It is concrete: not a plan of the slides, not a recap, no mention of "the paper". A question replaces it where the answer should come as a discovery. A part that only recalls definitions needs no such step.
- One topic is one talk: the examples of one section go into one script divided into parts, not into separate pages, so the contents shows the whole section at once. Several examples in a row each end with their own summary slide.
- A long talk is divided into parts (`# Part: Title`), and optionally grouped under parent sections (`# Section: Title`) when the source has a two-level hierarchy. Omit levels the material does not have. A talk on a book or paper should make the source's sectioning visible, for instance by carrying section numbers in the part titles; it need not follow the sectioning where another order explains better. Part titles are typed on one line (no matrices: they show in the slide line). Slide titles inside a part do not repeat its name ("Summary: …" rather than "Summary of example …").
- Every slide has a short title that says what the slide establishes and is understandable before the slide; rephrase an opaque source heading when its wording needs the conclusion to make sense.
- Slides are referred to by title, never by a hand-written number: `[[slide:Title]]` becomes "slide N" at build time, and the plan names slides by title. Earlier equations are referred to by their stable labels (`[[eq:LABEL]]` in prose, `\eqref{LABEL}` in TeX; see `script-format.md`).

## Board
- Every formula or object the voice names is on the board at that moment, or is highlighted there. A phrase without a board counterpart is a defect.
- General statement first, then the instance on the figure. Make clear whether a picture illustrates a result already obtained, supplies a geometric step of the proof, or sets up the question that follows.
- Write on the board only what the viewer needs to see later or to compare. Conventions and remarks that the voice and captions already carry ("ideals are closed and two-sided") stay off the board; a step may have no board action. The definition of a symbol is not such a remark: it goes on the board.
- The board alone lets a viewer who missed a sentence recover the step. Every symbol on it is introduced there where it first appears, by its definition or the space it lives in ($\mathbf x=(x,y,z)^T\in\mathbb R^3$, $h=\mathbf h\cdot\boldsymbol\sigma\in i\,\mathfrak{su}(2)$). If an index denotes a coordinate axis, basis element or component, write that correspondence on the board when introducing it. Every step that moves the argument leaves a formula on the board, or $\Rightarrow$ with a short reason; when a conclusion rests on a short substitution or differentiation, write the connecting equality on the board rather than leaving the viewer to reconstruct it from separate lines.
- The board carries short notation, not prose. A line is a formula or a few words joined by $:\Longleftrightarrow$, $\iff$, $\Rightarrow$ ("$\mathcal A$ is prime $:\Longleftrightarrow$ …", "counterexample $\Rightarrow$ non-separable"); labels on a figure may be verbless.
- The board never shows a sentence the voice says in other words: the eye must not read one text while the ear hears another. Words on the board are the voice's own words, shortened.
- Erase only at a slide boundary, never in the middle or at the end of a slide what that slide has just defined; when the board is full, start a new slide. Do not crowd.
- No private shorthand on the board: a notation the viewer has not been given ("$(a,\,y_{n+1},\dots)$" for a sequence that starts with the tuple $a$) is written out in full or defined first.
- The pointer (`point ID …`) shows what the voice is talking about when the words alone do not. It complements, never replaces, writing a formula on the board. Its natural place is a reference back to something already on the board. One to three per slide.
- Figures come in four levels, from the most common to the rarest: rows for text; a library of figure kinds laid out by the engine (a tree now); a free drawing by coordinates; an interactive figure drawn by a script (see `script-format.md`). A kind is added the first time a talk needs it and then reused, not reinvented.
- Interactivity stays where it shows something (`figures.md`): a parameter the statement depends on becomes a control of the figure; a figure without parameters has none. Play a narrated motion before revealing inspection sliders (`inspect: true`, `replay`), and hide them again when a later step starts a new narrated motion on the same figure.
- The board's top right corner stays free for the Why? and Caution signs, and its bottom right corner for the note "Space: play" at the start of a slide.

## Steps and voice
- One step, one thought: a step's caption is a single sentence (an introductory sentence and a definition are two steps), so that ← → and replay land exactly on the thought the viewer wants to hear again.
- Every symbol is defined in a Say before it is used, not only in a Why? or on the board.
- Each glossary term is linked on its first use in Say, and the link agrees in case with the sentence.
- `Voice` speaks the same sentence as `Say`, so the eye reading the caption never meets different words from what the ear hears. Keep the prose wording, clauses and connectives of `Say` intact — never drop opening phrases or logical links (`therefore`, `precisely`, `so`, `hence`) or paraphrase a clause in `Voice`. Only formulas and equation links change into spoken words; if a sentence in `Say` sounds awkward when read aloud verbatim, rewrite both `Say` and `Voice` together.
- The voice is cut into short chunks with pauses at formula boundaries ("P of zero, one, | times P of one, zero, | is zero"). Every mispronunciation found by ear becomes a lexicon entry.
- In Voice, "Lie" is written "Lee"; a bold letter that denotes a vector is read "vector x", not "bold x".

## Why? and Caution
- A **Why?** is a question the viewer may reasonably ask whose answer would break the main line: a short proof, a reason, where a hypothesis enters. Its title is the question, and its text opens with the answer in one sentence ("In the count of orthogonal projections.", "Because …"), then the details.
- A **Caution** marks a place where the text silently does something a careful reader could get wrong: an identification, a reversed direction, a notation clash, a step that only looks trivial. Its title states the trap, its text says what really happens.
- A note never restates what the board and captions already show; it gives what they leave out. If its first sentence could be read off the board, rewrite it.
- Choose the explanation that establishes the claimed relation directly: if a short calculation or matrix derivative gives the answer, show it rather than replacing it with verbal geometric intuition.
- At most one or two per slide, and only where they carry a reason or a warning.
- A computation that is bulky but clear in essence goes into a Why?: Say keeps the action and the result, the board keeps the result.

## Questions while watching
- A question the user asks while watching is answered where the conversation is. A local side question on a slide already seen goes into a Why? or a Caution there; if the question exposes a missing premise or a broken order of explanation, repair the main line on the earlier slides rather than hiding an essential step in an optional note. The current slide may gain steps: the answer is drawn on the same board, as a colleague would answer at the board. Later slides are rewritten freely. If the answer needs a result proved later, it says so ("Lemma 1, later").
- The plan logs each question in one line: the slide, the question in the user's words, where the answer went.

## The editor pass
It runs after the first draft and after every remark of the user. The remark becomes a rule, is applied to the whole script and not only where the user pointed, and Say, Voice and Board are kept consistent. Changes are proposed as a list "was → becomes" and go in after the user agrees, unless they asked to apply them at once. A remark about the format rather than this talk is a candidate for this file or `figures.md`.

Questions the pass asks of every step:
- Is every formula the voice names on the board at that moment, or highlighted there?
- Can a viewer who missed this step's sentence read off the board what each symbol is, what its indices mean, and what connecting equality produced the step?
- Does the talk keep the style, voice and structure recorded in the plan, and do its questions have a clear purpose?
- Does the board show prose, a sentence the voice says in other words, or something only the captions need?
- Is a statement on the board written with a verb or with $:\Longleftrightarrow$, $\iff$, $\Rightarrow$?
- Is each step one sentence, one thought, reached by splitting and not by gluing?
- Is the voice cut into short chunks with pauses at formula boundaries?
- Does Voice keep the prose words, clauses and connectives of Say, without dropping qualifiers or paraphrasing?
- Is each glossary term linked on its first use in Say?
- Does each Why? open with the answer to its own question, add what the board leaves out, and never hide a premise essential to the main line?
- Is every word that is not a standard term defined before it is used, and is no metaphor standing in for a definition?
- Is each slide title understandable before the slide?
- Does each sentence pass `writing.md` (one reading, named referents, no invented phrases, no colon glue)?
- Is every claim proved, on the board or in a Why?, and does nothing refer to texts outside the talk?
- Does the first step of a slide say what the slide establishes and why it comes now, and are previews kept distinct from proved premises?
- Does each letter denote one object throughout the talk, and is the same connective kept out of neighbouring steps?
- Is a bulky computation that is clear in essence moved into a Why?
