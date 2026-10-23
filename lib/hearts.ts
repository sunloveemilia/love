type D=Record<string,any>;
const kinds=['miss','hug','proud'];
function incoming(r:D,pid:string){return Object.values(r.hearts||{}).find((h:any)=>h.to===pid) as D|undefined;}
export function heartAction(r:D,pid:string,b:D){
 if(r.players.length!==2)throw new Error('Сначала пригласите вашего человека');
 if(b.op==='heartSend'){
  if(typeof b.id!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(b.id)||!kinds.includes(b.kind))throw new Error('Обновите страницу и попробуйте снова');
  const previous=r.hearts?.[pid];if(previous?.id===b.id){if(previous.kind!==b.kind)throw new Error('Это сердечко уже отправлено');return;}
  const now=Date.now();if(previous&&now-previous.created<30000)throw new Error('Тепло уже в пути. Новое сердечко можно отправить через 30 секунд.');
  const reply=incoming(r,pid);if(b.replyTo!==undefined&&(!reply||reply.id!==b.replyTo))throw new Error('Появилось новое сердечко. Обновите экран.');
  const to=r.players.find((p:D)=>p.id!==pid).id;
  r.hearts??={};r.hearts[pid]={id:b.id,from:pid,to,kind:b.kind,created:now,readAt:null};
  if(b.replyTo&&reply)reply.readAt??=now;
 }else if(b.op==='heartRead'){
  const h=incoming(r,pid);if(!h||h.id!==b.id)throw new Error('Это сердечко уже изменилось');h.readAt??=Date.now();
 }else throw new Error('Неизвестное действие');
}
export function heartView(r:D,pid:string){const h=incoming(r,pid),outgoing=r.hearts?.[pid];return {incoming:h&&!h.readAt?structuredClone(h):null,outgoing:outgoing?structuredClone(outgoing):null,nextSendAt:outgoing?outgoing.created+30000:0};}
