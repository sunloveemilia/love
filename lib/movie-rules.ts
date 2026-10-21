import type {Data} from './engine.ts';
export function cinemaGeneration(c:Data){return JSON.stringify({id:c.id,date:c.date,prefs:c.prefs});}
export function rejectedIds(c:Data,pid?:string){const votes=['prefs','voting'].includes(c.stage)?(pid&&c.votes[pid]?[c.votes[pid]]:[]):Object.values(c.votes||{});return new Set(votes.flatMap((v:any)=>Object.keys(v).filter(id=>v[id]===0).map(Number)));}
export function filtersFor(c:Data,input:Data={}):Data{
 const prefs=Object.values(c.prefs) as number[][];const min=Math.max(60,Math.min(150,Number(input.min)||90));const max=Math.min(180,Number(input.max)||150,prefs.some(v=>v[4]===1)?120:180);if(min>max)throw new Error('Диапазон продолжительности противоречит киноанкете. Уменьшите минимальную длительность.');
 const allowed=[35,18,9648,878,10749,14,53,16,27];const mood=[35,18,9648,878];const chosen=input.genre?Number(input.genre):0;const excludedGenres=[28,...(input.horror===true?[]:[27])];
 if(prefs.some(v=>v[1]===2))excludedGenres.push(10749);if(prefs.some(v=>v[6]===2))excludedGenres.push(9648);if(prefs.length&&prefs.every(v=>v[2]===2))excludedGenres.push(53);
 const weights:Record<number,number>={};const boost=(id:number,n=1)=>{weights[id]=(weights[id]||0)+n;};for(const p of prefs){boost(mood[p[0]],3);if(p[1]===0)boost(10749,2);if(p[2]===0)boost(9648);if(p[3]===0)boost(35,2);if(p[3]===1)boost(18,2);if(p[6]===0)boost(9648,2);if(p[7]===0)boost(35);}
 const genres=Object.keys(weights).map(Number).filter(g=>!excludedGenres.includes(g));let releaseMin='',releaseMax='';if(prefs.length===2&&prefs.every(p=>p[5]===0))releaseMin='2000-01-01';if(prefs.length===2&&prefs.every(p=>p[5]===1))releaseMax='1999-12-31';
 return {min,max,date:c.date,horror:input.horror===true,genre:allowed.includes(chosen)?chosen:0,genres,weights,excludedGenres,releaseMin,releaseMax,year:Number(input.year)||0,sort:['popularity.desc','vote_average.desc','primary_release_date.desc','popularity.asc'].includes(input.sort)?input.sort:'popularity.desc',region:['BY','RU','US','KZ'].includes(input.region)?input.region:'BY'};
}
