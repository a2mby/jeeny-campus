/* مدير الملاحظات — يحفظ في localStorage */
(function(){
const KEY='jeeny-notes-v1';
let notes=JSON.parse(localStorage.getItem(KEY)||'[]');
const save=()=>{localStorage.setItem(KEY,JSON.stringify(notes));render()};
const $=s=>document.querySelector(s);
const main=document.querySelector('main');
const secOf=n=>{while(n&&n!==main){if(n.nodeType===1&&n.matches&&n.matches('[data-nav]'))return n;n=n.parentNode}return null};
const inUI=n=>{n=n.nodeType===1?n:n.parentNode;return n&&n.closest&&n.closest('#ntPanel,#ntPop,#ntAdd,#ntFab,nav')};

document.body.insertAdjacentHTML('beforeend',`
<button id="ntAdd">📝 أضف ملاحظة</button>
<div id="ntPop"><q id="ntQ"></q><textarea id="ntT" placeholder="ماذا تريد أن تعدّل أو تتذكر هنا؟"></textarea>
<div style="display:flex;gap:8px;margin-top:8px"><button class="nb" id="ntSave">حفظ</button><button class="nb g" id="ntCancel">إلغاء</button></div></div>
<button id="ntFab">📒 الملاحظات<span id="ntCnt">0</span></button>
<aside id="ntPanel"><header><b>📒 ملاحظاتي</b><button class="nb g" id="ntGen">+ عامة</button><button class="nb" id="ntCopy">نسخ</button><button class="nb g" id="ntDl">تنزيل</button><button class="nb g" id="ntX">✕</button></header>
<div id="ntList"></div></aside>`);
const add=$('#ntAdd'),pop=$('#ntPop');
let pending=null;

/* selection → floating button */
document.addEventListener('mouseup',e=>{
  setTimeout(()=>{
    const s=getSelection();
    if(!s||s.isCollapsed||!s.toString().trim()||inUI(s.anchorNode)||!main.contains(s.anchorNode)){add.style.display='none';return}
    const r=s.getRangeAt(0),rect=r.getBoundingClientRect();
    pending={quote:s.toString().trim().slice(0,300),sec:(secOf(r.startContainer)||{}).id||'top',range:r.cloneRange()};
    add.style.display='block';
    add.style.top=(scrollY+rect.top-40)+'px';
    add.style.left=Math.max(8,scrollX+rect.left+rect.width/2-60)+'px';
  },10);
});
add.onmousedown=e=>e.preventDefault();
add.onclick=()=>openPop(pending);
function openPop(p){
  add.style.display='none';
  $('#ntQ').textContent=p&&p.quote?'«'+p.quote+'»':'ملاحظة عامة';
  $('#ntT').value='';pop.style.display='block';
  pop.style.left='50%';pop.style.top='30%';pop.style.transform='translateX(-50%)';
  pending=p||{quote:'',sec:'top'};$('#ntT').focus();
}
$('#ntCancel').onclick=()=>{pop.style.display='none';pending=null};
$('#ntSave').onclick=()=>{
  const t=$('#ntT').value.trim();if(!t)return;
  const n={id:Date.now(),sec:pending.sec,quote:pending.quote,text:t,done:false,ts:new Date().toLocaleString('ar'),occ:0};
  if(pending.range&&pending.quote){
    const sec=document.getElementById(pending.sec),w=document.createTreeWalker(sec,4);let c=0,x;
    while((x=w.nextNode())){if(x===pending.range.startContainer)break;if(x.data.includes(pending.quote))c++}
    n.occ=c;
  }
  notes.push(n);pop.style.display='none';getSelection().removeAllRanges();pending=null;save();
};
$('#ntGen').onclick=()=>openPop(null);

/* highlight (works when the quote sits inside one text node) */
function secTitle(id){const s=document.getElementById(id);return s?(s.dataset.nav||id):''}
function highlight(){
  document.querySelectorAll('mark.nt').forEach(m=>{const p=m.parentNode;p.replaceChild(document.createTextNode(m.textContent),m);p.normalize()});
  notes.forEach(n=>{
    if(!n.quote)return;const sec=document.getElementById(n.sec);if(!sec)return;
    const w=document.createTreeWalker(sec,4,{acceptNode:x=>x.parentNode.closest('mark.nt,script,style')?2:1});
    let c=0,x;
    while((x=w.nextNode())){
      const i=x.data.indexOf(n.quote);
      if(i<0)continue;
      if(c++<n.occ&&n.occ>0&&false)continue;
      try{const r=document.createRange();r.setStart(x,i);r.setEnd(x,i+n.quote.length);
        const m=document.createElement('mark');m.className='nt'+(n.done?' done':'');m.dataset.id=n.id;m.title=n.text;r.surroundContents(m);}catch(e){}
      break;
    }
  });
}
document.addEventListener('click',e=>{const m=e.target.closest&&e.target.closest('mark.nt');if(m){panel(true);const it=document.getElementById('ni'+m.dataset.id);it&&it.scrollIntoView({block:'center'})}});

function render(){
  $('#ntCnt').textContent=notes.filter(n=>!n.done).length;
  const L=$('#ntList');
  L.innerHTML=notes.length?'':'<p class="note">حدّد أي نص في الصفحة ثم اضغط «أضف ملاحظة». ستظهر هنا قائمة بكل ما تريد تعديله.</p>';
  notes.forEach(n=>{
    const d=document.createElement('div');d.className='ni'+(n.done?' done':'');d.id='ni'+n.id;
    const q=document.createElement('div');q.className='q';q.textContent=n.quote?'«'+n.quote+'»':'ملاحظة عامة';
    const s=document.createElement('div');s.className='s';s.textContent=secTitle(n.sec)+' · '+n.ts;
    const p=document.createElement('p');p.textContent=n.text;
    const a=document.createElement('div');a.className='a';
    const mk=(t,c,f)=>{const b=document.createElement('button');b.className='nb '+c;b.textContent=t;b.onclick=f;a.appendChild(b)};
    mk(n.done?'↩ إعادة فتح':'✔ تم','g',()=>{n.done=!n.done;save()});
    mk('✎ تعديل','g',()=>{const v=prompt('عدّل الملاحظة',n.text);if(v!==null&&v.trim()){n.text=v.trim();save()}});
    mk('🗑 حذف','r',()=>{if(confirm('حذف هذه الملاحظة؟')){notes=notes.filter(z=>z!==n);save()}});
    q.onclick=()=>{const m=document.querySelector('mark.nt[data-id="'+n.id+'"]');const t=m||document.getElementById(n.sec);if(t){t.scrollIntoView({behavior:'smooth',block:'center'});if(m){m.classList.add('flash');setTimeout(()=>m.classList.remove('flash'),1500)}}};
    d.append(q,s,p,a);L.appendChild(d);
  });
  highlight();
}
function md(){return '# ملاحظات التعديل — Jeeny Campus\n\n'+notes.map((n,i)=>`${i+1}. [${n.done?'x':' '}] **${secTitle(n.sec)}**${n.quote?`\n   > ${n.quote}`:''}\n   ${n.text.replace(/\n/g,'\n   ')}`).join('\n\n')}
$('#ntCopy').onclick=async()=>{await navigator.clipboard.writeText(md());$('#ntCopy').textContent='تم ✔';setTimeout(()=>$('#ntCopy').textContent='نسخ',1200)};
$('#ntDl').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([md()],{type:'text/markdown'}));a.download='notes.md';a.click()};
function panel(o){$('#ntPanel').classList.toggle('open',o)}
$('#ntFab').onclick=()=>panel(!$('#ntPanel').classList.contains('open'));
$('#ntX').onclick=()=>panel(false);
render();
})();
