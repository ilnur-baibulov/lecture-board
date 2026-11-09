/* lecture-board: a blackboard explainer with two views of one text.
   Watch: the board fills the window, the transcript runs right under it.
   Read: the same text as an article, each slide with its finished board.
   A slide is a list of steps; a step is one sentence (say: shown, voice: spoken) plus the board actions it talks about.
   The player keeps a cursor (slide k, step i) and a state: ready, playing, paused, done or gap (the breath between slides).
   Any jump rebuilds the board instantly up to the target step, then plays from there. */
const Board=(function(){
const W=1600,H=1000,NS='http://www.w3.org/2000/svg';
const TOK=['chalk','dim','c1','c2','c3','c4','c5','acc','warn','grid','axis','board'];
const COL={ink:'var(--chalk)'};TOK.forEach(t=>COL[t]=`var(--${t})`);
const col=c=>COL[c]||c||COL.ink;
const KC=new Map();
const K=(t,d)=>{const k=(d?'D':'I')+t;if(!KC.has(k))KC.set(k,katex.renderToString(t,{throwOnError:false,displayMode:!!d,trust:c=>c.command==='\\htmlData',strict:false,macros:{'\\piece':'\\htmlData{piece=#1}{#2}','\\eqref':'\\htmlData{eq=#1}{(#1)}'}}));return KC.get(k)};
/* $$…$$, $…$, [[key|text]] or [[key]] → KaTeX and glossary buttons; <<label|reason>> → a label that opens the reason */
/* **bold** and *italic* in the text between formulas (a * inside $…$ stays TeX; the * of "C*-algebra" is not a marker) */
const emph=s=>s.split(/(\$\$[\s\S]+?\$\$|\$[^$]+\$)/).map((p,i)=>i%2?p:p.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/(^|[\s(])\*([^*\s](?:[^*]*?[^*\s])?)\*(?=[\s.,;:!?)]|$)/g,'$1<i>$2</i>')).join('');
const NOTES=[],noteId=b=>{let i=NOTES.indexOf(b);if(i<0){NOTES.push(b);i=NOTES.length-1}return i};
const fmt=(s,G)=>emph(s.replace(/<<([^|]+?)\|([\s\S]+?)>>/g,(m,lab,body)=>`\u0001${noteId(body)}\u0002${lab}\u0003`))
  .replace(/\$\$([\s\S]+?)\$\$/g,(m,t)=>K(t,1)).replace(/\$([^$]+)\$([.,;:!?)]?)/g,(m,t,p)=>p?`<span class="nw">${K(t)}${p}</span>`:K(t))
  .replace(/\[\[([\w-]+)(?:\|([^\]]+))?\]\]/g,(m,k,txt)=>`<button class="term" data-term="${k}">${txt||(G[k]?G[k].term:k)}</button>`)
  .replace(/\[\[eq:([\w.-]+)\]\]/g,(m,k)=>`<button class="eqref" data-eq="${k}" aria-label="Equation ${k}">(${k})</button>`)
  .replace(/\u0001(\d+)\u0002([\s\S]*?)\u0003/g,(m,i,lab)=>`<button class="term note" data-note="${i}">${lab}</button>`);
/* {{name}} → a value of the figures' state; 'Say if key=value:' → the first variant whose values all match */
const fill=(s,V)=>s.replace(/\{\{(\w+)\}\}/g,(m,k)=>k in V?String(V[k]):m);
const sayIn=(st,V)=>{const alt=(st.sayIf||[]).find(a=>Object.entries(a.when).every(([k,v])=>String(V[k])===v));return fill(alt?alt.say:st.say,V)};
const ICON_PLAY='<svg viewBox="0 0 16 16" width="0.9em" height="0.9em"><path d="M4 2.5v11l9-5.5z" fill="currentColor"/></svg>';
const ICON_RE='<svg viewBox="0 0 16 16" width="0.95em" height="0.95em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M13 8a5 5 0 1 1-1.6-3.7"/><path d="M11.8 1.6v3h-3" stroke-linejoin="round"/></svg>';
const para=s=>s.split(/\n\s*\n/).map(p=>'<p>'+p+'</p>').join('');
const el=(tag,attrs,parent)=>{const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e};
let NB=0;
const boardHTML=()=>{const m='ah'+(NB++);return `<svg viewBox="0 0 ${W} ${H}" data-m="${m}"><defs><marker id="${m}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs><g class="g"></g></svg><div class="ink"></div>`};

/* interface strings; keys rows: [key, action, voice-only] */
const LANG={
  en:{watch:'Watch',read:'Read',play:'Play',transcript:'Text',settings:'Settings',why:'why',caution:'caution',clickToRead:'click to read',
    tPrevSlide:'previous slide (Shift+←)',tPrevStep:'previous step (←)',tNextStep:'next step (→)',tNextSlide:'next slide (Shift+→)',tList:'contents (G)',zIn:'zoom in',zOut:'zoom out',zHome:'original view',
    tSpeed:'speed ([ and ])',tAuto:'autoplay: steps follow by themselves (P)',auto:'auto',tTx:'text: the transcript beside the board (T)',tFs:'full screen (F)',tPlay:'play (Space)',tPause:'pause (Space)',close:'close (Esc)',
    gDisplay:'Display',sSpeed:'Animation speed',sTx:'Text size',sInk:'Board text',sCap:'Captions size',sBoard:'Board size',sPage:'Page',sBoardC:'Board',dark:'dark',light:'light',
    sCapPos:'Captions',above:'above the drawing',below:'below the drawing',off:'off',sNotes:'Definitions and Why?',sNotesCard:'Definitions and notes',nWord:'next to the word',nSide:'top of the transcript',nSideCard:'top of the text',
    gSlides:'Slides',sNext:'Next slide',nAuto:'starts by itself',nWait:'waits for me',sStepGap:'Pause between steps',sGap:'Pause between slides',gKeys:'Keys',reset:'Reset',
    keys:[['Space','play / pause'],['← →','previous / next step'],['E',"show the current slide's finished board"],['h l','previous / next step; <kbd>k j</kbd> — previous / next slide'],
      ['Shift+← →','previous / next slide'],['R','replay the step'],['P','autoplay on / off'],['[ ]','slower / faster'],['V','voice on / off',1],['?','open the Why?'],['!','open the Caution'],
      ['T','text (transcript) on / off'],['A','read view (article)'],['D','page and board: dark / light'],['F','full screen'],['S or ⌘ ,','settings'],['G','contents; in it ↑ ↓ choose, ← → previous / next part, Enter play, Esc close'],['Esc','close']],
    keysNote:'Click a sentence to play from it; underlined words open definitions.',
    cardKeys:[['← →','previous / next step'],['Space','show motion / pause'],['R','replay motion'],['Shift+← →','previous / next card'],['[ ]','slower / faster animation'],
      ['D','dark / light'],['F','full screen'],['S or ⌘ ,','settings'],['G','contents'],['Esc','close']],
    cardKeysNote:'Click a past step to return to its picture; underlined words open definitions and notes.',
    slide:'Slide',spacePlay:'Space: play',nextS:'Next: slide',inS:n=>`in ${n} s · Space: stay`,endT:'End of the talk.',
    counter:(k,N,i,n,p,P)=>(P?`part ${p}/${P} · `:'')+`slide ${k}/${N} · ${i}/${n}`,goSlide:'go to this slide',
    whyT:'Why: ',cautionT:'Caution: ',sQ:'Questions',qAsk:'ask',qShow:'show the answers',replayMotion:'Replay motion',check:'Check',clickHow:'Click the answer on the picture.',reveal:'Show the answer',right:'Right.',wrong:'Not quite.',answerT:'Answer: ',needAnswer:'Answer, show the answer, or skip.',skip:'Skip',skipped:'Skipped.',retry:'Try again',hint:'Hint',continueQ:'Continue',fullSlide:'Show all',playNext:'Play next slide',part:'Part',step:'step',stage:'stage',card:'Card',show:'show the motion (Space)',again:'again (R)'},
  /* Russian: the interface of a card page with lang: ru (a talk keeps the English interface) */
  ru:{watch:'Смотреть',read:'Читать',play:'Начать',transcript:'Текст',settings:'Настройки',why:'почему',caution:'осторожно',clickToRead:'щёлкните, чтобы прочесть',
    zIn:'крупнее',zOut:'мельче',zHome:'исходный вид',tPrevSlide:'предыдущая карточка (Shift+←)',tPrevStep:'предыдущий шаг (←)',tNextStep:'следующий шаг (→)',tNextSlide:'следующая карточка (Shift+→)',tList:'оглавление (G)',
    tSpeed:'скорость ([ и ])',tAuto:'шаги идут сами (P)',auto:'сами',tTx:'текст рядом с рисунком (T)',tFs:'во весь экран (F)',tPlay:'показать (пробел)',tPause:'пауза (пробел)',close:'закрыть (Esc)',
    gDisplay:'Вид',sSpeed:'Скорость движения',sTx:'Размер текста',sInk:'Подписи на рисунке',sCap:'Размер субтитров',sBoard:'Размер рисунка',sPage:'Страница',sBoardC:'Рисунок',dark:'тёмная',light:'светлая',darkB:'тёмный',lightB:'светлый',
    sCapPos:'Субтитры',above:'над рисунком',below:'под рисунком',off:'нет',sNotes:'Определения и пояснения',nWord:'рядом со словом',nSide:'над текстом',
    gSlides:'Карточки',sNext:'Следующая карточка',nAuto:'начинается сама',nWait:'ждёт меня',sStepGap:'Пауза между шагами',sGap:'Пауза между карточками',gKeys:'Клавиши',reset:'Сбросить',
    keys:[['← →','предыдущий / следующий шаг'],['Пробел','показать движение / пауза'],['R','показать движение ещё раз'],['Shift+← →','предыдущая / следующая карточка'],['[ ]','медленнее / быстрее'],
      ['D','тёмная / светлая'],['F','во весь экран'],['S','настройки'],['G','оглавление'],['Esc','закрыть']],
    keysNote:'Щелчок по прошлому шагу возвращает его рисунок; подчёркнутые слова открывают определения и пояснения.',
    slide:'Карточка',spacePlay:'Пробел: начать',nextS:'Дальше: слайд',inS:n=>`через ${n} с · Пробел: остаться`,endT:'Конец доклада.',
    counter:(k,N,i,n)=>`${k}/${N} · ${i}/${n}`,goSlide:'перейти к карточке',
    whyT:'Почему: ',cautionT:'Осторожно: ',sQ:'Вопросы',qAsk:'задавать',qShow:'сразу с ответом',replayMotion:'Повторить движение',check:'Проверить',clickHow:'Щёлкните по ответу на рисунке.',reveal:'Показать ответ',right:'Верно.',wrong:'Неверно.',answerT:'Ответ: ',needAnswer:'Ответьте, откройте ответ или пропустите вопрос.',skip:'Пропустить',skipped:'Пропущено.',retry:'Попробовать снова',hint:'Подсказка',continueQ:'Продолжить',part:'Часть',step:'шаг',stage:'этап',card:'Карточка',show:'показать движение (пробел)',again:'ещё раз (R)'}};
/* figures drawn by a script of their own (level 4 of board figures): Board.figure(kind, {init, draw(g, s)}) */
/* ZV: the zoom of each zoomable figure, {z, x, y} (the scale and the top left corner of the view in figure units), kept across steps */
const FIGS={},FIGLIVE=new Set(),ZV={};let QHIT=()=>{},QON=()=>false;

function mount(S){
  const G=S.glossary||{},EQ=Object.create(null);
  S.slides.forEach((sl,k)=>sl.steps.forEach(st=>(st.do||[]).forEach(function collect(a){
    if(a.equation)(EQ[a.equation]||(EQ[a.equation]={k,tex:[]})).tex.push(a.tex);
    (a.actions||[]).forEach(collect);
  })));
  function equationLinks(root){root.querySelectorAll('[data-eq]').forEach(e=>{
    if(!EQ[e.dataset.eq])return;
    e.classList.add('eqref');e.setAttribute('role','button');e.tabIndex=0;
    e.setAttribute('aria-label','Equation '+e.dataset.eq);e.title='Preview equation '+e.dataset.eq;
  })}
  /* interface language (lang: in the script) and an explainer without voice (voice: off), read at the pace of the captions */
  /* profile: card — a page of cards for students: no voice unless 'voice: on', the student steps, a motion waits for ▶,
     the text of the card stands beside the picture, the interface follows lang:, light by default */
  const CARD=(S.profile||S.genre)==='card';
  const L=Object.assign({},LANG.en,CARD?LANG[S.lang]||{}:{});if(CARD)L.slide=L.card;
  const NOVOICE=S.voice==='off'||(CARD&&S.voice!=='on');
  const keyList=CARD?(L.cardKeys||L.keys):L.keys,keyNote=CARD?(L.cardKeysNote||L.keysNote):L.keysNote;
  const keyRows=keyList.filter(r=>!(NOVOICE&&r[2])).map(r=>`<div><kbd>${r[0]}</kbd> — ${r[1]}</div>`).join('');
  document.title=S.title.replace(/\$([^$]*)\$/g,(m,t)=>t.replace(/\\[a-zA-Z]+/g,'').replace(/[{}]/g,''));document.documentElement.lang=S.lang||'en';document.documentElement.dataset.profile=CARD?'card':'talk';
  const PARTS=[],PI=S.slides.map((b,k)=>{if((b.part||b.section)&&(!k||b.part!==S.slides[k-1].part||b.section!==S.slides[k-1].section))PARTS.push(b.part||b.section);return Math.max(0,PARTS.length-1)});
  /* a card's number: part.place in the part, or its place on a page without parts */
  const cnum=k=>PARTS.length?`${PI[k]+1}.${k-PI.indexOf(PI[k])+1}`:`${k+1}`;
  const app=document.getElementById('app');
  const gear=`<button class="set" title="${L.settings} (S)" aria-label="${L.settings}" aria-controls="settings" aria-expanded="false">⚙︎</button>`;
  app.innerHTML=`${CARD?`<header class="top"><div><h1${S.subtitle?' class="hs" title="show / hide the subtitle"':''}>${fmt(S.title,G)}</h1><p hidden>${fmt(S.subtitle||'',G)}</p></div>${PARTS.length>1?`<nav class="views ptabs">${PARTS.map((p,j)=>`<button data-p="${j}">${fmt(p,G)}</button>`).join('')}</nav>`:''}</header>`:''}
  <section class="watch"><div class="cols">${CARD?'':`<div class="talk-tools"><nav class="views" aria-label="View"><button data-v="watch" class="on" aria-pressed="true">${L.watch}</button><button data-v="read" aria-pressed="false">${L.read}</button></nav>${gear}</div>`}<div class="col">
    ${CARD?'<div class="crow"></div>':''}<button class="stt" title="${L.tList}"></button><div class="screen"><div class="board main">${boardHTML()}<button class="go">▶︎&nbsp; ${L.play}</button><div class="blank" hidden></div><div class="bnote" hidden></div><div class="signs"><button class="sign caution" data-kind="caution" hidden><span>!</span></button><button class="sign why" data-kind="why" hidden><span>?</span></button></div></div><div class="cap"><div class="capt"></div><div class="qpanel" hidden role="region" aria-label="Question"></div></div></div>
    <div class="ctl"><button class="pb" title="${L.tPrevSlide}">⏮</button><button class="ps" title="${L.tPrevStep}">‹</button><button class="pp"></button><button class="ns" title="${L.tNextStep}">›</button><button class="nb" title="${L.tNextSlide}">⏭</button>
      <button class="finish" title="Show full slide (E)" aria-label="Show full slide (E)"${CARD?' hidden':''}>${L.fullSlide}</button><div class="dots"></div><button class="cnt" title="${L.tList}" hidden></button><button class="spd" title="${L.tSpeed}"${CARD?' hidden':''}></button><button class="auto" title="${L.tAuto}"${CARD?' hidden':''}><i class="sw"></i>${L.auto}</button><button class="vox" title="voice on/off (V)"${NOVOICE?' hidden':''}></button><button class="txb" title="${L.tTx}"${CARD?' hidden':''}>${L.transcript}</button>${CARD?gear:''}<button class="fs" title="${L.tFs}">⛶</button></div>
  </div><aside class="side"><div class="sbar"></div><div class="legend" hidden><span class="lg why" hidden><i class="ic why">?</i> ${L.why}</span><span class="lg caution" hidden><i class="ic caution">!</i> ${L.caution}</span><span class="lgt"> · ${L.clickToRead}</span></div><div class="card" hidden><button class="x" title="${L.close}">×</button><div class="cb"></div></div><div class="tx"><div class="txi"></div></div></aside></div></section>
  <section class="read" hidden><div class="article"></div></section>
  <aside class="setp" id="settings" hidden><button class="x sx" title="${L.close}">×</button><b>${L.settings}</b>
      ${CARD?'':`<div class="seg set-quick" hidden><button class="set-play">${L.play}</button><button class="set-toc">Contents</button><button class="set-view">${L.read}</button><button class="set-fs">Full screen</button></div>
      <div class="opt"><span>Controls</span><select class="control-mode" id="control-mode" aria-label="Controls"><option value="auto">Auto-hide in full screen</option><option value="always">Always show</option><option value="hidden">Hidden</option></select></div>`}
      <div class="grp">${L.gDisplay}</div>
      <label${CARD?'':' hidden'}>${L.sSpeed}<input type="range" min="0.75" max="2" step="0.25" data-k="speed"><output></output></label>
      <label>${L.sTx}<input type="range" min="14" max="24" step="1" data-k="tx"><output></output></label>
      <label>${L.sInk}<input type="range" min="80" max="125" step="5" data-k="ink"><output></output></label>
      <label${CARD?' hidden':''}>${L.sCap}<input type="range" min="80" max="140" step="5" data-k="capk"><output></output></label>
      <label>${L.sBoard}<input type="range" min="60" max="100" step="5" data-k="bscale"><output></output></label>
      <div class="opt"><span>${L.sPage}</span><span class="seg" data-k="page"><button data-v="dark">${L.dark}</button><button data-v="light">${L.light}</button></span></div>
      <div class="opt"><span>${L.sBoardC}</span><span class="seg" data-k="board"><button data-v="dark">${L.darkB||L.dark}</button><button data-v="light">${L.lightB||L.light}</button></span></div>
      <div class="opt"${CARD?' hidden':''}><span>${L.sCapPos}</span><span class="seg" data-k="cap"><button data-v="above">${L.above}</button><button data-v="below">${L.below}</button><button data-v="off">${L.off}</button></span></div>
      <div class="opt"><span>${L.sQ}</span><span class="seg" data-k="ask"><button data-v="on">${L.qAsk}</button><button data-v="off">${L.qShow}</button><button data-v="hide">${L.off}</button></span></div>
      <div class="opt"><span>${CARD&&L.sNotesCard?L.sNotesCard:L.sNotes}</span><span class="seg" data-k="notes"><button data-v="word">${L.nWord}</button><button data-v="side">${CARD&&L.nSideCard?L.nSideCard:L.nSide}</button></span></div>
      <div class="vgrp"${NOVOICE?' hidden':''}><div class="grp">Voice</div>
      <div class="opt"><span>Voice</span><select class="vsel"></select></div>
      <label>Short pause in speech<input type="range" min="0" max="1" step="0.05" data-k="pshort"><output></output></label>
      <label>Long pause in speech<input type="range" min="0" max="2" step="0.05" data-k="plong"><output></output></label></div>
      <div class="sgrp"${CARD?' hidden':''}><div class="grp">${L.gSlides}</div>
      <div class="opt"><span>${L.sNext}</span><span class="seg" data-k="autonext"><button data-v="auto">${L.nAuto}</button><button data-v="wait">${L.nWait}</button></span></div>
      <label>${L.sStepGap}<input type="range" min="0" max="3" step="0.1" data-k="stepgap"><output></output></label>
      <div class="gaprow"><label>${L.sGap}<input type="range" min="2" max="10" step="1" data-k="gap"><output></output></label></div></div>
      <b>${L.gKeys}</b>
      <div class="keys">${keyRows}<div>${keyNote}</div></div>
      <button class="reset">${L.reset}</button>
    </aside>`;

  const $=s=>app.querySelector(s);
  /* the subtitle is hidden; a click on the title shows it, leaving room for the slide title */
  if(CARD&&S.subtitle)$('.top h1').onclick=()=>{const q=$('.top p');q.hidden=!q.hidden;$('.top h1').classList.toggle('open',!q.hidden)};
  const tx=$('.tx'),txi=$('.txi'),dots=$('.dots'),cnt=$('.cnt'),card=$('.card'),cb=$('.cb'),cap=$('.cap'),capt=$('.capt'),side=$('.side'),screen=$('.screen'),sbar=$('.sbar');
  /* the side column is as tall as the board with its captions */
  new ResizeObserver(()=>{side.style.height=window.innerWidth>900?screen.offsetHeight+'px':'';scrollCur('auto');outs()}).observe(screen);
  sbar.ondblclick=()=>{SET.sidew=360;applySet()};
  sbar.onpointerdown=e=>{if(e.button)return;e.preventDefault();sbar.setPointerCapture(e.pointerId);sbar.classList.add('drag');
    const x0=e.clientX,w0=side.getBoundingClientRect().width;
    sbar.onpointermove=m=>{SET.sidew=Math.round(Math.max(240,Math.min(window.innerWidth-440,w0+x0-m.clientX)));applySet()};
    sbar.onpointerup=sbar.onpointercancel=()=>{sbar.classList.remove('drag');sbar.onpointermove=null}};
  const N=S.slides.length,allSteps=S.slides.map(sl=>sl.steps||[]);
  /* Keep Ask board actions in their original order without creating a question stop. */
  const quietSteps=allSteps.map(ss=>{
    let pending=[];
    const visible=[];
    ss.forEach((st,source)=>{
      if(st.q){
        pending.push(...(st.do||[]).filter(a=>a.op!=='cue').map(a=>({...a,instant:true})));
      }else{
        visible.push({...st,source,do:[...pending,...(st.do||[])]});
        pending=[];
      }
    });
    if(!visible.length)return [{say:'',source:0,do:pending}];
    visible.at(-1).do.push(...pending);
    return visible;
  });
  const steps=k=>SET.ask==='hide'?quietSteps[k]:allSteps[k];
  const sourceAt=(k,i)=>steps(k)[i]?.source??i;
  const visibleAt=(k,i)=>SET.ask==='hide'?steps(k).findIndex(st=>st.source>=i):i;
  const stitle=k=>`${k+1}${S.slides[k].title?' · '+S.slides[k].title:''}`;
  /* a tooltip cannot hold TeX: the title in plain letters */
  const plainTitle=t=>t.replace(/\$/g,'').replace(/\\(sigma|tau|alpha|beta)/g,(m,g)=>({sigma:'σ',tau:'τ',alpha:'α',beta:'β'})[g]).replace(/[{}\\]/g,'');
  /* parts: PI[k] is the number of the part of slide k (consecutive slides with the same part) */
  dots.innerHTML=S.slides.map((b,k)=>`<i title="${plainTitle(stitle(k))} — show full slide"></i>`).join('');
  let pre=false,wipe=false,nxt=false,drawing=false,sttK=-1,started=false,gapLeft=0,K0=0,I0=0,state='ready',token=0,paused=false,speed=1,view='watch';
  const SPEEDS=[.75,1,1.25,1.5,1.75,2];try{const v=+localStorage.getItem('mb-speed');if(SPEEDS.includes(v))speed=v}catch(e){}
  /* ---------- viewer settings, kept in this browser ---------- */
  const DEF={controls:'auto',ask:'on',tx:18,ink:100,capk:100,bscale:100,sidew:360,cap:'below',notes:'word',gap:5,stepgap:0.3,pshort:0.2,plong:0.4,autonext:'auto',wipe:0.6,voice:'',transcript:false,page:'dark',board:'dark'};
  if(CARD)Object.assign(DEF,{cap:'off',transcript:true,autonext:'wait',page:'light',board:'light'});
  const SKEY='mb-settings'+(CARD?'-card':'');
  const SET={...DEF};try{
    const {header,hideControls,...saved}=JSON.parse(localStorage.getItem(SKEY)||'{}');
    if(hideControls===false)SET.controls='always';
    Object.assign(SET,saved);
  }catch(e){}
  if(CARD)Object.assign(SET,{cap:'off',transcript:true,autonext:'wait'});
  /* board text and captions scale with the board; show what a percentage means in pixels now */
  const PX={ink:.029,capk:.0242};
  function outs(){const w=$('.screen').offsetWidth;
    app.querySelectorAll('.setp input[type=range]').forEach(i=>{const k=i.dataset.k,v=k==='speed'?speed:SET[k];i.value=v;
      i.nextElementSibling.textContent=k==='speed'?v+'×':k==='tx'?v+' px':k==='gap'?v+' s':k==='stepgap'?(+v).toFixed(1)+' s':(k==='pshort'||k==='plong')?(+v).toFixed(2)+' s':PX[k]?`${v} % · ${Math.round(w*PX[k]*v/100)} px`:v+' %'})}
  function applySet(){const r=document.documentElement.style;
    document.documentElement.dataset.page=SET.page;document.documentElement.dataset.board=SET.board;
    r.setProperty('--tx',SET.tx+'px');r.setProperty('--inkk',SET.ink/100);r.setProperty('--capk',SET.capk/100);r.setProperty('--bscale',SET.bscale/100);r.setProperty('--sidew',(SET.sidew||360)+'px');
    if(!CARD){
      const hidden=SET.controls==='hidden';
      document.documentElement.dataset.controls=SET.controls;
      controlMode.value=SET.controls;
      tools.querySelector('.views').hidden=hidden;
      $('.stt').disabled=hidden;
      $('.set-quick').hidden=!hidden;
    }
    const capWidth=CARD?13.8:11;
    r.setProperty('--cap-height',capWidth+'cqw');
    r.setProperty('--capfrac',SET.cap==='off'?'.625':(.625+capWidth*SET.capk/10000).toFixed(4));
    $('.screen').dataset.cap=SET.cap;
    $('.gaprow').hidden=SET.autonext!=='auto'||CARD;
    outs();
    app.querySelectorAll('.setp .seg[data-k]').forEach(g=>g.querySelectorAll('button').forEach(b=>b.classList.toggle('on',SET[g.dataset.k]===b.dataset.v)));
    updateControls();
    try{localStorage.setItem(SKEY,JSON.stringify(SET))}catch(e){}
    FIGLIVE.forEach(f=>f())}
  app.querySelectorAll('.setp input[type=range]').forEach(i=>i.oninput=()=>{if(i.dataset.k==='speed'){speed=+i.value;act.speed(0);return}SET[i.dataset.k]=+i.value;applySet()});
  function changeSettings(values){
    const previous=SET.ask,source=sourceAt(K0,I0);
    Object.assign(SET,values);applySet();
    if(previous!==SET.ask)questionModeChanged(previous,source)
  }
  app.querySelectorAll('.setp .seg[data-k]').forEach(g=>g.onclick=e=>{const b=e.target.closest('button');if(b)changeSettings({[g.dataset.k]:b.dataset.v})});
  app.querySelector('.setp .reset').onclick=()=>{speed=1;try{localStorage.removeItem('mb-speed');localStorage.removeItem(AKEY)}catch(e){}changeSettings(DEF);act.speed(0);setAuto(!NOVOICE&&!CARD)};
  const setp=$('.setp'),settingsButton=$('.set'),controlMode=$('.control-mode'),tools=$('.talk-tools');
  const cols=$('.cols'),controls=$('.ctl'),question=$('.qpanel');
  let controlsTimer;
  function updateControls(wake=false){
    const canHide=view==='watch'&&document.fullscreenElement===app&&SET.controls==='auto'&&
      (state==='playing'||state==='gap')&&setp.hidden&&question.hidden;
    if(wake||!canHide){
      clearTimeout(controlsTimer);controlsTimer=undefined;
      controls.classList.remove('idle');
      if(tools)tools.classList.remove('idle');
    }
    if(canHide&&controlsTimer===undefined&&!controls.classList.contains('idle')){
      controlsTimer=setTimeout(()=>{
        controlsTimer=undefined;
        controls.classList.add('idle');
        if(tools)tools.classList.add('idle');
      },2500);
    }
  }
  if(controlMode)controlMode.onchange=()=>changeSettings({controls:controlMode.value});
  function toggleSet(v){
    setp.hidden=v==null?!setp.hidden:!v;
    settingsButton.setAttribute('aria-expanded',!setp.hidden);
    if(!setp.hidden)(document.fullscreenElement||app).appendChild(setp);
    updateControls();
  }
  /* a click outside the drawer closes it */
  document.addEventListener('pointerdown',e=>{if(!setp.hidden&&!setp.contains(e.target)&&!e.target.closest('.set'))toggleSet(false)},true);
  settingsButton.onclick=()=>toggleSet();app.querySelector('.sx').onclick=()=>{toggleSet(false);settingsButton.focus()};
  applySet();

  /* ---------- pausable clock ---------- */
  const vsleep=(ms,tk)=>new Promise(res=>{let left=ms,last=performance.now();
    const tick=()=>{const now=performance.now();if(!paused)left-=(now-last)*speed;last=now;
      if(tk!=null&&tk!==token)return res(false);if(left<=0)return res(true);setTimeout(tick,Math.min(50,Math.max(5,left)))};tick()});
  const later=(ms,f)=>{vsleep(ms).then(f)};
  const tune=a=>{a.playbackRate=speed;if(paused){a.pause();a._mb=1}return a};

  /* ---------- a drawing surface: one board ---------- */
  function Surface(box){
    const svg=box.querySelector('svg'),g=box.querySelector('.g'),ink=box.querySelector('.ink'),mk=`url(#${svg.dataset.m})`,obj=new Map();
    const put=(id,o)=>{if(id){const old=obj.get(id);if(old)old.remove();obj.set(id,o)}return o};
    const anim=(e,kf,dur,inst)=>{if(inst||!dur)return;tune(e.animate(kf,{duration:dur,easing:'ease-in-out',fill:'backwards'}))};
    const drawIn=(p,dur,inst)=>{if(inst||!dur)return;p.setAttribute('pathLength','1');
      tune(p.animate([{strokeDasharray:'1 1',strokeDashoffset:1},{strokeDasharray:'1 1',strokeDashoffset:0}],{duration:dur,easing:'ease-in-out'}))};
    function tex(a,inst){const d=document.createElement('div');d.className='t'+(a.anchor?' '+a.anchor:'');
      /* 'after': start right after another board text, on its line */
      let x=a.x,y=a.y;if(a.after){const r=obj.get(a.after);if(r&&r.el[0]){const e=r.el[0],bw=box.clientWidth||1;x=(e.offsetLeft+e.offsetWidth)/bw*W+90;y=r.y}}
      d.style.left=x/W*100+'%';d.style.top=y/H*100+'%';d.style.color=col(a.color);if(a.size)d.style.fontSize=a.size+'em';
      d.innerHTML=a.html?fmt(a.html,G):K(a.tex,a.display);if(a.term)d.dataset.term=a.term;ink.appendChild(d);equationLinks(d);
      if(a.anim==='fade')anim(d,[{opacity:0},{opacity:1}],a.dur??500,inst);
      else anim(d,[{clipPath:'inset(-20% 100% -20% 0)'},{clipPath:'inset(-20% 0% -20% 0)'}],a.dur??900,inst);
      return {y,el:[d],remove:()=>d.remove(),recolor:c=>d.style.color=col(c)}}
    function path(a,inst){const p=el('path',{d:a.d,fill:'none','stroke-width':a.width||3,'stroke-linecap':'round'},g);p.style.stroke=col(a.color);
      if(a.dash)p.setAttribute('stroke-dasharray',a.dash);
      if(a.dash)anim(p,[{opacity:0},{opacity:1}],a.dur??500,inst);else drawIn(p,a.dur??700,inst);
      if(a.arrow){if(inst||!(a.dur??700))p.setAttribute('marker-end',mk);else later(a.dur??700,()=>p.setAttribute('marker-end',mk))}
      return {el:[p],remove:()=>p.remove(),recolor:c=>p.style.stroke=col(c)}}
    function node(a,inst){const r=a.r||34;const c=el('circle',{cx:a.x,cy:a.y,r,'stroke-width':3},g);c.style.fill='var(--board)';c.style.stroke=col(a.color);
      drawIn(c,a.dur??500,inst);const t=a.label?tex({x:a.x,y:a.y,tex:a.label,anchor:'c',color:a.color,anim:'fade',dur:a.dur??500,size:a.lsize},inst):null;
      return {x:a.x,y:a.y,r,el:[c].concat(t?t.el:[]),remove:()=>{c.remove();t&&t.remove()},recolor:cc=>{c.style.stroke=col(cc);t&&t.recolor(cc)},
        fill:on=>c.style.fill=on?'color-mix(in srgb,'+col(a.color)+' 22%,var(--board))':'var(--board)'}}
    const trim=(A,B,ra,rb)=>{const dx=B.x-A.x,dy=B.y-A.y,L=Math.hypot(dx,dy);return [A.x+dx/L*ra,A.y+dy/L*ra,B.x-dx/L*rb,B.y-dy/L*rb]};
    const at=id=>{const o=obj.get(id);return o&&o.x!=null?o:(typeof id==='object'?Object.assign({r:0},id):null)};
    function edge(a,inst){const A=at(a.from),B=at(a.to);const [x1,y1,x2,y2]=trim(A,B,A.r+4,B.r+4);
      return path(Object.assign({},a,{d:`M${x1},${y1} L${x2},${y2}`,width:a.width||2.5,color:a.color||'dim'}),inst)}
    function arc(a,inst){const A=at(a.from),B=at(a.to),dp=a.depth??90,sgn=a.up?-1:1;
      const y0=sgn>0?Math.max(A.y,B.y):Math.min(A.y,B.y);
      const x1=A.x,y1=A.y+sgn*(A.r+4),x2=B.x,y2=B.y+sgn*(B.r+4),cx=(x1+x2)/2,cy=y0+sgn*(A.r+dp);
      const p=path(Object.assign({},a,{d:`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`,arrow:a.arrow!==false}),inst);
      if(a.label){const t=tex({x:cx,y:(y1+2*cy+y2)/4+sgn*34,tex:a.label,anchor:'c',color:a.color,anim:'fade',dur:400},inst);
        return {el:p.el.concat(t.el),remove:()=>{p.remove();t.remove()},recolor:c=>{p.recolor(c);t.recolor(c)}}}
      return p}
    function box_(a,inst){const p=el('rect',{x:a.x,y:a.y,width:a.w,height:a.h,rx:10,fill:'none','stroke-width':2.5},g);p.style.stroke=col(a.color);
      drawIn(p,a.dur??600,inst);return {el:[p],remove:()=>p.remove(),recolor:c=>p.style.stroke=col(c)}}
    /* the pointer: a dot that glides under each target in turn, with a brief ring around it;
       'ID:name' targets the part \piece{name}{…} of the formula ID */
    function sub(id){const [b,n]=id.split(':'),o=obj.get(b);if(!o||n==null)return o;
      const e=o.el[0].querySelector(`[data-piece="${n}"]`);return e?{el:[e],recolor:c=>e.style.color=col(c)}:null}
    let ptr=null;
    function rectOf(o){const B=box.getBoundingClientRect(),bw=B.width||1,bh=B.height||1;
      if(o.r!=null&&o.x!=null)return {l:(o.x-o.r)/W,t:(o.y-o.r)/H,w:2*o.r/W,h:2*o.r/H,round:true};
      const r=o.el[0].getBoundingClientRect();return {l:(r.left-B.left)/bw,t:(r.top-B.top)/bh,w:r.width/bw,h:r.height/bh}}
    async function point(a,tk){
      if(!ptr||!ptr.isConnected){ptr=document.createElement('div');ptr.className='ptr';ink.appendChild(ptr)}
      for(const id of a.ids){const o=sub(id);if(!o)continue;const R=rectOf(o);
        const to={left:(R.l+R.w/2)*100+'%',top:(R.t+R.h)*100+1.2+'%'};
        tune(ptr.animate([{left:ptr.style.left||to.left,top:ptr.style.top||to.top,opacity:1},{...to,opacity:1}],{duration:350,easing:'ease-in-out',fill:'forwards'}));
        ptr.style.left=to.left;ptr.style.top=to.top;
        const ring=document.createElement('div');ring.className='ring'+(R.round?' round':'');const pad=.012;
        Object.assign(ring.style,{left:(R.l-pad)*100+'%',top:(R.t-pad*1.6)*100+'%',width:(R.w+2*pad)*100+'%',height:(R.h+3.2*pad)*100+'%'});ink.appendChild(ring);
        tune(ring.animate([{opacity:0},{opacity:1,offset:.25},{opacity:1,offset:.6},{opacity:0}],{duration:a.dur??900,fill:'forwards'})).onfinish=()=>ring.remove();
        if(!(await vsleep(a.dur??900,tk)))return}
      const p=ptr;later(900,()=>{if(p.isConnected)tune(p.animate([{opacity:1},{opacity:0}],{duration:400,fill:'forwards'}))})}
    /* a figure: a canvas region of the board drawn by its kind's draw(g, s) from a state s;
       'set' changes the state at once, 'play' moves its numbers to new values over a duration (pausable, follows the speed) */
    function figure(a,inst){const F=FIGS[a.kind];if(!F)throw new Error('no figure kind '+a.kind);
      const d=document.createElement('div');d.className='fig';Object.assign(d.style,{left:a.x/W*100+'%',top:a.y/H*100+'%',width:a.w/W*100+'%',height:a.h/H*100+'%'});
      const cv=document.createElement('canvas'),lb=document.createElement('div');lb.className='fl';d.append(cv,lb);ink.appendChild(d);
      const isInspect=c=>!!(c.inspect??F.inspect),inspectKeys=new Set((F.controls||[]).filter(isInspect).map(c=>c.key));
      const s={...F.init,...a.set},c2=cv.getContext('2d');
      for(const k in UP)if(k in s&&!F.inspect&&!inspectKeys.has(k))s[k]=UP[k];
      /* the kind draws in its own units (size: [w, h]) or in the units of the place it was given */
      const U=F.size?{w:F.size[0],h:F.size[1]}:{w:a.w,h:a.h};
      const zv=()=>F.zoom?ZV[a.id]||(ZV[a.id]={z:1,x:0,y:0}):{z:1,x:0,y:0};
      /* a pointer position in figure units, through the zoom */
      const unit=e=>{const r=d.getBoundingClientRect(),V=zv();return [V.x+(e.clientX-r.left)/r.width*U.w/V.z,V.y+(e.clientY-r.top)/r.height*U.h/V.z]};
      /* controls: buttons and sliders inside the figure; the viewer's choice (UP) outlives jumps, until the script sets that key itself */
      const ctl=document.createElement('div');ctl.className='fc';d.appendChild(ctl);
      // Inspection overrides the drawing only. Playback retains the authored frame.
      let inspection={},replayFrame=0,busy=false;
      const stopReplay=()=>{cancelAnimationFrame(replayFrame);replayFrame=0};
      const inspect=(key,value)=>{inspection[key]=value;draw()};
      const startInspection=()=>{stopReplay();if(box.classList.contains('main'))pauseForFigure()};
      const resetInspection=()=>{if(!Object.keys(inspection).length)return;stopReplay();inspection={};draw()};
      const setBusy=b=>{if(busy!==b){busy=b;draw()}};
      const CT=(F.controls||[]).map(c=>{const w=document.createElement('span');w.className='fcc';ctl.appendChild(w);
        const ic=isInspect(c);
        const pick=v=>{
          if(ic){startInspection();inspect(c.key,v)}
          else{resetInspection();s[c.key]=v;UP[c.key]=v;FIGLIVE.forEach(f=>f());chosen()}
        };
        /* a slider gets about 0.12em per value, between 6em and 16em, so a slow drag moves one value at a time */
        if(c.type==='range'){const nv=(c.max-c.min)/(c.step||1);w.innerHTML=`<span class="fcl">${K(c.label||c.key)}</span><input type="range" min="${c.min}" max="${c.max}" step="${c.step||1}" style="width:${Math.min(16,Math.max(6,nv*.12)).toFixed(1)}em"><output></output>`;
          if(c.readoutWidth){w.style.height='1.6em';w.querySelector('output').style.width=c.readoutWidth+'em'}
          const inp=w.querySelector('input');inp.setAttribute('aria-label',c.name||c.key);
          inp.oninput=()=>pick(+inp.value);
          if(!ic)inp.onchange=()=>inp.blur();
          if(ic&&c.replay){
            const b=document.createElement('button');b.className='freplay';b.type='button';
            b.title=L.replayMotion;
            b.setAttribute('aria-label',L.replayMotion+(c.name?' · '+c.name:''));
            b.innerHTML=ICON_RE;w.appendChild(b);
            b.onclick=()=>{
              startInspection();inspect(c.key,c.min);
              let elapsed=0,last=performance.now();
              const frame=now=>{
                elapsed+=(now-last)*speed;last=now;
                const f=Math.min(1,elapsed/c.replay);
                inspect(c.key,c.min+f*(c.max-c.min));
                replayFrame=f<1?requestAnimationFrame(frame):0;
              };
              replayFrame=requestAnimationFrame(frame);
            };
          }
        }
        else{w.innerHTML=c.values.map(v=>`<button data-v="${v}">${K(c.tex?c.tex(v):String(v))}</button>`).join('');
          w.onclick=e=>{const b=e.target.closest('button');if(b){pick(+b.dataset.v);b.blur()}}}
        return {c,w,ic}});
      const syncCtl=shown=>{for(const {c,w,ic} of CT){w.hidden=(ic&&busy)||(c.show?!c.show(shown):false);
        if(c.type==='range'){const inp=w.querySelector('input');if(+inp.value!==shown[c.key])inp.value=shown[c.key];const o=w.querySelector('output'),h=K(c.tex?c.tex(shown[c.key],shown):String(shown[c.key]));if(o.innerHTML!==h)o.innerHTML=h}
        else w.querySelectorAll('button').forEach(b=>b.classList.toggle('on',+b.dataset.v===shown[c.key]))}};
      const draw=()=>{const pw=d.clientWidth,ph=d.clientHeight;if(!pw)return;const dpr=window.devicePixelRatio||1;
        if(cv.width!==Math.round(pw*dpr)){cv.width=Math.round(pw*dpr);cv.height=Math.round(ph*dpr)}
        const k=pw/U.w,cs=getComputedStyle(d),C=n=>{n=n||'ink';const v=n==='ink'?'--chalk':TOK.includes(n)?'--'+n:null;return v?cs.getPropertyValue(v).trim():n};
        const V=zv(),z=V.z;c2.setTransform(dpr*k*z,0,0,dpr*k*z,-dpr*k*z*V.x,-dpr*k*z*V.y);c2.clearRect(V.x,V.y,U.w/z,U.h/z);c2.lineCap=c2.lineJoin='round';let html='';
        /* widths and radii stay the same on screen at any zoom */
        const stroke=(col,w,dash)=>{c2.strokeStyle=C(col);c2.lineWidth=(w||3)/z;c2.setLineDash((dash||[]).map(v=>v/z));c2.stroke()};
        const g={W:U.w,H:U.h,col:C,ctx:c2,view:[V.x,V.y,V.x+U.w/z,V.y+U.h/z],
          line(pts,col,w,dash){if(pts.length<2)return;c2.beginPath();c2.moveTo(...pts[0]);for(const q of pts.slice(1))c2.lineTo(...q);stroke(col,w,dash)},
          fill(pts,col,alpha){if(pts.length<3)return;c2.beginPath();c2.moveTo(...pts[0]);for(const q of pts.slice(1))c2.lineTo(...q);c2.closePath();c2.globalAlpha=alpha??1;c2.fillStyle=C(col);c2.fill();c2.globalAlpha=1},
          dot(x,y,r,col){c2.beginPath();c2.arc(x,y,(r||8)/z,0,7);c2.fillStyle=C(col);c2.fill()},
          ring(x,y,r,col,w){c2.beginPath();c2.arc(x,y,r/z,0,7);stroke(col,w||3)},
          arrow(p,q,col,w){g.line([p,q],col,w);const t=Math.atan2(q[1]-p[1],q[0]-p[0]),h=(w||3)*4.5/z;
            c2.beginPath();c2.moveTo(...q);c2.lineTo(q[0]-h*Math.cos(t-.4),q[1]-h*Math.sin(t-.4));c2.lineTo(q[0]-h*Math.cos(t+.4),q[1]-h*Math.sin(t+.4));c2.closePath();c2.fillStyle=C(col);c2.fill()},
          /* a KaTeX label at (x, y); pos: c, n, s, e, w, ne, nw, se, sw — the side of the point the label sits on */
          /* fixed(…): the same as label, but it stays in place when the picture is zoomed (a formula in a corner) */
          fixed(x,y,t,col,pos,size){g.label(V.x+x/z,V.y+y/z,t,col,pos,size)},
          label(x,y,t,col,pos,size){const P=pos||'c',tx=P.includes('e')?'0':P.includes('w')?'-100%':'-50%',ty=P.includes('s')?'0':P.includes('n')?'-100%':'-50%';
            const m=P==='c'?0:.35;html+=`<div style="left:${(x-V.x)*z/U.w*100}%;top:${(y-V.y)*z/U.h*100}%;color:${C(col)};transform:translate(${tx},${ty}) translate(${P.includes('e')?m:P.includes('w')?-m:0}em,${P.includes('s')?m:P.includes('n')?-m:0}em)${size?';font-size:'+size+'em':''}">${K(t)}</div>`}};
        /* the viewer's choices apply to every figure that has the same key */
        for(const k in UP)if(k in s&&!F.inspect&&!inspectKeys.has(k))s[k]=UP[k];
        const shown={...s,...inspection};
        F.draw(g,shown);if(lb.innerHTML!==html)lb.innerHTML=html;syncCtl(shown)};
      /* dragging: the kind's drag(s, x, y) turns a pointer position (in figure units) into new state values, kept as the viewer's choice */
      if(F.drag){const at=unit;
        const can=()=>!F.canDrag||F.canDrag(s);let on=false;
        const move=e=>{const u=F.drag({...s,...inspection},...at(e),U.w,U.h);if(!u)return;
          if(F.inspect||Object.keys(u).every(k=>inspectKeys.has(k))){startInspection();Object.assign(inspection,u);draw()}
          else{resetInspection();Object.assign(s,u);Object.assign(UP,u);FIGLIVE.forEach(f=>f());chosen()}
        };
        cv.addEventListener('pointerdown',e=>{if(!can())return;on=true;cv.style.cursor='grabbing';cv.setPointerCapture(e.pointerId);move(e);e.preventDefault()});
        cv.addEventListener('pointermove',e=>{if(on)move(e);else cv.style.cursor=can()?'grab':''});
        cv.addEventListener('pointerup',()=>{on=false;cv.style.cursor=can()?'grab':''});}
      /* a question answered by a click on the figure: the kind's hit(s, x, y) names what is under the pointer */
      if(F.hit){const hitAt=e=>F.hit(s,...unit(e),U.w,U.h);
        cv.addEventListener('click',e=>{const nm=hitAt(e);if(nm!=null)QHIT(a.id,nm)});
        /* while the question waits, what can be clicked answers the pointer: a hand, and qhover for the kind to mark */
        const hover=nm=>{cv.style.cursor=nm?'pointer':'';if(s.qhover!==nm){s.qhover=nm;draw()}};
        cv.addEventListener('pointermove',e=>hover(QON(a.id)?hitAt(e)||'':''));cv.addEventListener('pointerleave',()=>hover(''))}
      /* zoom (a kind with zoom: true): buttons + − and the original view in the corner, the wheel over the picture, both smooth;
         a zoomed-in picture is dragged where the kind's own drag does not apply */
      if(F.zoom){const fz=document.createElement('div');fz.className='fz';
        fz.innerHTML=`<button data-z="in" title="${L.zIn}">+</button><button data-z="out" title="${L.zOut}">−</button><button data-z="home" title="${L.zHome}">⌂</button>`;d.appendChild(fz);
        let goal=null,raf=0;
        const step=()=>{const V=zv(),t=goal;raf=0;if(!t)return;const f=Math.abs(t.z-V.z)<1e-3&&Math.abs(t.x-V.x)<.5&&Math.abs(t.y-V.y)<.5?1:.25;
          V.z+=(t.z-V.z)*f;V.x+=(t.x-V.x)*f;V.y+=(t.y-V.y)*f;draw();if(f<1)raf=requestAnimationFrame(step);else goal=null};
        /* the zoom by factor m about the point (px, py) in figure units */
        const zoomAt=(m,px,py)=>{const V=goal||zv(),z=Math.min(8,Math.max(.25,V.z*m));
          goal={z,x:px-(px-V.x)*V.z/z,y:py-(py-V.y)*V.z/z};if(!raf)raf=requestAnimationFrame(step)};
        fz.onclick=e=>{const b=e.target.closest('button');if(!b)return;b.blur();const V=goal||zv(),cx=V.x+U.w/V.z/2,cy=V.y+U.h/V.z/2;
          if(b.dataset.z==='home'){goal={z:1,x:0,y:0};if(!raf)raf=requestAnimationFrame(step)}else zoomAt(b.dataset.z==='in'?1.5:1/1.5,cx,cy)};
        cv.addEventListener('wheel',e=>{e.preventDefault();zoomAt(Math.exp(-e.deltaY*.0015),...unit(e))},{passive:false});
        let pan=null;const free=()=>zv().z>1&&!(F.drag&&(!F.canDrag||F.canDrag(s)));
        cv.addEventListener('pointerdown',e=>{if(!free()||(F.hit&&QON(a.id)))return;pan=[e.clientX,e.clientY];cv.setPointerCapture(e.pointerId);cv.style.cursor='grabbing'});
        cv.addEventListener('pointermove',e=>{if(!pan){if(free()&&!(F.hit&&QON(a.id)))cv.style.cursor='grab';else if(!F.drag&&!F.hit)cv.style.cursor='';return}
          const r=d.getBoundingClientRect(),V=zv();goal=null;V.x-=(e.clientX-pan[0])/r.width*U.w/V.z;V.y-=(e.clientY-pan[1])/r.height*U.h/V.z;pan=[e.clientX,e.clientY];draw()});
        cv.addEventListener('pointerup',()=>{if(pan){pan=null;cv.style.cursor=free()?'grab':''}})}
      const ro=new ResizeObserver(draw);ro.observe(d);FIGLIVE.add(draw);draw();
      if(!inst)anim(d,[{opacity:0},{opacity:1}],a.dur??400,inst);
      return {s,F,inspectKeys,setBusy,draw,resetInspection,fig:1,el:[d],remove:()=>{stopReplay();ro.disconnect();FIGLIVE.delete(draw);d.remove()},recolor:()=>{}}}
    const ease=u=>u<.5?2*u*u:1-2*(1-u)*(1-u);
    async function figSet(a,inst,tk){const o=obj.get(a.fig);if(!o||!o.fig)return;const nums=[],from={};
      o.resetInspection();o.setBusy(false);
      for(const [k,v] of Object.entries(a.set)){
        if(!o.F.inspect&&!o.inspectKeys.has(k)&&k in UP){if(inst)continue;delete UP[k]}
        if(a.op==='fplay'&&!inst&&typeof v==='number'){nums.push(k);from[k]=+o.s[k]||0}else o.s[k]=v}
      if(!nums.length){o.draw();return}
      o.setBusy(true);
      const dur=a.dur??1500;let t=0,last=performance.now();
      await new Promise(res=>{const f=now=>{if(tk!=null&&tk!==token)return res();if(paused){last=now;requestAnimationFrame(f);return}t+=(now-last)*speed;last=now;
        const e=ease(Math.min(1,t/dur));for(const k of nums)o.s[k]=from[k]+(a.set[k]-from[k])*e;o.draw();if(t<dur)requestAnimationFrame(f);else res()};requestAnimationFrame(f)});
      if(tk==null||tk===token)o.setBusy(false)}
    const MAKE={tex,path,node,edge,arc,box:box_,figure};
    /* a card's step before its motion: 'play' sets the words at once and leaves the numbers where they are, for ▶ to move */
    function arm(a){if(a.op==='par'){a.actions.forEach(arm);return}
      if(a.op!=='fplay'){run(a,true);return}const o=obj.get(a.fig);if(!o||!o.fig)return;
      o.resetInspection();o.setBusy(true);
      for(const [k,v] of Object.entries(a.set))if(typeof v!=='number')o.s[k]=v;o.draw()}
    /* the values {{name}} and 'Say if' read: the state of every figure on this board, with the viewer's choices, and its text(s) */
    function vars(){const V={};for(const o of obj.values())if(o.fig){const s={...o.s};for(const k in UP)if(k in s&&!o.F.inspect&&!o.inspectKeys.has(k))s[k]=UP[k];
      Object.assign(V,s,o.F.text?o.F.text(s):{})}return V}
    async function run(a,inst,tk){
      inst=inst||a.instant;
      if(a.op==='cue')return;
      if(a.op==='point'){if(!inst)await point(a,tk);return}
      if(a.op==='par'){await Promise.all(a.actions.map(b=>run(b,inst,tk)));return}
      if(a.op==='wait'){if(!inst)await vsleep(a.dur,tk);return}
      if(a.op==='fset'||a.op==='fplay'){await figSet(a,inst,tk);return}
      if(a.op==='erase'){const ids=a.ids==='all'?[...obj.keys()]:a.ids;
        for(const id of ids){const o=obj.get(id);if(!o)continue;obj.delete(id);
          if(inst)o.remove();else{o.el.forEach(e=>tune(e.animate([{opacity:1},{opacity:0}],{duration:a.dur??450,fill:'forwards'})));later(a.dur??450,()=>o.remove())}}
        if(!inst)await vsleep(a.dur??450,tk);return}
      if(a.op==='mark'){for(const id of [].concat(a.ids)){const o=sub(id);if(!o)continue;if(a.color)o.recolor(a.color);if(a.fill!=null&&o.fill)o.fill(a.fill)}
        if(!inst)await vsleep(a.dur??350,tk);return}
      put(a.id||('_'+Math.random()),MAKE[a.op](a,inst));
      if(!inst)await vsleep(a.dur??(a.op==='tex'?900:a.op==='node'?500:a.op==='figure'?400:700),tk)}
    /* a figure is removed through its own remove(), which stops its resize observer and its live redraw */
    const clear=()=>{for(const o of obj.values())if(o.fig)o.remove();g.innerHTML='';ink.innerHTML='';obj.clear()};
    /* instant state after slides < k and steps < i of slide k */
    /* the replay starts at the latest step before that point which erases the whole board, since nothing drawn before it is left */
    const wipes=st=>(st.do||[]).some(a=>a.op==='erase'&&a.ids==='all');
    const upTo=(k,i)=>{clear();let b0=0,j0=0;
      find:for(let b=k;b>=0;b--)for(let j=Math.min(b<k?Infinity:i,steps(b).length)-1;j>=0;j--)if(wipes(steps(b)[j])){b0=b;j0=j;break find}
      for(let b=b0;b<=k;b++)steps(b).slice(b===b0?j0:0,b<k?undefined:i).forEach(s=>(s.do||[]).forEach(a=>run(a,true)))};
    return {run,clear,upTo,arm,vars,fig:id=>obj.get(id),figs:()=>[...obj.values()].filter(o=>o.fig)}}
  const UP={};
  /* autoplay: steps follow one another by themselves; on by default with voice, off without (each mode keeps its own choice) */
  const AKEY='mb-auto-'+(NOVOICE?'nv':'v');let AUTO=!NOVOICE;try{const v=localStorage.getItem(AKEY);if(v)AUTO=v==='on'}catch(e){}
  if(CARD)AUTO=false;
  function setAuto(v){AUTO=v;try{localStorage.setItem(AKEY,v?'on':'off')}catch(e){}ui()}
  $('.auto').onclick=e=>{setAuto(!AUTO);e.currentTarget.blur()};
  const B=Surface($('.board.main'));

  /* ---------- note card: definitions and Why? ---------- */
  let cardKey='';
  /* the card sits at the top of the transcript column (Read: in the corner), or next to the clicked word */
  /* In full screen only the full-screen element is visible, so the card goes inside it. 'Next to the word' uses
     viewport coordinates (position: fixed), which hold both on the page and in full screen. */
  function placeCard(anchor){card.classList.remove('float','at');card.style.top=card.style.left='';
    const host=document.fullscreenElement||app;
    if(SET.notes==='word'&&anchor){host.appendChild(card);card.classList.add('at');
      const r=anchor.getBoundingClientRect(),w=card.offsetWidth,h=card.offsetHeight;
      const below=r.bottom+8+h<=window.innerHeight;
      card.style.top=(below?r.bottom+8:Math.max(8,r.top-8-h))+'px';
      card.style.left=Math.min(Math.max(8,r.left-20),window.innerWidth-w-8)+'px';return}
    if(view==='read'||document.fullscreenElement||side.hidden){host.appendChild(card);card.classList.add('float')}else side.prepend(card)}
  document.addEventListener('fullscreenchange',()=>{if(!card.hidden)hideCard()});
  /* a Why? or Caution pauses the story while it is open, so there is time to read it */
  let heldByNote=false;
  function showCard(key,html,anchor){if(cardKey===key&&!card.hidden){hideCard();return}cardKey=key;cb.innerHTML=html;equationLinks(cb);card.hidden=false;placeCard(anchor);
    if(/^(why|caution|eq):/.test(key)&&state==='playing'){setPaused(true);heldByNote=true}
    if(key.startsWith('eq:')&&state==='gap'){paused=true;heldByNote=true}}
  function hideCard(){card.hidden=true;cardKey='';app.querySelectorAll('.term.on').forEach(b=>b.classList.remove('on'));
    if(heldByNote){heldByNote=false;if(state==='paused')setPaused(false);else if(state==='gap')paused=false}}
  $('.x').onclick=hideCard;
  /* a click outside the card closes it (a click on a term, a note line or a sign opens or switches it instead) */
  document.addEventListener('pointerdown',e=>{if(card.hidden||card.contains(e.target)||e.target.closest('[data-term],[data-note],[data-eq],[data-wk],.sign,.setp'))return;hideCard()},true);
  function showTerm(k,btn){const t=G[k];if(!t)return;app.querySelectorAll('.term.on').forEach(b=>b.classList.remove('on'));
    showCard('t:'+k,`<b>${fmt(t.term,G)}</b>${para(fmt(t.def,G))}`,btn);if(!card.hidden&&btn&&btn.classList.contains('term'))btn.classList.add('on')}
  function showEquation(key,anchor){const q=EQ[key];if(!q)return;
    showCard('eq:'+key,`<b>(${key}) · ${fmt(S.slides[q.k].title||L.slide+' '+(q.k+1),G)}</b><div class="eq-body">${q.tex.map(t=>K(t,true)).join('')}</div>`,anchor)}
  // Capture before caption, transcript and note handlers: previewing never navigates.
  app.addEventListener('click',e=>{const r=e.target.closest('[data-eq]');if(!r||!EQ[r.dataset.eq])return;
    e.preventDefault();e.stopImmediatePropagation();showEquation(r.dataset.eq,r)},true);
  app.addEventListener('keydown',e=>{const r=e.target.closest('[data-eq]');if(!r||!['Enter',' '].includes(e.key))return;
    e.preventDefault();e.stopPropagation();r.click()});
  /* Why? is a branch attached to a step: a line under the caption, an indented line in the transcript */
  /* side notes attached to a step: why (? in a circle) and caution (! in a triangle) */
  const KINDS=['caution','why'],seen={};
  /* the legend above the transcript gains an entry the first time each sign appears */
  function firstLabel(b,kind){$('.legend').hidden=false;$('.lg.'+kind).hidden=false}
  const noteAt=(kind,k,i)=>steps(k)[i][kind];
  const noteHTML=w=>`<b>${fmt(w.label,G)}</b>${para(fmt(w.text,G))}`;
  const icon=kind=>`<i class="ic ${kind}">${kind==='why'?'?':'!'}</i>`;
  const noteLines=(k,i)=>KINDS.map(kind=>{const w=noteAt(kind,k,i);return w?`<span class="wl ${kind}" data-kind="${kind}" data-wk="${k}" data-wi="${i}">${icon(kind)} ${fmt(w.label,G)}</span>`:''}).join('');
  app.addEventListener('click',e=>{const l=e.target.closest('[data-wk]');if(!l)return;e.stopPropagation();
    const kind=l.dataset.kind,k=+l.dataset.wk,i=+l.dataset.wi;showCard(kind+':'+k+'.'+i,noteHTML(noteAt(kind,k,i)),l)},true);

  /* ---------- transcript under the board ---------- */
  const sayAt=(k,i,V)=>sayIn(steps(k)[i],V||B.vars());
  const hasMo=st=>(st.do||[]).some(function f(a){return a.op==='fplay'||(a.op==='par'&&a.actions.some(f))});
  /* a card's current step with a motion ends with ▶ (before it) or ↻ (after it) */
  const moBtn=(k,i)=>CARD&&k===K0&&i===I0&&state!=='ready'&&hasMo(steps(k)[i])?`<button class="mo" title="${armed?L.show:L.again}">${armed?ICON_PLAY:ICON_RE}</button>`:'';
  const sent=(k,i,cls,V)=>`<span class="s ${cls}" data-k="${k}" data-i="${i}">${fmt(sayAt(k,i,V),G)}${cls?moBtn(k,i):''}</span>${cls&&CARD?qWidget(k,i):''} `;
  const slideText=(k,n,clsOf)=>{let h='',open=false;steps(k).slice(0,n).forEach((s,i)=>{if(s.p||!open){if(open)h+='</p>';h+='<p>';open=true}h+=sent(k,i,clsOf(i))+noteLines(k,i)});return h+(open?'</p>':'')};
  /* stages of a slide ('## Heading' in a card): the first step of each, and the stage of step i */
  const stagesOf=k=>{const f=[];steps(k).forEach((s,i)=>{if(!i||s.stage!==steps(k)[i-1].stage)f.push(i)});return f};
  const stageAt=(k,i)=>stagesOf(k).filter(j=>j<=i).length-1;
  /* a card: its title and intro, then the steps so far grouped by stages, one step to a line; past ones fade */
  function cardText(){const k=K0,sl=S.slides[k],live=state==='playing'||state==='paused'||state==='held',n=state==='ready'?0:live?I0+1:steps(k).length;
    const V=B.vars(),F=stagesOf(k),g=stageAt(k,Math.min(I0,steps(k).length-1));
    let h=`<div class="sl"><h3 class="ct">${N>1?`<span class="sn">${cnum(k)}</span> `:''}${fmt(sl.title||'',G)}</h3>`+(sl.intro||[]).map(p=>`<p class="intro">${fmt(p,G)}</p>`).join('');
    F.forEach((f,j)=>{if(f>=n)return;const st=steps(k)[f];h+=`<div class="grp ${j<g?'past':'cur'}">`+(st.stage?`<h4>${fmt(st.stage,G)}</h4>`:'');
      for(let i=f;i<(F[j+1]??steps(k).length)&&i<n;i++)h+=`<p class="ph">${sent(k,i,(i===I0&&live?'now':'past')+(i===I0&&state==='playing'?' playing':''),V)}${noteLines(k,i)}</p>`;
      h+='</div>'});
    return h+'</div>'}
  let txHTML="",userScroll=-1e9;
  tx.addEventListener('wheel',()=>userScroll=performance.now());tx.addEventListener('touchmove',()=>userScroll=performance.now());
  function txRender(){const live=state==='playing'||state==='paused'||state==='held';let h='';
    if(CARD)h=cardText();else for(let k=0;k<=K0;k++){const n=k<K0?steps(k).length:state==='ready'?0:live?I0+1:steps(k).length;if(!n)continue;
      h+=`<div class="sl"><div class="slab" data-go="${k}" title="${L.goSlide}">${fmt(L.slide+' '+stitle(k),G)}</div>${slideText(k,n,i=>k<K0?'past':live?(i===I0?'now':'past'):'')}</div>`}
    if(h!==txHTML){const fo=document.activeElement&&document.activeElement.classList.contains('qin');txHTML=h;txi.innerHTML=h;equationLinks(txi);
      const n=fo&&txi.querySelector('.qin');if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length)}}
    scrollCur('smooth')}
  function scrollCur(behavior){if(performance.now()-userScroll<5000)return;
    /* a card scrolls as little as it can: the title and intro stay in view until the steps push them out */
    if(CARD){const s=txi.querySelector('.s.now'),cur=s&&(s.closest('.ph')||s);if(!cur||state==='ready'){tx.scrollTo({top:0,behavior});return}
      const pad=24,top=cur.offsetTop,bot=top+cur.offsetHeight,H=tx.clientHeight,y=tx.scrollTop;
      if(bot>y+H-pad)tx.scrollTo({top:Math.min(top-pad,bot-H+pad),behavior});else if(top<y+pad)tx.scrollTo({top:top-pad,behavior});return}
    const cur=txi.querySelector('.s.now')||[...txi.querySelectorAll('.s')].pop();
    if(cur)tx.scrollTo({top:cur.offsetTop-tx.clientHeight/2+cur.offsetHeight/2,behavior})}

  /* ---------- captions on the board: the current sentence ---------- */
  const plainTerms=s=>s.replace(/\[\[([\w-]+)(?:\|([^\]]+))?\]\]/g,(m,k,t)=>t||(G[k]?G[k].term:k));
  let capHTML='';
  function capRender(){const live=state==='playing'||state==='paused'||state==='held';
    /* at the end of a slide the last sentence stays in the captions, so it can be read again; the next stop is the grey caption of the next slide */
    const ended=state==='done'||state==='gap';
    let h=state==='ready'?`<span class="cw">${fmt(sayAt(K0,0),G)}</span>`
      :live?fmt(sayAt(K0,I0),G):ended?fmt(sayAt(K0,steps(K0).length-1),G):'';
    /* at the end of a slide a grey caption of its own names the next one: in n s with autoplay, Space: play without it */
    if((nxt||state==='gap')&&!CARD){const nx=K0<N-1?`${L.nextS} ${fmt(stitle(K0+1),G)}`+(state==='gap'?` · ${L.inS(gapLeft)}`:AUTO&&SET.autonext==='auto'?'':` · ${L.spacePlay}`):L.endT;
      h=`<span class="nxt">${nx}</span>`+(K0<N-1?` <button class="play-next">${L.playNext}</button>`:'')}
    if(wipe)h='';
    cap.classList.toggle('action',!wipe&&['held','playing','paused'].includes(state)&&!(nxt||state==='gap'));
    if(h!==capHTML){capHTML=h;capt.innerHTML=h;equationLinks(capt)}
    const E=wipeAt(K0),tc=$('.blank');
    tc.hidden=CARD||E<0||state==='done'||state==='gap'||!(state==='ready'||wipe||I0<E||(I0===E&&pre));
    const bn=$('.bnote'),note=CARD?'':state==='ready'&&started?L.spacePlay:'';
    bn.hidden=!note;bn.textContent=note;
    /* the latest Why? so far in this slide: a small sign in the board's top right corner */
    /* the latest note of each kind so far in this slide: a small sign in the board's top right corner */
    for(const kind of KINDS){let w=null;if(live||state==='done'){for(let i=live?I0:steps(K0).length-1;i>=0;i--)if(noteAt(kind,K0,i)){w=i;break}}
      const b=$('.sign.'+kind);b.hidden=w==null;if(w!=null&&!seen[kind]){seen[kind]=1;firstLabel(b,kind)}if(w!=null){b.dataset.wk=K0;b.dataset.wi=w;b.title=(kind==='why'?L.whyT:L.cautionT)+noteAt(kind,K0,w).label}}}

  /* ---------- controls state ---------- */
  /* the place reached is kept per script, so a reload comes back to it */
  const PKEY='mb-pos-'+S.title;let posOn=false;
  function savePos(){if(posOn)try{localStorage.setItem(PKEY,JSON.stringify({k:K0,i:sourceAt(K0,I0),s:state}))}catch(e){}}
  function ui(){const n=steps(K0).length,gap=state==='gap',done=state==='done'||gap,ready=state==='ready';
    savePos();
    $('.go').hidden=!ready||started||CARD;$('.pp').hidden=CARD;
    [...dots.children].forEach((d,i)=>{d.className=i<K0?'done':i===K0?'cur':'';d.hidden=PARTS.length>0&&PI[i]!==PI[K0]});
    cnt.textContent=L.counter(K0+1,N,ready?'–':done?n:I0+1,n,PI[K0]+1,PARTS.length);
    /* Hierarchy above the smaller slide title; counters stay separate. */
    /* the step counter sits at the right end of the slide line; the counter under the board is hidden */
    if(sttK!==K0){sttK=K0;const sl=S.slides[K0],sep='<span class="sep"> · </span>';
      $('.stt').classList.toggle('talk-title',!CARD);
      $('.stt').innerHTML=(CARD?'':'<i class="toc">☰</i>')+'<span class="stx"></span><span class="sst"></span>';if(CARD){app.querySelectorAll('.ptabs button').forEach(b=>b.classList.toggle('on',+b.dataset.p===PI[K0]));
        const mine=S.slides.map((x,j)=>j).filter(j=>PI[j]===PI[K0]),cr=$('.crow');cr.hidden=mine.length<2;
        cr.innerHTML=mine.map(j=>`<button data-go="${j}"${j===K0?' class="on"':''}><span class="sn">${cnum(j)}</span> ${fmt(S.slides[j].title||'',G)}</button>`).join('')}
      else {const path=[sl.section,sl.part].filter((x,i,a)=>x&&a.indexOf(x)===i);
        $('.stx').innerHTML=`${path.length?`<span class="section-title">${path.map(x=>fmt(x,G)).join(' <span class="sep"> / </span> ')}</span>`:''}<span class="slide-title">${fmt(sl.title||L.slide,G)}</span>`}}
    const SF=stagesOf(K0),gi=stageAt(K0,I0);
    $('.sst').textContent=CARD&&SF.length>1&&!ready?`${L.stage} ${gi+1}/${SF.length} · ${L.step} ${I0-SF[gi]+1}/${(SF[gi+1]??n)-SF[gi]}`:`${L.step} ${ready?'–':done?n:I0+1}/${n}`;
    if(!CARD)$('.sst').textContent=`${L.slide} ${K0+1}/${N} · ${L.step} ${ready?'–':done?n:I0+1}/${n}`;
    $('.spd').textContent=speed+'×';$('.auto').classList.toggle('on',AUTO);
    const running=state==='playing'||(drawing&&!paused);
    $('.pp').textContent=running?'❚❚':'▶︎';$('.pp').title=running?L.tPause:L.tPlay;
    if(!CARD)$('.set-play').textContent=running?'Pause':L.play;
    $('.pb').disabled=K0===0&&ready;$('.nb').disabled=K0===N-1&&done;$('.ps').disabled=K0===0&&(ready||(I0===0&&!done));
    txRender();capRender();questionPanel();updateControls()}

  /* ---------- voice: Web Speech API; '|' short pause, '||' long pause, '^' cue for the next board action ---------- */
  const SY=window.speechSynthesis;let voiceOn=true,voice=null;
  try{voiceOn=localStorage.getItem('mb-voice')!=='off'}catch(e){}
  if(NOVOICE)voiceOn=false;
  /* voices of the script's language (lang:), the best first */
  const VL=(S.lang||'en').slice(0,2).toLowerCase();
  const pickVoice=()=>{if(!SY)return;const vs=SY.getVoices().filter(v=>v.lang.toLowerCase().startsWith(VL));
    const pref=VL==='ru'?[/premium/i,/enhanced/i,/^Milena/,/Google русский/i,/ru-RU/]:[/premium/i,/enhanced/i,/natural/i,/^Samantha$/,/^Daniel$/,/^Ava/,/Google US English/,/en-US/];
    const all=SY.getVoices(),chosen=all.find(v=>v.name===SET.voice);
    const sel=$('.vsel');sel.innerHTML='<option value="">best voice</option>'+vs.map(v=>`<option${v.name===SET.voice?' selected':''}>${v.name}</option>`).join('');
    if(chosen){voice=chosen;return}
    for(const r of pref){const v=vs.find(v=>r.test(v.name)||r.test(v.lang));if(v){voice=v;return}}voice=vs[0]||null};
  if(SY&&!NOVOICE){SY.cancel();pickVoice();SY.onvoiceschanged=()=>{pickVoice();voxLabel()}}
  $('.vsel').onchange=e=>{SET.voice=e.target.value;applySet();pickVoice();if(state==='playing'||state==='paused')playFrom(K0,I0)};
  /* no voices in this browser: the button says so with '!' and the story plays at reading pace */
  const noVoices=()=>!SY||!SY.getVoices().length;
  const vox=$('.vox');const voxLabel=()=>{const nv=noVoices();vox.textContent=(voiceOn?'voice: on':'voice: off')+(nv?' !':'');vox.title=nv?'This browser offers no voices here; the story plays at reading pace.':'voice on/off (V)'};voxLabel();
  const hush=()=>{if(SY)SY.cancel()};
  /* Utterances are kept referenced (Chrome may drop onend of a collected one); a phrase that never reports its end
     is given up after a while so the story goes on */
  const UT=[];
  const utter=t=>new Promise(res=>{const u=new SpeechSynthesisUtterance(t);if(voice)u.voice=voice;u.lang=voice?voice.lang:(VL==='ru'?'ru-RU':'en-US');u.rate=.93*speed;
    UT.push(u);if(UT.length>40)UT.shift();
    let done=false;const fin=()=>{if(!done){done=true;res()}};u.onend=fin;u.onerror=fin;
    setTimeout(fin,t.length*90/speed+2500);SY.speak(u)});
  const resumed=tk=>new Promise(res=>{const f=()=>(!paused||tk!==token)?res():setTimeout(f,60);f()});
  /* a step is spoken chunk by chunk: '|' a short pause, '||' a long one, '^' fires the next cued board action;
     a chunk cut by Pause is said again from its start */
  async function speakStep(str,tk,fire){const parts=str.split(/\s*(\|\|?)\s*/);
    for(let j=0;j<parts.length;j+=2){let t=parts[j].trim();
      while(t.startsWith('^')){fire();t=t.slice(1).trim()}
      while(t){await resumed(tk);if(tk!==token)return;await utter(t);if(tk!==token)return;if(!paused)break}
      const sep=parts[j+1];if(sep&&!(await vsleep((sep==='||'?SET.plong:SET.pshort)*1000,tk)))return}}
  const plain=s=>(s.voice||s.say).replace(/[|^]/g,'').replace(/\s+/g,' ');
  /* without voice a step lasts as long as its caption takes to read: 60 ms a letter, 90 ms a symbol of a formula */
  const readMs=s=>{if(s.voice&&!NOVOICE)return Math.max(1200,plain(s).length*48);let sym=0;
    const t=s.say.replace(/\$[^$]+\$/g,m=>{sym+=m.slice(1,-1).replace(/\\(?:operatorname|mathrm|mathbb|frac|left|right|bigl|bigr)/g,'').replace(/\\[a-zA-Z]+/g,'x').replace(/[{}^_\s$]/g,'').length;return ''})
      .replace(/\[\[[\w-]+\|?|\]\]/g,'');return Math.max(1800,t.length*60+sym*90)};

  /* ---------- player ---------- */
  function build(k,i){token++;hush();paused=false;armed=false;pre=wipe=nxt=drawing=false;if(k!==K0)hideCard();B.upTo(k,i);if(!CARD&&wipeAt(k)>=0&&i<=wipeAt(k))B.clear()}
  /* a card: entering a step draws it with its motion not yet played (armed); ▶ plays it */
  let armed=false;
  function enter(k,i){build(k,i);for(const a of steps(k)[i].do||[])B.arm(a);K0=k;I0=i;state='held';paused=false;armed=hasMo(steps(k)[i]);userScroll=-1e9;qMark(k,i);ui()}
  async function motion(){if(state!=='held'&&state!=='done')return;const k=K0,i=I0;if(!armed)enter(k,i);armed=false;state='playing';const tk=token;ui();
    const mv=a=>a.op==='fplay'?B.run(a,false,tk):a.op==='par'?Promise.all(a.actions.map(mv)):null;
    for(const a of steps(k)[i].do||[]){await mv(a);if(tk!==token)return}
    state=i===steps(k).length-1?'done':'held';ui()}
  function chosen(){if(B){txRender();capRender();questionPanel()}}
  /* ---------- questions: a step with Ask: waits for an answer before the story goes on ---------- */
  /* a wrong answer brings its own remark (If …:), or else "not quite" with the hint; the second wrong one opens the answer */
  const QS={},qOf=(k,i)=>{const st=steps(k)[i];return st&&st.q};
  const qst=(k,i)=>QS[k+'.'+i]||(QS[k+'.'+i]={done:false,shown:false,skipped:false,hint:false,tries:0,msg:'',val:''});
  const qDone=(k,i)=>!qOf(k,i)||SET.ask==='off'||qst(k,i).done;
  const norm=s=>String(s).replace(/\$/g,'').replace(/[−–]/g,'-').replace(/\s+/g,'').toLowerCase().replace(/^(inf|infinity|бесконечность|\\infty)$/,'∞');
  const same=(v,a)=>{v=norm(v);a=norm(a);return a.includes(',')?v.split(',').filter(Boolean).sort().join()===a.split(',').sort().join():v===a};
  function qAnswer(k,i,v){const q=qOf(k,i),Q=qst(k,i);if(Q.done)return;Q.val=v;
    if(q.kind==='click'?v===q.target:q.accept.some(a=>same(v,a))){Q.done=true;Q.msg=''}
    else{Q.tries++;const w=(q.wrong||[]).find(w=>q.kind==='click'?w.a===v:same(v,w.a));
      Q.msg=w?fmt(w.say,G):L.wrong+(q.hint?' '+fmt(q.hint,G):'');if(Q.tries>=2){Q.done=Q.shown=true}}
    if(k===K0&&i===I0&&state==='playing')setPaused(true);qMark(k,i);ui()}
  function qReveal(k,i){const Q=qst(k,i);Q.done=Q.shown=true;Q.msg='';if(k===K0&&i===I0&&state==='playing')setPaused(true);qMark(k,i);ui()}
  /* a click question marks the point chosen on its figure (qpick, qok in the figure's state); once answered, the right one */
  function qMark(k,i){const q=qOf(k,i);if(!q||q.kind!=='click'||k!==K0)return;const o=B.fig(q.fig);if(!o)return;
    const Q=qst(k,i);if(Q.done&&!Q.skipped){o.s.qpick=q.target;o.s.qok=true}else if(Q.val){o.s.qpick=Q.val;o.s.qok=false}else{delete o.s.qpick;delete o.s.qok}o.draw()}
  QON=id=>{const q=qOf(K0,I0);return !!q&&q.kind==='click'&&q.fig===id&&!qDone(K0,I0)&&state!=='ready'};
  QHIT=(id,nm)=>{const q=qOf(K0,I0);if(!q||q.kind!=='click'||q.fig!==id||qDone(K0,I0)||state==='ready')return;qAnswer(K0,I0,nm)};
  function qWidget(k,i){const q=qOf(k,i);if(!q)return '';const Q=qst(k,i),off=SET.ask==='off',at=`data-qk="${k}" data-qi="${i}"`;
    if(Q.done||off)return `<span class="qa" ${at}>${Q.skipped?L.skipped:Q.shown||off?L.answerT+fmt(q.show,G)+'.':L.right}${!Q.skipped&&q.then?' '+fmt(q.then,G):''}${off?'':` <button class="qretry">${L.retry}</button>`}</span>`;
    return `<span class="qa" ${at}>`+(q.kind==='click'?`<span class="qhow">${L.clickHow}</span> `:'')+(q.kind==='text'?`<input class="qin" aria-label="Answer" value="${Q.val.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}" autocomplete="off" spellcheck="false"> <button class="qok">${L.check}</button> `:'')
      +(q.hint?`<button class="qhint">${L.hint}</button> `:'')+`<button class="qrev">${L.reveal}</button> <button class="qskip">${L.skip}</button>`+(Q.hint?`<span class="qhelp">${fmt(q.hint,G)}</span>`:'')+(Q.msg?`<span class="qmsg" role="status">${Q.msg}</span>`:'')+'</span>'}
  let qHTML='';
  function questionPanel(){const panel=$('.qpanel'),visible=!CARD&&state!=='ready'&&!!qOf(K0,I0)&&!nxt;
    panel.hidden=!visible;capt.hidden=visible;
    if(!visible){qHTML='';panel.innerHTML='';return}
    const h=`<div class="qprompt">${fmt(sayAt(K0,I0),G)}</div>${qWidget(K0,I0)}`+(qDone(K0,I0)?`<button class="qcontinue">${L.continueQ}</button>`:'');
    if(h!==qHTML){const focus=panel.contains(document.activeElement)&&document.activeElement.classList.contains('qin'),pos=focus?document.activeElement.selectionStart:0;qHTML=h;panel.innerHTML=h;if(focus){const input=panel.querySelector('.qin');if(input){input.focus();input.setSelectionRange(pos,pos)}}}
    panel.classList.toggle('attention',!!qst(K0,I0).msg)
  }
  const questionAt=e=>{const a=e.target.closest('[data-qk]');return a?[+a.dataset.qk,+a.dataset.qi]:[K0,I0]};
  app.addEventListener('input',e=>{if(e.target.classList.contains('qin')){const [k,i]=questionAt(e);qst(k,i).val=e.target.value}});
  /* the wheel or a two-finger swipe over any slider moves it by one value; a trackpad sends many small events, so they are summed first */
  let WH=0;app.addEventListener('wheel',e=>{const r=e.target.closest&&e.target.closest('input[type=range]');if(!r)return;e.preventDefault();
    WH+=Math.abs(e.deltaY)>Math.abs(e.deltaX)?-e.deltaY:e.deltaX;if(Math.abs(WH)<30)return;
    const v=+r.value;WH>0?r.stepUp():r.stepDown();WH=0;if(+r.value!==v)r.dispatchEvent(new Event('input',{bubbles:true}))},{passive:false});
  app.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.classList.contains('qin')){e.preventDefault();qAnswer(...questionAt(e),e.target.value)}});
  app.addEventListener('click',e=>{const [k,i]=questionAt(e),Q=qOf(k,i)&&qst(k,i);
    if(e.target.closest('.qok')){const n=e.target.closest('.qa').querySelector('.qin');qAnswer(k,i,n?n.value:'')}
    else if(e.target.closest('.qrev'))qReveal(k,i);
    else if(e.target.closest('.qhint')){Q.hint=true;ui()}
    else if(e.target.closest('.qskip')){Q.done=Q.skipped=true;Q.msg='';if(state==='playing')setPaused(true);ui()}
    else if(e.target.closest('.qretry')){
      delete QS[k+'.'+i];
      if(k===K0&&i===I0&&state==='playing')setPaused(true);
      qMark(k,i);ui();
      const field=app.querySelector(`.qa[data-qk="${k}"][data-qi="${i}"] .qin`);
      if(field)field.focus()
    }
    else if(e.target.closest('.qcontinue')){if(I0+1<steps(K0).length)playFrom(K0,I0+1);else{build(K0,steps(K0).length);slideEnd(K0,token)}}
    else if(e.target.closest('.play-next')&&K0<N-1)playFrom(K0+1,0)});

  async function playStep(s,tk){
    const v=s.voice||'',cues=[];let fired=0;
    for(let c=0;c<v.split('^').length-1;c++){const o={};o.p=new Promise(r=>o.r=r);cues.push(o)}
    const fire=()=>{if(fired<cues.length)cues[fired++].r()};
    const acts=(async()=>{let ci=0;for(const a of s.do||[]){if(tk!==token)return;
      if(a.op==='cue'){if(cues[ci])await cues[ci++].p;continue}await B.run(a,false,tk)}})();
    const loud=voiceOn&&!noVoices()&&v;
    if(!loud)(async()=>{for(const seg of v.split('^').slice(0,-1)){if(!(await vsleep(seg.replace(/\|/g,'').length*48,tk)))return;fire()}})();
    const said=(loud?speakStep(v,tk,fire):s.say?vsleep(readMs(s),tk):Promise.resolve()).then(()=>{while(fired<cues.length)fire()});
    await Promise.all([acts,said]);return tk===token}
  async function playFrom(k,i){const wasReady=state==='ready'&&k===K0;started=true;build(k,i);const tk=token;K0=k;I0=i;state='playing';paused=false;userScroll=-1e9;ui();
    const ss=steps(k);
    if(i===0&&!CARD&&!wasReady){wipe=true;ui();if(!(await vsleep(SET.wipe*1000,tk)))return;wipe=false}
    for(let j=i;j<ss.length;j++){if(j===wipeAt(k))B.run(acts(k,j)[0],true);I0=j;ui();if(!(await playStep(ss[j],tk)))return;
      /* a question holds the story until it is answered */
      if(qOf(k,j)&&SET.ask!=='off'){state='held';ui();return}
      /* without autoplay the story stops after every step, its board drawn; Space or → plays the next one */
      if(j<ss.length-1&&!AUTO){state='held';ui();return}
      if(j<ss.length-1&&!(await vsleep(SET.stepgap*1000*speed,tk)))return}
    slideEnd(k,tk)}
  /* the end of a slide: the grey line names the next one; with autoplay it counts down and the next slide starts, otherwise it waits */
  async function slideEnd(k,tk){K0=k;I0=steps(k).length-1;nxt=!CARD;
    /* a short breath, then the next slide; Space holds */
    if(k<N-1&&SET.autonext==='auto'&&AUTO){state='gap';for(gapLeft=SET.gap;gapLeft>0;gapLeft--){ui();if(!(await vsleep(1000*speed,tk))||state!=='gap')return}playFrom(k+1,0)}
    else{state='done';ui()}}
  /* → on a slide's last step while the story plays: its board finished at once, then the grey line */
  function toEnd(k){build(k,steps(k).length);slideEnd(k,token)}
  /* stopped on step i of slide k, its board drawn and its caption shown; ← → move silently, Space goes on from step i+1 */
  function hold(k,i){if(i>=steps(k).length-1)return finish(k);build(k,i+1);K0=k;I0=i;state='held';paused=false;userScroll=-1e9;qMark(k,i);ui()}
  /* the caption of step i over the board before it; Space plays step i */
  function preAt(k,i){build(k,i);K0=k;I0=i;state='held';paused=false;pre=true;userScroll=-1e9;ui()}
  const acts=(k,i)=>(steps(k)[i].do||[]).filter(a=>a.op!=='cue');
  const wipeAt=k=>{for(let i=0;i<steps(k).length;i++){const a=acts(k,i);if(a.length)return a[0].op==='erase'&&a[0].ids==='all'?i:-1}return -1};
  /* a new slide: the board is wiped and, after a short pause, the first caption comes */
  function micro(){wipe=true;ui();const tk=token;setTimeout(()=>{if(tk===token){wipe=false;ui()}},SET.wipe*1000)}
  /* ← → while stopped: the caption of a step over the board before it, then its board drawn with its animation, never voice */
  function toStep(k,i){if(acts(k,i).length)preAt(k,i);else hold(k,i);if(i===0)micro()}
  async function drawStep(k,i){token++;const tk=token;if(i===wipeAt(k))B.run(acts(k,i)[0],true);pre=false;drawing=true;state='held';ui();
    for(const a of steps(k)[i].do||[]){if(a.op==='cue')continue;await B.run(a,false,tk);if(tk!==token)return}
    drawing=false;if(i===steps(k).length-1)state='done';ui()}
  /* → while the board is being drawn, or during the pause before a slide's first caption: finish it at once */
  function settle(){if(drawing){const k=K0,i=I0;build(k,i+1);K0=k;I0=i;state=i===steps(k).length-1?'done':'held';ui()}else if(wipe){wipe=false;ui()}}
  function toSlide(k){if(CARD)return ready(k);if(state==='playing'||state==='gap')playFrom(k,0);else ready(k)}
  function ready(k){build(k,0);K0=k;I0=0;state='ready';paused=false;ui()}
  function finish(k){build(k,steps(k).length);K0=k;I0=steps(k).length-1;state='done';paused=false;userScroll=-1e9;ui()}
  function pauseClock(p){paused=p;
    if(!p)B.figs().forEach(o=>o.resetInspection());
    document.getAnimations().forEach(a=>{if(p&&a.playState==='running'){a.pause();a._mb=1}else if(!p&&a._mb){a._mb=0;a.play()}});
    if(p)hush();
    ui()
  }
  function setPaused(p){if(state!=='playing'&&state!=='paused')return;state=p?'paused':'playing';pauseClock(p)}
  function pauseForFigure(){
    if(state==='playing')setPaused(true);
    else if(state==='gap'){token++;state='done';ui()}
    else if(drawing&&!paused)pauseClock(true);
  }
  const act={
    toggle(){if(!CARD&&state!=='ready'&&!nxt&&!pre&&!qDone(K0,I0)){if(state==='playing')setPaused(true);qst(K0,I0).msg=L.needAnswer;ui();return}if(CARD){if(state==='playing'||state==='paused')setPaused(state==='playing');else if(armed)motion();else act.nextStep();return}
      if(drawing){pauseClock(!paused);return}
      if(state==='ready')playFrom(K0,0);else if(state==='held')playFrom(K0,pre?I0:I0+1);else if(state==='gap'){token++;state='done';ui()}else if(state==='done'){if(K0<N-1)playFrom(K0+1,0)}else setPaused(state==='playing')},
    nextStep(){const n=steps(K0).length;
      if(!CARD&&state!=='ready'&&!nxt&&!pre&&!qDone(K0,I0)){if(state==='playing')setPaused(true);qst(K0,I0).msg=L.needAnswer;ui();return}
      if(CARD){if(state==='playing'||state==='paused')hold(K0,I0);else if(armed)motion();else if(state==='ready')enter(K0,0);
        else if(!qDone(K0,I0)){qst(K0,I0).msg=L.needAnswer;ui()}
        else if(state!=='done'&&I0<n-1)enter(K0,I0+1);else if(K0<N-1)enter(K0+1,0);return}
      /* while the story is stopped, → moves silently: the caption of the next step, then its board drawn, then the grey caption of the next slide */
      if(state!=='playing'&&state!=='gap'){if(drawing||wipe)settle();else if(pre)drawStep(K0,I0);else if(state==='ready')toStep(K0,0);else if((state==='paused'||state==='held')&&I0<n-1)toStep(K0,I0+1);else if(state==='done'&&!nxt){nxt=true;ui()}else if(K0<N-1)toStep(K0+1,0);return}
      if(state==='playing'||state==='gap'){if(state==='playing'&&I0<n-1)playFrom(K0,I0+1);else if(state==='playing')toEnd(K0);else if(K0<N-1)playFrom(K0+1,0);return}
    },
    prevStep(){const back=()=>{if(K0>0){finish(K0-1);nxt=true;ui()}else ready(0)};
      if(CARD){if(state==='ready')return K0>0?finish(K0-1):null;if(I0>0)hold(K0,I0-1);else ready(K0);return}
      /* while the story goes on, ← plays: the previous step, the previous slide's last step, or (in the countdown) this slide's last step again */
      if(state==='gap'){playFrom(K0,steps(K0).length-1);return}
      if(state==='playing'){if(I0>0)playFrom(K0,I0-1);else if(K0>0)playFrom(K0-1,steps(K0-1).length-1);else playFrom(0,0);return}
      /* while it is stopped, ← steps back silently through the same stops */
      if(nxt){nxt=false;ui()}else if(state==='ready'){if(K0>0)finish(K0-1)}else if(state==='done'){const n=steps(K0).length;if(acts(K0,n-1).length)preAt(K0,n-1);else if(n>1)hold(K0,n-2);else back()}else if(!pre&&acts(K0,I0).length)preAt(K0,I0);else if(I0>0)hold(K0,I0-1);else back()},
    replay(){if(CARD){if(hasMo(steps(K0)[I0]))motion();return}if(state!=='ready')playFrom(K0,state==='done'||state==='gap'?steps(K0).length-1:I0)},
    /* Show all (E) finishes the current slide's board and shows its end caption; repeating it stays on this slide */
    finish(){finish(K0);if(!CARD){nxt=true;ui()}},
    /* to the start of a slide: it plays if the story was playing, otherwise it waits for Space */
    /* ⏮ goes to the start of this slide, and from its start to the previous one; ⏭ to the next slide, or on the last to its end */
    nextSlide(){if(K0<N-1)toSlide(K0+1);else if(state!=='done')finish(K0)},
    prevSlide(){if(state==='ready'){if(K0>0)toSlide(K0-1)}else toSlide(K0)},
    speed(d){const i=Math.max(0,Math.min(SPEEDS.length-1,SPEEDS.indexOf(speed)+d));speed=SPEEDS[i];
      try{localStorage.setItem('mb-speed',speed)}catch(e){}document.getAnimations().forEach(a=>a.playbackRate=speed);outs();ui()}};

  /* ---------- read view: the article ---------- */
  const readText=(k,V)=>{let h='',open=false;steps(k).forEach((st,i)=>{if(st.p||!open){if(open)h+='</p>';h+='<p>';open=true}
    h+=sent(k,i,'',V)+(st.q?`<span class="qa">${L.answerT}${fmt(st.q.show,G)}.</span> `:'');for(const kind of KINDS)if(st[kind]){h+=`</p><div class="rwhy ${kind}"><b>${icon(kind)} ${fmt(st[kind].label,G)}</b>${para(fmt(st[kind].text,G))}</div><p>`}});return h+(open?'</p>':'')};
  const art=$('.article');
  art.innerHTML=S.slides.map((s,k)=>`${s.section&&(!k||s.section!==S.slides[k-1].section)?`<h2 class="rg">${fmt(s.section,G)}</h2>`:''}${s.part&&(!k||s.part!==S.slides[k-1].part||s.section!==S.slides[k-1].section)?`<h2 class="rp">${fmt(s.part,G)}</h2>`:''}<section class="rs" id="slide-${k+1}"><div class="slab" data-go="${k}">${fmt(L.slide+' '+stitle(k),G)}</div><div class="board">${boardHTML()}</div>
    <div class="rt">${readText(k)}</div></section>`).join('');
  /* the Read boards are drawn when Read is first shown: 'next to' needs real widths */
  const readVars=[];
  function renderReadText(){
    art.querySelectorAll('.rt').forEach((rt,k)=>{rt.innerHTML=readText(k,readVars[k]);equationLinks(rt)})
  }
  let readBuilt=false;
  function buildRead(){
    if(readBuilt)return;
    readBuilt=true;
    art.querySelectorAll('.rs').forEach((sec,k)=>{
      const R=Surface(sec.querySelector('.board'));
      R.upTo(k,steps(k).length);readVars[k]=R.vars()
    });
    renderReadText()
  }
  function questionModeChanged(previous,source){
    if(previous!=='hide'&&SET.ask!=='hide'){ui();return}
    hideCard();
    renderReadText();
    const k=K0,i=visibleAt(k,source);
    if(state==='ready'){ready(k);return}
    if(state==='done'||state==='gap'){B.upTo(k,steps(k).length);I0=steps(k).length-1;ui();return}
    if(i<0){finish(k);return}
    if(state==='playing'){playFrom(k,i);return}
    if(pre||sourceAt(k,i)!==source||state==='paused'){preAt(k,i);return}
    hold(k,i)
  }
  function setView(v){if(v===view)return;view=v;
    toggleList(false);
    if(tools){
      const focused=tools.contains(document.activeElement);
      tools.querySelectorAll('[data-v]').forEach(b=>{
        b.classList.toggle('on',b.dataset.v===v);
        b.setAttribute('aria-pressed',b.dataset.v===v);
      });
      (v==='read'?$('.read'):cols).prepend(tools);
      $('.set-view').textContent=v==='read'?L.watch:L.read;
      if(focused)requestAnimationFrame(()=>(SET.controls==='hidden'?settingsButton:tools.querySelector('.views .on')).focus({preventScroll:true}));
    }
    $('.watch').hidden=v!=='watch';$('.read').hidden=v!=='read';hideCard();if(v==='read')buildRead();
    placeCard(null);
    if(v==='read'){if(state==='playing')setPaused(true);const sec=$('#slide-'+(K0+1));if(sec)sec.scrollIntoView({block:'start'})}
    else{app.scrollTop=0;window.scrollTo(0,0);ui()}}
  app.querySelectorAll('.talk-tools [data-v]').forEach(b=>b.onclick=()=>setView(b.dataset.v));

  /* ---------- wiring ---------- */
  $('.pp').onclick=act.toggle;$('.ns').onclick=act.nextStep;$('.ps').onclick=act.prevStep;
  $('.finish').onclick=act.finish;$('.nb').onclick=act.nextSlide;$('.pb').onclick=act.prevSlide;$('.go').onclick=act.toggle;
  $('.spd').onclick=()=>{const i=SPEEDS.indexOf(speed);speed=SPEEDS[(i+1)%SPEEDS.length];act.speed(0)};
  /* A talk keeps one fullscreen element when switching views. */
  function toggleFullscreen(){const w=CARD?cols:app;if(document.fullscreenElement)document.exitFullscreen();else if(w.requestFullscreen)w.requestFullscreen()}
  $('.fs').onclick=toggleFullscreen;
  if(!CARD){
    $('.set-play').onclick=()=>{toggleSet(false);act.toggle();settingsButton.focus()};
    $('.set-fs').onclick=()=>{toggleSet(false);toggleFullscreen();settingsButton.focus()};
    $('.set-view').onclick=()=>{toggleSet(false);setView(view==='watch'?'read':'watch');settingsButton.focus({preventScroll:true})};
    $('.set-toc').onclick=()=>{toggleSet(false);toggleList(true,tools)};
  }
  [...dots.children].forEach((d,k)=>d.onclick=()=>finish(k));
  /* the transcript column can be hidden (T); in full screen it stays beside the board */
  function placeSide(){
    side.hidden=!SET.transcript;$('.txb').classList.toggle('on',SET.transcript);cols.classList.toggle('notx',!SET.transcript);scrollCur('auto')}
  function toggleTx(){SET.transcript=!SET.transcript;applySet();placeSide()}
  app.querySelector('.txb').onclick=()=>{if(view==='watch')toggleTx()};
  document.addEventListener('fullscreenchange',()=>{
    placeSide();
    if(!setp.hidden)(document.fullscreenElement||app).appendChild(setp);
    if(!CARD)$('.set-fs').textContent=document.fullscreenElement?'Exit full screen':'Full screen';
    updateControls(true);
  });
  for(const event of ['pointermove','pointerdown']){
    cols.addEventListener(event,()=>{if(document.fullscreenElement===app)updateControls(true)},true);
  }
  /* the slide list: opened from the counter or with G; a click starts that slide */
  const list=document.createElement('div');list.className='slist';list.hidden=true;
  list.innerHTML=`${CARD?'':`<div class="slist-head"><h2>${fmt(S.title,G)}</h2>${S.subtitle?`<p>${fmt(S.subtitle,G)}</p>`:''}</div>`}<div class="slist-rows"></div>`;
  const listRows=list.querySelector('.slist-rows');
  /* the contents: parts (a click starts the part) and their slides; it drops below the slide line or rises above the counter */
  function toggleList(v,from){const show=v==null?list.hidden:v;
    if(!show){list.hidden=true;return}
    listRows.innerHTML=S.slides.map((sl,k)=>`${sl.section&&(!k||sl.section!==S.slides[k-1].section)?`<div class="sg" data-go="${k}">${fmt(sl.section,G)}</div>`:''}${sl.part&&(!k||sl.part!==S.slides[k-1].part||sl.section!==S.slides[k-1].section)?`<div class="sp${PI[k]===PI[K0]?' cur':''}" data-go="${k}"><span class="sn">${PI[k]+1}</span>${fmt(sl.part,G)}</div>`:''}<div class="si${k===K0?' cur':''}" data-go="${k}"><span class="sn">${k+1}</span><span class="st">${fmt(sl.title||L.slide+' '+(k+1),G)}</span></div>`).join('');
    (document.fullscreenElement||app).appendChild(list);const a=from||(view==='read'?tools:$('.stt')),r=a.getBoundingClientRect();list.hidden=false;
    list.style.left=Math.max(8,Math.min(r.left,window.innerWidth-list.offsetWidth-8))+'px';
    list.style.top=Math.max(8,Math.min(a===cnt?r.top-list.offsetHeight-8:r.bottom+6,window.innerHeight-list.offsetHeight-8))+'px';
    const c=listRows.querySelector('.si.cur');if(c)listRows.scrollTop=c.offsetTop-listRows.clientHeight/2;selList(c)}
  /* keyboard in the contents: the chosen row is marked .sel */
  function selList(el){list.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));if(!el)return;el.classList.add('sel');
    const t=el.offsetTop,b=t+el.offsetHeight;if(t<listRows.scrollTop)listRows.scrollTop=t-8;else if(b>listRows.scrollTop+listRows.clientHeight)listRows.scrollTop=b-listRows.clientHeight+8}
  function listKey(k){const rows=[...list.querySelectorAll('[data-go]')],i=rows.indexOf(list.querySelector('.sel')),parts=rows.filter(r=>r.classList.contains('sp'));
    if(k==='ArrowDown'||k==='j')selList(rows[Math.min(rows.length-1,i+1)]);
    else if(k==='ArrowUp'||k==='k')selList(rows[Math.max(0,i-1)]);
    else if(k==='Home')selList(rows[0]);else if(k==='End')selList(rows[rows.length-1]);
    else if(k==='ArrowRight'||k==='ArrowLeft'){if(!parts.length)return true;const cur=rows[i],pi=parts.filter(r=>rows.indexOf(r)<=i).length-1,
        at=cur&&cur.classList.contains('sp');selList(parts[k==='ArrowRight'?Math.min(parts.length-1,pi+1):Math.max(0,at?pi-1:pi)])}
    else if(k==='Enter'||k===' '){const r=rows[i];if(r)r.click()}
    else return false;return true}
  /* a card page names its parts and cards in the tabs and the row above, so its counter line is not a button; G still opens the contents */
  if(CARD)$('.stt').classList.add('plain');else $('.stt').onclick=e=>toggleList(null,e.currentTarget);
  if(CARD){app.querySelectorAll('.ptabs button').forEach(b=>b.onclick=()=>toSlide(PI.indexOf(+b.dataset.p)));
    $('.crow').onclick=e=>{const b=e.target.closest('button[data-go]');if(b)toSlide(+b.dataset.go)}}
  app.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(!g)return;e.stopPropagation();toggleList(false);
    if(view!=='watch')setView('watch');playFrom(+g.dataset.go,0)},true);
  document.addEventListener('click',e=>{if(!list.hidden&&!e.target.closest('.slist,.stt,.set-toc')&&e.target!==cnt)toggleList(false)});
  /* a click on the captions pauses and resumes (a click on a glossary word only opens its definition) */
  cap.addEventListener('click',e=>{if(e.target.closest('button,input,[data-term],.qpanel'))return;if(state==='held')act.toggle();else if(state==='playing'||state==='paused')setPaused(state==='playing')});
  app.addEventListener('click',e=>{const t=e.target.closest('[data-term]');if(t){showTerm(t.dataset.term,t);return}
    if(e.target.closest('.mo')){e.stopPropagation();armed?motion():act.replay();return}
    const n=e.target.closest('[data-note]');if(n){showCard('n:'+n.dataset.note,para(fmt(NOTES[+n.dataset.note],G)),n);return}
    const s=e.target.closest('.s');if(s){if(view!=='watch')setView('watch');if(CARD)hold(+s.dataset.k,+s.dataset.i);else playFrom(+s.dataset.k,+s.dataset.i)}});
  vox.onclick=()=>{voiceOn=!voiceOn;try{localStorage.setItem('mb-voice',voiceOn?'on':'off')}catch(e){}voxLabel();if(state==='playing'||state==='paused')playFrom(K0,I0)};
  document.addEventListener('keydown',e=>{
    if(document.fullscreenElement===app)updateControls(true);
    if(e.target.closest&&e.target.closest('input,textarea,select'))return;
    /* letters and brackets by the physical key, so that the keys work in any keyboard layout */
    const c=e.code||'',sh=e.shiftKey,k=/^Key[A-Z]$/.test(c)?(sh?c[3]:c[3].toLowerCase()):c==='BracketRight'?']':c==='BracketLeft'?'[':c==='Comma'&&(e.metaKey||e.ctrlKey)?',':e.key;
    if(k==='Escape'){hideCard();if(!setp.hidden){toggleSet(false);settingsButton.focus()}toggleList(false);return}
    if(k==='g'||k==='G'){toggleList();return}
    if(!list.hidden){if(listKey(k))e.preventDefault();return}
    if((e.metaKey||e.ctrlKey)&&k===','){e.preventDefault();toggleSet();return}
    if(e.metaKey||e.ctrlKey)return;
    if(k==='s'||k==='S'){toggleSet();return}
    if(k==='?'||k==='!'){const b=$('.sign.'+(k==='?'?'why':'caution'));if(b&&!b.hidden)b.click();return}
    if(k==='d'||k==='D'){SET.page=SET.board=SET.board==='dark'?'light':'dark';applySet();return}
    if(CARD&&(k==='p'||k==='P'))return;
    if(!CARD&&(k==='a'||k==='A')){setView(view==='watch'?'read':'watch');return}
    if(!CARD&&(k==='t'||k==='T')){if(view==='watch')toggleTx();return}
    if(k==='f'||k==='F'){toggleFullscreen();return}
    if(view!=='watch')return;
    /* vim keys: h l step, j k slide */
    if(!e.metaKey&&!e.ctrlKey&&!e.altKey&&'hjkl'.includes(k)&&k.length===1){({h:act.prevStep,l:act.nextStep,j:act.nextSlide,k:act.prevSlide})[k]();return}
    if(k===' '&&!e.target.closest('.freplay,.stt,.talk-tools button,.setp button')){e.preventDefault();act.toggle()}
    else if(k==='ArrowRight'){e.preventDefault();sh?act.nextSlide():act.nextStep()}
    else if(k==='ArrowLeft'){e.preventDefault();sh?act.prevSlide():act.prevStep()}
    else if(k==='PageDown'){e.preventDefault();act.nextSlide()}
    else if(k==='PageUp'){e.preventDefault();act.prevSlide()}
    else if(k==='e'||k==='E'||k==='End'){e.preventDefault();act.finish()}
    else if(k==='r'||k==='R')act.replay()
    else if(k==='p'||k==='P')setAuto(!AUTO)
    else if(k===']')act.speed(1)
    else if(k==='[')act.speed(-1)
    else if((k==='v'||k==='V')&&!NOVOICE)vox.click()});
  /* ---------- layout lint: overlaps, overflow, long captions, TeX errors (window.MB_LINT()) ---------- */
  function lint(opt){const out=[],seen=new Set(),add=m=>{const key=m.replace(/^[\d.]+: /,'');if(!seen.has(key)){seen.add(key);out.push(m)}};
    const prevAsk=SET.ask;SET.ask='on';
    const R=e=>e.getBoundingClientRect(),inter=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
    const name=e=>[...e.querySelectorAll('.katex-html')].map(x=>x.textContent).join(' ').replace(/\s+/g,' ').trim().slice(0,30)||e.textContent.trim().slice(0,30);
    /* every step's end state, on the main board (this stops playback); MB_LINT({slides:[3,5]}) checks only those slides (1-based) */
    token++;hush();const bd=$('.board.main'),RAW=/\$|\\[a-zA-Z]+|\{\{|\[\[|<</;
    const only=opt&&opt.slides?new Set(opt.slides.map(n=>n-1)):null,ks=S.slides.map((sl,k)=>k).filter(k=>!only||only.has(k));
    const check=(k,si,tag)=>{const at=`${k+1}.${si+1}`,Bx=R(bd);
      /* the text of a card at this step: raw markup, a step taller than the text window, a formula wider than it */
      if(CARD){K0=k;I0=si;state='held';txRender();const cur=txi.querySelector('.s.now'),raw=txi.innerText.match(RAW);
        if(raw)add(`${at}${tag}: raw markup "${raw[0]}" in the text`);if(cur&&cur.offsetHeight>tx.clientHeight)add(`${at}${tag}: the step is taller than the text window`);
        /* a formula that does not wrap and runs past the text window pushes the page sideways */
        const tr=R(tx).right;for(const f of txi.querySelectorAll('.katex'))if(R(f).right>tr+1){add(`${at}${tag}: a formula is wider than the text window "${f.textContent.slice(0,30)}"`);break}}
      const ts=[...bd.querySelectorAll('.ink .t')],rs=ts.map(R),circ=[...bd.querySelectorAll('circle')].map(R);const figs=[...bd.querySelectorAll('.fig')];
      ts.forEach((t,i)=>{const r=rs[i];if(r.left<Bx.left-1||r.right>Bx.right+1||r.top<Bx.top-1||r.bottom>Bx.bottom+1)add(`${at}: "${name(t)}" goes past the board edge`);
        for(let j=i+1;j<ts.length;j++){const q=rs[j],ox=Math.min(r.right,q.right)-Math.max(r.left,q.left),oy=Math.min(r.bottom,q.bottom)-Math.max(r.top,q.top);if(ox>3&&oy>.3*Math.min(r.height,q.height))add(`${at}: "${name(t)}" overlaps "${name(ts[j])}"`)}
        if(r.right>Bx.left+.9*Bx.width&&r.top<Bx.top+.1*Bx.height)add(`${at}: "${name(t)}" sits in the Why? corner`);
        if(r.right>Bx.left+.83*Bx.width&&r.bottom>Bx.top+.91*Bx.height)add(`${at}: "${name(t)}" sits in the corner of the "Space: play" note`);
        if(!t.classList.contains('c'))circ.forEach(c=>{if(inter(r,c)>.25*c.width*c.height)add(`${at}: "${name(t)}" covers a node`)});
        /* text over a figure: its labels, or the pixels it has drawn under the text */
        figs.forEach(f=>{const F=R(f);if(!inter(r,F))return;
          for(const l of f.querySelectorAll('.fl>div'))if(inter(r,R(l))>4)add(`${at}: "${name(t)}" overlaps the figure label "${name(l)}"`);
          const cv=f.querySelector('canvas'),k=cv.width/F.width,x0=Math.max(r.left,F.left),y0=Math.max(r.top,F.top),x1=Math.min(r.right,F.right),y1=Math.min(r.bottom,F.bottom);
          const w=Math.round((x1-x0)*k),h=Math.round((y1-y0)*k);if(w<1||h<1)return;
          const px=cv.getContext('2d').getImageData(Math.round((x0-F.left)*k),Math.round((y0-F.top)*k),w,h).data;let n=0;for(let q=3;q<px.length;q+=4)if(px[q]>40)n++;
          if(n>12*k*k)add(`${at}: "${name(t)}" lies on the drawing of a figure`)})});
      /* figure labels on one another, under the buttons of the figure, and past the board */
      const fl=[...bd.querySelectorAll('.fig .fl>div')].filter(l=>l.textContent.trim()),fr=fl.map(R);
      fl.forEach((l,i)=>{const r=fr[i];if(r.left<Bx.left-1||r.right>Bx.right+1||r.top<Bx.top-1||r.bottom>Bx.bottom+1)add(`${at}: figure label "${name(l)}" goes past the board edge`);
        for(let j=i+1;j<fl.length;j++){const q=fr[j];if(inter(r,q)>.2*Math.min(r.width*r.height,q.width*q.height))add(`${at}${tag}: figure labels "${name(l)}" and "${name(fl[j])}" overlap`)}
        for(const c of bd.querySelectorAll('.fig .fc>*,.fig .fz'))if(!c.hidden&&c.offsetParent&&inter(r,R(c))>0)add(`${at}${tag}: figure label "${name(l)}" is under the buttons above the picture`)})};
    /* one slide from the state before it, step by step (upTo(k, i) for every i would replay the talk each time); the buttons of the figures on it are noted */
    const runSlide=(k,tag,ctl)=>steps(k).forEach((st,si)=>{(st.do||[]).forEach(a=>B.run(a,true));check(k,si,tag);
      if(ctl)for(const o of B.figs())for(const c of o.F.controls||[])if(c.values)ctl.set(c.key,c)});
    for(const k in UP)delete UP[k];
    const ctls=new Map();let prev=-2;
    for(const k of ks){if(k!==prev+1)B.upTo(k,0);const ctl=new Map();for(const o of B.figs())for(const c of o.F.controls||[])if(c.values)ctl.set(c.key,c);runSlide(k,'',ctl);ctls.set(k,ctl);prev=k}
    /* every choice of the buttons of the figures on a slide: their values in all combinations (at most 64), on that slide only */
    for(const k of ks){let combos=[{}];for(const c of ctls.get(k).values())if(combos.length*c.values.length<=64)combos=combos.flatMap(o=>c.values.map(v=>Object.assign({},o,{[c.key]:v})));
      if(combos.length<2)continue;
      for(const cmb of combos){for(const q in UP)delete UP[q];Object.assign(UP,cmb);B.upTo(k,0);runSlide(k,' ['+Object.entries(cmb).map(([a,b])=>a+'='+b).join(' ')+']')}}
    for(const k in UP)delete UP[k];
    /* the texts of the questions: answer, hint, remarks */
    const tmp=document.createElement('div');tmp.style.cssText='position:absolute;left:-9999px;width:600px';app.appendChild(tmp);S.slides.forEach((sl,k)=>steps(k).forEach((st,si)=>{const q=st.q;if(!q)return;
      tmp.innerHTML=[q.show,q.hint,q.then,...(q.wrong||[]).map(w=>w.say)].map(x=>fmt(x||'',G)).join(' ');const raw=tmp.innerText.match(RAW);
      if(raw)add(`${k+1}.${si+1}: raw markup "${raw[0]}" in the question's answer or remarks`);if(tmp.querySelector('.katex-error'))add(`${k+1}.${si+1}: KaTeX error in the question`)}));tmp.remove();
    SET.ask=prevAsk;finish(K0);
    const keep=capt.innerHTML,avail=cap.clientHeight;
    if(cap.offsetParent)S.slides.forEach((sl,k)=>allSteps[k].forEach((st,i)=>{capt.innerHTML=fmt(plainTerms(st.say),G);if(capt.scrollHeight>avail+2)out.push(`${k+1}.${i+1}: caption longer than the strip`)}));
    capt.innerHTML=keep;
    if(app.querySelector('.katex-error'))out.push('KaTeX errors on the page');
    return out}
  window.MB_LINT=lint;
  window.MB_ST=()=>({state,k:K0+1,i:I0+1,pre,nxt,drawing,wipe,auto:AUTO});  /* debug: where the player stands */
  window.MB_AT=(k,i)=>{token++;hush();B.upTo(k,i)};  /* debug: show the board after i steps of slide k (0-based) */
  /* #3 opens slide 3; #id opens the card with that Id: */
  const hid=S.slides.findIndex(s=>s.id&&'#'+s.id===location.hash),h=hid>=0?hid+1:+(location.hash.match(/^#(\d+)$/)||[])[1];
  placeSide();
  let P=null;if(!(h>0&&h<=N))try{P=JSON.parse(localStorage.getItem(PKEY)||'null')}catch(e){}
  if(P&&P.k>=0&&P.k<N){const n=steps(P.k).length;if(P.s==='done'||P.s==='gap')finish(P.k);else{const i=visibleAt(P.k,P.i),j=(i<0?n:i)-(P.s==='held'?0:1);j>=n?finish(P.k):j>=0?hold(P.k,j):ready(P.k)}}
  else ready(h>0&&h<=N?h-1:0);
  posOn=true;
  return {playFrom,finish,setView,get pos(){return {k:K0,i:I0,state,view}},N};
}
return {mount,figure:(kind,F)=>{FIGS[kind]=F}};
})();
