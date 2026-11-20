---
title: Callout and rail regression
voice: off
---
# Slide 1: Statement and derivation
### 1.1
Say: The main claim states two equalities on consecutive lines.
Board:
- erase all
- write c1 in line 1 · callout "Claim 1" · equation 1.1 · 85%
  $a+b=b+a\qquad(1.1)$
### 1.2
Say: A second line continues the same callout block.
Board:
- write c2 in line 2 · callout · equation 1.1 · 85%
  $(a+b)+c=a+(b+c)$
### 1.3
Say: We now verify the claim in a subordinated rail block.
Board:
- write r1 in line 4 · rail "Derivation." · 85%
  $x_1=a+b$
### 1.4
Say: The next step cites a helper rule inside the rail and finishes the derivation.
Board:
- write helper at 124,520 · callout "Helper" · 80%
  $x+0=x$
- write r2 in line 7 · rail · 85%
  $x_1=b+a\qquad\square$
### 1.5
Say: A remark after the block returns to the main margin.
Board:
- write rem in line 9 · 85%
  $a-a=0$
# Slide 2: Deferred derivation
### 2.1
Say: A later slide can link back to [[eq:1.1]] right from the rail header.
Board:
- erase all
- write p1 in line 1 · rail "Derivation of Claim [[eq:1.1]]." · 85%
  $a+b=c\qquad\square$
