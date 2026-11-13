"""The readable script format of a lecture-board explainer (.md) <-> the scene object the engine plays.

parse(text) -> scene dict;  dump(scene) -> text.  Python 3 stdlib only.
CLI:  mdscript.py check NAME.md         (mechanical problems; with voice, also unreadable TeX and Say/Voice drift)
      mdscript.py voice NAME.md [--say] (the spoken text, step by step; --say prints Say: above each Voice:)

Script layout
-------------
---
title: …
subtitle: …
---
# Glossary
- **key** — definition                     (or **key | shown term** — definition)
# Part: Title         (optional) starts a section: the slides after it belong to it until the next # Part
# Slide N: Title       (the title shows on the slide dots, the transcript and the slide list)
[[eq:LABEL]]           prose reference to a board formula labelled with option "equation LABEL"
\\eqref{LABEL}         the same reference inside TeX
[[slide:Title]]        anywhere in Say, Voice or a note: replaced by "slide N" for the slide with that title
                       (slides are numbered by their order; the N in '# Slide N' is only for the reader)
### Why? after N.M     **Question?** The answer first, then details.   (a side question, shown as ? in a circle)
### Caution after N.M  **What is subtle** Then why.                      (a subtle point, shown as ! in a triangle)
### N.M            (### N.M ¶ starts a new paragraph in the transcript)
Say: shown sentence, with $TeX$ and [[key]] glossary links
Voice: spoken text; | short pause, || long pause, ^ start of the next cued board action
Board:
- write ID at X,Y · options          next line, indented: $TeX$
- node ID "LABEL" at X,Y · options
- edge ID FROM → TO · options        (dashed edge …; FROM/TO are ids or X,Y)
- arc ID FROM → TO · options
- box ID at X,Y size W×H · options
- mark ID ID … · colour
- erase ID ID …   |   erase all
- wait MS
- point ID ID …                     a dot glides under each in turn and a ring flashes around it; ID:name is the part \\piece{name}{…} of formula ID
- ruler R in ROW · from X0 to X1     a horizontal line;  tick ID on R at F "TeX";  ticks ID on R at F F …;  span ID on R from F to G "TeX"
- together:                          nested items below it run at the same time
- figure ID KIND at X,Y size W×H k=v …   a region drawn by a script (Board.figure(KIND, {init, draw(g, s)}), file named in
                                     'figures:' of the front matter); k=v set its initial state
- set ID k=v …                       change a figure's state at once (numbers, true/false, words)
- play ID k=v … · 1500ms             move a figure's numbers to these values over the duration
- ^ ACTION                           waits for the next ^ in Voice
Options: blue violet yellow dim ink red · 85% (size) · fade · 700ms · term KEY · centered
         · label 90% (node label size) · depth N · label $TeX$ (arc label)
Coordinates are on a 1600×1000 board.
Front matter may also give  lang: ru  (language of the text; the interface is always English),  voice: off  (no voice; steps last their reading time)
and  figures: FILE.js  (figure kinds, next to the script).
profile: card  makes a page of cards for students (the same engine): a slide is a card with optional 'Id:', 'Short:' and
'Intro:' lines before its steps; no voice unless  voice: on ; the student steps and a 'play' waits for ▶.
In any script, 'Ask:' in place of 'Say:' makes a question, with 'Answer:', 'Hint:', 'If WRONG:' and 'Then:' lines
(references/script-format.md, Questions). '## Heading' inside a slide starts a stage; 'Say if key=value …:' gives the sentence for a state of the
figures, and {{name}} in Say is filled from the figures' state and their text(s).
"""
from collections import Counter
import re

COLOR = {'c1': 'blue', 'c2': 'violet', 'acc': 'yellow', 'dim': 'dim', 'ink': 'ink', 'warn': 'red'}
NAME = {v: k for k, v in COLOR.items()}
SEP = ' · '


def num(v):
    return str(int(v)) if float(v).is_integer() else str(v)


def pct(v):
    return f'{round(v * 100)}%'


def pt(p):
    return p if isinstance(p, str) else f"{num(p['x'])},{num(p['y'])}"


# ---------------------------------------------------------------- dump
def dump_action(a, ind, cue):
    pre = ' ' * ind + '- ' + ('^ ' if cue else '')
    op, o = a['op'], []
    if 'color' in a and op != 'mark':
        o.append(COLOR[a['color']])
    if op == 'tex':
        if 'size' in a: o.append(pct(a['size']))
        if a.get('anim') == 'fade': o.append('fade')
        if 'dur' in a: o.append(f"{num(a['dur'])}ms")
        if 'term' in a: o.append('term ' + a['term'])
        if 'equation' in a: o.append('equation ' + a['equation'])
        if a.get('anchor') == 'c': o.append('centered')
        return [pre + SEP.join([f"write {a['id']} at {num(a['x'])},{num(a['y'])}"] + o), ' ' * (ind + 2) + '$' + a['tex'] + '$']
    if op == 'node':
        if 'lsize' in a: o.append('label ' + pct(a['lsize']))
        return [pre + SEP.join([f"node {a['id']} \"{a['label']}\" at {num(a['x'])},{num(a['y'])}"] + o)]
    if op == 'edge':
        return [pre + SEP.join([('dashed ' if a.get('dash') else '') + f"edge {a['id']} {pt(a['from'])} → {pt(a['to'])}"] + o)]
    if op == 'arc':
        o = ([f"depth {num(a['depth'])}"] if 'depth' in a else []) + o
        if 'dur' in a: o.append(f"{num(a['dur'])}ms")
        if 'label' in a: o.append('label $' + a['label'] + '$')
        return [pre + SEP.join([f"arc {a['id']} {pt(a['from'])} → {pt(a['to'])}"] + o)]
    if op == 'box':
        return [pre + SEP.join([f"box {a['id']} at {num(a['x'])},{num(a['y'])} size {num(a['w'])}×{num(a['h'])}"] + o)]
    if op == 'mark':
        return [pre + SEP.join(['mark ' + ' '.join(a['ids'])] + ([COLOR[a['color']]] if 'color' in a else []))]
    if op == 'erase':
        return [pre + ('erase all' if a['ids'] == 'all' else 'erase ' + ' '.join(a['ids']))]
    if op == 'wait':
        return [pre + f"wait {num(a['dur'])}"]
    if op == 'par':
        return [pre + 'together:'] + dump_list(a['actions'], ind + 2)
    kvs = lambda d: ''.join(f" {k}={str(v).lower() if isinstance(v, bool) else num(v) if isinstance(v, (int, float)) else v}" for k, v in d.items())
    if op == 'figure':
        return [pre + f"figure {a['id']} {a['kind']} at {num(a['x'])},{num(a['y'])} size {num(a['w'])}×{num(a['h'])}" + kvs(a.get('set', {}))]
    if op in ('fset', 'fplay'):
        return [pre + SEP.join([f"{op[1:]} {a['fig']}" + kvs(a['set'])] + ([f"{num(a['dur'])}ms"] if 'dur' in a else []))]
    raise ValueError(op)


def dump_list(actions, ind=0):
    out, cue = [], False
    for a in actions:
        if a['op'] == 'cue':
            cue = True
            continue
        out += dump_action(a, ind, cue)
        cue = False
    return out


def dump(S):
    L = ['---', 'title: ' + S['title'], 'subtitle: ' + S.get('subtitle', ''), '---', '', '# Glossary', '']
    for k, g in S.get('glossary', {}).items():
        L.append(f"- **{k if g['term'] == k else k + ' | ' + g['term']}** — {g['def']}")
    for n, sl in enumerate(S['slides'], 1):
        L += ['', f'# Slide {n}' + (': ' + sl['title'] if sl.get('title') else ''), '']
        if sl.get('why'):
            L += [f"**{sl.get('whyLabel', 'Why?')}** {sl['why']}", '']
        for m, st in enumerate(sl['steps'], 1):
            L.append(f'### {n}.{m}' + (' ¶' if st.get('p') else ''))
            L.append('Say: ' + st['say'])
            if st.get('voice'): L.append('Voice: ' + st['voice'])
            if st.get('do'): L += ['Board:'] + dump_list(st['do'])
            L.append('')
            for kind, head in (('why', 'Why?'), ('caution', 'Caution')):
                if st.get(kind):
                    L += [f'### {head} after {n}.{m}', f"**{st[kind]['label']}** {st[kind]['text']}", '']
    return '\n'.join(L).rstrip() + '\n'


# ---------------------------------------------------------------- parse
def point(s):
    m = re.fullmatch(r'(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)', s)
    return {'x': float(m[1]) if '.' in m[1] else int(m[1]), 'y': float(m[2]) if '.' in m[2] else int(m[2])} if m else s


def n(s):
    return float(s) if '.' in s else int(s)


# ---------------------------------------------------------------- layout helpers: rows and trees
# Rows: 'line N' (a vertical list from the top), t1/t2 (= line 1/2), b0/b1/b2 (bottom rows, b0 just above b1); 'right' starts at the right half.
LEFT, RIGHT = 80, 900
def row_xy(spec, where):
    m = re.fullmatch(r'(line (\d+)|t1|t2|b0|b1|b2)( right)?', spec)
    if not m: raise ValueError(f'{where}: unknown row "{spec}"')
    if m[2]: y = 90 + 95 * (int(m[2]) - 1)
    else: y = {'t1': 90, 't2': 185, 'b0': 760, 'b1': 850, 'b2': 940}[m[1]]
    return (RIGHT if m[3] else LEFT), y


DOTS = ('…', '\\cdots', '...')
def tree_layout(outline, where, region=(270, 600), span=(140, 1460), step=150):
    """outline: list of (indent, label). Returns {path: node} with x, y, label, depth, parent, dots."""
    base = outline[0][0]
    nodes, stack = {}, []
    for ind, lab in outline:
        d = (ind - base) // 2
        while stack and stack[-1][0] >= d: stack.pop()
        if d and not stack: raise ValueError(f'{where}: tree outline has two roots')
        parent = stack[-1][1] if stack else None
        if parent is None: path = '()'
        else:
            pk = parent[1:-1]
            path = '(' + (pk + ',' if pk else '') + ('…' if lab in DOTS else lab.replace('\\', '').replace(' ', '')) + ')'
        nodes[path] = {'label': lab, 'depth': d, 'parent': parent, 'dots': lab in DOTS, 'kids': []}
        if parent: nodes[parent]['kids'].append(path)
        stack.append((d, path))
    leaves = [p for p, v in nodes.items() if not v['kids']]
    depth = max(v['depth'] for v in nodes.values()) or 1
    gap = min(step, (span[1] - span[0]) / max(1, len(leaves) - 1))
    x0 = 800 - gap * (len(leaves) - 1) / 2
    for i, p in enumerate(leaves): nodes[p]['x'] = round(x0 + i * gap)
    for p in sorted(nodes, key=lambda q: -nodes[q]['depth']):
        v = nodes[p]
        if v['kids']: v['x'] = round(sum(nodes[k]['x'] for k in v['kids']) / len(v['kids']))
        v['y'] = round(region[0] + (region[1] - region[0]) * v['depth'] / depth)
    return nodes


def tree_level_ops(t, level, opts):
    """Board actions that draw one level of a laid-out tree."""
    acts = []
    for p, v in t['nodes'].items():
        if v['depth'] != level: continue
        if v['dots']:
            acts.append({'op': 'edge', 'id': f"{v['parent']}-{p}", 'from': v['parent'], 'to': {'x': v['x'], 'y': v['y'] - 10}, 'dash': '10 9'})
            acts.append({'op': 'tex', 'id': p, 'x': v['x'], 'y': v['y'] + 8, 'tex': '\\cdots', 'anchor': 'c', 'color': 'dim', 'anim': 'fade'})
            continue
        node = {'op': 'node', 'id': p, 'label': v['label'], 'x': v['x'], 'y': v['y']}
        if len(v['label']) > 2: node['lsize'] = .9
        acts.append(node)
        if v['parent']: acts.append({'op': 'edge', 'id': f"{v['parent']}-{p}", 'from': v['parent'], 'to': p})
    if t.get('levels') and level:
        acts.append({'op': 'tex', 'id': f"{t['name']}.n{level}", 'x': 30, 'y': next(v['y'] for v in t['nodes'].values() if v['depth'] == level),
                     'tex': f"{t['levels']}={level}", 'color': 'dim', 'anim': 'fade', 'size': .8})
    return acts


def tree_path(t, p):
    ids = []
    while p:
        ids.append(p)
        par = t['nodes'][p]['parent']
        if par: ids.append(f'{par}-{p}')
        p = par
    return ids


def kv(text, where):
    out = {}
    for tok in text.split():
        k, _, v = tok.partition('=')
        if not k or not v: raise ValueError(f'{where}: cannot read "{tok}" (want key=value)')
        out[k] = True if v == 'true' else False if v == 'false' else n(v) if re.fullmatch(r'-?\d+(\.\d+)?', v) else v
    return out


def parse_item(text, tex, where, ctx=None, outline=None):
    ctx = ctx if ctx is not None else {'trees': {}}
    head, *opts = text.split(SEP)
    a = None
    if m := re.fullmatch(r'write (\S+) at (-?[\d.]+),(-?[\d.]+)', head):
        if tex is None: raise ValueError(f'{where}: write {m[1]} needs a $TeX$ line under it')
        a = {'op': 'tex', 'id': m[1], 'x': n(m[2]), 'y': n(m[3]), 'tex': tex}
    elif m := re.fullmatch(r'write (\S+) in (.+)', head):
        if tex is None: raise ValueError(f'{where}: write {m[1]} needs a $TeX$ line under it')
        x, y = row_xy(m[2], where)
        a = {'op': 'tex', 'id': m[1], 'x': x, 'y': y, 'tex': tex}
    elif m := re.fullmatch(r'write (\S+) next to (\S+)', head):
        if tex is None: raise ValueError(f'{where}: write {m[1]} needs a $TeX$ line under it')
        a = {'op': 'tex', 'id': m[1], 'after': m[2], 'x': 0, 'y': 0, 'tex': tex}
    elif m := re.fullmatch(r'tree (\S+)', head):
        if not outline: raise ValueError(f'{where}: tree {m[1]} needs its outline under it')
        t = {'name': m[1], 'nodes': tree_layout(outline, where), 'shown': 0}
        ctx['trees'][m[1]] = t
        for o in opts:
            if mm := re.fullmatch(r'levels (\S+)', o.strip()): t['levels'] = mm[1]
        return {'op': 'par', 'actions': tree_level_ops(t, 0, opts)}
    elif m := re.fullmatch(r'ruler (\S+) in (.+)', head):
        _, y = row_xy(m[2], where)
        x0, x1 = 120, 1480
        for o in opts:
            if mm := re.fullmatch(r'from (\d+) to (\d+)', o.strip()): x0, x1 = int(mm[1]), int(mm[2])
        ctx.setdefault('rulers', {})[m[1]] = (x0, x1, y)
        opts = [o for o in opts if not o.strip().startswith('from ')]
        a = {'op': 'path', 'id': m[1], 'd': f'M{x0},{y} L{x1},{y}', 'width': 2.5, 'color': 'dim'}
    elif m := re.fullmatch(r'tick (\S+) on (\S+) at ([\d.]+)(?: "(.*)")?', head):
        x0, x1, y = ctx.get('rulers', {}).get(m[2], (None,) * 3)
        if x0 is None: raise ValueError(f'{where}: no ruler "{m[2]}"')
        x = round(x0 + (x1 - x0) * float(m[3]))
        acts = [{'op': 'path', 'id': m[1], 'd': f'M{x},{y - 14} L{x},{y + 14}', 'width': 3, 'dur': 250}]
        if m[4]: acts.append({'op': 'tex', 'id': m[1] + '.l', 'x': x, 'y': y + 48, 'tex': m[4], 'anchor': 'c', 'anim': 'fade'})
        col = next((NAME[o.strip()] for o in opts if o.strip() in NAME), None)
        if col:
            for t in acts: t['color'] = col
        return {'op': 'par', 'actions': acts}
    elif m := re.fullmatch(r'ticks (\S+) on (\S+) at ([\d. ]+)', head):
        x0, x1, y = ctx.get('rulers', {}).get(m[2], (None,) * 3)
        if x0 is None: raise ValueError(f'{where}: no ruler "{m[2]}"')
        d = ' '.join(f'M{round(x0 + (x1 - x0) * float(f))},{y - 10} L{round(x0 + (x1 - x0) * float(f))},{y + 10}' for f in m[3].split())
        a = {'op': 'path', 'id': m[1], 'd': d, 'width': 2.5, 'color': 'dim', 'dur': 400}
    elif m := re.fullmatch(r'span (\S+) on (\S+) from ([\d.]+) to ([\d.]+)(?: "(.*)")?', head):
        x0, x1, y = ctx.get('rulers', {}).get(m[2], (None,) * 3)
        if x0 is None: raise ValueError(f'{where}: no ruler "{m[2]}"')
        xa, xb = round(x0 + (x1 - x0) * float(m[3])), round(x0 + (x1 - x0) * float(m[4]))
        acts = [{'op': 'path', 'id': m[1], 'd': f'M{xa},{y} L{xb},{y}', 'width': 7}]
        if m[5]: acts.append({'op': 'tex', 'id': m[1] + '.l', 'x': (xa + xb) // 2, 'y': y - 42, 'tex': m[5], 'anchor': 'c', 'anim': 'fade'})
        col = next((NAME[o.strip()] for o in opts if o.strip() in NAME), None)
        for t in acts: t['color'] = col or 'ink'
        return {'op': 'par', 'actions': acts}
    elif m := re.fullmatch(r'grow (\S+)(?: to level (\d+))?', head):
        t = ctx['trees'].get(m[1])
        if not t: raise ValueError(f'{where}: no tree "{m[1]}"')
        upto = int(m[2]) if m[2] else t['shown'] + 1
        acts = []
        for lv in range(t['shown'] + 1, upto + 1): acts += tree_level_ops(t, lv, opts)
        t['shown'] = upto
        a = {'op': 'par', 'actions': acts}
        return a
    elif m := re.fullmatch(r'figure (\S+) (\S+) at (-?[\d.]+),(-?[\d.]+) size (\d+)×(\d+)((?: \S+=\S+)*)', head):
        a = {'op': 'figure', 'id': m[1], 'kind': m[2], 'x': n(m[3]), 'y': n(m[4]), 'w': n(m[5]), 'h': n(m[6]), 'set': kv(m[7], where)}
    elif m := re.fullmatch(r'(set|play) (\S+)((?: \S+=\S+)+)', head):
        a = {'op': 'f' + m[1], 'fig': m[2], 'set': kv(m[3], where)}
    elif m := re.fullmatch(r'node (\S+) "(.*)" at (-?[\d.]+),(-?[\d.]+)', head):
        a = {'op': 'node', 'id': m[1], 'label': m[2], 'x': n(m[3]), 'y': n(m[4])}
    elif m := re.fullmatch(r'(dashed )?edge (\S+) (\S+) → (\S+)', head):
        a = {'op': 'edge', 'id': m[2], 'from': point(m[3]), 'to': point(m[4])}
        if m[1]: a['dash'] = '10 9'
    elif m := re.fullmatch(r'arc (\S+) (\S+) → (\S+)', head):
        a = {'op': 'arc', 'id': m[1], 'from': point(m[2]), 'to': point(m[3])}
    elif m := re.fullmatch(r'box (\S+) at (-?[\d.]+),(-?[\d.]+) size (\d+)×(\d+)', head):
        a = {'op': 'box', 'id': m[1], 'x': n(m[2]), 'y': n(m[3]), 'w': n(m[4]), 'h': n(m[5])}
    elif m := re.fullmatch(r'box (\S+) around level (\d+) of (\S+)', head):
        t = ctx['trees'].get(m[3])
        if not t: raise ValueError(f'{where}: no tree "{m[3]}"')
        lv = [v for v in t['nodes'].values() if v['depth'] == int(m[2])]
        x0, x1, y = min(v['x'] for v in lv) - 55, max(v['x'] for v in lv) + 55, lv[0]['y']
        a = {'op': 'box', 'id': m[1], 'x': x0, 'y': y - 55, 'w': x1 - x0, 'h': 110}
    elif m := re.fullmatch(r'mark (.+)', head):
        ids = []
        for tok in re.findall(r'path \S+|\S+', m[1]):
            if tok.startswith('path '):
                p = tok[5:]
                t = next((t for t in ctx['trees'].values() if p in t['nodes']), None)
                if not t: raise ValueError(f'{where}: "{p}" is not a tree node')
                ids += tree_path(t, p)
            else: ids.append(tok)
        a = {'op': 'mark', 'ids': ids}
    elif m := re.fullmatch(r'erase (.+)', head):
        a = {'op': 'erase', 'ids': 'all' if m[1] == 'all' else m[1].split()}
    elif m := re.fullmatch(r'point (.+)', head):
        a = {'op': 'point', 'ids': m[1].split()}
    elif m := re.fullmatch(r'wait (\d+)', head):
        a = {'op': 'wait', 'dur': n(m[1])}
    else:
        raise ValueError(f'{where}: cannot read board line "{head}"')
    for o in opts:
        o = o.strip()
        if o in NAME: a['color'] = NAME[o]
        elif o == 'fade': a['anim'] = 'fade'
        elif o == 'centered': a['anchor'] = 'c'
        elif m := re.fullmatch(r'label (\d+)%', o): a['lsize'] = int(m[1]) / 100
        elif m := re.fullmatch(r'label \$(.*)\$', o): a['label'] = m[1]
        elif m := re.fullmatch(r'(\d+)%', o): a['size'] = int(m[1]) / 100
        elif m := re.fullmatch(r'(\d+)ms', o): a['dur'] = int(m[1])
        elif m := re.fullmatch(r'depth (\d+)', o): a['depth'] = int(m[1])
        elif m := re.fullmatch(r'term (\w+)', o): a['term'] = m[1]
        elif m := re.fullmatch(r'equation ([\w.-]+)', o):
            if a['op'] != 'tex': raise ValueError(f'{where}: equation label needs a write action')
            a['equation'] = m[1]
        else: raise ValueError(f'{where}: unknown option "{o}"')
    return a


def parse_board(lines, where, ctx=None):
    """lines: the indented list under Board:. Returns the action list."""
    items = []  # [indent, text, tex, outline]
    for ln in lines:
        if not ln.strip(): continue
        ind = len(ln) - len(ln.lstrip())
        s = ln.strip()
        if s.startswith('- '):
            items.append([ind, s[2:], None, None])
        elif s.startswith('$') and s.endswith('$') and items:
            items[-1][2] = s[1:-1]
        elif items and re.match(r'(\^ )?tree ', items[-1][1]):
            items[-1][3] = (items[-1][3] or []) + [(ind, s)]
        else:
            raise ValueError(f'{where}: unexpected line "{s}"')

    def build(i, ind):
        out = []
        while i < len(items) and items[i][0] >= ind:
            it_ind, text, tex, outline = items[i]
            if it_ind > ind: raise ValueError(f'{where}: bad indentation at "{text}"')
            cue = text.startswith('^ ')
            if cue: text = text[2:]; out.append({'op': 'cue'})
            if text == 'together:':
                kids, i = build(i + 1, ind + 2)
                out.append({'op': 'par', 'actions': kids})
                continue
            out.append(parse_item(text, tex, where, ctx, outline))
            i += 1
        return out, i

    acts, i = build(0, items[0][0] if items else 0)
    if i != len(items): raise ValueError(f'{where}: could not read the board list')
    return acts


def resolve_slide_refs(text):
    """[[slide:Title]] -> 'slide N', N the slide's place in the script, so references survive inserting slides."""
    titles = [m[1].strip().lower() for m in re.finditer(r'^# Slide \d+:\s*(.+)$', text, re.M)]
    def rep(m):
        t = m[1].strip().lower()
        if t not in titles: raise ValueError(f'[[slide:{m[1]}]]: no slide with this title')
        return f'slide {titles.index(t) + 1}'
    return re.sub(r'\[\[slide:([^\]]+)\]\]', rep, text)


def parse(text):
    text = resolve_slide_refs(text)
    lines = text.split('\n')
    S = {'glossary': {}, 'slides': []}
    i = 0
    if lines[0].strip() == '---':
        i = 1
        while lines[i].strip() != '---':
            k, _, v = lines[i].partition(':')
            S[k.strip()] = v.strip()
            i += 1
        i += 1
    sec, slide, step, board, pre = None, None, None, None, []
    part = None
    section = None
    stage = None  # '## Title' inside a slide: the stage (a group of steps with a heading) of a card
    ctx = {'trees': {}}
    why = None  # [target step number, lines, kind] while reading a '### Why? after N.M' or '### Caution after N.M' block

    def close_step():
        nonlocal board
        if step is not None and board is not None:
            step['do'] = parse_board(board, f"step {step['_n']}", ctx)
        board = None

    def close_why():
        nonlocal why
        if why is None: return
        t = '\n'.join(why[1]).strip()
        m = re.match(r'\*\*(.+?)\*\*\s*(.*)', t, re.S)
        if not m: raise ValueError(f'{why[2]} after {why[0]} must start with **its title**')
        tgt = [st for st in slide['steps'] if st.get('_n') == why[0]]
        if not tgt: raise ValueError(f'{why[2]} after {why[0]}: no such step in this slide')
        tgt[0][why[2]] = {'label': m[1], 'text': m[2].strip()}
        why = None

    def close_pre():
        if slide is not None and pre and 'steps' in slide and not slide['steps']:
            t = '\n'.join(pre).strip()
            if t:
                m = re.match(r'\*\*(.+?)\*\*\s*(.*)', t, re.S)
                if not m: raise ValueError('a Why block must start with **its question**')
                slide['whyLabel'], slide['why'] = m[1], m[2].strip()
        pre.clear()

    for ln in lines[i:]:
        if ln.startswith('# '):
            close_step(); close_why(); close_pre(); step = None
            title = ln[2:].strip()
            if title.lower() == 'glossary':
                sec = 'glossary'
            elif mm := re.fullmatch(r'Section:\s*(.+)', title):
                section = mm[1].strip(); part = None; sec = None
            elif mm := re.fullmatch(r'Part:\s*(.+)', title):
                part = mm[1].strip(); sec = None
            elif mm := re.fullmatch(r'Slide \d+(?::\s*(.+))?', title):
                sec = 'slide'; slide = {'steps': []}; S['slides'].append(slide); stage = None
                if mm[1]: slide['title'] = mm[1].strip()
                if part: slide['part'] = part
                if section: slide['section'] = section
            else:
                raise ValueError(f'unknown section "{title}"')
            continue
        if sec == 'glossary':
            if m := re.fullmatch(r'- \*\*(\w+)(?: \| (.+?))?\*\* — (.+)', ln.strip()):
                S['glossary'][m[1]] = {'term': m[2] or m[1], 'def': m[3]}
            elif ln.strip():
                raise ValueError(f'glossary: cannot read "{ln.strip()}"')
            continue
        if sec != 'slide':
            continue
        if m := re.fullmatch(r'### (Why\?|Caution) after (\d+\.\d+)\s*', ln):
            close_step(); close_why(); close_pre()
            why = [m[2], [], 'why' if m[1] == 'Why?' else 'caution']; step = None
            continue
        if why is not None and not ln.startswith('#'):
            why[1].append(ln)
            continue
        if m := re.fullmatch(r'### (\d+\.\d+)( ¶)?\s*', ln):
            close_step(); close_why(); close_pre()
            step = {'_n': m[1]}
            if m[2]: step['p'] = True
            if stage: step['stage'] = stage
            slide['steps'].append(step)
            continue
        if m := re.fullmatch(r'## (.+)', ln.strip()):
            close_step(); close_why(); close_pre(); step = None
            stage = m[1].strip()
            continue
        if step is None:
            if m := re.fullmatch(r'(Id|Short|Intro): (.+)', ln.strip()):
                k = m[1].lower()
                if k == 'intro': slide.setdefault('intro', []).append(m[2].strip())
                else: slide[k] = m[2].strip()
                continue
            pre.append(ln)
            continue
        if board is not None and (ln.startswith(' ') or ln.startswith('-') or not ln.strip()):
            board.append(ln)
            continue
        if ln.startswith('Say: '): step['say'] = ln[5:].strip()
        elif ln.startswith('Ask: '): step['say'] = ln[5:].strip(); step['q'] = {}
        elif ln.startswith('Answer: ') and 'q' in step:
            a = ln[8:].strip()
            if m := re.fullmatch(r'click (\S+) (\S+)(?: = (.+))?', a):
                step['q'].update(kind='click', fig=m[1], target=m[2], show=m[3] or m[2])
            else:
                acc = [x.strip() for x in a.split(' | ')]
                step['q'].update(kind='text', accept=acc, show=acc[0])
        elif ln.startswith('Hint: ') and 'q' in step: step['q']['hint'] = ln[6:].strip()
        elif ln.startswith('Then: ') and 'q' in step: step['q']['then'] = ln[6:].strip()
        elif (m := re.fullmatch(r'If (.+?): (.+)', ln.strip())) and 'q' in step:
            step['q'].setdefault('wrong', []).append({'a': m[1].strip(), 'say': m[2].strip()})
        elif m := re.fullmatch(r'Say if ((?:\S+=\S+ ?)+): (.+)', ln.strip()):
            step.setdefault('sayIf', []).append({'when': {k: v for k, _, v in (t.partition('=') for t in m[1].split())}, 'say': m[2].strip()})
        elif ln.startswith('Voice: '): step['voice'] = voice_text(ln[7:].strip())
        elif ln.strip() == 'Board:': board = []
        elif ln.strip(): raise ValueError(f"step {step['_n']}: cannot read \"{ln.strip()}\"")
    close_step(); close_why(); close_pre()
    for sl in S['slides']:
        for st in sl['steps']:
            st.pop('_n', None)
            if 'say' not in st: raise ValueError('every step needs a Say: line (or Ask: for a question)')
            if 'q' in st and 'kind' not in st['q']: raise ValueError(f'the question "{st["say"][:40]}" needs an Answer: line')
    equations = {}
    def register(actions, k):
        for a in actions:
            if key := a.get('equation'):
                if key in equations and equations[key] != k:
                    raise ValueError(f'equation {key}: defined on more than one slide')
                equations[key] = k
            register(a.get('actions', []), k)
    for k, sl in enumerate(S['slides']):
        for st in sl['steps']: register(st.get('do', []), k)
    for key in re.findall(r'\[\[eq:([\w.-]+)\]\]|\\eqref\{([\w.-]+)\}', text):
        label = key[0] or key[1]
        if label not in equations: raise ValueError(f'equation {label}: no labelled board formula')
    return S


# ---------------------------------------------------------------- {TeX} in Voice → words, by lexicon.json
import json, pathlib
LEX = json.loads((pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'lexicon.json').read_text())


UNKNOWN = set()   # commands read by the fallback since the last parse


def _tokens(t):
    return re.findall(r'\\[A-Za-z]+|\\.|[A-Za-z]|\d+|\S', t)


def _arg(toks, i):
    """one argument at toks[i]: a {group} or a single token. Returns (tokens, next index)."""
    if i < len(toks) and toks[i] == '{':
        depth, j = 1, i + 1
        while j < len(toks) and depth:
            depth += {'{': 1, '}': -1}.get(toks[j], 0); j += 1
        return toks[i + 1:j - 1], j
    return toks[i:i + 1], i + 1


def speak_tex(t):
    # whole phrases first: each becomes a placeholder command read from the lexicon
    for n_, (k, w) in enumerate(LEX.get('phrases', {}).items()):
        tag = '\\PHRASE' + chr(65 + n_ // 26) + chr(65 + n_ % 26)
        t = t.replace(k, f' {tag} ')
        LEX['commands'][tag] = w
    toks, out, i = _tokens(t), [], 0
    def words(ts): return speak_toks(ts)
    return speak_toks(toks)


def speak_toks(toks):
    out, i = [], 0
    while i < len(toks):
        tk = toks[i]
        if tk in LEX['fonts']:
            arg, i = _arg(toks, i + 1)
            w = speak_toks(arg)
            out.append((LEX['fonts'][tk] + ' ' + w).strip()); continue
        if tk == '_':
            arg, i = _arg(toks, i + 1)
            out.append('sub ' + speak_toks([a for a in arg if a not in '()'])); continue
        if tk == '^':
            arg, i = _arg(toks, i + 1)
            if arg == ['*']: out.append('star')
            elif arg == ["'"]: out.append('prime')
            elif i >= 2 and toks[i - 2 - (len(arg) > 1) * 0] and out and out[-1] == LEX['commands'].get('\\ell'): out.append(speak_toks(arg))
            else: out.append('to the ' + speak_toks(arg))
            continue
        if tk in ('{', '}'): i += 1; continue
        if tk == '(': out.append('of'); i += 1; continue
        if tk == ')': i += 1; continue
        if tk in LEX['commands']: w = LEX['commands'][tk]
        elif tk in LEX['symbols']: w = LEX['symbols'][tk]
        elif tk.startswith('\\') and tk[1:].isalpha():
            # not in the lexicon: read the name without the backslash, and say so in 'check'
            w = tk[1:]; UNKNOWN.add(tk)
        elif len(tk) == 1 and tk.isalpha(): w = LEX['letters'].get(tk.lower(), tk)
        else: w = tk
        if w == ',' and out: out[-1] += ','
        elif w: out.append(w)
        i += 1
    return ' '.join(out)


def voice_text(v):
    """replace every top-level {…} in a Voice line by its spoken form"""
    out, i = [], 0
    while i < len(v):
        if v[i] == '{':
            depth, j = 1, i + 1
            while j < len(v) and depth:
                depth += {'{': 1, '}': -1}.get(v[j], 0); j += 1
            inner = v[i + 1:j - 1]; w = speak_tex(inner)
            rest = v[j:].lstrip()
            if inner.strip() in LEX.get('pause_after', []) and rest[:1].isalpha(): w += ','
            out.append(w); i = j
        else:
            out.append(v[i]); i += 1
    return ''.join(out)


# ---------------------------------------------------------------- mechanical checks for the editor pass
_STRONG_CONNECTIVES = {
    'therefore', 'hence', 'thus', 'so', 'however', 'moreover', 'indeed',
    'precisely', 'consequently', 'instead', 'nevertheless', 'meanwhile',
    'accordingly', 'otherwise', 'specifically', 'namely', 'conversely',
    'furthermore', 'not', 'nor', 'never', 'neither', 'only',
    'поэтому', 'следовательно', 'значит', 'однако', 'именно',
    'напротив', 'наоборот', 'причём', 'лишь', 'ведь', 'не', 'ни',
    'никогда', 'только',
}
_GLUE_WORDS = {
    'a', 'an', 'the', 'of', 'in', 'on', 'at', 'to', 'by', 'as', 'is', 'are',
    'be', 'was', 'were', 'am', 'with', 'from', 'for', 'into', 'onto', 'upon',
    'over', 'that', 'this', 'these', 'those', 'which', 'and', 'or', 'if',
    'then', 'it', 'its', 'we', 'us', 'our', 'can', 'may', 'will', 'must',
    'в', 'на', 'к', 'с', 'со', 'и', 'или', 'по', 'из', 'за', 'от', 'до',
    'при', 'о', 'об', 'как', 'что', 'где', 'для', 'это', 'то', 'же', 'бы',
}


def _say_prose_words(s):
    """Extract non-math prose words from a Say string, normalizing speech substitutions."""
    s = re.sub(r'<<([^|]+?)\|[\s\S]+?>>', r'\1', s)
    s = re.sub(r'\[\[eq:[^\]]+\]\]', ' ', s)
    s = re.sub(r'\[\[([^|\]]+\|)?([^\]]+)\]\]', r'\2', s)
    s = re.sub(r'\{\{[^}]+\}\}', ' ', s)
    s = re.sub(r"\$[^$]*\$(?:-(?:th|st|nd|rd)\b|'s\b)?", ' ', s)
    s = re.sub(r'\b[A-Z][A-Za-z]{0,3}\([^)]*\)', ' ', s)
    s = s.replace('&nbsp;', ' ').replace('—', ' ').replace('–', ' ').replace('-', ' ')
    out = []
    for raw in re.findall(r"[A-Za-zА-Яа-яЁё']+", s):
        w = raw.strip("'")
        if not w: continue
        if w == 'Lie': w = 'lee'
        elif w == "Lie's": w = "lee's"
        out.append(w.lower())
    return out


def _voice_prose_words(v):
    """Extract words from a rendered Voice string after stripping pauses and cues."""
    v = v.replace('|', ' ').replace('^', ' ').replace('—', ' ').replace('–', ' ').replace('-', ' ')
    return [w.strip("'").lower() for w in re.findall(r"[A-Za-zА-Яа-яЁё']+", v) if w.strip("'")]


def voice_drift(say, voice):
    """Return Say prose words missing from Voice when a connective/negation or 2+ content words drop."""
    sw, vw = _say_prose_words(say), _voice_prose_words(voice)
    diff, vset = Counter(sw) - Counter(vw), set(vw)
    rem = []
    for w, cnt in diff.items():
        if w.isascii() and ((w.endswith('s') and w[:-1] in vset) or (w + 's' in vset)):
            continue
        rem.extend([w] * cnt)
    strong = [w for w in rem if w in _STRONG_CONNECTIVES]
    content = [w for w in rem if w not in _GLUE_WORDS and len(w) >= 3]
    if strong or len(content) >= 2:
        return list(dict.fromkeys(strong + content))
    return []


def check(S):
    """Problems a script can have regardless of wording: cue counts, unknown ids, empty steps."""
    out, live = [], set()
    voiced = S.get('voice') != 'off' and (S.get('profile') != 'card' or S.get('voice') == 'on')

    def walk(acts, where):
        for a in acts:
            op = a['op']
            if op == 'par': walk(a['actions'], where); continue
            if op in ('mark', 'erase', 'point') and a['ids'] != 'all':
                for i in a['ids']:
                    if i.split(':')[0] not in live: out.append(f'{where}: {op} of unknown id "{i}"')
                if op == 'erase': live.difference_update(a['ids'])
            elif op == 'erase': live.clear()
            if a.get('fig') and a['fig'] not in live: out.append(f'{where}: {op} of unknown figure "{a["fig"]}"')
            if a.get('after') and a['after'] not in live: out.append(f'{where}: write {a.get("id")} next to unknown id "{a["after"]}"')
            for k in ('from', 'to'):
                if isinstance(a.get(k), str) and a[k] not in live: out.append(f'{where}: {op} {a.get("id")} refers to unknown id "{a[k]}"')
            if 'id' in a: live.add(a['id'])

    for n, sl in enumerate(S['slides'], 1):
        for m, st in enumerate(sl['steps'], 1):
            where = f'{n}.{m}'
            v = st.get('voice', '').count('^')
            c = sum(1 for a in st.get('do', []) if a['op'] == 'cue')
            if v != c: out.append(f'{where}: Voice has {v} ^ but Board has {c}')
            most = 2 if S.get('profile', S.get('genre')) == 'card' else 1
            for say in [st['say']] + [v['say'] for v in st.get('sayIf', [])]:
                # a sentence ends at . ! ? followed by a capital letter or the end; so abbreviations (т. е., e.g., cf.)
                # do not end one, nor does the body of a <<label|reason>> note; a formula counts as a small letter
                bare = re.sub(r'<<([^|]+?)\|[\s\S]+?>>', r'\1', say).replace('&nbsp;', ' ')
                bare = re.sub(r'\$[^$]*\$', 'm', bare)
                if len(re.findall(r'[.!?](?=\s+[A-ZА-ЯЁ«"(]|\s*$)', bare)) > most:
                    out.append(f'{where}: more than {most} sentence(s) in Say (one step, one thought)'); break
            walk(st.get('do', []), where)
            if voiced and st.get('voice'):
                said = st['voice']
                if re.search(r'[\\{}_]|\bof \d', said.replace('^', '')):   # '^' left in a Voice is a cue
                    out.append(f'{where}: the voice will say "{said[:90]}" — write the formula so it reads aloud')
                if not st.get('sayIf') and (miss := voice_drift(st['say'], said)):
                    out.append(f'{where}: Voice drops from Say ({", ".join(miss[:6])}) — keep Say prose and connectives')
        for m, st in enumerate(sl['steps'], 1):
            w = st.get('why')
            if w and S.get('lang', 'en') == 'en' and not re.match(r'(Because|In |By |Yes|No|It |They )', w['text']):
                out.append(f'{n}.{m}: check that Why? starts with the answer ("{w["text"][:40]}…")')
    return out


if __name__ == '__main__':
    import sys
    cmd = sys.argv[1] if len(sys.argv) >= 2 else ''
    if len(sys.argv) == 3 and cmd == 'check':
        UNKNOWN.clear(); S_ = parse(open(sys.argv[2]).read()); probs = check(S_)
        if UNKNOWN and S_.get('voice') != 'off' and (S_.get('profile') != 'card' or S_.get('voice') == 'on'):
            probs.append('not in the lexicon, read by name: ' + ' '.join(sorted(UNKNOWN)) + ' (assets/lexicon.json)')
        print('\n'.join(probs) if probs else 'no mechanical problems')
    elif cmd == 'voice' and 3 <= len(sys.argv) <= 4:
        args = [a for a in sys.argv[2:] if a != '--say']
        with_say = len(args) != len(sys.argv[2:])
        if len(args) == 1:
            # what the voice will say, slide by slide (--say pairs each line with Say:); read before building
            for n, sl in enumerate(parse(open(args[0]).read())['slides'], 1):
                print(f'# {n}. {sl.get("title", "")}')
                for m, st in enumerate(sl['steps'], 1):
                    if not st.get('voice'): continue
                    spoken = st['voice'].replace('|', ' ').replace('^', ' ').replace('  ', ' ')
                    if with_say:
                        print(f'{n}.{m}  Say:   {st["say"]}')
                        print(f'      Voice: {spoken}')
                    else:
                        print(f'{n}.{m}  {spoken}')
