import test from 'node:test';
import assert from 'node:assert/strict';
import {createDots,drawEdge,createMemory,flipMemory,closeMemory,createGolf,shootGolf,stepGolf,nextGolf,golfCourses,restoreBoard} from '../lib/nearby-boards.ts';

test('dots duplicate edge is inert and closing a box scores and retains turn',()=>{
 const s=createDots(); drawEdge(s,'h',0);drawEdge(s,'v',0);drawEdge(s,'h',5);
 const turn=s.turn;drawEdge(s,'h',5);assert.equal(s.turn,turn);
 drawEdge(s,'v',1);assert.equal(s.cells[0],turn);assert.equal(s.scores[turn],1);assert.equal(s.turn,turn);
});
test('dots shared edge can claim two boxes and a full board totals twenty',()=>{
 const s=createDots();for(const [a,i] of [['h',0],['h',1],['h',5],['h',6],['v',0],['v',2]] as const)drawEdge(s,a,i);
 const turn=s.turn;drawEdge(s,'v',1);assert.equal(s.scores[turn],2);assert.equal(s.turn,turn);
 for(let i=0;i<25;i++)drawEdge(s,'h',i);for(let i=0;i<24;i++)drawEdge(s,'v',i);
 assert.equal(s.phase,'finished');assert.equal(s.scores[0]+s.scores[1],20);
 const end=JSON.stringify(s);drawEdge(s,'h',1);assert.equal(JSON.stringify(s),end);
});
test('memory mismatches stay visible until acknowledgement and change player once',()=>{
 const s=createMemory(7);const a=0,b=s.deck.findIndex(x=>x!==s.deck[a]);flipMemory(s,a);flipMemory(s,a);assert.deepEqual(s.open,[a]);flipMemory(s,b);
 assert.equal(s.phase,'peek');assert.equal(s.attempts,1);flipMemory(s,3);assert.equal(s.open.length,2);
 closeMemory(s);assert.equal(s.turn,1);assert.equal(s.open.length,0);closeMemory(s);assert.equal(s.turn,1);
});
test('memory pairs are deterministic and finish cooperatively after ten attempts',()=>{
 const s=createMemory(11);assert.deepEqual(s.deck,createMemory(11).deck);assert.equal(new Set(s.deck).size,10);
 for(let v=0;v<10;v++){const a=s.deck.indexOf(v),b=s.deck.lastIndexOf(v);flipMemory(s,a);flipMemory(s,b);}
 assert.equal(s.phase,'finished');assert.equal(s.attempts,10);assert.equal(s.matched.filter(Boolean).length,20);
});
test('golf refuses a second moving shot and bounces within course walls',()=>{
 const s=createGolf();assert.equal(shootGolf(s,180,100),true);assert.equal(shootGolf(s,180,100),false);
 for(let i=0;i<1000&&s.moving;i++)stepGolf(s,.016);
 assert.equal(s.moving,false);assert.equal(s.turn,1);assert.equal(s.shots[0],1);assert.ok(s.balls[0].x>=18&&s.balls[0].x<=782);
});
test('golf captures slow balls and moves to the next course only after both finish',()=>{
 const s=createGolf();for(let player=0;player<2;player++){
 const hole=golfCourses[s.course].hole;s.balls[player]={x:hole.x-18,y:hole.y,vx:0,vy:0};assert.equal(shootGolf(s,0,12),true);
 for(let i=0;i<1000&&s.moving;i++)stepGolf(s,.016);
 assert.equal(s.done[player],true);
 }
 assert.equal(s.phase,'holeDone');assert.deepEqual(s.totals,[1,1]);nextGolf(s);assert.equal(s.course,1);assert.deepEqual(s.shots,[0,0]);assert.equal(s.turn,1);
});
test('golf stops at eight strokes per player and finishes after three courses',()=>{
 const s=createGolf();for(let course=0;course<3;course++){
 s.shots=[7,8];s.done=[false,true];s.turn=0;s.balls[0]={x:90,y:360,vx:0,vy:0};shootGolf(s,180,5);
 for(let i=0;i<2000&&s.moving;i++)stepGolf(s,.016);
 assert.equal(s.phase,course===2?'finished':'holeDone');assert.equal(s.totals[0],8*(course+1));if(course<2)nextGolf(s);
 }
});
test('snapshot restore round trips every game and rejects invalid arrays and numbers',()=>{
 for(const s of [createDots(),createMemory(5),createGolf()])assert.deepEqual(restoreBoard(JSON.stringify(s)),s);
 const dots=createDots();dots.h[0]=9;assert.equal(restoreBoard(JSON.stringify(dots)),null);
 const memory=createMemory(2);memory.deck.fill(1);assert.equal(restoreBoard(JSON.stringify(memory)),null);
 const golf=createGolf();golf.balls[0].x=Infinity;assert.equal(restoreBoard(JSON.stringify(golf)),null);
 assert.equal(restoreBoard('{}'),null);assert.equal(restoreBoard('broken'),null);
});

test('golf high-power shots bounce off interior walls without tunnelling',()=>{
 const s=createGolf();s.balls[0]={x:280,y:260,vx:0,vy:0};shootGolf(s,0,100);stepGolf(s,.25);
 assert.ok(s.balls[0].x<=291);assert.ok(s.balls[0].vx<0);assert.ok(Number.isFinite(s.balls[0].x));
});
test('golf can complete a whole match using only ordinary strokes and round advances',()=>{
 const s=createGolf();let strokes=0;while(s.phase!=='finished'&&strokes<50){
 if(s.phase==='holeDone'){nextGolf(s);continue;}assert.equal(shootGolf(s,180,1),true);strokes++;
 for(let n=0;s.moving&&n<2000;n++)stepGolf(s,1/60);
 assert.equal(s.moving,false);
 }
 assert.equal(s.phase,'finished');assert.equal(strokes,48);assert.deepEqual(s.totals,[24,24]);
});
test('restoring a moving golf ball preserves the counted shot and produces the same next turn',()=>{
 const s=createGolf();shootGolf(s,-30,80);stepGolf(s,.1);const copy=restoreBoard(JSON.stringify(s));assert.ok(copy&&copy.kind==='golf');
 for(let i=0;i<2000&&s.moving;i++){stepGolf(s,.016);stepGolf(copy,.016);}assert.deepEqual(copy,s);assert.deepEqual(copy.shots,[1,0]);
});
test('golf rejects absurd finite angles without corrupting the active ball',()=>{
 const s=createGolf(),before=JSON.stringify(s);assert.equal(shootGolf(s,1e308,80),false);assert.equal(JSON.stringify(s),before);
});
test('restoring golf rejects an already completed active player and a second moving ball',()=>{
 const s=createGolf();s.shots=[1,0];s.done=[true,false];assert.equal(restoreBoard(JSON.stringify(s)),null);
 const moving=createGolf();shootGolf(moving,0,50);moving.balls[1].vx=10;assert.equal(restoreBoard(JSON.stringify(moving)),null);
});
test('golf never permits a ninth stroke or restores a stopped exhausted player',()=>{
 const s=createGolf();s.shots[0]=8;assert.equal(restoreBoard(JSON.stringify(s)),null);assert.equal(shootGolf(s,0,50),false);assert.equal(s.shots[0],8);
});
