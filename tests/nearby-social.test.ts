import test from 'node:test';
import assert from 'node:assert/strict';
import {createSocial,socialAction,socialCard,socialView,socialPrivateOwner,serializeSocial,restoreSocial,socialGames} from '../lib/nearby-social.ts';
import {remoteModes,movedNearbyIds,remoteSurpriseModes} from '../lib/game-catalog.ts';
import {newRoom,addPlayer,act} from '../lib/engine.ts';
const make=(kind:any='scale')=>createSocial(kind,['А','Б'],42);
const action=(s:any,type:string,extra:any={})=>socialAction(s,{type,...extra});
test('remote catalogue excludes nearby games and non-game tools',()=>{assert.deepEqual(movedNearbyIds,['who','truths','taboo','wheel']);for(const m of remoteModes)assert.ok(![...movedNearbyIds,'capsule','cinema'].includes(m.id));assert.equal(remoteModes.length,12);assert.ok(remoteSurpriseModes.every(id=>remoteModes.some(m=>m.id===id)));});
test('new random remote invites never choose a moved physical game',t=>{t.mock.method(globalThis.crypto,'getRandomValues',(a:Uint32Array)=>a.fill(0));const r=newRoom('a','А','h');addPlayer(r,'b','Б','i');act(r,'a',{op:'surprise'});assert.ok(remoteModes.some(m=>m.id===r.invitation.mode));});
test('scale hides target from guesser, scores only once and alternates roles',()=>{let s=make();s=action(s,'reveal');const target=socialCard(s).target;s=action(s,'hide');assert.equal(socialView(s).target,undefined);s=action(s,'reveal');assert.equal(socialView(s).target,undefined);s=action(s,'guess',{value:target});assert.equal(s.scores[1],4);assert.equal(socialView(s).target,target);assert.throws(()=>action(s,'guess',{value:target}));s=action(s,'next');assert.equal(s.actor,1);});
test('truths stores a secret lie, shields it and reveals only after a guess',()=>{let s=make('truths');s=action(s,'reveal');s=action(s,'setLie',{value:2});assert.equal(socialView(s).lie,undefined);s=action(s,'reveal');assert.equal(socialView(s).lie,undefined);s=action(s,'guess',{value:2});assert.equal(s.scores[1],1);assert.equal(socialView(s).lie,2);});
test('seven second clock pauses, resumes and requires a human verdict',()=>{let s=action(make('sprint'),'start',{now:1000});s=action(s,'pause',{now:3000});assert.equal(s.remaining,5000);assert.equal(s.endsAt,null);s=action(s,'resume',{now:20000});s=action(s,'tick',{now:24999});assert.equal(s.phase,'playing');s=action(s,'tick',{now:25000});assert.equal(s.phase,'judge');s=action(s,'judge',{value:'success'});assert.equal(s.scores[0],1);assert.throws(()=>action(s,'judge',{value:'success'}));});
test('yes/no survival beats a late catch and late pause does not extend a round',()=>{let s=action(make('ban'),'start',{now:1000});s=action(s,'caught',{now:61000});assert.equal(s.phase,'result');assert.deepEqual(s.scores,[1,0]);let q=action(make('sprint'),'start',{now:0});q=action(q,'pause',{now:8000});assert.equal(q.phase,'judge');});
test('question prompts are deterministic, distinct and have useful follow-ups',()=>{const s=make('talk'),cards=[];for(let round=0;round<s.total;round++)cards.push(socialCard({...s,round}));assert.equal(new Set(cards.map(c=>c.q)).size,s.total);assert.ok(cards.every(c=>c.q&&c.deep));assert.equal(JSON.stringify(socialCard(make())),JSON.stringify(socialCard(make())));});
test('all eight face-to-face games complete with skips and valid replay saves',()=>{for(const g of socialGames){let s=make(g.id);for(let i=0;i<s.total;i++){s=action(s,'skip');s=action(s,'next');}assert.equal(s.phase,'finished',g.id);assert.equal(s.results.length,s.total);assert.deepEqual(s.scores,[0,0]);assert.deepEqual(restoreSocial(serializeSocial(s)),s);assert.throws(()=>action(s,'next'));}});
test('snapshot replay rejects impossible moves and malformed inputs',()=>{assert.equal(restoreSocial('broken'),null);assert.equal(restoreSocial('{}'),null);const raw=JSON.parse(serializeSocial(make()));raw.events=[{type:'guess',value:1}];assert.equal(restoreSocial(JSON.stringify(raw)),null);assert.throws(()=>createSocial('bad' as any,['А','Б'],1));assert.throws(()=>createSocial('scale',['','Б'],1));});
test('every game completes through ordinary legal actions and replays every intermediate state',()=>{
 for(const g of socialGames){let s=make(g.id);const step=(type:string,extra:any={})=>{s=action(s,type,extra);assert.deepEqual(restoreSocial(serializeSocial(s)),s,g.id+' / '+type);};
 for(let round=0;round<s.total;round++){const now=round*100000;
 switch(g.id){case'scale':step('reveal');step('hide');step('reveal');step('guess',{value:socialCard(s).target});break;
 case'truths':step('reveal');step('setLie',{value:2});step('reveal');step('guess',{value:2});break;
 case'taboo':step('reveal');step('start',{now});step('judge',{value:'success',now:now+1000});break;
 case'sprint':step('start',{now});step('judge',{value:'success',now:now+1000});break;
 case'ban':step('start',{now});step('question',{now:now+1000});assert.equal(s.endsAt,now+60000);step('tick',{now:now+60000});break;
 default:step('start');step('done',{value:0});
 }assert.equal(s.phase,'result');assert.equal(s.results.length,round+1);step('next');}
 assert.equal(s.phase,'finished');assert.equal(s.results.filter(r=>r.skipped).length,0);
 }
});
test('restore rejects absent seed, nonprimitive event values and unknown actions at expiry',()=>{
 const raw=JSON.parse(serializeSocial(make()));delete raw.seed;assert.equal(restoreSocial(JSON.stringify(raw)),null);
 const s=action(make('ban'),'start',{now:0});assert.throws(()=>action(s,'unknown',{now:60001}));assert.throws(()=>action(s,'question',{value:{a:1},now:1}));
});

test('taboo word stays private through the verdict stage and becomes public after scoring',()=>{let s=action(make('taboo'),'reveal');assert.equal(socialPrivateOwner(s),0);s=action(s,'start',{now:0});s=action(s,'tick',{now:60000});assert.equal(s.phase,'judge');assert.equal(socialPrivateOwner(s),0);s=action(s,'judge',{value:'miss'});assert.equal(socialPrivateOwner(s),null);});
test('a self-reported verdict at the timer boundary resolves once without a second click',()=>{for(const kind of ['sprint','taboo'] as const){let s=make(kind);if(kind==='taboo')s=action(s,'reveal');s=action(s,'start',{now:0});s=action(s,'judge',{value:'success',now:70000});assert.equal(s.phase,'result');assert.equal(s.scores[0],1);assert.equal(s.results.length,1);assert.deepEqual(restoreSocial(serializeSocial(s)),s);}});
