type D=Record<string,any>;
const clean=(value:unknown,max:number,optional=false)=>{if(optional&&(value===undefined||value===''))return '';if(typeof value!=='string'||!value.trim()&&!optional||typeof value==='string'&&value.trim().length>max)throw new Error(`Текст должен содержать ${optional?'не больше':'от 1 до'} ${max} символов`);return (value as string).trim();};
export function quoteAction(r:D,pid:string,b:D){
 const quotes:D[]=r.quotes||[];
 if(b.op==='quoteAdd'){
  if(typeof b.id!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(b.id))throw new Error('Обновите страницу и повторите сохранение');
  const text=clean(b.text,500),context=clean(b.context,200,true),speaker=b.speaker??null;
  if(speaker!==null&&!r.players.some((p:D)=>p.id===speaker))throw new Error('Выберите автора фразы из вашей комнаты');
  const existing=quotes.find(q=>q.id===b.id);if(existing){if(existing.from!==pid||existing.text!==text||existing.context!==context||existing.speaker!==speaker)throw new Error('Такая запись уже существует');return;}
  if(quotes.length>=200)throw new Error('В банке уже 200 историй. Удалите одну из своих записей, чтобы добавить новую.');
  r.quotes=[{id:b.id,from:pid,speaker,text,context,created:Date.now(),likedBy:[]},...quotes];
 }else{
  const q=quotes.find(q=>q.id===b.id);if(!q)throw new Error('Эта история уже удалена');
  if(b.op==='quoteDelete'){if(q.from!==pid)throw new Error('Удалить запись может только тот, кто её сохранил');r.quotes=quotes.filter(q=>q.id!==b.id);}
  else if(b.op==='quoteLike'){if(typeof b.liked!=='boolean')throw new Error('Неверная отметка');q.likedBy=b.liked?[...new Set([...q.likedBy,pid])]:q.likedBy.filter((id:string)=>id!==pid);}
  else throw new Error('Неизвестное действие');
 }
}
