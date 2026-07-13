const app = document.querySelector('#app');
const particles = document.querySelector('#particles');
const STORE = 'romantic-emilia-progress-v1';
const START_DATE = '2026-07-01T00:00:00'; // Легко изменить дату начала отношений.
const greetings = ['Добро пожаловать, любимая ❤️','Добро пожаловать, Эмилия ❤️','Привет, солнышко ☀️','Рад снова видеть тебя ❤️','Добро пожаловать, звездочка ⭐'];
const challenges = [
'Скинь последнее фото из галереи (не скрин).','Скинь последний скриншот, который ты делал(а).','Скинь самое старое своё фото, которое сохранилось в телефоне.','Отправь мне последнюю песню, которая играла в наушниках.','Скинь фото того, что сейчас лежит рядом с тобой (кроме телефона).','Сфоткай то, что видишь сейчас за окном.','Скинь свою любимую гифку, которая описывает твоё настроение.','Отправь мне одно голосовое — без слов, просто дыши 10 секунд.','Скини фото своей старой игрушки из детства.','Сфоткай свою ладонь и скинь мне.','Что ты чувствуешь, когда я долго не отвечаю на сообщение — тревогу, раздражение или всё равно?','Ты когда-нибудь хотел(а), чтобы я приревновал(а) тебя? Если да — то когда и зачем?','Если бы я честно признался(лась), что мне не хватает одной вещи в наших отношениях, — что бы, по-твоему, я назвал(а)?','Ты помнишь самый первый момент, когда ты понял(а), что тебе не всё равно, как я на тебя смотрю? Опиши его.','Было ли такое, что ты хотел(а) от меня чего-то прямо сейчас, но не попросил(а), потому что боялся(ась) выглядеть глупо?','Если бы я спросил(а) тебя: «Чего ты боишься в нас больше всего?» — что бы ты ответила честно, без фильтра?','Ты чувствуешь, когда я устал(а) от тебя, даже если я не показываю? Или тебе кажется, что я всегда рад(а) тебя видеть?','Что я делаю, когда злюсь, что тебя одновременно пугает и заводит?','Ты когда-нибудь думала, что у нас может не получиться, просто потому что мы слишком похожи или слишком разные?','Если бы сейчас я попросил(а) тебя сказать одну фразу, которая определит наш вечер, — что бы это была за фраза?','Что я сказал(а) сегодня такого, что ты запомнил(а)?','Какое моё сообщение ты перечитал(а) больше 2 раз?','Когда ты смотришь на мои фото, что ты чувствуешь первым?','Что я делаю чаще: смешу тебя или бешу?','О чём ты думаешь, когда я долго не отвечаю?','Как зовут твоего лучшего друга (и сколько лет знакомы)?','Какой фильм я тебе советовал(а), а ты так и не посмотрел(а)?','Что тебе нравится во мне больше всего, когда я молчу?','Кто первый сказал «спокойной ночи» вчера?','Как часто ты проверяешь мои новые фото?','Напиши мне комплимент, которого ты никогда не говорил(а).','Опиши цвет моих глаз тремя словами.','Напиши одно слово, которое ассоциируется со мной.','Скинь мне песню, которая напоминает тебе обо мне.','Придумай мне прозвище, которое будешь использовать только ты.','Напиши мне первое, что пришло в голову за 3 секунды.','Напиши мне, чего ты сегодня ждал(а) от меня, но не сказал(а).','Отправь мне эмодзи, которые описывают твоё настроение сейчас.','Нарисуй что-нибудь пальцем на экране и скинь скрин.','Напиши мне 3 вещи, которые ты любишь во мне (без внешности).','Что ты чувствуешь, когда мы молчим в переписке и никто не пишет первым?','Было ли тебе когда-нибудь стыдно за меня при других?','Что я мог(ла) бы сделать, чтобы ты чувствовал(а) себя со мной спокойнее?','Ты боишься, что я могу измениться? Если да — то как?','Что для тебя хуже: когда я слишком холоден(на) или слишком навязчив(а)?','Что ты хотел(а) бы услышать от меня прямо сейчас?','Какую одну вещь я мог(ла) бы делать чаще, чтобы ты чувствовал(а) себя любимым(ой)?','Есть ли у тебя вопрос, который ты боишься мне задать?','Ты чувствуешь, что мы подходим друг другу по темпу жизни или кто-то быстрее/медленнее?','Что бы ты хотела изменить в наших отношениях прямо сейчас, если бы могла одним движением?'
];
let state = JSON.parse(localStorage.getItem(STORE) || '{"done":[],"memories":[]}');
let visitStarted = Date.now();
let timers = [];
const save = () => localStorage.setItem(STORE, JSON.stringify(state));
const clearTimers = () => { timers.forEach(clearInterval); timers = []; };
const fmtDate = d => new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(d));

function burst(count=36, origin={x:50,y:78}){
  const fragment = document.createDocumentFragment();
  const limited = Math.min(count, 90);
  for(let i=0;i<limited;i++){
    const e=document.createElement('span');
    const isHeart=Math.random()>.28;
    e.className=`burst ${isHeart?'heartConfetti':'sparkConfetti'}`;
    e.textContent=isHeart?'❤️':'✦';
    const angle=(-115+Math.random()*230)*Math.PI/180;
    const distance=90+Math.random()*260;
    const fall=110+Math.random()*220;
    e.style.cssText=`--x:${origin.x+(Math.random()-.5)*10}vw;--y:${origin.y+(Math.random()-.5)*8}vh;--tx:${Math.cos(angle)*distance}px;--ty:${Math.sin(angle)*distance+fall}px;--rot:${(Math.random()-.5)*720}deg;--d:${2.8+Math.random()*2.4}s;--s:${12+Math.random()*18}px;--o:${.45+Math.random()*.5}`;
    fragment.append(e);
    setTimeout(()=>e.remove(),6200);
  }
  document.body.append(fragment);
}
function sparkles(count=22, area=document.body){
  count = Math.min(count, matchMedia('(max-width: 760px)').matches ? 22 : 34);
  const fragment = document.createDocumentFragment();
  for(let i=0;i<count;i++){
    const e=document.createElement('span');
    e.className='twinkle';
    e.style.cssText=`--x:${Math.random()*100}vw;--y:${Math.random()*100}vh;--d:${1.7+Math.random()*2.2}s;--delay:${Math.random()*1.2}s;--s:${3+Math.random()*5}px`;
    fragment.append(e);
    setTimeout(()=>e.remove(),5200);
  }
  area.append(fragment);
}

function floatingHearts(count=34){
  const fragment = document.createDocumentFragment();
  const total = Math.min(count, matchMedia('(max-width: 760px)').matches ? 28 : 46);
  for(let i=0;i<total;i++){
    const e=document.createElement('span');
    e.className='floatingHeart';
    e.textContent='❤️';
    e.style.cssText=`--x:${Math.random()*100}vw;--drift:${(Math.random()-.5)*46}vw;--s:${12+Math.random()*22}px;--o:${.28+Math.random()*.52};--r:${(Math.random()-.5)*70}deg;--d:${5.8+Math.random()*5.6}s;--delay:${Math.random()*1.6}s`;
    fragment.append(e);
    setTimeout(()=>e.remove(),13000);
  }
  document.body.append(fragment);
}
function screen(html){ clearTimers(); app.innerHTML = `<section class="screen">${html}</section>`; }
function intro(){ screen(`<div class="center"><div class="glass hero"><div class="kicker">маленький секрет</div><h1 class="title">Считаешь ли ты себя красивой? ❤️</h1><p class="subtitle">Ответь честно, моя самая нежная звёздочка.</p><div class="actions"><button class="btn" id="yes">❤️ Да</button><button class="btn secondary" id="no">🙈 Нет</button></div></div></div>`); document.querySelector('#yes').onclick=yesIntro; const no=document.querySelector('#no'); const move=()=>{ const r=no.getBoundingClientRect(), m=20; no.classList.add('runaway'); no.style.left=m+Math.random()*(innerWidth-r.width-m*2)+'px'; no.style.top=m+Math.random()*(innerHeight-r.height-m*2)+'px'; }; ['pointerenter','pointerdown','touchstart','click'].forEach(ev=>no.addEventListener(ev,e=>{e.preventDefault();move();})); }
function yesIntro(){ document.body.insertAdjacentHTML('beforeend','<div class="dark"></div>'); floatingHearts(42); sparkles(28); screen(`<div class="center"><div class="glass hero"><div class="type" id="type"></div><button class="btn" id="start" hidden>Начать наше приключение ❤️</button></div></div>`); const text='Я тоже так считаю.\n\nДля меня ты самая красивая, любимое солнышко.\n\nСпасибо, что ты есть у меня. ❤️'; let i=0; const t=setInterval(()=>{ type.textContent=text.slice(0,++i); if(i>=text.length){ clearInterval(t); setTimeout(()=>start.hidden=false,650); }},55); timers.push(t); start.onclick=menu; setTimeout(()=>document.querySelector('.dark')?.remove(),1400); }
function menu(){ const done=state.done.length; const greet=greetings[Math.floor(Math.random()*greetings.length)]; screen(`<div class="menuHead"><div><div class="kicker">${greet}</div><h1>Наш маленький мир</h1></div><button class="btn secondary" onclick="intro()">В начало</button></div><div class="grid"><article class="glass card" onclick="game()"><h2>❤️ Сердце любви</h2><p class="small">Главная магия для нас двоих.</p><div class="metric">${done} / 50 ❤️</div><p>Выполнено</p></article><article class="glass card" onclick="memories()"><h2>📷 Наши воспоминания</h2><p class="small">Здесь появляются выполненные испытания и важные моменты.</p><div class="metric">${state.memories.length}</div></article><article class="glass card"><h2>⏳ Мы вместе</h2><div class="timer" id="loveTimer"></div></article><article class="glass card"><h2>⏱ Время на сайте</h2><p>Ты уже здесь</p><div class="metric" id="siteTimer">0 минут 0 секунд</div></article><article class="glass card" onclick="achievements()"><h2>🏆 Наши достижения</h2><p class="small">Нежные награды открываются по мере приключения.</p><div class="metric">${unlocked().length} / 7</div></article></div>`); tickTimers(); const id=setInterval(tickTimers,1000); timers.push(id); }
function relationshipParts(start, end=new Date()){
  let y=end.getFullYear()-start.getFullYear(), mo=end.getMonth()-start.getMonth(), d=end.getDate()-start.getDate(), h=end.getHours()-start.getHours(), mi=end.getMinutes()-start.getMinutes(), s=end.getSeconds()-start.getSeconds();
  if(s<0){s+=60;mi--} if(mi<0){mi+=60;h--} if(h<0){h+=24;d--}
  if(d<0){ const prev=new Date(end.getFullYear(),end.getMonth(),0).getDate(); d+=prev; mo--; }
  if(mo<0){mo+=12;y--} return {y,mo,d,h,mi,s};
}
function sessionParts(){ let s=Math.floor((Date.now()-visitStarted)/1000); const mi=Math.floor(s/60); s-=mi*60; return {mi,s}; }
function tickTimers(){ const loveEl=document.querySelector('#loveTimer'); const siteEl=document.querySelector('#siteTimer'); const l=relationshipParts(new Date(START_DATE)); if(loveEl) loveEl.innerHTML=[['Лет',l.y],['Месяцев',l.mo],['Дней',l.d],['Часов',l.h],['Минут',l.mi],['Секунд',l.s]].map(x=>`<div class="pill"><b>${x[1]}</b>${x[0]}</div>`).join(''); const v=sessionParts(); if(siteEl) siteEl.textContent=`${v.mi} минут ${v.s} секунд`; }
function game(){ screen(`<button class="btn secondary back" onclick="menu()">← Назад</button><div class="heartWrap"><div class="heartStage"><button class="magicHeart" id="heart" aria-label="Открыть испытание"><span class="heartAura"></span><svg viewBox="0 0 512 512" aria-hidden="true"><defs><linearGradient id="heartGradient" x1="20%" y1="8%" x2="86%" y2="92%"><stop offset="0%" stop-color="#fff6fb"/><stop offset="22%" stop-color="#ff98c8"/><stop offset="58%" stop-color="#ff3f93"/><stop offset="100%" stop-color="#d81a72"/></linearGradient><radialGradient id="heartShine" cx="31%" cy="24%" r="38%"><stop offset="0%" stop-color="rgba(255,255,255,.95)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient></defs><path class="heartShape" d="M256 462C126 347 48 278 48 172 48 91 112 40 181 40c39 0 76 18 99 49 23-31 60-49 99-49 69 0 133 51 133 132 0 106-78 175-208 290l-48 42-48-42Z"/><path class="heartHighlight" d="M160 88c-46 10-76 45-76 91 0 23 7 43 20 63 18-86 76-122 145-113-20-30-53-49-89-41Z"/></svg><span class="heartReflection"></span></button><div class="orbit" aria-hidden="true"><i></i><i></i><i></i></div><h1>Нажми на сердце любви</h1><p class="small">Оно выберет случайное испытание, которое ещё не было выполнено.</p></div></div>`); document.querySelector('#heart').onclick=pick; }
function pick(){ const left=challenges.map((_,i)=>i).filter(i=>!state.done.includes(i)); if(!left.length) return completeAll(); const heartEl=document.querySelector('#heart'); heartEl.classList.add('activated'); burst(54,{x:50,y:45}); sparkles(28); setTimeout(()=>showChallenge(left[Math.floor(Math.random()*left.length)]),1250); }
function showChallenge(i){ screen(`<button class="btn secondary back" onclick="menu()">← Назад</button><div class="center"><div class="glass challenge"><div class="kicker">испытание ${i+1}</div><p>${challenges[i]}</p><div class="actions"><button class="btn" id="done">Выполнено ❤️</button><button class="btn secondary" onclick="game()">Выбрать позже</button></div></div></div>`); done.onclick=()=>complete(i); }
function complete(i){
  if(!state.done.includes(i)){
    state.done.push(i);
    state.memories.unshift({text:challenges[i],date:new Date().toISOString(),number:i+1});
    save();
  }
  document.body.insertAdjacentHTML('beforeend','<div class="dark"></div>');
  burst(64);
  sparkles(24);
  screen(`<button class="btn secondary back" onclick="menu()">← Назад</button><div class="center"><div class="glass hero completionCard"><h1>✨ Поздравляю!</h1><p class="subtitle">❤️ Еще одно воспоминание создано.</p><div class="kicker">Пройдено:</div><div class="metric">${state.done.length} / 50</div><button class="btn nextChallenge" onclick="game()">Открыть следующее испытание ❤️</button></div></div>`);
  setTimeout(()=>document.querySelector('.dark')?.remove(),900);
}
function memories(){ screen(`<button class="btn secondary back" onclick="menu()">← Назад</button><div class="glass hero" style="width:min(760px,100%)"><h1>📷 Наши воспоминания</h1><div class="list">${state.memories.length?state.memories.map(m=>`<div class="memory"><b>❤️ Испытание ${m.number}</b><p>${m.text}</p><span class="small">${fmtDate(m.date)}</span></div>`).join(''):'<p class="small">Пока здесь тихо, но скоро появятся наши первые моменты.</p>'}</div></div>`); }
function unlocked(){ const d=state.done.length; return [['❤️ Первый шаг',d>=0],['❤️ Первое испытание',d>=1],['❤️ Уже 10 испытаний',d>=10],['❤️ Половина пути',d>=25],['❤️ Осталось совсем немного',d>=45],['❤️ Все испытания завершены',d>=50],['❤️ Самая красивая девушка',true]].filter(a=>a[1]).map(a=>a[0]); }
function achievements(){ const d=state.done.length; const all=[['❤️ Первый шаг',d>=0],['❤️ Первое испытание',d>=1],['❤️ Уже 10 испытаний',d>=10],['❤️ Половина пути',d>=25],['❤️ Осталось совсем немного',d>=45],['❤️ Все испытания завершены',d>=50],['❤️ Самая красивая девушка',true]]; screen(`<button class="btn secondary back" onclick="menu()">← Назад</button><div class="glass hero" style="width:min(720px,100%)"><h1>🏆 Наши достижения</h1><div class="list">${all.map(a=>`<div class="ach ${a[1]?'':'locked'}">${a[1]?'✨':'🔒'} ${a[0]}</div>`).join('')}</div></div>`); }
function completeAll(){ screen(`<div class="center"><div class="glass hero"><h1>❤️ Всё пройдено</h1><p class="subtitle">Все 50 воспоминаний уже созданы. Это только начало нашей истории.</p><button class="btn" onclick="menu()">Вернуться в наш мир</button></div></div>`); }
window.intro=intro; window.menu=menu; window.game=game; window.memories=memories; window.achievements=achievements; intro();
