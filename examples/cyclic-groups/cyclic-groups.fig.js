/* figures of the cyclic-groups lesson cards */
(function(){
const R=String.raw;

/* 1.1: the powers of a in C*, first for a = e^{2πi/6} along the proof, then for the chosen example z.
   view: which step's marks are shown; pk, dv, ue: progress of the three motions (0..1);
   hexa: the hexagon 1, a, …, a^5; ang: the angle θ; nm: the letter (a, then z); ex: the examples; z: the chosen example */
const Z=[
  {t:'i',a:Math.PI/2,r:1,m:4,fr:R`\frac14`},
  {t:R`e^{2\pi i/6}`,a:Math.PI/3,r:1,m:6,fr:R`\frac16`},
  {t:R`\frac{1+i}{\sqrt2}`,a:Math.PI/4,r:1,m:8,fr:R`\frac18`},
  {t:R`e^{4\pi i/5}`,a:4*Math.PI/5,r:1,m:5,fr:R`\frac25`},
  {t:'1+i',a:Math.PI/4,r:Math.SQRT2,m:0,km:5},
  {t:R`\frac{3+4i}5`,a:Math.atan2(4,3),r:1,m:0,km:60}];
const A6=Z[1],KM=z=>z.m||z.km;
const TOP={min:R`m=6`,sub:R`\langle a\rangle=\{1,a,a^2,a^3,a^4,a^5\}`,dist:R`\langle a\rangle=\{1,a,a^2,a^3,a^4,a^5\}`,ordm:R`\operatorname{ord}a=6`,
  kl2:R`a^k=a^l\iff k\equiv l\pmod 6`,zero:R`a^{k-l}=a^r=1\iff r=0`,moivre:R`\lvert z\rvert=1,\qquad\theta=\frac{2\pi}6`,nec:R`\frac\theta{2\pi}=\frac16,\qquad z^6=1`,suf:R`z^k=1\iff 6\mid k`,irr:R`z^k=1\iff 6\mid k`};
/* the plane: origin O, unit U, the point of the power k */
const geo=(s,W,H)=>{const z=s.ex?Z[s.z]:A6,km=KM(z),big=z.r>1;
  const U=big?H*.44/Math.pow(z.r,km):H*.36,O=[W/2-(big?W*.12:0),H/2+(big?H*.08:0)];
  const P=(r,a)=>[O[0]+U*r*Math.cos(a),O[1]-U*r*Math.sin(a)];return {z,km,big,U,O,P,Pk:k=>P(Math.pow(z.r,k),k*z.a)}};
/* questions: a click names the power a^k, 0 ≤ k < 6, under the pointer (a0 is the point 1); qpick is marked, green if right */
Board.figure('powers',{size:[725,500],init:{view:'pic',pk:0,dv:0,ue:0,hexa:false,ang:false,nm:'a',ex:false,z:0,lock:false,qpick:'',qok:false,qhover:''},
  controls:[
    {key:'z',values:Z.map((_,i)=>i),tex:i=>'z='+Z[i].t,show:s=>s.ex&&!s.lock},
    {key:'pk',type:'range',min:0,max:1,step:1/8,inspect:true,label:'k',name:'Power k',tex:v=>String(Math.round(v*8)),readoutWidth:1.6,replay:3600,show:s=>!s.ex&&s.view==='pic'},
    {key:'dv',type:'range',min:0,max:1,step:1/15,inspect:true,label:'k',name:'Exponent k',tex:v=>String(Math.round(v*15)),readoutWidth:1.8,replay:4500,show:s=>!s.ex&&s.view==='div'},
    {key:'ue',type:'range',min:0,max:1,step:.01,inspect:true,label:'k',name:'Power k',tex:(v,s)=>String(Math.floor(v*KM(Z[s.z])+1e-9)),readoutWidth:1.8,replay:3600,show:s=>s.ex&&!s.lock}
  ],
  hit(s,x,y,W,H){if(s.ex)return null;const {Pk}=geo(s,W,H);for(let k=0;k<6;k++){const q=Pk(k);if(Math.hypot(q[0]-x,q[1]-y)<22)return 'a'+k}return null},
  text(s){const z=Z[s.z];return {zt:z.t,m:z.m,fr:z.fr,kind:z.m?'fin':z.r>1?'big':'irr'}},
  draw(g,s){
    const W=g.W,H=g.H,{z,km,big,O,P,Pk}=geo(s,W,H);
    const out=(k,txt,c,d)=>{const t=k*z.a,q=Pk(k),cx=Math.cos(t),sy=Math.sin(t);
      g.label(q[0]+cx*d,q[1]-sy*d,txt,c,(sy>=-1e-9?'n':'s')+(cx>=-1e-9?'e':'w'))};
    const pw=k=>k===1?s.nm:`${s.nm}^{${k}}`,one=P(1,0),TL=t=>g.label(W*.03,s.ex&&!s.lock?H*.12:H*.04,t,'ink','se');
    g.line([[0,O[1]],[W,O[1]]],'axis',1);g.line([[O[0],0],[O[0],H]],'axis',1);
    const ring=[];for(let i=0;i<=96;i++)ring.push(P(1,i/96*2*Math.PI));g.line(ring,'dim',1.3,[5,5]);
    if(!s.ex){
      const v=s.view,K=v==='pic'?Math.floor(s.pk*8+1e-9):8,KL=v==='kl';
      if(s.hexa){const hx=[];for(let k=0;k<=6;k++)hx.push(Pk(k));g.line(hx,'grid',1.5)}
      for(let k=1;k<=Math.min(K,5);k++){const q=Pk(k);g.dot(q[0],q[1],6,'c1');if(!(KL&&k===2))out(k,pw(k),'ink',10)}
      g.dot(one[0],one[1],7,'c2');if(!KL&&v!=='zero')g.label(one[0]+4,one[1]+6,'1','c2','se');
      if(v==='pic'&&K>0){const q=Pk(K);g.ring(q[0],q[1],13,'ink',2.5);if(K>5)out(K,pw(K),'ink',30)}
      if(KL){const q=Pk(2);g.ring(q[0],q[1],13,'ink',2.5);out(2,`${s.nm}^{8}=${s.nm}^{2}`,'ink',12);g.ring(one[0],one[1],13,'c2',2.5);g.label(one[0]+4,one[1]+6,`${s.nm}^{6}=1`,'c2','se')}
      if(s.ang){const ar=[];for(let i=0;i<=24;i++)ar.push(P(.22,i/24*z.a));g.line(ar,'ink',1.5);g.line([O,Pk(1)],'ink',1.5);const m=P(.3,z.a/2);g.label(m[0],m[1],R`\theta`,'ink','ne')}
      if(s.qhover&&s.qhover!==s.qpick){const q=Pk(+s.qhover.slice(1));g.ring(q[0],q[1],15,'dim',2)}
      if(s.qpick){const q=Pk(+s.qpick.slice(1));g.ring(q[0],q[1],15,s.qok?'c3':'warn',3)}
      if(v==='zero'){g.ring(one[0],one[1],13,'c2',2.5);g.label(one[0]+4,one[1]+6,R`${s.nm}^{0}=1`,'c2','se')}
      /* a^k written in two factors: (a^6)^q is 1, coloured as the point 1; the factor a^r gives the point */
      if(v==='div'){const k=Math.min(15,Math.floor(s.dv*15+1e-9)),q=Math.floor(k/6),r=k%6,p=Pk(r),C2=g.col('c2'),n=s.nm;
        g.ring(p[0],p[1],13,'ink',2.5);TL(R`k=${k}=${q}\cdot 6+${r},\qquad ${n}^{${k}}=\textcolor{${C2}}{(${n}^{6})^{${q}}}\,${n}^{${r}}=${n}^{${r}}`)}
      else if(TOP[v])TL(TOP[v]);
      return}
    /* the chosen example */
    const fin=z.m>0,K=Math.floor(s.ue*km+1e-9),pts=[];for(let k=0;k<=K;k++)pts.push(Pk(k));
    if(K>0&&(big||fin))g.line(pts,'grid',1.5);
    g.dot(one[0],one[1],7,'c2');
    for(let k=1;k<=K;k++){if(fin&&k%z.m===0)continue;const q=pts[k];g.dot(q[0],q[1],km>20?3.5:6,'c1');if(k<=(km>20?3:8))out(k,pw(k),'ink',10)}
    if(fin&&K>=z.m){g.ring(one[0],one[1],13,'c2',2.5);g.label(one[0]+4,one[1]+6,`z^{${z.m}}=1`,'c2','se')}
    else g.label(one[0]+4,one[1]+6,'1','c2','se');
    const res=s.view==='exr'||s.view==='fin';
    if(res&&big)g.label(pts[K][0]+6,pts[K][1]+4,R`\lvert z^{${K}}\rvert=2^{${K}/2}`,'dim','se');
    if(res)TL(fin?R`\operatorname{ord}z=${z.m}`:R`\operatorname{ord}z=\infty`);
  }});

/* 1.2: the house F and its images M^k F under a 2×2 matrix M, first for the matrices of the proof (mi), then for the chosen example (mz).
   pk: progress of the motion, the images M F, …, M^km F appear one by one; top: the formula above the picture */
const MX=[{m:[0,-1,1,0],rot:true,o:4},{m:[1,-2,1,-1],o:4},{m:[0,1,-1,-1],o:3},{m:[1,-1,1,0],o:6},{m:[1,1,0,1],o:0},{m:[2,1,-1,0],o:0}];
MX.forEach(x=>x.km=x.o||3);
const PM=a=>R`\begin{pmatrix}${a[0]}&${a[1]}\\${a[2]}&${a[3]}\end{pmatrix}`;
const mm=(A,B)=>[A[0]*B[0]+A[1]*B[2],A[0]*B[1]+A[1]*B[3],A[2]*B[0]+A[3]*B[2],A[2]*B[1]+A[3]*B[3]];
const mpow=(A,k)=>{let Y=[1,0,0,1];for(let i=0;i<k;i++)Y=mm(A,Y);return Y};
const ap=(Y,p)=>[Y[0]*p[0]+Y[1]*p[1],Y[2]*p[0]+Y[3]*p[1]];
const HOUSE=[[.9,.3],[1.9,.3],[1.9,1.1],[1.4,1.7],[.9,1.1]];
const TIMES={3:'three times',4:'four times',6:'six times'};
const TOPM={sq:x=>R`M=${PM(x.m)},\quad M^2=${PM(mpow(x.m,2))}`,rel:()=>R`M^2+M+I=0`,
  n:x=>R`M=${PM(x.m)},\quad N=M-I=${PM([x.m[0]-1,x.m[1],x.m[2],x.m[3]-1])}`,pow:()=>R`M^k=I+kN=\begin{pmatrix}1&k\\0&1\end{pmatrix}`};
Board.figure('house',{size:[725,500],zoom:true,init:{mi:-1,pk:0,top:'',ex:false,mz:0,lock:false},
  controls:[
    {key:'mz',values:MX.map((_,i)=>i),tex:i=>PM(MX[i].m),show:s=>s.ex&&!s.lock},
    {key:'pk',type:'range',min:0,max:1,step:.01,inspect:true,label:'k',name:'Step k',tex:(v,s)=>String(Math.floor(v*(s.ex?MX[s.mz].km:3)+1e-9)),readoutWidth:1.6,replay:2400,show:s=>(!s.ex&&s.top==='auto')||(s.ex&&!s.lock)}
  ],
  text(s){const x=MX[s.mz];return {Mt:PM(x.m),times:TIMES[x.km],kind:x.o?'o'+x.o:'inf'}},
  draw(g,s){
    const W=g.W,H=g.H,x=s.ex?MX[s.mz]:s.mi>=0?MX[s.mi]:null;
    /* the scale fits the house and all the images that will appear for this matrix */
    let bx=[-.4,-.4,2.4,2.2];
    if(x)for(let k=1;k<=x.km;k++)for(const p of HOUSE){const q=ap(mpow(x.m,k),p);bx=[Math.min(bx[0],q[0]),Math.min(bx[1],q[1]),Math.max(bx[2],q[0]),Math.max(bx[3],q[1])]}
    const U=Math.min(W*.84/(bx[2]-bx[0]),H*.68/(bx[3]-bx[1]),H/5),O=[W/2-U*(bx[0]+bx[2])/2,H*.58+U*(bx[1]+bx[3])/2];
    const P=p=>[O[0]+U*p[0],O[1]-U*p[1]];
    /* the grid and the axes cover the whole visible area, also when zoomed out */
    const [x0,y0,x1,y1]=g.view;
    for(let i=Math.floor((x0-O[0])/U);i<=Math.ceil((x1-O[0])/U);i++){const a=P([i,0]);g.line([[a[0],y0],[a[0],y1]],'grid',1)}
    for(let i=Math.floor((O[1]-y1)/U);i<=Math.ceil((O[1]-y0)/U);i++){const a=P([0,i]);g.line([[x0,a[1]],[x1,a[1]]],'grid',1)}
    g.line([[x0,O[1]],[x1,O[1]]],'axis',1.5);g.line([[O[0],y0],[O[0],y1]],'axis',1.5);
    const flag=(Y,col,w)=>{const Q=HOUSE.map(p=>P(ap(Y,p)));g.fill(Q,col,.15);g.fill([Q[2],Q[3],Q[4]],col,.35);g.line([...Q,Q[0]],col,w);g.line([Q[2],Q[4]],col,w*.7);return Q};
    const q0=flag([1,0,0,1],'ink',3),T=x?s.pk*x.km:0,n=Math.floor(T+1e-9),u=T-n,back=x&&x.o&&n>=x.km;
    g.label(q0[3][0],q0[3][1],back?`F=M^{${x.o}}F`:'F','ink','n');
    /* the formula goes below the row of example buttons when it is shown */
    const TR=t=>g.fixed(W-12,s.ex&&!s.lock?62:!s.ex&&s.top==='auto'?42:12,t,'ink','sw',.9);
    if(!x)return;
    const COL=['c1','c2','c3','c4','c5'];
    for(let k=1;k<=Math.min(n,x.km);k++){if(x.o&&k===x.o)continue;const Q=flag(mpow(x.m,k),COL[(k-1)%5],2.5);
      g.label(Q[3][0],Q[3][1],k===1?'MF':`M^{${k}}F`,COL[(k-1)%5],(Q[3][1]<=O[1]?'n':'s')+(Q[3][0]>=O[0]?'e':'w'),.9)}
    /* between two images: a rotation turns by a quarter, any other matrix moves the house straight */
    if(n<x.km&&u>0){const A0=mpow(x.m,n),e=u*u*(3-2*u);let Y;
      if(x.rot){const t=e*Math.PI/2;Y=mm([Math.cos(t),-Math.sin(t),Math.sin(t),Math.cos(t)],A0)}
      else{const A1=mpow(x.m,n+1);Y=A0.map((v,i)=>v+(A1[i]-v)*e)}
      flag(Y,COL[n%5],2)}
    TR(s.top&&TOPM[s.top]?TOPM[s.top](x):n>=x.km?R`M=${PM(x.m)},\quad M^{${x.km}}=${PM(mpow(x.m,x.km))}`:R`M=${PM(x.m)}`);
  }});
})();
