/* مختبر الذكاء الاصطناعي: ثلاثة نماذج تُدرَّب فعلياً في المتصفح على بيانات اصطناعية */
(function(){
const $=s=>document.querySelector(s);
const C={teal:'#2dd4bf',blue:'#60a5fa',amber:'#fbbf24',red:'#f87171',green:'#4ade80',mute:'#9fb0d0',line:'#25335a'};
const rng=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const gauss=r=>{let u=0;while(!u)u=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*r())};
function solve(A,b){const n=b.length,M=A.map((r,i)=>[...r,b[i]]);
 for(let i=0;i<n;i++){let p=i;for(let r=i+1;r<n;r++)if(Math.abs(M[r][i])>Math.abs(M[p][i]))p=r;[M[i],M[p]]=[M[p],M[i]];
  for(let r=i+1;r<n;r++){const f=M[r][i]/M[i][i];for(let c=i;c<=n;c++)M[r][c]-=f*M[i][c]}}
 const x=Array(n).fill(0);for(let i=n-1;i>=0;i--){let s=M[i][n];for(let c=i+1;c<n;c++)s-=M[i][c]*x[c];x[i]=s/M[i][i]}return x}
function ridge(X,y,lam=1e-2){const k=X[0].length,A=Array.from({length:k},()=>Array(k).fill(0)),b=Array(k).fill(0);
 X.forEach((x,i)=>{for(let a=0;a<k;a++){b[a]+=x[a]*y[i];for(let c=0;c<k;c++)A[a][c]+=x[a]*x[c]}});
 for(let a=1;a<k;a++)A[a][a]+=lam;return solve(A,b)}
const dot=(w,x)=>w.reduce((s,v,i)=>s+v*x[i],0);
const sig=z=>1/(1+Math.exp(-z));
const erf=x=>{const s=Math.sign(x);x=Math.abs(x);const t=1/(1+0.3275911*x);return s*(1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x))};
const Phi=z=>0.5*(1+erf(z/Math.SQRT2));
const mean=a=>a.reduce((s,v)=>s+v,0)/a.length;

/* ===== النموذج 1: توقع الطلب ===== */
const DAYS=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'];
(function(){
  const r=rng(11),BASE=[20,14,19,12,10],EXAM=new Set([5,6,11,12]);
  const rows=[];
  for(let w=0;w<14;w++)for(let d=0;d<5;d++)rows.push({w,d,ex:EXAM.has(w)?1:0,y:BASE[d]+0.35*w+(EXAM.has(w)?5:0)+gauss(r)*1.8});
  const feat=(w,d,ex)=>[1,d===1,d===2,d===3,d===4,ex,w/10].map(Number);
  const fit=rs=>ridge(rs.map(o=>feat(o.w,o.d,o.ex)),rs.map(o=>o.y));
  const tr=rows.filter(o=>o.w<12),te=rows.filter(o=>o.w>=12);
  const w1=fit(tr);
  const mae=a=>mean(a.map(Math.abs));
  const mErr=mae(te.map(o=>dot(w1,feat(o.w,o.d,o.ex))-o.y));
  const nErr=mae(te.map(o=>rows.find(p=>p.w===o.w-1&&p.d===o.d).y-o.y));
  const W=fit(rows),sd=Math.sqrt(mean(rows.map(o=>(dot(W,feat(o.w,o.d,o.ex))-o.y)**2)))*1.1;
  $('#lab1Eval').innerHTML=`تقييم على أسبوعين لم يرَهما النموذج: متوسط الخطأ المطلق <b class="ok">${mErr.toFixed(2)}</b> طلب للنموذج مقابل <b class="warn">${nErr.toFixed(2)}</b> للطريقة الساذجة «مثل الأسبوع الماضي» — أي أفضل بنسبة <b>${((1-mErr/nErr)*100).toFixed(0)}%</b>.`;
  const chk=$('#l1ex');
  function draw(){
    const ex=chk.checked?1:0,last=rows.filter(o=>o.w===13);
    let s=`<svg viewBox="0 0 620 270"><line x1="40" y1="220" x2="600" y2="220" stroke="${C.line}"/>`;
    const ymax=34,Y=v=>220-v/ymax*190;
    [0,10,20,30].forEach(v=>s+=`<line x1="40" y1="${Y(v)}" x2="600" y2="${Y(v)}" stroke="${C.line}" stroke-dasharray="3 4"/><text x="34" y="${Y(v)+4}" font-size="11" fill="${C.mute}" text-anchor="end">${v}</text>`);
    DAYS.forEach((d,i)=>{
      const x=540-i*110,p=dot(W,feat(14,i,ex)),lo=p-1.28*sd,hi=p+1.28*sd;
      s+=`<text x="${x}" y="245" font-size="13" fill="#e8edf7" text-anchor="middle">${d}</text>`;
      s+=`<rect x="${x-34}" y="${Y(hi)}" width="68" height="${Y(lo)-Y(hi)}" rx="6" fill="${C.teal}" opacity=".25"/>`;
      s+=`<rect x="${x-24}" y="${Y(p)}" width="48" height="${220-Y(p)}" rx="5" fill="${C.teal}"/>`;
      s+=`<text x="${x}" y="${Y(hi)-6}" font-size="12.5" fill="#e8edf7" text-anchor="middle" font-weight="700">${p.toFixed(0)} (${lo.toFixed(0)}–${hi.toFixed(0)})</text>`;
      s+=`<circle cx="${x}" cy="${Y(last[i].y)}" r="5" fill="${C.amber}"/>`;
    });
    $('#l1Svg').innerHTML=s+`</svg><div class="legend"><span><i class="sw" style="background:${C.teal}"></i>توقع الأسبوع القادم (ونطاق 80%)</span><span><i class="sw" style="background:${C.amber}"></i>الأسبوع الماضي الفعلي</span></div>`;
  }
  chk.onchange=draw;draw();
})();

/* ===== النموذج 2: مخاطر الإلغاء ===== */
(function(){
  const r=rng(23),D=[];
  for(let i=0;i<900;i++){const thu=r()<.2?1:0,rate=r()*.5,lead=1+r()*71,ex=r()<.15?1:0;
    const p=sig(-3.0+0.9*thu+5*rate+0.02*lead-0.7*ex);D.push({x:[1,thu,rate*4,lead/24,ex],y:r()<p?1:0})}
  const tr=D.slice(0,700),te=D.slice(700);
  let w=[0,0,0,0,0];
  for(let it=0;it<2000;it++){const g=[0,0,0,0,0];tr.forEach(o=>{const e=sig(dot(w,o.x))-o.y;o.x.forEach((v,k)=>g[k]+=e*v)});w=w.map((v,k)=>v-0.5*g[k]/tr.length)}
  const pr=te.map(o=>sig(dot(w,o.x))),base=mean(tr.map(o=>o.y));
  const ll=(p,y)=>-(y*Math.log(Math.max(p,1e-9))+(1-y)*Math.log(Math.max(1-p,1e-9)));
  const mll=mean(te.map((o,i)=>ll(pr[i],o.y))),bll=mean(te.map(o=>ll(base,o.y)));
  let wins=0,tot=0;te.forEach((a,i)=>{if(a.y!==1)return;te.forEach((b,j)=>{if(b.y!==0)return;tot++;wins+=pr[i]>pr[j]?1:pr[i]===pr[j]?.5:0})});
  $('#lab2Eval').innerHTML=`تقييم على 200 رحلة لم يرَها النموذج: AUC = <b class="ok">${(wins/tot).toFixed(2)}</b> (0.5 = تخمين عشوائي)، وخسارة اللوغاريتم <b class="ok">${mll.toFixed(3)}</b> مقابل <b class="warn">${bll.toFixed(3)}</b> لتوقع معدل ثابت للجميع.`;
  const ids=['l2t','l2r','l2l','l2e'];
  function up(){
    const thu=$('#l2t').checked?1:0,rate=+$('#l2r').value,lead=+$('#l2l').value,ex=$('#l2e').checked?1:0;
    $('#l2ro').textContent=rate+'%';$('#l2lo').textContent=lead+' ساعة';
    const p=sig(dot(w,[1,thu,rate/100*4,lead/24,ex]))*100;
    let lvl,cls,act;
    if(p<15){lvl='منخفض';cls='ok';act='لا إجراء إضافي: يُحجز المقعد كالمعتاد.'}
    else if(p<35){lvl='متوسط';cls='';act='يُرسل تذكير وإعادة تأكيد قبل الرحلة، ويُحتفظ بطالب مطابق في قائمة الانتظار.'}
    else{lvl='مرتفع';cls='warn';act='يُطلب تأكيد صريح، وتُجهَّز قائمة انتظار مسبقاً لملء المقعد إن ألغى. لا يُعاقَب الطالب ولا يُمنع.'}
    $('#l2Res').innerHTML=`احتمال الإلغاء: <span class="big ${cls}">${p.toFixed(0)}%</span> — خطر <b class="${cls}">${lvl}</b><br>${act}`;
  }
  ids.forEach(i=>$('#'+i).oninput=up);up();
})();

/* ===== النموذج 3: زمن الرحلة و P90 ===== */
(function(){
  const r=rng(37),D=[];
  for(let i=0;i<1200;i++){const dist=3+r()*17,pk=r()<.4?1:0,rn=r()<.2?1:0;
    const mu=Math.log((3*dist+5)*(1+.35*pk+.2*rn)),s=.08+.10*pk+.05*rn;
    D.push({x:[1,Math.log(dist),pk,rn],t:Math.exp(mu+s*gauss(r))})}
  const tr=D.slice(0,1000),te=D.slice(1000);
  const wm=ridge(tr.map(o=>o.x),tr.map(o=>Math.log(o.t)));
  const res=tr.map(o=>Math.log(o.t)-dot(wm,o.x));
  const ws=ridge(tr.map(o=>[1,o.x[2],o.x[3]]),res.map(v=>Math.abs(v)*1.2533));
  const sg=x=>Math.max(.03,dot(ws,[1,x[2],x[3]]));
  const pred=x=>({mu:dot(wm,x),s:sg(x)});
  const cov=mean(te.map(o=>{const q=pred(o.x);return Math.log(o.t)<=q.mu+1.2816*q.s?1:0}))*100;
  const cst=mean(tr.map(o=>o.t)),rm=a=>Math.sqrt(mean(a.map(v=>v*v)));
  const e1=rm(te.map(o=>Math.exp(pred(o.x).mu)-o.t)),e0=rm(te.map(o=>cst-o.t));
  $('#lab3Eval').innerHTML=`تقييم على 200 رحلة لم يرَها النموذج: خطأ زمن الرحلة <b class="ok">${e1.toFixed(1)}</b> دقيقة مقابل <b class="warn">${e0.toFixed(1)}</b> لو استخدمنا المتوسط الثابت. ونسبة الرحلات التي وصلت ضمن P90 المتوقع: <b class="ok">${cov.toFixed(0)}%</b> (الهدف 90%) — أي أن النموذج «معايَر».`;
  function up(){
    const dist=+$('#l3d').value,pk=$('#l3p').checked?1:0,rn=$('#l3r').checked?1:0,av=+$('#l3a').value;
    $('#l3do').textContent=dist+' كم';$('#l3ao').textContent=av+' د';
    const q=pred([1,Math.log(dist),pk,rn]),p50=Math.exp(q.mu),p90=Math.exp(q.mu+1.2816*q.s),buf=p90-p50;
    const prob=Phi((Math.log(av)-q.mu)/q.s)*100;
    const fixedP=Phi((Math.log(p50+8)-q.mu)/q.s)*100;
    $('#l3Res').innerHTML=`زمن الرحلة المتوقع (P50): <b>${p50.toFixed(0)} د</b> · الأسوأ المعقول (P90): <b>${p90.toFixed(0)} د</b><br>
     هامش الأمان الذي يقترحه النموذج: <span class="big">${buf.toFixed(0)} د</span> (بدل رقم ثابت)<br>
     إذا كان الوقت المتاح ${av} د: احتمال الوصول في الوقت = <span class="big ${prob>=90?'ok':prob>=75?'':'warn'}">${prob.toFixed(0)}%</span><br>
     <span class="note">لو استخدمنا هامشاً ثابتاً 8 دقائق في هذه الظروف لكان احتمال الوصول ${fixedP.toFixed(0)}% فقط.</span>
     <br><b>الاستخدام:</b> هذه النسبة هي «درجة الموثوقية» في كل عرض (مثل 82% و97%)، فلا تعود أرقاماً مخترعة. ويرفض المحرك أي عرض أقل من الحد الأدنى الإلزامي.`;
  }
  ['l3d','l3p','l3r','l3a'].forEach(i=>$('#'+i).oninput=up);up();
})();
})();
