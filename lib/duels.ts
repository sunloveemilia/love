import {pricePrompts,powers,powerChallenges,starterPowers} from './duel-content.ts';
import {isDuel} from './duel-shared.ts';
type D=Record<string,any>;
function pick<T>(items:T[],count:number,random:(n:number)=>number){const pool=[...items],out:T[]=[];while(out.length<count&&pool.length)out.push(pool.splice(random(pool.length),1)[0]);return out;}
function phase(g:D,expected:string){if(g.phase!==expected)throw new Error('Этот этап уже изменился. Обновите экран.');}
function amount(value:unknown,max:number,refusal=false){if(refusal&&value===null)return null;if(typeof value!=='number'||!Number.isInteger(value)||value<0||value>max)throw new Error(`Введите целое число от 0 до ${max}`);return value;}
function round(g:D){g.result=null;g.answers={};g.ratings={};g.bids={};g.target=undefined;g.author=g.players[g.round%2];g.phase=g.mode==='price'?'setting':g.round<5?'bidding':'writing';}
function end(g:D){g.stage='finished';const [a,b]=g.players;g.winner=g.scores[a]===g.scores[b]?null:g.scores[a]>g.scores[b]?a:b;}
export function createDuel(mode:string,players:string[],random:(n:number)=>number){
 if(!isDuel(mode)||players.length!==2||players[0]===players[1])throw new Error('Нужны два участника и известная игра');
 const g:D={id:crypto.randomUUID(),mode,players:[...players],stage:'playing',round:0,total:mode==='price'?6:8,move:0,score:0,scores:Object.fromEntries(players.map(p=>[p,0])),results:[],lotResults:[]};
 if(mode==='price')g.prompts=pick(pricePrompts,6,random);
 else{g.lots=pick(powers,5,random);g.challenges=pick(powerChallenges,3,random);g.balances=Object.fromEntries(players.map(p=>[p,100]));g.owned=Object.fromEntries(players.map((p,i)=>[p,[structuredClone(starterPowers[i])]]));}
 round(g);return g;
}
export function duelAction(g:D,pid:string,b:D){
 if(g.stage!=='playing'||b.move!==g.move)throw new Error('Ход уже изменился. Обновите экран.');
 if(!g.players.includes(pid))throw new Error('Нет доступа');
 if(b.action==='next'){
  if(!['reveal','lotReveal'].includes(g.phase))throw new Error('Сначала закончите текущий раунд');
  if(g.round+1===g.total)end(g);else{g.round++;round(g);}
 }else if(g.mode==='price'){
  if(b.action==='setPrice'){
   phase(g,'setting');if(pid!==g.author)throw new Error('Сейчас цену называет другой участник');
   const value=amount(b.value,1000000,true);g.target=value;g.phase='guessing';
  }else if(b.action==='guessPrice'){
   phase(g,'guessing');if(pid===g.author)throw new Error('Угадывает другой участник');
   const guess=amount(b.value,1000000,true),target=g.target;
   const points=guess===target?100:guess===null||target===null||target===0?0:Math.max(0,Math.round(100*(1-Math.abs(guess-target)/target)));
   g.scores[pid]+=points;g.score+=points;
   g.result={prompt:g.prompts[g.round],author:g.author,guesser:pid,target,guess,points};g.results.push(structuredClone(g.result));g.phase='reveal';
  }else throw new Error('Неизвестное действие');
 }else if(g.mode==='auction'){
  if(b.action==='bid'){
   phase(g,'bidding');if(Object.hasOwn(g.bids,pid))throw new Error('Ставка уже сохранена');
   const value=amount(b.value,g.balances[pid]);g.bids[pid]=value;
   if(g.players.every((p:string)=>Object.hasOwn(g.bids,p))){
    const [a,c]=g.players,highest=Math.max(g.bids[a],g.bids[c]),winner=highest===0?null:g.bids[a]===g.bids[c]?g.players[g.round%2]:g.bids[a]>g.bids[c]?a:c;
    if(winner){g.balances[winner]-=highest;g.owned[winner].push(structuredClone(g.lots[g.round]));}
    g.result={power:structuredClone(g.lots[g.round]),bids:{...g.bids},winner,price:winner?highest:0,priority:g.players[g.round%2]};g.lotResults.push(structuredClone(g.result));g.phase='lotReveal';
   }
  }else if(b.action==='pitch'){
   phase(g,'writing');if(Object.hasOwn(g.answers,pid))throw new Error('Ответ уже сохранён');
   if(typeof b.text!=='string'||b.text.trim().length<10||b.text.trim().length>500)throw new Error('Напишите от 10 до 500 символов');
   if(!Array.isArray(b.powers)||b.powers.length<1||b.powers.length>2||new Set(b.powers).size!==b.powers.length||b.powers.some((id:unknown)=>!g.owned[pid].some((p:D)=>p.id===id)))throw new Error('Выберите одну или две свои способности');
   g.answers[pid]={text:b.text.trim(),powers:[...b.powers]};if(g.players.every((p:string)=>Object.hasOwn(g.answers,p)))g.phase='judging';
  }else if(b.action==='ratePitch'){
   phase(g,'judging');if(Object.hasOwn(g.ratings,pid))throw new Error('Оценка уже сохранена');
   if(!Number.isInteger(b.value)||b.value<1||b.value>5)throw new Error('Выберите оценку от 1 до 5');
   g.ratings[pid]=b.value;
   if(g.players.every((p:string)=>Object.hasOwn(g.ratings,p))){
    const points:Record<string,number>={};for(const p of g.players){const peer=g.players.find((id:string)=>id!==p);points[p]=g.ratings[peer];g.scores[p]+=points[p];g.score+=points[p];}
    g.result={prompt:g.challenges[g.round-5],answers:structuredClone(g.answers),ratings:{...g.ratings},points};g.results.push(structuredClone(g.result));g.phase='reveal';
   }
  }else throw new Error('Неизвестное действие');
 }else throw new Error('Неизвестная игра');
 g.move++;
}
function privateMap(map:D,pid:string,open:boolean){return open?structuredClone(map):Object.hasOwn(map,pid)?{[pid]:structuredClone(map[pid])}:{};}
export function duelView(g:D,pid:string){
 const open=!g.abandoned&&(g.phase==='reveal'||g.phase==='lotReveal');
 const v:D={id:g.id,mode:g.mode,stage:g.stage,phase:g.phase,round:g.round,total:g.total,move:g.move,score:g.score,scores:structuredClone(g.scores),author:g.author,winner:g.winner,abandoned:g.abandoned,results:structuredClone(g.results),result:open?structuredClone(g.result):null};
 if(g.mode==='price'){v.prompt=g.prompts[g.round];if(pid===g.author||open)v.target=g.target;}
 else{
  v.balances={...g.balances};v.owned=structuredClone(g.owned);v.lotResults=structuredClone(g.lotResults);v.priority=g.players[g.round%2];
  if(g.round<5)v.lot=structuredClone(g.lots[g.round]);else v.prompt=g.challenges[g.round-5];
  v.bids=privateMap(g.bids,pid,open);v.bidCount=Object.keys(g.bids).length;
  v.answers=privateMap(g.answers,pid,!g.abandoned&&['judging','reveal'].includes(g.phase));v.answerCount=Object.keys(g.answers).length;
  v.ratings=privateMap(g.ratings,pid,open);v.ratingCount=Object.keys(g.ratings).length;
 }
 return v;
}
export function duelHistory(g:D){return {id:g.id,mode:g.mode,date:Date.now(),score:g.score,total:g.mode==='price'?6:3,winner:g.winner,details:{scores:structuredClone(g.scores),winner:g.winner,rounds:structuredClone(g.results),...(g.mode==='auction'?{lots:structuredClone(g.lotResults),owned:structuredClone(g.owned),balances:{...g.balances}}:{})}};}
