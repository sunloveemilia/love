// The server owns the deck and both hands. Only durakView is sent to a player.
export type Durak = Record<string,any>;
export const suits:Record<string,string>={c:'♣',d:'♦',h:'♥',s:'♠'};
export function rank(card:string){return Number(card.slice(1));}
export function cardLabel(card:string){return ({11:'В',12:'Д',13:'К',14:'Т'} as Record<number,string>)[rank(card)]||String(rank(card));}
export function beats(card:string,attack:string,trump:string){return card[0]===attack[0]?rank(card)>rank(attack):card[0]===trump&&attack[0]!==trump;}
export function canAttack(g:Durak,card:string){return g.table.length<g.limit&&(!g.table.length||g.table.some((p:Durak)=>rank(p.attack)===rank(card)||(p.defense&&rank(p.defense)===rank(card))));}
export function createDurak(ids:string[],shuffled:string[]){
 const stock=[...shuffled],hands:Record<string,string[]>={};
 for(const id of ids)hands[id]=stock.splice(0,6);
 const trumpCard=stock[stock.length-1],trump=trumpCard[0];
 const low=(id:string)=>Math.min(...hands[id].filter(c=>c[0]===trump).map(rank),99);
 const attacker=low(ids[1])<low(ids[0])?ids[1]:ids[0],defender=ids.find(id=>id!==attacker)!;
 return {id:crypto.randomUUID(),mode:'durak',stage:'playing',round:0,score:0,move:0,hands,stock,trump,trumpCard,attacker,defender,table:[],discard:[],limit:6,taking:false};
}
export function durakDeck(){return Object.keys(suits).flatMap(s=>Array.from({length:9},(_,i)=>s+(i+6)));}
export function durakAction(g:Durak,pid:string,b:Durak){
 if(g.stage!=='playing')throw new Error('Партия уже закончилась');
 if(b.move!==g.move)throw new Error('Ход уже изменился. Посмотрите на стол ещё раз.');
 const hand:string[]=g.hands[pid];
 if(!hand)throw new Error('Нет доступа к партии');
 const attack=pid===g.attacker;
 if(b.op==='durakAttack'){
  if(!attack||!hand.includes(b.card)||!canAttack(g,b.card))throw new Error('Эту карту нельзя подкинуть');
  hand.splice(hand.indexOf(b.card),1);g.table.push({attack:b.card});
 }else if(b.op==='durakDefend'){
  const pair=Number.isInteger(b.target)?g.table[b.target]:null;
  if(attack||g.taking||!pair||pair.defense||!hand.includes(b.card)||!beats(b.card,pair.attack,g.trump))throw new Error('Этой картой нельзя отбиться');
  hand.splice(hand.indexOf(b.card),1);pair.defense=b.card;
 }else if(b.op==='durakTake'){
  if(attack||g.taking||!g.table.length)throw new Error('Сейчас нельзя забрать карты');
  g.taking=true;
 }else if(b.op==='durakPass'){
  if(!attack||!g.table.length||(!g.taking&&g.table.some((p:Durak)=>!p.defense)))throw new Error('Дождитесь ответа на все карты');
  const cards=g.table.flatMap((p:Durak)=>p.defense?[p.attack,p.defense]:[p.attack]);
  if(g.taking)g.hands[g.defender].push(...cards);else g.discard.push(...cards);
  // Attacker draws first; the exposed trump is the very last card in the stock.
  for(const id of [g.attacker,g.defender])while(g.hands[id].length<6&&g.stock.length)g.hands[id].push(g.stock.shift());
  g.table=[];g.round++;
  const empty=Object.keys(g.hands).filter(id=>!g.hands[id].length);
  if(!g.stock.length&&empty.length){g.stage='finished';g.draw=empty.length===2;g.winner=g.draw?null:empty[0];g.loser=g.draw?null:Object.keys(g.hands).find(id=>id!==empty[0]);g.score=g.draw?0:1;}
  else{if(!g.taking)[g.attacker,g.defender]=[g.defender,g.attacker];g.limit=Math.min(6,g.hands[g.defender].length);}
  g.taking=false;
 }else throw new Error('Неизвестный ход');
 g.move++;
}
export function durakView(g:Durak,pid:string){return {id:g.id,mode:g.mode,stage:g.stage,round:g.round,score:g.score,move:g.move,hand:g.hands[pid],counts:Object.fromEntries(Object.entries(g.hands).map(([id,hand])=>[id,(hand as string[]).length])),stockCount:g.stock.length,trump:g.trump,trumpCard:g.trumpCard,attacker:g.attacker,defender:g.defender,table:structuredClone(g.table),discardCount:g.discard.length,limit:g.limit,taking:g.taking,winner:g.winner,loser:g.loser,draw:g.draw,abandoned:g.abandoned};}
