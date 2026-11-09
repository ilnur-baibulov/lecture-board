---
title: Cyclic groups
profile: card
lang: en
figures: cyclic-groups.fig.js
---
# Glossary
- **ord | order of an element** — The order of an element $a$ is the number of elements in the cyclic subgroup $\langle a\rangle$, denoted $\operatorname{ord}a$. If $\langle a\rangle$ is infinite, one sets $\operatorname{ord}a=\infty$. If $\operatorname{ord}a=m<\infty$, then $m$ is the smallest positive integer with $a^m=e$, and $a^k=a^l$ if and only if $k\equiv l\pmod m$.

# Part: Order of an element
# Slide 1: Order of an element
Id: p-pow
Short: Order of an element
Intro: Let $a$ be an element of a group $G$ and $\operatorname{ord}a=\lvert\langle a\rangle\rvert$ its [[ord|order]]. If $\operatorname{ord}a=m<\infty$, then $m$ is the smallest positive integer with $a^m=e$, and $a^k=a^l$ if and only if $k\equiv l\pmod m$. If $\operatorname{ord}a=\infty$, all powers $a^k$, $k\in\mathbb Z$, are distinct.

## Equal powers
### 1.1
Say: We trace the argument on the group $\mathbb C^*$ and the number $a=e^{2\pi i/6}$. The dashed circle is $\lvert w\rvert=1$.
Board:
- figure F powers at 75,0 size 1450×1000

### 1.2
Say: Mark $1$ and the powers $a,a^2,\dots,a^8$.
Board:
- play F pk=1 · 3600ms

### 1.3
Say: Suppose $a^k=a^l$ for some $k>l$. Multiply both sides by $a^{-l}$ to obtain $a^{k-l}=e$.

### 1.4
Say: In the figure $a^8=a^2$, so $a^6=1$.
Board:
- set F view=kl

### 1.5
Say: Hence if $a^n\neq e$ for all $n\geqslant1$, no two powers coincide, all powers of $a$ are distinct, and $\operatorname{ord}a=\infty$.
Board:
- set F view=inf

### 1.6
Say: Suppose now that $a^n=e$ for some $n\geqslant1$, and let $m$ be the smallest such $n$. In the figure $m=6$.
Board:
- set F view=min

## Powers repeat with period $m$
### 1.7
Ask: Which of the points $1,a,\dots,a^5$ equals $a^{15}$?
Answer: click F a3 = $a^3$
Hint: Divide $15$ by $6$ with remainder.

### 1.8
Say: Divide $k$ by $m$ with remainder, $k=qm+r$, $0\leqslant r<m$. Then $a^k=\bigl(a^m\bigr)^qa^r=a^r$.
Board:
- set F view=div
- play F dv=1 · 7500ms

### 1.9
Say: Thus every power $a^k$, $k\in\mathbb Z$, equals one of the elements $e,a,\dots,a^{m-1}$.
Board:
- set F view=sub hexa=true

### 1.10
Ask: Which of the points $1,a,\dots,a^5$ equals $a^{-1}$?
Answer: click F a5 = $a^5$
Hint: $-1=(-1)\cdot6+5$.
If a1: That is $a^1$, whereas $a^{-1}$ is its inverse, $a\cdot a^{-1}=e$.

## The elements $e,a,\dots,a^{m-1}$ are distinct
### 1.11
Say: Suppose $a^r=a^s$ with $0\leqslant s<r<m$. Then $a^{r-s}=e$ and $0<r-s<m$, contradicting the choice of $m$.
Board:
- set F view=dist

### 1.12
Say: Therefore $\langle a\rangle=\{e,a,\dots,a^{m-1}\}$ has $m$ elements, so $\operatorname{ord}a=m$.
Board:
- set F view=ordm

### 1.13
Say: Finally, $a^k=a^l$ if and only if $a^{k-l}=e$.
Board:
- set F view=kl2

### 1.14
Say: Now $a^{k-l}=a^r$, where $r$ is the remainder of $k-l$ modulo $m$, and among $e,a,\dots,a^{m-1}$ only $a^0$ equals the identity. Hence $a^k=a^l\iff k\equiv l\pmod m$.
Board:
- set F view=zero

## Order of an element in $\mathbb C^*$
### 1.15
Say: Let $z\in\mathbb C^*$ and $\theta=\arg z$. By de Moivre's formula, $\lvert z^k\rvert=\lvert z\rvert^k$ and $\arg z^k=k\theta$.
Board:
- set F view=moivre ang=true nm=z

### 1.16
Say: Suppose $z^m=1$ for some $m\geqslant1$. Then $\lvert z\rvert^m=1$, so $\lvert z\rvert=1$.
Board:
- set F view=nec

### 1.17
Say: Moreover, $m\theta=2\pi s$ for some integer $s$, so $\frac\theta{2\pi}=\frac sm$ is a rational fraction of a full turn.

### 1.18
Say: Conversely, let $\lvert z\rvert=1$ and $\frac\theta{2\pi}=\frac sm$ in lowest terms, with $m\geqslant1$. Then $z^k=1$ if and only if $\frac{ks}m$ is an integer, that is, $m\mid ks$.
Board:
- set F view=suf

### 1.19
Say: Since $\gcd(s,m)=1$, this holds if and only if $m\mid k$, so $\operatorname{ord}z=m$.

### 1.20
Say: If $\lvert z\rvert\neq1$ or $\frac\theta{2\pi}$ is irrational, then $z^k\neq1$ for all $k\geqslant1$, and $\operatorname{ord}z=\infty$.
Board:
- set F view=irr

## Examples
### 1.21
Ask: What is the order of $z=e^{4\pi i/5}$?
Answer: 5
Hint: Find the smallest $k\geqslant1$ for which $k\cdot\frac25$ is an integer.
If 5/2: $\frac52$ is not a positive integer, whereas $\operatorname{ord}z$ is the smallest positive integer $k$ with $z^k=1$.
If 2/5: That is the fraction of a full turn given by $\arg z$, whereas $\operatorname{ord}z$ is the smallest positive integer $k$ with $z^k=1$.
Board:
- set F view=ex ex=true z=3 lock=true

### 1.22
Say: <<Take|You can choose another example above the figure.>> $z={{zt}}$ and mark its powers $z,z^2,\dots$
Board:
- set F lock=false
- play F ue=1 · 3600ms

### 1.23
Say if kind=fin: The argument of ${{zt}}$ is ${{fr}}$ of a full turn, so $\operatorname{ord}z={{m}}$ and $z^{{{m}}}=1$.
Say if kind=big: Since $\lvert1+i\rvert=\sqrt2\neq1$, we have $\lvert z^k\rvert=2^{k/2}>1$ for $k\geqslant1$. The points move away from the unit circle, and $\operatorname{ord}(1+i)=\infty$.
Say: Here $\lvert z\rvert=1$, but <<$\frac\theta\pi$ is irrational|Otherwise $z^k=1$ for some $k\geqslant1$, so $(3+4i)^k=5^k$. Expanding real and imaginary parts modulo $5$ gives $(3+4i)^2=-7+24i\equiv3+4i\pmod5$, and by induction $(3+4i)^k\equiv3+4i\pmod5$, whereas $5^k\equiv0$.>>. Hence $\operatorname{ord}z=\infty$, and the powers $z^k$ fill the circle ever more densely.
Board:
- set F view=exr

## Summary
### 1.24
Say: In summary, if $\operatorname{ord}a=m<\infty$, then $m$ is the smallest positive integer with $a^m=e$, and $a^k=a^l\iff k\equiv l\pmod m$. If $\operatorname{ord}a=\infty$, all powers of $a$ are distinct.
Board:
- set F view=fin

### 1.25
Say: A number $z\in\mathbb C^*$ has finite order if and only if $\lvert z\rvert=1$ and $\frac{\arg z}{2\pi}$ is rational, in which case its order is the denominator of the reduced fraction.

## Exercises
### 1.26
Ask: What is the order of $e^{2\pi i\cdot 3/12}$?
Answer: 4
Hint: Reduce the fraction $\frac3{12}$.
If 12: The fraction $\frac3{12}$ is not reduced, and the order is the denominator in lowest terms.

### 1.27
Ask: What is the order of $-\frac12+\frac{\sqrt3}2i$?
Answer: 3
Hint: Find the modulus and argument of this number.
If 6: The argument of this number is $\frac{2\pi}3$, not $\frac\pi3$.

### 1.28
Ask: Let $\operatorname{ord}a=6$. List, separated by commas, all $k$ from $0$ to $20$ for which $a^k=a^2$.
Answer: 2, 8, 14, 20
Hint: Find the remainders of these $k$ modulo $6$.

# Slide 2: Order of an element in $\mathrm{GL}_2(\mathbb R)$
Id: p-mat
Short: Order in $\mathrm{GL}_2(\mathbb R)$
Intro: Let $M\in\mathrm{GL}_2(\mathbb R)$ and let $I$ be the identity matrix. Whenever $M^2$ is a linear combination of $M$ and $I$, every power $M^k$ is also a linear combination of $M$ and $I$, and these expressions determine the [[ord|order]] of $M$ in $\mathrm{GL}_2(\mathbb R)$.

## The house and its images
### 2.1
Say: Mark a house $F$ in the plane. The matrix $M$ sends each point $x$ to $Mx$, and sends the house $F$ to $MF$.
Board:
- erase all
- figure H house at 75,0 size 1450×1000

### 2.2
Say: If $M^m=I$, the image $M^mF$ coincides with $F$.

## $\operatorname{ord}M=3$
### 2.3
Say: Let $M=\begin{pmatrix}0&1\\-1&-1\end{pmatrix}$. Multiplying gives $M^2=\begin{pmatrix}-1&-1\\1&0\end{pmatrix}$.
Board:
- set H mi=2 top=sq

### 2.4
Ask: Express $M^2$ in terms of $M$ and $I$.
Answer: -M-I | -I-M | -(M+I) | -(I+M) | M^2=-M-I
Hint: Add the matrices $M^2$ and $M$.
If M+I: The sign is off, since $M^2+M=\begin{pmatrix}-1&0\\0&-1\end{pmatrix}=-I$.

### 2.5
Say: Thus $M^2+M+I=0$. Therefore $M^3-I=(M-I)\bigl(M^2+M+I\bigr)=0$, so $M^3=I$.
Board:
- set H top=rel

### 2.6
Say: Since $M$ and $M^2$ differ from $I$, we have $\operatorname{ord}M=3$.

### 2.7
Say: Apply $M$ to the house three times. The third image coincides with $F$.
Board:
- set H top=auto
- play H pk=1 · 2400ms

## $\operatorname{ord}M=\infty$
### 2.8
Say: Let $M=\begin{pmatrix}1&1\\0&1\end{pmatrix}$ and $N=M-I=\begin{pmatrix}0&1\\0&0\end{pmatrix}$. Then $N^2=0$.
Board:
- set H mi=4 pk=0 top=n

### 2.9
Say: Since $N^2=0$, we have $(I+kN)(I+N)=I+(k+1)N$. By induction, $M^k=I+kN=\begin{pmatrix}1&k\\0&1\end{pmatrix}$.
Board:
- set H top=pow

### 2.10
Say: For $k\geqslant1$ the matrix $M^k$ differs from $I$, so $\operatorname{ord}M=\infty$.

### 2.11
Say: Apply $M$ to the house three times. Each point $(x,y)$ moves to $(x+ky,y)$, and the house shears further and further away.
Board:
- set H top=auto
- play H pk=1 · 2400ms

## Examples
### 2.12
Ask: What is the order of $M=\begin{pmatrix}1&-2\\1&-1\end{pmatrix}$ in $\mathrm{GL}_2(\mathbb R)$?
Answer: 4
Hint: Compute $M^2$ and express it in terms of $I$.
If 2: Here $M^2=-I$, not $I$.
Board:
- set H ex=true mz=1 pk=0 lock=true

### 2.13
Say: <<Take|You can choose another example above the figure.>> $M={{Mt}}$ and apply it to the house {{times}}.
Board:
- set H lock=false
- play H pk=1 · 3200ms

### 2.14
Say if kind=o4: Multiplying gives $M^2=-I$. Then $M^3=-M$ and $M^4=I$, while $M$, $-I$, $-M$ differ from $I$, so $\operatorname{ord}M=4$.
Say if kind=o3: Multiplying gives $M^2=-M-I$. As above, this implies $M^3=I$ and $\operatorname{ord}M=3$.
Say if kind=o6: Multiplying gives $M^2=M-I$, whence $M^3=M^2-M=-I$ and $M^6=I$. The powers $M,\dots,M^5$ differ from $I$, so $\operatorname{ord}M=6$.
Say: Multiplying gives $M^2=2M-I$, that is, $(M-I)^2=0$ with $M\neq I$. As above, $\operatorname{ord}M=\infty$.

## Summary
### 2.15
Say: To find $\operatorname{ord}M$ for $M\in\mathrm{GL}_2(\mathbb R)$, it is enough to express $M^2$ in terms of $M$ and $I$.

### 2.16
Say: If $M^2$ equals $-I$, $-M-I$, or $M-I$, then $\operatorname{ord}M$ is $4$, $3$, or $6$, respectively. If $M=I+N$ with $N\neq0$ and $N^2=0$, then $\operatorname{ord}M=\infty$.

## Exercises
### 2.17
Ask: What is the order of $\begin{pmatrix}0&-1\\1&1\end{pmatrix}$ in $\mathrm{GL}_2(\mathbb R)$?
Answer: 6
Hint: Express $M^2$ in terms of $M$ and $I$.
If 3: Here $M^2=M-I$, not $-M-I$.

### 2.18
Ask: What is the order of $\begin{pmatrix}3&-4\\1&-1\end{pmatrix}$ in $\mathrm{GL}_2(\mathbb R)$? If it is infinite, type $\infty$ or inf.
Answer: ∞ | inf | infinity
Hint: Compute $(M-I)^2$.

### 2.19
Ask: Suppose $M^2=-I$. What is $M^{10}$?
Answer: -I
Hint: $M^{10}=\bigl(M^2\bigr)^5$.
If I: $\bigl(M^2\bigr)^5=(-I)^5=-I$, since $5$ is odd.
