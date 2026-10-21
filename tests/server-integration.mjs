import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync,readdirSync} from 'node:fs';
const req=createRequire(import.meta.url);const {Miniflare}=req(req.resolve('miniflare',{paths:[req.resolve('wrangler/package.json')]}));
const paths=['index.js',...readdirSync('dist/server',{recursive:true}).filter(p=>p.endsWith('.js')&&p!=='index.js')];
const mf=new Miniflare({modules:paths.map(p=>({type:'ESModule',path:'dist/server/'+p})),compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],d1Databases:{DB:'test-db'},cf:false});
const db=await mf.getD1Database('DB');
for(const sql of readFileSync('drizzle/0000_mushy_owl.sql','utf8').replace(/--> statement-breakpoint/g,'').split(';').filter(s=>s.trim()))await db.prepare(sql).run();
const fetch=(...args)=>mf.dispatchFetch(...args);
const root='http://two.test';
class Client {cookie='';room=null;async get(){const r=await fetch(root+'/api/two',{headers:{cookie:this.cookie}});assert.equal(r.status,200);this.room=(await r.json()).room;return this.room;}async post(b,expected=200){b={cinemaId:this.room?.cinema.id,selectionId:this.room?.cinema.selectionId,...b};const r=await fetch(root+'/api/two',{method:'POST',headers:{'content-type':'application/json',cookie:this.cookie,origin:root},body:JSON.stringify(b)});if(r.headers.get('set-cookie'))this.cookie=r.headers.get('set-cookie').split(';')[0];const d=await r.json();if(d.room)this.room=d.room;assert.equal(r.status,expected,JSON.stringify(d));return d;}}
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
const failed=await a.post({op:'deck',input:{}},400);assert.match(failed.error,/TMDB/);
const invalid=await fetch(root+'/api/two',{method:'POST',headers:{'content-type':'application/json',cookie:a.cookie,origin:'https://untrusted.example'},body:JSON.stringify({op:'profile',name:'bad'})});assert.equal(invalid.status,403);
await mf.dispose();
console.log('PASS: two isolated HTTP sessions, real D1 storage, concurrent round advance ×10, server scoring, privacy, recovery, capacity, CSRF, honest missing-TMDB response.');
