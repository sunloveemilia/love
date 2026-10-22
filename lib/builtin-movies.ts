import {movieLibrary} from './movie-library.ts';
import {eligibleMovie,type Data} from './engine.ts';
import {filtersFor,rejectedIds} from './movie-rules.ts';
export const builtinMovies=movieLibrary;
export function builtinMovie(id:number){const movie=builtinMovies.find(m=>m.id===id);if(!Number.isInteger(id)||!movie)throw new Error('Фильм не найден во встроенном каталоге');return structuredClone(movie);}
function normalized(s:string){return s.toLocaleLowerCase('ru-RU').replace(/ё/g,'е').replace(/[«»"'’.,:;!?()\-–—]/g,' ').replace(/\s+/g,' ').trim();}
function stableOrder(seed:string,id:number){let h=2166136261;for(const ch of seed+id){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
export function selectMovies(c:Data,input:Data={},archive:Data[]=[],pid?:string,forDeck=false){
 const filters=filtersFor(c,input),query=normalized(String(input.query||'').slice(0,120));
 const watched=new Set(archive.filter(e=>['watched','rewatch'].includes(e.status)).map(e=>e.movie.id)),rejected=rejectedIds(c,pid);
 const weight=(m:Data)=>m.genres.reduce((n:number,g:Data)=>n+(filters.weights[g.id]||0),0);
 const pool=builtinMovies.filter(m=>eligibleMovie(m,filters)&&!watched.has(m.id)&&!rejected.has(m.id)&&(!filters.minRating||Number(m.rating?.value)>=filters.minRating)&&(!query||normalized(m.title+' '+m.original_title).includes(query)));
 pool.sort((a,b)=>{
  if(input.sort==='rating.desc'||input.sort==='vote_average.desc')return (Number(b.rating?.value)||0)-(Number(a.rating?.value)||0)||(Number(b.rating?.votes)||0)-(Number(a.rating?.votes)||0)||a.id-b.id;
  if(input.sort==='primary_release_date.desc')return b.release_date.localeCompare(a.release_date)||a.id-b.id;
  if(input.sort==='primary_release_date.asc')return a.release_date.localeCompare(b.release_date)||a.id-b.id;
  if(input.sort==='surprise'||input.sort==='popularity.asc')return stableOrder(c.id||'TWO',a.id)-stableOrder(c.id||'TWO',b.id);
  return weight(b)-weight(a)||stableOrder(c.id||'TWO',a.id)-stableOrder(c.id||'TWO',b.id);
 });
 const size=forDeck?12:18,totalPages=Math.ceil(pool.length/size);
 const page=forDeck?1:Math.max(1,Math.min(Math.max(1,totalPages),Math.floor(Number(input.page)||1)));
 return {movies:structuredClone(pool.slice((page-1)*size,page*size)),filters,page,totalPages,totalResults:pool.length,source:'TWO',librarySize:builtinMovies.length};
}
