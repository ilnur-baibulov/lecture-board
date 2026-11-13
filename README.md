# lecture-board

An agent skill and browser player that turns a paper, book chapter, preprint or lecture notes into a single offline HTML page — either a voiced talk at a board or a set of interactive lesson cards. The agent writes the Markdown script and figures, and the build script packs them with KaTeX and its fonts into one file that opens from disk without a server or network connection.

> **Note.** This is a vibe-coded personal tool built around my own workflow. Feel free to use, adapt or fork it.

## Modes

One script format and one engine ([`lecture-board/assets/board.js`](lecture-board/assets/board.js), [`board.css`](lecture-board/assets/board.css)) serve two profiles:

- **Talk (`profile: talk`, default)** — a voiced or unvoiced walkthrough of a paper, chapter or construction. Each step writes formulas or drives a figure on a 16:10 board with a synced caption, full transcript, continuous **Read** view, glossary popups (`[[term]]`), equation previews (`[[eq:19.1]]`, `\eqref{19.1}`), `Why?` / `Caution` notes, and `Ask:` checkpoints.
- **Card page (`profile: card`)** — step-by-step interactive illustrations for a lesson, where a picture sits beside the proof, preset examples, questions and exercises.

## Examples

[`examples/`](examples) contains three self-contained pages with their Markdown sources, figures and built HTML files:

- [`examples/weaver/`](examples/weaver) (`talk`) — Nik Weaver, *A prime C\*-algebra that is not primitive* (2001, `arXiv:math/0106252`), 15 slides using built-in `tree`, `arc`, `box`, `mark` and `point` primitives.
- [`examples/frankel-19-1/`](examples/frankel-19-1) (`talk`) — Theodore Frankel, *The Geometry of Physics* (3rd ed.), §19.1 (*The groups SO(3) and SU(2)*), 10 slides with custom Canvas figures ([`frankel-19-1.fig.js`](examples/frankel-19-1/frankel-19-1.fig.js)), equation previews and an `Ask:` checkpoint.
- [`examples/cyclic-groups/`](examples/cyclic-groups) (`card`) — two lesson cards on cyclic groups and the order of an element in $\mathbb C^*$ and $\mathrm{GL}_2(\mathbb R)$, with animated Canvas figures ([`cyclic-groups.fig.js`](examples/cyclic-groups/cyclic-groups.fig.js)), zoom, click-on-figure questions and exercises.

## Install

Pass the repository URL to your agent (Claude Code, Codex, Antigravity) and ask it to install the [`lecture-board/`](lecture-board) skill, or symlink [`lecture-board/`](lecture-board) into your agent's skills directory.

## Usage

Give the agent the source material (PDF, TeX or notes) and ask for a talk or card page. The workflow in [`lecture-board/SKILL.md`](lecture-board/SKILL.md) is incremental by design: the agent agrees on a short plan, scripts and builds only the first part (or first card) as a sample, and waits for your review before writing the rest part by part. Generating an entire long talk in one pass produces sloppy slides and should be avoided.

Building needs only Python 3 (standard library); headless layout checks use Playwright.

```bash
python3 lecture-board/scripts/mdscript.py check examples/weaver/weaver.md
python3 lecture-board/scripts/build.py examples/weaver/weaver.md examples/weaver/weaver.html
uv run --with playwright python3 lecture-board/scripts/lint.py examples/weaver/weaver.html
```

Skill instructions and format reference live in [`lecture-board/SKILL.md`](lecture-board/SKILL.md) and [`lecture-board/references/`](lecture-board/references).

## Roadmap

- Pre-rendered voice track for finalized scripts using a local TTS model (such as Kokoro or similar), alongside the browser's live Web Speech synthesis used while drafting.
- In-page feedback box to record quick review notes on the current slide or step while watching.
- Repurposing skill to create lecture-board on any subjects.

## License

MIT. Built pages embed [KaTeX](https://katex.org) (MIT, Khan Academy and contributors); see [`LICENSE`](LICENSE).
