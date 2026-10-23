import {drawingCards,laughCards,dubbingCards,warmCards} from './nearby-content.ts';
import {movieLibrary} from './movie-library.ts';
import {clientId} from './client-id.ts';
export type Point={x:number,y:number};
export type Stroke={color:string,width:number,points:Point[]};
export type Kind='draw'|'laugh'|'dub'|'warm'|'cinema';
export type NearbyTask={kind:Kind,card:number};
export type NearbyResult=NearbyTask&{rating:string,turn:number,strokes?:Stroke[],filmId?:number};
export type NearbyState={version:1,id:string,mode:string,names:string[],tasks:NearbyTask[],index:number,phase:string,remaining:number,endsAt:number|null,strokes:Stroke[],results:NearbyResult[],filmIds:number[]};
const cards={draw:drawingCards,laugh:laughCards,dub:dubbingCards,warm:warmCards,cinema:[{q:'Выберите вашу историю на вечер.'}]};
export const nearbyPalette=['#4c345e','#db6b83','#487e93','#c99c42'];
export const nearbyFilms=movieLibrary.filter(m=>m.adult===false&&m.runtime>=90&&m.runtime<=150&&!m.genres.some((g:any)=>[28,27].includes(g.id)));
const modes=['draw','laugh','dub','fun','close','mix'];
const durations:Record<Kind,number>={draw:60,laugh:30,dub:60,warm:0,cinema:0};
const phases=['handoff','briefing','playing','judging','result','finished'];
function pick<T>(items:T[],n:number,random:(n:number)=>number){const pool=[...items],out:T[]=[];while(out.length<n&&pool.length)out.push(pool.splice(random(pool.length),1)[0]);return out;}
function initialPhase(kind:Kind){return kind==='draw'||kind==='laugh'?'handoff':'briefing';}
export function createNearby(mode:string,names:string[],random:(n:number)=>number=n=>Math.floor(Math.random()*n)):NearbyState{
 if(!modes.includes(mode)||names.length!==2||names.some(n=>typeof n!=='string'||!n.trim()||n.trim().length>24))throw new Error('Введите два имени до 24 символов');
 const kinds:Kind[]=mode==='fun'?['laugh','draw','dub','laugh','cinema']:mode==='close'?['draw','warm','dub','warm','cinema']:mode==='mix'?['draw','laugh','dub','warm','cinema']:Array(4).fill(mode as Kind);
 const pools=Object.fromEntries(Object.entries(cards).map(([k,arr])=>[k,pick(arr.map((_,i)=>i),arr.length,random)])) as Record<Kind,number[]>;
 const tasks=kinds.map(kind=>({kind,card:pools[kind].shift()!}));
 const filmPool=nearbyFilms.filter(m=>mode==='close'?m.genres.some((g:any)=>g.id===10749):mode==='fun'?m.genres.some((g:any)=>[35,16].includes(g.id)):true);
 return {version:1,id:clientId(),mode,names:names.map(n=>n.trim()),tasks,index:0,phase:initialPhase(tasks[0].kind),remaining:durations[tasks[0].kind],endsAt:null,strokes:[],results:[],filmIds:pick(filmPool,3,random).map(m=>m.id)};
}
export function nearbyCard(s:NearbyState):any{const t=s.tasks[s.index];return t?{...cards[t.kind][t.card],artist:s.index%2,performer:s.index%2,guide:1-s.index%2}:{};}
export function nearbyTime(s:NearbyState,now:number){return s.endsAt===null?s.remaining:Math.max(0,Math.min(durations[s.tasks[s.index]?.kind||'draw'],Math.ceil((s.endsAt-now)/1000)));}
function validStroke(s:any){return s&&nearbyPalette.includes(s.color)&&[3,5,9].includes(s.width)&&Array.isArray(s.points)&&s.points.length>0&&s.points.length<=4000&&s.points.every((p:any)=>p&&Number.isFinite(p.x)&&p.x>=0&&p.x<=1&&Number.isFinite(p.y)&&p.y>=0&&p.y<=1);}
function checkPhase(s:NearbyState,allowed:string[]){if(!allowed.includes(s.phase))throw new Error('Сначала завершите текущий шаг');}
export function nearbyAction(state:NearbyState,a:any):NearbyState{
 if(state.phase==='finished')throw new Error('Этот вечер уже завершён');
 if(a.type==='tick'&&(state.phase!=='playing'||state.endsAt===null||state.endsAt>a.now))return state;
 const s=structuredClone(state),task=s.tasks[s.index];
 const record=(rating:string)=>{s.results.push({...task,rating,turn:s.index,...(task.kind==='draw'?{strokes:structuredClone(s.strokes)}:{})});s.phase='result';s.endsAt=null;};
 switch(a.type){
  case 'reveal':checkPhase(s,['handoff']);s.phase='briefing';break;
  case 'start':checkPhase(s,['briefing','playing']);if(!['draw','laugh','dub'].includes(task.kind)||s.phase==='playing'&&s.endsAt!==null||!Number.isFinite(a.now))throw new Error('Таймер пока недоступен');s.phase='playing';s.endsAt=a.now+s.remaining*1000;break;
  case 'pause':checkPhase(s,['playing']);if(s.endsAt===null||!Number.isFinite(a.now))throw new Error('Таймер уже на паузе');s.remaining=nearbyTime(s,a.now);s.endsAt=null;if(!s.remaining)s.phase='judging';break;
  case 'tick':if(!Number.isFinite(a.now))throw new Error('Неверное время');s.remaining=0;s.endsAt=null;s.phase='judging';break;
  case 'done':checkPhase(s,['playing']);s.remaining=nearbyTime(s,a.now);s.endsAt=null;s.phase='judging';break;
  case 'stroke':checkPhase(s,['playing']);if(task.kind!=='draw'||s.endsAt===null||!validStroke(a.stroke)||s.strokes.length>=120||s.strokes.reduce((n,t)=>n+t.points.length,0)+a.stroke.points.length>16000)throw new Error('Поле заполнено. Отмените штрих или очистите рисунок.');s.strokes.push(structuredClone(a.stroke));break;
  case 'undo':case 'clear':checkPhase(s,['playing']);if(task.kind!=='draw')throw new Error('Это другое задание');if(a.type==='undo')s.strokes.pop();else s.strokes=[];break;
  case 'judge':checkPhase(s,['judging']);if(!(task.kind==='draw'?['masterpiece','abstract']:task.kind==='laugh'?['laughed','held']:task.kind==='dub'?['oscar','chaos']:[]).includes(a.value))throw new Error('Выберите результат');record(a.value);break;
  case 'warmDone':checkPhase(s,['briefing']);if(task.kind!=='warm')throw new Error('Это другое задание');record('done');break;
  case 'film':checkPhase(s,['briefing']);if(task.kind!=='cinema'||!s.filmIds.includes(a.id))throw new Error('Выберите фильм из этой подборки');record('chosen');s.results.at(-1)!.filmId=a.id;break;
  case 'skip':checkPhase(s,['handoff','briefing','playing','judging']);record('skipped');break;
  case 'next':checkPhase(s,['result']);s.index++;s.strokes=[];s.endsAt=null;if(s.index===s.tasks.length){s.phase='finished';s.remaining=0;}else{s.phase=initialPhase(s.tasks[s.index].kind);s.remaining=durations[s.tasks[s.index].kind];}break;
  default:throw new Error('Неизвестное действие');
 }
 return s;
}
export function nearbyScores(s:NearbyState){const scores=[0,0];for(const r of s.results)if(r.kind==='laugh'&&r.rating!=='skipped')scores[r.rating==='laughed'?r.turn%2:1-r.turn%2]++;return scores;}
export function restoreNearby(raw:string):NearbyState|null{
 try{if(raw.length>3000000)return null;const s=JSON.parse(raw) as NearbyState;
  const validTask=(t:any)=>t&&Object.hasOwn(cards,t.kind)&&Number.isInteger(t.card)&&t.card>=0&&t.card<(cards as any)[t.kind].length;
  if(s.version!==1||typeof s.id!=='string'||!modes.includes(s.mode)||!Array.isArray(s.names)||s.names.length!==2||s.names.some(n=>typeof n!=='string'||!n.trim()||n.length>24)||!Array.isArray(s.tasks)||!s.tasks.length||s.tasks.length>6||!s.tasks.every(validTask)||!Number.isInteger(s.index)||s.index<0||s.index>s.tasks.length||!phases.includes(s.phase)||s.phase==='finished'&&s.index!==s.tasks.length||s.phase!=='finished'&&s.index===s.tasks.length||!Number.isInteger(s.remaining)||s.remaining<0||s.remaining>60||s.endsAt!==null&&(!Number.isFinite(s.endsAt)||s.endsAt<0)||!Array.isArray(s.strokes)||s.strokes.length>120||!s.strokes.every(validStroke)||s.strokes.reduce((n,t)=>n+t.points.length,0)>16000||!Array.isArray(s.filmIds)||s.filmIds.length!==3||new Set(s.filmIds).size!==3||s.filmIds.some(id=>!nearbyFilms.some(m=>m.id===id))||!Array.isArray(s.results)||s.results.length>6)return null;
  const expected=s.phase==='finished'?s.tasks.length:s.index+(s.phase==='result'?1:0);
  if(s.results.length!==expected||s.results.some((r,i)=>r.turn!==i))return null;
  const task=s.tasks[s.index];if(task){if(s.remaining>durations[task.kind]||s.phase==='handoff'&&!['draw','laugh'].includes(task.kind)||['playing','judging'].includes(s.phase)&&!['draw','laugh','dub'].includes(task.kind)||s.phase!=='playing'&&s.endsAt!==null||s.phase==='playing'&&s.remaining===0)return null;}
  const ratings:Record<Kind,string[]>={draw:['masterpiece','abstract'],laugh:['laughed','held'],dub:['oscar','chaos'],warm:['done'],cinema:['chosen']};
  for(const r of s.results){if(!validTask(r)||!Number.isInteger(r.turn)||r.turn<0||r.turn>=s.tasks.length||r.kind!==s.tasks[r.turn].kind||r.card!==s.tasks[r.turn].card||r.rating!=='skipped'&&!ratings[r.kind].includes(r.rating)||r.strokes&&(!Array.isArray(r.strokes)||r.strokes.length>120||!r.strokes.every(validStroke)||r.strokes.reduce((n,t)=>n+t.points.length,0)>16000)||r.filmId!==undefined&&!s.filmIds.includes(r.filmId))return null;}
  return s;
 }catch{return null;}
}

export function nearbyTransition(s:NearbyState,a:any,draft:Stroke|null){const finishing=['pause','done'].includes(a.type)||a.type==='tick'&&s.endsAt!==null&&a.now>=s.endsAt;let current=s;if(finishing&&s.phase==='playing'&&s.endsAt!==null&&s.tasks[s.index].kind==='draw'&&draft){try{current=nearbyAction(s,{type:'stroke',stroke:draft});}catch{/* Keep the saved strokes when the drawing limit has already been reached. */}}return nearbyAction(current,a);}
