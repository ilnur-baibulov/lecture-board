/* Figures for Frankel, The Geometry of Physics, §19.1 (The groups SO(3) and SU(2)):
   angularCone (Fig. 19.1, angular velocity on a cone) and dials (one turn in SU(2), two turns in space). */
(function(){
const R=String.raw,PI=Math.PI,PI2=2*PI;

function piT(t){const n=Math.round(t*24);if(!n)return '0';const gcd=(a,b)=>b?gcd(b,a%b):a,g=gcd(Math.abs(n),24),p=n/g,q=24/g;
  const num=(Math.abs(p)===1?'':Math.abs(p))+R`\pi`;return (p<0?'-':'')+(q===1?num:R`\tfrac{${num}}{${q}}`)}
function arc(g,cx,cy,r,a0,a1,col,w){const n=Math.max(2,Math.ceil(Math.abs(a1-a0)/0.05)),q=[];
  for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;q.push([cx+r*Math.cos(a),cy-r*Math.sin(a)])}g.line(q,col,w);return q}

Board.figure('angularCone',{init:{tangent:false},draw(g,s){
  const elevation=27*PI/180, h=1.16, radius=.83;
  const scale=Math.min(g.W*.40,g.H*.43),cx=g.W*.46,cy=g.H*.84;
  const P=([x,y,z])=>[cx+scale*x,cy-scale*(Math.sin(elevation)*y+Math.cos(elevation)*z)];
  const O=P([0,0,0]),center=P([0,0,h]);
  const rim=a=>[radius*Math.cos(a),-radius*Math.sin(a),h];
  const rimArc=(a,b)=>Array.from({length:81},(_,i)=>P(rim(a+(b-a)*i/80)));
  const edge=Math.asin(radius*Math.tan(elevation)/h);
  g.fill([O,...rimArc(PI-edge,2*PI+edge)],'c1',.14);
  g.fill(rimArc(0,2*PI),'c1',.13);
  g.line([O,P(rim(edge))],'c1',2.5);
  g.line([O,P(rim(PI-edge))],'c1',2.5);
  g.line(rimArc(PI,2*PI),'dim',2,[6,5]);
  g.line(rimArc(0,PI),'c1',3);
  g.arrow(P([0,0,-.14]),P([0,0,1.64]),'dim',2.5);
  g.label(...P([0,0,1.64]),R`\mathbf n,\ \boldsymbol\omega`,'ink','n',.8);
  g.dot(...center,4,'dim');
  const start=rim(2.23),a=.92,current=rim(a);
  g.arrow(O,P(start),'dim',3);
  g.arrow(O,P(current),'c1',4);
  g.dot(...P(start),5,'dim');g.dot(...P(current),6,'c1');
  g.label(...P(start),R`\mathbf r(0)`,'ink','w',.8);
  g.label(...P(current.map(x=>x*.64)),R`\mathbf r(t)`,'c1','se',.8);
  if(s.tangent){
    const end=P([current[0]+.60*Math.sin(a),current[1]+.60*Math.cos(a),h]);
    g.arrow(P(current),end,'c2',4);
    g.label(...end,R`\dot{\mathbf r}(t)`,'c2','n',.8);
  }
  g.dot(...O,5,'ink');g.label(...O,'O','ink','sw',.75);
}});

const TQ=[{key:'tq',type:'range',min:0,max:96,label:R`\theta`,name:'Angle',readoutWidth:3.2,replay:3600,tex:v=>piT(v/24),show:s=>s.live}];
Board.figure('dials',{inspect:true,init:{tq:0,live:false,half:false},controls:TQ,draw(g,s){
  const th=s.tq*PI/24,a=s.half?th/2:th,b=s.half?th:2*th,r=Math.min(g.W*.17,g.H*.29),cy=g.H*.61,L=g.W*.25,Rc=g.W*.72;
  const ci=[];for(let i=0;i<=160;i++){const t=i/160*PI2;ci.push([L+r*Math.cos(t),cy-r*Math.sin(t)])}g.line(ci,'dim',1.5,[6,8]);
  g.line([[L-r-30,cy],[L+r+30,cy]],'grid',1);g.line([[L,cy-r-30],[L,cy+r+30]],'grid',1);
  g.dot(L+r,cy,6,'ink');g.label(L+r+8,cy,'I','ink','e',.85);g.dot(L-r,cy,6,'ink');g.label(L-r-8,cy,'-I','ink','w',.85);
  if(a>0)arc(g,L,cy,r,0,-a,'c1',5);
  g.dot(L+r*Math.cos(-a),cy-r*Math.sin(-a),10,'c1');
  g.label(L,cy-r-44,R`u_{11}`,'c1','n',.9);
  g.line([[Rc-r-30,cy],[Rc+r+30,cy]],'grid',1);g.line([[Rc,cy-r-30],[Rc,cy+r+30]],'grid',1);
  if(b>0){const n=Math.ceil(b/0.04),q=[];for(let i=0;i<=n;i++){const t=b*i/n,rr=r*(.30+.10*t/PI2);q.push([Rc+rr*Math.cos(t),cy-rr*Math.sin(t)])}g.line(q,'c2',3)}
  const ex=[Rc+r*Math.cos(b),cy-r*Math.sin(b)];g.arrow([Rc,cy],ex,'c2',4);g.label(ex[0],ex[1],R`R\,\mathbf e_1`,'c2',Math.cos(b)>=0?'e':'w',.85);
  g.label(Rc,cy-r-44,R`xy\text{-plane}`,'c2','n',.9);
  const turns=Math.floor(b/PI2+1e-9);
  g.label(Rc,cy+r+40,turns===1?R`1\ \text{full turn}`:R`${turns}\ \text{full turns}`,'c2','s',.8);
  g.label(L,cy+r+40,R`\theta=${piT(th/PI)}`,'ink','s',.85);
}});
})();
