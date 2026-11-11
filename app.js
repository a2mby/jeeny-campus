const $=s=>document.querySelector(s);
const el=(h)=>{const t=document.createElement('template');t.innerHTML=h.trim();return t.content.firstChild};
const C={teal:'#2dd4bf',blue:'#60a5fa',amber:'#fbbf24',red:'#f87171',green:'#4ade80',violet:'#a78bfa',line:'#25335a',card:'#16213a',mute:'#9fb0d0'};
const fmt=m=>{m=Math.round(m);const h=Math.floor(m/60),mm=m%60;return h+':'+String(mm).padStart(2,'0')};

/* ---------- Nav ---------- */
(function(){
  const nav=$('#nav');
  document.querySelectorAll('[data-nav]').forEach(s=>{
    const a=el(`<a href="#${s.id}">${s.dataset.nav}</a>`);nav.appendChild(a);
  });
  const links=[...nav.querySelectorAll('a')];
  const secs=[...document.querySelectorAll('[data-nav]')];
  addEventListener('scroll',()=>{
    let cur=secs[0];secs.forEach(s=>{if(s.getBoundingClientRect().top<160)cur=s});
    links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+cur.id));
  });
})();

/* ---------- Five problems ---------- */
$('#five').innerHTML=[
 ['💰','التكلفة','نقل أرخص بشكل ملموس للطلاب'],
 ['😌','الراحة','إلغاء البحث وتنظيم الرحلات اليومي'],
 ['⏰','الموثوقية','الوصول للجامعة قبل المحاضرة'],
 ['🛡','الثقة','سفر جماعي آمن ومتوقع ومريح'],
 ['📈','الجدوى','كل رحلة مقبولة عملية للسائق ولجيني']
].map((x,i)=>`<div class="card"><div class="big">${x[0]}</div><h4>${i+1}. ${x[1]}</h4><p>${x[2]}</p></div>`).join('');

/* ---------- Concepts ---------- */
$('#concepts').innerHTML=[
 ['Commute Profile','ملف التنقّل','تفضيلات الطالب وقيوده','الجامعة، أقصى ميزانية، حد المشي'],
 ['Schedule Rule','قاعدة الجدول','الرحلات المقصودة المتكررة','الأحد والثلاثاء والخميس 8 صباحاً'],
 ['Ride Request','طلب رحلة','حدوث واحد يحتاج نقلاً','الثلاثاء 17 نوفمبر'],
 ['Ride Circle','دائرة ركوب','مجموعة رفاق مفضّلين محفوظة','ثلاثة أصدقاء يسافرون معاً'],
 ['Ride Offer','عرض رحلة','رحلة مقترحة بوقت وسعر ومجموعة','3 مقاعد بـ2.40 دينار للفرد'],
 ['Confirmed Trip','رحلة مؤكدة','رحلة ملتزم بها بسعة وإرسال فعليين','سائق معيّن والالتقاء مؤكد']
].map(c=>`<div class="card"><h4>${c[1]}</h4><div style="direction:ltr;text-align:right;color:var(--blue);font-size:13px;font-weight:700">${c[0]}</div><p>${c[2]}</p><div class="eg">مثال: ${c[3]}</div></div>`).join('');

function box(x,y,w,h,t,col,txt='#06101f',sub){
  const lines=t.split('\n');
  const ty=y+h/2-(lines.length-1)*9+5;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${col}"/>`+
   lines.map((l,i)=>`<text x="${x+w/2}" y="${ty+i*18}" text-anchor="middle" font-size="14.5" font-weight="700" fill="${txt}">${l}</text>`).join('');
}
function defsArrow(id,col){return `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${col}"/></marker>`}

/* chain */
(function(){
  const names=[['ملف التنقّل',C.blue],['قاعدة الجدول',C.blue],['طلب رحلة',C.teal],['عرض رحلة',C.amber],['رحلة مؤكدة',C.green]];
  let s=`<svg viewBox="0 0 1000 230"><defs>${defsArrow('a1',C.mute)}</defs>`;
  names.forEach((n,i)=>{const x=830-i*200;s+=box(x,20,150,56,n[0],n[1]);
    if(i<4)s+=`<line x1="${x}" y1="48" x2="${x-48}" y2="48" stroke="${C.mute}" stroke-width="2" marker-end="url(#a1)"/>`});
  s+=box(430,150,170,52,'دائرة ركوب (اختيارية)','#0e172b',C.text||'#e8edf7');
  s+=`<rect x="430" y="150" width="170" height="52" rx="12" fill="none" stroke="${C.violet}" stroke-width="2" stroke-dasharray="6 4"/>`;
  s+=`<path d="M515 150 V120 H405 V76" fill="none" stroke="${C.violet}" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#a1)"/>`;
  s+=`<text x="870" y="105" font-size="13" fill="${C.mute}" text-anchor="middle">تفضيلات ← نوايا متكررة ← حدوث فردي ← مقترح ← ملتزم به</text>`;
  $('#chainSvg').innerHTML=s+'</svg>';
})();

/* ---------- AI capabilities ---------- */
const AIC=[
 {k:'A',t:'نموذج توقع الطلب',q:'كم طالباً سيسافر، وأين، ومتى؟',kind:'تعلّم آلي',
  d:'انحدار يتعلم من الجداول المعلنة والسجل: يوم الأسبوع، أسبوع الامتحانات، اتجاه النمو. يتنبأ مثلاً بعدد طلبات صباح الأحد من منطقة معيّنة مع نطاق عدم يقين، فيبدأ النظام توليد العروض ويقترح نقاط التقاء (محطات باص) حيث يتوقع تجمعاً. الموعد القادم لا يُحجز بناءً عليه.',
  inp:'الجداول المعلنة، منطقة الالتقاء التقريبية، تقويم الفصل، سجل الطلبات.',
  out:'عدد الطلبات المتوقع + نطاق 80% لكل منطقة ونافذة.',
  warn:'قابل للتجربة في «مختبر الذكاء الاصطناعي» (2ب). مدرَّب على بيانات اصطناعية الآن ومقيَّم على فترة لم يرها.'},
 {k:'B',t:'محرك توافق المجموعات',q:'أي تركيبة طلبات تعطي أفضل مسار ممكن؟',kind:'خوارزمية قيود',
  d:'الميزة التقنية الأساسية. لكل مجموعة محتملة يتحقق النظام من: هل يصل الجميع قبل موعدهم؟ هل يصلون لنقطة الالتقاء؟ هل الإشغال ضمن السعة؟ هل الانحراف مقبول؟ هل الأجرة المجمعة أقل من البدائل الفردية؟ هل أجر السائق مقبول؟ هل وافق الطلاب؟ هل الرحلة مسموحة تشغيلياً؟',
  inp:'طلبات الرحلات، شبكة الطرق، السعة، قيود كل راكب، قواعد الامتثال.',
  out:'مجموعات ممكنة فقط، مرتّبة بدالة التكلفة.',
  warn:'خوارزمية حتمية بالكامل: نفس المدخلات تعطي نفس النتيجة، وكل قرار قابل للتفسير والاختبار. لا حاجة هنا لذكاء اصطناعي.'},
 {k:'C',t:'التنبؤ بزمن الرحلة وعدم اليقين (P90)',q:'متى يجب أن يغادر الطالب ليصل بموثوقية؟',kind:'تعلّم آلي',
  d:'يتنبأ النموذج بزمن الرحلة حسب المسافة والذروة والمطر، وبعدم اليقين حوله (P50 وP90). ثم تحسب الصيغة وقت الالتقاء = الموعد − زمن الرحلة − هامش الأمان، حيث الهامش = P90 − P50 وليس رقماً ثابتاً. كما يُنتج احتمال الوصول في الوقت لكل عرض (درجة الموثوقية).',
  inp:'المسافة، وقت اليوم، الطقس، موعد الوصول.',
  out:'P50 وP90، الهامش المقترح، واحتمال الوصول في الوقت.',
  warn:'الصيغة هي التي تقرر وقت الالتقاء؛ النموذج يغذّيها بالتقدير فقط. جرّبه في القسم 2ب.'},
 {k:'D',t:'وقت مطابقة تكيّفي',q:'لماذا ينتظر كل طالب 15 دقيقة بالضبط؟',kind:'قواعد',
  d:'إذا وُجد 3 ركاب متوافقين فطابق فوراً. وإن كان متوقعاً ظهور طلب متوافق فانتظر ضمن حد الانتظار الذي قبله الراكب. ويُغلق التجميع قبل موعد الرحلة بوقت كافٍ (قيمة افتراضية قابلة للضبط، مثلاً 12 ساعة) حتى لا يتغير شيء في نفس اليوم. وبعد انطلاق الرحلة يمكن إضافة راكب قبل منتصف المسار فقط وبشروط صارمة.',
  inp:'الطلبات الحالية، الوقت المتبقي للإغلاق، حد الانتظار المقبول.',
  out:'قرار: اعرض الآن / تابع البحث / أغلق وقدّم البديل.',
  warn:'قواعد شفافة قابلة للتفسير أفضل من تدريب سياسة بلا بيانات.'},
 {k:'E',t:'قواعد كشف سوء الاستخدام',q:'هل تؤثر طلبات وهمية أو إلغاءات متكررة على الموثوقية؟',kind:'قواعد',
  d:'عتبات وقواعد بسيطة: عدد الإلغاءات المتكررة، شذوذ GPS، الحسابات الجديدة المتكررة الانضمام، محاولات الدفع خارج المنصة. تكمّل — ولا تتعارض — مع سياسة الاحتيال العامة لجيني.',
  inp:'سلوك الحساب، شذوذ المسار، أنماط الإلغاء.',
  out:'إشارات مخاطر تُراجَع بالقواعد.',
  warn:'يمكن لاحقاً تحسينها بالتعلّم الآلي عند توفر بيانات مصنّفة، وليس قبل ذلك.'},
 {k:'F',t:'إدخال الجدول المنظم (بدل نموذج لغة)',q:'كيف يُدخل الطالب جدوله دون أخطاء تفسير؟',kind:'واجهة منظمة',
  d:'شبكة أسبوعية: يختار الطالب الأيام ويدخل وقت الوصول والمغادرة والميزانية وحد المشي عبر قوائم وحقول بقيم محدودة. كل حقل يُتحقق منه فوراً (AM/PM صريح، ميزانية رقمية، وقت ضمن الدوام، تعارض بين القواعد)، ثم يراجع الطالب الجدول قبل الحفظ.',
  inp:'اختيارات الطالب من حقول منظمة.',
  out:'قواعد جدول صالحة 100% تتحول مباشرة إلى طلبات رحلات.',
  warn:'استبعدنا نموذج اللغة: يستهلك tokens، وقد يفسّر خطأً، ولا ضمان لخلوّ مخرجاته من الأخطاء، بينما النموذج المنظم ينتج مدخلات صحيحة بالتصميم.'},
 {k:'G',t:'نموذج مخاطر الإلغاء',q:'ما احتمال أن يلغي هذا الراكب؟',kind:'تعلّم آلي',
  d:'انحدار لوجستي يستخدم يوم الرحلة، ونسبة الإلغاء السابقة، وكم قبل الرحلة حُجزت، وأسبوع الامتحانات. عند الخطر المتوسط/المرتفع يُرسل تذكير ويُجهَّز بديل في قائمة الانتظار لملء المقعد مبكراً. يحل جزءاً كبيراً من مشكلة إلغاء راكب بعد الالتزام.',
  inp:'سلوك الراكب السابق، توقيت الحجز، التقويم.',
  out:'احتمال الإلغاء 0–100%.',
  warn:'يُستخدم لتجهيز البدائل فقط. لا يُعاقب الطالب ولا يُرفض طلبه بسببه.'}
];
(function(){
  const tabs=$('#aiTabs');
  function show(i){
    [...tabs.children].forEach((b,j)=>b.classList.toggle('on',i===j));
    const a=AIC[i];
    $('#aiPanel').innerHTML=`<h4>${a.k} — ${a.t} <span class="pill P2">${a.kind}</span></h4><p class="lead" style="margin-bottom:0">${a.q}</p><p>${a.d}</p>
      <div class="kv"><b>المدخلات</b><span>${a.inp}</span><b>المخرجات</b><span>${a.out}</span><b>ملاحظة</b><span class="warn" style="font-weight:400;color:var(--amber)">${a.warn}</span></div>`;
  }
  AIC.forEach((a,i)=>{const b=el(`<button class="tab">${a.k} · ${a.t}</button>`);b.onclick=()=>show(i);tabs.appendChild(b)});
  show(0);
})();

/* ---------- Departure calculator ---------- */
(function(){
  const dl=$('#dl'),tj=$('#tj'),tb=$('#tb');
  function up(){
    const D=420+ +dl.value,J=+tj.value,B=+tb.value,P=D-J-B;
    $('#dlo').textContent=fmt(D);$('#tjo').textContent=J+' د';$('#tbo').textContent=B+' د';
    $('#deptRes').innerHTML=`وقت الالتقاء الأخير: <span class="big">${fmt(P)}</span> &nbsp; (الموعد ${fmt(D)} − الرحلة ${J} د − الهامش ${B} د)`;
    const tot=J+B,w=900;const sc=w/Math.max(tot+10,45);
    $('#deptSvg').innerHTML=`<svg viewBox="0 0 1000 90" style="margin-top:12px"><g transform="translate(950,0) scale(-1,1)">
     <rect x="0" y="20" width="${B*sc}" height="30" rx="6" fill="${C.amber}"/><rect x="${B*sc}" y="20" width="${J*sc}" height="30" rx="6" fill="${C.blue}"/></g>
     <text x="${950-B*sc/2}" y="40" text-anchor="middle" font-size="12" fill="#06101f" font-weight="700">هامش ${B}</text>
     <text x="${950-B*sc-J*sc/2}" y="40" text-anchor="middle" font-size="12" fill="#06101f" font-weight="700">رحلة ${J}</text>
     <text x="${950-tot*sc}" y="75" text-anchor="middle" font-size="13" fill="${C.green}" font-weight="700">الالتقاء ${fmt(P)}</text>
     <text x="950" y="12" text-anchor="middle" font-size="13" fill="${C.red}" font-weight="700">الموعد ${fmt(D)}</text></svg>`;
  }
  const vt=$('#vt'),xm=$('#xm'),sv=$('#sv');
  function tm(){
    const V=+vt.value,X=+xm.value,S=+sv.value,cost=X/60*V,net=S-cost,be=V>0?S/V*60:0;
    $('#vto').textContent=V.toFixed(1)+' د/ساعة';$('#xmo').textContent=X+' د';$('#svo').textContent=S.toFixed(2)+' د';
    $('#tmRes').innerHTML=`تكلفة الوقت الإضافي: <b>${cost.toFixed(2)} د</b> مقابل توفير <b>${S.toFixed(2)} د</b> ← صافي <span class="${net>=0?'ok':'warn'} big">${net>=0?'+':''}${net.toFixed(2)} د</span><br>
    ${net>=0?'<span class="ok">✔ المشاركة تستحق</span>':'<span class="warn">✘ المشاركة لا تستحق لهذا الطالب: يعرض النظام الرحلة الأسرع</span>'} — نقطة التعادل: <b>${be.toFixed(0)}</b> دقيقة إضافية.`;
  }
  [vt,xm,sv].forEach(i=>i.oninput=tm);tm();
  [dl,tj,tb].forEach(i=>i.oninput=up);up();
})();

/* ---------- Matching stages ---------- */
$('#stages').innerHTML=[
 ['إيجاد المرشحين المتوافقين','نفس الجامعة/وجهة متقاربة، نوافذ وصول متداخلة، تداخل معقول في شبكة الطرق، إعدادات المجموعة والخصوصية متوافقة، فئة مركبة وسعة مناسبتان. نستخدم الفهرسة الجغرافية ودلاء الزمن لتقليص البحث — لا نختبر كل التجميعات في المدينة.'],
 ['بناء المسارات الفعلية','لكل مجموعة نحسب تسلسل الالتقاء وأوقات الوصول. مثال: التقاء A الساعة 7:18 (طالبان عند نقطة آمنة) ← B الساعة 7:25 ← بوابة الجامعة 7:52 قبل موعد 8:00. لا نفترض أن أقرب شخص هو الأفضل؛ نقيّم الترتيبات الممكنة بشرط الالتقاء قبل التوصيل. في الهاكاثون: بحث شامل صغير أو إدراج جشع.'],
 ['تطبيق القيود الصارمة','الوصول ≤ الموعد، المشي ≤ الأقصى، الانحراف ≤ الأقصى، الأجرة ≤ الميزانية المقبولة، الإشغال ≤ المقاعد. مع موافقة صالحة وأهلية سائق ونطاق جغرافي وترخيص قانوني. التوافق «مسألة جدوى» قبل أن يصبح «مسألة توصية».'],
 ['ترتيب المجموعات الممكنة','بعد الجدوى نُصغّر تكلفة موزونة J. الترتيب: أولاً السلامة والقانونية والمواعيد والالتزامات المؤكدة، ثانياً جودة رحلة وأقتصاد سائق مقبولان، ثالثاً أجرة وانتظار وانحراف أقل واستخدام أسطول أفضل. هكذا لا نوصي بمجموعة رخيصة تتأخر بأحد.'],
 ['تحسين الدفعة كاملة','قد يشكّل A وB وC مجموعة، ويمكن لـA وD أيضاً. اختيار الأرخص لـA وحده قد يمنع حلاً أفضل للأربعة. نضمن أن الطالب في رحلة مؤكدة واحدة على الأكثر: في المحاكاة نعدّد المجموعات ونختار مجموعة غير متداخلة بأفضل نتيجة؛ وبحجم أكبر يصبح set-packing أو vehicle-routing.'],
 ['إعادة الحساب دون كسر الوعود','العروض غير المؤكدة تُحسَّن بقوة. الرحلات المؤكدة لا تُعاد ترتيبها عرَضاً. لا يُدرج طالب جديد في مركبة مؤكدة إذا زاد أجرة أحد، أو تجاوز انحرافه المقبول، أو خالف موعده، أو كسر قيود الخصوصية. الحجوزات المؤكدة قيود على التحسين اللاحق، لا متغيرات حرة.']
].map((s,i)=>`<div class="stage"><div class="dot">${i+1}</div><div class="body"><h4>${s[0]}</h4><p style="color:var(--mute);font-size:15.5px">${s[1]}</p></div></div>`).join('');

/* ---------- Group compatibility demo ---------- */
(function(){
  const S=[
   {n:'A',area:'حي إربد 1',a:1,dl:480,bud:3.0},
   {n:'B',area:'حي إربد 1',a:1,dl:490,bud:3.5},
   {n:'C',area:'حي إربد 2',a:2,dl:480,bud:2.8},
   {n:'D',area:'حي إربد 3',a:3,dl:540,bud:2.5}
  ];
  const BASE={1:25,2:30,3:35},CAP=3,BUF=8,EARLY=30,SOLO=5;
  const sel=new Set(['A','B','C']);
  const box=$('#stuChips');
  S.forEach(s=>{
    const c=el(`<div class="chip"><b>الطالب ${s.n}</b><small>${s.area}</small><small>الوصول ${fmt(s.dl)} · أقصى ${s.bud.toFixed(2)} د</small></div>`);
    c.onclick=()=>{sel.has(s.n)?sel.delete(s.n):sel.add(s.n);draw()};box.appendChild(c);s.el=c;
  });
  function draw(){
    S.forEach(s=>s.el.classList.toggle('sel',sel.has(s.n)));
    const g=S.filter(s=>sel.has(s.n));
    if(g.length<2){$('#grpRes').innerHTML='اختر طالبين على الأقل.';return}
    const areas=new Set(g.map(s=>s.a));
    const route=Math.max(...g.map(s=>BASE[s.a]))+5*(areas.size-1);
    const T=Math.min(...g.map(s=>s.dl))-BUF;
    const dep=T-route;
    const total=4.5+0.5*areas.size,per=total/g.length;
    const checks=[];
    checks.push([g.length<=CAP,`السعة: ${g.length} من ${CAP} مقاعد`]);
    g.forEach(s=>{
      checks.push([T<=s.dl,`${s.n}: الوصول ${fmt(T)} ≤ الموعد ${fmt(s.dl)}`]);
      checks.push([T>=s.dl-EARLY,`${s.n}: لا يصل مبكراً أكثر من ${EARLY} د (يصل ${fmt(T)} والموعد ${fmt(s.dl)})`]);
      checks.push([per<=s.bud,`${s.n}: الأجرة ${per.toFixed(2)} د ≤ ميزانيته ${s.bud.toFixed(2)} د`]);
    });
    const ok=checks.every(c=>c[0]);
    $('#grpRes').innerHTML=(ok?`<div class="ok" style="font-size:18px">✔ مجموعة ممكنة — تدخل مرحلة الترتيب</div>`:`<div class="warn" style="font-size:18px">✘ مجموعة مرفوضة — لا تُعرض على أحد</div>`)+
      `<div style="margin:8px 0;color:var(--mute)">مسار تقريبي: ${route} د · الالتقاء ${fmt(dep)} · الوصول ${fmt(T)} · الأجرة للفرد ${per.toFixed(2)} د (مقابل ${SOLO.toFixed(2)} د فردياً)</div>`+
      checks.map(c=>`<div>${c[0]?'<span class="ok">✔</span>':'<span class="warn">✘</span>'} ${c[1]}</div>`).join('')+
      `<p class="note">زمن الرحلة والأجرة هنا افتراضات توضيحية: 25/30/35 د حسب الحي (+5 د لكل حي إضافي)، هامش 8 د، سعة 3 مقاعد.</p>`;
  }
  draw();
})();

/* ---------- Match-time table ---------- */
$('#matchTime').innerHTML='<tr><th>الوضع</th><th>إجراء النظام</th></tr>'+[
 ['مجموعة متوافقة قوية متاحة','اعرض المجموعة الآن'],
 ['ركاب إضافيون محتملون ووقت كافٍ','تابع البحث ضمن النافذة المتفق عليها'],
 ['موعد وصول الطالب يقترب','توقف عن الانتظار وقدّم أسرع بديل ممكن'],
 ['لا سائق يستطيع خدمة المجموعة','لا تؤكد الرحلة'],
 ['ثقة النظام منخفضة','اعرض عدم اليقين بدل وعد بتوفير'],
 ['اقتراب إغلاق التجميع قبل الرحلة بوقت كافٍ (افتراضياً 12 ساعة)','أغلق المجموعة؛ لا تغييرات مفاجئة في نفس اليوم، ويبقى البديل الفردي'],
 ['راكب جديد مناسب أثناء الرحلة (قبل منتصف المسار)','يُقبل فقط إن لم يتجاوز أحد انحرافه أو موعده أو سقف أجرته، وبموافقة الركاب الحاليين'],
 ['راكب جديد بعد منتصف المسار','لا يُقبل؛ ينتقل لعرض آخر']
].map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('');

/* ---------- Pricing sim ---------- */
(function(){
  const ids=['pf','pn','ps','pc','pu'],g=i=>+$('#'+i).value;
  function up(){
    const f=g('pf'),n=g('pn'),s=g('ps'),c=g('pc');
    const u=g('pu');$('#puo').textContent='±'+u+'%';
    $('#pfo').textContent=f.toFixed(1)+' د';$('#pno').textContent=n;$('#pso').textContent=s.toFixed(1)+' د';$('#pco').textContent=c.toFixed(1)+' د';
    const sep=f*n,per=s/n,save=(f-per)/f*100,margin=s-c;
    const max=Math.max(sep,s,c,1)*1.1;
    const bar=(y,v,col,l)=>`<rect x="${950-v/max*760}" y="${y}" width="${Math.max(v/max*760,2)}" height="34" rx="6" fill="${col}"/>
      <text x="${950-v/max*760-8}" y="${y+23}" text-anchor="end" font-size="15" font-weight="700" fill="#e8edf7">${v.toFixed(1)} د</text>
      <text x="990" y="${y+23}" text-anchor="end" font-size="14" fill="${C.mute}"></text>`;
    $('#priceSvg').innerHTML=`<svg viewBox="0 0 1000 190" style="margin-top:8px">
      ${bar(8,sep,C.red,'')}${bar(58,s,C.teal,'')}${bar(108,c,C.amber,'')}
      <text x="980" y="30" text-anchor="end" font-size="13" fill="${C.mute}"></text>
      </svg>
      <div class="legend"><span><i class="sw" style="background:${C.red}"></i>إجمالي ما يدفعه الركاب منفصلين</span><span><i class="sw" style="background:${C.teal}"></i>إجمالي الرحلة المشتركة</span><span><i class="sw" style="background:${C.amber}"></i>تكلفة السائق + المنصة + الهامش المطلوب</span></div>`;
    const ok=margin>=0;
    $('#priceRes').innerHTML=`توفير الطالب الواحد: <span class="big">${save.toFixed(0)}%</span> (يدفع ${per.toFixed(2)} د بدل ${f.toFixed(2)} د)<br>نطاق السعر المعروض: <b>${(per*(1-u/100)).toFixed(2)} – ${(per*(1+u/100)).toFixed(2)} د</b> — السقف الأعلى (${(per*(1+u/100)).toFixed(2)} د) هو ما يُجمَّد عند قبول الطالب، فلا يدفع أكثر منه.<br>
     جدوى الرحلة: ${ok?`<span class="ok">✔ الإيراد يغطي التكاليف (فائض ${margin.toFixed(1)} د)</span>`:`<span class="warn">✘ الإيراد أقل من التكاليف بـ${(-margin).toFixed(1)} د — لا نصنّع توفيراً، نعرض بديلاً شفافاً</span>`}`;
  }
  ids.forEach(i=>$('#'+i).oninput=up);up();
})();

/* ---------- Lifecycle SVG ---------- */
(function(){
  const W=150,H=50,xs=[840,640,440,240,40];
  const N={
   1:[xs[0],20,'رحلة مجدولة',C.blue],2:[xs[1],20,'البحث عن مرشحين',C.blue],3:[xs[2],20,'مجموعة ممكنة؟',C.violet,1],4:[xs[3],20,'عرض مُولَّد',C.teal],
   5:[xs[3],170,'الطالب يقبل؟',C.violet,1],6:[xs[2],170,'حجز مقعد مؤقت',C.teal],7:[xs[1],170,'كل الالتزامات\nصالحة؟',C.violet,1],8:[xs[0],170,'مجموعة ملتزمة',C.green],
   9:[xs[0],320,'إرسال معلّق',C.amber],10:[xs[1],320,'مركبة مؤمَّنة؟',C.violet,1],11:[xs[2],320,'التقاء مؤكد',C.green],12:[xs[3],320,'رحلة جارية',C.green],13:[xs[4],320,'مكتملة ومسوّاة',C.green],
   F:[xs[4],170,'بدائل / رحلة\nفردية',C.red],R:[xs[1],420,'استرداد الإرسال\nوإبلاغ الركاب',C.red]
  };
  let s=`<svg viewBox="0 0 1000 490"><defs>${defsArrow('l1',C.mute)}${defsArrow('l2',C.red)}</defs>`;
  const L=(d,col=C.mute,m='l1',dash='')=>`<path d="${d}" fill="none" stroke="${col}" stroke-width="2" ${dash?`stroke-dasharray="${dash}"`:''} marker-end="url(#${m})"/>`;
  // main edges
  s+=L('M840 45 H792')+L('M640 45 H592')+L('M440 45 H392');
  s+=L('M315 70 V170')+L('M390 195 H440')+L('M590 195 H640')+L('M790 195 H840');
  s+=L('M915 220 V320')+L('M840 345 H792')+L('M640 345 H592')+L('M440 345 H392')+L('M240 345 H192');
  // fallbacks
  s+=L('M515 70 V118 H115 V170',C.red,'l2','6 4')+L('M240 195 H192',C.red,'l2','6 4')+L('M715 220 V258 H115 V220',C.red,'l2','6 4')+L('M715 370 V420',C.red,'l2','6 4');
  s+=`<text x="525" y="112" font-size="13" fill="${C.red}">لا</text><text x="722" y="252" font-size="13" fill="${C.red}">لا</text><text x="722" y="400" font-size="13" fill="${C.red}">لا</text><text x="224" y="188" font-size="13" fill="${C.red}">لا</text>`;
  Object.values(N).forEach(n=>{
    s+=box(n[0],n[1],W,H,n[2],n[3]);
    if(n[4])s+=`<rect x="${n[0]}" y="${n[1]}" width="${W}" height="${H}" rx="12" fill="none" stroke="#fff" stroke-opacity=".5" stroke-dasharray="4 3"/>`;
  });
  s+=`<text x="520" y="486" font-size="13" fill="${C.mute}" text-anchor="middle">المربعات المتقطعة = نقاط قرار · الأحمر = مسار البدائل</text>`;
  s+=`<text x="990" y="140" font-size="13" fill="${C.amber}" text-anchor="end">التزام المجموعة ≠ تأكيد السائق</text>`;
  $('#lifeSvg').innerHTML=s+'</svg>';
})();

/* ---------- Edge cases ---------- */
(function(){
  const cats=Object.keys(EDGE),all=[];
  cats.forEach(c=>EDGE[c].forEach(r=>all.push({cat:c,e:r[0],p:r[1],b:r[2]})));
  const cnt=cats.map(c=>EDGE[c].length),maxc=Math.max(...cnt);
  $('#edgeBar').innerHTML=cats.map((c,i)=>`<div class="row"><span>${c}</span><div class="bar" style="width:${cnt[i]/maxc*100}%;background:${C.blue}">${cnt[i]}</div></div>`).join('')+`<p class="note">الإجمالي: ${all.length} حالة</p>`;
  const pc={P0:0,P1:0,P2:0};all.forEach(a=>pc[a.p]++);
  $('#edgeDonut').innerHTML=donut([[pc.P0,C.red,'P0'],[pc.P1,C.amber,'P1'],[pc.P2,C.blue,'P2']],all.length,'حالة');
  let cat='الكل',pr='الكل';
  const t1=$('#edgeTabs'),t2=$('#prioTabs');
  function tabs(host,list,cur,cb){host.innerHTML='';list.forEach(x=>{const b=el(`<button class="tab ${x===cur?'on':''}">${x}</button>`);b.onclick=()=>cb(x);host.appendChild(b)})}
  function draw(){
    tabs(t1,['الكل',...cats],cat,x=>{cat=x;draw()});
    tabs(t2,['الكل','P0','P1','P2'],pr,x=>{pr=x;draw()});
    const rows=all.filter(a=>(cat==='الكل'||a.cat===cat)&&(pr==='الكل'||a.p===pr));
    $('#edgeTable').innerHTML='<tr><th style="width:36%">الحالة</th><th style="width:70px">الأولوية</th><th>السلوك المطلوب</th></tr>'+
      rows.map(r=>`<tr><td>${r.e}${cat==='الكل'?`<div class="note">${r.cat}</div>`:''}</td><td><span class="pill ${r.p}">${r.p}</span></td><td>${r.b}</td></tr>`).join('');
  }
  draw();
})();

function donut(parts,total,label){
  const R=70,CF=2*Math.PI*R;let off=0;
  let s=`<svg viewBox="0 0 220 220" width="210"><g transform="rotate(-90 110 110)">`;
  parts.forEach(p=>{const len=p[0]/total*CF;s+=`<circle cx="110" cy="110" r="${R}" fill="none" stroke="${p[1]}" stroke-width="28" stroke-dasharray="${len} ${CF-len}" stroke-dashoffset="${-off}"/>`;off+=len});
  s+=`</g><text x="110" y="112" text-anchor="middle" font-size="34" font-weight="800" fill="#e8edf7">${total}</text><text x="110" y="136" text-anchor="middle" font-size="14" fill="${C.mute}">${label}</text></svg>`;
  s+=`<div class="legend" style="justify-content:center">${parts.map(p=>`<span><i class="sw" style="background:${p[1]}"></i>${p[2]}: ${p[0]}</span>`).join('')}</div>`;
  return s;
}

/* ---------- Deep problems ---------- */
$('#deep').innerHTML=[
 ['1','ماذا لو لم يستخدمه أحد؟ (السيولة)','المشاركة منتج «أثر شبكي». 100 طالب موزعون على 30 حياً وجامعات وأوقات مختلفة = معدل مطابقة سيئ مهما بدا العدد كبيراً.','ابدأ بممر كثافة عالية: جامعة واحدة، بضع مناطق التقاء، نافذتا/ثلاث نوافذ ذروة. ثم: إضافة نوافذ العودة، ثم ممرات أكثر، ثم جامعات. عند قلة الأدلة اعرض رحلة جيني عادية أو رحلة فردية متكررة محفوظة — لا خصماً وهمياً.'],
 ['2','ماذا لو كانت الرحلة الرخيصة غير موثوقة؟','توفير دينار لا قيمة له إذا فوّت الطالب امتحاناً.','«درجة موثوقية وصول» لكل عرض. أولويات: الأقل تكلفة / متوازن / الوصول بموثوقية. كل المجموعات المعروضة يجب أن تحقق حداً أدنى إلزامياً — التفضيل لا يتجاوز موعداً صارماً.'],
 ['3','ماذا لو أصبحت الدائرة غير مريحة اجتماعياً؟','الإبقاء على نفس المجموعة مفيد لكنه يحتاج ضمانات.','عضوية قابلة للضبط: بالدعوة فقط، مفتوحة للمتوافقين، موافقة لكل راكب جديد، أعضاء حاليون أولاً مع مطابقة بديلة. إمكانية المغادرة أو كتم الدائرة دون مواجهة، وحظر راكب دون تبرير. لا تُعرض مواقع المنازل علناً؛ تتوافق مع سياسة خصوصية جيني الأردنية منذ البداية.'],
 ['4','كيف نمنع الأتمتة من الإزعاج؟','15 إشعاراً أسبوعياً ليست أتمتة بل مقاطعة متكررة.','ثلاثة مستويات استقلالية (اقترح / حضّر / احجز) وزر «إيقاف هذا الأسبوع». الهاكاثون: المستويان الأولان فقط.'],
 ['5','ماذا لو كان الحل أمثلياً رياضياً وسيئاً اجتماعياً؟','قد يعطي المحسّن طالباً واحداً نقطة التقاء مزعجة كل مرة لأنها تقلل المسافة الكلية.','قيود عدالة فردية: PersonalBenefit = تكلفة البديل الخاص − الأجرة المشتركة − تكلفة الإزعاج. لا نوصي بمجموعة لمجرد أن التوفير الكلي موجب، ونمنع تكرار إسناد أطول مشي لنفس الطلاب عبر الأسابيع.']
].map(d=>`<div class="card"><h4>المشكلة ${d[0]}: ${d[1]}</h4><p><b>الوصف:</b> ${d[2]}</p><p style="margin-top:6px"><b style="color:var(--green)">الحل:</b> ${d[3]}</p></div>`).join('');

/* reliability demo */
(function(){
  const G=[{n:'المجموعة A',c:2.0,p:82},{n:'المجموعة B',c:2.5,p:97}];
  $('#rel').innerHTML=`<div class="tabs" id="rm"></div>
    <div class="sl"><label>الحد الأدنى الإلزامي للموثوقية</label><input id="rf" type="range" min="50" max="99" value="75"><output id="rfo"></output></div>
    <div class="grid g2" id="rg"></div><div class="result" id="rr"></div>
    <p class="note">احتمالات مخترعة لتوضيح المفاضلة؛ المنتج الحقيقي يجب أن يعاير الاحتمالات بنتائج الوصول الفعلية.</p>`;
  let mode='الأقل تكلفة';
  const rm=$('#rm');
  ['الأقل تكلفة','متوازن','الوصول بموثوقية'].forEach(m=>{const b=el(`<button class="tab">${m}</button>`);b.onclick=()=>{mode=m;up()};rm.appendChild(b)});
  function up(){
    const f=+$('#rf').value;$('#rfo').textContent=f+'%';
    [...rm.children].forEach(b=>b.classList.toggle('on',b.textContent===mode));
    const el_=G.map(g=>({...g,ok:g.p>=f}));
    $('#rg').innerHTML=el_.map(g=>`<div class="card" style="${g.ok?'':'opacity:.45'}"><h4>${g.n}</h4><div class="big">${g.c.toFixed(2)} د</div><p>احتمال الوصول في الوقت: <b>${g.p}%</b></p><p class="${g.ok?'ok':'warn'}">${g.ok?'✔ يحقق الحد الأدنى':'✘ مستبعد: أقل من الحد الإلزامي'}</p></div>`).join('');
    const av=el_.filter(g=>g.ok);
    let pick;
    if(!av.length){$('#rr').innerHTML='<span class="warn">لا مجموعة تحقق الحد الأدنى — يعرض النظام البديل الأسرع الممكن بدل مجموعة غير موثوقة.</span>';return}
    if(mode==='الأقل تكلفة')pick=av.reduce((a,b)=>a.c<=b.c?a:b);
    else if(mode==='الوصول بموثوقية')pick=av.reduce((a,b)=>a.p>=b.p?a:b);
    else pick=av.reduce((a,b)=>(.5*(1-a.c/3)+.5*a.p/100)>=(.5*(1-b.c/3)+.5*b.p/100)?a:b);
    $('#rr').innerHTML=`التوصية في وضع «${mode}»: <b class="ok">${pick.n}</b> — ${pick.c.toFixed(2)} د، موثوقية ${pick.p}%`;
  }
  $('#rf').oninput=up;up();
})();

/* ---------- Architecture ---------- */
(function(){
  let s=`<svg viewBox="0 0 1000 510"><defs>${defsArrow('a2',C.mute)}</defs>`;
  const ln=(d)=>`<path d="${d}" fill="none" stroke="${C.mute}" stroke-width="1.6" marker-end="url(#a2)"/>`;
  s+=ln('M500 60 V90')+ln('M500 140 V156')+`<path d="M132 156 H868" stroke="${C.mute}" stroke-width="1.6" fill="none"/>`;
  [132,377,622,867].forEach(x=>s+=ln(`M${x} 156 V172`));
  s+=`<path d="M132 232 V252 H868 V232" fill="none" stroke="${C.mute}" stroke-width="1.6"/>`+ln('M500 252 V272');
  s+=box(300,10,400,50,'تطبيق ويب للجوال (Mobile-first)',C.blue)+box(300,90,400,50,'واجهة التطبيق (Application API)',C.blue);
  [['الجدولة والتكرار',20],['إدارة الدوائر والمجموعات',265],['دورة العرض والحجز',510],['الأجرة ومحاكاة الدفع',755]].forEach(m=>s+=box(m[1],172,225,60,m[0],C.teal));
  s+=box(300,272,400,50,'منسّق المطابقة (Matching Orchestrator)',C.amber);
  s+=`<path d="M500 322 V336" stroke="${C.mute}" stroke-width="1.6"/><path d="M185 336 H815" stroke="${C.mute}" stroke-width="1.6" fill="none"/>`;
  [[40,'محرك القيود والامتثال'],[355,'مقدّر المسار والزمن'],[670,'محسّن المجموعات']].forEach(b=>{s+=box(b[0],352,290,52,b[1],C.amber);s+=ln(`M${b[0]+145} 336 V352`)});
  s+=box(20,272,240,50,'نماذج التنبؤ (ML)',C.violet)+box(740,272,240,50,'مدقّق الجداول بالقواعد',C.violet);
  s+=`<path d="M260 297 H300" stroke="${C.violet}" stroke-width="2" stroke-dasharray="5 3"/><path d="M700 297 H740" stroke="${C.violet}" stroke-width="2" stroke-dasharray="5 3"/>`;
  [['PostgreSQL',20],['المهام والأحداث',265],['إشعارات لحظية',510],['محوّل إرسال جيني (محاكى)',755]].forEach(b=>s+=box(b[1],446,225,50,b[0],'#2a3a63','#e8edf7'));
  s+=`<path d="M500 404 V425" stroke="${C.mute}" stroke-width="1.6"/><path d="M132 425 H868" stroke="${C.mute}" stroke-width="1.6"/>`;
  [132,377,622,867].forEach(x=>s+=ln(`M${x} 425 V446`));
  $('#archSvg').innerHTML=s+`</svg><div class="legend"><span><i class="sw" style="background:${C.violet}"></i>نماذج تنبؤ (تقترح فقط)</span><span><i class="sw" style="background:${C.amber}"></i>المطابقة (المرجع الحاسم)</span><span><i class="sw" style="background:${C.teal}"></i>وحدات النطاق</span></div>`;
  $('#dm').innerHTML=[
   ['المستخدمون والمواقع','users\nstudent_profiles\ncampuses\npickup_points'],
   ['الجدولة','commute_profiles\nrecurring_schedule_rules\nschedule_exceptions\nride_requests'],
   ['المجموعات والعروض','ride_circles\ncircle_members\ngroup_candidates\ngroup_offers\noffer_passengers\nseat_holds'],
   ['الحجوزات والإرسال','confirmed_bookings\nbooking_passengers\ntrip_stops\ndispatch_attempts'],
   ['الأجرة والدفع','fare_quotes\npayment_obligations\npayment_events'],
   ['المطابقة والإشعارات','matching_runs\nmatching_decisions\nnotification_events']
  ].map(g=>`<div class="card"><h4>${g[0]}</h4><div style="direction:ltr;text-align:left;font-family:ui-monospace,Menlo,monospace;font-size:13px;color:var(--amber);white-space:pre">${g[1]}</div></div>`).join('');
})();

/* ---------- Metrics ---------- */
$('#metrics').innerHTML=[
 ['نسبة المطابقة','نسبة الطلاب المتلقين عروضاً مشتركة ممكنة'],
 ['نسبة التنفيذ','نسبة من تلقوا رحلة مكتملة فعلاً'],
 ['متوسط توفير الطالب','هل يقلل المنتج النفقات'],
 ['نسبة الوصول في الوقت','هل بقيت الموثوقية'],
 ['متوسط المشي + الانتظار','مقدار الإزعاج الذي تضيفه المشاركة'],
 ['كم مركبة لكل طالب مخدوم','كفاءة استخدام المركبات'],
 ['أرباح السائق في الساعة','هل يستفيد السائقون من التحسين'],
 ['الإلغاء ونسبة البدائل','الاستقرار التشغيلي'],
 ['جهد الطالب','عدد الإجراءات اليدوية لكل رحلة متكررة'],
 ['زمن تنفيذ المطابقة','هل الخوارزمية سريعة الاستجابة']
].map((m,i)=>`<div class="card"><h4>${i+1}. ${m[0]}</h4><p>${m[1]}</p></div>`).join('');

/* ---------- Features ---------- */
const FEAT=[
 ['إعداد جدول الجامعة','P0','مجدول أسبوعي يعمل'],['نماذج تعلّم آلي ثلاثة (طلب، إلغاء، زمن P90)','P0','مدرَّبة ومقيَّمة ومربوطة بالمطابقة، مع بديل عند التعطل'],['مدخل جدول منظم مع تحقق فوري','P0','أيام وأوقات وميزانية بحقول محددة وبلا أخطاء تفسير'],['توليد الرحلات المتكررة','P0','طلبات مستقبلية تلقائية'],
 ['مطابقة بالقيود','P0','خوارزمية حقيقية تنتج مجموعات ممكنة'],['مقارنة المجموعات','P0','السعر ووقت الوصول والانحراف والمقاعد'],['قبول المجموعة','P0','تغيّر حالة العرض وحجز المقعد'],
 ['حساب الأجرة والتوفير','P0','حسابات متسقة بافتراضات شفافة'],['الإلغاء وإعادة المطابقة','P0','سيناريو استرداد حي'],
 ['رحلة مشتركة فورية','P1','نافذة مطابقة 15 د محاكاة'],['دوائر ركوب دائمة','P1','حفظ وإعادة استخدام الرفاق'],['تحسين نقطة الالتقاء','P1','اختيار بين نقاط آمنة محددة'],
 ['توقع الطلب','P1','نموذج مدرَّب مع تقييم ونطاق عدم يقين'],['جدولة العودة','P1','نفس المنطق بالاتجاه المعاكس'],['نقاط التقاء مقترحة (محطات باص ومواقف)','P1','تقترح أماكن قريبة تزيد فرص مجموعة أفضل وأرخص ضمن حد المشي'],['ركاب مرافقون من نفس الحساب','P1','إضافة أخ/صديق محلي مباشرة من حسابك مع احتساب مقاعدهم'],
 ['تكامل دفع كامل','Later','حالات وأخطاء دفع محاكاة'],['تكامل إرسال جيني فعلي','Later','محوّل مُحاكى بصراحة'],['إعادة تموضع السائقين','Later','مقترح تصميم'],['تعلم آلي متقدم/RL','Later','خارطة طريق بحثية']
];
(function(){
  const cnt={P0:0,P1:0,Later:0};FEAT.forEach(f=>cnt[f[1]]++);
  $('#prioDonut').innerHTML=donut([[cnt.P0,C.red,'P0 أساسي'],[cnt.P1,C.amber,'P1 مهم'],[cnt.Later,C.blue,'لاحقاً']],FEAT.length,'ميزة');
  const cls={P0:'P0',P1:'P1',Later:'P2'};
  $('#featList').innerHTML=FEAT.map(f=>`<div style="padding:6px 0;border-bottom:1px solid var(--line)"><span class="pill ${cls[f[1]]}">${f[1]}</span> <b>${f[0]}</b><div class="note" style="margin:0">${f[2]}</div></div>`).join('');
})();
$('#screens').innerHTML=[
 ['1','حرمي (My Campus)','الرحلة التالية، وقت الالتقاء المتوقع، موعد الوصول، التوفير المقدّر، حالة التأكيد. الشاشة الرئيسية — وليست خريطة تاكسي عامة.'],
 ['2','مساعد الجدول (Autopilot)','الأيام المتكررة، تفضيلات الوصول/المغادرة، الميزانية، حد المشي، الاستثناءات + إدخال اللغة الطبيعية.'],
 ['3','المطابقات الذكية','مقارنة المجموعات وسقوف الأسعار، التمييز بين العروض التقديرية والحجوزات المؤكدة، وشرح سبب التوصية.'],
 ['4','دوائر ركوبي','الأصدقاء المتكررون، الدعوات، العضويات، أذونات الخصوصية. تعطيل مؤقت دون حذف.'],
 ['5','الرحلة الحية','حالة الحجز/الإرسال، نقطة الالتقاء الآمنة، الوصول المقدّر، المسار، معلومات الركاب المسموحة، الإلغاء والدعم.']
].map(s=>`<div class="card"><div class="big">${s[0]}</div><h4>${s[1]}</h4><p style="font-size:14px">${s[2]}</p></div>`).join('');

/* ---------- Demo timeline ---------- */
(function(){
  const D=[
   ['مشكلة الطالب',30,C.red,'طالب يداوم ثلاثة أيام أسبوعياً ويحتاج كل مرة إلى مواصلات رخيصة. الجدول متوقع لكن الحجز اليومي مكرر.'],
   ['إعداد الجدول المنظم',45,C.violet,'الطالب يختار أيامه وأوقاته وميزانيته في نموذج منظم، يتحقق النظام فوراً ويولّد الرحلات المتكررة، ويؤكد الطالب.'],
   ['المطابقة التلقائية',60,C.blue,'تُضاف طلبات طلاب محاكاة، فيكوّن المحرك مجموعتين ممكنتين بأسعار ودرجات موثوقية مستخرجة من نموذج P90. اشرح تركيبة مرفوضة لأنها تخرق موعد الوصول.'],
   ['القبول والحجز',45,C.teal,'يقبل الطالب مجموعة: يتناقص عدد المقاعد، تتغير نسخة العرض، يظهر سقف الأجرة وتقدّم إرسال محاكى.'],
   ['سيناريو الفشل',60,C.amber,'راكب يلغي. يعيد المحرك حساب البدائل، يحافظ على شروط الركاب الملتزمين، ويقدّم نتيجة استرداد مناسبة. هنا تُظهر نضجاً تشغيلياً.'],
   ['إثبات القيمة',45,C.green,'مقارنة: رحلات مستقلة / تجميع بسيط / تجميع محسَّن. التوفير المحسوب والوصول الناجح واستخدام المركبات وأي فشل أو بدائل.']
  ];
  const tot=D.reduce((a,d)=>a+d[1],0);
  $('#tl').innerHTML=D.map(d=>`<div style="flex:${d[1]};background:${d[2]}">${d[1]}ث</div>`).join('');
  $('#tlLegend').innerHTML=D.map((d,i)=>`<span><i class="sw" style="background:${d[2]}"></i>${i+1}. ${d[0]}</span>`).join('')+`<span>الإجمالي ≈ ${Math.floor(tot/60)}:${String(tot%60).padStart(2,'0')} دقيقة</span>`;
  $('#demoSteps').innerHTML=D.map((d,i)=>`<details ${i===0?'open':''}><summary><i class="sw" style="background:${d[2]}"></i>${i+1}. ${d[0]} — ${d[1]} ثانية</summary><p>${d[3]}</p></details>`).join('');
})();

/* ---------- QA / team / decisions / remember ---------- */
$('#qaList').innerHTML=QA.map(q=>`<details><summary>${q[0]}</summary><p>${q[1]}</p></details>`).join('');
$('#mile').innerHTML=`<div class="grid g2">`+[
 ['1','الرحلة الأساسية تعمل','أعلى أولوية',C.red],['2','جودة المطابقة والخوارزميات','التالي',C.amber],
 ['3','اختبار الفشل والمقاييس','أساسي',C.blue],['4','العرض وتدريب التقديم','النهائي',C.green]
].map(m=>`<div class="card" style="border-right:5px solid ${m[3]}"><h4>المرحلة ${m[0]} · ${m[1]}</h4><p>${m[2]}</p></div>`).join('')+`</div>`;
$('#decTable').innerHTML+=DECISIONS.map(d=>`<tr><td><b style="color:var(--teal)">${d[0]}</b></td><td>${d[1]}</td><td>${d[2]}</td></tr>`).join('');
$('#remember').innerHTML=[
 ['صفر تخطيط متكرر','يضبط الطالب تنقّله مرة واحدة، والنظام يتولى الاكتشاف والاقتراح المتكرر.'],
 ['ذكاء حقيقي لا زينة','نماذج تتنبأ وخوارزميات تقرر: ثلاثة نماذج مقيَّمة، ومحرك قيود له حق النقض.'],
 ['موثوقية بالتصميم','قيود وصول صارمة، حماية للأجرة، ضوابط أذونات، وبدائل عند الفشل.'],
 ['قيمة تنقّل قابلة للقياس','خفض تكلفة أو استخدام مركبات دون التضحية بالتنفيذ أو الالتزام بالمواعيد.'],
 ['تكامل معقول مع جيني','ميزة مبنية حول سائقين مرخّصين وإرسال وسياسات أجرة وقيود واقعية.']
].map((r,i)=>`<div class="card"><div class="big">${i+1}</div><h4>${r[0]}</h4><p>${r[1]}</p></div>`).join('');

/* ---------- Response to notes ---------- */
(function(){
  const host=$('#respList');if(!host)return;
  const T={'نُفِّذ':'ok','مرفوض':'warn','قرار':'ok'};
  host.innerHTML=RESP.map(r=>`<div class="card" style="margin-bottom:12px;border-right:5px solid ${r[2]==='مرفوض'?C.red:C.green}">
    <div class="note" style="margin:0">ملاحظة ${r[0]}</div>
    <p style="color:var(--text)"><b>${r[1]}</b></p>
    <p><span class="pill ${r[2]==='مرفوض'?'P0':'P2'}">${r[2]}</span> <b style="color:var(--teal)">${r[3]}</b></p>
    <p>${r[4]}</p></div>`).join('');
})();
