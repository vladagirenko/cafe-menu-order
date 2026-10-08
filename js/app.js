let S={screen:'menu',cat:'Усі',q:'',ex:new Set(),veg:false,cart:{},d:null,no:27,order:null,stage:0,timers:[]};
const $=s=>document.querySelector(s), esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const byId=id=>MENU.find(d=>d.id===id);
const count=()=>Object.values(S.cart).reduce((a,l)=>a+l.qty,0);
const total=c=>Object.entries(c).reduce((a,[id,l])=>a+byId(+id).p*l.qty,0);
function toast(t){const o=document.createElement('div');o.className='toast';o.textContent=t;document.body.appendChild(o);setTimeout(()=>o.remove(),1600)}
function tags(d){return d.al.map(a=>`<span class="tag">${a}</span>`).join('')+(d.veg?'<span class="tag v">вегетаріанська</span>':'')}
function filtered(){return MENU.filter(d=>(S.cat==='Усі'||d.cat===S.cat)&&d.name.toLowerCase().includes(S.q.toLowerCase())&&![...S.ex].some(a=>d.al.includes(a))&&(!S.veg||d.veg))}
function listHTML(){const l=filtered();return l.length?l.map(d=>`<div class="dish" data-a="open" data-id="${d.id}"><div class="pic">${d.e}</div><div class="info"><b>${d.name}</b><span class="meta">${d.w}, ${d.p} грн</span><div>${tags(d)}</div></div><button class="plus" data-a="quick" data-id="${d.id}" aria-label="Додати ${d.name} у кошик">+</button></div>`).join(''):'<div class="empty">Нічого не знайдено. Змініть пошук або вимкніть фільтри.</div>'}
function menuHTML(){return `<div class="tabs">${CATS.map(c=>`<button class="tab ${S.cat===c?'on':''}" data-a="cat" data-v="${c}">${c}</button>`).join('')}</div>
<input type="search" id="q" placeholder="Знайти страву за назвою" value="${esc(S.q)}" aria-label="Пошук страви">
<div class="chips">${EX.map(([k,t])=>`<button class="chip ${S.ex.has(k)?'on':''}" data-a="ex" data-v="${k}">${t}</button>`).join('')}<button class="chip ${S.veg?'on':''}" data-a="veg">Вегетаріанські</button></div>
<div id="list">${listHTML()}</div>`}
function itemsHTML(edit){return Object.entries(S.cart).map(([id,l])=>{const d=byId(+id);return `<div class="row"><div class="pic" style="width:52px;height:52px;font-size:1.8rem">${d.e}</div><div class="info"><b>${d.name}</b><span class="meta">${d.p*l.qty} грн${l.note?'. Побажання: '+esc(l.note):''}</span></div>${edit?`<div class="qty"><button data-a="dec" data-id="${id}" aria-label="Менше">−</button><span>${l.qty}</span><button data-a="inc" data-id="${id}" aria-label="Більше">+</button></div><button data-a="del" data-id="${id}" aria-label="Видалити" class="qty" style="background:none;font-size:1.2rem">🗑</button>`:`<b>× ${l.qty}</b>`}</div>`}).join('')}
function cartHTML(){const n=count();return `<button class="ghost" data-a="go" data-v="menu">← До меню</button><h2 style="margin:4px 0 12px">Замовлення</h2>${n?itemsHTML(true):'<div class="empty">Кошик порожній. Оберіть страви в меню.</div>'}
<div class="sum"><span>Разом</span><span>${total(S.cart)} грн</span></div><button class="primary" data-a="go" data-v="confirm" ${n?'':'disabled'}>Оформити</button>${n?'':'<p class="hint">Додайте хоча б одну страву, щоб оформити замовлення.</p>'}`}
function confirmHTML(){return `<button class="ghost" data-a="go" data-v="cart">← Назад до кошика</button><h2 style="margin:4px 0 12px">Перевірте замовлення</h2><div class="box"><b>Стіл №${TABLE}</b></div>${itemsHTML(false)}<div class="sum"><span>До сплати в закладі</span><span>${total(S.cart)} грн</span></div><button class="primary" data-a="send">Підтвердити замовлення</button><p class="hint">Оплата відбувається в закладі після отримання страв.</p>`}
function statusHTML(){const o=S.order;return `<div class="box done"><div class="ok">✔</div><h2 style="margin:0">Замовлення прийнято!</h2><div class="meta">Номер вашого замовлення</div><div class="num">№ ${o.no}</div><div class="meta">Стіл №${TABLE}, сума ${o.sum} грн</div></div>
<div class="box">${STAGES.map((s,i)=>`<div class="stage ${i<S.stage?'past':i===S.stage?'cur':''}"><i>${i<S.stage?'✓':''}</i><div>${s[0]}<div class="meta" style="font-weight:400">${i===S.stage?s[1]:''}</div></div></div>`).join('')}</div><button class="primary" data-a="new">Нове замовлення</button>`}
function render(){const n=STEPS.indexOf({menu:'Меню',cart:'Кошик',confirm:'Підтвердження',status:'Статус'}[S.screen])+1;
$('#app').innerHTML=`<header><div><h1>Кафе «Смачно»</h1><small>Стіл №${TABLE}</small></div><button class="cartbtn" data-a="go" data-v="cart" aria-label="Кошик">🛒 Кошик${count()?`<span class="badge">${count()}</span>`:''}</button></header>
<div class="steps">${STEPS.map((s,i)=>`<span class="${i<n?'on':''}"></span>`).join('')}</div><div class="stepname">Крок ${n} з 4: ${STEPS[n-1]}</div>
<main>${{menu:menuHTML,cart:cartHTML,confirm:confirmHTML,status:statusHTML}[S.screen]()}</main>`;
const q=$('#q');if(q)q.addEventListener('input',e=>{S.q=e.target.value;$('#list').innerHTML=listHTML()})}
function add(id,qty,note){const l=S.cart[id]||(S.cart[id]={qty:0,note:''});l.qty+=qty;if(note)l.note=note}
function openSheet(id){const d=byId(id);S.d={id,qty:1,note:''};const o=document.createElement('div');o.className='overlay';o.id='ov';
o.innerHTML=`<div class="sheet" role="dialog" aria-label="${d.name}"><div class="big">${d.e}</div><h2 style="margin:0 0 4px">${d.name}</h2><div class="meta">${d.w}, ${d.p} грн</div><p>${d.desc}</p><p><b>Склад:</b> ${d.ing}</p><p><b>Алергени:</b> ${d.al.length?d.al.join(', '):'не містить основних алергенів'}</p>
<div class="row" style="justify-content:space-between"><b>Кількість</b><div class="qty"><button data-a="dq" data-v="-1" aria-label="Менше">−</button><span id="dq">1</span><button data-a="dq" data-v="1" aria-label="Більше">+</button></div></div>
<textarea id="note" rows="2" placeholder="Побажання до страви (необов’язково)" aria-label="Побажання до страви"></textarea><div style="height:12px"></div>
<button class="primary" data-a="addd">Додати в кошик</button><button class="ghost" data-a="close" style="width:100%">Закрити</button></div>`;
document.body.appendChild(o);$('#note').addEventListener('input',e=>S.d.note=e.target.value)}
function closeSheet(){const o=$('#ov');if(o)o.remove();S.d=null}
function send(){S.order={no:S.no++,sum:total(S.cart)};S.cart={};S.stage=0;S.screen='status';S.timers.forEach(clearTimeout);
S.timers=[setTimeout(()=>{S.stage=1;if(S.screen==='status')render()},4000),setTimeout(()=>{S.stage=2;if(S.screen==='status')render()},9000)];render()}
document.addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(!t)return;const a=t.dataset.a,v=t.dataset.v,id=+t.dataset.id;
if(a==='cat'){S.cat=v;render()}
else if(a==='ex'){S.ex.has(v)?S.ex.delete(v):S.ex.add(v);render()}
else if(a==='veg'){S.veg=!S.veg;render()}
else if(a==='open')openSheet(id)
else if(a==='quick'){add(id,1);toast(byId(id).name+' додано в кошик');render()}
else if(a==='dq'){S.d.qty=Math.max(1,S.d.qty+ +v);$('#dq').textContent=S.d.qty}
else if(a==='addd'){add(S.d.id,S.d.qty,S.d.note.trim());toast(byId(S.d.id).name+' додано в кошик');closeSheet();render()}
else if(a==='close')closeSheet()
else if(a==='inc'){S.cart[id].qty++;render()}
else if(a==='dec'){S.cart[id].qty>1?S.cart[id].qty--:delete S.cart[id];render()}
else if(a==='del'){delete S.cart[id];render()}
else if(a==='go'){if(v==='confirm'&&!count())return;S.screen=v;render();scrollTo(0,0)}
else if(a==='send')send()
else if(a==='new'){S.timers.forEach(clearTimeout);S.screen='menu';render();scrollTo(0,0)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});
render();
