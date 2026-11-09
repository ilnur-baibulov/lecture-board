# Figures and motion

Rules for pictures and animations in talks and cards. For the drawing API (`Board.figure`, `controls`, `inspect`, `replay`, `readoutWidth`), see `script-format.md`.

## What the picture shows
- Choose the picture for the relation the reader needs to see. A static view with well-chosen positions suffices when it shows an axis, an orbit and a tangent at once; use motion when the change itself explains the claim, and let the reader scrub or replay it afterwards.
- Give a moving point or body a visible mark that follows it, together with a fixed reference and, where helpful, the trace of its path. When two panels show different spaces (such as a body in $\mathbb R^3$ and the corresponding point in parameter space), label both spaces and drive both panels from the same state.
- Separate distinct parameters into distinct controls: position along a path, deformation of the path as a whole, and camera viewpoint. Keep only controls that show a difference relevant to the argument.
- In a talk, play the narrated demonstration first without control clutter, then reveal the time slider and local replay (`inspect: true`, `replay`) so the viewer can inspect it. When the same figure begins a new narrated motion on a later step, hide inspection controls while the new motion runs and restore them once it finishes. A second control that deforms the whole family appears only after the step that introduces the deformation.
- Preserve mathematical constraints at all intermediate frames and limits: a based loop keeps its base point fixed throughout a homotopy, a path crossing an identified boundary breaks its drawn trace at the jump rather than drawing a chord across the domain, and a stationary limit sits at its exact point. Draw fixed geometric elements from exact points or segments rather than coarse sampling so they do not drift during motion.
- Place each label beside its point, curve or axis with enough clearance that the mark itself stays visible throughout the motion. Keep changing parameter readouts in the control bar rather than colliding with object labels, and set `readoutWidth` wide enough for signs, digits and fractions so the slider track never shifts while dragged.

## Checking the figure
`scripts/lint.py` checks only the end of each step. After lint passes, open the page in a browser and check interactive figures by hand:
- Inspect the start, midpoint, end and any boundary jump of every motion, checking that labels stay clear of moving curves and that paired panels stay synchronized.
- Drag each slider across its range and click its replay button during playback: Watch should pause while the viewer inspects the figure, the slider track should stay in place as the readout changes, and pressing Play or moving to another step should restore the scripted state.
- Check slide transitions where a figure is wiped: the previous figure's controls must disappear as soon as the new slide's wipe begins.
