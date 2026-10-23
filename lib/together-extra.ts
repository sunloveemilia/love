export type ExtraKind='court'|'heist'|'bluff'|'remote';
export type ExtraAction={type:string;now?:number;value?:unknown};
export type ExtraResult={round:number;title:string;detail:string;points?:number[]};
export type ExtraState={version:1;kind:ExtraKind;names:string[];seed:number;round:number;phase:string;turn:number;endsAt:number|null;remaining:number;paused:boolean;choices:(string|number)[];results:ExtraResult[];scores:number[];wrong:number;hinted:boolean;events:ExtraAction[]};
export const extraGames=[
 {id:'court' as const,name:'Суд над нами',tag:'3 дела · 8–12 минут',desc:'Обвинения, нелепые улики и ваша блестящая защита. Кто украл одеяло?',symbol:'⚖',color:'#e5bc80'},
 {id:'heist' as const,name:'Ограбление века',tag:'4 замка · до 20 минут',desc:'Один видит инструкцию, другой — сейф. Объясняй, сопоставляй, спасай операцию.',symbol:'◇',color:'#91d4ca'},
 {id:'bluff' as const,name:'Я тебя переиграю',tag:'6 раундов · блеф',desc:'Забрать очки, подарить их другому или угадать чужой ход. Договориться можно. Верить — опасно.',symbol:'♠',color:'#c5b2ed'},
 {id:'remote' as const,name:'Пульт друг от друга',tag:'4 сцены · по 2 минуты',desc:'Тайно выбери другому персонажа. Потом попробуйте вместе решить обычную проблему.',symbol:'⌘',color:'#efb0c4'}
];
const charges=['Присваивает себе большую часть одеяла.','Говорит «пять минут», а потом исчезает на полчаса.','Крадёт самую вкусную еду с чужой тарелки.','Отвечает «мне всё равно», а потом отвергает все варианты.','Начинает смеяться в самый неподходящий момент.','Уверяет, что не спит, хотя уже храпит.','Слишком убедительно делает невинное лицо.','Оставляет последний глоток вместо того, чтобы вымыть кружку.','Незаметно превращает короткую прогулку в приключение.','Сохраняет смешные фотографии и ждёт своего часа.','Обещает выбрать фильм и устраивает кастинг на три часа.','Разговаривает с котами ласковее, чем с людьми.'];
const evidence=['Свидетель — холодильник. Озвучьте его показания.','В деле появилась переписка с подушкой. Зачитайте три сообщения.','Эксперт — очень серьёзный голубь. У него есть сомнения.','Камера сняла только ноги. Объясните их подозрительное поведение.','Главная улика — одна крошка. Обвинение считает её неопровержимой.','В суд доставлен говорящий плед. Он просит политического убежища.','Секретный свидетель перепутал все имена. Используйте это.','На месте преступления найден чек на один кабачок.'];
export const courtVerdicts=['Оправдать за неотразимое обаяние.','Назначить три искренних комплимента.','Поручить выбрать и принести перекус.','Приговорить к торжественному признанию: «Да, я легенда».'];
const personalities=['Ты подозреваешь, что собеседник — шпион.','Ты скрываешь, что только что выиграл миллион.','Ты знакомишься с этим человеком впервые.','Ты монарх, которому всё должны подавать торжественно.','Ты детектив и в каждой фразе находишь улику.','Ты продаёшь абсолютно всё, о чём говоришь.','Ты инопланетянин и притворяешься, что понимаешь людей.','Ты ведущий очень драматичного реалити-шоу.','Ты супергерой с совершенно бесполезной способностью.','Ты уверен, что снимаешься в рекламе.','Ты романтический поэт, но рифмы не получаются.','Ты пытаешься устроиться на работу личным котом.'];
const scenes=['Решите, что заказать на ужин.','Договоритесь, кто пойдёт открывать дверь курьеру.','Выберите название для вашего будущего кафе.','Объясните соседям, зачем вам дома огромный батут.','Спланируйте отпуск с бюджетом в три картофелины.','Решите, что делать с драконом, который поселился на балконе.','Выберите подарок человеку, у которого есть вообще всё.','Придумайте оправдание опозданию на собственную премьеру.'];
const twists=['Теперь один из вас слышит только вопросы.','Оказывается, всё это время вы были в прямом эфире.','Теперь нельзя произносить слова «да», «нет» и «я».','Любое предложение нужно сопровождать невероятным комплиментом.','В комнату вошёл невидимый проверяющий. Сделайте вид, что всё нормально.','Вы обнаружили, что ваш собеседник — будущая версия вас.','Осталась минута до конца света, но проблему всё равно надо решить.','Теперь вы должны закончить каждую реплику словами «таков мой план».'];
export const bluffOptions=[{id:'keep',title:'Забрать себе',desc:'Тебе +2 очка.'},{id:'gift',title:'Подарить другому',desc:'Другому +3 очка.'},{id:'betKeep',title:'Ставлю на «забрать»',desc:'Тебе +5, если другой заберёт себе. Иначе 0.'},{id:'betGift',title:'Ставлю на «подарить»',desc:'Тебе +5, если другой подарит. Иначе 0.'}];
function random(seed:number){let x=seed>>>0;return(n:number)=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x%n;};}
function shuffled<T>(items:T[],r:(n:number)=>number){const a=[...items];for(let i=a.length-1;i>0;i--){const j=r(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
export function extraCard(s:ExtraState){const r=random(s.seed+s.round*7919),prosecutor=s.round%2;
 const charge=shuffled(charges,random(s.seed))[s.round%charges.length],clue=evidence[r(evidence.length)];
 const options=[shuffled(personalities,r).slice(0,3),shuffled(personalities,r).slice(0,3)];
 const assigned=[options[1][Number(s.choices[1])||0],options[0][Number(s.choices[0])||0]];
 const symbols=shuffled(['★','●','◆','▲','☾','✚'],r).slice(0,4),digits=shuffled(['1','2','3','4','5','6','7','8','9'],r).slice(0,4),order=shuffled([0,1,2,3],r);
 let panel:string[],instruction:string,answer:string,hint:string,title:string;
 if(s.round===0){title='Символьный замок';panel=symbols;const legend=shuffled([0,1,2,3],random(s.seed+4153));if(legend.every((v,i)=>v===i))[legend[0],legend[1]]=[legend[1],legend[0]];instruction=legend.map(i=>symbols[i]+' = '+digits[i]).join(' · ')+'. Читайте позиции в порядке: '+order.map(i=>i+1).join(' → ')+'.';answer=order.map(i=>digits[i]).join('');hint='Объясняющий называет порядок позиций и значения символов. Не читайте слева направо автоматически.';}
 else if(s.round===1){title='Цветная проводка';const colors=['Синий','Золотой','Розовый','Белый'];panel=colors.map((v,i)=>v+' провод: '+digits[i]);instruction='Порядок проводов: '+order.map(i=>colors[i]).join(' → ')+'. Соберите цифры с проводов в этом порядке.';answer=order.map(i=>digits[i]).join('');hint='На панели у каждого цвета своя цифра. Инструкция задаёт порядок цветов, а не расположение проводов.';}
 else if(s.round===2){title='Радиочастота';const readings=Array.from({length:4},()=>1000+r(7000)),channel=r(4),offset=11+r(70);panel=readings.map((v,i)=>'Канал '+(i+1)+': '+v);instruction='Нужен канал '+(channel+1)+'. Прибавьте к его частоте '+offset+'. Введите четыре цифры результата.';answer=String(readings[channel]+offset);hint='Найдите нужный канал и сложите его число с поправкой из инструкции.';}
 else{title='Сердце сейфа';const values=Array.from({length:4},()=>10+r(30));panel=symbols.map((v,i)=>v+' = '+values[i]);instruction='Первые две цифры — сумма '+symbols[0]+' и '+symbols[1]+'. Последние две — разность большего и меньшего из '+symbols[2]+' и '+symbols[3]+'. Однозначный результат дополните нулём слева.';answer=String(values[0]+values[1]).padStart(2,'0')+String(Math.abs(values[2]-values[3])).padStart(2,'0');hint='Нужны два отдельных двузначных результата. Соедините их, не складывая между собой.';}
 return{prosecutor,defendant:1-prosecutor,charge,clue,options,assigned,scene:shuffled(scenes,random(s.seed))[s.round],twist:twists[r(twists.length)],panel,instruction,answer,hint,title,guide:s.round%2,solver:1-s.round%2};
}
export function createExtra(kind:ExtraKind,names:string[],seed=Math.floor(Math.random()*1000000000)):ExtraState{
 if(!extraGames.some(g=>g.id===kind)||!Array.isArray(names)||names.length!==2||names.some(n=>typeof n!=='string'||!n.trim()||n.trim().length>24)||!Number.isInteger(seed)||seed<0||seed>1000000000)throw Error('Укажите два имени, не длиннее 24 символов.');
 return{version:1,kind,names:names.map(n=>n.trim()),seed,round:0,phase:kind==='bluff'||kind==='remote'?'handoff':'intro',turn:0,endsAt:null,remaining:0,paused:false,choices:[],results:[],scores:[0,0],wrong:0,hinted:false,events:[]};
}
export function extraRemaining(s:ExtraState,now=Date.now()){return s.endsAt===null?s.remaining:Math.max(0,Math.ceil((s.endsAt-now)/1000));}
function requireThat(ok:unknown,message='Этот ход сейчас недоступен.'){if(!ok)throw Error(message);}
function clock(s:ExtraState,seconds:number,now:number){s.remaining=seconds;s.endsAt=now+seconds*1000;s.paused=false;}
function stop(s:ExtraState){s.endsAt=null;s.remaining=0;s.paused=false;}
function expire(s:ExtraState,now:number){if(s.endsAt===null||extraRemaining(s,now)>0)return false;if(s.kind==='heist'){s.phase='failed';stop(s);}else if(s.kind==='court'){s.phase=s.phase==='accuse'?'defendReady':'verdict';stop(s);}else if(s.kind==='remote'){s.phase='verdict';stop(s);}return true;}
export function extraAction(state:ExtraState,a:ExtraAction):ExtraState{
 requireThat(a&&typeof a==='object'&&typeof a.type==='string');const needsNow=['start','pause','resume','tick','advance','answer','hint','next'].includes(a.type);const now=a.now??0;
 if(needsNow)requireThat(typeof now==='number'&&Number.isFinite(now)&&now>=0&&now<=1e15,'Некорректное время.');
 if(a.type==='tick'&&(state.endsAt===null||extraRemaining(state,now)>0))return state;
 requireThat(state.phase!=='finished'&&state.phase!=='failed','Игра уже завершена.');
 const s=structuredClone(state);requireThat(s.events.length<300,'Слишком много действий. Начните новую игру.');
 if(expire(s,now)){s.events.push({...a});return s;}
 if(a.type==='tick')return state;
 if(a.type==='pause'){requireThat(s.endsAt!==null);s.remaining=extraRemaining(s,now);s.endsAt=null;s.paused=true;}
 else if(a.type==='resume'){requireThat(s.paused&&s.remaining>0);clock(s,s.remaining,now);}
 else{requireThat(!s.paused,'Сначала продолжите игру.');const c=extraCard(s);
 if(a.type==='start'){
  if(s.kind==='court'){requireThat(['intro','defendReady'].includes(s.phase));s.phase=s.phase==='intro'?'accuse':'defend';clock(s,45,now);}
  else if(s.kind==='heist'){requireThat(s.phase==='intro');s.phase='handoff';clock(s,1200,now);}
  else if(s.kind==='remote'){requireThat(s.phase==='ready');s.phase='playing';clock(s,120,now);}else requireThat(false);
 }else if(a.type==='advance'){
  if(s.kind==='court'){requireThat(['accuse','defend'].includes(s.phase));s.phase=s.phase==='accuse'?'defendReady':'verdict';stop(s);}
  else if(s.kind==='remote'){requireThat(s.phase==='playing');s.phase='verdict';stop(s);}else requireThat(false);
 }else if(a.type==='reveal'){requireThat(s.phase==='handoff');s.phase=s.kind==='heist'?'secret':'choice';}
 else if(a.type==='hide'){requireThat(s.kind==='heist'&&s.phase==='secret');s.phase='solve';}
 else if(a.type==='guide'){requireThat(s.kind==='heist'&&s.phase==='solve');s.phase='handoff';}
 else if(a.type==='hint'){requireThat(s.kind==='heist'&&s.phase==='solve'&&!s.hinted);s.hinted=true;s.endsAt!-=60000;expire(s,now);}
 else if(a.type==='answer'){
  requireThat(s.kind==='heist'&&s.phase==='solve');requireThat(typeof a.value==='string'&&/^\d{4}$/.test(a.value),'Введите ровно четыре цифры.');
  if(a.value===c.answer){s.results.push({round:s.round,title:c.title,detail:'Замок открыт: '+c.answer});s.phase='result';if(s.round===3)stop(s);}
  else{s.wrong++;s.endsAt!-=30000;expire(s,now);}
 }else if(a.type==='choose'){
  requireThat(s.phase==='choice'&&['bluff','remote'].includes(s.kind));
  if(s.kind==='bluff')requireThat(bluffOptions.some(o=>o.id===a.value));else requireThat(Number.isInteger(a.value)&&Number(a.value)>=0&&Number(a.value)<3);
  s.choices[s.turn]=a.value as string|number;
  if(s.turn===0){s.turn=1;s.phase='handoff';}else if(s.kind==='remote')s.phase='ready';else{
   const points=[0,0];for(let i=0;i<2;i++){const mine=s.choices[i],other=s.choices[1-i];if(mine==='keep')points[i]+=2;else if(mine==='gift')points[1-i]+=3;else if(mine==='betKeep'&&other==='keep'||mine==='betGift'&&other==='gift')points[i]+=5;}
   s.scores=s.scores.map((v,i)=>v+points[i]);s.results.push({round:s.round,title:'Раунд '+(s.round+1),detail:s.names.map((n,i)=>n+': '+bluffOptions.find(o=>o.id===s.choices[i])!.title).join(' · '),points});s.phase='result';
  }
 }else if(a.type==='verdict'){
  requireThat(s.phase==='verdict');requireThat(Number.isInteger(a.value)&&Number(a.value)>=0&&Number(a.value)<(s.kind==='court'?courtVerdicts.length:2));
  requireThat(['court','remote'].includes(s.kind));s.results.push({round:s.round,title:s.kind==='court'?c.charge:c.scene,detail:s.kind==='court'?courtVerdicts[Number(a.value)]:Number(a.value)===0?'Оскар за совместную импровизацию.':'Это был прекрасный хаос.'});s.phase='result';
 }else if(a.type==='next'){
  requireThat(s.phase==='result');const total=s.kind==='court'?3:s.kind==='bluff'?6:4;
  if(s.round+1===total){s.phase='finished';stop(s);}else{s.round++;s.turn=0;s.choices=[];s.hinted=false;s.phase=s.kind==='court'?'intro':'handoff';}
 }else requireThat(false);
 }
 s.events.push({...a});return s;
}
export function serializeExtra(s:ExtraState){return JSON.stringify({version:1,kind:s.kind,names:s.names,seed:s.seed,events:s.events});}
export function restoreExtra(raw:string):ExtraState|null{try{if(typeof raw!=='string'||raw.length>100000)return null;const v=JSON.parse(raw);if(v.version!==1||!Array.isArray(v.events)||v.events.length>300)return null;let s=createExtra(v.kind,v.names,v.seed);for(const a of v.events){if(!a||Object.keys(a).some(k=>!['type','now','value'].includes(k)))return null;s=extraAction(s,a);}return s;}catch{return null;}}
