"""Regression tests for mechanical glossary checks in mdscript.py (stdlib only)."""
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'lecture-board/scripts'))
import mdscript


def check_text(src):
    S = mdscript.parse(src)
    return mdscript.check(S), mdscript.warnings(S)


# 1. Clean talk: term linked on first use, math mention ignored, no warnings
clean = """---
title: Clean glossary
lang: en
voice: off
---

# Glossary
- **orbit | group orbit** — The image of a point under a group action.
- **su2 | SU(2)** — Special unitary two-by-two matrices.

# Slide 1: First use
### 1.1
Say: Consider the [[orbit|group orbit]] of $x$ under $SU(2)$ and the group [[su2|SU(2)]].
Board:
- erase all
- write o in line 1
  $G\\cdot x$
"""
errs, warns = check_text(clean)
assert not errs, f'unexpected errors: {errs}'
assert not warns, f'unexpected warnings: {warns}'

# 2. Unknown glossary key in Say and on Board term option
bad_ref = """---
title: Unknown ref
lang: en
voice: off
---

# Glossary
- **orbit | group orbit** — An orbit.

# Slide 1: Bad refs
### 1.1
Say: See [[missing|missing term]].
Board:
- erase all
- write a in line 1 · term ghost
  $x$
"""
errs, warns = check_text(bad_ref)
assert any('unknown glossary term "missing"' in e for e in errs), errs
assert any('unknown glossary term "ghost"' in e for e in errs), errs
assert any('unused' in w or 'never linked' in w for w in warns), warns

# 3. Unlinked plain mention before first link, plus unused term
late_and_unused = """---
title: Late link
lang: en
voice: off
---

# Glossary
- **orbit | group orbit** — An orbit.
- **dead | dead term** — Never referenced.

# Slide 1: Plain first
### 1.1
Say: Every group orbit is nonempty.
Board:
- erase all
- write a in line 1
  $x$

### 1.2
Say: Now we link the [[orbit|group orbit]] too late.
"""
errs, warns = check_text(late_and_unused)
assert not errs, errs
assert any('never linked' in w and '"dead"' in w for w in warns), warns
assert any('appears unlinked at 1.1 before its first link at 1.2' in w and '"orbit"' in w for w in warns), warns

# 4. Card profile Intro: counts as a link
card_intro = """---
title: Card intro link
profile: card
lang: en
---

# Glossary
- **ord | order of an element** — Smallest positive power giving the identity.

# Slide 1: Card
Intro: Let $\\operatorname{ord}a$ be its [[ord|order]].

### 1.1
Say: The order of an element divides the group size.
"""
errs, warns = check_text(card_intro)
assert not errs, errs
assert not warns, f'card Intro link should satisfy glossary check: {warns}'

print('PASS: tests/glossary.py')
