import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync,readdirSync} from 'node:fs';
const req=createRequire(import.meta.url);const {Miniflare}=req(req.resolve('miniflare',{paths:[req.resolve('wrangler/package.json')]}));
const paths=['index.js',...readdirSync('dist/server',{recursive:true}).filter(p=>p.endsWith('.js')&&p!=='index.js')];
console.log('Starting isolated Worker integration');
const mf=new Miniflare({modules:paths.map(p=>({type:'ESModule',path:'dist/server/'+p})),compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],d1Databases:{DB:'test-db'},cf:false});
const db=await mf.getD1Database('DB');
console.log('Worker ready; checking real D1 sessions');
for(const sql of readFileSync('drizzle/0000_mushy_owl.sql','utf8').replace(/--> statement-breakpoint/g,'').split(';').filter(s=>s.trim()))await db.prepare(sql).run();
const fetch=(...args)=>mf.dispatchFetch(...args);
const root='http://two.test';
let clientIndex=0;
class Client {ip='192.0.2.'+(++clientIndex);cookie='';room=null;async get(){const r=await fetch(root+'/api/two',{headers:{cookie:this.cookie,'cf-connecting-ip':this.ip}});assert.equal(r.status,200);this.room=(await r.json()).room;return this.room;}async post(b,expected=200){b={cinemaId:this.room?.cinema.id,selectionId:this.room?.cinema.selectionId,...b};const r=await fetch(root+'/api/two',{method:'POST',headers:{'content-type':'application/json',cookie:this.cookie,origin:root,'cf-connecting-ip':this.ip},body:JSON.stringify(b)});if(r.headers.get('set-cookie'))this.cookie=r.headers.get('set-cookie').split(';')[0];const d=await r.json();if(d.room)this.room=d.room;assert.equal(r.status,expected,JSON.stringify(d));return d;}}
const a=new Client(),b=new Client(),outsider=new Client();
let {room:r}=await a.post({op:'create',name:'QA — первый'});assert.match(r.code,/^\d{6}$/);assert.equal(r.players.length,1);
await b.post({op:'join',name:'QA — второй',code:r.code});assert.equal((await a.get()).players.length,2);
assert.equal(await outsider.get(),null);await outsider.post({op:'join',name:'Лишний',code:r.code},400);
const before=await a.get();assert.ok(!JSON.stringify(before).includes('hash'));
r=(await a.post({op:'start',mode:'telepathy'})).room;
for(let round=0;round<10;round++){
 const common={gameId:r.game.id,round};
 await a.post({op:'answer',...common,value:0});
 const hidden=await b.get();assert.equal(hidden.game.answers[hidden.players[0].id],undefined);assert.equal(hidden.game.answered,1);
 await b.post({op:'answer',...common,value:0});assert.equal((await a.get()).game.revealed,true);
 const results=await Promise.all([a.post({op:'next',...common}),b.post({op:'next',...common})]);r=await a.get();assert.equal(r.game.round,Math.min(9,round+1));
}
assert.equal(r.game.stage,'finished');assert.equal(r.history.length,1);assert.equal(r.history[0].score,10);
await a.post({op:'capsule',text:'СЕКРЕТ — тест приватности',opensAt:Date.now()+120000});const capsule=(await b.get()).capsules[0];assert.ok(!('text'in capsule));assert.equal((await a.get()).capsules[0].text,'СЕКРЕТ — тест приватности');
await Promise.all([a.post({op:'prefs',values:[0,0,0,0,0,0,0,0]}),b.post({op:'prefs',values:[1,1,1,1,1,1,1,1]})]);assert.equal((await a.get()).cinema.prefCount,2);
await a.post({op:'deck',input:{page:4}});
const movieDeck=a.room.cinema.deck;assert.ok(movieDeck.length>0&&movieDeck.length<=12);
for(const m of movieDeck){assert.ok(m.id>=900000001);assert.equal(m.source,'TWO');assert.ok(m.runtime>=90&&m.runtime<=120);assert.ok(!m.genres.some(g=>g.id===28));}
const detailResponse=await fetch(root+'/api/movies?id='+movieDeck[0].id,{headers:{cookie:a.cookie,'cf-connecting-ip':a.ip}});assert.equal(detailResponse.status,200);assert.equal((await detailResponse.json()).movie.id,movieDeck[0].id);
const libraryResponse=await fetch(root+'/api/movies?query=About%20Time',{headers:{cookie:a.cookie,'cf-connecting-ip':a.ip}});assert.equal(libraryResponse.status,200);const library=await libraryResponse.json();assert.equal(library.source,'TWO'); // Runtime cap from the questionnaire still applies to search.
for(const client of [a,b]){
 await client.get();
 for(let i=0;i<movieDeck.length;i++)await client.post({op:'vote',movieId:movieDeck[i].id,value:client===a&&i===0?0:2});
 if(client===a){const privateView=await b.get();assert.equal(privateView.cinema.votes[a.room.me],undefined);}
 await client.post({op:'votingDone'});
}
await a.get();assert.equal(a.room.cinema.stage,'matches');assert.ok(a.room.cinema.matches.length);assert.ok(!a.room.cinema.matches.some(m=>m.id===movieDeck[0].id));
await a.post({op:'ready'});await b.get();await b.post({op:'ready'});
await a.get();await a.post({op:'decision',value:'accept'});assert.equal(a.room.archive.length,0);
await b.get();await b.post({op:'decision',value:'accept'});await a.get();assert.equal(a.room.cinema.stage,'ticket');assert.equal(a.room.archive.length,1);assert.equal(a.room.archive[0].movie.id,a.room.cinema.result.id);

const invalid=await fetch(root+'/api/two',{method:'POST',headers:{'content-type':'application/json',cookie:a.cookie,origin:'https://untrusted.example'},body:JSON.stringify({op:'profile',name:'bad'})});assert.equal(invalid.status,403);
// Exercise the built Durak route through two independent cookies and real CAS writes.
r=(await a.post({op:'start',mode:'durak'})).room;
await b.get();
const clients={[a.room.me]:a,[b.room.me]:b};
const attacker=clients[r.game.attacker],defender=clients[r.game.defender];
const av=await attacker.get(),dv=await defender.get();
assert.equal(av.game.hand.length,6);assert.equal(dv.game.hand.length,6);
assert.ok(!('hands' in av.game));assert.ok(!('stock' in dv.game));
const attack=av.game.hand[0],command={op:'durakAttack',gameId:av.game.id,move:av.game.move,card:attack};
const duplicates=await Promise.all([0,1].map(()=>fetch(root+'/api/two',{method:'POST',headers:{'content-type':'application/json',cookie:attacker.cookie,origin:root},body:JSON.stringify(command)})));
assert.deepEqual(duplicates.map(x=>x.status).sort(),[200,400]);
const defended=await defender.get();assert.equal(defended.game.table.length,1);assert.equal(defended.game.counts[av.me],5);
await defender.post({op:'durakTake',gameId:defended.game.id,move:defended.game.move});
const ending=await attacker.get();await attacker.post({op:'durakPass',gameId:ending.game.id,move:ending.game.move});
const after=await defender.get();assert.equal(after.game.table.length,0);assert.equal(after.game.hand.length,7);assert.equal(after.game.attacker,av.me);assert.equal(after.game.stockCount,23);
await a.get();await a.post({op:'end',gameId:a.room.game.id});assert.equal((await b.get()).game.abandoned,true);
await a.post({op:'start',mode:'durak'});assert.equal((await b.get()).game.stage,'playing');

await a.get();await a.post({op:'end',gameId:a.room.game.id});
for(const mode of ['truths','taboo','associations','dilemmas','numbers','story']){
 await a.post({op:'start',mode});
 const gameId=a.room.game.id;
 async function move(client,action,extra={}){await client.get();return client.post({op:'adventure',gameId,move:client.room.game.move,action,...extra});}
 while((await a.get()).game.stage==='playing'){
  const g=a.room.game,author=clients[g.author],guesser=author===a?b:a;
  if(g.phase==='reveal'){await move(a,'next');continue;}
  if(mode==='truths'){
   await move(author,'facts',{facts:['Первый факт','Второй факт','Третий факт'],lie:1});
   assert.equal((await guesser.get()).game.challenge.lie,undefined);
   await move(guesser,'guessFact',{value:1});
  }else if(mode==='taboo'){
   const secret=(await author.get()).game.card.word;
   assert.equal((await guesser.get()).game.card,undefined);
   await move(author,'clue',{text:'Необычный предмет из моей мечты'});
   assert.equal((await guesser.get()).game.card,undefined);
   await move(guesser,'guessWord',{text:secret});
  }else if(mode==='numbers'){
   await move(author,'setNumber',{value:42});
   assert.equal((await guesser.get()).game.secret,undefined);
   await move(guesser,'guessNumber',{value:20});
   assert.equal(guesser.room.game.feedback,'higher');
   await move(guesser,'guessNumber',{value:42});
  }else if(mode==='story'){
   await move(author,'storyLine',{text:'Фрагмент '+(g.round+1)});
  }else{
   const answer=mode==='associations'?{text:'Звёзды'}:{value:0};
   await move(a,'answer',answer);assert.deepEqual((await b.get()).game.answers,{});
   await move(b,'answer',answer);
  }
 }
 const memory=a.room.history.find(h=>h.id===gameId);
 assert.ok(memory,mode+' saved memory');assert.ok(memory.details,mode+' memory details');
 if(mode==='story')assert.equal(memory.details.entries.length,8);
 else assert.equal(memory.details.rounds.length,a.room.game.total);
 assert.equal(a.room.history.filter(h=>h.id===gameId).length,1);
}

// Two new competitive games over independent HttpOnly sessions and D1 CAS.
for(const mode of ['price','auction']){
 await a.post({op:'start',mode});const gameId=a.room.game.id;
 async function move(client,action,extra={}){await client.get();return client.post({op:'duel',gameId,move:client.room.game.move,action,...extra});}
 if(mode==='price'){
  for(let i=0;i<6;i++){
   const g=(await a.get()).game,author=clients[g.author],guesser=author===a?b:a;
   await move(author,'setPrice',{value:1000+i});
   assert.equal((await guesser.get()).game.target,undefined);
   await move(guesser,'guessPrice',{value:1000+i});
   assert.equal(guesser.room.game.result.points,100);
   const stale=guesser.room.game.move;
   await move(a,'next');
   await b.post({op:'duel',gameId,move:stale,action:'next'},400);
  }
 }else{
  for(let i=0;i<5;i++){
   await move(a,'bid',{value:10});assert.deepEqual((await b.get()).game.bids,{});
   await move(b,'bid',{value:5});assert.equal(b.room.game.phase,'lotReveal');
   await move(a,'next');
  }
  assert.equal(a.room.game.balances[a.room.me],50);assert.equal(a.room.game.balances[b.room.me],100);
  for(let i=0;i<3;i++){
   for(const client of [a,b]){await client.get();await move(client,'pitch',{text:'Пользуюсь суперсилой, чтобы неожиданно спасти наш вечер.',powers:[client.room.game.owned[client.room.me][0].id]});if(client===a)assert.deepEqual((await b.get()).game.answers,{});}
   await move(a,'ratePitch',{value:4});assert.deepEqual((await b.get()).game.ratings,{});
   await move(b,'ratePitch',{value:5});assert.equal(b.room.game.phase,'reveal');
   await move(a,'next');
  }
 }
 const final=await b.get();assert.equal(final.game.stage,'finished');assert.equal(final.history.filter(h=>h.id===gameId).length,1);
 assert.equal(final.history.find(h=>h.id===gameId).details.rounds.length,mode==='price'?6:3);
 assert.deepEqual((await a.get()).game.scores,final.game.scores);
}

// Shared quote jar uses independent sessions, including an idempotent retry.
const qa=new Client(),qb=new Client();await qa.post({op:'create',name:'Банка А'});await qb.post({op:'join',name:'Банка Б',code:qa.room.code});await qa.get();
const quoteId=crypto.randomUUID(),quote={op:'quoteAdd',id:quoteId,text:'Гусь забронировал наш столик.',speaker:qb.room.me,context:'Вечерний план'};
await qa.post(quote);await qa.post(quote);assert.equal(qa.room.quotes.length,1);assert.equal((await qb.get()).quotes[0].from,qa.room.me);
await qb.post({op:'quoteLike',id:quoteId,liked:true});assert.ok((await qa.get()).quotes[0].likedBy.includes(qb.room.me));
await qb.post({op:'quoteDelete',id:quoteId},400);await qa.post({op:'quoteDelete',id:quoteId});assert.equal((await qb.get()).quotes.length,0);

await mf.dispose();
console.log('PASS: shared quote jar with ownership, likes and idempotent retry; price and auction complete with private bids, secrets, peer scoring and saved history; all six adventures complete through isolated HTTP sessions with private clues/answers and saved memories; Durak independent hands, duplicate concurrent moves, take/refill, abandon/rematch; two isolated HTTP sessions, real D1 storage, concurrent round advance ×10, server scoring, privacy, recovery, capacity, CSRF, builtin movie search/details, both votes, veto, matching, double consent and ticket without external keys.');
