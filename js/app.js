/* ---------- storage ---------- */
const KEY='ege70-v1';
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
const S=Object.assign({days:{},st:{},acc:{},essay:'',checks:{},exam:''},load());
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const norm=s=>String(s).toLowerCase().replace(/ё/g,'е').replace(/[\s.,;:!?«»"]/g,'');
const RESHU='https://rus-ege.sdamgia.ru/prob_catalog';
const FIPI='https://fipi.ru/ege/otkrytyy-bank-zadaniy-ege';
const ACC=EGE.ACC, TEXTS=EGE.TEXTS;
const QS=n=>EGE.Q[n]||[];

function textHtml(id){const t=TEXTS[id];if(!t)return '';return `<p>${t.s.map((s,i)=>`<span class="n">(${i+1})</span> ${esc(s)}`).join(' ')}</p>`}
function textDetails(id,open){const t=TEXTS[id];if(!t)return '';return `<details class="src" ${open?'open':''}><summary>${esc(t.title||'Текст')} · ${t.s.length} предложений</summary>${textHtml(id)}</details>`}

/* ---------- accents ---------- */
const VOW='аеёиоуыэюяАЕЁИОУЫЭЮЯ';
function stressIdx(w){for(let i=0;i<w.length;i++){const c=w[i];if(VOW.includes(c)&&c===c.toUpperCase()&&c!==c.toLowerCase())return i}return -1}
function showStress(w){const i=stressIdx(w);return w.toLowerCase().slice(0,i)+w[i].toUpperCase()+w.toLowerCase().slice(i+1)}
function wrongStress(w){const lw=w.toLowerCase(),si=stressIdx(w);const vs=[];for(let i=0;i<lw.length;i++)if(VOW.includes(lw[i])&&i!==si&&lw[i]!=='ё')vs.push(i);if(!vs.length)return null;const i=vs[Math.floor(Math.random()*vs.length)];return lw.slice(0,i)+lw[i].toUpperCase()+lw.slice(i+1)}
function genAccentQ(){
  const pool=shuffle(ACC.filter(w=>wrongStress(w))).slice(0,5);
  const bad=Math.floor(Math.random()*5);
  const o=pool.map((w,i)=>i===bad?wrongStress(w):showStress(w));
  return {t:'c',tid:4,q:'В каком слове ударение (выделена заглавная буква) поставлено НЕВЕРНО?',o,a:bad,e:`Верно: ${showStress(pool[bad])}. Остальные — по списку ФИПИ.`};
}

/* ---------- 30-day plan ---------- */
const PLAN=[
{w:'Неделя 1 · Нормы и быстрые баллы',days:[
['Диагностика','Реши один вариант на Решу ЕГЭ без подсказок (часть 1). Запиши, какие задания провалены — это твоя карта слабых мест.',[]],
['Ударения и паронимы','Теория №4 и №5, первые 60 слов списка, таблица паронимов.',[4,5]],
['Лексика и формы слов','№6 (плеоназмы, сочетаемость) и №7 (формы слов). По 10 заданий на Решу ЕГЭ.',[6,7]],
['Синтаксические нормы, день 1','№8: выучи таблицу из 9 ошибок, реши первые наборы в тренажёре.',[8]],
['Синтаксические нормы, день 2','№8: остальные наборы и 15 заданий на Решу ЕГЭ.',[8]],
['Корни','№9: чередования — таблица наизусть. Весь тренажёр.',[9]],
['Приставки + мини-проверка','№10 и повтор 4–9 в «Миксе».',[10]]]},
{w:'Неделя 2 · Орфография и пунктуация',days:[
['Суффиксы и окончания','№11 и №12: спряжения, причастия. Список исключений II спряжения — наизусть.',[11,12]],
['НЕ и НИ','№13: таблица «слитно / раздельно».',[13]],
['Слитно, дефис, раздельно','№14: предлоги, союзы, наречия, пол-.',[14]],
['-Н- и -НН-','№15: отымённые и отглагольные, исключения.',[15]],
['Повтор орфографии','По 5 заданий каждого номера 9–15 на Решу ЕГЭ. Ошибки — в тетрадь.',[9,10,11,12,13,14,15]],
['Сложносочинённое предложение','№16: основы, общий член, однородные с союзами.',[16]],
['Обособления','№17: причастные и деепричастные обороты.',[17]]]},
{w:'Неделя 3 · Пунктуация до конца и работа с текстом',days:[
['Вводные слова и обращения','№18: таблица «вводные / не вводные».',[18]],
['СПП и разные виды связи','№19 и №20: стык союзов.',[19,20]],
['Пунктуационный анализ','№21: тире и двоеточие.',[21]],
['Пробник №1 (часть 1)','Вариант на Решу ЕГЭ, задания 1–26, засеки 1,5 часа. Разбор всех ошибок.',[]],
['Работа с текстом','№1–3: подбор слова, значение слова, стиль текста.',[1,2,3]],
['Содержание и типы речи','№23–24.',[23,24]],
['Лексика и средства связи','№25–26.',[25,26]]]},
{w:'Неделя 4 · Средства выразительности, сочинение, пробники',days:[
['Средства выразительности','№22 (2 балла): таблица терминов и весь тренажёр.',[22]],
['Сочинение: теория','Критерии, шаблон, банк аргументов. Выучи клише.',[27]],
['Сочинение №1','Текст с Решу ЕГЭ. Пиши по шаблону, проверь по чек-листу.',[27]],
['Пробник №2 целиком','3 часа 30 минут, как на экзамене.',[]],
['Разбор пробника','5 самых слабых заданий — теория и тренажёр заново.',[]],
['Сочинение №2 + ударения','Новое сочинение и весь список ударений.',[27,4]],
['Пробник №3 целиком','Цель — 40 первичных баллов и больше.',[]],
['Работа над ошибками','«Сложные» в ударениях, «Микс» 3 раза.',[4]],
['Лёгкий день','Перечитай шпаргалки №8, 16–20 и шаблон сочинения. Ляг спать вовремя.',[8,27]]]}];

/* ---------- essay ---------- */
const CRIT=[['К1','Формулировка позиции автора по одной из проблем текста',1],['К2','Комментарий: 2 примера-иллюстрации с пояснениями + смысловая связь между ними и её анализ',3],['К3','Собственное отношение к позиции автора и его обоснование',2],['К4','Фактологическая точность речи',1],['К5','Логичность речи',2],['К6','Этические нормы',1],['К7','Орфография',3],['К8','Пунктуация',3],['К9','Грамматика',3],['К10','Речевые нормы',3]];
const STEPS=[
['Вступление','2–3 предложения, подводящие к проблеме.','Каждый из нас хоть раз задумывался о том, что делает слово ценным. Об этом размышляет и автор текста.'],
['Проблема','Сформулируй её вопросом.','В центре внимания автора — проблема ценности живого общения: почему слово, написанное от руки, значит больше быстрого сообщения?'],
['Пример 1 + пояснение','Ссылка на предложения, затем что этот пример показывает.','Рассказывая о письмах бабушки, автор вспоминает, как она спрашивала о самом простом: тепло ли он одевается (предложение 8). Этот пример показывает, что в письме ценна забота, а не информация.'],
['Пример 2 + пояснение','Второй эпизод, тоже с номерами предложений.','Кроме того, автор признаётся, что теперь отдал бы многое, чтобы снова получить такой конверт (предложение 10). Он осознал ценность писем, только потеряв их.'],
['Связь между примерами','Назови тип связи и объясни, зачем она.','Примеры противопоставлены: в первом юноша не ценит письма, во втором взрослый человек понимает их значение. Это противопоставление показывает, как меняется отношение к заботе с годами.'],
['Позиция автора','Одно-два предложения, ответ на вопрос-проблему.','Позиция автора ясна: письмо — это время, которое человек дарит другому, поэтому оно ценно.'],
['Своё отношение + обоснование','Согласись и обоснуй: литература или жизнь.','Я согласен с автором. Вспомним «Уроки французского» В. Распутина: учительница тратит своё время на ученика, и именно эта забота остаётся с ним на всю жизнь.'],
['Вывод','2 предложения, без новых мыслей.','Таким образом, ценно то слово, в которое вложены время и внимание. Стоит чаще дарить близким такие слова.']];
const PHRASES={
'Проблема':['В центре внимания автора — проблема …','Над каким вопросом размышляет автор? Над проблемой …','Автор поднимает важную проблему: …'],
'Пример':['Рассказывая о …, автор обращает внимание на то, что … (предложения …).','Этот пример показывает, что …','Кроме того, автор приводит другой пример: …','Ещё одним подтверждением служит эпизод, в котором …'],
'Связь':['Оба примера, дополняя друг друга, показывают, что …','Примеры противопоставлены: если в первом …, то во втором …','Второй пример объясняет причину того, о чём говорится в первом: …'],
'Позиция':['Позиция автора ясна: …','Автор убеждён, что …','По мнению автора, …'],
'Своё мнение':['Я согласен с автором: …','Трудно не согласиться с позицией автора, ведь …','Вспомним произведение … (автор), в котором …'],
'Вывод':['Таким образом, …','Итак, …','Подводя итог, можно сказать, что …']};
const ARGS=[
['Совесть и честь','А. С. Пушкин, «Капитанская дочка»','Гринёв сохраняет верность присяге даже под угрозой смерти; Швабрин предаёт ради выгоды.'],
['Милосердие, сострадание','М. Шолохов, «Судьба человека»','Андрей Соколов, потерявший на войне семью, усыновляет сироту Ванюшу.'],
['Подвиг на войне','Б. Васильев, «А зори здесь тихие…»','Девушки-зенитчицы ценой жизни задерживают отряд диверсантов.'],
['Сила духа','Б. Полевой, «Повесть о настоящем человеке»','Лётчик Мересьев без обеих ног возвращается в авиацию.'],
['Роль учителя, доброта','В. Распутин, «Уроки французского»','Лидия Михайловна рискует работой, чтобы помочь голодному ученику.'],
['Отцы и дети','И. Тургенев, «Отцы и дети»','Спор Базарова и Павла Петровича — конфликт поколений и взглядов.'],
['Человек и природа','В. Астафьев, «Царь-рыба»','Браконьер Игнатьич в схватке с огромной рыбой осознаёт свою вину перед природой.'],
['Историческая память','В. Распутин, «Прощание с Матёрой»','Жители затопляемой деревни прощаются с домом, кладбищем, памятью предков.'],
['Равнодушие, одиночество','А. Чехов, «Тоска»','Извозчику Ионе некому рассказать о смерти сына — он говорит с лошадью.'],
['Духовная деградация','А. Чехов, «Ионыч»','Молодой врач Старцев постепенно превращается в равнодушного обывателя.'],
['Нравственный выбор','Ф. Достоевский, «Преступление и наказание»','Раскольников проверяет свою теорию преступлением и приходит к раскаянию.'],
['Мечта и вера','А. Грин, «Алые паруса»','Ассоль верит в мечту, и Грэй исполняет её.'],
['Самопожертвование','М. Горький, «Старуха Изергиль»','Данко вырывает своё сердце, чтобы осветить людям путь.'],
['Сила искусства','К. Паустовский, «Корзина с еловыми шишками»','Музыка Грига, написанная для Дагни, меняет её взгляд на мир.'],
['Ценность книг','Р. Брэдбери, «451° по Фаренгейту»','В обществе, где жгут книги, люди теряют способность думать и чувствовать.'],
['Доброта и интеллигентность','Д. Лихачёв, «Письма о добром и прекрасном»','Автор объясняет, что интеллигентность — это умение понимать других и уважать их.']];
const CHECKS=['Проблема сформулирована и связана с текстом','Позиция автора совпадает с текстом, а не придумана','Пример 1: номер предложения и пояснение','Пример 2: номер предложения и пояснение','Названа связь между примерами и объяснено, что она показывает','Выражено согласие с автором и есть обоснование','Название произведения и автор указаны точно','Есть вывод','250–350 слов, 5–7 абзацев','Перечитано на повторы слов и местоимения «он/она» без ясного смысла'];

/* ---------- helpers ---------- */
function stat(n){const s=S.st[n];if(!s||!s.n)return {txt:'не начато',cls:''};const p=Math.round(s.r/s.n*100);return {txt:p+'%',cls:p>=80?'good':p>=50?'mid':'bad',p}}
function record(n,ok){if(!n)return;const s=S.st[n]||(S.st[n]={r:0,n:0});s.n++;if(ok)s.r++;save()}
const GROUPS=[['Работа с текстом',[1,2,3]],['Орфоэпия и лексика',[4,5,6]],['Грамматические нормы',[7,8]],['Орфография',[9,10,11,12,13,14,15]],['Пунктуация',[16,17,18,19,20,21]],['Текст и выразительность',[22,23,24,25,26]],['Часть 2',[27]]];

/* ---------- trainer ---------- */
function trainer(el,qs,tid,opts={}){
  let i=0,score=0,errs={};
  if(!qs.length){el.innerHTML='<p class="dd">Заданий пока нет.</p>';return}
  function finish(){
    const n=qs.length;const list=Object.keys(errs);
    el.innerHTML=`<div class="tr"><div class="fb ${score/n>=.7?'ok':'no'}"><strong>Готово: ${score} из ${n}</strong>${list.length?'Повтори теорию: '+list.map(k=>`<a href="#task-${k}">№${k}</a>`).join(', '):'Ошибок нет. Переходи к заданиям на Решу ЕГЭ.'}</div><div class="row"><button class="btn pri" id="again">${opts.mix?'Новый микс':'Пройти ещё раз'}</button></div></div>`;
    $('#again',el).onclick=()=>opts.restart?opts.restart():(i=0,score=0,errs={},qs=shuffle(qs),draw());
  }
  function done(ok,q,html){
    const t=q.tid||tid;record(t,ok);if(ok)score++;else errs[t]=1;
    const fb=document.createElement('div');fb.className='fb '+(ok?'ok':'no');
    fb.innerHTML=`<strong>${ok?'Верно':'Ошибка'}</strong>${html||''}${q.e?'<div>'+esc(q.e)+'</div>':''}`;
    const nb=document.createElement('button');nb.className='btn pri';nb.textContent=i<qs.length-1?'Дальше':'Итог';nb.onclick=()=>{if(i<qs.length-1){i++;draw()}else finish()};
    const box=$('.tr',el);box.append(fb);const r=document.createElement('div');r.className='row';r.append(nb);box.append(r);nb.focus();
  }
  function draw(){
    const q=qs[i];
    let body='';
    if(q.txt)body+=textDetails(q.txt,true);
    if(q.l)body+=`<ol class="list">${q.l.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`;
    if(q.t==='c')body+=`<div class="opts">${q.o.map((o,k)=>`<button class="opt" data-k="${k}"><span class="k">${k+1}</span><span>${esc(o)}</span></button>`).join('')}</div>`;
    if(q.t==='m')body+=`<div class="opts">${q.o.map((o,k)=>`<button class="opt" data-k="${k+1}" aria-pressed="false"><span class="k">${k+1}</span><span>${esc(o)}</span></button>`).join('')}</div><div class="row"><button class="btn pri" id="chk">Проверить</button></div>`;
    if(q.t==='n')body+=`<div class="sent">${esc(q.s).replace(/\((\d+)\)/g,'<b>($1)</b>')}</div><div class="opts inline">${Array.from({length:q.k},(_,k)=>`<button class="opt" data-k="${k+1}" aria-pressed="false"><span class="mono">${k+1}</span></button>`).join('')}</div><div class="row"><button class="btn pri" id="chk">Проверить</button></div>`;
    if(q.t==='i')body+=`<div class="row"><input class="blank" id="inp" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Ответ"><button class="btn pri" id="chk">Проверить</button></div>`;
    if(q.t==='x')body+=`<ol class="list">${q.R.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><div>${q.L.map((l,k)=>`<div class="matchrow" data-k="${k}"><span>${esc(l)}</span><select id="x${k}" aria-label="Номер предложения"><option value="">—</option>${q.R.map((_,j)=>`<option>${j+1}</option>`).join('')}</select></div>`).join('')}</div><div class="row"><button class="btn pri" id="chk">Проверить</button></div>`;
    el.innerHTML=`<div class="tr"><span class="counter">${opts.mix?'Задание №'+q.tid+' · ':''}${i+1} / ${qs.length}</span><div class="q">${esc(q.q)}</div>${body}</div>`;
    const ob=[...el.querySelectorAll('.opt')];
    if(q.t==='c')ob.forEach(b=>b.onclick=()=>{const k=+b.dataset.k;ob.forEach(x=>x.disabled=true);ob[q.a].classList.add('ok');if(k!==q.a)b.classList.add('no');done(k===q.a,q)});
    if(q.t==='m'||q.t==='n'){ob.forEach(b=>b.onclick=()=>{b.classList.toggle('sel');b.setAttribute('aria-pressed',b.classList.contains('sel'))});
      $('#chk',el).onclick=function(){const sel=ob.filter(b=>b.classList.contains('sel')).map(b=>+b.dataset.k);const ok=sel.length===q.a.length&&q.a.every(x=>sel.includes(x));
        ob.forEach(b=>{const k=+b.dataset.k;b.disabled=true;const want=q.a.includes(k),got=sel.includes(k);b.classList.remove('sel');if(want&&got)b.classList.add('ok');else if(got)b.classList.add('no');else if(want)b.classList.add('missed')});
        this.remove();done(ok,q,`<div class="mono">Ответ: ${q.a.length?q.a.join(''):'нет таких'}</div>`)}}
    if(q.t==='i'){const inp=$('#inp',el);if(!opts.mix)inp.focus();const go=function(){const v=norm(inp.value);if(!v)return;const ok=q.a.some(a=>norm(a)===v);inp.disabled=true;$('#chk',el).remove();done(ok,q,`<div class="mono">Ответ: ${esc(q.a[0])}</div>`)};$('#chk',el).onclick=go;inp.onkeydown=e=>{if(e.key==='Enter')go()}}
    if(q.t==='x')$('#chk',el).onclick=function(){let right=0;q.L.forEach((_,k)=>{const v=+$('#x'+k,el).value;const row=el.querySelector(`.matchrow[data-k="${k}"]`);const ok=v===q.a[k];if(ok)right++;row.classList.add(ok?'ok':'no');$('#x'+k,el).disabled=true});this.remove();
      done(right===q.L.length,q,`<div class="mono">Верно ${right} из ${q.L.length}. Ответ: ${q.a.join('')}</div>`)};
  }
  draw();
}

/* ---------- accents trainer ---------- */
function accentTrainer(el){
  let mode='all',queue=[],cur=null,right=0,total=0;
  const hard=()=>ACC.filter(w=>S.acc[w]>0);
  const refill=()=>{queue=shuffle(mode==='hard'?hard():ACC)};
  function bind(){el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{mode=b.dataset.m;refill();draw()})}
  function draw(){
    const h=hard().length;
    if(!queue.length)refill();
    if(!queue.length){el.innerHTML=`<div class="row"><button class="btn" data-m="all">Все слова</button></div><p>Сложных слов нет. Переключись на «Все слова».</p>`;bind();return}
    cur=queue.pop();const lw=cur.toLowerCase(),si=stressIdx(cur);
    el.innerHTML=`<div class="tr">
      <div class="row" style="justify-content:space-between"><div class="row"><button class="btn ${mode==='all'?'pri':''}" data-m="all">Все слова (${ACC.length})</button><button class="btn ${mode==='hard'?'pri':''}" data-m="hard">Сложные (${h})</button></div>
      <span class="counter">сессия: ${right}/${total}</span></div>
      <p class="hint counter">Нажми на ударную гласную</p>
      <div class="word">${[...lw].map((c,k)=>VOW.includes(c)?`<button data-k="${k}" aria-label="ударение на ${c}">${c}</button>`:`<span>${c}</span>`).join('')}</div>
      <div id="afb"></div></div>`;
    bind();
    const bs=[...el.querySelectorAll('.word button')];
    bs.forEach(b=>b.onclick=()=>{const k=+b.dataset.k;const ok=k===si;total++;if(ok)right++;record(4,ok);
      S.acc[cur]=ok?Math.max(0,(S.acc[cur]||0)-1):(S.acc[cur]||0)+2;save();
      bs.forEach(x=>x.disabled=true);el.querySelector(`.word button[data-k="${si}"]`).classList.add('ok');if(!ok)b.classList.add('no');
      $('#afb',el).innerHTML=`<div class="fb ${ok?'ok':'no'}"><strong>${ok?'Верно':'Ошибка'}: ${showStress(cur)}</strong>${ok?'':'Слово добавлено в «Сложные». Повтори вслух три раза.'}</div><div class="row" style="margin-top:10px"><button class="btn pri" id="anext">Дальше</button></div>`;
      $('#anext',el).onclick=draw;$('#anext',el).focus()});
  }
  draw();
}

/* ---------- views ---------- */
const app=$('#app');
function daysLeft(){if(!S.exam)return null;const d=new Date(S.exam+'T09:00');return Math.ceil((d-new Date())/864e5)}
function viewPlan(){
  const all=PLAN.flatMap(w=>w.days);const doneN=all.filter((_,i)=>S.days[i+1]).length;const firstOpen=all.findIndex((_,i)=>!S.days[i+1])+1;
  const dl=daysLeft();let k=0;
  app.innerHTML=`
  <section><div class="eyebrow">ЕГЭ · русский язык · 30 дней</div><h1>План на 70 баллов</h1>
  <p class="lead">Каждый день: теория по номеру, тренажёр здесь, потом 10–15 заданий того же номера в банке Решу ЕГЭ или ФИПИ. Отмечай дни галочкой — прогресс сохраняется в этом браузере.</p></section>
  <section class="target">
    <div><div class="eyebrow">Цель</div><div class="big">≈40 <small>/ 50 перв.</small></div><div class="dd">Примерно столько дают 70 тестовых баллов. Шкала меняется каждый год.</div></div>
    <div><div class="eyebrow">Часть 1 (№1–26)</div><div class="big">22+ <small>/ 28</small></div><div class="dd">Можно ошибиться в 5–6 заданиях.</div></div>
    <div><div class="eyebrow">Сочинение (№27)</div><div class="big">18+ <small>/ 22</small></div><div class="dd">Почти половина результата. Пиши по шаблону.</div></div>
  </section>
  <section class="panel"><div class="kv"><label for="exam"><b>Дата пробника:</b></label><input type="date" id="exam" value="${S.exam||''}"><span class="mono">${dl==null?'':dl>0?'осталось '+dl+' дн.':dl===0?'сегодня!':'дата прошла'}</span></div>
    <div style="margin-top:14px"><div class="row" style="justify-content:space-between"><b>Пройдено дней</b><span class="mono">${doneN} / 30</span></div><div class="progress" style="margin-top:6px"><i style="width:${doneN/30*100}%"></i></div></div></section>
  <section class="panel"><h2>Каждый день (≈1–1,5 часа)</h2><ul>
    <li><b>15 мин</b> — 20–30 слов в «Ударениях». Ошибки уходят в «Сложные».</li>
    <li><b>20 мин</b> — теория и тренажёр по теме дня.</li>
    <li><b>30 мин</b> — 10–15 заданий того же номера: <a href="${RESHU}" target="_blank" rel="noopener">каталог Решу ЕГЭ</a> или <a href="${FIPI}" target="_blank" rel="noopener">открытый банк ФИПИ</a>.</li>
    <li><b>5 мин</b> — один «Микс» для повторения пройденного.</li></ul>
    <p class="dd">Ошибки выписывай в тетрадь с правилом. Перед пробником перечитай только её.</p></section>
  <section class="weeks">${PLAN.map(w=>`<div class="week"><h2>${w.w}</h2><div class="days">${w.days.map(d=>{k++;return `<div class="day ${S.days[k]?'done':''} ${k===firstOpen?'today':''}"><input type="checkbox" id="d${k}" data-d="${k}" ${S.days[k]?'checked':''} aria-label="День ${k} выполнен"><label class="dn" for="d${k}">день ${k}</label><div><div class="dt">${d[0]}${k===firstOpen?' <span class="state mid">сегодня</span>':''}</div><div class="dd">${d[1]}</div>${d[2].length?`<div class="chips">${d[2].map(n=>`<a class="chip" href="${n===27?'#essay':'#task-'+n}">№${n}</a>`).join('')}</div>`:''}</div></div>`}).join('')}</div></div>`).join('')}</section>`;
  app.querySelectorAll('[data-d]').forEach(c=>c.onchange=()=>{S.days[c.dataset.d]=c.checked;save();viewPlan()});
  $('#exam').onchange=e=>{S.exam=e.target.value;save();viewPlan()};
}
function count(n){return n===4?ACC.length+' слов':n===27?'22 балла':QS(n).length+' заданий'}
function viewTasks(){
  app.innerHTML=`<section><div class="eyebrow">Бланк ответов №1</div><h1>27 заданий</h1><p class="lead">У каждого номера: теория с алгоритмом, ловушки и тренажёр. Процент — доля верных ответов в тренажёре.</p></section>
  ${GROUPS.map(([g,ns])=>`<section><h2>${g}</h2><div class="grid" style="margin-top:10px">${ns.map(n=>{const s=stat(n);return `<a class="cell" href="${n===27?'#essay':'#task-'+n}"><span class="no">№${n}<span class="state ${s.cls}">${n===27?'часть 2':s.txt}</span></span><span class="tt">${T[n].title}</span><span class="cnt">${count(n)}</span>${s.p!=null?`<span class="progress"><i style="width:${s.p}%"></i></span>`:''}</a>`}).join('')}</div></section>`).join('')}`;
}
function viewTask(n){
  const t=T[n];if(!t)return viewTasks();if(n===27){location.hash='essay';return}
  const s=stat(n);const qs=QS(n);
  app.innerHTML=`<section><a class="back" href="#tasks">← Все задания</a><div class="eyebrow" style="margin-top:14px">Задание ${n} · ${t.b}${t.pts?' · больше 1 балла':''}</div><h1>${t.title}</h1>
    <div class="row" style="margin-top:10px"><span class="state ${s.cls}">тренажёр: ${s.txt}</span><span class="counter">${count(n)}</span><a class="chip" href="${RESHU}" target="_blank" rel="noopener">Решу ЕГЭ → каталог → №${n}</a><a class="chip" href="${FIPI}" target="_blank" rel="noopener">Банк ФИПИ</a></div></section>
  <section class="panel theory"><h2 style="margin-bottom:8px">Теория</h2>${t.theory}${EGE.EXTRA[n]||''}</section>
  <section class="panel"><div class="row" style="justify-content:space-between;margin-bottom:12px"><h2>Тренажёр</h2>${t.accent?'':`<button class="btn ghost" id="shuf">Перемешать</button>`}</div><div id="trn"></div></section>
  <nav class="row" style="justify-content:space-between">${n>1?`<a class="btn" href="#task-${n-1}">← №${n-1}</a>`:'<span></span>'}${n<26?`<a class="btn" href="#task-${n+1}">№${n+1} →</a>`:`<a class="btn" href="#essay">Сочинение →</a>`}</nav>`;
  const el=$('#trn');
  if(t.accent){accentTrainer(el)}else{trainer(el,qs,n);$('#shuf').onclick=()=>trainer(el,shuffle(qs),n)}
}
function viewAccents(){
  const sorted=[...ACC].sort((a,b)=>a.toLowerCase().localeCompare(b.toLowerCase(),'ru'));
  app.innerHTML=`<section><div class="eyebrow">Задание 4 · орфоэпический список ФИПИ</div><h1>Ударения</h1><p class="lead">${ACC.length} слов из списка ФИПИ. Ошибка добавляет слово в «Сложные», два верных ответа убирают его оттуда.</p></section>
  <section class="panel"><div id="acc"></div></section>
  <section class="panel"><details><summary>Весь список (${ACC.length})</summary><p style="columns:12rem;margin-top:10px">${sorted.map(w=>`<span style="display:block">${showStress(w)}</span>`).join('')}</p></details></section>`;
  accentTrainer($('#acc'));
}
function words(s){return (s.match(/[А-Яа-яЁёA-Za-z0-9-]+/g)||[]).length}
function viewEssay(){
  app.innerHTML=`<section><div class="eyebrow">Задание 27 · 22 первичных балла</div><h1>Сочинение</h1><p class="lead">Почти половина результата. Сочинение по шаблону надёжно даёт 17–20 баллов. Формулируй позицию автора по проблеме: это критерий К1, и без него К2 и К3 тоже обнуляются.</p></section>
  <section class="panel"><h2>Критерии</h2><div class="tbl theory" style="margin-top:10px"><table class="crit"><tr><th>Критерий</th><th>Что проверяют</th><th>Макс.</th></tr>${CRIT.map(c=>`<tr><td>${c[0]}</td><td>${c[1]}</td><td class="mono">${c[2]}</td></tr>`).join('')}<tr><td></td><td><b>Итого</b></td><td class="mono"><b>22</b></td></tr></table></div>
  <p class="note" style="margin-top:12px">Объём: пиши 250–350 слов. Слишком короткая работа (меньше 150 слов) может получить 0. Сочинение, не связанное с текстом, или пересказ — тоже 0. Сверь точные пороги с критериями ФИПИ 2026.</p></section>
  <section class="panel"><h2>Шаблон по шагам</h2><div style="display:flex;flex-direction:column;gap:12px;margin-top:12px">${STEPS.map((s,i)=>`<div><b>${i+1}. ${s[0]}</b> <span class="dd">— ${s[1]}</span><div class="algo" style="margin-top:4px">${s[2]}</div></div>`).join('')}</div>
  ${TEXTS.t1?`<div style="margin-top:12px">${textDetails('t1',false)}</div>`:''}</section>
  <section class="panel"><h2>Клише</h2><div class="args" style="margin-top:12px">${Object.entries(PHRASES).map(([k,v])=>`<div><b>${k}</b><ul class="list">${v.map(x=>`<li>${x}</li>`).join('')}</ul></div>`).join('')}</div></section>
  <section class="panel"><h2>Банк аргументов</h2><p class="dd">Выучи 6–8 произведений, которые закрывают разные проблемы. Проверь, что помнишь имена героев.</p><div class="args">${ARGS.map(a=>`<div><span class="eyebrow">${a[0]}</span><b>${a[1]}</b>${a[2]}</div>`).join('')}</div></section>
  <section class="panel"><h2>Черновик и самопроверка</h2><p class="dd">Возьми текст на Решу ЕГЭ (задание 27), пиши здесь. Черновик сохраняется в браузере.</p>
    <textarea id="ess" aria-label="Черновик сочинения" placeholder="В центре внимания автора — проблема …">${esc(S.essay||'')}</textarea>
    <div class="row" style="justify-content:space-between;margin-top:8px"><span class="mono" id="wc"></span><button class="btn ghost" id="clr">Очистить чек-лист</button></div>
    <div class="checks" style="margin-top:12px">${CHECKS.map((c,i)=>`<label><input type="checkbox" data-c="${i}" ${S.checks[i]?'checked':''}><span>${c}</span></label>`).join('')}</div></section>`;
  const ta=$('#ess'),wc=$('#wc');
  const upd=()=>{const n=words(ta.value);wc.textContent=`${n} слов · ${n<150?'мало':n<250?'можно больше':n<=400?'хороший объём':'многовато'}`;wc.style.color=n<150?'var(--red)':n<250?'var(--amber)':'var(--green)'};
  ta.oninput=()=>{S.essay=ta.value;save();upd()};upd();
  app.querySelectorAll('[data-c]').forEach(c=>c.onchange=()=>{S.checks[c.dataset.c]=c.checked;save()});
  $('#clr').onclick=()=>{S.checks={};save();app.querySelectorAll('[data-c]').forEach(c=>c.checked=false)};
}
function viewMix(){
  app.innerHTML=`<section><div class="eyebrow">Повторение</div><h1>Микс</h1><p class="lead">15 случайных заданий из всех номеров. Делай один микс в день: так пройденное не забывается.</p></section><section class="panel"><div id="mx"></div></section>`;
  const start=()=>{const pool=Object.values(EGE.Q).flat();
    for(let j=0;j<3;j++)pool.push(genAccentQ());
    trainer($('#mx'),shuffle(pool).slice(0,15),null,{mix:true,restart:start})};
  start();
}
function route(){
  const h=(location.hash||'#plan').slice(1);let v=h;
  if(h.startsWith('task-')){v='tasks';viewTask(+h.slice(5))}
  else if(h==='tasks')viewTasks();else if(h==='accents')viewAccents();else if(h==='essay')viewEssay();else if(h==='mix')viewMix();else{v='plan';viewPlan()}
  document.querySelectorAll('#tabs a').forEach(a=>a.classList.toggle('on',a.dataset.v===v));
  window.scrollTo(0,0);
}
addEventListener('hashchange',route);route();
