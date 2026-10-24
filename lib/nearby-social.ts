import {who,wheelTasks} from './content.ts';
import {tabooCards} from './adventure-content.ts';
import {scales,sprintQuestions,banQuestions,talkQuestions} from './nearby-social-content.ts';
export type SocialKind='scale'|'sprint'|'ban'|'talk'|'who'|'truths'|'taboo'|'wheel';
export const socialGames=[
 {id:'scale',name:'Попади в мою шкалу',desc:'Я прячу число, ты слышишь только пример. Насколько одинаково мы чувствуем мир?',tag:'НОВОЕ · ИНТУИЦИЯ',symbol:'↔',color:'#99d5cf'},
 {id:'sprint',name:'Скажи за 7 секунд',desc:'Три ужасных имени для кота? Семь секунд пошли. Время думать закончилось!',tag:'НОВОЕ · БЫСТРО И СМЕШНО',symbol:'7',color:'#e8c081'},
 {id:'ban',name:'Без «да» и «нет»',desc:'Один задаёт хитрые вопросы, другой выкручивается. Продержись целую минуту.',tag:'НОВОЕ · ЖИВОЙ РАЗГОВОР',symbol:'?!',color:'#edabc0'},
 {id:'talk',name:'Мы без сценария',desc:'Вопросы, которые не задашь между делом. Можно посмеяться, удивиться или стать чуть ближе.',tag:'НОВОЕ · ВОПРОСЫ ДЛЯ ДВОИХ',symbol:'«»',color:'#c6b3e7'},
 {id:'who',name:'Кто из нас?',desc:'На счёт три укажите друг на друга. Потом расскажите, почему именно так.',tag:'ТЕПЕРЬ ЗДЕСЬ · 160 СИТУАЦИЙ',symbol:'☞',color:'#f9a8d4'},
 {id:'truths',name:'Две правды и ложь',desc:'Расскажи три факта вслух и спрячь номер выдумки. Меня уже не проведёшь… или проведёшь?',tag:'ТЕПЕРЬ ЗДЕСЬ · УГАДЫВАЕМ',symbol:'2+1',color:'#d6aeeb'},
 {id:'taboo',name:'Запретное слово',desc:'Объясни слово за минуту, не используя три самых очевидных подсказки.',tag:'ТЕПЕРЬ ЗДЕСЬ · ОБЪЯСНЯЕМ ВСЛУХ',symbol:'…',color:'#f0b4a9'},
 {id:'wheel',name:'Колесо безумия',desc:'Нелепые комплименты, импровизация и маленькие задания. Выполняйте вместе.',tag:'ТЕПЕРЬ ЗДЕСЬ · НЕМНОГО ХАОСА',symbol:'✧',color:'#e1cb85'}
] as const;
export type SocialAction={type:string;value?:number|string;now?:number};
export type SocialResult={round:number;title:string;detail:string;points:number[];skipped:boolean};
export type SocialState={version:1;kind:SocialKind;names:string[];seed:number;round:number;total:number;actor:number;phase:'ready'|'secret'|'handoff'|'playing'|'judge'|'result'|'finished';scores:number[];results:SocialResult[];lie:number|null;endsAt:number|null;remaining:number;question:number;events:SocialAction[]};
function rng(seed:number){let n=seed>>>0;return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
function index(seed:number,length:number,round:number){const list=Array.from({length},(_,i)=>i),r=rng(seed);for(let i=length-1;i>0;i--){const j=Math.floor(r()*(i+1));[list[i],list[j]]=[list[j],list[i]];}return list[round%length];}
export function createSocial(kind:SocialKind,names:string[],seed=Date.now()>>>0):SocialState{if(!socialGames.some(g=>g.id===kind)||!Array.isArray(names)||names.length!==2||names.some(n=>typeof n!=='string'||!n.trim()||n.trim().length>24)||!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('Укажите два имени, не длиннее 24 символов.');return{version:1,kind,names:names.map(n=>n.trim()),seed,round:0,total:kind==='sprint'?8:kind==='ban'||kind==='truths'?4:6,actor:0,phase:'ready',scores:[0,0],results:[],lie:null,endsAt:null,remaining:0,question:0,events:[]};}
export function socialCard(s:SocialState):Record<string,any>{const pick=(n:number)=>index(s.seed,n,s.round);switch(s.kind){case'scale':return{...scales[pick(scales.length)],target:1+Math.floor(rng(s.seed+s.round*7919+733)()*10),q:'Придумай пример для тайной отметки.'};case'sprint':return{q:sprintQuestions[pick(sprintQuestions.length)]};case'ban':return{q:banQuestions[index(s.seed+s.round*7919,banQuestions.length,s.question)],deep:'Задавайте и свои вопросы. Нельзя отвечать словами «да» и «нет», даже внутри длинного ответа.'};case'talk':return talkQuestions[pick(talkQuestions.length)];case'who':return{q:who[pick(who.length)],deep:'Почему выбрали именно так? Вспомните реальный пример.'};case'truths':return{q:'Два факта правдивы. Один ты выдумал.',deep:'Можно рассказать про детство, смешной случай или маленькую странность.'};case'taboo':return{...tabooCards[pick(tabooCards.length)],q:'Объясни слово вслух.'};case'wheel':{const c=wheelTasks[pick(wheelTasks.length)];return{category:c[0],q:c[1]};}}}
export function socialPrivateOwner(s:SocialState){return s.phase==='secret'||s.kind==='taboo'&&['playing','judge'].includes(s.phase)?s.actor:null;}
export function socialView(s:SocialState){const c={...socialCard(s)};if(s.kind==='scale'&&!['secret','result','finished'].includes(s.phase))delete c.target;if(s.kind==='truths'&&['result','finished'].includes(s.phase))c.lie=s.lie;if(s.kind==='taboo'&&!['secret','playing','judge','result','finished'].includes(s.phase)){delete c.word;delete c.forbidden;delete c.stems;}delete c.stems;return c;}
function finish(s:SocialState,title:string,detail:string,points=[0,0],skipped=false){s.results.push({round:s.round,title,detail,points,skipped});s.scores=s.scores.map((v,i)=>v+points[i]);s.phase='result';s.endsAt=null;s.remaining=0;}
function expire(s:SocialState,now:number){if(s.phase!=='playing'||s.endsAt===null||now<s.endsAt)return false;s.endsAt=null;s.remaining=0;if(s.kind==='ban'){const p=[0,0];p[s.actor]=1;finish(s,'Минута выдержана',s.names[s.actor]+' не попался на «да» и «нет».',p);}else s.phase='judge';return true;}
const timed=(s:SocialState)=>['sprint','ban','taboo'].includes(s.kind);
export function socialAction(state:SocialState,input:SocialAction):SocialState{
 if(state.phase==='finished')throw Error('Эта партия уже завершена.');if(state.events.length>=1200)throw Error('Слишком длинная партия. Начните новую.');
 const a:SocialAction={type:input.type,...(input.value!==undefined?{value:input.value}:{}),...(input.now!==undefined?{now:input.now}:{})};
 if(!['tick','pause','resume','reveal','hide','setLie','start','guess','judge','caught','question','done','skip','next'].includes(a.type)||a.value!==undefined&&!(typeof a.value==='string'&&a.value.length<=30||typeof a.value==='number'&&Number.isFinite(a.value))||a.now!==undefined&&(!Number.isFinite(a.now)||a.now<0||a.now>1e15))throw Error('Некорректное действие.');
 const s=structuredClone(state),card=socialCard(s),now=a.now;
 const requirePhase=(...phases:SocialState['phase'][])=>{if(!phases.includes(s.phase))throw Error('Сначала завершите текущий шаг.');};
 const requireTime=()=>{if(now===undefined)throw Error('Не задано время.');return now;};
 const record=()=>{s.events.push(a);return s;};
 if(s.phase==='playing'&&s.endsAt!==null&&now!==undefined&&expire(s,now)){if(s.kind==='ban'||!['judge','skip'].includes(a.type))return record();}
 switch(a.type){
 case'tick':requireTime();return state;
 case'pause':requirePhase('playing');if(!timed(s)||s.endsAt===null)return state;s.remaining=Math.max(0,s.endsAt-requireTime());s.endsAt=null;break;
 case'resume':requirePhase('playing');if(!timed(s)||s.endsAt!==null)return state;s.endsAt=requireTime()+s.remaining;break;
 case'reveal':if(s.phase==='ready'&&['scale','truths','taboo'].includes(s.kind))s.phase='secret';else if(s.phase==='handoff'&&['scale','truths'].includes(s.kind))s.phase='playing';else throw Error('Сейчас нечего открывать.');break;
 case'hide':requirePhase('secret');if(s.kind!=='scale')throw Error('Сначала выбери ответ.');s.phase='handoff';break;
 case'setLie':requirePhase('secret');if(s.kind!=='truths'||!Number.isInteger(a.value)||Number(a.value)<1||Number(a.value)>3)throw Error('Выбери номер выдумки от 1 до 3.');s.lie=Number(a.value);s.phase='handoff';break;
 case'start':requirePhase(s.kind==='taboo'?'secret':'ready');if(['scale','truths'].includes(s.kind))throw Error('Сначала спрячьте секрет.');s.phase='playing';if(timed(s)){s.remaining=s.kind==='sprint'?7000:60000;s.endsAt=requireTime()+s.remaining;}break;
 case'guess':requirePhase('playing');if(s.kind==='scale'){if(!Number.isInteger(a.value)||Number(a.value)<1||Number(a.value)>10)throw Error('Выбери отметку от 1 до 10.');const d=Math.abs(card.target-Number(a.value)),p=[0,0];p[1-s.actor]=d===0?4:d===1?3:d===2?1:0;finish(s,d===0?'Точное попадание!':'Открываем шкалу',`Задумано ${card.target} / 10 · догадка ${a.value} / 10. Обсудите, почему почувствовали именно так.`,p);}else if(s.kind==='truths'){if(!Number.isInteger(a.value)||Number(a.value)<1||Number(a.value)>3)throw Error('Выбери факт от 1 до 3.');const hit=a.value===s.lie,p=[0,0];if(hit)p[1-s.actor]=1;finish(s,hit?'Выдумка раскрыта!':'Убедительная история!',`Ложь — факт № ${s.lie}. Догадка — № ${a.value}. Как всё было на самом деле?`,p);}else throw Error('В этой игре нет такого хода.');break;
 case'judge':if(!['sprint','taboo'].includes(s.kind))throw Error('Этот результат здесь не подходит.');requirePhase('playing','judge');if(s.phase==='playing'&&s.endsAt===null)throw Error('Сначала продолжите таймер.');if(!['success','miss'].includes(String(a.value)))throw Error('Выберите результат.');{const hit=a.value==='success',p=[0,0];if(hit)p[s.actor]=1;finish(s,hit?(s.kind==='taboo'?'Слово угадано!':'Три ответа есть!'):'Хорошая попытка',s.kind==='taboo'?`Слово: ${card.word}. Результат отмечаете вы сами.`:card.q,p);}break;
 case'caught':requirePhase('playing');if(s.kind!=='ban'||s.endsAt===null)throw Error('Сначала начните интервью.');requireTime();{const p=[0,0];p[1-s.actor]=1;finish(s,'Попался на слове!',s.names[1-s.actor]+' заметил запрещённое «да» или «нет».',p);}break;
 case'question':requirePhase('playing');if(s.kind!=='ban'||s.endsAt===null||s.question>=19)throw Error('Можно задать свой вопрос вслух.');requireTime();s.question++;break;
 case'done':requirePhase('playing');if(!['talk','who','wheel'].includes(s.kind))throw Error('Сначала отметьте результат.');finish(s,s.kind==='talk'?'Ещё один ваш разговор':s.kind==='who'?'Ответы открыты':'Задание сыграно',s.kind==='who'?['Выбрали '+s.names[0],'Выбрали '+s.names[1],'Указали на обоих','Мнения разошлись'][Number(a.value)]||'Обсудили ответы':card.q);break;
 case'skip':requirePhase('ready','secret','handoff','playing','judge');finish(s,'Пропустили без штрафа','Этот вопрос можно оставить на другой вечер.',[0,0],true);break;
 case'next':requirePhase('result');if(s.round+1===s.total){s.phase='finished';break;}s.round++;s.actor=s.round%2;s.phase='ready';s.lie=null;s.question=0;s.remaining=0;s.endsAt=null;break;
 default:throw Error('Неизвестное действие.');
 }
 return record();
}
export function serializeSocial(s:SocialState){return JSON.stringify({version:1,kind:s.kind,names:s.names,seed:s.seed,events:s.events});}
export function restoreSocial(raw:string):SocialState|null{try{if(raw.length>300000)return null;const v=JSON.parse(raw);if(!v||v.version!==1||!Number.isInteger(v.seed)||v.seed<0||v.seed>4294967295||!Array.isArray(v.events)||v.events.length>1200)return null;let s=createSocial(v.kind,v.names,v.seed);for(const a of v.events){if(!a||typeof a!=='object'||Object.keys(a).some(k=>!['type','value','now'].includes(k)))return null;s=socialAction(s,a);}return s;}catch{return null;}}
