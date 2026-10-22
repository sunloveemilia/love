import {tabooCards,associationPrompts,dilemmaPrompts,storySeeds} from './adventure-content.ts';
import {isAdventure,normalizeAnswer} from './adventure-shared.ts';
type D=Record<string,any>;
function clean(value:unknown,max:number){if(typeof value!=='string')throw new Error('Введите текст');const text=value.trim();if(!text||text.length>max)throw new Error(`Введите от 1 до ${max} символов`);return text;}
function initializeRound(g:D){
 g.author=g.players[g.round%2];g.answers={};g.challenge=null;g.clue='';g.guesses=[];g.feedback=null;g.secret=null;g.low=1;g.high=100;g.card=null;
 if(g.mode==='truths')g.phase='writing';
 if(g.mode==='taboo'){g.phase='writing';g.card=tabooCards[g.deck[g.round]];}
 if(g.mode==='associations'){g.phase='answering';g.prompt={q:associationPrompts[g.deck[g.round]]};}
 if(g.mode==='dilemmas'){g.phase='answering';g.prompt=dilemmaPrompts[g.deck[g.round]];}
 if(g.mode==='numbers')g.phase='setting';
 if(g.mode==='story')g.phase='writing';
}
export function createAdventure(mode:string,players:string[],random:(n:number)=>number){
 if(!isAdventure(mode))throw new Error('Неизвестное приключение');
 const total=['truths','numbers'].includes(mode)?4:mode==='story'?8:6;
 const size=mode==='taboo'?tabooCards.length:mode==='associations'?associationPrompts.length:mode==='dilemmas'?dilemmaPrompts.length:0;
 const pool=Array.from({length:size},(_,i)=>i),deck:number[]=[];while(pool.length&&deck.length<total)deck.push(pool.splice(random(pool.length),1)[0]);
 const g:D={id:crypto.randomUUID(),mode,players:[...players],stage:'playing',phase:'',round:0,total,move:0,score:0,scores:Object.fromEntries(players.map(id=>[id,0])),deck,results:[],entries:[],seed:mode==='story'?storySeeds[random(storySeeds.length)]:null};
 initializeRound(g);return g;
}
function reveal(g:D,result:D,scorers:string[]=[]){g.phase='reveal';g.result=result;g.results.push({round:g.round,author:g.author,...structuredClone(result)});if(scorers.length){g.score++;for(const pid of scorers)g.scores[pid]++;}return scorers.length?2:0;}
function samePhase(g:D,phase:string){if(g.phase!==phase)throw new Error('Этот этап уже изменился');}
function authorOnly(g:D,pid:string){if(pid!==g.author)throw new Error('Сейчас ход другого участника');}
function guesserOnly(g:D,pid:string){if(pid===g.author)throw new Error('Угадывает другой участник');}
export function adventureAction(g:D,pid:string,b:D){
 if(g.stage!=='playing'||b.move!==g.move)throw new Error('Ход уже изменился. Обновите экран.');
 if(!g.players.includes(pid))throw new Error('Нет доступа');
 let bonus=0;
 if(b.action==='next'){
  samePhase(g,'reveal');
  if(g.round+1>=g.total)g.stage='finished';else{g.round++;g.result=null;initializeRound(g);}
 }else if(g.mode==='truths'){
  if(b.action==='facts'){
   samePhase(g,'writing');authorOnly(g,pid);
   if(!Array.isArray(b.facts)||b.facts.length!==3||!Number.isInteger(b.lie)||b.lie<0||b.lie>2)throw new Error('Нужны три факта и одна отмеченная ложь');
   const facts=b.facts.map((v:unknown)=>clean(v,180));if(new Set(facts.map(normalizeAnswer)).size!==3)throw new Error('Напишите три разных факта');
   g.challenge={facts,lie:b.lie};g.phase='guessing';
  }else if(b.action==='guessFact'){
   samePhase(g,'guessing');guesserOnly(g,pid);if(!Number.isInteger(b.value)||b.value<0||b.value>2)throw new Error('Выберите один из трёх фактов');
   bonus=reveal(g,{...g.challenge,guess:b.value,correct:b.value===g.challenge.lie},b.value===g.challenge.lie?[pid]:[]);
  }else throw new Error('Неизвестное действие');
 }else if(g.mode==='taboo'){
  if(b.action==='clue'){
   samePhase(g,'writing');authorOnly(g,pid);const text=clean(b.text,400),words=normalizeAnswer(text).match(/[\p{L}\p{N}]+/gu)||[];
   if(words.some(w=>g.card.stems.some((stem:string)=>w.startsWith(stem))))throw new Error('В объяснении есть загаданное или запрещённое слово. Перефразируйте.');
   g.clue=text;g.phase='guessing';
  }else if(b.action==='guessWord'){
   samePhase(g,'guessing');guesserOnly(g,pid);const text=clean(b.text,60),correct=normalizeAnswer(text)===normalizeAnswer(g.card.word);
   g.guesses.push({text,correct});if(correct||g.guesses.length>=3)bonus=reveal(g,{word:g.card.word,forbidden:g.card.forbidden,clue:g.clue,guesses:[...g.guesses],correct},correct?[pid]:[]);
  }else if(b.action==='skip'){
   if(!['writing','guessing'].includes(g.phase))throw new Error('Раунд уже завершён');if(g.phase==='writing')authorOnly(g,pid);
   reveal(g,{word:g.card.word,forbidden:g.card.forbidden,clue:g.clue,guesses:[...g.guesses],correct:false,skipped:true});
  }else throw new Error('Неизвестное действие');
 }else if(g.mode==='associations'||g.mode==='dilemmas'){
  if(b.action!=='answer')throw new Error('Неизвестное действие');samePhase(g,'answering');if(Object.hasOwn(g.answers,pid))throw new Error('Ответ уже сохранён');
  let answer;if(g.mode==='associations'){answer=clean(b.text,32);if(!/^[\p{L}\p{N}]+(?:[-‐][\p{L}\p{N}]+)*$/u.test(answer))throw new Error('Нужно одно слово, можно через дефис');}
  else{if(!Number.isInteger(b.value)||b.value<0||b.value>1)throw new Error('Выберите один из двух вариантов');answer=b.value;}
  g.answers[pid]=answer;
  if(g.players.every((id:string)=>Object.hasOwn(g.answers,id))){const vals=g.players.map((id:string)=>g.answers[id]);const same=g.mode==='associations'?normalizeAnswer(vals[0])===normalizeAnswer(vals[1]):vals[0]===vals[1];bonus=reveal(g,{prompt:g.prompt,answers:{...g.answers},same},same?g.players:[]);}
 }else if(g.mode==='numbers'){
  if(b.action==='setNumber'){
   samePhase(g,'setting');authorOnly(g,pid);if(!Number.isInteger(b.value)||b.value<1||b.value>100)throw new Error('Загадайте целое число от 1 до 100');g.secret=b.value;g.phase='guessing';
  }else if(b.action==='guessNumber'){
   samePhase(g,'guessing');guesserOnly(g,pid);if(!Number.isInteger(b.value)||b.value<g.low||b.value>g.high)throw new Error(`Выберите целое число от ${g.low} до ${g.high}`);
   const correct=b.value===g.secret;g.feedback=correct?'correct':b.value<g.secret?'higher':'lower';g.guesses.push({value:b.value,feedback:g.feedback});
   if(!correct){if(b.value<g.secret)g.low=b.value+1;else g.high=b.value-1;}
   if(correct||g.guesses.length>=7)bonus=reveal(g,{secret:g.secret,guesses:[...g.guesses],correct},correct?[pid]:[]);
  }else throw new Error('Неизвестное действие');
 }else if(g.mode==='story'){
  if(b.action!=='storyLine')throw new Error('Неизвестное действие');samePhase(g,'writing');authorOnly(g,pid);const text=clean(b.text,400);g.entries.push({author:pid,text});g.round++;
  if(g.round>=g.total){g.stage='finished';g.score=g.entries.length;}else g.author=g.players[g.round%2];
 }else throw new Error('Неизвестное приключение');
 g.move++;return bonus;
}
export function adventureView(g:D,pid:string){
 const open=g.phase==='reveal'&&!g.abandoned;
 const v:D={id:g.id,mode:g.mode,stage:g.stage,phase:g.phase,round:g.round,total:g.total,move:g.move,score:g.score,scores:structuredClone(g.scores),author:g.author,abandoned:g.abandoned,prompt:g.prompt,seed:g.seed,entries:structuredClone(g.entries),results:structuredClone(g.results),result:open?structuredClone(g.result):null};
 if(g.mode==='truths'&&g.challenge)v.challenge={facts:[...g.challenge.facts],...(open||pid===g.author?{lie:g.challenge.lie}:{})};
 if(g.mode==='taboo'){v.clue=g.clue;v.guesses=structuredClone(g.guesses);if(pid===g.author||open)v.card={word:g.card.word,forbidden:[...g.card.forbidden]};}
 if(['associations','dilemmas'].includes(g.mode)){v.answers=open?{...g.answers}:Object.hasOwn(g.answers,pid)?{[pid]:g.answers[pid]}:{};v.answered=Object.keys(g.answers).length;}
 if(g.mode==='numbers'){v.low=g.low;v.high=g.high;v.guesses=structuredClone(g.guesses);v.feedback=g.feedback;if(pid===g.author||open)v.secret=g.secret;}
 return v;
}
export function adventureHistory(g:D){return {id:g.id,mode:g.mode,date:Date.now(),score:g.score,total:g.total,details:{scores:structuredClone(g.scores),rounds:structuredClone(g.results),...(g.mode==='story'?{seed:g.seed,entries:structuredClone(g.entries)}:{})}};}
