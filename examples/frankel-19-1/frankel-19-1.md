---
title: The groups SO(3) and SU(2)
subtitle: Frankel, The Geometry of Physics, 3rd ed., §19.1, close to the book
lang: en
voice: on
figures: frankel-19-1.fig.js
---

# Glossary

- **liealg | Lie algebra** — The Lie algebra $\mathfrak g$ of a matrix group $G$ consists of the matrices $X$ with $\exp(tX)\in G$ for all real $t$; it is the tangent space to $G$ at the identity, closed under the commutator $[X,Y]=XY-YX$.
- **opsg | one-parameter subgroup** — A one-parameter subgroup of a matrix group $G$ is a homomorphism $t\mapsto g(t)$ from $(\mathbb R,+)$ to $G$; every one has the form $g(t)=\exp(tX)$ with $X$ in the Lie algebra of $G$.
- **su2 | SU(2)** — $SU(2)$ is the group of complex $2\times2$ matrices $u$ with $u^\dagger u=I$ and $\det u=1$; here $u^\dagger=\bar u^{T}$.
- **herm | hermitian** — A complex matrix $h$ is hermitian if $h^\dagger=h$ and skew-hermitian if $h^\dagger=-h$.
- **pauli | Pauli matrices** — $\sigma_1=\begin{pmatrix}0&1\\1&0\end{pmatrix}$, $\sigma_2=\begin{pmatrix}0&-i\\i&0\end{pmatrix}$, $\sigma_3=\begin{pmatrix}1&0\\0&-1\end{pmatrix}$. They are hermitian with trace zero, and $\sigma_j\sigma_k=\delta_{jk}I+i\epsilon_{jkl}\sigma_l$.
- **eps | Levi-Civita symbol** — $\epsilon_{ijk}$ equals $1$ if $(i,j,k)$ is an even permutation of $(1,2,3)$, $-1$ if it is odd, and $0$ if two indices coincide.
- **ad | adjoint representation** — A matrix group $G$ acts on its Lie algebra by $\mathrm{Ad}(g)X=gXg^{-1}$; each $\mathrm{Ad}(g)$ is linear and $\mathrm{Ad}(gh)=\mathrm{Ad}(g)\mathrm{Ad}(h)$.
- **simply | simply connected** — A connected space is simply connected if every closed curve in it can be deformed, through closed curves, into a point.

# Section: 19.1. The groups SO(3) and SU(2)

# Part: 19.1. The groups SO(3) and SU(2)

# Slide 1: Why SU(2) enters

### 1.0
Say: Frankel opens the chapter with the line "Spin is what makes the world go 'round", and this slide follows his physical reason for bringing in [[su2|SU(2)]].
Voice: Frankel opens the chapter with the line: | spin is what makes the world go round. || This slide follows his physical reason | for bringing in S U two.

### 1.1
Say: Frankel refers to Feynman's spin experiment, where a measurement along a chosen axis has two possible outcomes and the spin state requires two complex amplitudes.
Voice: Frankel refers to Feynman's spin experiment, | where a measurement along a chosen axis | has two possible outcomes. || The spin state requires | two complex amplitudes.
Board:
- erase all
- write psi in line 1 · 85%
  $\Psi(\mathbf r)=\binom{\psi_+(\mathbf r)}{\psi_-(\mathbf r)},\qquad\mathbf r\in\mathbb R^3,\quad +,-:\ \text{spin outcomes along the chosen axis}$

### 1.2
Say: Each component is the probability amplitude for position $\mathbf r$ and one spin outcome, so this column describes one particle with two spin components.
Voice: Each component is the probability amplitude | for position vector r | and one spin outcome, || so this column describes one particle | with two spin components.

### 1.3
Say: More generally, $N$ internal states require a column $\Psi=(\psi_1,\ldots,\psi_N)^T$, whose components mix when the reference axes are rotated.
Voice: More generally, {N} internal states | require a column of {N} wave functions, || whose components mix | when the reference axes are rotated.
Board:
- write general in line 2
  $\Psi=(\psi_1,\ldots,\psi_N)^T,\qquad N:\ \text{number of internal states}$

### Why? after 1.3
**Why does changing the axis mix the components?** Because a state with a definite spin outcome along one axis need not have a definite outcome along another. The same state is expressed in two different bases; the coefficients change by a matrix. Feynman explains the two-outcome example in *The Feynman Lectures on Physics*, III, §§6–1–6–2 (https://www.feynmanlectures.caltech.edu/III_06.html), the example Frankel points to on p. 491. The column above makes explicit the meaning of the wave functions in that example.

### 1.4
Say: The physics cannot depend on the choice of Cartesian coordinates, so a rotation $g\in SO(3)$ must act on the $N$-tuples by a unitary matrix $\rho(g)$.
Voice: The physics cannot depend | on the choice of Cartesian coordinates, || so a rotation {g} | must act on the {N}-tuples | by a unitary matrix, | rho of {g}.
Board:
- write rho in line 3
  $\rho\colon SO(3)\to U(N),\qquad\Psi\mapsto\rho(g)\Psi\ \ \text{for a rotation}\ g$

### 1.5
Say: Frankel remarks that this is not quite accurate, since $e^{i\gamma}\Psi$ with a constant $\gamma$ is the same wave function, so $\rho$ is only a "ray" representation.
Voice: Frankel remarks | that this is not quite accurate, || since e to the i gamma, Psi, | with a constant gamma, | is the same wave function. || So rho is only a ray representation.
Board:
- write ray in line 4
  $\Psi\sim e^{i\gamma}\Psi\ \Rightarrow\ \rho(g)\rho(h)=e^{i\gamma(g,h)}\rho(gh)\quad\text{(ray representation)}$

### 1.6
Say: Weyl shows that $\rho$ can be made into a genuine representation, except that it is perhaps double-valued.
Voice: Weyl shows that rho can be made | into a genuine representation, || except that it is perhaps | double-valued.
Board:
- write dv in line 5
  $\rho\ \text{genuine, up to sign:}\ \ g\mapsto\pm\rho(g)$

### 1.7
Say: Weyl also shows that a multiple-valued representation of a [[simply|simply connected]] group is single-valued.
Voice: Weyl also shows | that a multiple-valued representation | of a simply connected group | is single-valued.
Board:
- write sc in line 6
  $G\ \text{simply connected}\ \Rightarrow\ \text{its representations are single-valued}$

### Why? after 1.7
**Why should simple connectedness remove the sign?** Because the sign of $\rho(g)$ is fixed by continuity along a path from $I$ to $g$, and two paths give the same sign when one can be deformed into the other. In a simply connected group any two such paths can be deformed into each other. Frankel only cites Weyl for this; it is the argument of complex function theory that he recalls in section 19.2.

### 1.8
Say: We shall see that $SO(3)$ is not simply connected, whereas $SU(2)$ is; this is why the covering group matters here.
Voice: We shall see that S O three | is not simply connected, | whereas S U two is. || This is why the covering group matters here.
Board:
- write ns in line 7
  $SO(3)\ \text{not simply connected},\qquad SU(2)\ \text{simply connected}$

### 1.9 ¶
Say: So section 19.1 builds a natural homomorphism $\mathrm{Ad}\colon SU(2)\to SO(3)$, onto and two-to-one, and the wave vectors $\Psi$ then transform by a true representation of the covering group $SU(2)$.
Voice: So section nineteen one builds a natural homomorphism, | Ad, | from S U two to S O three, || onto and two-to-one. || The wave vectors Psi | then transform by a true representation | of the covering group, | S U two.
Board:
- write goal in line 8 · blue
  $\mathrm{Ad}\colon SU(2)\to SO(3)\ \ \text{onto},\ 2:1\ \Rightarrow\ \Psi\mapsto\tilde\rho(u)\Psi,\ \ \tilde\rho\colon SU(2)\to U(N)$

# Part: 19.1a. The rotation group SO(3)

# Slide 2: Rotations as exponentials

### 2.0
Say: To compare the two rotation groups, we first need the matrices that describe a rotation's initial velocity.
Voice: To compare the two rotation groups, | we first need the matrices | that describe a rotation's initial velocity.

### 2.1
Say: Rotation through an angle $\theta$ about the $z$ axis is given by this matrix $R(\theta)$.
Voice: Rotation through an angle theta | about the zee axis | is given by this matrix, {R} of theta.
Board:
- erase all
- write R at 80,145 · 85%
  $R(\theta)=\begin{pmatrix}\cos\theta&-\sin\theta&0\\ \sin\theta&\cos\theta&0\\0&0&1\end{pmatrix}$

### 2.2
Say: Number the coordinate axes $x,y,z$ as $1,2,3$, respectively, and define the generator of this rotation about $z$ by $E_3=R'(0)$.
Voice: Number the coordinate axes x, y, zee | as one, two, three, respectively, || and define the generator of this rotation about zee | by {E_3} equals {R} prime of zero.
Board:
- write dR at 80,300 · 85%
  $1\leftrightarrow x,\quad 2\leftrightarrow y,\quad 3\leftrightarrow z;\qquad E_3:=R'(0),\quad R(0)=I$

### 2.3
Say: Differentiating rotations about $x,y,z$ at angle zero gives $E_1,E_2,E_3$, respectively.
Voice: Differentiating rotations about x, y, zee | at angle zero | gives {E_1}, {E_2}, {E_3}, respectively.
Board:
- write E at 80,450 · 85% · equation 19.1
  $E_1=\begin{pmatrix}0&0&0\\0&0&-1\\0&1&0\end{pmatrix},\quad E_2=\begin{pmatrix}0&0&1\\0&0&0\\-1&0&0\end{pmatrix},\quad E_3=\begin{pmatrix}0&-1&0\\1&0&0\\0&0&0\end{pmatrix}\quad(19.1)$

### 2.4
Say: Every real skew-symmetric $3\times3$ matrix has three independent entries, so it has a unique expression $aE_1+bE_2+cE_3$ and these generators form a basis of the [[liealg|Lie algebra]] $\mathfrak{so}(3)$.
Voice: Every real skew-symmetric three by three matrix | has three independent entries. || It has a unique expression | ay {E_1}, plus bee {E_2}, plus see {E_3}, || so these generators form a basis | of the Lee algebra ess oh three.
Board:
- write basis at 80,620 · 85%
  $\mathfrak{so}(3)=\{S\in M_3(\mathbb R):S^T=-S\}=\operatorname{span}_{\mathbb R}\{E_1,E_2,E_3\}$

### Why? after 2.4
**Why are the generators skew-symmetric?** Because differentiating $R(t)^TR(t)=I$ at $R(0)=I$ gives $R'(0)^T+R'(0)=0$. Conversely, for a skew-symmetric matrix $S$, the curve $e^{tS}$ is orthogonal and starts at $I$, so its determinant stays $+1$. This identifies the possible initial velocities with $\mathfrak{so}(3)$.

### 2.5
Say: Since $R'(\theta)=E_3R(\theta)$ and $R(0)=I$, the original rotation is recovered as $R(\theta)=e^{\theta E_3}$.
Voice: Since {R} prime of theta | equals {E_3} times {R} of theta, | and {R} of zero is the identity, || the original rotation is recovered | as the exponential of theta {E_3}.
Board:
- write exp at 80,740
  $R'(\theta)=E_3R(\theta),\quad R(0)=I\quad\Rightarrow\quad R(\theta)=e^{\theta E_3}$

### 2.6 ¶
Say: Multiplying the three basis matrices gives the commutation relations, with $\epsilon_{ijk}$ the [[eps|Levi-Civita symbol]].
Voice: Multiplying the three basis matrices | gives the commutation relations, || with epsilon i j k | the Levi-Civita symbol.
Board:
- write comm at 80,865 · blue · equation 19.2
  $[E_i,E_j]=\textstyle\sum_k\epsilon_{ijk}E_k\qquad(19.2)$

# Slide 3: Angular velocity

### 3.0
Say: The same generator has a geometric meaning: it sends each point to its initial velocity during the rotation.
Voice: The same generator has a geometric meaning: | it sends each point | to its initial velocity during the rotation.

### 3.1
Say: Fix a unit axis $\mathbf n$ and a constant positive angular speed $\omega$, and define the angular velocity vector by $\boldsymbol\omega=\omega\mathbf n$.
Voice: Fix a unit axis, vector n, | and a constant positive angular speed, omega, || and define the angular velocity vector | by vector omega equals omega times vector n.
Board:
- erase all
- write def at 70,100 · 85%
  $|\mathbf n|=1,\quad\theta(t)=\omega t$
- write omega at 70,205 · 85%
  $\boldsymbol\omega:=\omega\mathbf n,\quad\omega>0$
- figure A angularCone at 820,75 size 700×665

### 3.2
Say: For rotation $R(t)=R_{\mathbf n}(\omega t)=e^{tS}$ with $S=R'(0)$, differentiating $\mathbf r(t)=R(t)\mathbf r(0)$ gives $\dot{\mathbf r}(t)=S\mathbf r(t)$.
Voice: For rotation {R} of {t}, | rotation about vector n through omega {t}, | equal to e to the {t} {S} | with {S} equal to {R} prime of zero, || differentiating vector r of {t} equal to {R} of {t} times vector r of zero | gives vector r dot of {t} equal to {S} times vector r of {t}.
Board:
- write Rtime at 70,285 · 75%
  $R(t)=R_{\mathbf n}(\omega t)=e^{tS}$
- write rt at 70,365 · 75%
  $\mathbf r(t)=R(t)\mathbf r(0),\quad S:=R'(0)$
- write derivative at 70,445 · 75%
  $\dot{\mathbf r}(t)=R'(t)\mathbf r(0)=S\mathbf r(t)$

### 3.3
Say: The tip of $\mathbf r(t)$ traces the circular rim of the cone, and $\dot{\mathbf r}(t)$ is tangent to that rim.
Voice: The tip of vector r of {t} | traces the circular rim of the cone, || and vector r dot of {t} is tangent to that rim.
Board:
- set A tangent=true

### 3.4
Say: The generators [[eq:19.1]] give $S\mathbf r=\boldsymbol\omega\times\mathbf r$, so this matrix derivative is the usual cross-product formula for velocity.
Voice: The generators in nineteen one | give {S} vector r | equal to omega cross vector r, || so this matrix derivative | is the usual cross-product formula for velocity.
Board:
- write S at 70,550 · 85%
  $\dot{\mathbf r}=S\mathbf r=\boldsymbol\omega\times\mathbf r$

### Why? after 3.4
**Why does the derivative give a cross product?** Because differentiating the matrix for rotation about $z$ gives $$S=\left.\frac{d}{dt}R_z(\omega t)\right|_{t=0}=\omega E_3,$$ $$\begin{aligned}S(x,y,z)^T&=(-\omega y,\omega x,0)^T\\&=(0,0,\omega)^T\times(x,y,z)^T.\end{aligned}$$ For an arbitrary unit axis $\mathbf n$, choose $Q\in SO(3)$ with $Q\mathbf e_3=\mathbf n$ and differentiate $R(t)=Q R_z(\omega t)Q^T$ to obtain $S=\omega QE_3Q^T$. Rotations preserve cross products, hence $$S\mathbf r=\omega Q(\mathbf e_3\times Q^T\mathbf r)=\omega\mathbf n\times\mathbf r.$$ The matrices $E_j$ are recorded in [[eq:19.1]].

### 3.5
Say: In particular, $E_j\mathbf r=\mathbf e_j\times\mathbf r$, where $\mathbf e_j$ is the unit vector along the $j$-th coordinate axis.
Voice: In particular, | the matrix {E_j} applied to vector r | equals the coordinate unit vector {e_j} cross vector r, || where {e_j} is the unit vector | along the jay-th coordinate axis.
Board:
- write Ej at 70,675 · 85%
  $E_j\mathbf r=\mathbf e_j\times\mathbf r$

### 3.6
Say: Writing $\mathbf E=(E_1,E_2,E_3)$, we obtain $S=\mathbf E\cdot\boldsymbol\omega$ and recover Frankel's formula for the rotation.
Voice: Writing vector E equal to {E_1}, {E_2}, {E_3}, || we obtain {S} equal to vector E dot vector omega | and recover Frankel's formula for the rotation.
Board:
- write rot at 70,810 · 85% · equation 19.3
  $\mathbf E=(E_1,E_2,E_3),\quad S=\mathbf E\cdot\boldsymbol\omega,\quad R(t)=\exp(t\,\mathbf E\cdot\boldsymbol\omega)\quad(19.3)$

### 3.7 ¶
Say: Thus rotation through angle $\theta$ about $\mathbf n$ is $\exp(\theta\,\mathbf E\cdot\mathbf n)$.
Voice: Thus rotation through angle theta | about vector n | is the exponential of theta, vector E dot vector n.
Board:
- write Rtheta at 70,925 · blue · equation 19.4
  $R_{\mathbf n}(\theta)=\exp(\theta\,\mathbf E\cdot\mathbf n)\qquad(19.4)$

# Part: 19.1b. SU(2) and its Lie algebra

# Slide 4: Pauli matrices

### 4.0
Say: The same description of $SU(2)$ shows that the two groups have isomorphic Lie algebras.
Voice: The same description of S U two | shows that the two groups | have isomorphic Lee algebras.

### 4.1
Say: The Lie algebra $\mathfrak g=\mathfrak{su}(2)$ consists of the [[herm|skew-hermitian]] $2\times2$ matrices with trace zero.
Voice: The Lee algebra {\mathfrak g}, | ess you two, | consists of the skew-hermitian two by two matrices | with trace zero.
Board:
- erase all
- write su in line 1
  $\mathfrak g=\mathfrak{su}(2)=\{X:\ X^\dagger=-X,\ \operatorname{tr}X=0\},\qquad X^\dagger=\bar X^T$

### 4.2
Say: Then $i\mathfrak g$ is the space of hermitian matrices with trace zero, which Frankel stresses is a real vector space, closed under multiplication by real numbers only.
Voice: Then {i} {\mathfrak g} | is the space of hermitian matrices with trace zero, || which Frankel stresses is a real vector space, | closed under multiplication by real numbers only.
Board:
- write isu in line 2
  $i\,\mathfrak g=i\,\mathfrak{su}(2)=\{h:\ h^\dagger=h,\ \operatorname{tr}h=0\},\quad\text{a real vector space}$

### 4.3
Say: A basis of $i\mathfrak g$ is given by the [[pauli|Pauli matrices]].
Voice: A basis of {i} {\mathfrak g} | is given by the Pauli matrices.
Board:
- write sig in line 3 · 85% · equation 19.5
  $\sigma_1=\begin{pmatrix}0&1\\1&0\end{pmatrix},\quad\sigma_2=\begin{pmatrix}0&-i\\i&0\end{pmatrix},\quad\sigma_3=\begin{pmatrix}1&0\\0&-1\end{pmatrix}\qquad(19.5)$

### 4.4
Say: For example, $\exp(\theta\sigma_3/i)=\operatorname{diag}(e^{-i\theta},e^{i\theta})$ describes a complete [[opsg|one-parameter subgroup]] of $SU(2)$ for $0\le\theta\le2\pi$.
Voice: For example, | the exponential of theta {\sigma_3} over {i} | is the diagonal matrix | with entries e to the minus i theta | and e to the i theta. || It describes a complete one-parameter subgroup of S U two | for theta from zero to two pi.
Board:
- write ex3 in line 5
  $\exp(\theta\sigma_3/i)=\operatorname{diag}(e^{-i\theta},e^{i\theta}),\quad 0\le\theta\le2\pi$

### 4.5
Say: The Pauli matrices satisfy the commutation relations $[\sigma_j,\sigma_k]=2i\epsilon_{jkl}\sigma_l$.
Voice: The Pauli matrices satisfy the commutation relations: | the commutator of {\sigma_j} and {\sigma_k} | equals two {i} epsilon {j} {k} {l}, {\sigma_l}.
Board:
- write scomm in line 6 · equation 19.6
  $[\sigma_j,\sigma_k]=2i\epsilon_{jkl}\sigma_l\qquad(19.6)$

### 4.6 ¶
Say: Frankel notes that these are the same relations as [[eq:19.2]] for $SO(3)$ if one uses $\sigma_j/2i$ as a new basis of $\mathfrak g$, so $\sigma_j/2i\mapsto E_j$ is an isomorphism $\mathfrak{su}(2)\cong\mathfrak{so}(3)$.
Voice: Frankel notes that these are the same relations as for S O three | if one uses {\sigma_j} over two {i} | as a new basis. || So sending {\sigma_j} over two {i} to {E_j} | is an isomorphism | of ess you two | with ess oh three.
Board:
- write iso in line 7 · blue
  $\bigl[\tfrac{\sigma_j}{2i},\tfrac{\sigma_k}{2i}\bigr]=\epsilon_{jkl}\tfrac{\sigma_l}{2i}\ \Rightarrow\ \mathfrak{su}(2)\cong\mathfrak{so}(3),\quad\tfrac{\sigma_j}{2i}\mapsto E_j$

### 4.7
Say: These matching commutators suggest a relation between the groups; we now construct the map $\mathrm{Ad}\colon SU(2)\to SO(3)$ explicitly.
Voice: These matching commutators suggest a relation | between the groups. || We now construct the map Ad | from S U two to S O three explicitly.

### Caution after 4.7
**Matching Lie algebras do not make the groups isomorphic** The map we construct will identify $u$ with $-u$. Frankel also announces here that $SU(2)$ is simply connected; that topological fact comes later, and is not needed to define the conjugation map.

# Slide 5: Space as traceless hermitian matrices

### 5.0
Say: Frankel heads section 19.1 with the question how $SU(2)$ acts on its Lie algebra, and this slide sets up that action, which gives the classical homomorphism.
Voice: Frankel heads section nineteen one with the question: | how does S U two act on its Lee algebra? || This slide sets up that action, | which gives the classical homomorphism.

### 5.1
Say: Frankel identifies a vector $\mathbf x=(x,y,z)^T\in\mathbb R^3$ with the matrix $\mathbf x_*=\mathbf x\cdot\boldsymbol\sigma=x^R\sigma_R$ in $i\mathfrak g$.
Voice: Frankel identifies a vector x | with coordinates {x}, {y}, {z} | with the matrix x star, | vector x dot sigma, | in {i} {\mathfrak g}.
Board:
- erase all
- write xs in line 1 · 80% · equation 19.7
  $\mathbf x=(x,y,z)^T\in\mathbb R^3\ \mapsto\ \mathbf x_*=\mathbf x\cdot\boldsymbol\sigma=x^R\sigma_R=\begin{pmatrix}z&x-iy\\x+iy&-z\end{pmatrix}\in i\,\mathfrak g\qquad(19.7)$

### 5.2
Say: This linear map is onto the traceless hermitian matrices, with inverse $x=\frac12\operatorname{tr}(\mathbf x_*\sigma_1)$, $y=\frac12\operatorname{tr}(\mathbf x_*\sigma_2)$, $z=\frac12\operatorname{tr}(\mathbf x_*\sigma_3)$.
Voice: This linear map is onto | the traceless hermitian matrices, || with inverse | {x} equals one half the trace of x star {\sigma_1}, | and similarly for {y} and {z}.
Board:
- write inv in line 3 · equation 19.8
  $x=\tfrac12\operatorname{tr}(\mathbf x_*\sigma_1),\quad y=\tfrac12\operatorname{tr}(\mathbf x_*\sigma_2),\quad z=\tfrac12\operatorname{tr}(\mathbf x_*\sigma_3)\qquad(19.8)$

### 5.3
Say: Under this map $\mathbf e_j\mapsto\sigma_j$, and Frankel uses it to identify the points $\mathbf x_*$ of $i\mathfrak g$ with the points $\mathbf x$ of $\mathbb R^3$.
Voice: Under this map | the basis vector e jay goes to {\sigma_j}, || and Frankel uses it to identify | the points x star of {i} {\mathfrak g} | with the points vector x of R three.
Board:
- write ej in line 4
  $\mathbf e_j\mapsto\sigma_j,\qquad\mathbf x_*\sim\mathbf x$

### 5.4
Say: On $i\mathfrak g$ he defines the real scalar product $\langle h,h'\rangle=\operatorname{tr}(hh')$.
Voice: On {i} {\mathfrak g} | he defines the real scalar product | of {h} and {h}-prime | as the trace of {h} {h}-prime.
Board:
- write sp in line 5 · equation 19.9
  $\langle h,h'\rangle:=\operatorname{tr}(hh'),\qquad h,h'\in i\,\mathfrak g\qquad(19.9)$

### 5.5
Say: Since $\operatorname{tr}(\sigma_j\sigma_k)=2\delta_{jk}$, the Pauli matrices form an orthogonal basis of lengths $\sqrt2$.
Voice: Since the trace of {\sigma_j} {\sigma_k} | is two delta {j} {k}, || the Pauli matrices form an orthogonal basis | of lengths root two.
Board:
- write tr in line 6
  $\operatorname{tr}(\sigma_j\sigma_k)=2\delta_{jk}\ \Rightarrow\ |\sigma_j|=\sqrt2,\quad\langle\mathbf x_*,\mathbf x_*\rangle=2|\mathbf x|^2$

### 5.6 ¶
Say: Every Lie group acts on its Lie algebra by $\mathrm{Ad}(g)X=gXg^{-1}$, and Frankel lets $SU(2)$ act instead on $i\mathfrak g$, still calling the action $\mathrm{Ad}$, the [[ad|adjoint representation]].
Voice: Every Lee group acts on its Lee algebra | by Ad of {g}, | {X} goes to {g} {X} {g} inverse, || and Frankel lets S U two act instead | on {i} {\mathfrak g}, || still calling the action Ad, | the adjoint representation.
Board:
- write Ad in line 7 · blue · equation 19.10
  $\mathrm{Ad}(u)\mathbf x_*=u\,\mathbf x_*u^{-1},\qquad u\in SU(2),\ \ \mathbf x_*\in i\,\mathfrak g\qquad(19.10)$

### Why? after 5.6
**Why does $u\mathbf x_*u^{-1}$ stay hermitian with trace zero?** Because $u^{-1}=u^\dagger$. Then $(u\mathbf x_*u^\dagger)^\dagger=u\mathbf x_*^\dagger u^\dagger=u\mathbf x_*u^\dagger$, and $\operatorname{tr}(u\mathbf x_*u^{-1})=\operatorname{tr}\mathbf x_*=0$.

### 5.7
Say: Through the identification $\mathbf x_*\sim\mathbf x$, each $\mathrm{Ad}(u)$ is a $3\times3$ matrix, and $\mathrm{Ad}$ is a representation, $\mathrm{Ad}(uu')=\mathrm{Ad}(u)\circ\mathrm{Ad}(u')$.
Voice: Through the identification of x star with vector x, | each Ad of {u} is a three by three matrix, || and Ad is a representation: | Ad of {u} {u}-prime | is Ad of {u} | after Ad of {u}-prime.
Board:
- write hom in line 8
  $\mathrm{Ad}(uu')\mathbf x_*=uu'\mathbf x_*(uu')^{-1}=\mathrm{Ad}(u)\circ\mathrm{Ad}(u')\,\mathbf x_*$

### 5.8
Say: The trace does not change under conjugation, so $\mathrm{Ad}$ is a representation of $SU(2)$ by orthogonal $3\times3$ matrices.
Voice: The trace does not change under conjugation, || so Ad is a representation of S U two | by orthogonal three by three matrices.
Board:
- write orth in line 9
  $\langle\mathrm{Ad}(u)\mathbf x_*,\mathrm{Ad}(u)\mathbf x_*\rangle=\operatorname{tr}(u\mathbf x_*\mathbf x_*u^{-1})=\langle\mathbf x_*,\mathbf x_*\rangle\ \Rightarrow\ \mathrm{Ad}(u)\in O(3)$

# Part: 19.1c. SU(2) is topologically the 3-sphere

# Slide 6: SU(2) is the 3-sphere

### 6.0
Say: To show that the orthogonal map $\mathrm{Ad}(u)$ has determinant $+1$, we need to know that $SU(2)$ is connected.
Voice: To show that the orthogonal map Ad of {u} | has determinant plus one, || we need to know that S U two is connected.

### 6.1
Say: The fundamental representation of $SU(2)$ is by the complex unitary $2\times2$ matrices $u$ with $\det u=1$.
Voice: The fundamental representation of S U two | is by the complex unitary two by two matrices {u} | with determinant one.
Board:
- erase all
- write su in line 1
  $SU(2)=\{u\in M_2(\mathbb C):\ u^\dagger u=I,\ \det u=1\}$

### 6.2
Say: Let $S^3$ be the set of unit vectors in $\mathbb C^2\cong\mathbb R^4$, which each unitary $u$ maps into itself.
Voice: Let S three be the set of unit vectors | in C two, | which is R four. || Each unitary {u} | maps it into itself.
Board:
- write S3 in line 2
  $S^3=\{(z_1,z_2)^T\in\mathbb C^2:\ |z_1|^2+|z_2|^2=1\},\qquad u\colon S^3\to S^3$

### 6.3
Say: The action is transitive, since the matrix [[eq:19.11]] sends $(1,0)^T$ to any point $(z_1,z_2)^T$ of $S^3$.
Voice: The action is transitive, || since the matrix nineteen eleven | sends one, zero | to any point {z_1}, {z_2} of S three.
Board:
- write u in line 3 · 85% · equation 19.11
  $u=\begin{pmatrix}z_1&-\bar z_2\\ z_2&\bar z_1\end{pmatrix}\in SU(2),\qquad u\,(1,0)^T=(z_1,z_2)^T\qquad(19.11)$

### Why? after 6.3
**Why is the second column determined by the first?** Because it is a unit vector orthogonal to the first column, and $\det u=1$ fixes its phase. The unit vectors in $\mathbb C^2$ hermitian-orthogonal to $(z_1,z_2)^T$ are $\lambda(-\bar z_2,\bar z_1)^T$ with $|\lambda|=1$, and the determinant of the resulting matrix is $\lambda(|z_1|^2+|z_2|^2)=\lambda$. This is Frankel's parenthetical remark after [[eq:19.11]].

### 6.4
Say: Matrices sending $(1,0)^T$ to the same point differ by an element of its stabilizer $H$, so $S^3\approx SU(2)/H$.
Voice: Matrices sending one, zero | to the same point | differ by an element of its stabilizer {H}. || So S three is S U two modulo {H}.
Board:
- write GH in line 5
  $S^3\approx SU(2)/H,\qquad H=\{u:\ u\,(1,0)^T=(1,0)^T\}$

### Why? after 6.4
**Why does the stabilizer describe the fibers?** Because $u\mapsto u(1,0)^T$ maps $SU(2)$ onto $S^3$, and two matrices have the same image exactly when they differ by an element of $H$ on the right: $u(1,0)^T=v(1,0)^T$ if and only if $v^{-1}u\in H$. This is the fact used in (17.10) of the book.

### 6.5
Say: By [[eq:19.11]], $H$ is simply the identity matrix, so $SU(2)\approx S^3$, the correspondence sending the matrix $u$ to its first column.
Voice: By nineteen eleven, | {H} is simply the identity matrix, || so S U two is topologically S three, || the correspondence sending the matrix {u} | to its first column.
Board:
- write H in line 6 · blue
  $H=\{I\}\ \Rightarrow\ SU(2)\approx S^3,\qquad u\mapsto(u_{11},u_{21})^T$

### 6.6 ¶
Say: In particular $SU(2)$ is connected and simply connected, as $S^3$ is.
Voice: In particular S U two is connected | and simply connected, | as S three is.
Board:
- write conn in line 7
  $SU(2)\ \text{connected, simply connected}$

### 6.7
Say: The determinant of the orthogonal matrix $\mathrm{Ad}(u)$ is $\pm1$, and it depends continuously on $u$.
Voice: The determinant of the orthogonal matrix Ad of {u} | is plus or minus one, || and it depends continuously on {u}.
Board:
- write det in line 8
  $\det\mathrm{Ad}(u)\in\{\pm1\},\qquad u\mapsto\det\mathrm{Ad}(u)\ \text{continuous}$

### 6.8
Say: On the connected $S^3$ it is therefore constant, equal to its value $+1$ at $u=I$, so $\mathrm{Ad}$ maps $SU(2)$ into $SO(3)$.
Voice: On the connected S three | it is therefore constant, | equal to its value plus one at the identity. || So Ad maps S U two into S O three.
Board:
- write into in line 9 · blue
  $\det\mathrm{Ad}(I)=1\ \Rightarrow\ \mathrm{Ad}\colon SU(2)\to SO(3)$

# Part: 19.1d. Ad: SU(2) → SO(3) in more detail

# Slide 7: Ad is onto

### 7.0
Say: We now have a homomorphism $\mathrm{Ad}\colon SU(2)\to SO(3)$, and Frankel's Theorem 19.12 describes it completely.
Voice: We now have a homomorphism, | Ad, | from S U two to S O three, || and Frankel's theorem nineteen twelve | describes it completely.

### 7.1
Say: Theorem 19.12 states that $\mathrm{Ad}$ is onto and two-to-one: for each rotation $R$ there are exactly two matrices $\pm u\in SU(2)$ with $\mathrm{Ad}(\pm u)=R$.
Voice: Theorem nineteen twelve states | that Ad is onto | and two-to-one. || For each rotation {R} | there are exactly two matrices, | {u} and minus {u}, | with Ad of plus or minus {u} equal to {R}.
Board:
- erase all
- write thm in line 1 · blue
  $\text{Thm 19.12:}\ \ \mathrm{Ad}\ \text{onto};\quad R\in SO(3)\ \Rightarrow\ \mathrm{Ad}^{-1}(R)=\{\pm u\}$

### 7.2
Say: For the proof, let $u(t)=e^{th/i}$ be a one-parameter subgroup of $SU(2)$, where $h=\mathbf h\cdot\boldsymbol\sigma$ is a hermitian $2\times2$ matrix with trace zero.
Voice: For the proof, | let {u} of {t}, | e to the {t} {h} over {i}, | be a one-parameter subgroup of S U two, || where {h}, | vector h dot sigma, | is a hermitian two by two matrix with trace zero.
Board:
- write ut in line 2
  $u(t)=e^{th/i}=e^{-ith},\qquad h=\mathbf h\cdot\boldsymbol\sigma\in i\,\mathfrak g,\quad\mathbf h\in\mathbb R^3$

### 7.3
Say: Under the identification $\mathbf x_*\sim\mathbf x$, the point $\mathrm{Ad}\,u(t)\mathbf x_*=e^{-ith}\mathbf x_*e^{ith}$ starts with velocity $-i[h,\mathbf x_*]$.
Voice: Under the identification of x star with vector x, | the point Ad of {u} of {t}, | applied to x star, || starts with velocity | minus {i} times the commutator of {h} with x star.
Board:
- write vel in line 3
  $\tfrac{d}{dt}\,\mathrm{Ad}\,u(t)\mathbf x_*\big|_{t=0}=\tfrac{d}{dt}\,e^{-ith}\mathbf x_*e^{ith}\big|_{t=0}=-i[h,\mathbf x_*]$

### 7.4
Say: In components, $-i[h^j\sigma_j,x^k\sigma_k]=2h^jx^k\epsilon_{jkl}\sigma_l$, which corresponds to $2(\mathbf h\times\mathbf x)$.
Voice: In components, | the commutator becomes | two, aitch jay, ex kay, epsilon {j} {k} {l}, {\sigma_l}, || which corresponds to two times, | vector h cross vector x.
Board:
- write vel2 in line 4
  $=-ih^jx^k[\sigma_j,\sigma_k]=2h^jx^k\epsilon_{jkl}\sigma_l\ \sim\ 2(\mathbf h\times\mathbf x)$

### Why? after 7.4
**Why does the initial velocity determine the whole rotation?** Because for a one-parameter subgroup $Q(t)$ with generator $A=Q'(0)$, the group law gives $Q'(t)=Q(t)A$ and $Q(0)=I$, so $Q(t)=e^{tA}$. Thus the velocity calculation identifies the entire subgroup, not just its first-order behaviour. The factor $2$ itself is already visible in the commutator on the board.

### 7.5
Say: So the one-parameter group $\mathrm{Ad}\,u(t)$ of rotations has angular velocity $\boldsymbol\omega=2\mathbf h$, and [[eq:19.3]] gives [[eq:19.13]].
Voice: So the one-parameter group Ad of {u} of {t} | has angular velocity | two times vector h, || and nineteen three gives nineteen thirteen.
Board:
- write r13 in line 5 · blue · equation 19.13
  $\boldsymbol\omega=2\mathbf h\ \overset{\eqref{19.3}}{\Longrightarrow}\ \mathrm{Ad}\exp\bigl(t\,\tfrac{\boldsymbol\sigma}{i}\cdot\mathbf h\bigr)=\exp(2t\,\mathbf E\cdot\mathbf h)\qquad(19.13)$

### 7.6
Say: Frankel notes that we have just verified $\mathrm{Ad}_*(\sigma_\alpha/2i)=E_\alpha$ for the differential of $\mathrm{Ad}$ at $I$, which is not very surprising after [[eq:19.6]].
Voice: Frankel notes that we have just verified | that the differential of Ad at the identity | sends {\sigma_\alpha} over two {i} | to {E_\alpha}, || which is not very surprising | after nineteen six.
Board:
- write d14 in line 6 · equation 19.14
  $\mathrm{Ad}_*=d\,\mathrm{Ad}\big|_I:\ \ \sigma_\alpha/2i\mapsto E_\alpha,\quad\alpha=1,2,3\qquad(19.14)$

### 7.7 ¶
Say: Every rotation of $\mathbb R^3$ is a rotation about some axis, $R=\exp(\theta\,\mathbf E\cdot\mathbf n)$, and by [[eq:19.13]] it equals $\mathrm{Ad}\exp\bigl(\theta\,\frac{\boldsymbol\sigma}{2i}\cdot\mathbf n\bigr)$, so $\mathrm{Ad}$ is onto.
Voice: Every rotation of R three | is a rotation about some axis, | the exponential of theta, E dot n. || By nineteen thirteen | it equals Ad of the exponential of theta, | sigma over two {i}, dot vector n, || so Ad is onto.
Board:
- write onto in line 7 · blue
  $R=\exp(\theta\,\mathbf E\cdot\mathbf n)=\mathrm{Ad}\exp\bigl(\theta\,\tfrac{\boldsymbol\sigma}{2i}\cdot\mathbf n\bigr),\ \ |\mathbf n|=1\ \Rightarrow\ \mathrm{Ad}\ \text{onto}$

# Slide 8: One turn in SU(2), two turns in space

### 8.0
Say: Frankel's example $\mathbf h=\mathbf e_3$ shows what the factor $2$ in [[eq:19.13]] means.
Voice: Frankel's example, | vector h equal to e three, | shows what the factor two in nineteen thirteen means.

### 8.1
Say: For $\mathbf h=\mathbf e_3$ we have $h=\sigma_3$, which generates $u(\theta)=\exp(\theta\sigma_3/i)=\operatorname{diag}(e^{-i\theta},e^{i\theta})$.
Voice: For vector h equal to e three | we have {h} equal to {\sigma_3}, || which generates {u} of theta, | the diagonal matrix | with entries e to the minus i theta | and e to the i theta.
Board:
- erase all
- write u3 in line 1
  $\mathbf h=\mathbf e_3,\ h=\sigma_3:\quad u(\theta)=\exp(\theta\sigma_3/i)=\operatorname{diag}(e^{-i\theta},e^{i\theta})$
- figure D dials at 100,250 size 1300×500 tq=0

### 8.2
Say: Under $\mathrm{Ad}$ it corresponds to $\exp(2\theta E_3)$, the rotation through $2\theta$ about the $z$ axis.
Voice: Under Ad it corresponds to | the exponential of two theta {E_3}, || the rotation through two theta | about the zee axis.
Board:
- write ad3 in line 2 · violet
  $\mathrm{Ad}\,u(\theta)=\exp(2\theta E_3)=R_z(2\theta)$

### 8.3
Ask: For which smallest $\theta>0$ is $\mathrm{Ad}\,u(\theta)$ the identity rotation?
Voice: For which smallest positive theta | is Ad of {u} of theta | the identity rotation?
Answer: π | pi | \pi
If 2π: At $\theta=2\pi$ the rotation is the identity, but it already was earlier.
If 2pi: At $\theta=2\pi$ the rotation is the identity, but it already was earlier.
Hint: $\mathrm{Ad}\,u(\theta)$ is the rotation through $2\theta$.
Then: At $\theta=\pi$ the space has made one full turn, while $u(\pi)=-I$.

### 8.4
Say: At $\theta=\pi$ the matrix $u(\pi)=-I$ is not the identity, while the rotation has made one full turn.
Voice: At theta equals pi | the matrix {u} of pi | is minus the identity, not the identity, || while the rotation has made ^ one full turn.
Board:
- ^ play D tq=24 live=true · 3000ms
- write pi in b1
  $\theta=\pi:\quad u(\pi)=-I,\qquad\mathrm{Ad}\,u(\pi)=I$

### 8.5
Say: Frankel stresses the contrast: for $0\le\theta\le2\pi$ the curve $u(\theta)$ is a simple closed curve in $SU(2)$, while $\exp(2\theta E_3)$ makes two full rotations in the same range.
Voice: Frankel stresses the contrast. || For theta from zero to two pi | the curve {u} of theta | is a simple closed curve in S U two, || while the exponential of two theta {E_3} ^ makes two full rotations | in the same range.
Board:
- ^ play D tq=48 · 3000ms
- write tpi in b2
  $\theta=2\pi:\quad u(2\pi)=I,\qquad\exp(4\pi E_3)\ \text{two full turns}$

### 8.6
Say: The slider above the figure runs $\theta$ up to $4\pi$.
Voice: The slider above the figure | runs theta | up to four pi.
Board:
- set D live=true

# Slide 9: Ad is two-to-one

### 9.0
Say: It remains to show that only $u$ and $-u$ map to the same rotation, and Frankel first explains what this means for the groups.
Voice: It remains to show | that only {u} and minus {u} | map to the same rotation. || Frankel first explains | what this means for the groups.

### 9.1
Say: If $\mathrm{Ad}(u)=R$, then also $\mathrm{Ad}(-u)=R$, so $\mathrm{Ad}$ is at least two-to-one, that is, not faithful.
Voice: If Ad of {u} is {R}, | then also Ad of minus {u} is {R}, || so Ad is at least two-to-one, | that is, not faithful.
Board:
- erase all
- write pm in line 1
  $\mathrm{Ad}(-u)\mathbf x_*=(-u)\mathbf x_*(-u)^{-1}=\mathrm{Ad}(u)\mathbf x_*\ \Rightarrow\ \text{at least}\ 2:1$

### 9.2
Say: By an elementary result of group theory, a homomorphism $\phi$ of $G$ onto $G'$ makes $G'$ isomorphic to $G/H$, where $H=\phi^{-1}(e')$ is the kernel.
Voice: By an elementary result of group theory, | a homomorphism phi of {G} onto {G}-prime | makes {G}-prime isomorphic to {G} modulo {H}, || where {H}, | the preimage of the identity, | is the kernel.
Board:
- write quo in line 2
  $\phi\colon G\to G'\ \text{onto}\ \Rightarrow\ G'\cong G/H,\qquad H=\phi^{-1}(e')=\ker\phi$

### Why? after 9.2
**Why does the kernel decide how many matrices map to one rotation?** Because $\mathrm{Ad}(u)=\mathrm{Ad}(v)$ if and only if $\mathrm{Ad}(uv^{-1})=I$, that is, $uv^{-1}\in\ker\mathrm{Ad}$. So the matrices with image $\mathrm{Ad}(v)$ form the coset $(\ker\mathrm{Ad})\,v$, and there are as many of them as elements of the kernel. Frankel calls the result a form of his "fundamental principle" (17.10), for $G$ acting on $G'$ by $(g,g')\mapsto\phi(g)g'$.

### 9.3
Say: So we need to know that the kernel of $\mathrm{Ad}$ consists precisely of the two matrices $\pm I$.
Voice: So we need to know | that the kernel of Ad | consists precisely of the two matrices, | plus and minus the identity.
Board:
- write ker in line 3
  $\text{to show:}\quad\ker\mathrm{Ad}=\{\pm I\}$

### 9.4 ¶
Say: Thus determining the kernel will tell us exactly how many matrices lie over each rotation.
Voice: Thus determining the kernel | will tell us exactly how many matrices | lie over each rotation.

# Slide 10: The kernel of Ad

### 10.0
Say: An element lies in the kernel precisely when it commutes with every traceless hermitian matrix, so it is enough to test the Pauli basis.
Voice: An element lies in the kernel | precisely when it commutes | with every traceless hermitian matrix, || so it is enough to test the Pauli basis.

### 10.1
Say: The kernel consists of the special unitary $u$ with $u\mathbf x_*u^{-1}=\mathbf x_*$ for all hermitian $\mathbf x_*$ with trace zero.
Voice: The kernel consists of the special unitary {u} | with {u} x star {u} inverse | equal to x star | for all hermitian x star with trace zero.
Board:
- erase all
- write ker in line 1
  $\ker\mathrm{Ad}=\{u\in SU(2):\ u\,\mathbf x_*u^{-1}=\mathbf x_*\ \ \forall\,\mathbf x_*\in i\,\mathfrak g\}$

### 10.2
Say: In particular $\sigma_\alpha^{-1}u\sigma_\alpha=u$ for each Pauli matrix, where $\sigma_\alpha^{-1}=\sigma_\alpha$, and we write $u$ in the form [[eq:19.11]].
Voice: In particular, | {\sigma_\alpha} inverse {u} {\sigma_\alpha} equals {u} | for each Pauli matrix, | where {\sigma_\alpha} is its own inverse. || We write {u} in the form nineteen eleven.
Board:
- write sus in line 2 · 85%
  $\sigma_\alpha u\,\sigma_\alpha=u\ \ (\alpha=1,2,3),\qquad u=\begin{pmatrix}z_1&-\bar z_2\\ z_2&\bar z_1\end{pmatrix}$

### 10.3
Say: Commuting with the diagonal matrix $\sigma_3$ forces the off-diagonal entry $z_2$ to vanish.
Voice: Commuting with the diagonal matrix {\sigma_3} | forces the off-diagonal entry {z_2} to vanish.
Board:
- write a3 in line 4 · 85%
  $\sigma_3u\sigma_3=\begin{pmatrix}z_1&\bar z_2\\-z_2&\bar z_1\end{pmatrix}=u\quad\Rightarrow\quad z_2=0$

### 10.4
Say: The matrix $\sigma_1$ swaps the two diagonal entries, so commuting with it makes $z_1$ real, and $|z_1|=1$ then gives $u=\pm I$.
Voice: The matrix {\sigma_1} swaps the two diagonal entries, || so commuting with it makes {z_1} real, || and absolute value of {z_1} equal to one | then gives {u} equal to plus or minus the identity.
Board:
- write a1 in line 6 · 85%
  $\sigma_1\begin{pmatrix}z_1&0\\0&\bar z_1\end{pmatrix}\sigma_1=\begin{pmatrix}\bar z_1&0\\0&z_1\end{pmatrix}\quad\Rightarrow\quad z_1=\bar z_1=\pm1$

### 10.5 ¶
Say: Thus $\ker\mathrm{Ad}=\{\pm I\}$ and $SO(3)\cong SU(2)/\{\pm I\}$, which completes the proof of Theorem 19.12.
Voice: Thus the kernel of Ad is plus or minus the identity, || and S O three is S U two modulo plus or minus the identity. || This completes the proof of theorem nineteen twelve.
Board:
- write quo in line 8 · blue
  $\ker\mathrm{Ad}=\{\pm I\}\ \Rightarrow\ SO(3)\cong SU(2)/\{\pm I\}$

### 10.6
Say: Since $SU(2)$ is $S^3$, identifying the pair $u,-u$ gives $SO(3)\cong\mathbb RP^3$.
Voice: Since S U two is S three, | identifying the pair {u}, minus {u} | gives S O three as real projective three-space.
Board:
- write topo at 80,925 · 85%
  $SO(3)\cong S^3/(u\sim-u)=\mathbb RP^3$
