import {telepathy,who,swapPrompts,wheelTasks,stories,modes} from './content.ts';
import {createDurak,durakDeck,durakAction,durakView} from './durak.ts';
import {isAdventure} from './adventure-shared.ts';
import {createAdventure,adventureAction,adventureView,adventureHistory} from './adventures.ts';
import {isDuel} from './duel-shared.ts';
import {createDuel,duelAction,duelView,duelHistory} from './duels.ts';
import {quoteAction} from './moments.ts';
import {missions} from './server-content.ts';
export type Data=Record<string,any>;
export function randomInt(n:number){if(n<1)throw new Error('Нет вариантов');const max=4294967296-(4294967296%n);let a;do{a=crypto.getRandomValues(new Uint32Array(1))[0];}while(a>=max);return a%n;}
export function shuffle<T>(list:T[]){const a=[...list];for(let i=a.length-1;i>0;i--){const j=randomInt(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
export function newRoom(id:string,name:string,hash:string):Data{return {players:[{id,name,hash,joined:Date.now(),avatar:0}],stars:0,history:[],capsules:[],archive:[],favorites:[],seen:{},game:null,cinema:{id:crypto.randomUUID(),prefs:{},deck:[],votes:{},done:[],ready:[],date:'2026-10-23',stage:'prefs',tickets:[],decisions:{},usedTickets:[]},created:Date.now()};}
export function addPlayer(r:Data,id:string,name:string,hash:string){if(r.players.length>=2)throw new Error('Комната только для двух участников');r.players.push({id,name,hash,joined:Date.now(),avatar:1});}
function requirePair(r:Data){if(r.players.length!==2)throw new Error('Пригласите второго участника');}
function sameGame(r:Data,b:Data){if(!r.game||r.game.id!==b.gameId)throw new Error('Это приключение уже закончилось');return r.game;}
function roundAnswers(g:Data){return g.answers[String(g.round)]||{};}
function revealed(r:Data,g:Data){return r.players.every((p:Data)=>Object.hasOwn(roundAnswers(g),p.id));}
function finish(r:Data,g:Data){if(g.stage==='finished')return;g.stage='finished';r.history.unshift({id:g.id,mode:g.mode,date:Date.now(),score:g.score,total:g.mode==='mission'?5:g.mode==='disaster'?2:g.mode==='wheel'?1:10,matches:g.matches||[],story:g.story,ending:g.ending});r.history=r.history.slice(0,200);r.stars+=5;}
export function eligibleMovie(m:Data,filters:Data={}){
 const genres=(m.genres||[]).map((x:Data)=>x.id),release=m.release_date,year=Number(release?.slice(0,4)),date=filters.date||new Date().toISOString().slice(0,10),yearOnly=m.release_precision==='year';
 const validDate=typeof release==='string'&&(yearOnly?/^\d{4}$/.test(release):/^\d{4}-\d{2}-\d{2}$/.test(release));
 if(!validDate||!Number.isFinite(year)||year<1888)return false;
 if(filters.genre&&!genres.includes(Number(filters.genre)))return false;
 if(filters.year&&(year<Number(filters.year)||year>Number(filters.year)+9))return false;
 if(filters.releaseMin&&(yearOnly?year<Number(filters.releaseMin.slice(0,4)):release<filters.releaseMin))return false;
 if(filters.releaseMax&&(yearOnly?year>Number(filters.releaseMax.slice(0,4)):release>filters.releaseMax))return false;
 if((filters.excludedGenres||[]).some((id:number)=>genres.includes(id)))return false;
 return m.adult===false&&Number.isFinite(m.runtime)&&m.runtime>0&&m.runtime>=(filters.min||90)&&m.runtime<=(filters.max||150)&&genres.length>0&&!genres.includes(28)&&(!genres.includes(27)||filters.horror===true)&&(yearOnly?year<=Number(date.slice(0,4)):release<=date)&&!!m.id;
}
export function matchMovies(c:Data,ids:string[]):Data[]{if(ids.length!==2)return [];const matches=c.deck.filter((m:Data)=>ids.every(id=>Number(c.votes[id]?.[m.id])>0));const perfect=matches.filter((m:Data)=>ids.every(id=>c.votes[id]?.[m.id]===2));const good=matches.filter((m:Data)=>ids.some(id=>c.votes[id]?.[m.id]===2));return perfect.length?perfect:good.length?good:matches;}
export function act(r:Data,pid:string,b:Data){const me=r.players.find((p:Data)=>p.id===pid);if(!me)throw new Error('Нет доступа');const ids:string[]=r.players.map((p:Data)=>p.id);const c=r.cinema;
 const cineOps=['prefs','cinemaDate','deck','vote','votingDone','ready','decision','backMatches','newCinema'];
 if(cineOps.includes(b.op)&&b.cinemaId!==c.id)throw new Error('Этот киносеанс уже изменился. Обновите экран.');
 if(b.op==='decision'&&b.selectionId!==c.selectionId)throw new Error('Этот выбор фильма уже изменился. Посмотрите новый результат.');
 if((isAdventure(r.game?.mode)||isDuel(r.game?.mode))&&['answer','rate','hint','spin','completeWheel','next'].includes(b.op))throw new Error('Используйте действия текущего приключения');
 if(r.game?.mode==='durak'&&['answer','rate','hint','spin','completeWheel','next'].includes(b.op))throw new Error('Используйте действия карточной партии');
 switch(b.op){
 case 'quoteAdd':case 'quoteDelete':case 'quoteLike':quoteAction(r,pid,b);break;
 case 'profile':{const name=String(b.name||'').trim();if(!name||name.length>32)throw new Error('Имя: от 1 до 32 символов');me.name=name;me.avatar=Math.max(0,Math.min(5,Number(b.avatar)||0));break;}
 case 'start':{requirePair(r);if(!modes.some(m=>m.id===b.mode)||['capsule','cinema'].includes(b.mode))throw new Error('Неизвестная игра');if(r.game&&r.game.stage!=='finished')throw new Error('Сначала завершите текущее приключение');if(isDuel(b.mode)){r.game=createDuel(b.mode,ids,randomInt);break;}if(isAdventure(b.mode)){r.game=createAdventure(b.mode,ids,randomInt);break;}if(b.mode==='durak'){r.game=createDurak(ids,shuffle(durakDeck()));break;}const size=b.mode==='telepathy'?telepathy.length:b.mode==='who'?who.length:b.mode==='swap'?swapPrompts.length:telepathy.length;const seen=r.seen[b.mode]||[];let pool=Array.from({length:size},(_,i)=>i).filter(i=>!seen.includes(i));if(pool.length<10){pool=Array.from({length:size},(_,i)=>i);r.seen[b.mode]=[];}const deck=shuffle(pool).slice(0,10);r.seen[b.mode]=[...(r.seen[b.mode]||[]),...deck];r.game={id:crypto.randomUUID(),mode:b.mode,round:0,deck,answers:{},ratings:{},score:0,matches:[],stage:'playing',story:randomInt(stories.length),path:[],hints:0};break;}
 case 'duel':{const g=sameGame(r,b);if(!isDuel(g.mode))throw new Error('Это другая игра');duelAction(g,pid,b);if(g.stage==='finished'){r.history.unshift(duelHistory(g));r.history=r.history.slice(0,200);r.stars+=5;}break;}
 case 'adventure':{const g=sameGame(r,b);if(!isAdventure(g.mode))throw new Error('Это другое приключение');r.stars+=adventureAction(g,pid,b);if(g.stage==='finished'){r.history.unshift(adventureHistory(g));r.history=r.history.slice(0,200);r.stars+=5;}break;}
 case 'durakAttack':case 'durakDefend':case 'durakTake':case 'durakPass':{const g=sameGame(r,b);if(g.mode!=='durak')throw new Error('Это не карточная партия');durakAction(g,pid,b);if(g.stage==='finished'){r.history.unshift({id:g.id,mode:'durak',date:Date.now(),score:g.score,total:1,winner:g.winner,loser:g.loser,draw:g.draw});r.history=r.history.slice(0,200);r.stars+=5;}break;}
 case 'answer':{const g=sameGame(r,b);if(g.stage==='finished'||b.round!==g.round)return;if(g.mode==='wheel')throw new Error('Вращайте колесо, чтобы получить задание');const a=g.answers[String(g.round)]??={};if(Object.hasOwn(a,pid))return;
 if(g.mode==='mission'){if(g.solved)return;const v=String(b.value).trim();if(v!==missions[g.round].answer)throw new Error('Код не подошёл. Сверьте информацию друг с другом.');a[pid]=v;g.score++;r.stars+=2;g.solved=true;break;}
 if(g.mode==='swap'){const v=String(b.value).trim();if(!v||v.length>600)throw new Error('Напишите ответ до 600 символов');a[pid]=v;}
 else if(g.mode==='who'){if(!ids.includes(b.value))throw new Error('Выберите участника');a[pid]=b.value;}
 else{if(!Number.isInteger(b.value)||b.value<0||b.value>(g.mode==='disaster'?1:telepathy[g.deck[g.round]].options.length-1))throw new Error('Выберите ответ');a[pid]=b.value;}
 if(revealed(r,g)&&g.mode!=='swap'){const same=a[ids[0]]===a[ids[1]];g.matches.push({round:g.round,same,answers:{...a}});if(same){g.score++;r.stars+=2;}if(g.mode==='disaster'){const chosen=same?a[ids[0]]:a[ids[g.round%2]];g.path.push(chosen);}}break;}
 case 'rate':{const g=sameGame(r,b);if(g.mode!=='swap'||b.round!==g.round||!revealed(r,g))return;if(![0,1,2].includes(b.value))throw new Error('Выберите оценку');g.ratings[g.round]??={};if(!Object.hasOwn(g.ratings[g.round],pid)){g.ratings[g.round][pid]=b.value;g.score+=b.value;r.stars+=b.value;}break;}
 case 'hint':{const g=sameGame(r,b);g.hints++;break;}
 case 'spin':{const g=sameGame(r,b);if(g.mode!=='wheel'||g.result)return;g.result={index:randomInt(wheelTasks.length),at:Date.now()};break;}
 case 'completeWheel':{const g=sameGame(r,b);if(!g.result||g.stage==='finished')return;g.score=1;r.stars+=2;finish(r,g);break;}
 case 'next':{const g=sameGame(r,b);if(b.round!==g.round||g.stage==='finished')return;if(g.mode==='mission'){if(!g.solved)throw new Error('Сначала откройте сейф');}else if(!revealed(r,g))throw new Error('Ждём ответ второго участника');if(g.mode==='swap'&&!ids.every(id=>Object.hasOwn(g.ratings[g.round]||{},id)))throw new Error('Оба должны оценить ответы');const total=g.mode==='mission'?5:g.mode==='disaster'?2:10;if(g.round+1>=total){if(g.mode==='disaster')g.ending=g.path[0]*2+g.path[1];finish(r,g);}else{g.round++;g.solved=false;g.hints=0;}break;}
 case 'end':{const g=sameGame(r,b);if(g.stage!=='finished'){g.stage='finished';g.abandoned=true;r.history.unshift({id:g.id,mode:g.mode,date:Date.now(),score:g.score,total:g.round+1,abandoned:true});}break;}
 case 'capsule':{const text=String(b.text||'').trim(),opensAt=Number(b.opensAt);if(!text||text.length>4000||!Number.isFinite(opensAt)||opensAt<Date.now()+30000)throw new Error('Напишите письмо и выберите время в будущем');if(r.capsules.length>=100)throw new Error('Сначала удалите старые капсулы');r.capsules.push({id:crypto.randomUUID(),from:pid,text,opensAt,created:Date.now()});break;}
 case 'deleteCapsule':r.capsules=r.capsules.filter((x:Data)=>x.id!==b.id||x.from!==pid);break;
 case 'prefs':{requirePair(r);if(c.stage!=='prefs')throw new Error('Начните новый киносеанс');if(!Array.isArray(b.values)||b.values.length!==8||b.values.some((v:any,i:number)=>!Number.isInteger(v)||v<0||v>=[4,3,3,3,2,3,3,3][i]))throw new Error('Ответьте на все восемь вопросов');c.prefs[pid]=b.values;break;}
 case 'cinemaDate':{if(!/^\d{4}-\d{2}-\d{2}$/.test(b.date)||!Number.isFinite(new Date(b.date).valueOf()))throw new Error('Неверная дата');if(c.stage!=='prefs')throw new Error('Менять дату можно перед подборкой');c.date=b.date;break;}
 case 'deck':{requirePair(r);if(c.stage!=='prefs')return;if(!ids.every(id=>c.prefs[id]))throw new Error('Оба должны заполнить киноанкету');if(!b.serverDeck?.length)throw new Error('Нет подходящих фильмов. Измените фильтры.');c.deck=b.serverDeck;c.filters=b.filters;c.stage='voting';c.votes={};c.done=[];c.ready=[];c.result=null;c.decisions={};break;}
 case 'vote':{if(c.stage!=='voting')return;const movie=c.deck.find((m:Data)=>m.id===b.movieId);if(!movie||![0,1,2].includes(b.value))throw new Error('Неверный голос');if(c.done.includes(pid))return;c.votes[pid]??={};if(!Object.hasOwn(c.votes[pid],b.movieId))c.votes[pid][b.movieId]=b.value;break;}
 case 'votingDone':{if(c.stage!=='voting')return;if(!c.deck.every((m:Data)=>Object.hasOwn(c.votes[pid]||{},m.id)))throw new Error('Сначала оцените все фильмы');if(!c.done.includes(pid))c.done.push(pid);if(ids.every(id=>c.done.includes(id)))c.stage='matches';break;}
 case 'ready':{if(c.stage!=='matches')return;if(!c.ready.includes(pid))c.ready.push(pid);const pool=matchMovies(c,ids);if(!pool.length)throw new Error('Пока нет общих вариантов');if(ids.every(id=>c.ready.includes(id))&&!c.result){c.result=pool[randomInt(pool.length)];c.selectionId=crypto.randomUUID();c.spinAt=Date.now()+3000;c.stage='decision';c.decisions={};}break;}
 case 'decision':{if(c.stage!=='decision')return;if(!['accept','reroll'].includes(b.value))throw new Error('Неверный выбор');if(c.usedTickets.includes(pid)&&b.value==='reroll')throw new Error('Золотой билет уже использован');c.decisions[pid]=b.value;if(ids.every(id=>c.decisions[id]==='reroll')){const pool=matchMovies(c,ids).filter(m=>m.id!==c.result.id);if(!pool.length)throw new Error('Других совпадений нет. Вернитесь к списку.');c.usedTickets=[...ids];c.result=pool[randomInt(pool.length)];c.selectionId=crypto.randomUUID();c.spinAt=Date.now()+3000;c.decisions={};}else if(ids.every(id=>c.decisions[id]==='accept')){c.stage='ticket';const entry={id:crypto.randomUUID(),movie:c.result,date:c.date,status:'planned',reviews:{},predictions:{},created:Date.now()};r.archive.unshift(entry);r.stars+=5;}break;}
 case 'backMatches':if(['decision','ticket'].includes(c.stage)){c.stage='matches';c.ready=[];c.result=null;c.decisions={};}break;
 case 'newCinema':{r.cinema={id:crypto.randomUUID(),prefs:{},deck:[],votes:{},done:[],ready:[],date:b.date||c.date,stage:'prefs',tickets:[],decisions:{},usedTickets:[]};break;}
 case 'archiveStatus':{const e=r.archive.find((x:Data)=>x.id===b.id);if(!e||!['planned','watching','watched','rewatch'].includes(b.status))throw new Error('Неверный статус');e.status=b.status;break;}
 case 'review':{const e=r.archive.find((x:Data)=>x.id===b.id);if(!e||!Number.isInteger(b.rating)||b.rating<1||b.rating>10)throw new Error('Оценка от 1 до 10');e.reviews[pid]={rating:b.rating,text:String(b.text||'').slice(0,1000),moment:String(b.moment||'').slice(0,500)};break;}
 case 'prediction':{const e=r.archive.find((x:Data)=>x.id===b.id);if(!e||e.status==='watched')throw new Error('Прогнозы сохраняются до просмотра');e.predictions[pid]={happy:b.happy===true,twist:b.twist===true,rating:Math.max(1,Math.min(10,Number(b.rating)||7))};break;}
 case 'favorite':{const id=String(b.id);r.favorites=r.favorites.includes(id)?r.favorites.filter((x:string)=>x!==id):[...r.favorites,id];break;}
 case 'decorate':{const options=['moon','planet','comet'];if(!options.includes(b.item))throw new Error('Нет такого украшения');r.decorations??=[];if(r.decorations.includes(b.item))return;if(r.stars<10)throw new Error('Нужно 10 звёзд');r.stars-=10;r.decorations.push(b.item);break;}
 case 'surprise':{requirePair(r);r.invitation={id:crypto.randomUUID(),from:pid,mode:shuffle(['telepathy','who','wheel','swap','disaster'])[0]};break;}
 case 'dismissSurprise':r.invitation=null;break;
 default:throw new Error('Неизвестное действие');
 }
 return r;
}
export function gamePrompt(r:Data,pid:string){const g=r.game;if(!g)return null;const idx=g.deck[g.round]||0;const ids:string[]=r.players.map((p:Data)=>p.id);if(g.mode==='telepathy')return telepathy[idx];if(g.mode==='who')return {q:who[idx],options:r.players.map((p:Data)=>p.name)};if(g.mode==='quiz')return {...telepathy[idx],subject:ids[g.round%2],q:'Что выберет '+r.players[g.round%2].name+'? '+telepathy[idx].q};if(g.mode==='swap'){const other=r.players.find((p:Data)=>p.id!==pid);return {q:'Ответь от лица '+other.name+': '+swapPrompts[idx]};}if(g.mode==='mission'){const m=missions[g.round];return {q:m.title,clue:ids.indexOf(pid)===0?m.a:m.b,hint:g.hints?m.hint:undefined};}if(g.mode==='wheel')return {q:g.result?wheelTasks[g.result.index][1]:'Случай решит, каким будет ваше следующее приключение.',category:g.result?wheelTasks[g.result.index][0]:undefined};if(g.mode==='disaster'){const s=stories[g.story];return {q:g.stage==='finished'?s.ends[g.ending]:g.round===0?s.intro:s.branches[g.path[0]][g.path[0]],title:s.title,options:g.round===0?s.choices:s.midChoices};}return null;}
export function viewRoom(r:Data,pid:string):Data{const c=structuredClone(r);c.players=c.players.map(({hash,...p}:Data)=>p);c.me=pid;c.quotes??=[];delete c.seen;
 c.capsules=c.capsules.map((x:Data)=>{if(x.from!==pid&&Date.now()<x.opensAt)delete x.text;return x;});
 if(c.game&&isDuel(c.game.mode)){c.game=duelView(r.game,pid);}else if(c.game&&isAdventure(c.game.mode)){c.game=adventureView(r.game,pid);}else if(c.game?.mode==='durak'){c.game=durakView(r.game,pid);}else if(c.game){const g=r.game;const open=revealed(r,g);c.game={id:g.id,mode:g.mode,round:g.round,score:g.score,stage:g.stage,prompt:gamePrompt(r,pid),revealed:open,submitted:Object.hasOwn(roundAnswers(g),pid),answered:Object.keys(roundAnswers(g)).length,answers:open?roundAnswers(g):Object.hasOwn(roundAnswers(g),pid)?{[pid]:roundAnswers(g)[pid]}:{},ratings:g.ratings[g.round]||{},solved:g.solved,result:g.result,matches:g.matches};}
 const cine=c.cinema;cine.prefSubmitted=!!cine.prefs[pid];cine.prefCount=Object.keys(cine.prefs).length;if(cine.prefCount<2)cine.prefs=cine.prefs[pid]?{[pid]:cine.prefs[pid]}:{};cine.votedCount=Object.keys(cine.votes[pid]||{}).length;
 if(['prefs','voting'].includes(cine.stage))cine.votes={...(cine.votes[pid]?{[pid]:cine.votes[pid]}:{})};
 if(!['prefs','voting'].includes(cine.stage))cine.matches=matchMovies(r.cinema,r.players.map((p:Data)=>p.id));
 c.archive=c.archive.map((e:Data)=>{if(e.status!=='watched'&&e.status!=='rewatch')e.predictions=e.predictions[pid]?{[pid]:e.predictions[pid]}:{};return e;});return c;
}
